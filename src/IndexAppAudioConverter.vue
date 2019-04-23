<template>

    <el-container class="audio-converter-box">
        <mo-title-bar v-if="isRenderer()" :show-actions="showWindowActions" />
        
        <el-aside width="78px" class="aside" :class="{'draggable': asideDraggable}">
            <div class="aside-inner">
                <mo-logo-mini />
                <ul class="menu top-menu">
                    <li @click="selectMenu('/audios')"> <mo-icon name="menu-task-audio" width="20" height="20" /></li>
                    <li @click="selectMenu('/audios/create')"> <mo-icon name="menu-add" width="20" height="20" /></li>

                    <li @click="selectMenu('/videos')"> <mo-icon name="menu-task-video" width="22" height="22" /></li>
                    <li @click="selectMenu('/videos/create')"> <mo-icon name="menu-add" width="20" height="20" /></li>
                </ul>
                
                <ul class="menu bottom-menu">
                    <li @click="selectMenu('/preference')"> <mo-icon name="menu-preference" width="20" height="20" /></li>
                    <li><mo-icon name="menu-about" width="20" height="20" /></li>
                </ul>
            </div>
        </el-aside>


        <el-container class="content panel" direction="horizontal">
            <!--
            <el-aside width="200px" class="subnav">
                2222222
            </el-aside>
            -->
            <el-container class="content panel" direction="vertical">
                <el-header class="panel-header" height="84">
                    <h4>{{ $route.meta.title }}</h4>
                </el-header>
                <el-main class="panel-content">
                    <router-view :key="$route.fullPath" />
                </el-main>
            </el-container>
        </el-container>
        
        
       
        
    </el-container>
</template>

<script>

import { remote } from 'electron'
import is from 'electron-is'


import TitleBar from '@/components/native/TitleBar'
import LogoMini from '@/components/logo/LogoMini'
import '@/components/icons/menu-task'
import '@/components/icons/menu-task-audio'
import '@/components/icons/menu-task-video'
import '@/components/icons/menu-add'
import '@/components/icons/menu-preference'
import '@/components/icons/menu-about'

const { Menu } = remote



export default {
    components: {
        [LogoMini.name]: LogoMini,
        [TitleBar.name]: TitleBar,
    },
    
    data () {
        return {
            menuList: [
                {
                    index: '1',
                    name: 'Youtube管理',
                    ico: 'el-icon-news',
                    subMenu: [
                        { index: '/videos', name: '已下载视频列表' },
                        { index: '/videoDownloadLogs', name: '已下载视频格式日志' },
                        { index: '/videos/create', name: '新增下载视频' },
                    ],
                },

                {
                    index: '2',
                    name: '音频转换管理',
                    ico: 'el-icon-news',
                    subMenu: [
                        { index: '/audios', name: '已转换音频列表' },
                        { index: '/audios/create', name: '新增音频' },
                    ],
                },
                
            ],
            
            currentMenu: {
                index: '1',
                name: 'Youtube管理',
                ico: 'el-icon-news',
                subMenu: [],
            },
            
            currentSubMenu: {
                index: '/videos',
                name: '已下载视频列表',
            },
        }
    },

    computed: {
        asideDraggable: function () {
            return is.macOS()
        },
        showWindowActions: () => {
            return (is.windows() || is.linux())
        },
    },
    
    created: function () {
        // `this` points to the vm instance
        // this.initMenu()

    },
    methods: {
        isRenderer: is.renderer,
        
        selectMenu (subMenuIndex) {
            this.menuList.forEach((menu, menuIndex) => {
                menu.subMenu.forEach((subMenu, subMenuIndex) => {
                    if (subMenu.index === subMenuIndex) {
                        this.currentMenu = menu
                        this.currentSubMenu = subMenu
                    }
                })
            })
            
            this.$router.push({ path: subMenuIndex })
        },
        
        
        initMenu () {
            const menuList = Menu.buildFromTemplate([
                {
                    label: 'File',
                    submenu: [
                        { label: 'New Window' },
                        { label: 'Settings', accelerator: 'CmdOrCtrl+,' },
                        { label: 'Quit', accelerator: 'CmdOrCtrl+Q' },
                    ],
                },
            ])
            
            Menu.setApplicationMenu(menuList)
        },
        
        

    },
}
</script>
