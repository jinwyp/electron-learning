
import is from 'electron-is'
import { platform } from 'os'
import path from 'path'

// const appRootDir = require('app-root-dir').get()
// appRootDir:  /Users/wangyp/Documents/github/electron-learning/dist_electron/mac/WMATOMP3.app/Contents/Resource
// remote.app.getAppPath()  /Users/wangyp/Documents/github/electron-learning/dist_electron/mac/WMATOMP3.app/Contents/Resource/app.asar

const remote = is.renderer() ? require('electron').remote : { app: {} }

const appRootDir = path.dirname(remote.app.getAppPath())


console.log('===== NODE_ENV  : ', process.env.NODE_ENV)
console.log('===== App isPackaged : ', remote.app.isPackaged)
console.log('===== App Path Dir:', appRootDir)


console.log('===== App Path:', remote.app.getAppPath())
console.log('===== App Data:', remote.app.getPath('appData'))
console.log('===== App Logs:', remote.app.getPath('logs'))
console.log('===== User Home:', remote.app.getPath('home'))
console.log('===== User Data:', remote.app.getPath('userData'))
console.log('===== User downloads:', remote.app.getPath('downloads'))
console.log('===== User documents:', remote.app.getPath('documents'))
console.log('===== User desktop:', remote.app.getPath('desktop'))
console.log('===== User pictures:', remote.app.getPath('pictures'))
console.log('===== User videos:', remote.app.getPath('videos'))


export const appPath = {
    appPath: remote.app.getAppPath(),
    appData: remote.app.getPath('appData'),
    appLogs: remote.app.getPath('logs'),
    userHome: remote.app.getPath('home'),
    userData: remote.app.getPath('userData'),
    downloads: remote.app.getPath('downloads'),
    documents: remote.app.getPath('documents'),
    desktop: remote.app.getPath('desktop'),
    pictures: remote.app.getPath('pictures'),
    videos: remote.app.getPath('videos'),
}



export function getPlatform () {
    switch (platform()) {
    case 'aix':
    case 'freebsd':
    case 'linux':
    case 'openbsd':
    case 'android':
        return 'linux'
    case 'darwin':
    case 'sunos':
        return 'mac'
    case 'win32':
        return 'win'
    }
}


// https://stackoverflow.com/questions/33152533/bundling-precompiled-binary-into-electron-app/45152204
export function getAppRootDir () {
    let resultUrl = path.join(appRootDir, '/resources/', getPlatform())

    if (process.env.NODE_ENV === 'production' && remote.app.isPackaged) {
        resultUrl = path.join(appRootDir, '..', '/Resources/bin')
    }
    
    return resultUrl
}
