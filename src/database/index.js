import PouchDB from 'pouchdb'
import Find from 'pouchdb-find'
PouchDB.plugin(Find)

const DBVideos = new PouchDB('videos')
const DBVideoDownloadLogs = new PouchDB('videoDownloadLogs')


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

export { DBVideos, DBVideoDownloadLogs }
