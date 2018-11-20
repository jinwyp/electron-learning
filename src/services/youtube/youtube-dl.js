import path from 'path'
import { spawn } from 'child_process'
import mkdirp from 'mkdirp'



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

// const videoOptions = [
//     '--list-formats',
// ]

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
            'youtube-dl',
            [
                '--skip-download',
                
                ...workaroundsOptions,
                
                ...subtitleOptions,
                
                url,
            ],
            {
                cwd: path.join('./', targetFolder),
            }
        )
        dl.stderr.on('data', data => console.log('[dl-sub]:', data.toString()))
        dl.stdout.on('close', () => {
            const subtitlesFile = filename.replace('.mp4', `.${lang}.ass`)
            resolve(path.join(targetFolder, subtitlesFile))
        })
    })
}

export const getStreamUrl = url => {
    return new Promise(resolve => {
        const dl = spawn('youtube-dl', ['-g', url])
        dl.stdout.on('data', data => resolve(data.toString().trim()))
    })
}



export const downloadVideo = (url, targetFolder, options = {}) => {
    return new Promise(resolve => {
        console.log('Youtube-dl url:', url, targetFolder, path.join('./', targetFolder))

        mkdirp.sync(targetFolder)

        let message = []
        let error = []

        if (options.networkOptions['--proxy']) {
            networkOptions[1] = options.networkOptions['--proxy']
        }
        const dl = spawn(
            'youtube-dl',
            [
                ...workaroundsOptions,
                
                ...fileOptions,

                ...networkOptions,

                url,
            ],
            {
                cwd: path.join('./', targetFolder),
            }
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
        console.log('Youtube-dl url:', url, path.join('./', targetFolder))

        mkdirp.sync(targetFolder)
        
        let message = ''
        let error = []

        if (options.networkOptions['--proxy']) {
            networkOptions[1] = options.networkOptions['--proxy']
        }
        
        const dl = spawn(
            'youtube-dl',
            [
                ...workaroundsOptions,
                ...simulationOptions,
                
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
