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
    
                <el-button type="primary" size="small" @click="onSubmit('download')">下载视频</el-button>
                <el-button type="primary" size="small" @click="onReset">重置</el-button>
                
            </el-form>
        </el-col>

        <el-col :span="24" class="mt-20">
            <el-card class="card-video-info">
                <div slot="header">
                    <span>{{ videoInfo.title }} ({{ videoInfo.duration | duration }}) </span>
                </div>
                <div class="main-info">
                    <div class="image-box">
                        <img :src="videoInfo.thumbnail" alt="">
                    </div>
                    <div class="description">
                        <span> ID: <a :href="videoInfo.webpage_url">{{ videoInfo.id }}</a>  </span>
                        <span> 上传时间: {{ videoInfo.upload_date | dateDisplay }}  </span>
                        <br>
                        <span> 浏览量: {{ videoInfo.view_count | numberDisplay }} </span>
                        <span> 喜欢: {{ videoInfo.like_count | numberDisplay }} </span>
                        <span>不喜欢: {{ videoInfo.dislike_count | numberDisplay }} </span>
                    </div>
                </div>

                <div v-if="false">
                    {{ videoInfo.description }}
                </div>
                
                <div v-for="(format, index) in videoFormatList" :key="index" class="format-info">
                    
                    <div v-show="format.vcodec === 'none' ">
                        <span> Audio {{ format.ext }}: {{ format.filesize | sizeDisplay }}</span>
                        <span> (Audio codec: {{ format.acodec }}<span v-show="format.abr">, {{ format.abr }} Kbps</span>)</span>
                    </div>
                    
                    <div v-show="format.vcodec !== 'none' ">
                        <span> Video {{ format.ext }}  {{ format.width }}x{{ format.height }} : {{ format.filesize | sizeDisplay }} (Video codec: {{ format.vcodec }}<span v-show="format.vbr">, {{ format.vbr }} Kbps</span>) </span>
                        <span v-show="format.acodec !== 'none' "> - (Audio codec: {{ format.acodec }}<span v-show="format.abr">, {{ format.abr }} Kbps</span>) </span>
                    </div>
                </div>
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
            this.isShowLoading = true
            
            const tempVideoIdIndex = this.formData.videoUrl.indexOf('?v=')
            
            const tempVideoId = this.formData.videoUrl.substr(tempVideoIdIndex + 3, 11)

            console.log(tempVideoIdIndex, tempVideoId)
            
            if (this.formData.videoUrl) {
                db.videos.put({
                    _id: tempVideoId,
                    title: '',
                    url: this.formData.videoUrl,
                }).then(function (info) {
                    console.log(info)
                })
            }
           
            
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
