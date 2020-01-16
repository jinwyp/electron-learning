import path from 'path'
import { spawn } from 'child_process'
import mkdirp from 'mkdirp'
import { getAppRootDir, appPath } from '../../utils/appConfig'


const youtubeDlPath = path.join(getAppRootDir() + '/youtube-dl')


const networkOptions = [
    '--proxy',
    'socks5://127.0.0.1:1086/',
]

const fileOptions = [
    '--output',
    '%(title)s.%(ext)s',

    '--restrict-filenames',
    
    '--no-overwrites',
    '--no-continue',

    '--write-description',
    '--write-info-json',
    '--write-annotations',
    
    '--write-thumbnail',
]

const simulationOptions = [
    '--simulate',
    '--dump-json',
]


const workaroundsOptions = [
    '--no-check-certificate',
]

const videoFormatOptions = [
    '--format',
    'bestvideo+bestaudio/best',
]

const subtitleOptions = [
    '--write-sub',
    '--sub-lang',
    'enUS',
    
    '--output',
    '%(title)s.%(ext)s',
    
]


export const downloadSubtitles = (url, targetFolder = '', { lang = 'enUS', filename } = {}) => {
    return new Promise(resolve => {
        if (lang) {
            subtitleOptions[2] = lang
        }
        if (filename) {
            subtitleOptions[4] = filename
        }
        
        const dl = spawn(
            youtubeDlPath,
            [
                '--skip-download',
                
                ...workaroundsOptions,
                
                ...subtitleOptions,
                
                url,
            ],
            {
                cwd: path.join('./', targetFolder),
            },
        )
        dl.stderr.on('data', data => {
            console.log('[dl-sub]:', data.toString())
        })
        dl.stdout.on('close', () => {
            const subtitlesFile = filename.replace('.mp4', `.${lang}.ass`)
            resolve(path.join(targetFolder, subtitlesFile))
        })
    })
}

export const getStreamUrl = url => {
    return new Promise(resolve => {
        const dl = spawn(youtubeDlPath, ['-g', url])
        dl.stdout.on('data', data => resolve(data.toString().trim()))
    })
}



export const downloadVideo = (url, targetFolder, options = {}) => {
    return new Promise(resolve => {
        console.log('Youtube-dl cmd Path: ', youtubeDlPath)
        console.log('Youtube-dl url:', url, targetFolder)

        if (!targetFolder) {
            targetFolder = appPath.downloads
        }
        targetFolder = path.resolve(targetFolder)
        
        mkdirp.sync(targetFolder)

        let message = []
        let error = []

        if (options.networkOptions['--proxy']) {
            networkOptions[1] = options.networkOptions['--proxy']
        }

        if (options.videoFormatOptions['--format']) {
            videoFormatOptions[1] = options.videoFormatOptions['--format']
        }
        
        console.log('videoFormatOptions: ', videoFormatOptions)
        const dl = spawn(
            youtubeDlPath,
            [
                ...workaroundsOptions,
                
                ...fileOptions,

                ...networkOptions,
                
                ...videoFormatOptions,

                url,
            ],
            {
                cwd: targetFolder,
            },
        )

        dl.stdout.on('data', (data) => {
            message.push(data.toString())
            console.log(`[Youtube-dl-downloading]: ${data}`)
        })

        dl.stderr.on('data', data => {
            error.push(data.toString())
            console.log('[Youtube-dl-error]:', data.toString())
        })

        dl.on('close', (code) => {
            console.log('[Youtube-dl-close]:', code)
            resolve({ code, message, error })
        })
    })
}



export const getVideoInfo = (url, targetFolder, options = {}) => {
    return new Promise(resolve => {
        console.log('Youtube-dl cmd Path: ', youtubeDlPath)
        console.log('Youtube-dl url:', url, targetFolder)
        if (!targetFolder) {
            targetFolder = appPath.downloads
        }
        targetFolder = path.resolve(targetFolder)
        
        mkdirp.sync(targetFolder)
        
        let message = ''
        let error = []

        if (options.networkOptions['--proxy']) {
            networkOptions[1] = options.networkOptions['--proxy']
        }

        const dl = spawn(
            youtubeDlPath,
            [
                ...workaroundsOptions,
                ...simulationOptions,
                
                ...networkOptions,

                url,
            ],
            {
                cwd: targetFolder,
            },
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
