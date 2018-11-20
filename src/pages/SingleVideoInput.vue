<template>
    <el-row>
        <el-col :span="24">
            
            <el-form ref="form" :model="formData" label-width="100px">
                <el-form-item label="代理服务器:">
                    <el-input v-model="formData.socks5" placeholder="socks5://127.0.0.1:1086/" />
                </el-form-item>
                
                <el-form-item label="视频地址:" class="form-one-line-multi">
                    <el-input v-model="formData.videoUrl" />
                    <el-button v-loading.fullscreen.lock="isShowLoading" class="ml-20" type="primary" plain size="small" @click="onSubmit('info')">获取视频信息</el-button>
                </el-form-item>
    
                <el-button type="primary" size="small" @click="onSubmit('download')">下载视频</el-button>
                <el-button type="primary" size="small" @click="onReset">重置</el-button>
                
            </el-form>
        </el-col>

        <el-col :span="24" class="mt-20">
            <el-card class="card-video-info">
                <div slot="header">
                    <span>{{videoInfo.title}} ({{videoInfo.duration | duration}}) </span>
                </div>
                <div class="main-info">
                    <div class="image-box">
                        <img :src="videoInfo.thumbnail" alt="">
                    </div>
                    <div class="description"> 
                        <span> ID: <a :href=videoInfo.webpage_url>{{videoInfo.id}}</a>  </span>
                        <span> 上传时间: {{videoInfo.upload_date | dateDisplay }}  </span>
                        <br>
                        <span> 浏览量: {{videoInfo.view_count | numberDisplay}} </span> 
                        <span> 喜欢: {{videoInfo.like_count | numberDisplay}} </span> 
                        <span>不喜欢: {{videoInfo.dislike_count | numberDisplay}} </span>
                    </div>
                </div> 
            
                <!---->
                <!--<div>-->
                    <!--{{videoInfo.description}}-->
                <!--</div>-->
                
                <div class="format-info" v-for="(format, index) in videoFormatList">
                    
                    <div v-show="format.vcodec === 'none' "> 
                        <span> Audio {{format.ext}}: {{format.filesize | sizeDisplay}}</span>
                        <span> (Audio codec: {{format.acodec}}<span v-show="format.abr">, {{format.abr}} Kbps</span>)</span> 
                    </div>
                    
                    <div v-show="format.vcodec !== 'none' "> 
                        <span> Video {{format.ext}}  {{format.width}}x{{format.height}} : {{format.filesize | sizeDisplay}} (Video codec: {{format.vcodec}}<span v-show="format.vbr">, {{format.vbr}} Kbps</span>) </span>
                        <span v-show="format.acodec !== 'none' "> - (Audio codec: {{format.acodec}}<span v-show="format.abr">, {{format.abr}} Kbps</span>) </span>
                    </div>
                </div>
            </el-card>
            
            <div>
                <h4>下载日志 :</h4>
                <br> {{ downloadLog }}
            </div>
    
            <div>
                <h4>下载错误日志 :</h4>
                <br> {{ downloadError }}
            </div>
    
            <div>
                <h4>视频信息 :</h4>
                <pre> <code>
                     {{ videoInfo }}
                </code> </pre>
            </div>
            
        </el-col>
    </el-row>
</template>

<script>
    
import { downloadVideo, getVideoInfo } from '../services/youtube/youtube-dl'
import db from '../database/index'

export default {
    data () {
        return {
            isShowLoading: false,
            
            downloadLog: [],
            downloadError: [],
            
            downloadSavePath: 'download/youtube',
            
            formData: {
                videoUrl: '',
                videoTitle: '',
                socks5: '',
            },
            
            youtubeDlOptions: {
                networkOptions: {
                    '--proxy': 'socks5://127.0.0.1:1086/',
                },
            },

            videoFormatList: [],
            videoInfo: {
                "upload_date": "20181001",
                "extractor": "youtube",
                "series": "Nursery Rhymes &amp; Kids Songs by Little Baby Bum - Volume 1",
                "format": "137 - 1920x1080 (1080p)+251 - audio only (DASH audio)",
                "vbr": null,
                "chapters": null,
                "height": 1080,
                "like_count": 1194,
                "duration": 116,
                "fulltitle": "Halloween is Dress Up Time | Halloween Songs For Kids | BRAND NEW! | Little Baby Bum",
                "playlist_index": null,
                "requested_formats": [
                    {
                        "http_headers": {
                            "Accept-Charset": "ISO-8859-1,utf-8;q=0.7,*;q=0.7",
                            "Accept-Language": "en-us,en;q=0.5",
                            "Accept-Encoding": "gzip, deflate",
                            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
                            "User-Agent": "Mozilla/5.0 (X11; Linux x86_64; rv:59.0) Gecko/20100101 Firefox/59.0"
                        },
                        "tbr": 2874.803,
                        "protocol": "https",
                        "format": "137 - 1920x1080 (1080p)",
                        "url": "https://r1---sn-i3b7kn76.googlevideo.com/videoplayback?clen=29010224&signature=50C7A31E19FD2B1935479CA33C5F6A45EC851CDE.C480FE5B0549E821363C7E32170E7D5CB9B528FF&aitags=133%2C134%2C135%2C136%2C137%2C160%2C242%2C243%2C244%2C247%2C248%2C278&txp=5533432&mime=video%2Fmp4&gir=yes&key=yt6&ipbits=0&dur=115.882&mv=m&expire=1542728091&fvip=6&mm=31%2C29&mn=sn-i3b7kn76%2Csn-i3beln7z&id=o-AFr-wAXueAzsWICNhdYh_fqNcmm5Cf4h1x4e2iHWGd-_&pl=18&ip=35.234.17.215&requiressl=yes&mt=1542706400&sparams=aitags%2Cclen%2Cdur%2Cei%2Cgir%2Cid%2Cip%2Cipbits%2Citag%2Ckeepalive%2Clmt%2Cmime%2Cmm%2Cmn%2Cms%2Cmv%2Cpl%2Crequiressl%2Csource%2Cexpire&itag=137&ms=au%2Crdu&keepalive=yes&c=WEB&ei=O9XzW9-ZB9TlqAHBtpmADQ&lmt=1538405051771398&source=youtube&ratebypass=yes",
                        "vcodec": "avc1.640028",
                        "format_note": "1080p",
                        "height": 1080,
                        "downloader_options": {
                            "http_chunk_size": 10485760
                        },
                        "width": 1920,
                        "ext": "mp4",
                        "filesize": 29010224,
                        "fps": 30,
                        "format_id": "137",
                        "player_url": "/yts/jsbin/player-vflWnjS_n/en_US/base.js",
                        "quality": -1,
                        "acodec": "none"
                    },
                    {
                        "http_headers": {
                            "Accept-Charset": "ISO-8859-1,utf-8;q=0.7,*;q=0.7",
                            "Accept-Language": "en-us,en;q=0.5",
                            "Accept-Encoding": "gzip, deflate",
                            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
                            "User-Agent": "Mozilla/5.0 (X11; Linux x86_64; rv:59.0) Gecko/20100101 Firefox/59.0"
                        },
                        "format_note": "DASH audio",
                        "protocol": "https",
                        "format": "251 - audio only (DASH audio)",
                        "url": "https://r1---sn-i3b7kn76.googlevideo.com/videoplayback?clen=2053204&signature=AF21BD6C3F546A6A8EB295D69EAFA06B15E48CEC.BC929AD3009CEF21F32768D0838DBF6F925490F4&txp=5511222&mime=audio%2Fwebm&gir=yes&key=yt6&ipbits=0&dur=115.901&mv=m&expire=1542728091&fvip=6&mm=31%2C29&mn=sn-i3b7kn76%2Csn-i3beln7z&id=o-AFr-wAXueAzsWICNhdYh_fqNcmm5Cf4h1x4e2iHWGd-_&pl=18&ip=35.234.17.215&requiressl=yes&mt=1542706400&sparams=clen%2Cdur%2Cei%2Cgir%2Cid%2Cip%2Cipbits%2Citag%2Ckeepalive%2Clmt%2Cmime%2Cmm%2Cmn%2Cms%2Cmv%2Cpl%2Crequiressl%2Csource%2Cexpire&itag=251&ms=au%2Crdu&keepalive=yes&c=WEB&ei=O9XzW9-ZB9TlqAHBtpmADQ&lmt=1538405775783677&source=youtube&ratebypass=yes",
                        "vcodec": "none",
                        "tbr": 157.566,
                        "abr": 160,
                        "player_url": "/yts/jsbin/player-vflWnjS_n/en_US/base.js",
                        "downloader_options": {
                            "http_chunk_size": 10485760
                        },
                        "ext": "webm",
                        "filesize": 2053204,
                        "format_id": "251",
                        "quality": -1,
                        "acodec": "opus"
                    }
                ],
                "view_count": 978287,
                "playlist": null,
                "title": "Halloween is Dress Up Time | Halloween Songs For Kids | BRAND NEW! | Little Baby Bum",
                "_filename": "Halloween is Dress Up Time _ Halloween Songs For Kids _ BRAND NEW! _ Little Baby Bum-by0e4didQpM.mp4",
                "creator": null,
                "ext": "mp4",
                "id": "by0e4didQpM",
                "dislike_count": 551,
                "average_rating": 3.70960688591,
                "abr": 160,
                "uploader_url": "http://www.youtube.com/user/LittleBabyBum",
                "categories": [
                    "Education"
                ],
                "fps": 30,
                "requested_subtitles": null,
                "season_number": 5,
                "annotations": null,
                "webpage_url_basename": "watch",
                "acodec": "opus",
                "display_id": "by0e4didQpM",
                "automatic_captions": {},
                "description": "SUBSCRIBE for new videos every week!►https://www.youtube.com/user/LittleBabyBum?sub_confirmation=1\nSongs About Numbers, ABC's and shapes:\nhttps://www.youtube.com/watch?v=wwdqK_XNBNM&list=PL0VE_cI7-AYRotjbI1cGFg8zscyzgFClS\n\nLBB TV:\nhttps://www.youtube.com/watch?v=fQTDpa_c-nk&list=PL0VE_cI7-AYRx9Qbz5C0oQix0AO6YdCtw\n\nLBB and friends:\nhttps://www.youtube.com/watch?v=J3htU652mBY&list=PL0VE_cI7-AYSuxGdfT5N15Aks-y_HbNg7\n\nTen little animals | Counting for kids:\nhttps://www.youtube.com/watch?v=lX2NvIQS8iM\n\nABC song:\nhttps://www.youtube.com/watch?v=ezdzxieXJvc\n\n© El Bebe Productions Limited - part of LittleBabyBum\n\nHalloween is dress up time,\nDress up, dress up, dress up time,\nHalloween is dress up time,\nDress up, dress up, dress up time!\n\nGrab a white sheet,\nYou’ll be a ghost, woohoo!\nPut it over your head,\nBoo, boo, boo!\nYou have ears and a tail,\nYou’re a little cat, wow!\nYou can purr and prance,\nMeow, meow, meow!\n\nHalloween is dress up time,\nDress up, dress up, dress up time,\nHalloween is dress up time,\nDress up, dress up, dress up time!\n\nMaybe you’re a mummy,\nWrapped up head to toe,\nPut your hands in front of you and\nGo, go, go!\nYou could be a witch,\nGrab a hat and a broom,\nDon’t forget your cloak,\nVroom, vroom, vroom!\n\n#halloweensongsforkids #halloween #halloweenforkids",
                "tags": [
                    "Little baby bum",
                    "wheels on the bus",
                    "cartoon",
                    "cartoons",
                    "kids cartoon",
                    "cartoons for kids",
                    "baby songs",
                    "nursery rhymes",
                    "baby bun",
                    "children songs",
                    "kids songs",
                    "kindergarten songs",
                    "toddler songs",
                    "kids song",
                    "education",
                    "abc song",
                    "balloons",
                    "abc songs for children",
                    "abc song nursery rhymes",
                    "five little ducks",
                    "lbb",
                    "videos for kids",
                    "baby shark",
                    "bus",
                    "nursery rhymes uk",
                    "nursery songs",
                    "halloween",
                    "haloween",
                    "halloween song",
                    "haloween songs",
                    "halloween movie",
                    "halloween songs for kids"
                ],
                "track": null,
                "season": "Season 5",
                "start_time": null,
                "stretched_ratio": null,
                "uploader": "Little Baby Bum - Nursery Rhymes & Kids Songs",
                "format_id": "137+251",
                "episode_number": 41,
                "uploader_id": "LittleBabyBum",
                "subtitles": {},
                "episode": "Episode 41",
                "thumbnails": [
                    {
                        "url": "https://i.ytimg.com/vi/by0e4didQpM/maxresdefault.jpg",
                        "id": "0"
                    }
                ],
                "license": null,
                "artist": null,
                "extractor_key": "Youtube",
                "vcodec": "avc1.640028",
                "alt_title": null,
                "thumbnail": "https://i.ytimg.com/vi/by0e4didQpM/maxresdefault.jpg",
                "channel_id": "UCKAqou7V9FAWXpZd9xtOg3Q",
                "is_live": null,
                "end_time": null,
                "webpage_url": "https://www.youtube.com/watch?v=by0e4didQpM",
                "formats": [
                    {
                        "http_headers": {
                            "Accept-Charset": "ISO-8859-1,utf-8;q=0.7,*;q=0.7",
                            "Accept-Language": "en-us,en;q=0.5",
                            "Accept-Encoding": "gzip, deflate",
                            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
                            "User-Agent": "Mozilla/5.0 (X11; Linux x86_64; rv:59.0) Gecko/20100101 Firefox/59.0"
                        },
                        "format_note": "DASH audio",
                        "protocol": "https",
                        "format": "249 - audio only (DASH audio)",
                        "url": "https://r1---sn-i3b7kn76.googlevideo.com/videoplayback?clen=807573&signature=80255C111998DCA5EA0C61201646EF624D9BC759.78E8FDF2994785E70B9E44A51DC3080C42B4E920&txp=5511222&mime=audio%2Fwebm&gir=yes&key=yt6&ipbits=0&dur=115.901&mv=m&expire=1542728091&fvip=6&mm=31%2C29&mn=sn-i3b7kn76%2Csn-i3beln7z&id=o-AFr-wAXueAzsWICNhdYh_fqNcmm5Cf4h1x4e2iHWGd-_&pl=18&ip=35.234.17.215&requiressl=yes&mt=1542706400&sparams=clen%2Cdur%2Cei%2Cgir%2Cid%2Cip%2Cipbits%2Citag%2Ckeepalive%2Clmt%2Cmime%2Cmm%2Cmn%2Cms%2Cmv%2Cpl%2Crequiressl%2Csource%2Cexpire&itag=249&ms=au%2Crdu&keepalive=yes&c=WEB&ei=O9XzW9-ZB9TlqAHBtpmADQ&lmt=1538405775891154&source=youtube&ratebypass=yes",
                        "vcodec": "none",
                        "tbr": 63.914,
                        "abr": 50,
                        "player_url": "/yts/jsbin/player-vflWnjS_n/en_US/base.js",
                        "downloader_options": {
                            "http_chunk_size": 10485760
                        },
                        "ext": "webm",
                        "filesize": 807573,
                        "format_id": "249",
                        "quality": -1,
                        "acodec": "opus"
                    },
                    {
                        "http_headers": {
                            "Accept-Charset": "ISO-8859-1,utf-8;q=0.7,*;q=0.7",
                            "Accept-Language": "en-us,en;q=0.5",
                            "Accept-Encoding": "gzip, deflate",
                            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
                            "User-Agent": "Mozilla/5.0 (X11; Linux x86_64; rv:59.0) Gecko/20100101 Firefox/59.0"
                        },
                        "format_note": "DASH audio",
                        "protocol": "https",
                        "format": "250 - audio only (DASH audio)",
                        "url": "https://r1---sn-i3b7kn76.googlevideo.com/videoplayback?clen=1057550&signature=8CC6958674CEEF5423F01464636DAEEF2FD81929.1B0876CC80713528255C8F74B7492C983A145633&txp=5511222&mime=audio%2Fwebm&gir=yes&key=yt6&ipbits=0&dur=115.901&mv=m&expire=1542728091&fvip=6&mm=31%2C29&mn=sn-i3b7kn76%2Csn-i3beln7z&id=o-AFr-wAXueAzsWICNhdYh_fqNcmm5Cf4h1x4e2iHWGd-_&pl=18&ip=35.234.17.215&requiressl=yes&mt=1542706400&sparams=clen%2Cdur%2Cei%2Cgir%2Cid%2Cip%2Cipbits%2Citag%2Ckeepalive%2Clmt%2Cmime%2Cmm%2Cmn%2Cms%2Cmv%2Cpl%2Crequiressl%2Csource%2Cexpire&itag=250&ms=au%2Crdu&keepalive=yes&c=WEB&ei=O9XzW9-ZB9TlqAHBtpmADQ&lmt=1538405775608541&source=youtube&ratebypass=yes",
                        "vcodec": "none",
                        "tbr": 83.038,
                        "abr": 70,
                        "player_url": "/yts/jsbin/player-vflWnjS_n/en_US/base.js",
                        "downloader_options": {
                            "http_chunk_size": 10485760
                        },
                        "ext": "webm",
                        "filesize": 1057550,
                        "format_id": "250",
                        "quality": -1,
                        "acodec": "opus"
                    },
                    {
                        "http_headers": {
                            "Accept-Charset": "ISO-8859-1,utf-8;q=0.7,*;q=0.7",
                            "Accept-Language": "en-us,en;q=0.5",
                            "Accept-Encoding": "gzip, deflate",
                            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
                            "User-Agent": "Mozilla/5.0 (X11; Linux x86_64; rv:59.0) Gecko/20100101 Firefox/59.0"
                        },
                        "tbr": 127.98,
                        "container": "m4a_dash",
                        "format": "140 - audio only (DASH audio)",
                        "url": "https://r1---sn-i3b7kn76.googlevideo.com/videoplayback?clen=1842032&signature=0B0193C148A3E288823C57099119B66137A5B4F1.7011785500717287D58B808262A8C20F12CAACF0&txp=5533432&mime=audio%2Fmp4&gir=yes&key=yt6&ipbits=0&dur=115.937&mv=m&expire=1542728091&fvip=6&mm=31%2C29&mn=sn-i3b7kn76%2Csn-i3beln7z&id=o-AFr-wAXueAzsWICNhdYh_fqNcmm5Cf4h1x4e2iHWGd-_&pl=18&ip=35.234.17.215&requiressl=yes&mt=1542706400&sparams=clen%2Cdur%2Cei%2Cgir%2Cid%2Cip%2Cipbits%2Citag%2Ckeepalive%2Clmt%2Cmime%2Cmm%2Cmn%2Cms%2Cmv%2Cpl%2Crequiressl%2Csource%2Cexpire&itag=140&ms=au%2Crdu&keepalive=yes&c=WEB&ei=O9XzW9-ZB9TlqAHBtpmADQ&lmt=1538404681522122&source=youtube&ratebypass=yes",
                        "vcodec": "none",
                        "format_note": "DASH audio",
                        "abr": 128,
                        "player_url": "/yts/jsbin/player-vflWnjS_n/en_US/base.js",
                        "downloader_options": {
                            "http_chunk_size": 10485760
                        },
                        "ext": "m4a",
                        "filesize": 1842032,
                        "protocol": "https",
                        "format_id": "140",
                        "quality": -1,
                        "acodec": "mp4a.40.2"
                    },
                    {
                        "http_headers": {
                            "Accept-Charset": "ISO-8859-1,utf-8;q=0.7,*;q=0.7",
                            "Accept-Language": "en-us,en;q=0.5",
                            "Accept-Encoding": "gzip, deflate",
                            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
                            "User-Agent": "Mozilla/5.0 (X11; Linux x86_64; rv:59.0) Gecko/20100101 Firefox/59.0"
                        },
                        "format_note": "DASH audio",
                        "protocol": "https",
                        "format": "171 - audio only (DASH audio)",
                        "url": "https://r1---sn-i3b7kn76.googlevideo.com/videoplayback?clen=1793763&signature=B00888CB3DDCEAFC32656D84C1BD7AD7A599F322.807D1F5762E2645728FE2844AF33DF818DDC0EBE&txp=5511222&mime=audio%2Fwebm&gir=yes&key=yt6&ipbits=0&dur=115.883&mv=m&expire=1542728091&fvip=6&mm=31%2C29&mn=sn-i3b7kn76%2Csn-i3beln7z&id=o-AFr-wAXueAzsWICNhdYh_fqNcmm5Cf4h1x4e2iHWGd-_&pl=18&ip=35.234.17.215&requiressl=yes&mt=1542706400&sparams=clen%2Cdur%2Cei%2Cgir%2Cid%2Cip%2Cipbits%2Citag%2Ckeepalive%2Clmt%2Cmime%2Cmm%2Cmn%2Cms%2Cmv%2Cpl%2Crequiressl%2Csource%2Cexpire&itag=171&ms=au%2Crdu&keepalive=yes&c=WEB&ei=O9XzW9-ZB9TlqAHBtpmADQ&lmt=1538405776390855&source=youtube&ratebypass=yes",
                        "vcodec": "none",
                        "tbr": 129.877,
                        "abr": 128,
                        "player_url": "/yts/jsbin/player-vflWnjS_n/en_US/base.js",
                        "downloader_options": {
                            "http_chunk_size": 10485760
                        },
                        "ext": "webm",
                        "filesize": 1793763,
                        "format_id": "171",
                        "quality": -1,
                        "acodec": "vorbis"
                    },
                    {
                        "http_headers": {
                            "Accept-Charset": "ISO-8859-1,utf-8;q=0.7,*;q=0.7",
                            "Accept-Language": "en-us,en;q=0.5",
                            "Accept-Encoding": "gzip, deflate",
                            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
                            "User-Agent": "Mozilla/5.0 (X11; Linux x86_64; rv:59.0) Gecko/20100101 Firefox/59.0"
                        },
                        "format_note": "DASH audio",
                        "protocol": "https",
                        "format": "251 - audio only (DASH audio)",
                        "url": "https://r1---sn-i3b7kn76.googlevideo.com/videoplayback?clen=2053204&signature=AF21BD6C3F546A6A8EB295D69EAFA06B15E48CEC.BC929AD3009CEF21F32768D0838DBF6F925490F4&txp=5511222&mime=audio%2Fwebm&gir=yes&key=yt6&ipbits=0&dur=115.901&mv=m&expire=1542728091&fvip=6&mm=31%2C29&mn=sn-i3b7kn76%2Csn-i3beln7z&id=o-AFr-wAXueAzsWICNhdYh_fqNcmm5Cf4h1x4e2iHWGd-_&pl=18&ip=35.234.17.215&requiressl=yes&mt=1542706400&sparams=clen%2Cdur%2Cei%2Cgir%2Cid%2Cip%2Cipbits%2Citag%2Ckeepalive%2Clmt%2Cmime%2Cmm%2Cmn%2Cms%2Cmv%2Cpl%2Crequiressl%2Csource%2Cexpire&itag=251&ms=au%2Crdu&keepalive=yes&c=WEB&ei=O9XzW9-ZB9TlqAHBtpmADQ&lmt=1538405775783677&source=youtube&ratebypass=yes",
                        "vcodec": "none",
                        "tbr": 157.566,
                        "abr": 160,
                        "player_url": "/yts/jsbin/player-vflWnjS_n/en_US/base.js",
                        "downloader_options": {
                            "http_chunk_size": 10485760
                        },
                        "ext": "webm",
                        "filesize": 2053204,
                        "format_id": "251",
                        "quality": -1,
                        "acodec": "opus"
                    },
                    {
                        "http_headers": {
                            "Accept-Charset": "ISO-8859-1,utf-8;q=0.7,*;q=0.7",
                            "Accept-Language": "en-us,en;q=0.5",
                            "Accept-Encoding": "gzip, deflate",
                            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
                            "User-Agent": "Mozilla/5.0 (X11; Linux x86_64; rv:59.0) Gecko/20100101 Firefox/59.0"
                        },
                        "tbr": 100.873,
                        "container": "webm",
                        "format": "278 - 256x144 (144p)",
                        "url": "https://r1---sn-i3b7kn76.googlevideo.com/videoplayback?clen=1349843&signature=2C4BEF2FBB02EB0AA2F1730021038689A47BB1BC.78C22393342AB1764B81F1C39BA96B518D1FACA4&aitags=133%2C134%2C135%2C136%2C137%2C160%2C242%2C243%2C244%2C247%2C248%2C278&txp=5533432&mime=video%2Fwebm&gir=yes&key=yt6&ipbits=0&dur=115.882&mv=m&expire=1542728091&fvip=6&mm=31%2C29&mn=sn-i3b7kn76%2Csn-i3beln7z&id=o-AFr-wAXueAzsWICNhdYh_fqNcmm5Cf4h1x4e2iHWGd-_&pl=18&ip=35.234.17.215&requiressl=yes&mt=1542706400&sparams=aitags%2Cclen%2Cdur%2Cei%2Cgir%2Cid%2Cip%2Cipbits%2Citag%2Ckeepalive%2Clmt%2Cmime%2Cmm%2Cmn%2Cms%2Cmv%2Cpl%2Crequiressl%2Csource%2Cexpire&itag=278&ms=au%2Crdu&keepalive=yes&c=WEB&ei=O9XzW9-ZB9TlqAHBtpmADQ&lmt=1538405350863071&source=youtube&ratebypass=yes",
                        "vcodec": "vp9",
                        "format_note": "144p",
                        "player_url": "/yts/jsbin/player-vflWnjS_n/en_US/base.js",
                        "downloader_options": {
                            "http_chunk_size": 10485760
                        },
                        "width": 256,
                        "ext": "webm",
                        "filesize": 1349843,
                        "fps": 30,
                        "protocol": "https",
                        "format_id": "278",
                        "height": 144,
                        "quality": -1,
                        "acodec": "none"
                    },
                    {
                        "format_note": "144p",
                        "protocol": "https",
                        "format": "160 - 256x144 (144p)",
                        "tbr": 110.771,
                        "height": 144,
                        "downloader_options": {
                            "http_chunk_size": 10485760
                        },
                        "format_id": "160",
                        "quality": -1,
                        "http_headers": {
                            "Accept-Charset": "ISO-8859-1,utf-8;q=0.7,*;q=0.7",
                            "Accept-Language": "en-us,en;q=0.5",
                            "Accept-Encoding": "gzip, deflate",
                            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
                            "User-Agent": "Mozilla/5.0 (X11; Linux x86_64; rv:59.0) Gecko/20100101 Firefox/59.0"
                        },
                        "url": "https://r1---sn-i3b7kn76.googlevideo.com/videoplayback?clen=1501746&signature=152AF3212BD0FE5AB6167A625E23697A58624AAF.CBA49BECE67FF214F8A2801E4E7AA878B5EC6B30&aitags=133%2C134%2C135%2C136%2C137%2C160%2C242%2C243%2C244%2C247%2C248%2C278&txp=5533432&mime=video%2Fmp4&gir=yes&key=yt6&ipbits=0&dur=115.882&mv=m&expire=1542728091&fvip=6&mm=31%2C29&mn=sn-i3b7kn76%2Csn-i3beln7z&id=o-AFr-wAXueAzsWICNhdYh_fqNcmm5Cf4h1x4e2iHWGd-_&pl=18&ip=35.234.17.215&requiressl=yes&mt=1542706400&sparams=aitags%2Cclen%2Cdur%2Cei%2Cgir%2Cid%2Cip%2Cipbits%2Citag%2Ckeepalive%2Clmt%2Cmime%2Cmm%2Cmn%2Cms%2Cmv%2Cpl%2Crequiressl%2Csource%2Cexpire&itag=160&ms=au%2Crdu&keepalive=yes&c=WEB&ei=O9XzW9-ZB9TlqAHBtpmADQ&lmt=1538404992148404&source=youtube&ratebypass=yes",
                        "vcodec": "avc1.4d400c",
                        "player_url": "/yts/jsbin/player-vflWnjS_n/en_US/base.js",
                        "width": 256,
                        "ext": "mp4",
                        "filesize": 1501746,
                        "fps": 30,
                        "acodec": "none"
                    },
                    {
                        "format_note": "240p",
                        "protocol": "https",
                        "format": "242 - 426x240 (240p)",
                        "tbr": 230.614,
                        "height": 240,
                        "downloader_options": {
                            "http_chunk_size": 10485760
                        },
                        "format_id": "242",
                        "quality": -1,
                        "http_headers": {
                            "Accept-Charset": "ISO-8859-1,utf-8;q=0.7,*;q=0.7",
                            "Accept-Language": "en-us,en;q=0.5",
                            "Accept-Encoding": "gzip, deflate",
                            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
                            "User-Agent": "Mozilla/5.0 (X11; Linux x86_64; rv:59.0) Gecko/20100101 Firefox/59.0"
                        },
                        "url": "https://r1---sn-i3b7kn76.googlevideo.com/videoplayback?clen=3003522&signature=091C795006EB94CB23552D5F7FC9CB2F0494F85C.C31888B031D28860106379EE4607B8C39AC61132&aitags=133%2C134%2C135%2C136%2C137%2C160%2C242%2C243%2C244%2C247%2C248%2C278&txp=5533432&mime=video%2Fwebm&gir=yes&key=yt6&ipbits=0&dur=115.882&mv=m&expire=1542728091&fvip=6&mm=31%2C29&mn=sn-i3b7kn76%2Csn-i3beln7z&id=o-AFr-wAXueAzsWICNhdYh_fqNcmm5Cf4h1x4e2iHWGd-_&pl=18&ip=35.234.17.215&requiressl=yes&mt=1542706400&sparams=aitags%2Cclen%2Cdur%2Cei%2Cgir%2Cid%2Cip%2Cipbits%2Citag%2Ckeepalive%2Clmt%2Cmime%2Cmm%2Cmn%2Cms%2Cmv%2Cpl%2Crequiressl%2Csource%2Cexpire&itag=242&ms=au%2Crdu&keepalive=yes&c=WEB&ei=O9XzW9-ZB9TlqAHBtpmADQ&lmt=1538405289970800&source=youtube&ratebypass=yes",
                        "vcodec": "vp9",
                        "player_url": "/yts/jsbin/player-vflWnjS_n/en_US/base.js",
                        "width": 426,
                        "ext": "webm",
                        "filesize": 3003522,
                        "fps": 30,
                        "acodec": "none"
                    },
                    {
                        "format_note": "240p",
                        "protocol": "https",
                        "format": "133 - 426x240 (240p)",
                        "tbr": 298.619,
                        "height": 240,
                        "downloader_options": {
                            "http_chunk_size": 10485760
                        },
                        "format_id": "133",
                        "quality": -1,
                        "http_headers": {
                            "Accept-Charset": "ISO-8859-1,utf-8;q=0.7,*;q=0.7",
                            "Accept-Language": "en-us,en;q=0.5",
                            "Accept-Encoding": "gzip, deflate",
                            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
                            "User-Agent": "Mozilla/5.0 (X11; Linux x86_64; rv:59.0) Gecko/20100101 Firefox/59.0"
                        },
                        "url": "https://r1---sn-i3b7kn76.googlevideo.com/videoplayback?clen=3316873&signature=64A105FBF2A68C2220A58A19A040F373843B62E5.27AF23C1A212A3003752BDBBFA3D586907396AA4&aitags=133%2C134%2C135%2C136%2C137%2C160%2C242%2C243%2C244%2C247%2C248%2C278&txp=5533432&mime=video%2Fmp4&gir=yes&key=yt6&ipbits=0&dur=115.882&mv=m&expire=1542728091&fvip=6&mm=31%2C29&mn=sn-i3b7kn76%2Csn-i3beln7z&id=o-AFr-wAXueAzsWICNhdYh_fqNcmm5Cf4h1x4e2iHWGd-_&pl=18&ip=35.234.17.215&requiressl=yes&mt=1542706400&sparams=aitags%2Cclen%2Cdur%2Cei%2Cgir%2Cid%2Cip%2Cipbits%2Citag%2Ckeepalive%2Clmt%2Cmime%2Cmm%2Cmn%2Cms%2Cmv%2Cpl%2Crequiressl%2Csource%2Cexpire&itag=133&ms=au%2Crdu&keepalive=yes&c=WEB&ei=O9XzW9-ZB9TlqAHBtpmADQ&lmt=1538404993366672&source=youtube&ratebypass=yes",
                        "vcodec": "avc1.4d4015",
                        "player_url": "/yts/jsbin/player-vflWnjS_n/en_US/base.js",
                        "width": 426,
                        "ext": "mp4",
                        "filesize": 3316873,
                        "fps": 30,
                        "acodec": "none"
                    },
                    {
                        "format_note": "360p",
                        "protocol": "https",
                        "format": "243 - 640x360 (360p)",
                        "tbr": 421.872,
                        "height": 360,
                        "downloader_options": {
                            "http_chunk_size": 10485760
                        },
                        "format_id": "243",
                        "quality": -1,
                        "http_headers": {
                            "Accept-Charset": "ISO-8859-1,utf-8;q=0.7,*;q=0.7",
                            "Accept-Language": "en-us,en;q=0.5",
                            "Accept-Encoding": "gzip, deflate",
                            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
                            "User-Agent": "Mozilla/5.0 (X11; Linux x86_64; rv:59.0) Gecko/20100101 Firefox/59.0"
                        },
                        "url": "https://r1---sn-i3b7kn76.googlevideo.com/videoplayback?clen=5476904&signature=0D9D27192739E5D2BACABB270FCF54839CEBFE57.CBFCD97775F924852751F27F290A12E3BCE9BBFA&aitags=133%2C134%2C135%2C136%2C137%2C160%2C242%2C243%2C244%2C247%2C248%2C278&txp=5533432&mime=video%2Fwebm&gir=yes&key=yt6&ipbits=0&dur=115.882&mv=m&expire=1542728091&fvip=6&mm=31%2C29&mn=sn-i3b7kn76%2Csn-i3beln7z&id=o-AFr-wAXueAzsWICNhdYh_fqNcmm5Cf4h1x4e2iHWGd-_&pl=18&ip=35.234.17.215&requiressl=yes&mt=1542706400&sparams=aitags%2Cclen%2Cdur%2Cei%2Cgir%2Cid%2Cip%2Cipbits%2Citag%2Ckeepalive%2Clmt%2Cmime%2Cmm%2Cmn%2Cms%2Cmv%2Cpl%2Crequiressl%2Csource%2Cexpire&itag=243&ms=au%2Crdu&keepalive=yes&c=WEB&ei=O9XzW9-ZB9TlqAHBtpmADQ&lmt=1538405334827516&source=youtube&ratebypass=yes",
                        "vcodec": "vp9",
                        "player_url": "/yts/jsbin/player-vflWnjS_n/en_US/base.js",
                        "width": 640,
                        "ext": "webm",
                        "filesize": 5476904,
                        "fps": 30,
                        "acodec": "none"
                    },
                    {
                        "format_note": "360p",
                        "protocol": "https",
                        "format": "134 - 640x360 (360p)",
                        "tbr": 640.335,
                        "height": 360,
                        "downloader_options": {
                            "http_chunk_size": 10485760
                        },
                        "format_id": "134",
                        "quality": -1,
                        "http_headers": {
                            "Accept-Charset": "ISO-8859-1,utf-8;q=0.7,*;q=0.7",
                            "Accept-Language": "en-us,en;q=0.5",
                            "Accept-Encoding": "gzip, deflate",
                            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
                            "User-Agent": "Mozilla/5.0 (X11; Linux x86_64; rv:59.0) Gecko/20100101 Firefox/59.0"
                        },
                        "url": "https://r1---sn-i3b7kn76.googlevideo.com/videoplayback?clen=6874045&signature=ACAAD348623014AAE0AD5724D1D3E98E2D7DDBFD.BF609E966086418D459A097DF81F462C12BE3B1B&aitags=133%2C134%2C135%2C136%2C137%2C160%2C242%2C243%2C244%2C247%2C248%2C278&txp=5533432&mime=video%2Fmp4&gir=yes&key=yt6&ipbits=0&dur=115.882&mv=m&expire=1542728091&fvip=6&mm=31%2C29&mn=sn-i3b7kn76%2Csn-i3beln7z&id=o-AFr-wAXueAzsWICNhdYh_fqNcmm5Cf4h1x4e2iHWGd-_&pl=18&ip=35.234.17.215&requiressl=yes&mt=1542706400&sparams=aitags%2Cclen%2Cdur%2Cei%2Cgir%2Cid%2Cip%2Cipbits%2Citag%2Ckeepalive%2Clmt%2Cmime%2Cmm%2Cmn%2Cms%2Cmv%2Cpl%2Crequiressl%2Csource%2Cexpire&itag=134&ms=au%2Crdu&keepalive=yes&c=WEB&ei=O9XzW9-ZB9TlqAHBtpmADQ&lmt=1538404995156886&source=youtube&ratebypass=yes",
                        "vcodec": "avc1.4d401e",
                        "player_url": "/yts/jsbin/player-vflWnjS_n/en_US/base.js",
                        "width": 640,
                        "ext": "mp4",
                        "filesize": 6874045,
                        "fps": 30,
                        "acodec": "none"
                    },
                    {
                        "format_note": "480p",
                        "protocol": "https",
                        "format": "244 - 854x480 (480p)",
                        "tbr": 775.83,
                        "height": 480,
                        "downloader_options": {
                            "http_chunk_size": 10485760
                        },
                        "format_id": "244",
                        "quality": -1,
                        "http_headers": {
                            "Accept-Charset": "ISO-8859-1,utf-8;q=0.7,*;q=0.7",
                            "Accept-Language": "en-us,en;q=0.5",
                            "Accept-Encoding": "gzip, deflate",
                            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
                            "User-Agent": "Mozilla/5.0 (X11; Linux x86_64; rv:59.0) Gecko/20100101 Firefox/59.0"
                        },
                        "url": "https://r1---sn-i3b7kn76.googlevideo.com/videoplayback?clen=9801171&signature=BDA0AC044DE1712AA5864C47AE6F316238C724AC.633D9A761DDED68B22A07F93E51F14796EE23BCF&aitags=133%2C134%2C135%2C136%2C137%2C160%2C242%2C243%2C244%2C247%2C248%2C278&txp=5533432&mime=video%2Fwebm&gir=yes&key=yt6&ipbits=0&dur=115.882&mv=m&expire=1542728091&fvip=6&mm=31%2C29&mn=sn-i3b7kn76%2Csn-i3beln7z&id=o-AFr-wAXueAzsWICNhdYh_fqNcmm5Cf4h1x4e2iHWGd-_&pl=18&ip=35.234.17.215&requiressl=yes&mt=1542706400&sparams=aitags%2Cclen%2Cdur%2Cei%2Cgir%2Cid%2Cip%2Cipbits%2Citag%2Ckeepalive%2Clmt%2Cmime%2Cmm%2Cmn%2Cms%2Cmv%2Cpl%2Crequiressl%2Csource%2Cexpire&itag=244&ms=au%2Crdu&keepalive=yes&c=WEB&ei=O9XzW9-ZB9TlqAHBtpmADQ&lmt=1538405386518619&source=youtube&ratebypass=yes",
                        "vcodec": "vp9",
                        "player_url": "/yts/jsbin/player-vflWnjS_n/en_US/base.js",
                        "width": 854,
                        "ext": "webm",
                        "filesize": 9801171,
                        "fps": 30,
                        "acodec": "none"
                    },
                    {
                        "format_note": "480p",
                        "protocol": "https",
                        "format": "135 - 854x480 (480p)",
                        "tbr": 1123.67,
                        "height": 480,
                        "downloader_options": {
                            "http_chunk_size": 10485760
                        },
                        "format_id": "135",
                        "quality": -1,
                        "http_headers": {
                            "Accept-Charset": "ISO-8859-1,utf-8;q=0.7,*;q=0.7",
                            "Accept-Language": "en-us,en;q=0.5",
                            "Accept-Encoding": "gzip, deflate",
                            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
                            "User-Agent": "Mozilla/5.0 (X11; Linux x86_64; rv:59.0) Gecko/20100101 Firefox/59.0"
                        },
                        "url": "https://r1---sn-i3b7kn76.googlevideo.com/videoplayback?clen=11726835&signature=A2ADDE8EC0B90EB558582E4FF5BC99A69329D805.0BD4CF681462403EBAE7499BC7E6B487B9ED703A&aitags=133%2C134%2C135%2C136%2C137%2C160%2C242%2C243%2C244%2C247%2C248%2C278&txp=5533432&mime=video%2Fmp4&gir=yes&key=yt6&ipbits=0&dur=115.882&mv=m&expire=1542728091&fvip=6&mm=31%2C29&mn=sn-i3b7kn76%2Csn-i3beln7z&id=o-AFr-wAXueAzsWICNhdYh_fqNcmm5Cf4h1x4e2iHWGd-_&pl=18&ip=35.234.17.215&requiressl=yes&mt=1542706400&sparams=aitags%2Cclen%2Cdur%2Cei%2Cgir%2Cid%2Cip%2Cipbits%2Citag%2Ckeepalive%2Clmt%2Cmime%2Cmm%2Cmn%2Cms%2Cmv%2Cpl%2Crequiressl%2Csource%2Cexpire&itag=135&ms=au%2Crdu&keepalive=yes&c=WEB&ei=O9XzW9-ZB9TlqAHBtpmADQ&lmt=1538404996068027&source=youtube&ratebypass=yes",
                        "vcodec": "avc1.4d401f",
                        "player_url": "/yts/jsbin/player-vflWnjS_n/en_US/base.js",
                        "width": 854,
                        "ext": "mp4",
                        "filesize": 11726835,
                        "fps": 30,
                        "acodec": "none"
                    },
                    {
                        "format_note": "720p",
                        "protocol": "https",
                        "format": "247 - 1280x720 (720p)",
                        "tbr": 1536.409,
                        "height": 720,
                        "downloader_options": {
                            "http_chunk_size": 10485760
                        },
                        "format_id": "247",
                        "quality": -1,
                        "http_headers": {
                            "Accept-Charset": "ISO-8859-1,utf-8;q=0.7,*;q=0.7",
                            "Accept-Language": "en-us,en;q=0.5",
                            "Accept-Encoding": "gzip, deflate",
                            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
                            "User-Agent": "Mozilla/5.0 (X11; Linux x86_64; rv:59.0) Gecko/20100101 Firefox/59.0"
                        },
                        "url": "https://r1---sn-i3b7kn76.googlevideo.com/videoplayback?clen=17285666&signature=E005F8862946CFF2E37962170B9D944711B94FD5.55A4640A5E00EE59D289F90AA30D7A13BB96D842&aitags=133%2C134%2C135%2C136%2C137%2C160%2C242%2C243%2C244%2C247%2C248%2C278&txp=5533432&mime=video%2Fwebm&gir=yes&key=yt6&ipbits=0&dur=115.882&mv=m&expire=1542728091&fvip=6&mm=31%2C29&mn=sn-i3b7kn76%2Csn-i3beln7z&id=o-AFr-wAXueAzsWICNhdYh_fqNcmm5Cf4h1x4e2iHWGd-_&pl=18&ip=35.234.17.215&requiressl=yes&mt=1542706400&sparams=aitags%2Cclen%2Cdur%2Cei%2Cgir%2Cid%2Cip%2Cipbits%2Citag%2Ckeepalive%2Clmt%2Cmime%2Cmm%2Cmn%2Cms%2Cmv%2Cpl%2Crequiressl%2Csource%2Cexpire&itag=247&ms=au%2Crdu&keepalive=yes&c=WEB&ei=O9XzW9-ZB9TlqAHBtpmADQ&lmt=1538405340627693&source=youtube&ratebypass=yes",
                        "vcodec": "vp9",
                        "player_url": "/yts/jsbin/player-vflWnjS_n/en_US/base.js",
                        "width": 1280,
                        "ext": "webm",
                        "filesize": 17285666,
                        "fps": 30,
                        "acodec": "none"
                    },
                    {
                        "format_note": "720p",
                        "protocol": "https",
                        "format": "136 - 1280x720 (720p)",
                        "tbr": 1689.879,
                        "height": 720,
                        "downloader_options": {
                            "http_chunk_size": 10485760
                        },
                        "format_id": "136",
                        "quality": -1,
                        "http_headers": {
                            "Accept-Charset": "ISO-8859-1,utf-8;q=0.7,*;q=0.7",
                            "Accept-Language": "en-us,en;q=0.5",
                            "Accept-Encoding": "gzip, deflate",
                            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
                            "User-Agent": "Mozilla/5.0 (X11; Linux x86_64; rv:59.0) Gecko/20100101 Firefox/59.0"
                        },
                        "url": "https://r1---sn-i3b7kn76.googlevideo.com/videoplayback?clen=18871612&signature=CE5EBAEB87C2A960DF0A88019F4491852C9830A6.77B7BA333D125D096D4FD8886556C4D23A661D25&aitags=133%2C134%2C135%2C136%2C137%2C160%2C242%2C243%2C244%2C247%2C248%2C278&txp=5533432&mime=video%2Fmp4&gir=yes&key=yt6&ipbits=0&dur=115.882&mv=m&expire=1542728091&fvip=6&mm=31%2C29&mn=sn-i3b7kn76%2Csn-i3beln7z&id=o-AFr-wAXueAzsWICNhdYh_fqNcmm5Cf4h1x4e2iHWGd-_&pl=18&ip=35.234.17.215&requiressl=yes&mt=1542706400&sparams=aitags%2Cclen%2Cdur%2Cei%2Cgir%2Cid%2Cip%2Cipbits%2Citag%2Ckeepalive%2Clmt%2Cmime%2Cmm%2Cmn%2Cms%2Cmv%2Cpl%2Crequiressl%2Csource%2Cexpire&itag=136&ms=au%2Crdu&keepalive=yes&c=WEB&ei=O9XzW9-ZB9TlqAHBtpmADQ&lmt=1538405022939543&source=youtube&ratebypass=yes",
                        "vcodec": "avc1.4d401f",
                        "player_url": "/yts/jsbin/player-vflWnjS_n/en_US/base.js",
                        "width": 1280,
                        "ext": "mp4",
                        "filesize": 18871612,
                        "fps": 30,
                        "acodec": "none"
                    },
                    {
                        "format_note": "1080p",
                        "protocol": "https",
                        "format": "248 - 1920x1080 (1080p)",
                        "tbr": 2699.918,
                        "height": 1080,
                        "downloader_options": {
                            "http_chunk_size": 10485760
                        },
                        "format_id": "248",
                        "quality": -1,
                        "http_headers": {
                            "Accept-Charset": "ISO-8859-1,utf-8;q=0.7,*;q=0.7",
                            "Accept-Language": "en-us,en;q=0.5",
                            "Accept-Encoding": "gzip, deflate",
                            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
                            "User-Agent": "Mozilla/5.0 (X11; Linux x86_64; rv:59.0) Gecko/20100101 Firefox/59.0"
                        },
                        "url": "https://r1---sn-i3b7kn76.googlevideo.com/videoplayback?clen=28092559&signature=6850D6A4FA401BA6BF1C6B30919DFF1C35396DDE.6E12241BAAF200D942761F255A1DA6AAD055B4DD&aitags=133%2C134%2C135%2C136%2C137%2C160%2C242%2C243%2C244%2C247%2C248%2C278&txp=5533432&mime=video%2Fwebm&gir=yes&key=yt6&ipbits=0&dur=115.882&mv=m&expire=1542728091&fvip=6&mm=31%2C29&mn=sn-i3b7kn76%2Csn-i3beln7z&id=o-AFr-wAXueAzsWICNhdYh_fqNcmm5Cf4h1x4e2iHWGd-_&pl=18&ip=35.234.17.215&requiressl=yes&mt=1542706400&sparams=aitags%2Cclen%2Cdur%2Cei%2Cgir%2Cid%2Cip%2Cipbits%2Citag%2Ckeepalive%2Clmt%2Cmime%2Cmm%2Cmn%2Cms%2Cmv%2Cpl%2Crequiressl%2Csource%2Cexpire&itag=248&ms=au%2Crdu&keepalive=yes&c=WEB&ei=O9XzW9-ZB9TlqAHBtpmADQ&lmt=1538405452328471&source=youtube&ratebypass=yes",
                        "vcodec": "vp9",
                        "player_url": "/yts/jsbin/player-vflWnjS_n/en_US/base.js",
                        "width": 1920,
                        "ext": "webm",
                        "filesize": 28092559,
                        "fps": 30,
                        "acodec": "none"
                    },
                    {
                        "format_note": "1080p",
                        "protocol": "https",
                        "format": "137 - 1920x1080 (1080p)",
                        "tbr": 2874.803,
                        "height": 1080,
                        "downloader_options": {
                            "http_chunk_size": 10485760
                        },
                        "format_id": "137",
                        "quality": -1,
                        "http_headers": {
                            "Accept-Charset": "ISO-8859-1,utf-8;q=0.7,*;q=0.7",
                            "Accept-Language": "en-us,en;q=0.5",
                            "Accept-Encoding": "gzip, deflate",
                            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
                            "User-Agent": "Mozilla/5.0 (X11; Linux x86_64; rv:59.0) Gecko/20100101 Firefox/59.0"
                        },
                        "url": "https://r1---sn-i3b7kn76.googlevideo.com/videoplayback?clen=29010224&signature=50C7A31E19FD2B1935479CA33C5F6A45EC851CDE.C480FE5B0549E821363C7E32170E7D5CB9B528FF&aitags=133%2C134%2C135%2C136%2C137%2C160%2C242%2C243%2C244%2C247%2C248%2C278&txp=5533432&mime=video%2Fmp4&gir=yes&key=yt6&ipbits=0&dur=115.882&mv=m&expire=1542728091&fvip=6&mm=31%2C29&mn=sn-i3b7kn76%2Csn-i3beln7z&id=o-AFr-wAXueAzsWICNhdYh_fqNcmm5Cf4h1x4e2iHWGd-_&pl=18&ip=35.234.17.215&requiressl=yes&mt=1542706400&sparams=aitags%2Cclen%2Cdur%2Cei%2Cgir%2Cid%2Cip%2Cipbits%2Citag%2Ckeepalive%2Clmt%2Cmime%2Cmm%2Cmn%2Cms%2Cmv%2Cpl%2Crequiressl%2Csource%2Cexpire&itag=137&ms=au%2Crdu&keepalive=yes&c=WEB&ei=O9XzW9-ZB9TlqAHBtpmADQ&lmt=1538405051771398&source=youtube&ratebypass=yes",
                        "vcodec": "avc1.640028",
                        "player_url": "/yts/jsbin/player-vflWnjS_n/en_US/base.js",
                        "width": 1920,
                        "ext": "mp4",
                        "filesize": 29010224,
                        "fps": 30,
                        "acodec": "none"
                    },
                    {
                        "http_headers": {
                            "Accept-Charset": "ISO-8859-1,utf-8;q=0.7,*;q=0.7",
                            "Accept-Language": "en-us,en;q=0.5",
                            "Accept-Encoding": "gzip, deflate",
                            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
                            "User-Agent": "Mozilla/5.0 (X11; Linux x86_64; rv:59.0) Gecko/20100101 Firefox/59.0"
                        },
                        "protocol": "https",
                        "format": "17 - 176x144 (small)",
                        "url": "https://r1---sn-i3b7kn76.googlevideo.com/videoplayback?mm=31%2C29&mn=sn-i3b7kn76%2Csn-i3beln7z&id=o-AFr-wAXueAzsWICNhdYh_fqNcmm5Cf4h1x4e2iHWGd-_&pl=18&clen=1156624&signature=68BF5D64E6402233316DCD504F127804583BD41B.DDE8CC6B4EF15E72F78BEC897CE051B8A112A4D2&ip=35.234.17.215&requiressl=yes&txp=5531432&mt=1542706400&sparams=clen%2Cdur%2Cei%2Cgir%2Cid%2Cip%2Cipbits%2Citag%2Clmt%2Cmime%2Cmm%2Cmn%2Cms%2Cmv%2Cpl%2Crequiressl%2Csource%2Cexpire&itag=17&mime=video%2F3gpp&gir=yes&key=yt6&ipbits=0&dur=116.006&mv=m&c=WEB&expire=1542728091&ei=O9XzW9-ZB9TlqAHBtpmADQ&lmt=1538403070123695&ms=au%2Crdu&source=youtube&fvip=6&ratebypass=yes",
                        "vcodec": "mp4v.20.3",
                        "format_note": "small",
                        "ext": "3gp",
                        "player_url": "/yts/jsbin/player-vflWnjS_n/en_US/base.js",
                        "width": 176,
                        "abr": 24,
                        "filesize": 1156624,
                        "format_id": "17",
                        "height": 144,
                        "resolution": "176x144",
                        "acodec": "mp4a.40.2"
                    },
                    {
                        "protocol": "https",
                        "format": "36 - 320x180 (small)",
                        "format_note": "small",
                        "height": 180,
                        "format_id": "36",
                        "http_headers": {
                            "Accept-Charset": "ISO-8859-1,utf-8;q=0.7,*;q=0.7",
                            "Accept-Language": "en-us,en;q=0.5",
                            "Accept-Encoding": "gzip, deflate",
                            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
                            "User-Agent": "Mozilla/5.0 (X11; Linux x86_64; rv:59.0) Gecko/20100101 Firefox/59.0"
                        },
                        "url": "https://r1---sn-i3b7kn76.googlevideo.com/videoplayback?mm=31%2C29&mn=sn-i3b7kn76%2Csn-i3beln7z&id=o-AFr-wAXueAzsWICNhdYh_fqNcmm5Cf4h1x4e2iHWGd-_&pl=18&clen=3151699&signature=21696D581086AED4E49E9556C96430F8FE8995BD.DA9433348B97F2DB7F22443E48C3A659BF86E579&ip=35.234.17.215&requiressl=yes&txp=5531432&mt=1542706400&sparams=clen%2Cdur%2Cei%2Cgir%2Cid%2Cip%2Cipbits%2Citag%2Clmt%2Cmime%2Cmm%2Cmn%2Cms%2Cmv%2Cpl%2Crequiressl%2Csource%2Cexpire&itag=36&mime=video%2F3gpp&gir=yes&key=yt6&ipbits=0&dur=116.006&mv=m&c=WEB&expire=1542728091&ei=O9XzW9-ZB9TlqAHBtpmADQ&lmt=1538403070122804&ms=au%2Crdu&source=youtube&fvip=6&ratebypass=yes",
                        "vcodec": "mp4v.20.3",
                        "player_url": "/yts/jsbin/player-vflWnjS_n/en_US/base.js",
                        "width": 320,
                        "ext": "3gp",
                        "filesize": 3151699,
                        "resolution": "320x180",
                        "acodec": "mp4a.40.2"
                    },
                    {
                        "http_headers": {
                            "Accept-Charset": "ISO-8859-1,utf-8;q=0.7,*;q=0.7",
                            "Accept-Language": "en-us,en;q=0.5",
                            "Accept-Encoding": "gzip, deflate",
                            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
                            "User-Agent": "Mozilla/5.0 (X11; Linux x86_64; rv:59.0) Gecko/20100101 Firefox/59.0"
                        },
                        "protocol": "https",
                        "format": "18 - 640x360 (medium)",
                        "url": "https://r1---sn-i3b7kn76.googlevideo.com/videoplayback?clen=10364468&itag=18&txp=5531432&mime=video%2Fmp4&gir=yes&key=yt6&ipbits=0&dur=115.937&mv=m&ratebypass=yes&expire=1542728091&fvip=6&mm=31%2C29&mn=sn-i3b7kn76%2Csn-i3beln7z&id=o-AFr-wAXueAzsWICNhdYh_fqNcmm5Cf4h1x4e2iHWGd-_&pl=18&ip=35.234.17.215&requiressl=yes&mt=1542706400&sparams=clen%2Cdur%2Cei%2Cgir%2Cid%2Cip%2Cipbits%2Citag%2Clmt%2Cmime%2Cmm%2Cmn%2Cms%2Cmv%2Cpl%2Cratebypass%2Crequiressl%2Csource%2Cexpire&signature=C76D6CD4827A8E262FA5B89F1A3B0E49FB1D52E2.29F3123C9B6FA072830EAF6EDF64BB60583A8FCD&ms=au%2Crdu&c=WEB&ei=O9XzW9-ZB9TlqAHBtpmADQ&lmt=1538403070625914&source=youtube",
                        "quality": 1,
                        "vcodec": "avc1.42001E",
                        "format_note": "medium",
                        "ext": "mp4",
                        "player_url": "/yts/jsbin/player-vflWnjS_n/en_US/base.js",
                        "width": 640,
                        "abr": 96,
                        "filesize": 10364468,
                        "format_id": "18",
                        "height": 360,
                        "resolution": "640x360",
                        "acodec": "mp4a.40.2"
                    },
                    {
                        "http_headers": {
                            "Accept-Charset": "ISO-8859-1,utf-8;q=0.7,*;q=0.7",
                            "Accept-Language": "en-us,en;q=0.5",
                            "Accept-Encoding": "gzip, deflate",
                            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
                            "User-Agent": "Mozilla/5.0 (X11; Linux x86_64; rv:59.0) Gecko/20100101 Firefox/59.0"
                        },
                        "protocol": "https",
                        "format": "43 - 640x360 (medium)",
                        "url": "https://r1---sn-i3b7kn76.googlevideo.com/videoplayback?clen=12898499&itag=43&txp=5511222&mime=video%2Fwebm&gir=yes&key=yt6&ipbits=0&dur=0.000&mv=m&ratebypass=yes&expire=1542728091&fvip=6&mm=31%2C29&mn=sn-i3b7kn76%2Csn-i3beln7z&id=o-AFr-wAXueAzsWICNhdYh_fqNcmm5Cf4h1x4e2iHWGd-_&pl=18&ip=35.234.17.215&requiressl=yes&mt=1542706400&sparams=clen%2Cdur%2Cei%2Cgir%2Cid%2Cip%2Cipbits%2Citag%2Clmt%2Cmime%2Cmm%2Cmn%2Cms%2Cmv%2Cpl%2Cratebypass%2Crequiressl%2Csource%2Cexpire&signature=835E1ACBE35494BE285A4331C7FC045551D80119.D93AEDA84181836E612C1070F94EAE49A567235A&ms=au%2Crdu&c=WEB&ei=O9XzW9-ZB9TlqAHBtpmADQ&lmt=1538405853842976&source=youtube",
                        "quality": 1,
                        "vcodec": "vp8.0",
                        "format_note": "medium",
                        "ext": "webm",
                        "player_url": "/yts/jsbin/player-vflWnjS_n/en_US/base.js",
                        "width": 640,
                        "abr": 128,
                        "filesize": 12898499,
                        "format_id": "43",
                        "height": 360,
                        "resolution": "640x360",
                        "acodec": "vorbis"
                    },
                    {
                        "http_headers": {
                            "Accept-Charset": "ISO-8859-1,utf-8;q=0.7,*;q=0.7",
                            "Accept-Language": "en-us,en;q=0.5",
                            "Accept-Encoding": "gzip, deflate",
                            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
                            "User-Agent": "Mozilla/5.0 (X11; Linux x86_64; rv:59.0) Gecko/20100101 Firefox/59.0"
                        },
                        "protocol": "https",
                        "format": "22 - 1280x720 (hd720)",
                        "url": "https://r1---sn-i3b7kn76.googlevideo.com/videoplayback?mm=31%2C29&mn=sn-i3b7kn76%2Csn-i3beln7z&id=o-AFr-wAXueAzsWICNhdYh_fqNcmm5Cf4h1x4e2iHWGd-_&pl=18&itag=22&ip=35.234.17.215&requiressl=yes&txp=5531432&mt=1542706400&sparams=dur%2Cei%2Cid%2Cip%2Cipbits%2Citag%2Clmt%2Cmime%2Cmm%2Cmn%2Cms%2Cmv%2Cpl%2Cratebypass%2Crequiressl%2Csource%2Cexpire&signature=82907E0BE9328DF5C84321247592A4872D1357AD.B202109A618C1320D19A030798EF2139331F575C&mime=video%2Fmp4&key=yt6&ipbits=0&dur=115.937&mv=m&ratebypass=yes&c=WEB&expire=1542728091&ei=O9XzW9-ZB9TlqAHBtpmADQ&lmt=1538405099934063&ms=au%2Crdu&source=youtube&fvip=6",
                        "quality": 2,
                        "vcodec": "avc1.64001F",
                        "format_note": "hd720",
                        "ext": "mp4",
                        "player_url": "/yts/jsbin/player-vflWnjS_n/en_US/base.js",
                        "width": 1280,
                        "abr": 192,
                        "format_id": "22",
                        "height": 720,
                        "resolution": "1280x720",
                        "acodec": "mp4a.40.2"
                    }
                ],
                "channel_url": "http://www.youtube.com/channel/UCKAqou7V9FAWXpZd9xtOg3Q",
                "resolution": null,
                "width": 1920,
                "age_limit": 0
            },
            
        }
    },
    created: function () {
        // `this` points to the vm instance
        console.log('Vue Component created: ')
        db.videos.allDocs({ include_docs: true }).then(function (info) {
            console.log(info)
        })

        this.getSortFormatList(this.videoInfo.formats)
    },
    
    methods: {
        onSubmit (type) {
            console.log('formData: ', this.formData)
            this.isShowLoading = true
            
            const tempVideoIdIndex = this.formData.videoUrl.indexOf('?v=')
            
            const tempVideoId = this.formData.videoUrl.substr(tempVideoIdIndex + 3, 11)

            console.log(tempVideoIdIndex, tempVideoId)
            
            if (this.formData.videoUrl) {
                db.videos.put({
                    _id: tempVideoId,
                    title: '',
                    url: this.formData.videoUrl,
                }).then(function (info) {
                    console.log(info)
                })
            }
           
            
            if (type === 'download') {
                downloadVideo(this.formData.videoUrl, this.downloadSavePath + '/' + tempVideoId, this.youtubeDlOptions).then((result) => {
                    this.downloadLog = result.message
                    this.downloadError = result.error
                    console.log('result: ', result)
                })
            } else {
                getVideoInfo(this.formData.videoUrl, this.downloadSavePath + '/' + tempVideoId, this.youtubeDlOptions).then((result) => {
                    this.videoInfo = result.message
                    this.downloadError = result.error
                    this.isShowLoading = false
                    console.log(this.videoInfo)
                    this.getSortFormatList(this.videoInfo.formats)
                })
            }
        },
        
        onReset () {
            /* Reset our form values */
            this.formData.videoUrl = ''
            this.formData.videoTitle = null
            this.downloadLog = []
            this.downloadError = []
        },

        getSortFormatList (videoFormatList = []) {
            
            const tempAudio = []
            const tempVideo = []
            
            if (Array.isArray(videoFormatList)) {
                videoFormatList.forEach( (format) => {
                    if (format.vcodec === 'none') {
                        tempAudio.push(format)
                    } else {
                        tempVideo.push(format)
                    }
                })

                tempAudio.sort( (a, b) => {
                    if (a.ext === b.ext) {
                        if (a.filesize === b.filesize) {
                            return 0
                        }
                        return a.filesize < b.filesize ? 1 : -1
                    }
                    return a.ext < b.ext ? 1 : -1
                })

                tempVideo.sort( (a, b) => {
                    if (a.ext === b.ext) {
                        if (a.filesize === b.filesize) {
                            return 0
                        }
                        return a.filesize < b.filesize ? 1 : -1
                    }
                    return a.ext < b.ext ? 1 : -1
                })

               
                
                this.videoFormatList = [...tempVideo, ...tempAudio]
            }
        },
    },
}
</script>
