// import {app} from "electron";
import Store from 'electron-store'

// const path = require('path')


// const userDataPath = (electron.app || electron.remote.app).getPath('userData')


const systemConfig = new Store({
    name: 'systemPreferenceConfig',
    defaults: {
        // 断点续传
        continue: true,
        pause: true,
        split: 16,
        'rpc-listen-port': 16800,
        'rpc-secret': '',
        'auto-file-renaming': true,
        'allow-overwrite': true,
        'max-concurrent-downloads': 5,
        // macOS 版本修改过源码自己编译的，Linux 和 Windows 版本 暂未处理
        'min-split-size': '1M',
        'max-overall-download-limit': 0,
        'max-overall-upload-limit': 0,
        'max-download-limit': 0,
        'all-proxy': '',
        'user-agent': 'Transmission/2.94',
    },
})

const userConfig = new Store({
    name: 'userPreferenceConfig',
    defaults: {},
})





// expose the class
export { systemConfig, userConfig }
