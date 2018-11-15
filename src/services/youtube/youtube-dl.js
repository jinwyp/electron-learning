import path from 'path';
import {spawn} from 'child_process';
import mkdirp  from 'mkdirp';

export const downloadSubtitles = ( {lang = 'enUS', filename, url, targetFolder} = {}) => {
    return new Promise(resolve => {
        const dl = spawn(
            'youtube-dl',
            [
                '--write-sub',
                '--sub-lang',
                lang,
                '-o',
                filename,
                '--skip-download',
                url,
            ],
            {
                cwd: targetFolder,
            }
        );
        dl.stderr.on('data', data => console.log('[dl-sub]:', data.toString()));
        dl.stdout.on('close', () => {
            const subtitlesFile = filename.replace('.mp4', `.${lang}.ass`);
            resolve(path.join(targetFolder, subtitlesFile));
        });
    });
}
    
export const getStreamUrl = url => {
    return new Promise(resolve => {
        const dl = spawn('youtube-dl', ['-g', url]);
        dl.stdout.on('data', data => resolve(data.toString().trim()));
    });
}

export const downloadVideo = ( url, targetFolder, options = {}) => {
    return new Promise(resolve => {
        console.log('Youtube-dl url:', url, targetFolder, path.join('./', targetFolder))

        mkdirp.sync(targetFolder)
        
        let message = []
        let error = []
        
        const dl = spawn(
            'youtube-dl',
            [
                '--no-check-certificate',
                '-v',
                '--no-overwrites',
                '--no-continue',
                
                '--write-sub',
                
                '--write-description',
                '--write-info-json',
                '--write-annotations',
                '--write-sub',
                '--write-thumbnail',
                
                
                '--proxy',
                options.networkOptions['--proxy'] || 'socks5://127.0.0.1:1086/',
                
                url,
            ],
            {
                cwd: path.join('./', targetFolder),
            }
        );

        dl.stdout.on('data', (data) => {
            message.push(data.toString())
            console.log(`[Youtube-dl-downloading]: ${data}`);
        });
        
        dl.stderr.on('data', data => {
            error.push(data.toString())
            console.log('[Youtube-dl-error]:', data.toString());
        })

        
        dl.on('close', (code) => {
            console.log('[Youtube-dl-close]:', code)
            resolve({code, message, error});
        });
    });
}
