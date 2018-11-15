<template>
    <div>
        <b-form @submit="onSubmit" @reset="onReset" novalidate>
            <b-form-group horizontal :label-cols="1" label="视频地址:">
                <b-form-input type="text" v-model="formData.videoUrl" required placeholder=""></b-form-input>
            </b-form-group>
            
            <b-form-group horizontal :label-cols="1" label="视频标题:">
                <b-form-input type="text" v-model="formData.videoTitle" placeholder=""></b-form-input>
            </b-form-group>

            <b-form-group horizontal :label-cols="1" label="代理服务器:"  >
                <b-form-input type="text" v-model="formData.socks5" placeholder="socks5://127.0.0.1:1086/"></b-form-input>
            </b-form-group>
            
            <b-button type="submit" variant="primary">下载视频</b-button>
        </b-form>
        
        
        <div> 
            <h4>下载日志 :</h4> 
            <br> {{downloadLog}}
        </div>

        <div> 
            <h4>下载错误日志 :</h4>
            <br> {{downloadError}}
        </div>
    </div>
</template>

<script>
    
import { downloadVideo } from '../services/youtube/youtube-dl'

export default {
    data () {
        return {
            downloadLog: [],
            downloadError: [],
            downloadSavePath: 'download/youtube',
            formData: {
                videoUrl: '',
                videoTitle: '',
                socks5: ''
            },
            youtubeDlOptions : {
                networkOptions : {
                    '--proxy' : 'socks5://127.0.0.1:1086/'
                }
            }
        }
    },
    methods: {
        onSubmit (evt) {
            evt.preventDefault();

            console.log("formData:", this.formData)
            const tempVideoIdIndex = this.formData.videoUrl.indexOf('?v=');
            
            const tempVideoId = this.formData.videoUrl.substr(tempVideoIdIndex+3, 11)

            console.log(tempVideoIdIndex, tempVideoId)
            
            downloadVideo(this.formData.videoUrl, this.downloadSavePath + '/' + tempVideoId, this.youtubeDlOptions).then( (result) => {
                this.downloadLog = result.message;
                this.downloadError = result.error;
                console.log("result: ", result)
            })
        },
        onReset (evt) {
            evt.preventDefault();
            /* Reset our form values */
            this.form.email = '';
            this.form.name = '';
            this.form.food = null;
            this.form.checked = [];
        }
    }
}
</script>
