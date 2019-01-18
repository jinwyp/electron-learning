<template>

    <el-container class="main">
        <el-header height="40px">
            <el-row type="flex" justify="space-between">
                <el-col :span="6">
                    
                    <div class="header-logo">
                        <img src="@/assets/images/youtube_logo2.png" alt="">
                    </div>
                    
                    <div class="header-text">下载器 </div>
                </el-col>
                
                <el-col :span="14">

                    <el-menu :default-active="currentSubMenu.index" router mode="horizontal" >

                        <el-submenu v-for="(menu, index) in menuList" :key="index" :index="menu.index">
                            <template slot="title">
                                <span>{{ menu.name }}</span>
                            </template>

                            <el-menu-item v-for="(subMenu, subIndex) in menu.subMenu" :index="subMenu.index" :key="subIndex" @click="selectMenu(menu, subMenu)">{{ subMenu.name }}</el-menu-item>
                        </el-submenu>

                    </el-menu>
                    
                </el-col>
                
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
            <el-main>
                <!--
                <el-row>
                    <el-col :span="24">
                        <el-breadcrumb separator-class="el-icon-arrow-right">
                            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
                            <el-breadcrumb-item>{{ currentMenu.name }} </el-breadcrumb-item>
                            <el-breadcrumb-item> {{ currentSubMenu.name }}</el-breadcrumb-item>
                        </el-breadcrumb>
                    </el-col>
                </el-row>
                -->
                
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
    
import { remote } from 'electron'

const { Menu } = remote

export default {
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
        // this.initMenu()
    },
    methods: {
        selectMenu (menu, subMenu) {
            this.currentMenu = menu
            this.currentSubMenu = subMenu
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

            /*
            const a = {
                "upload_date": "20181001",
                "protocol": "https",
                "creator": null,
                "series": "Nursery Rhymes &amp; Kids Songs by Little Baby Bum - Volume 1",
                "format_note": "hd720",
                "chapters": null,
                "height": 720,
                "thumbnail": "https://i.ytimg.com/vi/by0e4didQpM/maxresdefault.jpg",
                "like_count": 1187,
                "duration": 116,
                "fulltitle": "Halloween is Dress Up Time | Halloween Songs For Kids | BRAND NEW! | Little Baby Bum",
                "quality": 2,
                "id": "by0e4didQpM",
                "view_count": 962651,
                "playlist": null,
                "title": "Halloween is Dress Up Time | Halloween Songs For Kids | BRAND NEW! | Little Baby Bum",
                "_filename": "Halloween is Dress Up Time _ Halloween Songs For Kids _ BRAND NEW! _ Little Baby Bum-by0e4didQpM.mp4",
                "tags": ["Little baby bum", "wheels on the bus", "cartoon", "cartoons", "kids cartoon", "cartoons for kids", "baby songs", "nursery rhymes", "baby bun", "children songs", "kids songs", "kindergarten songs", "toddler songs", "kids song", "education", "abc song", "balloons", "abc songs for children", "abc song nursery rhymes", "five little ducks", "lbb", "videos for kids", "baby shark", "bus", "nursery rhymes uk", "nursery songs", "halloween", "haloween", "halloween song", "haloween songs", "halloween movie", "halloween songs for kids"],
                "is_live": null,
                "playlist_index": null,
                "dislike_count": 548,
                "average_rating": 3.70911097527,
                "abr": 192,
                "uploader_url": "http://www.youtube.com/user/LittleBabyBum",
                "subtitles": {},
                "season_number": 5,
                "annotations": "<?xml version=\"1.0\" encoding=\"UTF-8\" ?><document><annotations itct=\"CAAQwOYBIhMIuqiK8prg3gIVwlBgCh2TCwcXKPgdMgJpdkiThfXEndzHlm8\">\n<annotation id=\"channel:2bbde2b9-c6df-45a7-856a-89195c086829\" style=\"branding\" type=\"branding\"\n            log_data=\"a-ch=UCKAqou7V9FAWXpZd9xtOg3Q&amp;a-v=by0e4didQpM&amp;link-id=UCKAqou7V9FAWXpZd9xtOg3Q&amp;ei=UIvyW7rAFMKhgQOTl5y4AQ&amp;xble=0&amp;l-class=3&amp;a-id=2bbde2b9-c6df-45a7-856a-89195c086829&amp;a-type=10\">\n  <data>{&quot;channel_id&quot;:&quot;UCKAqou7V9FAWXpZd9xtOg3Q&quot;,&quot;image_height&quot;:39,&quot;start_ms&quot;:0,&quot;num_subscribers&quot;:&quot;16913033&quot;,&quot;standalone_subscribe_button_data&quot;:{&quot;subscribeCount&quot;:&quot;16M&quot;,&quot;subscribed&quot;:false,&quot;subscribeText&quot;:&quot;Subscribe&quot;,&quot;feature&quot;:&quot;iv&quot;,&quot;enabled&quot;:false,&quot;signinUrl&quot;:&quot;https:\\/\\/accounts.google.com\\/ServiceLogin?passive=true\\u0026continue=http%3A%2F%2Fwww.youtube.com%2Fsignin%3Faction_handle_signin%3Dtrue%26app%3Ddesktop%26feature%3Div%26continue_action%3DQUFFLUhqblJnVjJtMjRaLVB6RlJLUkVZWUdDRzVmcnpCQXxBQ3Jtc0ttX2RkODZJUU90bE9aRi0weUxfSXdHeG9FS1oyaUZSN0dWR28wZ2xYS2dsU2ZtNnRuUzNHaEtOdVB6aWExTjdDOG9UaTFnQnlnRnJnXzYzRTh6UWJjUHNad3ZzT0dMWnFDd1R0Y2VBQXdlaFJrWGFTTWNWOUFXWkkxZWx3NGNJWWNUQXFNR1BITWFLRjktc3NRdlFzYk9aWlRPNHB5b1NKcmJxeEVlVVQweVdtcDgxNVRwLXJheTctVTZ0Z19FRTJSOWV1S3ZyZVVOUU9CS0VhaGIweml5bWd5RWlQYV94WkNWZENJSXlLNXRvSHF5UUdr%26hl%3Den%26next%3Dhttps%253A%252F%252Fwww.youtube.com%252Fuser%252FLittleBabyBum\\u0026hl=en\\u0026uilel=3\\u0026service=youtube&quot;,&quot;unsubscribeCount&quot;:&quot;16M&quot;,&quot;classic&quot;:true,&quot;unsubscribeText&quot;:&quot;Subscribed&quot;},&quot;image_type&quot;:1,&quot;image_width&quot;:41,&quot;end_ms&quot;:95000,&quot;channel_name&quot;:&quot;Little Baby Bum - Nursery Rhymes \\u0026 Kids Songs&quot;,&quot;image_url&quot;:&quot;https:\\/\\/i.ytimg.com\\/an\\/KAqou7V9FAWXpZd9xtOg3Q\\/featured_channel.jpg?v=59ecdac8&quot;,&quot;use_standalone_subscribe_button&quot;:true,&quot;subscription_token&quot;:[&quot;&quot;,&quot;&quot;],&quot;session_data&quot;:{&quot;src_vid&quot;:&quot;by0e4didQpM&quot;,&quot;itct&quot;:&quot;CAEQ8zcY____________ASITCLqoivKa4N4CFcJQYAodkwsHFyj4HTICaXZIk4X1xJ3cx5Zv&quot;,&quot;feature&quot;:&quot;iv&quot;,&quot;annotation_id&quot;:&quot;2bbde2b9-c6df-45a7-856a-89195c086829&quot;,&quot;ei&quot;:&quot;UIvyW7rAFMKhgQOTl5y4AQ&quot;},&quot;is_mobile&quot;:false}</data>\n  <segment/>\n  <action trigger=\"click\" type=\"openUrl\">\n    <url type=\"hyperlink\" target=\"new\" value=\"https://www.youtube.com/user/LittleBabyBum\"/>\n  </action>\n</annotation>\n<annotation id=\"video:f87d87af-fa53-4e6b-b21a-1e8ac1a3bd4a\" style=\"video\" type=\"card\" log_data=\"a-ch=UCKAqou7V9FAWXpZd9xtOg3Q&amp;a-id=f87d87af-fa53-4e6b-b21a-1e8ac1a3bd4a&amp;a-type=62&amp;a-v=by0e4didQpM&amp;ei=UIvyW7rAFMKhgQOTl5y4AQ&amp;l-class=1&amp;link-id=3UYJ0MY1l1o&amp;xble=0\">\n  <data>{&quot;is_live_now&quot;:false,&quot;target&quot;:&quot;new&quot;,&quot;start_ms&quot;:5050,&quot;custom_message&quot;:&quot;&quot;,&quot;card_type&quot;:&quot;video&quot;,&quot;timestamp&quot;:1541683433929,&quot;tracking&quot;:{&quot;impression&quot;:[],&quot;close&quot;:[],&quot;teaser_impression&quot;:[],&quot;click&quot;:[],&quot;teaser_click&quot;:[]},&quot;end_ms&quot;:5050,&quot;pause_on_navigation&quot;:true,&quot;meta_info&quot;:[&quot;by Little Baby Bum - Nursery Rhymes \\u0026 Kids Songs&quot;,&quot;730,751 views&quot;],&quot;teaser_text&quot;:&quot;Suggested: Go Buster - Stuck in the Mud | BRAND NEW SERIES | Kids Cartoon | Little Baby Bum | Cartoons For Kids&quot;,&quot;image_url&quot;:&quot;https:\\/\\/i.ytimg.com\\/vi\\/3UYJ0MY1l1o\\/mqdefault.jpg&quot;,&quot;title&quot;:&quot;Go Buster - Stuck in the Mud | BRAND NEW SERIES | Kids Cartoon | Little Baby Bum | Cartoons For Kids&quot;,&quot;url&quot;:&quot;https:\\/\\/www.youtube.com\\/watch?v=3UYJ0MY1l1o&quot;,&quot;tracking_params&quot;:{&quot;teaser&quot;:&quot;CAcQ0DYY____________ASITCLqoivKa4N4CFcJQYAodkwsHFyj4HTIFY2FyZHNIk4X1xJ3cx5Zv&quot;,&quot;icon&quot;:&quot;CAgQsJcBGP___________wEiEwi6qIrymuDeAhXCUGAKHZMLBxco-B0yBWNhcmRzSJOF9cSd3MeWbw&quot;,&quot;card&quot;:&quot;CAYQ1TYY____________ASITCLqoivKa4N4CFcJQYAodkwsHFyj4HTIFY2FyZHNIk4X1xJ3cx5Zv&quot;},&quot;video_duration&quot;:&quot;1:58&quot;,&quot;teaser_duration_ms&quot;:7000,&quot;session_data&quot;:{&quot;src_vid&quot;:&quot;by0e4didQpM&quot;,&quot;itct&quot;:&quot;CAYQ1TYY____________ASITCLqoivKa4N4CFcJQYAodkwsHFyj4HTIFY2FyZHNIk4X1xJ3cx5Zv&quot;,&quot;feature&quot;:&quot;cards&quot;,&quot;annotation_id&quot;:&quot;f87d87af-fa53-4e6b-b21a-1e8ac1a3bd4a&quot;,&quot;ei&quot;:&quot;UIvyW7rAFMKhgQOTl5y4AQ&quot;}}</data>\n  <segment/>\n  <action trigger=\"click\" type=\"openUrl\">\n    <url type=\"hyperlink\" target=\"new\" value=\"https://www.youtube.com/watch?v=3UYJ0MY1l1o\"/>\n  </action>\n</annotation>\n\n<annotation id=\"video:e9fa6d5a-c019-4e76-863a-806b4d2d24ee\" style=\"playlist\" type=\"card\" log_data=\"a-ch=UCKAqou7V9FAWXpZd9xtOg3Q&amp;a-id=e9fa6d5a-c019-4e76-863a-806b4d2d24ee&amp;a-type=63&amp;a-v=by0e4didQpM&amp;ei=UIvyW7rAFMKhgQOTl5y4AQ&amp;l-class=2&amp;link-id=PL0VE_cI7-AYQ9y3-YaiSvJBMJ5iu9cjNj&amp;xble=0\">\n  <data>{&quot;tracking&quot;:{&quot;impression&quot;:[],&quot;close&quot;:[],&quot;teaser_impression&quot;:[],&quot;click&quot;:[],&quot;teaser_click&quot;:[]},&quot;target&quot;:&quot;new&quot;,&quot;start_ms&quot;:98470,&quot;custom_message&quot;:&quot;&quot;,&quot;card_type&quot;:&quot;playlist&quot;,&quot;timestamp&quot;:1541683433857,&quot;end_ms&quot;:98470,&quot;teaser_duration_ms&quot;:0,&quot;pause_on_navigation&quot;:true,&quot;meta_info&quot;:[&quot;by Little Baby Bum - Nursery Rhymes \\u0026 Kids Songs&quot;,&quot;106 videos&quot;],&quot;playlist_video_count&quot;:&quot;106&quot;,&quot;teaser_text&quot;:&quot;Suggested: Nursery Rhymes \\u0026 Kids Songs by Little Baby Bum - Volume 2 : Season 3&quot;,&quot;image_url&quot;:&quot;https:\\/\\/i.ytimg.com\\/vi\\/aGi1kFXudBc\\/mqdefault.jpg&quot;,&quot;title&quot;:&quot;Nursery Rhymes \\u0026 Kids Songs by Little Baby Bum - Volume 2 : Season 3&quot;,&quot;url&quot;:&quot;https:\\/\\/www.youtube.com\\/watch?v=aGi1kFXudBc\\u0026list=PL0VE_cI7-AYQ9y3-YaiSvJBMJ5iu9cjNj&quot;,&quot;tracking_params&quot;:{&quot;teaser&quot;:&quot;CAsQ0DYY____________ASITCLqoivKa4N4CFcJQYAodkwsHFyj4HTIFY2FyZHNIk4X1xJ3cx5Zv&quot;,&quot;icon&quot;:&quot;CAwQsJcBGP___________wEiEwi6qIrymuDeAhXCUGAKHZMLBxco-B0yBWNhcmRzSJOF9cSd3MeWbw&quot;,&quot;card&quot;:&quot;CAoQ1TYY____________ASITCLqoivKa4N4CFcJQYAodkwsHFyj4HTIFY2FyZHNIk4X1xJ3cx5Zv&quot;},&quot;session_data&quot;:{&quot;src_vid&quot;:&quot;by0e4didQpM&quot;,&quot;itct&quot;:&quot;CAoQ1TYY____________ASITCLqoivKa4N4CFcJQYAodkwsHFyj4HTIFY2FyZHNIk4X1xJ3cx5Zv&quot;,&quot;feature&quot;:&quot;cards&quot;,&quot;annotation_id&quot;:&quot;e9fa6d5a-c019-4e76-863a-806b4d2d24ee&quot;,&quot;ei&quot;:&quot;UIvyW7rAFMKhgQOTl5y4AQ&quot;}}</data>\n  <segment/>\n  <action trigger=\"click\" type=\"openUrl\">\n    <url type=\"hyperlink\" target=\"new\" value=\"https://www.youtube.com/watch?v=aGi1kFXudBc&amp;list=PL0VE_cI7-AYQ9y3-YaiSvJBMJ5iu9cjNj\"/>\n  </action>\n</annotation>\n\n<annotation id=\"video:139b9ea9-0858-4a5f-a839-6459b9803a8c\" style=\"playlist\" type=\"card\" log_data=\"a-ch=UCKAqou7V9FAWXpZd9xtOg3Q&amp;a-id=139b9ea9-0858-4a5f-a839-6459b9803a8c&amp;a-type=63&amp;a-v=by0e4didQpM&amp;ei=UIvyW7rAFMKhgQOTl5y4AQ&amp;l-class=2&amp;link-id=PL0VE_cI7-AYS_B3oBdExPYAPI2-_SgDP3&amp;xble=0\">\n  <data>{&quot;tracking&quot;:{&quot;impression&quot;:[],&quot;close&quot;:[],&quot;teaser_impression&quot;:[],&quot;click&quot;:[],&quot;teaser_click&quot;:[]},&quot;target&quot;:&quot;new&quot;,&quot;start_ms&quot;:115000,&quot;custom_message&quot;:&quot;&quot;,&quot;card_type&quot;:&quot;playlist&quot;,&quot;timestamp&quot;:1541683433930,&quot;end_ms&quot;:115000,&quot;teaser_duration_ms&quot;:0,&quot;pause_on_navigation&quot;:true,&quot;meta_info&quot;:[&quot;by Little Baby Bum - Nursery Rhymes \\u0026 Kids Songs&quot;,&quot;16 videos&quot;],&quot;playlist_video_count&quot;:&quot;16&quot;,&quot;teaser_text&quot;:&quot;Suggested: Halloween Specials | Songs For Kids | Halloween Songs by Little Baby Bum&quot;,&quot;image_url&quot;:&quot;https:\\/\\/i.ytimg.com\\/vi\\/lyfep29ltI0\\/mqdefault.jpg&quot;,&quot;title&quot;:&quot;Halloween Specials | Songs For Kids | Halloween Songs by Little Baby Bum&quot;,&quot;url&quot;:&quot;https:\\/\\/www.youtube.com\\/watch?v=lyfep29ltI0\\u0026list=PL0VE_cI7-AYS_B3oBdExPYAPI2-_SgDP3&quot;,&quot;tracking_params&quot;:{&quot;teaser&quot;:&quot;CA8Q0DYY____________ASITCLqoivKa4N4CFcJQYAodkwsHFyj4HTIFY2FyZHNIk4X1xJ3cx5Zv&quot;,&quot;icon&quot;:&quot;CBAQsJcBGP___________wEiEwi6qIrymuDeAhXCUGAKHZMLBxco-B0yBWNhcmRzSJOF9cSd3MeWbw&quot;,&quot;card&quot;:&quot;CA4Q1TYY____________ASITCLqoivKa4N4CFcJQYAodkwsHFyj4HTIFY2FyZHNIk4X1xJ3cx5Zv&quot;},&quot;session_data&quot;:{&quot;src_vid&quot;:&quot;by0e4didQpM&quot;,&quot;itct&quot;:&quot;CA4Q1TYY____________ASITCLqoivKa4N4CFcJQYAodkwsHFyj4HTIFY2FyZHNIk4X1xJ3cx5Zv&quot;,&quot;feature&quot;:&quot;cards&quot;,&quot;annotation_id&quot;:&quot;139b9ea9-0858-4a5f-a839-6459b9803a8c&quot;,&quot;ei&quot;:&quot;UIvyW7rAFMKhgQOTl5y4AQ&quot;}}</data>\n  <segment/>\n  <action trigger=\"click\" type=\"openUrl\">\n    <url type=\"hyperlink\" target=\"new\" value=\"https://www.youtube.com/watch?v=lyfep29ltI0&amp;list=PL0VE_cI7-AYS_B3oBdExPYAPI2-_SgDP3\"/>\n  </action>\n</annotation>\n\n<annotation id=\"video:2b390b8b-978d-47e2-b52a-0c646966f79a\" style=\"playlist\" type=\"card\" log_data=\"a-ch=UCKAqou7V9FAWXpZd9xtOg3Q&amp;a-id=2b390b8b-978d-47e2-b52a-0c646966f79a&amp;a-type=63&amp;a-v=by0e4didQpM&amp;ei=UIvyW7rAFMKhgQOTl5y4AQ&amp;l-class=2&amp;link-id=PL0VE_cI7-AYR62WR79LdKEY4Dm4O3sRYl&amp;xble=0\">\n  <data>{&quot;tracking&quot;:{&quot;impression&quot;:[],&quot;close&quot;:[],&quot;teaser_impression&quot;:[],&quot;click&quot;:[],&quot;teaser_click&quot;:[]},&quot;target&quot;:&quot;new&quot;,&quot;start_ms&quot;:115000,&quot;custom_message&quot;:&quot;&quot;,&quot;card_type&quot;:&quot;playlist&quot;,&quot;timestamp&quot;:1541683433944,&quot;end_ms&quot;:115000,&quot;teaser_duration_ms&quot;:0,&quot;pause_on_navigation&quot;:true,&quot;meta_info&quot;:[&quot;by Little Baby Bum - Nursery Rhymes \\u0026 Kids Songs&quot;,&quot;413 videos&quot;],&quot;playlist_video_count&quot;:&quot;413&quot;,&quot;teaser_text&quot;:&quot;Suggested: Little Baby Bum | Nursery Rhymes for Babies | Kids Songs to Dance to | Learning for Kids&quot;,&quot;image_url&quot;:&quot;https:\\/\\/i.ytimg.com\\/vi\\/qnAmqoDLpAY\\/mqdefault.jpg&quot;,&quot;title&quot;:&quot;Little Baby Bum | Nursery Rhymes for Babies | Kids Songs to Dance to | Learning for Kids&quot;,&quot;url&quot;:&quot;https:\\/\\/www.youtube.com\\/watch?v=qnAmqoDLpAY\\u0026list=PL0VE_cI7-AYR62WR79LdKEY4Dm4O3sRYl&quot;,&quot;tracking_params&quot;:{&quot;teaser&quot;:&quot;CBMQ0DYY____________ASITCLqoivKa4N4CFcJQYAodkwsHFyj4HTIFY2FyZHNIk4X1xJ3cx5Zv&quot;,&quot;icon&quot;:&quot;CBQQsJcBGP___________wEiEwi6qIrymuDeAhXCUGAKHZMLBxco-B0yBWNhcmRzSJOF9cSd3MeWbw&quot;,&quot;card&quot;:&quot;CBIQ1TYY____________ASITCLqoivKa4N4CFcJQYAodkwsHFyj4HTIFY2FyZHNIk4X1xJ3cx5Zv&quot;},&quot;session_data&quot;:{&quot;src_vid&quot;:&quot;by0e4didQpM&quot;,&quot;itct&quot;:&quot;CBIQ1TYY____________ASITCLqoivKa4N4CFcJQYAodkwsHFyj4HTIFY2FyZHNIk4X1xJ3cx5Zv&quot;,&quot;feature&quot;:&quot;cards&quot;,&quot;annotation_id&quot;:&quot;2b390b8b-978d-47e2-b52a-0c646966f79a&quot;,&quot;ei&quot;:&quot;UIvyW7rAFMKhgQOTl5y4AQ&quot;}}</data>\n  <segment/>\n  <action trigger=\"click\" type=\"openUrl\">\n    <url type=\"hyperlink\" target=\"new\" value=\"https://www.youtube.com/watch?v=qnAmqoDLpAY&amp;list=PL0VE_cI7-AYR62WR79LdKEY4Dm4O3sRYl\"/>\n  </action>\n</annotation>\n\n<annotation id=\"video:83e52fc6-6a3c-462e-83e2-0fca2b2a6120\" style=\"playlist\" type=\"card\" log_data=\"a-ch=UCKAqou7V9FAWXpZd9xtOg3Q&amp;a-id=83e52fc6-6a3c-462e-83e2-0fca2b2a6120&amp;a-type=63&amp;a-v=by0e4didQpM&amp;ei=UIvyW7rAFMKhgQOTl5y4AQ&amp;l-class=2&amp;link-id=PL0VE_cI7-AYTCz4H1o_J0d4VRoKZpYaNF&amp;xble=0\">\n  <data>{&quot;tracking&quot;:{&quot;impression&quot;:[],&quot;close&quot;:[],&quot;teaser_impression&quot;:[],&quot;click&quot;:[],&quot;teaser_click&quot;:[]},&quot;target&quot;:&quot;new&quot;,&quot;start_ms&quot;:115000,&quot;custom_message&quot;:&quot;&quot;,&quot;card_type&quot;:&quot;playlist&quot;,&quot;timestamp&quot;:1541683434087,&quot;end_ms&quot;:115000,&quot;teaser_duration_ms&quot;:0,&quot;pause_on_navigation&quot;:true,&quot;meta_info&quot;:[&quot;by Little Baby Bum - Nursery Rhymes \\u0026 Kids Songs&quot;,&quot;45 videos&quot;],&quot;playlist_video_count&quot;:&quot;45&quot;,&quot;teaser_text&quot;:&quot;Suggested: Nursery Rhymes \\u0026 Kids Songs by Little Baby Bum - Volume 4 : Season 5&quot;,&quot;image_url&quot;:&quot;https:\\/\\/i.ytimg.com\\/vi\\/rVtI060C65w\\/mqdefault.jpg&quot;,&quot;title&quot;:&quot;Nursery Rhymes \\u0026 Kids Songs by Little Baby Bum - Volume 4 : Season 5&quot;,&quot;url&quot;:&quot;https:\\/\\/www.youtube.com\\/watch?v=rVtI060C65w\\u0026list=PL0VE_cI7-AYTCz4H1o_J0d4VRoKZpYaNF&quot;,&quot;tracking_params&quot;:{&quot;teaser&quot;:&quot;CBcQ0DYY____________ASITCLqoivKa4N4CFcJQYAodkwsHFyj4HTIFY2FyZHNIk4X1xJ3cx5Zv&quot;,&quot;icon&quot;:&quot;CBgQsJcBGP___________wEiEwi6qIrymuDeAhXCUGAKHZMLBxco-B0yBWNhcmRzSJOF9cSd3MeWbw&quot;,&quot;card&quot;:&quot;CBYQ1TYY____________ASITCLqoivKa4N4CFcJQYAodkwsHFyj4HTIFY2FyZHNIk4X1xJ3cx5Zv&quot;},&quot;session_data&quot;:{&quot;src_vid&quot;:&quot;by0e4didQpM&quot;,&quot;itct&quot;:&quot;CBYQ1TYY____________ASITCLqoivKa4N4CFcJQYAodkwsHFyj4HTIFY2FyZHNIk4X1xJ3cx5Zv&quot;,&quot;feature&quot;:&quot;cards&quot;,&quot;annotation_id&quot;:&quot;83e52fc6-6a3c-462e-83e2-0fca2b2a6120&quot;,&quot;ei&quot;:&quot;UIvyW7rAFMKhgQOTl5y4AQ&quot;}}</data>\n  <segment/>\n  <action trigger=\"click\" type=\"openUrl\">\n    <url type=\"hyperlink\" target=\"new\" value=\"https://www.youtube.com/watch?v=rVtI060C65w&amp;list=PL0VE_cI7-AYTCz4H1o_J0d4VRoKZpYaNF\"/>\n  </action>\n</annotation>\n\n<annotation id=\"drawer\" type=\"drawer\">\n  <segment/>\n  <data>{\n  &quot;headerText&quot;: &quot;From Little Baby Bum - Nursery Rhymes &amp; Kids Songs&quot;, \n  &quot;trackingParams&quot;: &quot;CAIQwjcY////////////ASITCLqoivKa4N4CFcJQYAodkwsHFyj4HTIFY2FyZHNIk4X1xJ3cx5Zv&quot;, \n  &quot;iconTrackingParams&quot;: &quot;CAQQsJcBGP///////////wEiEwi6qIrymuDeAhXCUGAKHZMLBxco+B0yBWNhcmRzSJOF9cSd3MeWbw==&quot;, \n  &quot;closeTrackingParams&quot;: &quot;CAMQsZcBGP///////////wEiEwi6qIrymuDeAhXCUGAKHZMLBxco+B0yBWNhcmRzSJOF9cSd3MeWbw==&quot;, \n  &quot;eventId&quot;: &quot;UIvyW7rAFMKhgQOTl5y4AQ&quot;\n}</data>\n</annotation>\n</annotations></document>",
                "webpage_url_basename": "watch",
                "acodec": "mp4a.40.2",
                "display_id": "by0e4didQpM",
                "automatic_captions": {},
                "description": "SUBSCRIBE for new videos every week!\u25bahttps://www.youtube.com/user/LittleBabyBum?sub_confirmation=1\nSongs About Numbers, ABC's and shapes:\nhttps://www.youtube.com/watch?v=wwdqK_XNBNM&list=PL0VE_cI7-AYRotjbI1cGFg8zscyzgFClS\n\nLBB TV:\nhttps://www.youtube.com/watch?v=fQTDpa_c-nk&list=PL0VE_cI7-AYRx9Qbz5C0oQix0AO6YdCtw\n\nLBB and friends:\nhttps://www.youtube.com/watch?v=J3htU652mBY&list=PL0VE_cI7-AYSuxGdfT5N15Aks-y_HbNg7\n\nTen little animals | Counting for kids:\nhttps://www.youtube.com/watch?v=lX2NvIQS8iM\n\nABC song:\nhttps://www.youtube.com/watch?v=ezdzxieXJvc\n\n\u00a9 El Bebe Productions Limited - part of LittleBabyBum\n\nHalloween is dress up time,\nDress up, dress up, dress up time,\nHalloween is dress up time,\nDress up, dress up, dress up time!\n\nGrab a white sheet,\nYou\u2019ll be a ghost, woohoo!\nPut it over your head,\nBoo, boo, boo!\nYou have ears and a tail,\nYou\u2019re a little cat, wow!\nYou can purr and prance,\nMeow, meow, meow!\n\nHalloween is dress up time,\nDress up, dress up, dress up time,\nHalloween is dress up time,\nDress up, dress up, dress up time!\n\nMaybe you\u2019re a mummy,\nWrapped up head to toe,\nPut your hands in front of you and\nGo, go, go!\nYou could be a witch,\nGrab a hat and a broom,\nDon\u2019t forget your cloak,\nVroom, vroom, vroom!\n\n#halloweensongsforkids #halloween #halloweenforkids",
                "format": "22 - 1280x720 (hd720)",
                "track": null,
                "season": "Season 5",
                "start_time": null,
                "uploader": "Little Baby Bum - Nursery Rhymes & Kids Songs",
                "format_id": "22",
                "episode_number": 41,
                "uploader_id": "LittleBabyBum",
                "categories": ["Education"],
                "alt_title": null,
                "episode": "Episode 41",
                "thumbnails": [{"url": "https://i.ytimg.com/vi/by0e4didQpM/maxresdefault.jpg", "id": "0"}],
                "license": null,
                "artist": null,
                "url": "https://r1---sn-i3b7kn76.googlevideo.com/videoplayback?key=yt6&expire=1542643626&ratebypass=yes&mt=1542621970&ei=SovyW4fmCce5qQHm-r6wAg&c=WEB&lmt=1538405099934063&ms=au%2Conr&signature=502BA209E90F3F595B00958C712E025B89E6C197.6391952A6EC1AC743801530E757BB7677CF15B19&mime=video%2Fmp4&mv=m&source=youtube&pl=18&txp=5531432&id=o-AKJ0FUP3xKd4n3w_AkBhJXU83R4Wm5kqSXcOQ0-7Wp3P&dur=115.937&fvip=6&mn=sn-i3b7kn76%2Csn-i3beln7z&itag=22&sparams=dur%2Cei%2Cid%2Cip%2Cipbits%2Citag%2Clmt%2Cmime%2Cmm%2Cmn%2Cms%2Cmv%2Cpl%2Cratebypass%2Crequiressl%2Csource%2Cexpire&ipbits=0&requiressl=yes&mm=31%2C26&ip=35.234.17.215",
                "extractor_key": "Youtube",
                "vcodec": "avc1.64001F",
                "http_headers": {
                    "Accept-Charset": "ISO-8859-1,utf-8;q=0.7,*;q=0.7",
                    "Accept-Language": "en-us,en;q=0.5",
                    "Accept-Encoding": "gzip, deflate",
                    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*!/!*;q=0.8",
                    "User-Agent": "Mozilla/5.0 (X11; Linux x86_64; rv:59.0) Gecko/20100101 Firefox/59.0"
                },
                "player_url": "/yts/jsbin/player_ias-vflof8Kxx/en_US/base.js",
                "channel_id": "UCKAqou7V9FAWXpZd9xtOg3Q",
                "ext": "mp4",
                "extractor": "youtube",
                "end_time": null,
                "webpage_url": "https://www.youtube.com/watch?v=by0e4didQpM",
                "formats": [
                        {
                        "http_headers": {
                            "Accept-Charset": "ISO-8859-1,utf-8;q=0.7,*;q=0.7",
                            "Accept-Language": "en-us,en;q=0.5",
                            "Accept-Encoding": "gzip, deflate",
                            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*!/!*;q=0.8",
                            "User-Agent": "Mozilla/5.0 (X11; Linux x86_64; rv:59.0) Gecko/20100101 Firefox/59.0"
                        },
                        "format_note": "DASH audio",
                        "protocol": "https",
                        "format": "249 - audio only (DASH audio)",
                        "url": "https://r1---sn-i3b7kn76.googlevideo.com/videoplayback?keepalive=yes&key=yt6&clen=807573&txp=5511222&mt=1542621970&gir=yes&sparams=clen%2Cdur%2Cei%2Cgir%2Cid%2Cip%2Cipbits%2Citag%2Ckeepalive%2Clmt%2Cmime%2Cmm%2Cmn%2Cms%2Cmv%2Cpl%2Crequiressl%2Csource%2Cexpire&requiressl=yes&expire=1542643626&ei=SovyW4fmCce5qQHm-r6wAg&c=WEB&lmt=1538405775891154&ms=au%2Conr&signature=1D4B0FACAB30DF3D709DCAA4E7176BD60E663C37.0B2FB688FF5CD95320C032D77C09DF0EFB6FBD0C&mime=audio%2Fwebm&mv=m&source=youtube&pl=18&id=o-AKJ0FUP3xKd4n3w_AkBhJXU83R4Wm5kqSXcOQ0-7Wp3P&dur=115.901&fvip=6&itag=249&ipbits=0&mn=sn-i3b7kn76%2Csn-i3beln7z&mm=31%2C26&ip=35.234.17.215&ratebypass=yes",
                        "vcodec": "none",
                        "tbr": 63.914,
                        "abr": 50,
                        "player_url": "/yts/jsbin/player_ias-vflof8Kxx/en_US/base.js",
                        "downloader_options": {"http_chunk_size": 10485760},
                        "ext": "webm",
                        "filesize": 807573,
                        "format_id": "249",
                        "quality": -1,
                        "acodec": "opus"
                    }, {
                        "http_headers": {
                            "Accept-Charset": "ISO-8859-1,utf-8;q=0.7,*;q=0.7",
                            "Accept-Language": "en-us,en;q=0.5",
                            "Accept-Encoding": "gzip, deflate",
                            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*!/!*;q=0.8",
                            "User-Agent": "Mozilla/5.0 (X11; Linux x86_64; rv:59.0) Gecko/20100101 Firefox/59.0"
                        },
                        "format_note": "DASH audio",
                        "protocol": "https",
                        "format": "250 - audio only (DASH audio)",
                        "url": "https://r1---sn-i3b7kn76.googlevideo.com/videoplayback?keepalive=yes&key=yt6&clen=1057550&txp=5511222&mt=1542621970&gir=yes&sparams=clen%2Cdur%2Cei%2Cgir%2Cid%2Cip%2Cipbits%2Citag%2Ckeepalive%2Clmt%2Cmime%2Cmm%2Cmn%2Cms%2Cmv%2Cpl%2Crequiressl%2Csource%2Cexpire&requiressl=yes&expire=1542643626&ei=SovyW4fmCce5qQHm-r6wAg&c=WEB&lmt=1538405775608541&ms=au%2Conr&signature=B8E8FD2A196D93F87BD043E71C00D443B79E93B8.B69F6087EA4B9FE70B35D1C8C39CC3AE0CB94B8B&mime=audio%2Fwebm&mv=m&source=youtube&pl=18&id=o-AKJ0FUP3xKd4n3w_AkBhJXU83R4Wm5kqSXcOQ0-7Wp3P&dur=115.901&fvip=6&itag=250&ipbits=0&mn=sn-i3b7kn76%2Csn-i3beln7z&mm=31%2C26&ip=35.234.17.215&ratebypass=yes",
                        "vcodec": "none",
                        "tbr": 83.038,
                        "abr": 70,
                        "player_url": "/yts/jsbin/player_ias-vflof8Kxx/en_US/base.js",
                        "downloader_options": {"http_chunk_size": 10485760},
                        "ext": "webm",
                        "filesize": 1057550,
                        "format_id": "250",
                        "quality": -1,
                        "acodec": "opus"
                    }, {
                        "http_headers": {
                            "Accept-Charset": "ISO-8859-1,utf-8;q=0.7,*;q=0.7",
                            "Accept-Language": "en-us,en;q=0.5",
                            "Accept-Encoding": "gzip, deflate",
                            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*!/!*;q=0.8",
                            "User-Agent": "Mozilla/5.0 (X11; Linux x86_64; rv:59.0) Gecko/20100101 Firefox/59.0"
                        },
                        "tbr": 127.98,
                        "container": "m4a_dash",
                        "format": "140 - audio only (DASH audio)",
                        "url": "https://r1---sn-i3b7kn76.googlevideo.com/videoplayback?keepalive=yes&key=yt6&clen=1842032&txp=5533432&mt=1542621970&gir=yes&sparams=clen%2Cdur%2Cei%2Cgir%2Cid%2Cip%2Cipbits%2Citag%2Ckeepalive%2Clmt%2Cmime%2Cmm%2Cmn%2Cms%2Cmv%2Cpl%2Crequiressl%2Csource%2Cexpire&requiressl=yes&expire=1542643626&ei=SovyW4fmCce5qQHm-r6wAg&c=WEB&lmt=1538404681522122&ms=au%2Conr&signature=DFA0B2881E9736F8EEA68756705843F2280C57E9.ABDC827AF851EFBF936B2748B46D8A592243D61E&mime=audio%2Fmp4&mv=m&source=youtube&pl=18&id=o-AKJ0FUP3xKd4n3w_AkBhJXU83R4Wm5kqSXcOQ0-7Wp3P&dur=115.937&fvip=6&itag=140&ipbits=0&mn=sn-i3b7kn76%2Csn-i3beln7z&mm=31%2C26&ip=35.234.17.215&ratebypass=yes",
                        "vcodec": "none",
                        "format_note": "DASH audio",
                        "abr": 128,
                        "player_url": "/yts/jsbin/player_ias-vflof8Kxx/en_US/base.js",
                        "downloader_options": {"http_chunk_size": 10485760},
                        "ext": "m4a",
                        "filesize": 1842032,
                        "protocol": "https",
                        "format_id": "140",
                        "quality": -1,
                        "acodec": "mp4a.40.2"
                    }, {
                        "http_headers": {
                            "Accept-Charset": "ISO-8859-1,utf-8;q=0.7,*;q=0.7",
                            "Accept-Language": "en-us,en;q=0.5",
                            "Accept-Encoding": "gzip, deflate",
                            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*!/!*;q=0.8",
                            "User-Agent": "Mozilla/5.0 (X11; Linux x86_64; rv:59.0) Gecko/20100101 Firefox/59.0"
                        },
                        "format_note": "DASH audio",
                        "protocol": "https",
                        "format": "171 - audio only (DASH audio)",
                        "url": "https://r1---sn-i3b7kn76.googlevideo.com/videoplayback?keepalive=yes&key=yt6&clen=1793763&txp=5511222&mt=1542621970&gir=yes&sparams=clen%2Cdur%2Cei%2Cgir%2Cid%2Cip%2Cipbits%2Citag%2Ckeepalive%2Clmt%2Cmime%2Cmm%2Cmn%2Cms%2Cmv%2Cpl%2Crequiressl%2Csource%2Cexpire&requiressl=yes&expire=1542643626&ei=SovyW4fmCce5qQHm-r6wAg&c=WEB&lmt=1538405776390855&ms=au%2Conr&signature=BFF4E92FF695106A6C8B508BA294353E027F2F3F.CCCE77B79301E55E64BE5C8719B95537468BC292&mime=audio%2Fwebm&mv=m&source=youtube&pl=18&id=o-AKJ0FUP3xKd4n3w_AkBhJXU83R4Wm5kqSXcOQ0-7Wp3P&dur=115.883&fvip=6&itag=171&ipbits=0&mn=sn-i3b7kn76%2Csn-i3beln7z&mm=31%2C26&ip=35.234.17.215&ratebypass=yes",
                        "vcodec": "none",
                        "tbr": 129.877,
                        "abr": 128,
                        "player_url": "/yts/jsbin/player_ias-vflof8Kxx/en_US/base.js",
                        "downloader_options": {"http_chunk_size": 10485760},
                        "ext": "webm",
                        "filesize": 1793763,
                        "format_id": "171",
                        "quality": -1,
                        "acodec": "vorbis"
                    }, {
                        "http_headers": {
                            "Accept-Charset": "ISO-8859-1,utf-8;q=0.7,*;q=0.7",
                            "Accept-Language": "en-us,en;q=0.5",
                            "Accept-Encoding": "gzip, deflate",
                            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*!/!*;q=0.8",
                            "User-Agent": "Mozilla/5.0 (X11; Linux x86_64; rv:59.0) Gecko/20100101 Firefox/59.0"
                        },
                        "format_note": "DASH audio",
                        "protocol": "https",
                        "format": "251 - audio only (DASH audio)",
                        "url": "https://r1---sn-i3b7kn76.googlevideo.com/videoplayback?keepalive=yes&key=yt6&clen=2053204&txp=5511222&mt=1542621970&gir=yes&sparams=clen%2Cdur%2Cei%2Cgir%2Cid%2Cip%2Cipbits%2Citag%2Ckeepalive%2Clmt%2Cmime%2Cmm%2Cmn%2Cms%2Cmv%2Cpl%2Crequiressl%2Csource%2Cexpire&requiressl=yes&expire=1542643626&ei=SovyW4fmCce5qQHm-r6wAg&c=WEB&lmt=1538405775783677&ms=au%2Conr&signature=65BF79AC86AF2A3CBF1D61F3876470149390794E.4937A0362E684AE7C76B16F3AF74C9F692EF2069&mime=audio%2Fwebm&mv=m&source=youtube&pl=18&id=o-AKJ0FUP3xKd4n3w_AkBhJXU83R4Wm5kqSXcOQ0-7Wp3P&dur=115.901&fvip=6&itag=251&ipbits=0&mn=sn-i3b7kn76%2Csn-i3beln7z&mm=31%2C26&ip=35.234.17.215&ratebypass=yes",
                        "vcodec": "none",
                        "tbr": 157.566,
                        "abr": 160,
                        "player_url": "/yts/jsbin/player_ias-vflof8Kxx/en_US/base.js",
                        "downloader_options": {"http_chunk_size": 10485760},
                        "ext": "webm",
                        "filesize": 2053204,
                        "format_id": "251",
                        "quality": -1,
                        "acodec": "opus"
                    }, {
                        "http_headers": {
                            "Accept-Charset": "ISO-8859-1,utf-8;q=0.7,*;q=0.7",
                            "Accept-Language": "en-us,en;q=0.5",
                            "Accept-Encoding": "gzip, deflate",
                            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*!/!*;q=0.8",
                            "User-Agent": "Mozilla/5.0 (X11; Linux x86_64; rv:59.0) Gecko/20100101 Firefox/59.0"
                        },
                        "tbr": 100.873,
                        "container": "webm",
                        "format": "278 - 256x144 (144p)",
                        "url": "https://r1---sn-i3b7kn76.googlevideo.com/videoplayback?keepalive=yes&key=yt6&clen=1349843&txp=5533432&aitags=133%2C134%2C135%2C136%2C137%2C160%2C242%2C243%2C244%2C247%2C248%2C278&mt=1542621970&gir=yes&sparams=aitags%2Cclen%2Cdur%2Cei%2Cgir%2Cid%2Cip%2Cipbits%2Citag%2Ckeepalive%2Clmt%2Cmime%2Cmm%2Cmn%2Cms%2Cmv%2Cpl%2Crequiressl%2Csource%2Cexpire&requiressl=yes&expire=1542643626&ei=SovyW4fmCce5qQHm-r6wAg&c=WEB&lmt=1538405350863071&ms=au%2Conr&signature=9D17BC497A2A9BDE866C6E9EAAB9556B347AA265.4763C47E36AF547EE92949A113A160096080619B&mime=video%2Fwebm&mv=m&source=youtube&pl=18&id=o-AKJ0FUP3xKd4n3w_AkBhJXU83R4Wm5kqSXcOQ0-7Wp3P&dur=115.882&fvip=6&itag=278&ipbits=0&mn=sn-i3b7kn76%2Csn-i3beln7z&mm=31%2C26&ip=35.234.17.215&ratebypass=yes",
                        "vcodec": "vp9",
                        "format_note": "144p",
                        "player_url": "/yts/jsbin/player_ias-vflof8Kxx/en_US/base.js",
                        "downloader_options": {"http_chunk_size": 10485760},
                        "width": 256,
                        "ext": "webm",
                        "filesize": 1349843,
                        "fps": 30,
                        "protocol": "https",
                        "format_id": "278",
                        "height": 144,
                        "quality": -1,
                        "acodec": "none"
                    }, {
                        "format_note": "144p",
                        "protocol": "https",
                        "format": "160 - 256x144 (144p)",
                        "tbr": 110.771,
                        "height": 144,
                        "downloader_options": {"http_chunk_size": 10485760},
                        "format_id": "160",
                        "quality": -1,
                        "http_headers": {
                            "Accept-Charset": "ISO-8859-1,utf-8;q=0.7,*;q=0.7",
                            "Accept-Language": "en-us,en;q=0.5",
                            "Accept-Encoding": "gzip, deflate",
                            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*!/!*;q=0.8",
                            "User-Agent": "Mozilla/5.0 (X11; Linux x86_64; rv:59.0) Gecko/20100101 Firefox/59.0"
                        },
                        "url": "https://r1---sn-i3b7kn76.googlevideo.com/videoplayback?keepalive=yes&key=yt6&clen=1501746&txp=5533432&aitags=133%2C134%2C135%2C136%2C137%2C160%2C242%2C243%2C244%2C247%2C248%2C278&mt=1542621970&gir=yes&sparams=aitags%2Cclen%2Cdur%2Cei%2Cgir%2Cid%2Cip%2Cipbits%2Citag%2Ckeepalive%2Clmt%2Cmime%2Cmm%2Cmn%2Cms%2Cmv%2Cpl%2Crequiressl%2Csource%2Cexpire&requiressl=yes&expire=1542643626&ei=SovyW4fmCce5qQHm-r6wAg&c=WEB&lmt=1538404992148404&ms=au%2Conr&signature=7902D740408C849B52DD4F71C7633E8228C5E4E9.6C0558F6428F961D20887C846DAB4DBD2BD65484&mime=video%2Fmp4&mv=m&source=youtube&pl=18&id=o-AKJ0FUP3xKd4n3w_AkBhJXU83R4Wm5kqSXcOQ0-7Wp3P&dur=115.882&fvip=6&itag=160&ipbits=0&mn=sn-i3b7kn76%2Csn-i3beln7z&mm=31%2C26&ip=35.234.17.215&ratebypass=yes",
                        "vcodec": "avc1.4d400c",
                        "player_url": "/yts/jsbin/player_ias-vflof8Kxx/en_US/base.js",
                        "width": 256,
                        "ext": "mp4",
                        "filesize": 1501746,
                        "fps": 30,
                        "acodec": "none"
                    }, {
                        "format_note": "240p",
                        "protocol": "https",
                        "format": "242 - 426x240 (240p)",
                        "tbr": 230.614,
                        "height": 240,
                        "downloader_options": {"http_chunk_size": 10485760},
                        "format_id": "242",
                        "quality": -1,
                        "http_headers": {
                            "Accept-Charset": "ISO-8859-1,utf-8;q=0.7,*;q=0.7",
                            "Accept-Language": "en-us,en;q=0.5",
                            "Accept-Encoding": "gzip, deflate",
                            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*!/!*;q=0.8",
                            "User-Agent": "Mozilla/5.0 (X11; Linux x86_64; rv:59.0) Gecko/20100101 Firefox/59.0"
                        },
                        "url": "https://r1---sn-i3b7kn76.googlevideo.com/videoplayback?keepalive=yes&key=yt6&clen=3003522&txp=5533432&aitags=133%2C134%2C135%2C136%2C137%2C160%2C242%2C243%2C244%2C247%2C248%2C278&mt=1542621970&gir=yes&sparams=aitags%2Cclen%2Cdur%2Cei%2Cgir%2Cid%2Cip%2Cipbits%2Citag%2Ckeepalive%2Clmt%2Cmime%2Cmm%2Cmn%2Cms%2Cmv%2Cpl%2Crequiressl%2Csource%2Cexpire&requiressl=yes&expire=1542643626&ei=SovyW4fmCce5qQHm-r6wAg&c=WEB&lmt=1538405289970800&ms=au%2Conr&signature=4693C40CFD7CBFF26DE8F307B064C31051AC0F1F.2EDCEC5A8A2621A58DA2BD97D4625F2554EA3EA5&mime=video%2Fwebm&mv=m&source=youtube&pl=18&id=o-AKJ0FUP3xKd4n3w_AkBhJXU83R4Wm5kqSXcOQ0-7Wp3P&dur=115.882&fvip=6&itag=242&ipbits=0&mn=sn-i3b7kn76%2Csn-i3beln7z&mm=31%2C26&ip=35.234.17.215&ratebypass=yes",
                        "vcodec": "vp9",
                        "player_url": "/yts/jsbin/player_ias-vflof8Kxx/en_US/base.js",
                        "width": 426,
                        "ext": "webm",
                        "filesize": 3003522,
                        "fps": 30,
                        "acodec": "none"
                    }, {
                        "format_note": "240p",
                        "protocol": "https",
                        "format": "133 - 426x240 (240p)",
                        "tbr": 298.619,
                        "height": 240,
                        "downloader_options": {"http_chunk_size": 10485760},
                        "format_id": "133",
                        "quality": -1,
                        "http_headers": {
                            "Accept-Charset": "ISO-8859-1,utf-8;q=0.7,*;q=0.7",
                            "Accept-Language": "en-us,en;q=0.5",
                            "Accept-Encoding": "gzip, deflate",
                            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*!/!*;q=0.8",
                            "User-Agent": "Mozilla/5.0 (X11; Linux x86_64; rv:59.0) Gecko/20100101 Firefox/59.0"
                        },
                        "url": "https://r1---sn-i3b7kn76.googlevideo.com/videoplayback?keepalive=yes&key=yt6&clen=3316873&txp=5533432&aitags=133%2C134%2C135%2C136%2C137%2C160%2C242%2C243%2C244%2C247%2C248%2C278&mt=1542621970&gir=yes&sparams=aitags%2Cclen%2Cdur%2Cei%2Cgir%2Cid%2Cip%2Cipbits%2Citag%2Ckeepalive%2Clmt%2Cmime%2Cmm%2Cmn%2Cms%2Cmv%2Cpl%2Crequiressl%2Csource%2Cexpire&requiressl=yes&expire=1542643626&ei=SovyW4fmCce5qQHm-r6wAg&c=WEB&lmt=1538404993366672&ms=au%2Conr&signature=6C887FD34043953BD74415A23AF886E0290F2934.6CF6D28CB53CDC44C535B73A31FE2FC281DD5709&mime=video%2Fmp4&mv=m&source=youtube&pl=18&id=o-AKJ0FUP3xKd4n3w_AkBhJXU83R4Wm5kqSXcOQ0-7Wp3P&dur=115.882&fvip=6&itag=133&ipbits=0&mn=sn-i3b7kn76%2Csn-i3beln7z&mm=31%2C26&ip=35.234.17.215&ratebypass=yes",
                        "vcodec": "avc1.4d4015",
                        "player_url": "/yts/jsbin/player_ias-vflof8Kxx/en_US/base.js",
                        "width": 426,
                        "ext": "mp4",
                        "filesize": 3316873,
                        "fps": 30,
                        "acodec": "none"
                    }, {
                        "format_note": "360p",
                        "protocol": "https",
                        "format": "243 - 640x360 (360p)",
                        "tbr": 421.872,
                        "height": 360,
                        "downloader_options": {"http_chunk_size": 10485760},
                        "format_id": "243",
                        "quality": -1,
                        "http_headers": {
                            "Accept-Charset": "ISO-8859-1,utf-8;q=0.7,*;q=0.7",
                            "Accept-Language": "en-us,en;q=0.5",
                            "Accept-Encoding": "gzip, deflate",
                            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*!/!*;q=0.8",
                            "User-Agent": "Mozilla/5.0 (X11; Linux x86_64; rv:59.0) Gecko/20100101 Firefox/59.0"
                        },
                        "url": "https://r1---sn-i3b7kn76.googlevideo.com/videoplayback?keepalive=yes&key=yt6&clen=5476904&txp=5533432&aitags=133%2C134%2C135%2C136%2C137%2C160%2C242%2C243%2C244%2C247%2C248%2C278&mt=1542621970&gir=yes&sparams=aitags%2Cclen%2Cdur%2Cei%2Cgir%2Cid%2Cip%2Cipbits%2Citag%2Ckeepalive%2Clmt%2Cmime%2Cmm%2Cmn%2Cms%2Cmv%2Cpl%2Crequiressl%2Csource%2Cexpire&requiressl=yes&expire=1542643626&ei=SovyW4fmCce5qQHm-r6wAg&c=WEB&lmt=1538405334827516&ms=au%2Conr&signature=D2C6B038CEF12A2E5F0001F069453AEC6262C604.67795DEE52605982B714F3D8C425106AED2B5EB5&mime=video%2Fwebm&mv=m&source=youtube&pl=18&id=o-AKJ0FUP3xKd4n3w_AkBhJXU83R4Wm5kqSXcOQ0-7Wp3P&dur=115.882&fvip=6&itag=243&ipbits=0&mn=sn-i3b7kn76%2Csn-i3beln7z&mm=31%2C26&ip=35.234.17.215&ratebypass=yes",
                        "vcodec": "vp9",
                        "player_url": "/yts/jsbin/player_ias-vflof8Kxx/en_US/base.js",
                        "width": 640,
                        "ext": "webm",
                        "filesize": 5476904,
                        "fps": 30,
                        "acodec": "none"
                    }, {
                        "format_note": "360p",
                        "protocol": "https",
                        "format": "134 - 640x360 (360p)",
                        "tbr": 640.335,
                        "height": 360,
                        "downloader_options": {"http_chunk_size": 10485760},
                        "format_id": "134",
                        "quality": -1,
                        "http_headers": {
                            "Accept-Charset": "ISO-8859-1,utf-8;q=0.7,*;q=0.7",
                            "Accept-Language": "en-us,en;q=0.5",
                            "Accept-Encoding": "gzip, deflate",
                            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*!/!*;q=0.8",
                            "User-Agent": "Mozilla/5.0 (X11; Linux x86_64; rv:59.0) Gecko/20100101 Firefox/59.0"
                        },
                        "url": "https://r1---sn-i3b7kn76.googlevideo.com/videoplayback?keepalive=yes&key=yt6&clen=6874045&txp=5533432&aitags=133%2C134%2C135%2C136%2C137%2C160%2C242%2C243%2C244%2C247%2C248%2C278&mt=1542621970&gir=yes&sparams=aitags%2Cclen%2Cdur%2Cei%2Cgir%2Cid%2Cip%2Cipbits%2Citag%2Ckeepalive%2Clmt%2Cmime%2Cmm%2Cmn%2Cms%2Cmv%2Cpl%2Crequiressl%2Csource%2Cexpire&requiressl=yes&expire=1542643626&ei=SovyW4fmCce5qQHm-r6wAg&c=WEB&lmt=1538404995156886&ms=au%2Conr&signature=196EACDAD673952FE71A3359CCC053FA66625BE4.3A6962F41A3D9BA43FEB782788C5C2239F9BFB07&mime=video%2Fmp4&mv=m&source=youtube&pl=18&id=o-AKJ0FUP3xKd4n3w_AkBhJXU83R4Wm5kqSXcOQ0-7Wp3P&dur=115.882&fvip=6&itag=134&ipbits=0&mn=sn-i3b7kn76%2Csn-i3beln7z&mm=31%2C26&ip=35.234.17.215&ratebypass=yes",
                        "vcodec": "avc1.4d401e",
                        "player_url": "/yts/jsbin/player_ias-vflof8Kxx/en_US/base.js",
                        "width": 640,
                        "ext": "mp4",
                        "filesize": 6874045,
                        "fps": 30,
                        "acodec": "none"
                    }, {
                        "format_note": "480p",
                        "protocol": "https",
                        "format": "244 - 854x480 (480p)",
                        "tbr": 775.83,
                        "height": 480,
                        "downloader_options": {"http_chunk_size": 10485760},
                        "format_id": "244",
                        "quality": -1,
                        "http_headers": {
                            "Accept-Charset": "ISO-8859-1,utf-8;q=0.7,*;q=0.7",
                            "Accept-Language": "en-us,en;q=0.5",
                            "Accept-Encoding": "gzip, deflate",
                            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*!/!*;q=0.8",
                            "User-Agent": "Mozilla/5.0 (X11; Linux x86_64; rv:59.0) Gecko/20100101 Firefox/59.0"
                        },
                        "url": "https://r1---sn-i3b7kn76.googlevideo.com/videoplayback?keepalive=yes&key=yt6&clen=9801171&txp=5533432&aitags=133%2C134%2C135%2C136%2C137%2C160%2C242%2C243%2C244%2C247%2C248%2C278&mt=1542621970&gir=yes&sparams=aitags%2Cclen%2Cdur%2Cei%2Cgir%2Cid%2Cip%2Cipbits%2Citag%2Ckeepalive%2Clmt%2Cmime%2Cmm%2Cmn%2Cms%2Cmv%2Cpl%2Crequiressl%2Csource%2Cexpire&requiressl=yes&expire=1542643626&ei=SovyW4fmCce5qQHm-r6wAg&c=WEB&lmt=1538405386518619&ms=au%2Conr&signature=B92BE8533E71AFCDBA50A6D01C013FCAFCD320B5.8AC13190AFBD42BAA6D91016770DA961C8CB53BE&mime=video%2Fwebm&mv=m&source=youtube&pl=18&id=o-AKJ0FUP3xKd4n3w_AkBhJXU83R4Wm5kqSXcOQ0-7Wp3P&dur=115.882&fvip=6&itag=244&ipbits=0&mn=sn-i3b7kn76%2Csn-i3beln7z&mm=31%2C26&ip=35.234.17.215&ratebypass=yes",
                        "vcodec": "vp9",
                        "player_url": "/yts/jsbin/player_ias-vflof8Kxx/en_US/base.js",
                        "width": 854,
                        "ext": "webm",
                        "filesize": 9801171,
                        "fps": 30,
                        "acodec": "none"
                    }, {
                        "format_note": "480p",
                        "protocol": "https",
                        "format": "135 - 854x480 (480p)",
                        "tbr": 1123.67,
                        "height": 480,
                        "downloader_options": {"http_chunk_size": 10485760},
                        "format_id": "135",
                        "quality": -1,
                        "http_headers": {
                            "Accept-Charset": "ISO-8859-1,utf-8;q=0.7,*;q=0.7",
                            "Accept-Language": "en-us,en;q=0.5",
                            "Accept-Encoding": "gzip, deflate",
                            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*!/!*;q=0.8",
                            "User-Agent": "Mozilla/5.0 (X11; Linux x86_64; rv:59.0) Gecko/20100101 Firefox/59.0"
                        },
                        "url": "https://r1---sn-i3b7kn76.googlevideo.com/videoplayback?keepalive=yes&key=yt6&clen=11726835&txp=5533432&aitags=133%2C134%2C135%2C136%2C137%2C160%2C242%2C243%2C244%2C247%2C248%2C278&mt=1542621970&gir=yes&sparams=aitags%2Cclen%2Cdur%2Cei%2Cgir%2Cid%2Cip%2Cipbits%2Citag%2Ckeepalive%2Clmt%2Cmime%2Cmm%2Cmn%2Cms%2Cmv%2Cpl%2Crequiressl%2Csource%2Cexpire&requiressl=yes&expire=1542643626&ei=SovyW4fmCce5qQHm-r6wAg&c=WEB&lmt=1538404996068027&ms=au%2Conr&signature=11BF0EEBAF20158DE4925315B383BF18019F4C6B.449571B083FF5FDB356E2BBD4B7F7DE9DA252813&mime=video%2Fmp4&mv=m&source=youtube&pl=18&id=o-AKJ0FUP3xKd4n3w_AkBhJXU83R4Wm5kqSXcOQ0-7Wp3P&dur=115.882&fvip=6&itag=135&ipbits=0&mn=sn-i3b7kn76%2Csn-i3beln7z&mm=31%2C26&ip=35.234.17.215&ratebypass=yes",
                        "vcodec": "avc1.4d401f",
                        "player_url": "/yts/jsbin/player_ias-vflof8Kxx/en_US/base.js",
                        "width": 854,
                        "ext": "mp4",
                        "filesize": 11726835,
                        "fps": 30,
                        "acodec": "none"
                    }, {
                        "format_note": "720p",
                        "protocol": "https",
                        "format": "247 - 1280x720 (720p)",
                        "tbr": 1536.409,
                        "height": 720,
                        "downloader_options": {"http_chunk_size": 10485760},
                        "format_id": "247",
                        "quality": -1,
                        "http_headers": {
                            "Accept-Charset": "ISO-8859-1,utf-8;q=0.7,*;q=0.7",
                            "Accept-Language": "en-us,en;q=0.5",
                            "Accept-Encoding": "gzip, deflate",
                            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*!/!*;q=0.8",
                            "User-Agent": "Mozilla/5.0 (X11; Linux x86_64; rv:59.0) Gecko/20100101 Firefox/59.0"
                        },
                        "url": "https://r1---sn-i3b7kn76.googlevideo.com/videoplayback?keepalive=yes&key=yt6&clen=17285666&txp=5533432&aitags=133%2C134%2C135%2C136%2C137%2C160%2C242%2C243%2C244%2C247%2C248%2C278&mt=1542621970&gir=yes&sparams=aitags%2Cclen%2Cdur%2Cei%2Cgir%2Cid%2Cip%2Cipbits%2Citag%2Ckeepalive%2Clmt%2Cmime%2Cmm%2Cmn%2Cms%2Cmv%2Cpl%2Crequiressl%2Csource%2Cexpire&requiressl=yes&expire=1542643626&ei=SovyW4fmCce5qQHm-r6wAg&c=WEB&lmt=1538405340627693&ms=au%2Conr&signature=0A958AA39813B44CFB495E63A318BA5B3140676A.8FCF1B601B86053FEA20C769A8521DFA6BE67C9F&mime=video%2Fwebm&mv=m&source=youtube&pl=18&id=o-AKJ0FUP3xKd4n3w_AkBhJXU83R4Wm5kqSXcOQ0-7Wp3P&dur=115.882&fvip=6&itag=247&ipbits=0&mn=sn-i3b7kn76%2Csn-i3beln7z&mm=31%2C26&ip=35.234.17.215&ratebypass=yes",
                        "vcodec": "vp9",
                        "player_url": "/yts/jsbin/player_ias-vflof8Kxx/en_US/base.js",
                        "width": 1280,
                        "ext": "webm",
                        "filesize": 17285666,
                        "fps": 30,
                        "acodec": "none"
                    }, {
                        "format_note": "720p",
                        "protocol": "https",
                        "format": "136 - 1280x720 (720p)",
                        "tbr": 1689.879,
                        "height": 720,
                        "downloader_options": {"http_chunk_size": 10485760},
                        "format_id": "136",
                        "quality": -1,
                        "http_headers": {
                            "Accept-Charset": "ISO-8859-1,utf-8;q=0.7,*;q=0.7",
                            "Accept-Language": "en-us,en;q=0.5",
                            "Accept-Encoding": "gzip, deflate",
                            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*!/!*;q=0.8",
                            "User-Agent": "Mozilla/5.0 (X11; Linux x86_64; rv:59.0) Gecko/20100101 Firefox/59.0"
                        },
                        "url": "https://r1---sn-i3b7kn76.googlevideo.com/videoplayback?keepalive=yes&key=yt6&clen=18871612&txp=5533432&aitags=133%2C134%2C135%2C136%2C137%2C160%2C242%2C243%2C244%2C247%2C248%2C278&mt=1542621970&gir=yes&sparams=aitags%2Cclen%2Cdur%2Cei%2Cgir%2Cid%2Cip%2Cipbits%2Citag%2Ckeepalive%2Clmt%2Cmime%2Cmm%2Cmn%2Cms%2Cmv%2Cpl%2Crequiressl%2Csource%2Cexpire&requiressl=yes&expire=1542643626&ei=SovyW4fmCce5qQHm-r6wAg&c=WEB&lmt=1538405022939543&ms=au%2Conr&signature=5DF290DE4DE158242EBEB9C8B8FE5719B8E4E467.C701693FF3A285C79C1DF8F3CF701FF2EAB20A3A&mime=video%2Fmp4&mv=m&source=youtube&pl=18&id=o-AKJ0FUP3xKd4n3w_AkBhJXU83R4Wm5kqSXcOQ0-7Wp3P&dur=115.882&fvip=6&itag=136&ipbits=0&mn=sn-i3b7kn76%2Csn-i3beln7z&mm=31%2C26&ip=35.234.17.215&ratebypass=yes",
                        "vcodec": "avc1.4d401f",
                        "player_url": "/yts/jsbin/player_ias-vflof8Kxx/en_US/base.js",
                        "width": 1280,
                        "ext": "mp4",
                        "filesize": 18871612,
                        "fps": 30,
                        "acodec": "none"
                    }, {
                        "format_note": "1080p",
                        "protocol": "https",
                        "format": "248 - 1920x1080 (1080p)",
                        "tbr": 2699.918,
                        "height": 1080,
                        "downloader_options": {"http_chunk_size": 10485760},
                        "format_id": "248",
                        "quality": -1,
                        "http_headers": {
                            "Accept-Charset": "ISO-8859-1,utf-8;q=0.7,*;q=0.7",
                            "Accept-Language": "en-us,en;q=0.5",
                            "Accept-Encoding": "gzip, deflate",
                            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*!/!*;q=0.8",
                            "User-Agent": "Mozilla/5.0 (X11; Linux x86_64; rv:59.0) Gecko/20100101 Firefox/59.0"
                        },
                        "url": "https://r1---sn-i3b7kn76.googlevideo.com/videoplayback?keepalive=yes&key=yt6&clen=28092559&txp=5533432&aitags=133%2C134%2C135%2C136%2C137%2C160%2C242%2C243%2C244%2C247%2C248%2C278&mt=1542621970&gir=yes&sparams=aitags%2Cclen%2Cdur%2Cei%2Cgir%2Cid%2Cip%2Cipbits%2Citag%2Ckeepalive%2Clmt%2Cmime%2Cmm%2Cmn%2Cms%2Cmv%2Cpl%2Crequiressl%2Csource%2Cexpire&requiressl=yes&expire=1542643626&ei=SovyW4fmCce5qQHm-r6wAg&c=WEB&lmt=1538405452328471&ms=au%2Conr&signature=07D9B265A4BFA7BEB8407946ED8C5CCAABA09AC3.1157A200987828D8AB9791A5995EB5E643153573&mime=video%2Fwebm&mv=m&source=youtube&pl=18&id=o-AKJ0FUP3xKd4n3w_AkBhJXU83R4Wm5kqSXcOQ0-7Wp3P&dur=115.882&fvip=6&itag=248&ipbits=0&mn=sn-i3b7kn76%2Csn-i3beln7z&mm=31%2C26&ip=35.234.17.215&ratebypass=yes",
                        "vcodec": "vp9",
                        "player_url": "/yts/jsbin/player_ias-vflof8Kxx/en_US/base.js",
                        "width": 1920,
                        "ext": "webm",
                        "filesize": 28092559,
                        "fps": 30,
                        "acodec": "none"
                    }, {
                        "format_note": "1080p",
                        "protocol": "https",
                        "format": "137 - 1920x1080 (1080p)",
                        "tbr": 2874.803,
                        "height": 1080,
                        "downloader_options": {"http_chunk_size": 10485760},
                        "format_id": "137",
                        "quality": -1,
                        "http_headers": {
                            "Accept-Charset": "ISO-8859-1,utf-8;q=0.7,*;q=0.7",
                            "Accept-Language": "en-us,en;q=0.5",
                            "Accept-Encoding": "gzip, deflate",
                            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*!/!*;q=0.8",
                            "User-Agent": "Mozilla/5.0 (X11; Linux x86_64; rv:59.0) Gecko/20100101 Firefox/59.0"
                        },
                        "url": "https://r1---sn-i3b7kn76.googlevideo.com/videoplayback?keepalive=yes&key=yt6&clen=29010224&txp=5533432&aitags=133%2C134%2C135%2C136%2C137%2C160%2C242%2C243%2C244%2C247%2C248%2C278&mt=1542621970&gir=yes&sparams=aitags%2Cclen%2Cdur%2Cei%2Cgir%2Cid%2Cip%2Cipbits%2Citag%2Ckeepalive%2Clmt%2Cmime%2Cmm%2Cmn%2Cms%2Cmv%2Cpl%2Crequiressl%2Csource%2Cexpire&requiressl=yes&expire=1542643626&ei=SovyW4fmCce5qQHm-r6wAg&c=WEB&lmt=1538405051771398&ms=au%2Conr&signature=3649A627EAD53153DE7A004CFB44386A42C64F6A.9ECA2928230361455A9F19B21A8FC75EDC1EA659&mime=video%2Fmp4&mv=m&source=youtube&pl=18&id=o-AKJ0FUP3xKd4n3w_AkBhJXU83R4Wm5kqSXcOQ0-7Wp3P&dur=115.882&fvip=6&itag=137&ipbits=0&mn=sn-i3b7kn76%2Csn-i3beln7z&mm=31%2C26&ip=35.234.17.215&ratebypass=yes",
                        "vcodec": "avc1.640028",
                        "player_url": "/yts/jsbin/player_ias-vflof8Kxx/en_US/base.js",
                        "width": 1920,
                        "ext": "mp4",
                        "filesize": 29010224,
                        "fps": 30,
                        "acodec": "none"
                    }, {
                        "http_headers": {
                            "Accept-Charset": "ISO-8859-1,utf-8;q=0.7,*;q=0.7",
                            "Accept-Language": "en-us,en;q=0.5",
                            "Accept-Encoding": "gzip, deflate",
                            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*!/!*;q=0.8",
                            "User-Agent": "Mozilla/5.0 (X11; Linux x86_64; rv:59.0) Gecko/20100101 Firefox/59.0"
                        },
                        "protocol": "https",
                        "format": "17 - 176x144 (small)",
                        "url": "https://r1---sn-i3b7kn76.googlevideo.com/videoplayback?key=yt6&expire=1542643626&mt=1542621970&mime=video%2F3gpp&ei=SovyW4fmCce5qQHm-r6wAg&c=WEB&lmt=1538403070123695&ms=au%2Conr&signature=1F05A13F3EC29DDC92300FB71C0C7DEA468182FF.3130B1C09FACE181BFA0A3AFDFA2892F49EFF34C&clen=1156624&mv=m&source=youtube&pl=18&txp=5531432&id=o-AKJ0FUP3xKd4n3w_AkBhJXU83R4Wm5kqSXcOQ0-7Wp3P&dur=116.006&fvip=6&mn=sn-i3b7kn76%2Csn-i3beln7z&itag=17&gir=yes&sparams=clen%2Cdur%2Cei%2Cgir%2Cid%2Cip%2Cipbits%2Citag%2Clmt%2Cmime%2Cmm%2Cmn%2Cms%2Cmv%2Cpl%2Crequiressl%2Csource%2Cexpire&ipbits=0&requiressl=yes&mm=31%2C26&ip=35.234.17.215&ratebypass=yes",
                        "vcodec": "mp4v.20.3",
                        "format_note": "small",
                        "ext": "3gp",
                        "player_url": "/yts/jsbin/player_ias-vflof8Kxx/en_US/base.js",
                        "width": 176,
                        "abr": 24,
                        "filesize": 1156624,
                        "format_id": "17",
                        "height": 144,
                        "resolution": "176x144",
                        "acodec": "mp4a.40.2"
                    }, {
                        "protocol": "https",
                        "format": "36 - 320x180 (small)",
                        "format_note": "small",
                        "height": 180,
                        "format_id": "36",
                        "http_headers": {
                            "Accept-Charset": "ISO-8859-1,utf-8;q=0.7,*;q=0.7",
                            "Accept-Language": "en-us,en;q=0.5",
                            "Accept-Encoding": "gzip, deflate",
                            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*!/!*;q=0.8",
                            "User-Agent": "Mozilla/5.0 (X11; Linux x86_64; rv:59.0) Gecko/20100101 Firefox/59.0"
                        },
                        "url": "https://r1---sn-i3b7kn76.googlevideo.com/videoplayback?key=yt6&expire=1542643626&mt=1542621970&mime=video%2F3gpp&ei=SovyW4fmCce5qQHm-r6wAg&c=WEB&lmt=1538403070122804&ms=au%2Conr&signature=08374425238CD79F5D9DE781AF373B55D0492535.83D1781FD83066E424500266A43545F7D940FF2A&clen=3151699&mv=m&source=youtube&pl=18&txp=5531432&id=o-AKJ0FUP3xKd4n3w_AkBhJXU83R4Wm5kqSXcOQ0-7Wp3P&dur=116.006&fvip=6&mn=sn-i3b7kn76%2Csn-i3beln7z&itag=36&gir=yes&sparams=clen%2Cdur%2Cei%2Cgir%2Cid%2Cip%2Cipbits%2Citag%2Clmt%2Cmime%2Cmm%2Cmn%2Cms%2Cmv%2Cpl%2Crequiressl%2Csource%2Cexpire&ipbits=0&requiressl=yes&mm=31%2C26&ip=35.234.17.215&ratebypass=yes",
                        "vcodec": "mp4v.20.3",
                        "player_url": "/yts/jsbin/player_ias-vflof8Kxx/en_US/base.js",
                        "width": 320,
                        "ext": "3gp",
                        "filesize": 3151699,
                        "resolution": "320x180",
                        "acodec": "mp4a.40.2"
                    }, {
                        "http_headers": {
                            "Accept-Charset": "ISO-8859-1,utf-8;q=0.7,*;q=0.7",
                            "Accept-Language": "en-us,en;q=0.5",
                            "Accept-Encoding": "gzip, deflate",
                            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*!/!*;q=0.8",
                            "User-Agent": "Mozilla/5.0 (X11; Linux x86_64; rv:59.0) Gecko/20100101 Firefox/59.0"
                        },
                        "protocol": "https",
                        "format": "18 - 640x360 (medium)",
                        "url": "https://r1---sn-i3b7kn76.googlevideo.com/videoplayback?ratebypass=yes&key=yt6&clen=10364468&txp=5531432&mt=1542621970&gir=yes&sparams=clen%2Cdur%2Cei%2Cgir%2Cid%2Cip%2Cipbits%2Citag%2Clmt%2Cmime%2Cmm%2Cmn%2Cms%2Cmv%2Cpl%2Cratebypass%2Crequiressl%2Csource%2Cexpire&requiressl=yes&expire=1542643626&ei=SovyW4fmCce5qQHm-r6wAg&c=WEB&lmt=1538403070625914&ms=au%2Conr&signature=50EE3AB939897B124184EA170B86606555D496D6.46AD4CAB0EEB6EFE457D567D4A4BD51B11826211&mime=video%2Fmp4&mv=m&source=youtube&pl=18&id=o-AKJ0FUP3xKd4n3w_AkBhJXU83R4Wm5kqSXcOQ0-7Wp3P&dur=115.937&fvip=6&itag=18&ipbits=0&mn=sn-i3b7kn76%2Csn-i3beln7z&mm=31%2C26&ip=35.234.17.215",
                        "quality": 1,
                        "vcodec": "avc1.42001E",
                        "format_note": "medium",
                        "ext": "mp4",
                        "player_url": "/yts/jsbin/player_ias-vflof8Kxx/en_US/base.js",
                        "width": 640,
                        "abr": 96,
                        "filesize": 10364468,
                        "format_id": "18",
                        "height": 360,
                        "resolution": "640x360",
                        "acodec": "mp4a.40.2"
                    }, {
                        "http_headers": {
                            "Accept-Charset": "ISO-8859-1,utf-8;q=0.7,*;q=0.7",
                            "Accept-Language": "en-us,en;q=0.5",
                            "Accept-Encoding": "gzip, deflate",
                            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*!/!*;q=0.8",
                            "User-Agent": "Mozilla/5.0 (X11; Linux x86_64; rv:59.0) Gecko/20100101 Firefox/59.0"
                        },
                        "protocol": "https",
                        "format": "43 - 640x360 (medium)",
                        "url": "https://r1---sn-i3b7kn76.googlevideo.com/videoplayback?ratebypass=yes&key=yt6&clen=12898499&txp=5511222&mt=1542621970&gir=yes&sparams=clen%2Cdur%2Cei%2Cgir%2Cid%2Cip%2Cipbits%2Citag%2Clmt%2Cmime%2Cmm%2Cmn%2Cms%2Cmv%2Cpl%2Cratebypass%2Crequiressl%2Csource%2Cexpire&requiressl=yes&expire=1542643626&ei=SovyW4fmCce5qQHm-r6wAg&c=WEB&lmt=1538405853842976&ms=au%2Conr&signature=1AC01DEFCCDD38E2D4AFFA2E8E8A3758D997CF91.39725BCD5CE8F1AC52E8D26D6CE3E4F64ADA07FC&mime=video%2Fwebm&mv=m&source=youtube&pl=18&id=o-AKJ0FUP3xKd4n3w_AkBhJXU83R4Wm5kqSXcOQ0-7Wp3P&dur=0.000&fvip=6&itag=43&ipbits=0&mn=sn-i3b7kn76%2Csn-i3beln7z&mm=31%2C26&ip=35.234.17.215",
                        "quality": 1,
                        "vcodec": "vp8.0",
                        "format_note": "medium",
                        "ext": "webm",
                        "player_url": "/yts/jsbin/player_ias-vflof8Kxx/en_US/base.js",
                        "width": 640,
                        "abr": 128,
                        "filesize": 12898499,
                        "format_id": "43",
                        "height": 360,
                        "resolution": "640x360",
                        "acodec": "vorbis"
                    }, {
                        "http_headers": {
                            "Accept-Charset": "ISO-8859-1,utf-8;q=0.7,*;q=0.7",
                            "Accept-Language": "en-us,en;q=0.5",
                            "Accept-Encoding": "gzip, deflate",
                            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*!/!*;q=0.8",
                            "User-Agent": "Mozilla/5.0 (X11; Linux x86_64; rv:59.0) Gecko/20100101 Firefox/59.0"
                        },
                        "protocol": "https",
                        "format": "22 - 1280x720 (hd720)",
                        "url": "https://r1---sn-i3b7kn76.googlevideo.com/videoplayback?key=yt6&expire=1542643626&ratebypass=yes&mt=1542621970&ei=SovyW4fmCce5qQHm-r6wAg&c=WEB&lmt=1538405099934063&ms=au%2Conr&signature=502BA209E90F3F595B00958C712E025B89E6C197.6391952A6EC1AC743801530E757BB7677CF15B19&mime=video%2Fmp4&mv=m&source=youtube&pl=18&txp=5531432&id=o-AKJ0FUP3xKd4n3w_AkBhJXU83R4Wm5kqSXcOQ0-7Wp3P&dur=115.937&fvip=6&mn=sn-i3b7kn76%2Csn-i3beln7z&itag=22&sparams=dur%2Cei%2Cid%2Cip%2Cipbits%2Citag%2Clmt%2Cmime%2Cmm%2Cmn%2Cms%2Cmv%2Cpl%2Cratebypass%2Crequiressl%2Csource%2Cexpire&ipbits=0&requiressl=yes&mm=31%2C26&ip=35.234.17.215",
                        "quality": 2,
                        "vcodec": "avc1.64001F",
                        "format_note": "hd720",
                        "ext": "mp4",
                        "player_url": "/yts/jsbin/player_ias-vflof8Kxx/en_US/base.js",
                        "width": 1280,
                        "abr": 192,
                        "format_id": "22",
                        "height": 720,
                        "resolution": "1280x720",
                        "acodec": "mp4a.40.2"
                    }
                ],
                "channel_url": "http://www.youtube.com/channel/UCKAqou7V9FAWXpZd9xtOg3Q",
                "resolution": "1280x720",
                "width": 1280,
                "age_limit": 0
            }
            */
        },
        
        

    },
}
</script>
