<template>
    <el-row>
        <el-col :span="24">
            <el-form :inline="true" :model="searchQuery">
                <el-form-item label="关键字:">
                    <el-input v-model="searchQuery.sourceFullPath" placeholder="标题"></el-input>
                </el-form-item>

                <el-form-item label="ID:">
                    <el-input v-model="searchQuery.id" placeholder="ID"></el-input>
                </el-form-item>
                
                <el-form-item class="form-item-button">
                    <el-button type="primary" @click="searchForm">查询</el-button>
                </el-form-item>
            </el-form>
            
        </el-col>

        <el-col :span="24">
            
            <el-table :data="audioList" border>
                <el-table-column prop="id" label="源文件" width="340">
                    <template slot-scope="scope">
                        <span> {{ scope.row.sourceFilename }} </span>
                        <br>
                        <br>
                        <span>( {{ scope.row._id }} )</span>
                    </template>
                </el-table-column>
                <el-table-column prop="targetFilename" label="转换后文件">
                    <template slot-scope="scope">
                        <span> {{ scope.row.targetFilename }} </span>
                        <br>
                        <br>
                        <span>( {{ scope.row.targetFullPath }} )</span>
                    </template>
                </el-table-column>
                <el-table-column prop="targetFileExt" label="格式" width="50"> </el-table-column>
                <el-table-column prop="createTime" label="转换时间" width="100"> </el-table-column>
                
                <el-table-column prop="id" label="操作" width="120">
                    <template slot-scope="scope">
                        <el-button type="primary" icon="el-icon-edit" circle @click="gotoSingleAudio( scope.row )"></el-button>
                        <el-button type="danger" icon="el-icon-delete" circle @click="delAudioRecord( scope.row._id)"></el-button>
                    </template>
                </el-table-column>
            </el-table>
            
            <el-pagination :current-page.sync="pagination.pageNo" :page-size="pagination.pageSize" :pager-count="15" :total="pagination.total" background layout="total, prev, pager, next, jumper" @current-change="changePage" />
        </el-col>
        
    </el-row>
    
</template>

<script>
import { DBAudioConvertLogs } from '../../database/index'
import { httpErrorHandler } from '../../services/httpErrorHandler'

export default {
    components: {},
    data () {
        return {
            audioList: [],
            pagination: {
                pageNo: 1,
                pageSize: 100,
                total: 100,
            },

            searchQuery: {
                sourceFullPath: '',
                id: '',
            },
        }
    },
    
    created: function () {
        // `this` points to the vm instance
        this.getAudioList()
    },
    
    methods: {
        changePage (currentPageNo) {
            console.log('当前分页 Pagination No: ', currentPageNo)
            this.getAudioList()
        },

        getAudioList () {
            this.audioList = []

            DBAudioConvertLogs.find({
                selector: {
                    sourceFullPath: { $regex: this.searchQuery.sourceFullPath },
                    _id: { $regex: this.searchQuery.id },
                },
                limit: this.pagination.pageSize,
                skip: (this.pagination.pageNo - 1) * this.pagination.pageSize,

            }).then((result) => {
                console.log('当前列表数据: ', result)
                this.audioList = result.docs
            }).catch(httpErrorHandler)
        },

        searchForm () {
            this.pagination.pageNo = 1
            this.getAudioList()
        },

        delAudioRecord (id) {
            console.log(id)
            DBAudioConvertLogs.get(id).then((doc) => {
                return DBAudioConvertLogs.remove(doc)
            }).then((result) => {
                this.getAudioList()
                this.$notify.success({ title: '操作成功', message: '' })
            }).catch(httpErrorHandler)
        },

        gotoSingleAudio (row) {
            console.log('row: ', row)
            this.$router.push({ name: 'editAudio', params: { audioId: row._id } })
        },
    },
}
</script>
