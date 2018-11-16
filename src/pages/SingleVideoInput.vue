<template>
    <div>
        <el-form ref="form" :model="formData" label-width="100px">
            <el-form-item label="视频地址:">
                <el-input v-model="formData.videoUrl" />
            </el-form-item>

            <el-form-item label="视频标题:">
                <el-input v-model="formData.videoTitle" />
            </el-form-item>

            <el-form-item label="代理服务器:">
                <el-input v-model="formData.socks5" placeholder="socks5://127.0.0.1:1086/" />
            </el-form-item>

            <el-button type="primary" @click="onSubmit">下载视频</el-button>
            <el-button type="primary" @click="onReset">重置</el-button>
            
        </el-form>
    
        
        <div>
            <h4>下载日志 :</h4>
            <br> {{ downloadLog }}
        </div>

        <div>
            <h4>下载错误日志 :</h4>
            <br> {{ downloadError }}
        </div>
    </div>
</template>

<script>
    
import { downloadVideo } from '../services/youtube/youtube-dl'
import db from '../database/index'

export default {
    data () {
        return {
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
        }
    },
    created: function () {
        // `this` points to the vm instance
        console.log('Vue Component created: ')
        db.videos.allDocs({ include_docs: true }).then(function (info) {
            console.log(info)
        })
    },
    
    methods: {
        onSubmit () {
            console.log('formData: ', this.formData)
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
           
            
            downloadVideo(this.formData.videoUrl, this.downloadSavePath + '/' + tempVideoId, this.youtubeDlOptions).then((result) => {
                this.downloadLog = result.message
                this.downloadError = result.error
                console.log('result: ', result)
            })
        },
        
        onReset () {
            /* Reset our form values */
            this.formData.videoUrl = ''
            this.formData.videoTitle = null
            this.downloadLog = []
            this.downloadError = []
        },
    },
}
</script>
