import path from 'path'
import { spawn } from 'child_process'
import mkdirp from 'mkdirp'
import { getAppRootDir } from '../../utils/appConfig'



// https://linuxconfig.org/ffmpeg-audio-format-conversions



const ffmpegPath = path.join(getAppRootDir() + '/ffmpeg')




const networkOptions = [
    '--proxy',
    'socks5://127.0.0.1:1086/',
]


export const convertAudioToMP3 = (sourceFilePath, targetFolder, targetFormat, options = {}) => {
    return new Promise(resolve => {
        const targetFileFormat = targetFormat.toLowerCase()
        
        const sourceFile = path.resolve(sourceFilePath)
        const sourceFileExt = path.extname(sourceFile)
        const sourceFileBasename = path.basename(sourceFile, sourceFileExt)
        const sourceFileFullName = path.basename(sourceFile)
        
        const targetFileFullName = path.join(sourceFileBasename + '.' + targetFileFormat)
        let targetFileFullPath = path.resolve(targetFolder)
        
        if (!targetFolder) {
            targetFileFullPath = path.dirname(sourceFile)
        }

        console.log('FFMPEG cmd Path: ', ffmpegPath)
        console.log('FFMPEG To ' + targetFormat + ' Input Info: ', sourceFilePath, targetFolder, targetFormat)
        
        console.log('Source Info: ', sourceFile, sourceFileBasename, sourceFileExt, sourceFileFullName, path.resolve('./'))
        console.log('Target Info: ', targetFileFullPath, targetFileFullName, path.join('./', targetFolder))
        
        mkdirp.sync(targetFolder)
        
        let message = []
        let error = []
        
        
        let ffmpegOption = []
        
        if (targetFormat === 'MP3') {
            ffmpegOption = [
                '-y',

                '-i',
                sourceFilePath,

                '-acodec',
                'libmp3lame',

                '-b:a',
                '320k',

                targetFileFullName,
            ]
            
        } else if (targetFormat === 'AAC') {
            ffmpegOption = [
                '-y',

                '-i',
                sourceFilePath,

                '-acodec',
                'aac',

                '-b:a',
                '320k',

                targetFileFullName,
            ]
            
        } else if (targetFormat === 'FLAC') {
            ffmpegOption = [
                '-y',

                '-i',
                sourceFilePath,

                '-acodec',
                'flac',

                targetFileFullName,
            ]
            
        } else if (targetFormat === 'WAV') {
            ffmpegOption = [
                '-y',

                '-i',
                sourceFilePath,

                targetFileFullName,
            ]

        } else {
            ffmpegOption = [
                '-y',

                '-i',
                sourceFilePath,

                targetFileFullName,
            ]
        }
        
        
        const dl = spawn(
            ffmpegPath,
            ffmpegOption,
            {
                cwd: targetFileFullPath,
            }
        )

        dl.stdout.on('data', (data) => {
            message.push(data.toString())
            console.log(`[FFMPEG converting To ${targetFormat}]: ${data}`)
        })

        dl.stderr.on('data', data => {
            error.push(data.toString())
            console.log(`[FFMPEG converting To ${targetFormat} Error]:`, data.toString())
        })

        dl.on('close', (code) => {
            console.log('[FFMPEG closed]:', code)
            
            const fileInfo = {
                sourceFullPath: sourceFile,
                sourceFilename: sourceFileFullName,
                sourceFileExt: sourceFileExt,
                targetFilename: targetFileFullName,
                targetFileExt: targetFileFormat,
                targetFullPath: targetFileFullPath + '/' + targetFileFullName,
            }
            resolve({ code, message: fileInfo, error })
        })
    })
}



export const getAudioInfo = (url, targetFolder, options = {}) => {
    return new Promise(resolve => {
        console.log('FFMPEG url:', url, path.join('./', targetFolder))

        mkdirp.sync(targetFolder)
        
        let message = ''
        let error = []

        if (options.networkOptions['--proxy']) {
            networkOptions[1] = options.networkOptions['--proxy']
        }

        const dl = spawn(
            ffmpegPath,
            [
                ...networkOptions,

                url,
            ],
            {
                cwd: path.join('./', targetFolder),
            }
        )

        dl.stdout.on('data', (data) => {
            message = message + data.toString()
            console.log(`[Youtube-dl-downloading]: ${data}`)
        })

        dl.stderr.on('data', data => {
            error.push(data.toString())
            console.log('[Youtube-dl-error]:', data.toString())
        })
        
        dl.on('close', (code) => {
            console.log('[Youtube-dl-close]:', code)
            
            let tempObject = null

            try {
                tempObject = JSON.parse(message)
            } catch (error) {
                console.log('[Youtube-dl-close JSON parse error]:', error)
            }
            resolve({ code, message: tempObject, error })
        })
    })
}
