<template>
    <el-row>
        <el-col :span="24">
            <el-form ref="form" :model="videoForm" label-width="100px" size="small">
                <el-form-item label="代理服务器:">
                    <el-input v-model="videoForm.socks5" placeholder="socks5://127.0.0.1:1086/" />
                </el-form-item>

                <el-form-item label="保存路径:">
                    <el-input v-model="videoForm.downloadSavePath" placeholder="默认为用户下载目录">
                        <tk-select-directory slot="append" v-model="videoForm.downloadSavePath" />
                    </el-input>
                </el-form-item>
                
                <el-form-item label="视频地址:">
                    <el-input v-model="videoForm.videoUrl" @blur="onSubmit('info')">
                        <el-button slot="append" v-loading.fullscreen.lock="isShowLoading" type="primary" plain icon="el-icon-search" @click="onSubmit('info')">获取视频信息</el-button>
                    </el-input>
                </el-form-item>

                
            </el-form>
        </el-col>

        <el-col :span="24">
            <el-card v-if="videoInfo.title" class="card-video-info">
                <div slot="header">
                    <span>{{ videoInfo.title }} </span>
                </div>
                
                <div class="main-info">
                    <div class="image-box">
                        <img :src="videoInfo.thumbnail" alt="">
                    </div>
                    <div class="description">
                        
                        <span> ID: <a :href="videoInfo.webpage_url">{{ videoInfo.id }}</a>  </span>
                        <span> 上传时间: {{ videoInfo.upload_date | dateDisplay }}  </span>
                        <span> 时长: {{ videoInfo.duration | duration }}  </span>
                        <br>
                        <span> 上传者: {{ videoInfo.uploader }} </span>
                        <br>
                        <span> 浏览量: {{ videoInfo.view_count | numberDisplay }} </span>
                        <span> 喜欢: {{ videoInfo.like_count | numberDisplay }} </span>
                        <span>不喜欢: {{ videoInfo.dislike_count | numberDisplay }} </span>
                        
                    </div>
                    
                    <div class="button-box">
                        <el-button type="primary" plain size="mini" @click="onSubmit('download_best', '')">下载最佳画质</el-button>
                        <el-button type="primary" plain size="mini" @click="onSubmit('download_bestaudio', '')">下载最佳音频</el-button>
                    </div>
                </div>

                <div v-if="false">
                    {{ videoInfo.description }}
                </div>

                <el-table :data="videoFormatList" :show-header="true" size="mini" border stripe>
                    <el-table-column prop="ext" label="格式" width="190">
                        <template slot-scope="scope">
                            <span v-if="scope.row.vcodec === 'none' ">{{ scope.row.ext }} - {{ scope.row.format_note }}</span>
                            <span v-if="scope.row.vcodec !== 'none' ">{{ scope.row.format_note }} ({{ scope.row.width }}x{{ scope.row.height }}) .{{ scope.row.ext }}</span>
                        </template>
                    </el-table-column>

                    <el-table-column prop="filesize" label="文件大小" sortable width="100">
                        <template slot-scope="scope">
                            <span v-if="scope.row.vcodec === 'none' ">{{ scope.row.filesize | sizeDisplay }} </span>
                            <span v-if="scope.row.vcodec !== 'none' "> {{ scope.row.filesize | sizeDisplay }} </span>
                        </template>
                    </el-table-column>

                    <el-table-column prop="format_id" label="ID" width="50"></el-table-column>
                    
                    <el-table-column prop="ext" label="是否下载" width="80">
                        <template slot-scope="scope">
                            <el-tag v-if="videoDownloadLogsObject[scope.row.format_id]" type="success">已下载</el-tag>
                            <el-tag v-if="!videoDownloadLogsObject[scope.row.format_id]" type="warning">未下载</el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column prop="ext" label="操作" width="80">
                        <template slot-scope="scope">
                            <el-button type="primary" plain size="mini" @click="onSubmit('download', scope.row)">下载</el-button>
                        </template>
                    </el-table-column>
                    
                    <el-table-column prop="acodec" label="其他信息">
                        <template slot-scope="scope">
                            <span v-if="scope.row.vcodec !== 'none' ">Video codec: {{ scope.row.vcodec }}
                                <span v-show="scope.row.tbr">({{ scope.row.tbr }} Kbps) </span> <span v-show="scope.row.vbr">({{ scope.row.vbr }} Kbps) </span>
                                <span v-if="scope.row.acodec !== 'none' "> - </span>
                            </span>
                            <span v-if="scope.row.acodec !== 'none' ">  Audio codec: {{ scope.row.acodec }} <span v-show="scope.row.abr">({{ scope.row.abr }} Kbps)</span></span>
                        </template>
                    </el-table-column>
                    
                </el-table>
                
            </el-card>
            
            <div>
                <h4>下载日志 :</h4>
                <br> {{ downloadLog }}
            </div>
    
            <div>
                <h4>下载错误日志 :</h4>
                <br> {{ downloadError }}
            </div>
    
            <div>
                <h4>视频信息 :</h4>
                <pre> <code>
                     {{ videoInfo }}
                </code> </pre>
            </div>
            
        </el-col>
    </el-row>
</template>

<script>

    
import { notifyDuration } from '../../utils/constant'
import { appPath } from '../../utils/appConfig'
import { userConfig } from '../../utils/fileSaveStore'

import { downloadVideo, getVideoInfo } from '../../services/youtube/youtube-dl'
import { httpErrorHandler } from '../../services/httpErrorHandler'
import { DBVideos, DBVideoDownloadLogs } from '../../database/index'


import SelectDirectory from '../../components/native/SelectDirectory'

export default {
    components: {
        [SelectDirectory.name]: SelectDirectory,
    },
    props: {
        isCreate: {
            type: Boolean,
            required: false,
            default: true,
        },
    },
    
    data () {
        return {
            isShowLoading: false,
            
            downloadLog: [],
            downloadError: [],
            currentVideoId: [],
            
            videoForm: {
                videoUrl: '',
                videoTitle: '',
                socks5: userConfig.get('proxyAddress') || 'socks5://127.0.0.1:1086',
                downloadSavePath: userConfig.get('savePath') || appPath.downloads,
            },
            
            youtubeDlOptions: {
                networkOptions: {
                    '--proxy': '',
                },

                videoFormatOptions: {
                    '--format': 'bestvideo+bestaudio/best',
                },
            },

            videoFormatList: [],
            videoInfo: {},
            
            videoDownloadLogsObject: {},
            
            bestVideoFormatInfo: {},
            bestAudioFormatInfo: {},
            bestVideoIdAndAudioId: '',
            bestVideoId: '',
            bestAudioId: '',
        }
    },
    created: function () {
        // `this` points to the vm instance

        if (!this.isCreate) {
            if (this.$route.params && this.$route.params.videoId) {
                this.currentVideoId = this.$route.params.videoId
                console.log('Current VideoId: ', this.currentVideoId)
                
                DBVideos.findOne({
                    _id: 'youtube_' + this.$route.params.videoId,
                }).then((doc) => {
                    console.log('Fetch Edited DBVideos doc: ', doc)
                    
                    if (doc && doc.displayId) {
                        this.videoInfo = JSON.parse(doc.jsonInfo)
                        this.getBestId(this.videoInfo)
                        this.getSortFormatList(this.videoInfo.formats)
                        this.getIsDownloadLogs(this.$route.params.videoId)
                        console.log('Fetch Edited videoInfo doc: ', this.videoInfo)
                        this.videoForm.videoUrl = doc.webPageUrl
                    }
                }).catch(httpErrorHandler)
            }
        }
    },
    
    
    methods: {
        getIsDownloadLogs (videoId) {
            videoId = videoId || this.videoForm.videoId
            DBVideoDownloadLogs.find({
                youtubeId: videoId,
            }).then((result) => {
                if (Array.isArray(result)) {
                    result.forEach((item) => {
                        this.$set(this.videoDownloadLogsObject, item.formatId, item.isDownload)
                    })
                }

                console.log('VideoDownloadLogsObject: ', this.videoDownloadLogsObject)
            }).catch(httpErrorHandler)
        },
        
        
        onSubmit (type, formatData) {
            console.log('VideoForm: ', this.videoForm)

            if (!this.GIsValidUrl(this.videoForm.videoUrl)) {
                return this.$notify.error({
                    title: '请输入正确的网址!',
                    message: '',
                    duration: notifyDuration,
                })
            }


            if (type === 'download_best') {
                formatData = this.bestVideoFormatInfo
                formatData.format_id = this.bestVideoId
                formatData.bestVideoIdAndAudioId = this.bestVideoIdAndAudioId
            }

            if (type === 'download_bestaudio') {
                formatData = this.bestAudioFormatInfo
                formatData.format_id = this.bestAudioId
            }

            console.log('VideoFormatData: ', formatData)
            
            this.isShowLoading = true
            
            const tempVideoIdIndex = this.videoForm.videoUrl.indexOf('?v=')
            const tempVideoId = this.videoForm.videoUrl.substr(tempVideoIdIndex + 3, 11)
            this.videoForm.videoId = 'youtube_' + tempVideoId
            const savePath = this.videoForm.downloadSavePath + '/' + tempVideoId

            if (this.videoForm.socks5) {
                this.youtubeDlOptions.networkOptions['--proxy'] = this.videoForm.socks5
            }
            console.log('VideoId: ', tempVideoId, tempVideoIdIndex, this.youtubeDlOptions.videoFormatOptions)
            
            if (type === 'download' || type === 'download_best' || type === 'download_bestaudio') {
                let targetPath = savePath
                if (formatData.format_id) {
                    if (type === 'download_best') {
                        this.youtubeDlOptions.videoFormatOptions['--format'] = formatData.bestVideoIdAndAudioId
                        targetPath = savePath + '/' + formatData.bestVideoIdAndAudioId
                    } else {
                        this.youtubeDlOptions.videoFormatOptions['--format'] = formatData.format_id
                        targetPath = savePath + '/' + formatData.format_id
                    }
                }
                
                downloadVideo(this.videoForm.videoUrl, targetPath, this.youtubeDlOptions).then((result) => {
                    this.downloadLog = result.message
                    this.downloadError = result.error
                    this.isShowLoading = false
                    console.log('Download youtube result: ', result)

                    if (result.code === 0) {
                        DBVideoDownloadLogs.insert({
                            _id: 'youtube_' + tempVideoId + '_' + formatData.format_id,
                            youtubeId: tempVideoId,
                            webPageUrl: this.videoInfo.webpage_url,
                            title: this.videoInfo.title,
                            formatId: formatData.format_id,
                            bestVideoIdAndAudioId: formatData.bestVideoIdAndAudioId,
                            formatNote: formatData.format_note,
                            format: formatData.format,
                            ext: formatData.ext,
                            container: formatData.container,
                            width: formatData.width,
                            height: formatData.height,
                            vcodec: formatData.vcodec,
                            acodec: formatData.acodec,
                            fileSize: formatData.filesize,
                            resolution: formatData.resolution || '',
                            tbr: formatData.tbr,
                            vbr: formatData.vbr,
                            abr: formatData.abr,
                            protocol: formatData.protocol,
                            url: formatData.url,
                            jsonInfo: JSON.stringify(formatData),
                            createTime: new Date().toJSON(),
                            isDownload: true,
                        }).then((doc) => {
                            console.log('Download youtube Doc Saved: ', doc)
                            this.getIsDownloadLogs(tempVideoId)
                            this.$notify.success({
                                title: '操作成功!',
                                message: '',
                                duration: notifyDuration,
                            })
                        }).catch(httpErrorHandler)
                    } else {
                        this.$notify.error({
                            title: '下载youtube视频失败!',
                            message: '请检查网络或代理设置!',
                            duration: notifyDuration,
                        })
                    }
                }).catch(httpErrorHandler)
            }
            

            if (type === 'info') {
                DBVideos.findOne({
                    _id: 'youtube_' + tempVideoId,
                }).then((doc) => {
                    if (doc && doc.displayId) {
                        this.videoInfo = JSON.parse(doc.jsonInfo)
                        this.getBestId(this.videoInfo)
                        this.getSortFormatList(this.videoInfo.formats)
                        this.getIsDownloadLogs(tempVideoId)
                        this.isShowLoading = false
                    } else {
                        getVideoInfo(this.videoForm.videoUrl, savePath, this.youtubeDlOptions).then((result) => {
                            this.videoInfo = result.message
                            this.downloadError = result.error
                            this.isShowLoading = false
                            
                            if (result.code === 0 && result.message && result.message.title) {
                                this.getBestId(this.videoInfo)
                                this.getSortFormatList(this.videoInfo.formats)
                                this.getIsDownloadLogs(tempVideoId)
                                
                                DBVideos.insert({
                                    _id: 'youtube_' + tempVideoId,
                                    youtubeId: tempVideoId,
                                    url: this.videoForm.videoUrl,
                                    title: result.message.title,
                                    fullTitle: result.message.fulltitle,
                                    displayId: result.message.display_id,
                                    duration: result.message.duration,
                                    thumbnail: result.message.thumbnail,
                                    webPageUrl: result.message.webpage_url,
                                    uploadDate: result.message.upload_date,
                                    uploader: result.message.uploader,
                                    uploaderId: result.message.uploader_id,
                                    uploaderUrl: result.message.uploader_url,
                                    channelId: result.message.channel_id,
                                    channelUrl: result.message.channel_url,
                                    categories: result.message.categories,
                                    tags: result.message.tags,
                                    description: result.message.description,
                                    dislikeCount: result.message.dislike_count,
                                    likeCount: result.message.like_count,
                                    viewCount: result.message.view_count,
                                    jsonInfo: JSON.stringify(result.message),
                                    createTime: new Date().toJSON(),
                                }).then((doc) => {
                                    console.log('Video info Doc Saved: ', doc)
                                }).catch(httpErrorHandler)
                            } else {
                                this.$notify.error({
                                    title: '获取youtube视频信息失败!',
                                    message: '',
                                    duration: notifyDuration,
                                })
                            }
                        }).catch(httpErrorHandler)
                    }
                }).catch(httpErrorHandler)
            }
        },
        
        onReset () {
            /* Reset our form values */
            this.videoForm.videoUrl = ''
            this.videoForm.videoTitle = null
            this.downloadLog = []
            this.downloadError = []
        },

        
        getSortFormatList (videoFormatList = []) {
            const tempAudio = []
            const tempVideo = []
            const tempVideoWithAudio = []
            
            if (Array.isArray(videoFormatList)) {
                videoFormatList.forEach((format) => {
                    if (format.vcodec === 'none') {
                        tempAudio.push(format)
                    } else if (format.acodec === 'none') {
                        tempVideo.push(format)
                    } else {
                        tempVideoWithAudio.push(format)
                    }

                    if (format.format_id === this.bestVideoId) {
                        this.bestVideoFormatInfo = format
                    }

                    if (format.format_id === this.bestAudioId) {
                        this.bestAudioFormatInfo = format
                    }
                })

                const sortByFilenameAndSize = function (a, b) {
                    if (a.ext === b.ext) {
                        if (a.filesize === b.filesize) {
                            return 0
                        }
                        return a.filesize < b.filesize ? 1 : -1
                    }
                    return a.ext < b.ext ? -1 : 1
                }
                
                tempAudio.sort(sortByFilenameAndSize)
                tempVideo.sort(sortByFilenameAndSize)

                tempVideoWithAudio.sort((a, b) => {
                    if (typeof b.filesize === 'undefined') {
                        return 1
                    }

                    if (a.ext === b.ext) {
                        if (a.filesize === b.filesize) {
                            return 0
                        }
                        return a.filesize < b.filesize ? 1 : -1
                    }
                    return a.ext < b.ext ? 1 : -1
                })
                
                
                if (this.bestVideoIdAndAudioId.indexOf('+') === -1) {
                    this.bestAudioFormatInfo = tempAudio[0]
                    this.bestAudioId = tempAudio[0].format_id
                }
                
                this.videoFormatList = [...tempVideoWithAudio, ...tempVideo, ...tempAudio]
            }
        },


        getBestId (videoInfo) {
            let tempIdArray = []

            if (videoInfo.format_id && videoInfo.format_id.indexOf('+') > -1) {
                tempIdArray = videoInfo.format_id.split('+')

                this.bestVideoId = tempIdArray[0]
                this.bestAudioId = tempIdArray[1]
                this.bestVideoIdAndAudioId = videoInfo.format_id
            } else {
                this.bestVideoId = videoInfo.format_id
                this.bestVideoIdAndAudioId = videoInfo.format_id
            }
        },
    },
    
    
    
}
</script>
