<template>
    <el-row>
        <el-col :span="24">
            <el-form :inline="true" :model="searchQuery">
                <el-form-item label="标题">
                    <el-input v-model="searchQuery.title" placeholder="标题"></el-input>
                </el-form-item>

                <el-form-item label="ID:">
                    <el-input v-model="searchQuery.id" placeholder="ID"></el-input>
                </el-form-item>
                
                <el-form-item>
                    <el-button type="primary" @click="searchForm">查询</el-button>
                </el-form-item>
            </el-form>
            
        </el-col>

        <el-col :span="24">
            
            <el-table :data="videoDownloadLogs" border>
                <el-table-column prop="id" label="ID" width="130">
                    <template slot-scope="scope"><a :href="scope.row.webPageUrl" target="_blank">{{ scope.row._id }}</a></template>
                </el-table-column>
                <el-table-column prop="title" label="标题"> </el-table-column>
                <el-table-column prop="format" label="视频描述" width="120"> </el-table-column>
                <el-table-column prop="ext" label="格式" width="50"> </el-table-column>
                
                <el-table-column prop="id" label="文件大小" width="80">
                    <template slot-scope="scope"> {{ scope.row.fileSize | sizeDisplay }}  </template>
                </el-table-column>

                <el-table-column prop="resolution" label="视频尺寸" width="90"> </el-table-column>

                <el-table-column prop="id" label="操作" width="60">
                    <template slot-scope="scope">
                        <el-button type="danger" icon="el-icon-delete" circle @click="delVideoRecord( scope.row._id)"></el-button>
                    </template>
                </el-table-column>
            </el-table>
            
            <el-pagination :current-page.sync="pagination.pageNo" :page-size="pagination.pageSize" :pager-count="15" :total="pagination.total" background layout="total, prev, pager, next, jumper" @current-change="changePage" />
        </el-col>
        
    </el-row>
    
</template>

<script>
import { DBVideoDownloadLogs } from '../../database/index'
import { httpErrorHandler } from '../../services/httpErrorHandler'

export default {
    components: {},
    data () {
        return {
            videoDownloadLogs: [],
            pagination: {
                pageNo: 1,
                pageSize: 50,
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
        if (this.$route.params && this.$route.params.videoId) {
            console.log('this.$route: ', this.$route)
            this.searchQuery.id = this.$route.params.videoId
        }
        
        this.getVideoDownloadLogs()
    },
    
    methods: {
        changePage (currentPageNo) {
            console.log('当前分页 Pagination No: ', currentPageNo)
            this.getVideoDownloadLogs()
        },
        searchForm () {
            this.pagination.pageNo = 1
            this.getVideoDownloadLogs()
        },
        
        getVideoDownloadLogs () {
            this.videoDownloadLogs = []

            const query = {}

            if (this.searchQuery.title) {
                query.title = this.searchQuery.title
            }
            if (this.searchQuery.id) {
                query.youtubeId = this.searchQuery.id
            }
            
            DBVideoDownloadLogs.cfind(query).skip((this.pagination.pageNo - 1) * this.pagination.pageSize).limit(this.pagination.pageSize).exec().then((result) => {
                console.log('当前Youtube 已下载列表数据: ', result)
                this.videoDownloadLogs = result
            }).catch(httpErrorHandler)

            DBVideoDownloadLogs.count(query).then((result) => {
                console.log('当前Youtube 已下载列表数量: ', result)
                this.pagination.total = result
            }).catch(httpErrorHandler)
        },



        delVideoRecord (id) {
            DBVideoDownloadLogs.remove({ _id: id }).then((result) => {
                this.getVideoDownloadLogs()
                this.$notify.success({ title: '操作成功', message: '' })
            }).catch(httpErrorHandler)
        },
    },
}
</script>
