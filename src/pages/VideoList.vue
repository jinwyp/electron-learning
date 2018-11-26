<template>
    <el-row>
        <el-col :span="24">
            <el-button type="primary" @click="getVideoList">搜索</el-button>
        </el-col>

        <el-col :span="24">

            
            <el-table :data="videoList" border>
                <el-table-column prop="id" label="ID" width="130">
                    <template slot-scope="scope"><a :href="scope.row.doc.url" target="_blank">{{ scope.row.id }}</a></template>
                </el-table-column>
                <el-table-column prop="doc" label="标题" >
                    <template slot-scope="scope">{{ scope.row.doc.title }}</template>
                </el-table-column>

                <el-table-column prop="id" label="作者" width="120">
                    <template slot-scope="scope">{{ scope.row.doc.uploader }} </template>
                </el-table-column>

                <el-table-column prop="id" label="上传时间" width="90">
                    <template slot-scope="scope">{{ scope.row.doc.uploadDate }} </template>
                </el-table-column>
                
                <el-table-column prop="id" label="浏览/喜欢" width="120">
                    <template slot-scope="scope">{{ scope.row.doc.viewCount }} / {{ scope.row.doc.likeCount }} </template>
                </el-table-column>
<!--

                <el-table-column prop="id" label="说明" >
                    <template slot-scope="scope">{{ scope.row.doc.description }} </template>
                </el-table-column>
                
                <el-table-column prop="jsonInfo" label="视频信息" >
                    <template slot-scope="scope">{{ scope.row.doc.jsonInfo }}</template>
                </el-table-column>
-->

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
            videoList: [],
            pagination: {
                pageNo: 1,
                pageSize: 20,
                total: 100,
            },
        }
    },
    
    created: function () {
        // `this` points to the vm instance
        console.log('Vue Component created: ')
        this.getVideoList()
    },
    
    methods: {
        changePage (currentPageNo) {
            console.log('当前分页 Pagination No: ', currentPageNo)
            this.getVideoList()
        },

        getVideoList () {
            db.videos.allDocs({ include_docs: true }).then((result) => {
                console.log('当前列表数据: ', result)
                this.videoList = result.rows
                console.log('当前列表数据: ', this.videoList)
            }).catch(httpErrorHandler)
        },
        
        delVideoRecord (id) {
            console.log(id)
            db.videos.get(id).then((doc) => {
                return db.videos.remove(doc)
            }).then((result) => {
                this.getVideoList()
                this.$notify.success({ title: '操作成功', message: '' })
            }).catch(httpErrorHandler)
        },
    },
}
</script>
