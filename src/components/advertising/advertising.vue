<template>
    <el-card id="el_card">
        <el-row :gutter="15" style="margin-bottom:10px">
            <el-col :span='1'>
                <el-button type="primary"  @click="add" size="mini">新增广告</el-button>
            </el-col>
        </el-row>
        <el-row>
            <el-col>
                <el-table
                    :data="tableData"
                    border
                    style="width: 100%">
                    <el-table-column
                    prop="id"
                    label="ID"
                    width="100">
                    </el-table-column>
                    <el-table-column
                    prop="sort"
                    label="排序"
                    width="100">
                    </el-table-column>
                    <el-table-column
                    prop="type"
                    label="广告类型"
                    width="200">
                    </el-table-column>
                    <el-table-column
                    prop="intro"
                    label="广告内容"
                    width="300">
                    </el-table-column>
                    <el-table-column
                    prop="shop_id"
                    label="店铺列表"
                    width="250">
                    </el-table-column>
                     <el-table-column
                    prop="machine_id"
                    label="收银机器"
                    width="250">
                    </el-table-column>
                    <el-table-column label="广告图片">
                    <template slot-scope="row">
                        <div v-if="row.row.thumb">
                        <el-image style="width: 200px; height: 100px" :src="row.row.thumb" ></el-image>
                        </div>
                        <div v-else>暂无图片</div>
                    </template>
                    </el-table-column>
                    <el-table-column label="显示状态" prop="status">
                    <template slot-scope="row">
                        <el-switch
                        v-model="row.row.status"
                        active-color="#008080"
                        inactive-color="#ff4949"
                        active-text="是"
                        inactive-text="否"
                        :active-value="1"
                        :inactive-value="0"
                        @change="onswitchType(row.$index,row.row)"
                        ></el-switch>
                    </template>
                    </el-table-column>
                    <el-table-column label="操作" width="200">
                    <template slot-scope="scope">
                        <el-button
                        type="primary"
                        size="mini"
                        icon="el-icon-edit"
                        @click="edit(scope.$index, scope.row)" >编辑</el-button>
                        <el-button
                        type="danger"
                        size="mini"
                        icon="el-icon-delete"
                        @click="del(scope.$index, scope.row)" >删除</el-button>
                    </template>
                    </el-table-column>
                </el-table>
            </el-col>
        </el-row>
        <el-row style="margin-top:50px">
           <el-col>
                <div class="pagination">
                        <el-pagination
                            @size-change="handleSizeChange"
                            @current-change="handleCurrentChange"
                            :page-sizes="[7, 12, 15, 20]"
                            layout="total, sizes, prev, pager, next, jumper"
                            :total="Page.count"
                        ></el-pagination>
                </div>
            </el-col> 
        </el-row>
    </el-card>
</template>

<script>

export default {
    created() {
        
        this.getCarousel();
    },
    data() {
        return {
            input:"",
            value:"",
            tableData: [],
            Page: {
                pagenum: 1,
                pagesize: 10,
                count:0,
                id:"",
                shop_id:"",
                machine:"",
            },
            }
        },
    methods:{
           async getCarousel() {
               const loading = this.$loading({
                    lock: true,
                    text: 'Loading',
                    spinner: 'el-icon-loading',
                    background: 'rgba(0, 0, 0, 0.1)'
                });
                 this.$api.advertisingSetting(this.Page)
                .then(res=>{
                    let i = res.data
                    console.log(  i.list)
                        if(i.code == 200){
                            // this.$message.success("查询成功")
                            loading.close()
                            this.tableData = i.list.data
                            this.Page.count=i.list.total
                            this.Page.pagenum=i.list.current_page
                        }else{
                            this.$api.error(res.data.msg)
                        }       
                })
                .catch(res => {
                this.$api.error();
                });
            },
            // 修改状态
            onswitchType(index,e) { 
            this.$api
                .advertisingStatusSetting({
                params: {
                    id: e.id,
                    status: e.status
                }
                })
                .then(res => {
                console.log(res);
                if (res.data.code == 200) {
                    this.$message.success(res.data.msg);
                    this.getCarousel();
                }
                })
                .catch(res => {
                console.log(res);
                });
            },
            add(){
                this.$router.push('./advertisingEdit')
            },
            edit(i,el){
                this.$router.push({path:"./advertisingEdit",query:{id:el.id}})
            },
            del(i,el){
               this.$api
                .advertisingDelSetting({
                params: {
                    id:el.id,
                }
                })
                .then(res => {
                console.log(res);
                if (res.data.code == 200) {
                    this.$message.success(res.data.msg);
                    this.getCarousel();
                }
                })
                .catch(res => {
                console.log(res);
                });
            },
            // 分页
            handleCurrentChange(e) {
                this.Page.pagenum = e;
                this.getCarousel(this.Page);
            },
            // 分页
            handleSizeChange(e) {
                this.Page.pagesize = e;
                this.getCarousel(this.Page);
            },
    }
}
</script>
<style lang="less">

</style>