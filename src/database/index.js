
import path from 'path'

import Datastore from './promiseNedb'

import { appPath } from '../utils/appConfig'

const DBVideos = new Datastore({ filename: path.join(appPath.userData, 'dbVideos.db'), autoload: true })
const DBVideoDownloadLogs = new Datastore({ filename: path.join(appPath.userData, 'dbVideoDownloadLogs.db'), autoload: true })
const DBAudioConvertLogs = new Datastore({ filename: path.join(appPath.userData, 'dbAudioConvertLogs.db'), autoload: true })



export { DBVideos, DBVideoDownloadLogs, DBAudioConvertLogs }
