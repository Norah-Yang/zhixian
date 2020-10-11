<template>
    <el-card id="el_card">
        <el-row :gutter="5" style="margin-bottom:10px">
            <el-col :span='3'>
                <el-select v-model="value" placeholder="请选择">
                    <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                </el-select>
            </el-col>
            <el-col :span='6'>
                <el-input
                    placeholder="请在这里输入搜索内容"
                    v-model="input"
                    clearable>
                </el-input>
            </el-col>
            <el-col :span='5'>
                <el-button type="primary" icon="el-icon-search" @click="search">搜索</el-button>
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
                    label="加盟商Id"
                    width="80">
                    </el-table-column>
                    <el-table-column
                    prop="name"
                    label="加盟商名称"
                    width="120">
                    </el-table-column>
                    <el-table-column
                    prop="address_shop"
                    label="加盟商地址"
                    width="300">
                    </el-table-column>
                    <el-table-column
                    prop="phone_g"
                    label="固定电话"
                    width="180">
                    </el-table-column>
                    <el-table-column
                    prop="phone_m"
                    label="手机号码"
                    width="180">
                    </el-table-column>
                    <el-table-column
                    prop="address_www"
                    label="登录地址">
                    </el-table-column>
                    <el-table-column
                    prop="user"
                    label="管理员"
                    width="100">
                    </el-table-column>
                    <el-table-column
                    prop="data"
                    label="创建时间"
                    width="100">
                    </el-table-column>
                    <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button
                        size="mini"
                        @click="edit(scope.$index, scope.row)" >编辑</el-button>
                        <el-button
                        size="mini"
                        type="danger"
                        @click="unload(scope.$index, scope.row)">重置密码</el-button>
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
        this.getMerchantList();
    },
    data() {
        return {
            options: [{
                value: '1',
                label: '加盟商ID'
                }, {
                value: '2',
                label: '加盟商名称'
            }],
            input:"",
            value: '2',
            tableData: [{
                id:1,
                name:"张三",
                address_shop:"上海市普陀区金沙江路 1518 弄",
                phone_g:"159293947652",
                phone_m:"159293947652",
                address_www:"www.baidu.com",
                user:"6266",
                data: '2016-05-02',
                name: '王小虎'
                },
                {
                id:2,
                name:"张三",
                address_shop:"上海市普陀区金沙江路 1518 弄",
                phone_g:"159293947652",
                phone_m:"159293947652",
                address_www:"www.baidu.com",
                user:"6266",
                data: '2016-05-02',
                name: '王小虎'
                }],
                Page: {
                    pagenum: 1,
                    pagesize: 10,
                    count: 0,
                    forsale: "",
                    id: "",
                    type: "",
                    keyword: ""
                }
            }
        },
    methods:{
            getMerchantList() {
                this.$api.getMerchantList(this.Page)
                .then(res=>{
                    res.data.code == 200 ? (  this.tableData = res.data.tableData):(this.$api.error(res.data.msg))
                })
                .catch(res => {
                this.$api.error();
                console.log(res);
                });
            },
            edit(i,v){
                console.log(i,v)
                this.$router.push("./merchantEdit")
            },
            unload(i,v){
                console.log(i,v)
            },
            search(){
                this.$api.merchantsearch(this.input)
                .then(res=>{
                    res.data.code == 200 ? (  this.tableData = res.data.tableData, this.Page.count = res.data.count):(this.$api.error(res.data.msg))
                })
                .catch(res => {
                this.$api.error();
                console.log(res);
                });
            },
            // 分页
            handleCurrentChange(e) {
                this.Page.pagenum = e;
                this.ontable();
            },
            // 分页
            handleSizeChange(e) {
                this.Page.pagesize = e;
                this.ontable();
            },
    }
}
</script>
<style lang="less">

</style>