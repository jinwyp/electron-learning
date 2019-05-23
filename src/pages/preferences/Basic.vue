<template>
    <el-container class="content panel" direction="vertical">
        
        <el-main class="panel-content">
            <el-form ref="form" class="form-preference" :model="preferenceBasicForm" label-width="140px" label-position="right" size="mini">
                
                <el-form-item label="默认保存路径:">
                    <el-input v-model="preferenceBasicForm.savePath" :readonly="isMas()">
                        <tk-select-directory v-if="isRenderer()" slot="append" v-model="preferenceBasicForm.savePath" />
                    </el-input>
                    <div v-if="isMas()" class="el-form-item__info" style="margin-top: 8px;"> 因 App Store 的沙箱权限限制，默认下载路径建议设置为您的「下载」目录</div>
                </el-form-item>


                <el-form-item label="sock 代理服务器:">
                    <el-switch v-model="preferenceBasicForm.useProxy" active-text="使用代理服务器"></el-switch>
                </el-form-item>
                <el-form-item v-if="preferenceBasicForm.useProxy">
                    <el-col class="form-item-sub" :span="16">
                        <el-input v-model="preferenceBasicForm.proxyAddress" placeholder="[http://][USER:PASSWORD@]HOST[:PORT]"></el-input>
                    </el-col>
                </el-form-item>
                

                <el-form-item>
                    <el-button type="primary" @click="submitForm('form')"> 保存并应用 </el-button>
                    <el-button @click="resetForm('form')"> 放弃 </el-button>
                </el-form-item>
                
            </el-form>
            
            
        </el-main>
    </el-container>
</template>

<script>

import is from 'electron-is'
import { appPath } from '../../utils/appConfig'
import { userConfig } from '../../utils/fileSaveStore'

// import { httpErrorHandler } from '../../services/httpErrorHandler'
import { notifyDuration } from '../../utils/constant'

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
            
            preferenceBasicForm: {
                savePath: userConfig.get('savePath') || appPath.downloads,
                useProxy: userConfig.get('useProxy') || false,
                proxyAddress: userConfig.get('proxyAddress') || 'socks5://127.0.0.1:1086/',
            },
            
        }
    },
    created: function () {
        // `this` points to the vm instance
        // console.log('Vue Component created: ')

        console.log('userConfig.proxyAddress:', userConfig.get('proxyAddress'))
        console.log('userConfig.savePath:', userConfig.get('savePath'))
    },
    
    methods: {
        isRenderer: is.renderer,
        isMas: is.mas,
        

        submitForm (formName) {
            console.log('preferenceBasicForm: ', this.preferenceBasicForm)
            
            this.$refs[formName].validate((valid, errorField) => {
                if (!valid) {
                    return this.$notify.error({
                        title: '请填写正确的信息!',
                        message: errorField[Object.keys(errorField)[0]][0].message,
                        duration: notifyDuration,
                    })
                }

                if (!this.preferenceBasicForm.savePath) {
                    return this.$notify.error({
                        title: '请选择默认保存的路径!',
                        message: '',
                        duration: notifyDuration,
                    })
                }
                
                if (this.isRenderer()) {
                    // this.$electron.ipcRenderer.send('command', 'application:relaunch')
                }

                userConfig.set('savePath', this.preferenceBasicForm.savePath)
                userConfig.set('useProxy', this.preferenceBasicForm.useProxy)
                userConfig.set('proxyAddress', this.preferenceBasicForm.proxyAddress)

                this.$notify.success({
                    title: '操作成功!',
                    message: '',
                    duration: notifyDuration,
                })
            })
        },
        
        resetForm (formName) {
            this.preferenceBasicForm.savePath = userConfig.get('savePath') || appPath.downloads
            this.preferenceBasicForm.useProxy = userConfig.get('useProxy') || false
            this.preferenceBasicForm.proxyAddress = userConfig.get('proxyAddress') || 'socks5://127.0.0.1:1086/'
        },
    },
}
</script>
