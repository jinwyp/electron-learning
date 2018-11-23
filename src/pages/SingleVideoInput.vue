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
                    <span>{{ videoInfo.title }} </span>
                </div>
                
                <div class="main-info">
                    <div class="image-box">
                        <img :src="videoInfo.thumbnail" alt="">
                    </div>
                    <div class="description">
                        
                        <span> ID: <a :href="videoInfo.webpage_url">{{ videoInfo.id }}</a>  </span>
                        <span> 上传时间: {{ videoInfo.upload_date | dateDisplay }}  </span>
                        <span> 时长: {{ videoInfo.duration | duration }}  </span>
                        <br>
                        <span> 上传者: {{ videoInfo.uploader }} </span>
                        <br>
                        <span> 浏览量: {{ videoInfo.view_count | numberDisplay }} </span>
                        <span> 喜欢: {{ videoInfo.like_count | numberDisplay }} </span>
                        <span>不喜欢: {{ videoInfo.dislike_count | numberDisplay }} </span>
                    </div>
                </div>

                <div v-if="false">
                    {{ videoInfo.description }}
                </div>

                <el-table :data="videoFormatList" border stripe size="mini" :show-header="true">
                    <el-table-column prop="ext" label="格式" width="220">
                        <template slot-scope="scope">
                            <span v-if="scope.row.vcodec === 'none' ">Audio {{ scope.row.ext }} - {{scope.row.format_note}}</span>
                            <span v-if="scope.row.vcodec !== 'none' ">Video {{scope.row.format_note}} ({{ scope.row.width }}x{{ scope.row.height }}) .{{ scope.row.ext }}</span>
                        </template>
                    </el-table-column>

                    <el-table-column prop="filesize" label="文件大小" width="90">
                        <template slot-scope="scope">
                            <span v-if="scope.row.vcodec === 'none' ">{{ scope.row.filesize | sizeDisplay }} </span>
                            <span v-if="scope.row.vcodec !== 'none' "> {{ scope.row.filesize | sizeDisplay }} </span>
                        </template>
                    </el-table-column>

                    <el-table-column prop="ext" label="操作" width="80">
                        <template slot-scope="scope">
                            <el-button type="primary" plain size="mini">下载</el-button>
                        </template>
                    </el-table-column>
                    
                    <el-table-column prop="acodec" label="其他信息">
                        <template slot-scope="scope">
                            <span v-if="scope.row.vcodec !== 'none' ">Video codec: {{ scope.row.vcodec }} <span v-show="scope.row.tbr">({{ scope.row.tbr }} Kbps) </span> <span v-show="scope.row.vbr">({{ scope.row.vbr }} Kbps) </span></span>
                            <span v-if="scope.row.acodec !== 'none' "> - Audio codec: {{ scope.row.acodec }} <span v-show="scope.row.abr">({{ scope.row.abr }} Kbps)</span></span>
                        </template>
                    </el-table-column>
                    
                   
                </el-table>
                
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
                "like_count": 1225,
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
                        "url": "https://r1---sn-i3b7kn76.googlevideo.com/videoplayback?c=WEB&mt=1542965259&pl=18&requiressl=yes&txp=5533432&aitags=133%2C134%2C135%2C136%2C137%2C160%2C242%2C243%2C244%2C247%2C248%2C278&signature=41EEA6DD5B2FD344559864C00AAB455F52CA8583.625DBF7DFF068376DBB55C4D58E18791C265CF98&ipbits=0&key=yt6&ip=35.234.17.215&ei=hMj3W-moC9C84ALrgLywBQ&id=o-AFVob4BNIWDTsUQ0sYhJVsPH4OaCc6s7GJsclP3hRkiJ&gir=yes&dur=115.882&mn=sn-i3b7kn76%2Csn-i3beln7z&mm=31%2C29&ms=au%2Crdu&mv=m&fvip=6&clen=29010224&lmt=1538405051771398&keepalive=yes&mime=video%2Fmp4&source=youtube&sparams=aitags%2Cclen%2Cdur%2Cei%2Cgir%2Cid%2Cip%2Cipbits%2Citag%2Ckeepalive%2Clmt%2Cmime%2Cmm%2Cmn%2Cms%2Cmv%2Cpl%2Crequiressl%2Csource%2Cexpire&expire=1542986980&itag=137&ratebypass=yes",
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
                        "player_url": "/yts/jsbin/player-vfl718orE/en_US/base.js",
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
                        "url": "https://r1---sn-i3b7kn76.googlevideo.com/videoplayback?c=WEB&mt=1542965259&pl=18&requiressl=yes&txp=5511222&signature=2954F789204970CDE2D9A14000E72FC01A3599F2.87058FCD0397BB7E12FC2DF2096BA76A95B14606&ipbits=0&key=yt6&ip=35.234.17.215&ei=hMj3W-moC9C84ALrgLywBQ&id=o-AFVob4BNIWDTsUQ0sYhJVsPH4OaCc6s7GJsclP3hRkiJ&gir=yes&dur=115.901&mn=sn-i3b7kn76%2Csn-i3beln7z&mm=31%2C29&ms=au%2Crdu&mv=m&fvip=6&clen=2053204&lmt=1538405775783677&keepalive=yes&mime=audio%2Fwebm&source=youtube&sparams=clen%2Cdur%2Cei%2Cgir%2Cid%2Cip%2Cipbits%2Citag%2Ckeepalive%2Clmt%2Cmime%2Cmm%2Cmn%2Cms%2Cmv%2Cpl%2Crequiressl%2Csource%2Cexpire&expire=1542986980&itag=251&ratebypass=yes",
                        "vcodec": "none",
                        "tbr": 157.566,
                        "abr": 160,
                        "player_url": "/yts/jsbin/player-vfl718orE/en_US/base.js",
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
                "view_count": 1008007,
                "playlist": null,
                "title": "Halloween is Dress Up Time | Halloween Songs For Kids | BRAND NEW! | Little Baby Bum",
                "_filename": "Halloween is Dress Up Time _ Halloween Songs For Kids _ BRAND NEW! _ Little Baby Bum-by0e4didQpM.mp4",
                "creator": null,
                "ext": "mp4",
                "id": "by0e4didQpM",
                "dislike_count": 566,
                "average_rating": 3.70926523209,
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
                        "url": "https://r1---sn-i3b7kn76.googlevideo.com/videoplayback?c=WEB&mt=1542965259&pl=18&requiressl=yes&txp=5511222&signature=71755047DCD9F9228033CADB34EF6BBEF3DE99D7.2356ED39FE45BA508EC74AF4FD182F9078AAB581&ipbits=0&key=yt6&ip=35.234.17.215&ei=hMj3W-moC9C84ALrgLywBQ&id=o-AFVob4BNIWDTsUQ0sYhJVsPH4OaCc6s7GJsclP3hRkiJ&gir=yes&dur=115.901&mn=sn-i3b7kn76%2Csn-i3beln7z&mm=31%2C29&ms=au%2Crdu&mv=m&fvip=6&clen=807573&lmt=1538405775891154&keepalive=yes&mime=audio%2Fwebm&source=youtube&sparams=clen%2Cdur%2Cei%2Cgir%2Cid%2Cip%2Cipbits%2Citag%2Ckeepalive%2Clmt%2Cmime%2Cmm%2Cmn%2Cms%2Cmv%2Cpl%2Crequiressl%2Csource%2Cexpire&expire=1542986980&itag=249&ratebypass=yes",
                        "vcodec": "none",
                        "tbr": 63.914,
                        "abr": 50,
                        "player_url": "/yts/jsbin/player-vfl718orE/en_US/base.js",
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
                        "url": "https://r1---sn-i3b7kn76.googlevideo.com/videoplayback?c=WEB&mt=1542965259&pl=18&requiressl=yes&txp=5511222&signature=7856066443BC4C29DD81E21AE77A5CA5DA104913.27327B223A8688A2E9F669BCDE197C2EA78114BD&ipbits=0&key=yt6&ip=35.234.17.215&ei=hMj3W-moC9C84ALrgLywBQ&id=o-AFVob4BNIWDTsUQ0sYhJVsPH4OaCc6s7GJsclP3hRkiJ&gir=yes&dur=115.901&mn=sn-i3b7kn76%2Csn-i3beln7z&mm=31%2C29&ms=au%2Crdu&mv=m&fvip=6&clen=1057550&lmt=1538405775608541&keepalive=yes&mime=audio%2Fwebm&source=youtube&sparams=clen%2Cdur%2Cei%2Cgir%2Cid%2Cip%2Cipbits%2Citag%2Ckeepalive%2Clmt%2Cmime%2Cmm%2Cmn%2Cms%2Cmv%2Cpl%2Crequiressl%2Csource%2Cexpire&expire=1542986980&itag=250&ratebypass=yes",
                        "vcodec": "none",
                        "tbr": 83.038,
                        "abr": 70,
                        "player_url": "/yts/jsbin/player-vfl718orE/en_US/base.js",
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
                        "url": "https://r1---sn-i3b7kn76.googlevideo.com/videoplayback?c=WEB&mt=1542965259&pl=18&requiressl=yes&txp=5533432&signature=9CBF5F158959B03B21B428CF005FA59787321E21.94C3F4D391BC6752313990B78DD046636A6E439F&ipbits=0&key=yt6&ip=35.234.17.215&ei=hMj3W-moC9C84ALrgLywBQ&id=o-AFVob4BNIWDTsUQ0sYhJVsPH4OaCc6s7GJsclP3hRkiJ&gir=yes&dur=115.937&mn=sn-i3b7kn76%2Csn-i3beln7z&mm=31%2C29&ms=au%2Crdu&mv=m&fvip=6&clen=1842032&lmt=1538404681522122&keepalive=yes&mime=audio%2Fmp4&source=youtube&sparams=clen%2Cdur%2Cei%2Cgir%2Cid%2Cip%2Cipbits%2Citag%2Ckeepalive%2Clmt%2Cmime%2Cmm%2Cmn%2Cms%2Cmv%2Cpl%2Crequiressl%2Csource%2Cexpire&expire=1542986980&itag=140&ratebypass=yes",
                        "vcodec": "none",
                        "format_note": "DASH audio",
                        "abr": 128,
                        "player_url": "/yts/jsbin/player-vfl718orE/en_US/base.js",
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
                        "url": "https://r1---sn-i3b7kn76.googlevideo.com/videoplayback?c=WEB&mt=1542965259&pl=18&requiressl=yes&txp=5511222&signature=14DC703A0B928623F58157655B3967D6E752A702.6C5CDD448252FBC5162DA826CBFB7741E806D902&ipbits=0&key=yt6&ip=35.234.17.215&ei=hMj3W-moC9C84ALrgLywBQ&id=o-AFVob4BNIWDTsUQ0sYhJVsPH4OaCc6s7GJsclP3hRkiJ&gir=yes&dur=115.883&mn=sn-i3b7kn76%2Csn-i3beln7z&mm=31%2C29&ms=au%2Crdu&mv=m&fvip=6&clen=1793763&lmt=1538405776390855&keepalive=yes&mime=audio%2Fwebm&source=youtube&sparams=clen%2Cdur%2Cei%2Cgir%2Cid%2Cip%2Cipbits%2Citag%2Ckeepalive%2Clmt%2Cmime%2Cmm%2Cmn%2Cms%2Cmv%2Cpl%2Crequiressl%2Csource%2Cexpire&expire=1542986980&itag=171&ratebypass=yes",
                        "vcodec": "none",
                        "tbr": 129.877,
                        "abr": 128,
                        "player_url": "/yts/jsbin/player-vfl718orE/en_US/base.js",
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
                        "url": "https://r1---sn-i3b7kn76.googlevideo.com/videoplayback?c=WEB&mt=1542965259&pl=18&requiressl=yes&txp=5511222&signature=2954F789204970CDE2D9A14000E72FC01A3599F2.87058FCD0397BB7E12FC2DF2096BA76A95B14606&ipbits=0&key=yt6&ip=35.234.17.215&ei=hMj3W-moC9C84ALrgLywBQ&id=o-AFVob4BNIWDTsUQ0sYhJVsPH4OaCc6s7GJsclP3hRkiJ&gir=yes&dur=115.901&mn=sn-i3b7kn76%2Csn-i3beln7z&mm=31%2C29&ms=au%2Crdu&mv=m&fvip=6&clen=2053204&lmt=1538405775783677&keepalive=yes&mime=audio%2Fwebm&source=youtube&sparams=clen%2Cdur%2Cei%2Cgir%2Cid%2Cip%2Cipbits%2Citag%2Ckeepalive%2Clmt%2Cmime%2Cmm%2Cmn%2Cms%2Cmv%2Cpl%2Crequiressl%2Csource%2Cexpire&expire=1542986980&itag=251&ratebypass=yes",
                        "vcodec": "none",
                        "tbr": 157.566,
                        "abr": 160,
                        "player_url": "/yts/jsbin/player-vfl718orE/en_US/base.js",
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
                        "url": "https://r1---sn-i3b7kn76.googlevideo.com/videoplayback?c=WEB&mt=1542965259&pl=18&requiressl=yes&txp=5533432&aitags=133%2C134%2C135%2C136%2C137%2C160%2C242%2C243%2C244%2C247%2C248%2C278&signature=D76737AD6815466EDF235C3BF335A45D67AF5795.3C860BCA7E78FC6B46509D1BF3AC0945C30926F3&ipbits=0&key=yt6&ip=35.234.17.215&ei=hMj3W-moC9C84ALrgLywBQ&id=o-AFVob4BNIWDTsUQ0sYhJVsPH4OaCc6s7GJsclP3hRkiJ&gir=yes&dur=115.882&mn=sn-i3b7kn76%2Csn-i3beln7z&mm=31%2C29&ms=au%2Crdu&mv=m&fvip=6&clen=1349843&lmt=1538405350863071&keepalive=yes&mime=video%2Fwebm&source=youtube&sparams=aitags%2Cclen%2Cdur%2Cei%2Cgir%2Cid%2Cip%2Cipbits%2Citag%2Ckeepalive%2Clmt%2Cmime%2Cmm%2Cmn%2Cms%2Cmv%2Cpl%2Crequiressl%2Csource%2Cexpire&expire=1542986980&itag=278&ratebypass=yes",
                        "vcodec": "vp9",
                        "format_note": "144p",
                        "player_url": "/yts/jsbin/player-vfl718orE/en_US/base.js",
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
                        "url": "https://r1---sn-i3b7kn76.googlevideo.com/videoplayback?c=WEB&mt=1542965259&pl=18&requiressl=yes&txp=5533432&aitags=133%2C134%2C135%2C136%2C137%2C160%2C242%2C243%2C244%2C247%2C248%2C278&signature=79C63CA887A7A011196B13CEB4347062C281B9D5.5CA1765EB10E92D68ECA33A483818D8DC667DCB0&ipbits=0&key=yt6&ip=35.234.17.215&ei=hMj3W-moC9C84ALrgLywBQ&id=o-AFVob4BNIWDTsUQ0sYhJVsPH4OaCc6s7GJsclP3hRkiJ&gir=yes&dur=115.882&mn=sn-i3b7kn76%2Csn-i3beln7z&mm=31%2C29&ms=au%2Crdu&mv=m&fvip=6&clen=1501746&lmt=1538404992148404&keepalive=yes&mime=video%2Fmp4&source=youtube&sparams=aitags%2Cclen%2Cdur%2Cei%2Cgir%2Cid%2Cip%2Cipbits%2Citag%2Ckeepalive%2Clmt%2Cmime%2Cmm%2Cmn%2Cms%2Cmv%2Cpl%2Crequiressl%2Csource%2Cexpire&expire=1542986980&itag=160&ratebypass=yes",
                        "vcodec": "avc1.4d400c",
                        "player_url": "/yts/jsbin/player-vfl718orE/en_US/base.js",
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
                        "url": "https://r1---sn-i3b7kn76.googlevideo.com/videoplayback?c=WEB&mt=1542965259&pl=18&requiressl=yes&txp=5533432&aitags=133%2C134%2C135%2C136%2C137%2C160%2C242%2C243%2C244%2C247%2C248%2C278&signature=BAA336135ABBE90423C693BF99DF700543AEBB3D.253A9B0A6BC31EE0714A09B3FC3F6E70A1EC4655&ipbits=0&key=yt6&ip=35.234.17.215&ei=hMj3W-moC9C84ALrgLywBQ&id=o-AFVob4BNIWDTsUQ0sYhJVsPH4OaCc6s7GJsclP3hRkiJ&gir=yes&dur=115.882&mn=sn-i3b7kn76%2Csn-i3beln7z&mm=31%2C29&ms=au%2Crdu&mv=m&fvip=6&clen=3003522&lmt=1538405289970800&keepalive=yes&mime=video%2Fwebm&source=youtube&sparams=aitags%2Cclen%2Cdur%2Cei%2Cgir%2Cid%2Cip%2Cipbits%2Citag%2Ckeepalive%2Clmt%2Cmime%2Cmm%2Cmn%2Cms%2Cmv%2Cpl%2Crequiressl%2Csource%2Cexpire&expire=1542986980&itag=242&ratebypass=yes",
                        "vcodec": "vp9",
                        "player_url": "/yts/jsbin/player-vfl718orE/en_US/base.js",
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
                        "url": "https://r1---sn-i3b7kn76.googlevideo.com/videoplayback?c=WEB&mt=1542965259&pl=18&requiressl=yes&txp=5533432&aitags=133%2C134%2C135%2C136%2C137%2C160%2C242%2C243%2C244%2C247%2C248%2C278&signature=2620E8CE5F9CAC0EEE53048A494DB6BF3E5455CF.56F9C153280928C3C5F7941B2F1288F1568933A8&ipbits=0&key=yt6&ip=35.234.17.215&ei=hMj3W-moC9C84ALrgLywBQ&id=o-AFVob4BNIWDTsUQ0sYhJVsPH4OaCc6s7GJsclP3hRkiJ&gir=yes&dur=115.882&mn=sn-i3b7kn76%2Csn-i3beln7z&mm=31%2C29&ms=au%2Crdu&mv=m&fvip=6&clen=3316873&lmt=1538404993366672&keepalive=yes&mime=video%2Fmp4&source=youtube&sparams=aitags%2Cclen%2Cdur%2Cei%2Cgir%2Cid%2Cip%2Cipbits%2Citag%2Ckeepalive%2Clmt%2Cmime%2Cmm%2Cmn%2Cms%2Cmv%2Cpl%2Crequiressl%2Csource%2Cexpire&expire=1542986980&itag=133&ratebypass=yes",
                        "vcodec": "avc1.4d4015",
                        "player_url": "/yts/jsbin/player-vfl718orE/en_US/base.js",
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
                        "url": "https://r1---sn-i3b7kn76.googlevideo.com/videoplayback?c=WEB&mt=1542965259&pl=18&requiressl=yes&txp=5533432&aitags=133%2C134%2C135%2C136%2C137%2C160%2C242%2C243%2C244%2C247%2C248%2C278&signature=5BC157FA72274CB7E44E3662DFBF55E8781B47E3.13334279D21E095C0C7ADF97FF258A56E0C3A382&ipbits=0&key=yt6&ip=35.234.17.215&ei=hMj3W-moC9C84ALrgLywBQ&id=o-AFVob4BNIWDTsUQ0sYhJVsPH4OaCc6s7GJsclP3hRkiJ&gir=yes&dur=115.882&mn=sn-i3b7kn76%2Csn-i3beln7z&mm=31%2C29&ms=au%2Crdu&mv=m&fvip=6&clen=5476904&lmt=1538405334827516&keepalive=yes&mime=video%2Fwebm&source=youtube&sparams=aitags%2Cclen%2Cdur%2Cei%2Cgir%2Cid%2Cip%2Cipbits%2Citag%2Ckeepalive%2Clmt%2Cmime%2Cmm%2Cmn%2Cms%2Cmv%2Cpl%2Crequiressl%2Csource%2Cexpire&expire=1542986980&itag=243&ratebypass=yes",
                        "vcodec": "vp9",
                        "player_url": "/yts/jsbin/player-vfl718orE/en_US/base.js",
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
                        "url": "https://r1---sn-i3b7kn76.googlevideo.com/videoplayback?c=WEB&mt=1542965259&pl=18&requiressl=yes&txp=5533432&aitags=133%2C134%2C135%2C136%2C137%2C160%2C242%2C243%2C244%2C247%2C248%2C278&signature=74E316588F2B354EA039409D7C9959C56ECF850C.3E2B2CB9487CB135B6468B9CB29AEC6E162B3AC4&ipbits=0&key=yt6&ip=35.234.17.215&ei=hMj3W-moC9C84ALrgLywBQ&id=o-AFVob4BNIWDTsUQ0sYhJVsPH4OaCc6s7GJsclP3hRkiJ&gir=yes&dur=115.882&mn=sn-i3b7kn76%2Csn-i3beln7z&mm=31%2C29&ms=au%2Crdu&mv=m&fvip=6&clen=6874045&lmt=1538404995156886&keepalive=yes&mime=video%2Fmp4&source=youtube&sparams=aitags%2Cclen%2Cdur%2Cei%2Cgir%2Cid%2Cip%2Cipbits%2Citag%2Ckeepalive%2Clmt%2Cmime%2Cmm%2Cmn%2Cms%2Cmv%2Cpl%2Crequiressl%2Csource%2Cexpire&expire=1542986980&itag=134&ratebypass=yes",
                        "vcodec": "avc1.4d401e",
                        "player_url": "/yts/jsbin/player-vfl718orE/en_US/base.js",
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
                        "url": "https://r1---sn-i3b7kn76.googlevideo.com/videoplayback?c=WEB&mt=1542965259&pl=18&requiressl=yes&txp=5533432&aitags=133%2C134%2C135%2C136%2C137%2C160%2C242%2C243%2C244%2C247%2C248%2C278&signature=9A73533074694D8AB40C4E3B775A62608EEDAAA5.220424353921F5BB4A809D7E03009125DBACC3AE&ipbits=0&key=yt6&ip=35.234.17.215&ei=hMj3W-moC9C84ALrgLywBQ&id=o-AFVob4BNIWDTsUQ0sYhJVsPH4OaCc6s7GJsclP3hRkiJ&gir=yes&dur=115.882&mn=sn-i3b7kn76%2Csn-i3beln7z&mm=31%2C29&ms=au%2Crdu&mv=m&fvip=6&clen=9801171&lmt=1538405386518619&keepalive=yes&mime=video%2Fwebm&source=youtube&sparams=aitags%2Cclen%2Cdur%2Cei%2Cgir%2Cid%2Cip%2Cipbits%2Citag%2Ckeepalive%2Clmt%2Cmime%2Cmm%2Cmn%2Cms%2Cmv%2Cpl%2Crequiressl%2Csource%2Cexpire&expire=1542986980&itag=244&ratebypass=yes",
                        "vcodec": "vp9",
                        "player_url": "/yts/jsbin/player-vfl718orE/en_US/base.js",
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
                        "url": "https://r1---sn-i3b7kn76.googlevideo.com/videoplayback?c=WEB&mt=1542965259&pl=18&requiressl=yes&txp=5533432&aitags=133%2C134%2C135%2C136%2C137%2C160%2C242%2C243%2C244%2C247%2C248%2C278&signature=C3C80295C83D3D32AD25F12902C32583DDA8513B.5EFFBB081CE71B2334330CE639ADB575D2D195DD&ipbits=0&key=yt6&ip=35.234.17.215&ei=hMj3W-moC9C84ALrgLywBQ&id=o-AFVob4BNIWDTsUQ0sYhJVsPH4OaCc6s7GJsclP3hRkiJ&gir=yes&dur=115.882&mn=sn-i3b7kn76%2Csn-i3beln7z&mm=31%2C29&ms=au%2Crdu&mv=m&fvip=6&clen=11726835&lmt=1538404996068027&keepalive=yes&mime=video%2Fmp4&source=youtube&sparams=aitags%2Cclen%2Cdur%2Cei%2Cgir%2Cid%2Cip%2Cipbits%2Citag%2Ckeepalive%2Clmt%2Cmime%2Cmm%2Cmn%2Cms%2Cmv%2Cpl%2Crequiressl%2Csource%2Cexpire&expire=1542986980&itag=135&ratebypass=yes",
                        "vcodec": "avc1.4d401f",
                        "player_url": "/yts/jsbin/player-vfl718orE/en_US/base.js",
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
                        "url": "https://r1---sn-i3b7kn76.googlevideo.com/videoplayback?c=WEB&mt=1542965259&pl=18&requiressl=yes&txp=5533432&aitags=133%2C134%2C135%2C136%2C137%2C160%2C242%2C243%2C244%2C247%2C248%2C278&signature=89BAFDB3C46396F96CE54CE2518915BC6C7D610E.083D4B073C98C0CDBE1294696DABB50E8633B0F2&ipbits=0&key=yt6&ip=35.234.17.215&ei=hMj3W-moC9C84ALrgLywBQ&id=o-AFVob4BNIWDTsUQ0sYhJVsPH4OaCc6s7GJsclP3hRkiJ&gir=yes&dur=115.882&mn=sn-i3b7kn76%2Csn-i3beln7z&mm=31%2C29&ms=au%2Crdu&mv=m&fvip=6&clen=17285666&lmt=1538405340627693&keepalive=yes&mime=video%2Fwebm&source=youtube&sparams=aitags%2Cclen%2Cdur%2Cei%2Cgir%2Cid%2Cip%2Cipbits%2Citag%2Ckeepalive%2Clmt%2Cmime%2Cmm%2Cmn%2Cms%2Cmv%2Cpl%2Crequiressl%2Csource%2Cexpire&expire=1542986980&itag=247&ratebypass=yes",
                        "vcodec": "vp9",
                        "player_url": "/yts/jsbin/player-vfl718orE/en_US/base.js",
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
                        "url": "https://r1---sn-i3b7kn76.googlevideo.com/videoplayback?c=WEB&mt=1542965259&pl=18&requiressl=yes&txp=5533432&aitags=133%2C134%2C135%2C136%2C137%2C160%2C242%2C243%2C244%2C247%2C248%2C278&signature=9D9A9B9422E4F375837B5DD3ED94F2ED64447997.D4E48A3BFE0A0F04F304A7E3DAA475A9A60E9AE8&ipbits=0&key=yt6&ip=35.234.17.215&ei=hMj3W-moC9C84ALrgLywBQ&id=o-AFVob4BNIWDTsUQ0sYhJVsPH4OaCc6s7GJsclP3hRkiJ&gir=yes&dur=115.882&mn=sn-i3b7kn76%2Csn-i3beln7z&mm=31%2C29&ms=au%2Crdu&mv=m&fvip=6&clen=18871612&lmt=1538405022939543&keepalive=yes&mime=video%2Fmp4&source=youtube&sparams=aitags%2Cclen%2Cdur%2Cei%2Cgir%2Cid%2Cip%2Cipbits%2Citag%2Ckeepalive%2Clmt%2Cmime%2Cmm%2Cmn%2Cms%2Cmv%2Cpl%2Crequiressl%2Csource%2Cexpire&expire=1542986980&itag=136&ratebypass=yes",
                        "vcodec": "avc1.4d401f",
                        "player_url": "/yts/jsbin/player-vfl718orE/en_US/base.js",
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
                        "url": "https://r1---sn-i3b7kn76.googlevideo.com/videoplayback?c=WEB&mt=1542965259&pl=18&requiressl=yes&txp=5533432&aitags=133%2C134%2C135%2C136%2C137%2C160%2C242%2C243%2C244%2C247%2C248%2C278&signature=3353EFEAFBBED6485D4D4CFBF9AA195F6CE3D6DC.8CE236DFAA135B80747E50543C96E0DACF065065&ipbits=0&key=yt6&ip=35.234.17.215&ei=hMj3W-moC9C84ALrgLywBQ&id=o-AFVob4BNIWDTsUQ0sYhJVsPH4OaCc6s7GJsclP3hRkiJ&gir=yes&dur=115.882&mn=sn-i3b7kn76%2Csn-i3beln7z&mm=31%2C29&ms=au%2Crdu&mv=m&fvip=6&clen=28092559&lmt=1538405452328471&keepalive=yes&mime=video%2Fwebm&source=youtube&sparams=aitags%2Cclen%2Cdur%2Cei%2Cgir%2Cid%2Cip%2Cipbits%2Citag%2Ckeepalive%2Clmt%2Cmime%2Cmm%2Cmn%2Cms%2Cmv%2Cpl%2Crequiressl%2Csource%2Cexpire&expire=1542986980&itag=248&ratebypass=yes",
                        "vcodec": "vp9",
                        "player_url": "/yts/jsbin/player-vfl718orE/en_US/base.js",
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
                        "url": "https://r1---sn-i3b7kn76.googlevideo.com/videoplayback?c=WEB&mt=1542965259&pl=18&requiressl=yes&txp=5533432&aitags=133%2C134%2C135%2C136%2C137%2C160%2C242%2C243%2C244%2C247%2C248%2C278&signature=41EEA6DD5B2FD344559864C00AAB455F52CA8583.625DBF7DFF068376DBB55C4D58E18791C265CF98&ipbits=0&key=yt6&ip=35.234.17.215&ei=hMj3W-moC9C84ALrgLywBQ&id=o-AFVob4BNIWDTsUQ0sYhJVsPH4OaCc6s7GJsclP3hRkiJ&gir=yes&dur=115.882&mn=sn-i3b7kn76%2Csn-i3beln7z&mm=31%2C29&ms=au%2Crdu&mv=m&fvip=6&clen=29010224&lmt=1538405051771398&keepalive=yes&mime=video%2Fmp4&source=youtube&sparams=aitags%2Cclen%2Cdur%2Cei%2Cgir%2Cid%2Cip%2Cipbits%2Citag%2Ckeepalive%2Clmt%2Cmime%2Cmm%2Cmn%2Cms%2Cmv%2Cpl%2Crequiressl%2Csource%2Cexpire&expire=1542986980&itag=137&ratebypass=yes",
                        "vcodec": "avc1.640028",
                        "player_url": "/yts/jsbin/player-vfl718orE/en_US/base.js",
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
                        "url": "https://r1---sn-i3b7kn76.googlevideo.com/videoplayback?gir=yes&dur=116.006&mt=1542965259&mn=sn-i3b7kn76%2Csn-i3beln7z&mm=31%2C29&ms=au%2Crdu&pl=18&mv=m&fvip=6&requiressl=yes&clen=1156624&txp=5531432&lmt=1538403070123695&signature=482A9CD534CB45C71D5C060EE6B964218F74C264.E42702DF4AD330528E2451CCB5396EB60DB06BD1&c=WEB&ipbits=0&key=yt6&mime=video%2F3gpp&ip=35.234.17.215&source=youtube&ei=hMj3W-moC9C84ALrgLywBQ&id=o-AFVob4BNIWDTsUQ0sYhJVsPH4OaCc6s7GJsclP3hRkiJ&sparams=clen%2Cdur%2Cei%2Cgir%2Cid%2Cip%2Cipbits%2Citag%2Clmt%2Cmime%2Cmm%2Cmn%2Cms%2Cmv%2Cpl%2Crequiressl%2Csource%2Cexpire&expire=1542986980&itag=17&ratebypass=yes",
                        "vcodec": "mp4v.20.3",
                        "format_note": "small",
                        "ext": "3gp",
                        "player_url": "/yts/jsbin/player-vfl718orE/en_US/base.js",
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
                        "url": "https://r1---sn-i3b7kn76.googlevideo.com/videoplayback?gir=yes&dur=116.006&mt=1542965259&mn=sn-i3b7kn76%2Csn-i3beln7z&mm=31%2C29&ms=au%2Crdu&pl=18&mv=m&fvip=6&requiressl=yes&clen=3151699&txp=5531432&lmt=1538403070122804&signature=648B6E4188F99432DD3B6EEEECAE801323B8B627.D700D2C3E6ED5D4C24C6A3CF0C84594C4B0E0426&c=WEB&ipbits=0&key=yt6&mime=video%2F3gpp&ip=35.234.17.215&source=youtube&ei=hMj3W-moC9C84ALrgLywBQ&id=o-AFVob4BNIWDTsUQ0sYhJVsPH4OaCc6s7GJsclP3hRkiJ&sparams=clen%2Cdur%2Cei%2Cgir%2Cid%2Cip%2Cipbits%2Citag%2Clmt%2Cmime%2Cmm%2Cmn%2Cms%2Cmv%2Cpl%2Crequiressl%2Csource%2Cexpire&expire=1542986980&itag=36&ratebypass=yes",
                        "vcodec": "mp4v.20.3",
                        "player_url": "/yts/jsbin/player-vfl718orE/en_US/base.js",
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
                        "url": "https://r1---sn-i3b7kn76.googlevideo.com/videoplayback?ratebypass=yes&c=WEB&mt=1542965259&pl=18&requiressl=yes&txp=5531432&signature=3FA6A7EFC2AD2AB0AC37B2DA34958D935E0A1B87.62E825CD42396A96718B0BF7F23461AC7B3F570E&ipbits=0&key=yt6&ip=35.234.17.215&ei=hMj3W-moC9C84ALrgLywBQ&id=o-AFVob4BNIWDTsUQ0sYhJVsPH4OaCc6s7GJsclP3hRkiJ&gir=yes&dur=115.937&mn=sn-i3b7kn76%2Csn-i3beln7z&mm=31%2C29&ms=au%2Crdu&mv=m&fvip=6&clen=10364468&lmt=1538403070625914&mime=video%2Fmp4&source=youtube&sparams=clen%2Cdur%2Cei%2Cgir%2Cid%2Cip%2Cipbits%2Citag%2Clmt%2Cmime%2Cmm%2Cmn%2Cms%2Cmv%2Cpl%2Cratebypass%2Crequiressl%2Csource%2Cexpire&expire=1542986980&itag=18",
                        "quality": 1,
                        "vcodec": "avc1.42001E",
                        "format_note": "medium",
                        "ext": "mp4",
                        "player_url": "/yts/jsbin/player-vfl718orE/en_US/base.js",
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
                        "url": "https://r1---sn-i3b7kn76.googlevideo.com/videoplayback?ratebypass=yes&c=WEB&mt=1542965259&pl=18&requiressl=yes&txp=5511222&signature=866B0900899DEB95FF1C9BA16F796D8F90F831F1.5A75F0A9DDC328ADCD82B266C1DD2A00E3493F4C&ipbits=0&key=yt6&ip=35.234.17.215&ei=hMj3W-moC9C84ALrgLywBQ&id=o-AFVob4BNIWDTsUQ0sYhJVsPH4OaCc6s7GJsclP3hRkiJ&gir=yes&dur=0.000&mn=sn-i3b7kn76%2Csn-i3beln7z&mm=31%2C29&ms=au%2Crdu&mv=m&fvip=6&clen=12898499&lmt=1538405853842976&mime=video%2Fwebm&source=youtube&sparams=clen%2Cdur%2Cei%2Cgir%2Cid%2Cip%2Cipbits%2Citag%2Clmt%2Cmime%2Cmm%2Cmn%2Cms%2Cmv%2Cpl%2Cratebypass%2Crequiressl%2Csource%2Cexpire&expire=1542986980&itag=43",
                        "quality": 1,
                        "vcodec": "vp8.0",
                        "format_note": "medium",
                        "ext": "webm",
                        "player_url": "/yts/jsbin/player-vfl718orE/en_US/base.js",
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
                        "url": "https://r1---sn-i3b7kn76.googlevideo.com/videoplayback?ratebypass=yes&dur=115.937&mt=1542965259&mn=sn-i3b7kn76%2Csn-i3beln7z&mm=31%2C29&ms=au%2Crdu&pl=18&mv=m&fvip=6&requiressl=yes&txp=5531432&lmt=1538405099934063&signature=7EBE3B6C735D6F1DAED47F09E6DF6A4D274EAA71.A9D7A0E4CCC48704F13B1B498ED20FCCD106467C&c=WEB&ipbits=0&mime=video%2Fmp4&key=yt6&ip=35.234.17.215&source=youtube&ei=hMj3W-moC9C84ALrgLywBQ&id=o-AFVob4BNIWDTsUQ0sYhJVsPH4OaCc6s7GJsclP3hRkiJ&sparams=dur%2Cei%2Cid%2Cip%2Cipbits%2Citag%2Clmt%2Cmime%2Cmm%2Cmn%2Cms%2Cmv%2Cpl%2Cratebypass%2Crequiressl%2Csource%2Cexpire&expire=1542986980&itag=22",
                        "quality": 2,
                        "vcodec": "avc1.64001F",
                        "format_note": "hd720",
                        "ext": "mp4",
                        "player_url": "/yts/jsbin/player-vfl718orE/en_US/base.js",
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
                videoFormatList.forEach((format) => {
                    if (format.vcodec === 'none') {
                        tempAudio.push(format)
                    } else {
                        tempVideo.push(format)
                    }
                })

                tempAudio.sort((a, b) => {
                    if (a.ext === b.ext) {
                        if (a.filesize === b.filesize) {
                            return 0
                        }
                        return a.filesize < b.filesize ? 1 : -1
                    }
                    return a.ext < b.ext ? 1 : -1
                })

                tempVideo.sort((a, b) => {
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
