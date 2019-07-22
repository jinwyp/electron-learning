import Vue from 'vue'
import Router from 'vue-router'



// route level code-splitting
// this generates a separate chunk (about.[hash].js) for this route
// which is lazy-loaded when the route is visited.

// const About = () => import('../../components/cmsAdmin/subpages/About.vue'), /* webpackChunkName: "about" */


import Page404 from './pages/Page404.vue'
import VideoList from './pages/youtube/VideoList.vue'
import VideoDownloadLogs from './pages/youtube/VideoDownloadLogs.vue'
import SingleVideoInput from './pages/youtube/SingleVideoInput.vue'

import AudioConvertLogList from './pages/ffmpeg/AudioConvertLogList.vue'
import SingleAudioInput from './pages/ffmpeg/SingleAudioInput.vue'


import Basic from './pages/preferences/Basic.vue'

Vue.use(Router)



const routes = [
    { path: '/audios', name: 'audioList', component: AudioConvertLogList, meta: { title: '已转换音频列表' } },
    { path: '/audios/create', name: 'createNewAudio', component: SingleAudioInput, meta: { title: '新增转换音频' }, props: { isCreate: true } },
    { path: '/audios/edit/:audioId', name: 'editAudio', component: SingleAudioInput, meta: { title: '编辑已转换音频' }, props: { isCreate: false } },
    
    { path: '/videos', name: 'videoList', component: VideoList, meta: { title: '视频列表' } },
    { path: '/videoDownloadLogs', name: 'videoDownloadLogs', component: VideoDownloadLogs, meta: { title: '已下载视频日志' }, props: true },

    { path: '/videos/create', name: 'createNewVideo', component: SingleVideoInput, meta: { title: '新增下载视频' }, props: { isCreate: true } },
    { path: '/videos/edit/:videoId', name: 'editVideo', component: SingleVideoInput, meta: { title: '编辑已下载视频' }, props: { isCreate: false } },
    
    
    
    { path: '/preference', name: 'preferenceBasic', component: Basic, meta: { title: '基本设置' } },
    
    
    { path: '/PageNotFound404', name: 'pageNotFound', component: Page404, meta: { title: '页面未找到' } },
    { path: '/', redirect: '/videos' },
    { path: '*', redirect: '/PageNotFound404' },
]

const routeIndex = new Router({
    mode: 'history',
    base: process.env.BASE_URL,
    routes: routes,
})

routeIndex.beforeEach((to, from, next) => {
    const title = to.meta && to.meta.title
    if (title) {
        document.title = title
    }
    next()
})

export default routeIndex
