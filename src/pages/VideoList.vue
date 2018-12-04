<template>
    <el-row>
        <el-col :span="24">
            <el-form :inline="true" :model="searchQuery">

                <el-form-item label="标题:" >
                    <el-input v-model="searchQuery.title" placeholder="标题"></el-input>
                </el-form-item>

                <el-form-item label="ID:" >
                    <el-input v-model="searchQuery.id" placeholder="ID"></el-input>
                </el-form-item>
                
                <el-form-item>
                    <el-button type="primary" @click="searchForm">查询</el-button>
                </el-form-item>
            </el-form>
            
            <el-button type="primary" @click="getVideoList">搜索</el-button>
        </el-col>

        <el-col :span="24">
            
            <el-table :data="videoList" border>
                <el-table-column prop="id" label="ID" width="130">
                    <template slot-scope="scope"><a :href="scope.row.url" target="_blank">{{ scope.row._id }}</a></template>
                </el-table-column>
                <el-table-column prop="title" label="标题" > </el-table-column>
                <el-table-column prop="uploader" label="作者" width="130"> </el-table-column>
                <el-table-column prop="uploadDate" label="原始上传时间" width="90"> </el-table-column>
                
                <el-table-column prop="id" label="浏览/喜欢" width="120">
                    <template slot-scope="scope">{{ scope.row.viewCount }} / {{ scope.row.likeCount }} </template>
                </el-table-column>
                
                <!--
                <el-table-column prop="id" label="说明" >
                    <template slot-scope="scope">{{ scope.row.description }} </template>
                </el-table-column>
                
                <el-table-column prop="jsonInfo" label="视频信息" >
                    <template slot-scope="scope">{{ scope.row.jsonInfo }}</template>
                </el-table-column>
                -->

                <el-table-column prop="id" label="操作" width="120">
                    <template slot-scope="scope">
                        <el-button icon="el-icon-search" circle @click="gotoDownloadLogs( scope.row )"></el-button>
                        <br>
                        <el-button type="primary" icon="el-icon-edit" circle @click="gotoSingleVideo( scope.row )"></el-button>
                        <el-button type="danger" icon="el-icon-delete" circle @click="delVideoRecord( scope.row._id)"></el-button>
                    </template>
                </el-table-column>
            </el-table>
            
            <el-pagination :current-page.sync="pagination.pageNo" :page-size="pagination.pageSize" :pager-count="15" :total="pagination.total" background layout="total, prev, pager, next, jumper" @current-change="changePage" />
        </el-col>
        
    </el-row>
    
</template>

<script>
import { DBVideos } from '../database/index'
import { httpErrorHandler } from '../services/httpErrorHandler'

export default {
    components: {},
    data () {
        return {
            videoList: [],
            pagination: {
                pageNo: 1,
                pageSize: 100,
                total: 100,
            },

            searchQuery: {
                title: '',
                id: '',
            },
        }
    },
    
    created: function () {
        // `this` points to the vm instance
        this.getVideoList()
    },
    
    methods: {
        changePage (currentPageNo) {
            console.log('当前分页 Pagination No: ', currentPageNo)
            this.getVideoList()
        },

        getVideoList () {
            this.videoList = []
            // this.searchQuery.include_docs = true
            //
            // DBVideos.allDocs(this.searchQuery).then((result) => {
            //     console.log('当前列表数据: ', result)
            //     this.videoList = result.rows
            //     console.log('当前列表数据: ', this.videoList)
            // }).catch(httpErrorHandler)

            DBVideos.find({
                selector: {
                    title: { $regex: this.searchQuery.title },
                    _id: { $regex: 'youtube_' + this.searchQuery.id },
                },
                limit: this.pagination.pageSize,
                skip: (this.pagination.pageNo - 1) * this.pagination.pageSize,

            }).then((result) => {
                console.log('当前列表数据: ', result)
                this.videoList = result.docs
            }).catch(httpErrorHandler)
        },

        searchForm () {
            this.pagination.pageNo = 1
            this.getVideoList()
        },

        delVideoRecord (id) {
            console.log(id)
            DBVideos.get(id).then((doc) => {
                return DBVideos.remove(doc)
            }).then((result) => {
                this.getVideoList()
                this.$notify.success({ title: '操作成功', message: '' })
            }).catch(httpErrorHandler)
        },

        gotoSingleVideo (row) {
            console.log('row: ', row)
            this.$router.push({ name: 'editNewVideo', params: { videoId: row._id } })
        },

        gotoDownloadLogs (row) {
            this.$router.push({ name: 'videoDownloadLogs', params: { videoId: row._id } })
        },
    },
}
</script>
