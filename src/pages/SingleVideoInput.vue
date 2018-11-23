<template>
    <el-row>
        <el-col :span="24">
            
            <el-form ref="form" :model="formData" label-width="100px">
                <el-form-item label="代理服务器:">
                    <el-input v-model="formData.socks5" placeholder="socks5://127.0.0.1:1086/" />
                </el-form-item>
                
                <el-form-item label="视频地址:" class="form-one-line-multi">
                    <el-input v-model="formData.videoUrl" />
                    <el-button v-loading.fullscreen.lock="isShowLoading" class="ml-20" type="primary" plain size="small" @click="onSubmit('info')">获取视频信息</el-button>
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
                </div>

                <div v-if="false">
                    {{ videoInfo.description }}
                </div>

                <el-table :data="videoFormatList" :show-header="true" size="mini" border stripe>
                    <el-table-column prop="ext" label="格式" width="220">
                        <template slot-scope="scope">
                            <span v-if="scope.row.vcodec === 'none' ">Audio {{ scope.row.ext }} - {{ scope.row.format_note }}</span>
                            <span v-if="scope.row.vcodec !== 'none' ">Video {{ scope.row.format_note }} ({{ scope.row.width }}x{{ scope.row.height }}) .{{ scope.row.ext }}</span>
                        </template>
                    </el-table-column>

                    <el-table-column prop="filesize" label="文件大小" sortable width="120">
                        <template slot-scope="scope">
                            <span v-if="scope.row.vcodec === 'none' ">{{ scope.row.filesize | sizeDisplay }} </span>
                            <span v-if="scope.row.vcodec !== 'none' "> {{ scope.row.filesize | sizeDisplay }} </span>
                        </template>
                    </el-table-column>

                    <el-table-column prop="ext" label="操作" width="80">
                        <template slot-scope="scope">
                            <el-button type="primary" plain size="mini" @click="onSubmit('download')">下载</el-button>
                        </template>
                    </el-table-column>
                    
                    <el-table-column prop="acodec" label="其他信息">
                        <template slot-scope="scope">
                            <span v-if="scope.row.vcodec !== 'none' ">Video codec: {{ scope.row.vcodec }} <span v-show="scope.row.tbr">({{ scope.row.tbr }} Kbps) </span> <span v-show="scope.row.vbr">({{ scope.row.vbr }} Kbps) </span></span>
                            <span v-if="scope.row.acodec !== 'none' "> - Audio codec: {{ scope.row.acodec }} <span v-show="scope.row.abr">({{ scope.row.abr }} Kbps)</span></span>
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
    
import { downloadVideo, getVideoInfo } from '../services/youtube/youtube-dl'
import db from '../database/index'

export default {
    data () {
        return {
            isShowLoading: false,
            
            downloadLog: [],
            downloadError: [],
            
            downloadSavePath: 'download/youtube',
            
            formData: {
                videoUrl: '',
                videoTitle: '',
                socks5: '',
            },
            
            youtubeDlOptions: {
                networkOptions: {
                    '--proxy': 'socks5://127.0.0.1:1086/',
                },
            },

            videoFormatList: [],
            videoInfo: {},
            
        }
    },
    created: function () {
        // `this` points to the vm instance
        console.log('Vue Component created: ')
        db.videos.allDocs({ include_docs: true }).then(function (info) {
            console.log(info)
        })

        this.getSortFormatList(this.videoInfo.formats)
    },
    
    methods: {
        onSubmit (type) {
            console.log('formData: ', this.formData)
            
            if (!this.GIsValidUrl(this.formData.videoUrl)) {
                return
            }
            
            this.isShowLoading = true
            
            const tempVideoIdIndex = this.formData.videoUrl.indexOf('?v=')
            const tempVideoId = this.formData.videoUrl.substr(tempVideoIdIndex + 3, 11)

            console.log(tempVideoIdIndex, tempVideoId)

            db.videos.put({
                _id: tempVideoId,
                title: '',
                url: this.formData.videoUrl,
            }).then(function (info) {
                console.log(info)
            })
           
            
            if (type === 'download') {
                downloadVideo(this.formData.videoUrl, this.downloadSavePath + '/' + tempVideoId, this.youtubeDlOptions).then((result) => {
                    this.downloadLog = result.message
                    this.downloadError = result.error
                    console.log('result: ', result)
                })
            } else {
                getVideoInfo(this.formData.videoUrl, this.downloadSavePath + '/' + tempVideoId, this.youtubeDlOptions).then((result) => {
                    this.videoInfo = result.message
                    this.downloadError = result.error
                    this.isShowLoading = false
                    console.log(this.videoInfo)
                    this.getSortFormatList(this.videoInfo.formats)
                })
            }
        },
        
        onReset () {
            /* Reset our form values */
            this.formData.videoUrl = ''
            this.formData.videoTitle = null
            this.downloadLog = []
            this.downloadError = []
        },

        getSortFormatList (videoFormatList = []) {
            const tempAudio = []
            const tempVideo = []
            
            if (Array.isArray(videoFormatList)) {
                videoFormatList.forEach((format) => {
                    if (format.vcodec === 'none') {
                        tempAudio.push(format)
                    } else {
                        tempVideo.push(format)
                    }
                })

                tempAudio.sort((a, b) => {
                    if (a.ext === b.ext) {
                        if (a.filesize === b.filesize) {
                            return 0
                        }
                        return a.filesize < b.filesize ? 1 : -1
                    }
                    return a.ext < b.ext ? 1 : -1
                })

                tempVideo.sort((a, b) => {
                    if (a.ext === b.ext) {
                        if (a.filesize === b.filesize) {
                            return 0
                        }
                        return a.filesize < b.filesize ? 1 : -1
                    }
                    return a.ext < b.ext ? 1 : -1
                })
                
                this.videoFormatList = [...tempVideo, ...tempAudio]
            }
        },
    },
}
</script>
