import PouchDB from 'pouchdb'
import Find from 'pouchdb-find'
PouchDB.plugin(Find)

const DBVideos = new PouchDB('videos')
const DBVideoDownloadLogs = new PouchDB('videoDownloadLogs')
const DBAudioConvertLogs = new PouchDB('audioConvertLogs')

DBAudioConvertLogs.createIndex({
    index: { fields: [ 'createTime', 'sourceFilename', 'sourceFullPath' ] },
}).then(function () {
    console.log('DBAudioConvertLogs Index created!')
})


DBVideos.createIndex({
    index: { fields: [ 'createTime', 'title', 'url' ] },
}).then(function () {
    console.log('DBVideos Index created!')
})


DBVideoDownloadLogs.createIndex({
    index: { fields: [ 'createTime', 'title', 'webPageUrl', 'ext' ] },
}).then(function () {
    console.log('DBVideoDownloadLogs Index created!')
})

export { DBVideos, DBVideoDownloadLogs, DBAudioConvertLogs }
