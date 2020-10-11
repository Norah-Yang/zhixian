<template>
    <el-card id="el_card">
        <el-row :gutter="15" style="margin-bottom:10px">
            <el-col :span="3">
                <el-select v-model="Page.discount_state" placeholder="请活动分类">
                <el-option v-for="item in options" :key="item.value" :label="item.title" :value="item.id"></el-option>
                </el-select>
            </el-col>
            <el-col :span="3">
                <el-select v-model="Page.type" placeholder="请选择查询条件">
                <el-option v-for="item in options1" :key="item.value" :label="item.title" :value="item.id"></el-option>
                </el-select>
            </el-col>
            <el-col :span="6">
                <el-input placeholder="请在这里输入搜索内容" v-model="Page.keywords" clearable></el-input>
            </el-col>
            <el-col :span="1.5">
                <el-button type="primary" icon="el-icon-search" @click="search">搜索</el-button>
            </el-col>
            <el-col :span="1">
                <el-button type="primary" @click="add">新增</el-button>
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
                    label="活动ID">
                    </el-table-column>
                    <el-table-column
                    prop="name"
                    label="活动名称">
                    </el-table-column>
                    <el-table-column
                    prop="start_time"
                    label="生效开始时间">
                    </el-table-column>
                    <el-table-column
                    prop="end_time"
                    label="生效结束时间">
                    </el-table-column>
                    <el-table-column
                    label="折扣类型">
                     <template slot-scope="row">
                         <span>{{row.row.discount_state == 0 ?'限时特价' : '限时折扣'}}</span>
                    </template>
                    </el-table-column>
                    <el-table-column
                    prop="limit_sale"
                    label="限购设置">
                    </el-table-column>
                    <el-table-column label="状态" prop="state">
                    <template slot-scope="row">
                        <el-switch
                        v-model="row.row.state"
                        active-color="#008080"
                        inactive-color="#ff4949"
                        active-text="是"
                        inactive-text="否"
                        :active-value="1"
                        :inactive-value="0"
                        :disabled="disabled"
                        @change="onswitchType(row.$index,row.row)"
                        ></el-switch>
                    </template>
                    </el-table-column>
                    <el-table-column label="操作" width="300">
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
                        <el-button
                        v-if="scope.row.goods_state == 1 || scope.row.goods_state == 0"
                        type="success"
                        size="mini"
                        @click="shop_list(scope.$index, scope.row)" >商品列表</el-button>
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
        
        this.limitShop();
    },
    data() {
        return {
            tableData: [],
            disabled:false,
            options: [
                { value: 1, title: "限时折扣",id:1 },
                { value: 0, title: "限时特价",id:0}
            ],
            options1: [
                { value: 1, title: "活动ID",id:1 },
                { value: 2, title: "活动名称",id:2}
            ],
            Page: {
                pagenum: 1,
                pagesize: 10,
                count:0,
                id:"",
                shop_id:"",
                machine:"",
                discount_state:"",//活动状态
                type:"",
                keywords:"",//输入值
            },
            }
        },
    methods:{
            limitShop() {
                 this.$api.limitShop(this.Page)
                .then(res=>{
                    let i = res.data
                        if(i.code == 200){
                            this.$message.success("查询成功")
                            this.tableData =res.data.add
                            this.Page.count=res.data.count
                            // this.Page.pagenum=res.data.pagenum
                           
                        }else{

                        }       
                })
                .catch(res => {
                this.$api.error();
                });
            },
            // 修改状态
            onswitchType(index,e) { 
                this.disabled = true
                setTimeout(() => {
                    this.disabled = false
                }, 1000);
                this.$api
                    .limitStoreState({ sale_id: e.id,state:e.state })
                    .then(res => {
                    if (res.data.code == 200) {
                        this.limitShop();
                    }
                    })
                    .catch(res => {
                    console.log(res);
                });
            },
            add(){
                this.$router.push('./shopDiscountEdit')
            },
            edit(i,el){
                this.$router.push({path:"./shopDiscountEdit",query:{id:el.id}})
            },
            shop_list(i,el){
                this.$router.push({path:"./shopDiscountGoodsList",query:{id:el.id}})
            },
            del(i,el){
               this.$api
                .activeDel({sale_id:el.id}).then(res => {
                if (res.data.code == 200) {
                    this.$message.success(res.data.msg);
                    this.limitShop();
                }
                })
                .catch(res => {
                console.log(res);
                });
            },
            // 搜索
             search() {
                this.limitShop();
            },
            // 分页
            handleCurrentChange(e) {
                this.Page.pagenum = e;
                this.limitShop(this.Page);
            },
            // 分页
            handleSizeChange(e) {
                this.Page.pagesize = e;
                this.limitShop(this.Page);
            },
    }
}
</script>
<style lang="less">

</style>