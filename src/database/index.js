import PouchDB from 'pouchdb'
// PouchDB.plugin(require('pouchdb-find'))

const db = {
    series: new PouchDB('series'),
    episodes: new PouchDB('episodes'),
    videos: new PouchDB('videos'),
    videoDownloadLogs: new PouchDB('videoDownloadLogs'),
    search: new PouchDB('search'),
}

export default db
