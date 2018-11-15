import PouchDB from 'pouchdb';

const db = {
    series: new PouchDB('series'),
    episodes: new PouchDB('episodes'),
    videos: new PouchDB('videos'),
    search: new PouchDB('search'),
};

export default db;
