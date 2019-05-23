<template>
    <el-row>
        <el-col :span="24">
            <el-form ref="form" :model="audioForm" label-width="140px" size="small">

                <el-form-item label="保存路径:">
                    <el-input v-model="audioForm.targetFilePath" placeholder="默认为源文件相同文件夹" :readonly="isMas()">
                        <tk-select-directory v-if="isRenderer()" slot="append" v-model="audioForm.targetFilePath" />
                    </el-input>
                </el-form-item>
                
                
                <el-form-item label="选择要转换的文件:">
                    <el-button type="primary" @click="openFile()">选择文件</el-button>
                    
                    <span> {{ audioForm.originalFilePath }} </span>
                </el-form-item>
                
                <el-form-item label="转换后的格式:">
                    <el-radio-group v-model="audioForm.targetFormat" size="mini">
                        <el-radio-button v-for="item in audioFormatList" :key="item.id" :label="item.value"></el-radio-button>
                    </el-radio-group>
                    
                    <!--
                    <el-select v-model="audioForm.targetFormat" placeholder="请选择" >
                        <el-option v-for="item in audioFormatList.slice(6)" :key="item.id" :label="item.value" :value="item.value"></el-option>
                    </el-select>
                    -->
                    
                </el-form-item>

                
                <el-form-item label="" class="form-one-line-multi">
                    <el-button v-loading.fullscreen.lock="isShowLoading" type="primary" plain @click="onSubmit('info')">点击转换</el-button>
                </el-form-item>
            </el-form>
        </el-col>

        
        <el-col :span="24">
            <el-card v-if="audioInfo.sourceFullPath" class="card-video-info">
                <div slot="header">
                    <span>Original: {{ audioInfo.sourceFilename }}  </span>
                </div>
                
                <div class="audio-info">
                    <div> Source File:  {{ audioInfo.sourceFilename }} &nbsp;&nbsp; ({{ audioInfo.sourceFullPath }}) </div>
                    <br>
                    <div> Output File: {{ audioInfo.targetFilename }} &nbsp;&nbsp; ({{ audioInfo.targetFullPath }}) </div>
                </div>
            </el-card>
        </el-col>
    </el-row>
</template>

<script>

import is from 'electron-is'
import { appPath } from '../../utils/appConfig'
import { userConfig } from '../../utils/fileSaveStore'

import { convertAudioToMP3 } from '../../services/ffmpeg/ffmpeg'
import { httpErrorHandler } from '../../services/httpErrorHandler'
import { notifyDuration } from '../../utils/constant'
import { DBAudioConvertLogs } from '../../database/index'

import SelectDirectory from '../../components/native/SelectDirectory'

const { dialog } = require('electron').remote

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
            isHideOpenFileDialog: true,
            
            audioFormatList: [
                { id: 11, value: 'MP3' },
                { id: 12, value: 'WAV' },
                { id: 13, value: 'WMA' },
                { id: 14, value: 'M4A' },
                { id: 15, value: 'AAC' },
                { id: 16, value: 'FLAC' },
                { id: 17, value: 'AC3' },
                { id: 18, value: 'AIFF' },
                { id: 19, value: 'M4R' },
                { id: 20, value: 'M4B' },
                { id: 21, value: 'AU' },
                { id: 22, value: 'APE' },
                { id: 23, value: 'OGG' },
                { id: 24, value: 'MKA' },
            ],
            
            savePath: 'download/ffmpeg',
            
            audioForm: {
                targetFormat: 'MP3',
                originalFilePath: '',
                targetFilePath: userConfig.get('savePath') || appPath.downloads,
            },
            
            audioInfo: {},
            downloadLog: {},
            downloadError: {},
            
        }
    },
    created: function () {
        // `this` points to the vm instance
        // console.log('Vue Component created: ')

        if (!this.isCreate) {
            if (this.$route.params && this.$route.params.audioId) {
                DBAudioConvertLogs.findOne({
                    _id: this.$route.params.audioId,
                }).then((doc) => {
                    console.log('Fetch Edit doc: ', doc)

                    if (doc && doc._id) {
                        this.audioInfo = doc
                    }
                }).catch(httpErrorHandler)
            }
        }
    },
    
    methods: {
        isRenderer: is.renderer,
        isMas: is.mas,

        
        onSubmit (type, formatData) {
            console.log('audioForm: ', this.audioForm)

            if (!this.audioForm.originalFilePath) {
                return this.$notify.error({
                    title: '请选择要转换的音频文件!',
                    message: '',
                    duration: notifyDuration,
                })
            }
            
            this.isShowLoading = true
            
            // const savePath = this.savePath + '/' + this.audioForm.targetFormat
            
            DBAudioConvertLogs.findOne({ sourceFullPath: this.audioForm.originalFilePath }).then((doc) => {
                if (doc && doc._id) {
                    console.log('Find Audio File Already Converted : ', doc)
                    this.$notify.success({
                        title: '该音频之前已经被转换过!',
                        message: '',
                        duration: notifyDuration,
                    })
                } else {
                    console.log('New Audio Converted: ', this.audioForm.originalFilePath)
                }

                convertAudioToMP3(this.audioForm.originalFilePath, this.audioForm.targetFilePath, this.audioForm.targetFormat).then((result) => {
                    this.audioInfo = result.message
                    this.downloadError = result.error
                    this.isShowLoading = false

                    return DBAudioConvertLogs.insert({
                        sourceFullPath: result.message.sourceFullPath,
                        sourceFilename: result.message.sourceFilename,
                        sourceFileExt: result.message.sourceFileExt,
                        targetFilename: result.message.targetFilename,
                        targetFileExt: result.message.targetFileExt,
                        targetFullPath: result.message.targetFullPath,

                        createTime: new Date().toJSON(),
                    })
                }).then((doc) => {
                    console.log('Doc Saved: ', doc)
                    this.$notify.success({
                        title: '操作成功!',
                        message: '',
                        duration: notifyDuration,
                    })
                }).catch(httpErrorHandler)
            }).catch(httpErrorHandler)
        },
        

        openFile () {
            if (this.isHideOpenFileDialog) {
                this.isHideOpenFileDialog = false
                
                let options = {
                    properties: ['openFile', 'noResolveAliases'],
                    filters: [
                        { name: 'Audio', extensions: ['aac', 'mp3', 'wma', 'wav', 'ape', 'JPG'] },
                    ],
                }
                
                dialog.showOpenDialog(options, (files) => {
                    console.log('Selected files: ', files)
                    this.isHideOpenFileDialog = true

                    if (!files) {
                        return
                    }

                    if (Array.isArray(files)) {
                        this.audioForm.originalFilePath = files[0]
                    }
                })
            } else {
                this.$notify.error({
                    title: '已打开选择文件的窗口',
                    message: '',
                    duration: notifyDuration,
                })
            }
        },
    },
}
</script>
