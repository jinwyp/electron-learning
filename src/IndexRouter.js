import Vue from 'vue'
import Router from 'vue-router'



// route level code-splitting
// this generates a separate chunk (about.[hash].js) for this route
// which is lazy-loaded when the route is visited.

// const About = () => import('../../components/cmsAdmin/subpages/About.vue'), /* webpackChunkName: "about" */


import Page404 from './pages/Page404.vue'
import VideoList from './pages/VideoList.vue'
import SingleVideoInput from './pages/SingleVideoInput.vue'

Vue.use(Router)


const routes = [
    { path: '/videos', name: 'videoList', component: VideoList, meta : { title : '视频列表' }},
    { path: '/videos/create', name: 'createNewVideo', component: SingleVideoInput, meta : { title : '新增视频' }},
    { path: '/PageNotFound404',  name: 'pageNotFound',  component: Page404, meta : { title : '页面未找到' } },
    { path: '/',  redirect: '/videos' },
    { path: '*',  redirect: '/PageNotFound404' },
]


const routeIndex = new Router({
    mode: 'history',
    base: process.env.BASE_URL,
    routes: routes,
});

routeIndex.beforeEach((to, from, next) => {
    const title = to.meta && to.meta.title;
    if (title) {
        document.title = title;
    }

    /*    
        if (to.query.token) {
            
        } else {
            window.location.href = 'http://stestadmin.eyee.com/Admin/Login/Index'
        }
        */

    next();
});

export default routeIndex;
