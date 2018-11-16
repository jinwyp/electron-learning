<template>
    <el-row>
        <el-col :span="24">
            <el-button type="primary" @click="getVideoList">搜索</el-button>
        </el-col>

        <el-col :span="24">

            
            <el-table :data="videoList" border>
                <el-table-column prop="id" label="ID" width="150" />
                <el-table-column prop="doc" label="标题" width="150">
                    <template slot-scope="scope">{{ scope.row.doc.title }}</template>
                </el-table-column>
                <el-table-column prop="doc" label="Url" >
                    <template slot-scope="scope">{{ scope.row.doc.url }}</template>
                </el-table-column>
            </el-table>
            
            <el-pagination :current-page.sync="pagination.pageNo" :page-size="pagination.pageSize" :pager-count="15" :total="pagination.total" background layout="total, prev, pager, next, jumper" @current-change="changePage" />
        </el-col>
        
    </el-row>
    
</template>

<script>
import db from '../database/index'

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
            })
        },
    },
}
</script>
