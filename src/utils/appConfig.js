import is from 'electron-is'



const remote = is.renderer() ? require('electron').remote : {}

export function getUserDownloadsPath () {
    return remote.app.getPath('downloads')
}
