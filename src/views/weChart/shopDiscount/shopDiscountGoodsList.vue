<template>
    <el-card id="el_card">
        <el-row>
            <el-col>
                <el-table
                    :data="tableData"
                    border
                    style="width: 100%">
                    <el-table-column
                    prop="iid"
                    label="商品ID">
                    </el-table-column>
                    <el-table-column label="商品图片">
                    <template slot-scope="row">
                        <div v-if="row.row.thumb">
                        <el-image style="width: 80px; height:70px" :src="row.row.thumb" ></el-image>
                        </div>
                        <div v-else>暂无图片</div>
                    </template>
                    </el-table-column>
                    <el-table-column
                    prop="name"
                    label="名称">
                    </el-table-column>
                    <el-table-column
                    prop="type"
                    label="分类">
                    </el-table-column>
                    <el-table-column
                    prop="amount"
                    label="规格">
                    </el-table-column>
                    <el-table-column
                    prop="sale_price"
                    label="售价">
                    </el-table-column>
                    <el-table-column
                    prop="sale_price"
                    label="特价">
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
                            :pagenum="Page.pagenum"
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
        console.log(this.$route.query.id)
        this.activeList();
        this.Page.id = this.$route.query.id
    },
    data() {
        return {
            tableData: [],
            Page: {
                pagenum: 1,
                pagesize: 5,
                count:0,
                id:"",
            },
            }
        },
    methods:{
            activeList() {
                 this.$api.activeList(this.Page)
                .then(res=>{
                        console.log(res.data)
                        if( res.data.code == 200){
                            this.$message.success("查询成功")
                            res.data.add.forEach(ele=>{
                                if(ele.id == this.Page.id){
                                    console.log(ele)
                                     this.tableData = ele.goods
                                     this.Page.count= ele.goods.length
                                }
                            })
                            
                            this.Page.pagenum=res.data.pagenum
                        }else{
                        }       
                })
                .catch(res => {
                this.$api.error();
                });
            },
            // 分页
            handleCurrentChange(e) {
                this.Page.pagenum = e;
                this.activeList(this.Page);
            },
            // 分页
            handleSizeChange(e) {
                this.Page.pagesize = e;
                this.activeList(this.Page);
            },
    }
}
</script>
<style lang="less">

</style>