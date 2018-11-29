<template>
    <el-row>
        <el-col :span="24">
            <el-form :inline="true" :model="searchQuery">

                <el-form-item label="标题" >
                    <el-input v-model="searchQuery.title" placeholder="标题"></el-input>
                </el-form-item>

                <el-form-item>
                    <el-button type="primary" @click="searchForm">查询</el-button>
                </el-form-item>
            </el-form>
            
            <el-button type="primary" @click="getVideoDownloadLogs">搜索</el-button>
        </el-col>

        <el-col :span="24">
            
            <el-table :data="videoDownloadLogs" border>
                <el-table-column prop="id" label="ID" width="130">
                    <template slot-scope="scope"><a :href="scope.row.doc.webPageUrl" target="_blank">{{ scope.row.id }}</a></template>
                </el-table-column>
                <el-table-column prop="doc" label="标题" >
                    <template slot-scope="scope">{{ scope.row.doc.title }}</template>
                </el-table-column>

                <el-table-column prop="id" label="视频描述" width="120">
                    <template slot-scope="scope">{{ scope.row.doc.format }} </template>
                </el-table-column>

                <el-table-column prop="id" label="格式" width="50">
                    <template slot-scope="scope">{{ scope.row.doc.ext }} </template>
                </el-table-column>
                
                <el-table-column prop="id" label="文件大小" width="80">
                    <template slot-scope="scope"> {{ scope.row.doc.fileSize | sizeDisplay }}  </template>
                </el-table-column>

                <el-table-column prop="id" label="视频尺寸" width="90">
                    <template slot-scope="scope"> {{ scope.row.doc.resolution }} </template>
                </el-table-column>

                <el-table-column prop="id" label="操作" width="60">
                    <template slot-scope="scope">
                        <el-button type="danger" icon="el-icon-delete" circle @click="delVideoRecord( scope.row.id)"></el-button>
                    </template>
                </el-table-column>
            </el-table>
            
            <el-pagination :current-page.sync="pagination.pageNo" :page-size="pagination.pageSize" :pager-count="15" :total="pagination.total" background layout="total, prev, pager, next, jumper" @current-change="changePage" />
        </el-col>
        
    </el-row>
    
</template>

<script>
import db from '../database/index'
import { httpErrorHandler } from '../services/httpErrorHandler'

export default {
    components: {},
    data () {
        return {
            videoDownloadLogs: [],
            pagination: {
                pageNo: 1,
                pageSize: 100,
                total: 100,
            },

            searchQuery: {
                title: '',
            },
        }
    },
    
    created: function () {
        // `this` points to the vm instance
        console.log('Vue Component created: ')
        this.getVideoDownloadLogs()
    },
    
    methods: {
        changePage (currentPageNo) {
            console.log('当前分页 Pagination No: ', currentPageNo)
            this.getVideoDownloadLogs()
        },

        getVideoDownloadLogs () {
            this.videoDownloadLogs = []
            this.searchQuery.skip = (this.pagination.pageNo - 1) * this.pagination.pageSize
            this.searchQuery.limit = this.pagination.pageSize
            this.searchQuery.include_docs = true
            
            db.videoDownloadLogs.allDocs(this.searchQuery).then((result) => {
                console.log('当前列表数据: ', result)
                this.videoDownloadLogs = result.rows
                console.log('当前列表数据: ', this.videoDownloadLogs)
            }).catch(httpErrorHandler)
        },

        searchForm () {
            this.pagination.pageNo = 1
            this.getVideoDownloadLogs()
        },

        delVideoRecord (id) {
            console.log(id)
            db.videoDownloadLogs.get(id).then((doc) => {
                return db.videoDownloadLogs.remove(doc)
            }).then((result) => {
                this.getVideoDownloadLogs()
                this.$notify.success({ title: '操作成功', message: '' })
            }).catch(httpErrorHandler)
        },
    },
}
</script>
