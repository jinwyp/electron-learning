<template>

    <el-container>
        <el-header height="30px">

            <el-row type="flex" justify="space-between">
                <el-col :span="20" class="text-l">管理后台</el-col>
                <el-col :span="4" >

                    <el-dropdown class="fr">
                        <span class="el-dropdown-link">你好  <i class="el-icon-arrow-down el-icon--right"/></span>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item>用户信息</el-dropdown-item>
                            <el-dropdown-item>
                                <a class="a-style-none" href="http://news-cms.51y5.net/index.do" target="_blank">跳转老系统</a>
                            </el-dropdown-item>
                            <el-dropdown-item divided>退出</el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </el-col>
            </el-row>
        </el-header>
        
        
        <el-container>
            <el-aside width="200px">
                
                <el-menu :default-active="currentSubMenu.index" router >

                    <el-submenu v-for="(menu, index) in menuList" :key="index" :index="menu.index">
                        <template slot="title">
                            <i :class="menu.ico"/>
                            <span>{{ menu.name }}</span>
                        </template>

                        <el-menu-item v-for="(subMenu, subIndex) in menu.subMenu" :index="subMenu.index" :key="subIndex" @click="selectMenu(menu, subMenu)">{{ subMenu.name }}</el-menu-item>
                    </el-submenu>

                </el-menu>
                
            </el-aside>
            
            
            <el-main>
                <el-row>
                    <el-col :span="24">
                        <el-breadcrumb separator-class="el-icon-arrow-right">
                            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
                            <el-breadcrumb-item>{{ currentMenu.name }} </el-breadcrumb-item>
                            <el-breadcrumb-item> {{ currentSubMenu.name }}</el-breadcrumb-item>
                        </el-breadcrumb>
                    </el-col>
                    
                </el-row>

                <el-row>
                    <el-col :span="24">
                        <h2>{{ $route.meta.title }}</h2>
                    </el-col>
                </el-row>
                
                <router-view :key="$route.fullPath"/>
            </el-main>
        </el-container>
    </el-container>
  
</template>

<script>

export default {
    data () {
        return {
            menuList: [
                {
                    index: '1',
                    name: 'youtube视频管理',
                    ico: 'el-icon-news',
                    subMenu: [
                        { index: '/videos', name: '已下载视频列表' },
                        { index: '/videos/create', name: '新增下载视频' },
                    ],
                },
            ],
            
            currentMenu: {
                index: '1',
                name: 'youtube视频管理',
                ico: 'el-icon-menu',
                subMenu: [],
            },
            
            currentSubMenu: {
                index: '/videos',
                name: '已下载视频列表',
            },
        }
    },
    created: function () {
        // `this` points to the vm instance

    },
    methods: {
        selectMenu (menu, subMenu) {
            this.currentMenu = menu
            this.currentSubMenu = subMenu
        },

    },
}
</script>
