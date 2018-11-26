import PouchDB from 'pouchdb'

const db = {
    series: new PouchDB('series'),
    episodes: new PouchDB('episodes'),
    videos: new PouchDB('videos'),
    videoDownloadLogs: new PouchDB('videoDownloadLogs'),
    search: new PouchDB('search'),
}

export default db
