<template>
    <el-card id="el_card">
        <el-row :gutter="5" style="margin-bottom:10px" >
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
            <el-col :span='3'>
                <el-select v-model="value_" placeholder="请选择">
                    <el-option
                    v-for="item in options_"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                </el-select>
            </el-col>
            <el-col :span='7'>
                <el-input
                    placeholder="请在这里输入搜索内容"
                    v-model="input"
                    clearable>
                </el-input>
            </el-col>
            <el-col :span='1.5'>
                <el-button type="primary" icon="el-icon-search" @click="search">搜索</el-button>
            </el-col>
            <el-col :span='1.5'>
                <el-button type="primary" @click="look">新增</el-button>
            </el-col>
            <el-col :span='1.5'>
                <el-button type="primary" @click="refund">回收站</el-button>
            </el-col>
        </el-row>
        <el-row  v-if="tableDataLook">
            <el-col>
                <el-table
                    :data="tableData"
                    border
                    style="width: 100%">
                    <el-table-column
                    prop="id"
                    label="仓库Id"
                    width="150">
                    </el-table-column>
                    <el-table-column
                    prop="name"
                    label="仓库名称"
                    width="150">
                    </el-table-column>
                    <el-table-column
                    prop="address_shop"
                    label="仓库地址"
                    width="350">
                    </el-table-column>
                    <el-table-column
                    prop="address_boss"
                    label="所属门店"
                    width="350">
                    </el-table-column>
                    <el-table-column
                    prop="phone_p"
                    label="固定电话"
                    width="190">
                    </el-table-column>
                    <el-table-column
                    prop="phone_m"
                    label="手机号码"
                    width="180">
                    </el-table-column>
                    <el-table-column
                    prop="createtime"
                    label="创建时间"
                    width="250">
                    </el-table-column>
                </el-table>
            </el-col>
        </el-row>
        <el-row style="margin-top:50px"  v-if="tableDataLook">
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
         <el-row  v-if="!tableDataLook">
            <el-col>
                <el-table
                    :data="tableData_look"
                    border
                    style="width: 100%">
                    <el-table-column
                    prop="id"
                    label="仓库Id"
                    width="150">
                    </el-table-column>
                    <el-table-column
                    prop="directly"
                    label="是否直营"
                    width="150">
                    </el-table-column>
                    <el-table-column
                    prop="name"
                    label="仓库名称"
                    width="150">
                    </el-table-column>
                    <el-table-column
                    prop="address_shop"
                    label="仓库地址"
                    width="350">
                    </el-table-column>
                    <el-table-column
                    prop="address_boss"
                    label="所属门店"
                    width="350">
                    </el-table-column>
                    <el-table-column
                    prop="phone_p"
                    label="固定电话"
                    width="200">
                    </el-table-column>
                    <el-table-column
                    prop="phone_m"
                    label="手机号码"
                    width="150">
                    </el-table-column>
                    <el-table-column
                    prop="createtime"
                    label="创建时间"
                    width="200">
                    </el-table-column>
                    <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button
                        size="mini"
                        @click="recovery(scope.$index, scope.row)" >恢复</el-button>
                        <el-button
                        size="mini"
                        type="danger"
                        @click="del(scope.$index, scope.row)">删除</el-button>
                    </template>
                    </el-table-column>
                </el-table>
            </el-col>
        </el-row>
        <el-row style="margin-top:50px"  v-if="!tableDataLook">
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
        this.getwarehouse();
    },
    data() {
        return {
            options: [
                {
                value: '1',
                label: '选择加盟商'
                },{
                value: '2',
                label: '加盟商1'
                }, {
                value: '3',
                label: '加盟商2'
            }],
            options_: [
                {
                value: '1',
                label: '选择仓库'
                },{
                value: '2',
                label: '仓库ID'
                }, {
                value: '3',
                label: '仓库名称'
            }],
            value: '1',
            value_: '1',
            input:"",
            tableDataLook:false,
            tableData: [{
                id:1,
                name:"张三",
                address_shop:"上海市普陀区金沙江路 1518 弄",
                phone_m:"159293947652",
                address_boss:"aaaa大叔大婶多奥术大师大所大",
                status:true,
                phone_p:1565461466256,
                createtime:"2019-07-11 06:52:20",
                },
                {
                id:2,
                name:"张三",
                address_shop:"上海市普陀区金沙江路 1518 弄",
                phone_m:"159293947652",
                address_boss:"啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊",
                status:false,
                phone_p:1565461466256,
                createtime:"2019-07-11 06:52:20"
                }],
            tableData_look: [{
                id:1,
                name:"张三",
                address_shop:"上海市普陀区金沙江路 1518 弄",
                phone_m:"159293947652",
                address_boss:"aaaa大叔大婶多奥术大师大所大",
                status:true,
                phone_p:1565461466256,
                createtime:"2019-07-11 06:52:20",
                directly:"直营店"
                },
                {
                id:2,
                name:"张三",
                address_shop:"上海市普陀区金沙江路 1518 弄",
                phone_m:"159293947652",
                address_boss:"啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊",
                status:false,
                phone_p:1565461466256,
                createtime:"2019-07-11 06:52:20",
                directly:"加盟店"
                }],
                Page: {
                    pagenum: 1,
                    pagesize: 10,
                    count: 0,
                    count_look:0,
                    forsale: "",
                    id: "",
                    type: "",
                    keyword: "",
                },
            }
        },
    methods:{
            getwarehouse() {
                this.$api.getwarehouse(this.Page)
                .then(res=>{
                    res.data.code == 200 ? (  this.tableData = res.data.tableData):(this.$api.error(res.data.msg))
                })
                .catch(res => {
                this.$api.error();
                console.log(res);
                });
            },
            search(){
                this.$api.warehousesearch(this.input)
                .then(res=>{
                    res.data.code == 200 ? (  this.tableData = res.data.tableData, this.Page.count = res.data.count,this.$message.success('查询成功')):(this.$api.error(res.data.msg))
                })
                .catch(res => {
                this.$api.error();
                console.log(res);
                });
            },
            // 分页
            handleCurrentChange(e) {
                this.Page.pagenum = e;
                this.getwarehouse(this.Page);
            },
            // 分页
            handleSizeChange(e) {
                this.Page.pagesize = e;
                this.getwarehouse(this.Page);
            },
            // 新增
            look(){
                // this.tableDataLook = false
                this.$router.push("./warehouseAdd")
            },
            // 回收站
            refund(){
                this.$router.push("./warehouseRefund")
            },
            // 恢复
            recovery(i,v){
                console.log(i,v)
                this.$confirm('本次将恢复此仓库, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                    }).then(() => {
                        this.$api.warehousedel(v.id)
                        .then(res=>{
                            res.data.code == 200 ? (  this.$message({
                            type: 'success',
                            message: '恢复成功!'
                        }),this.getwarehouse(this.Page)):(this.$message({
                            type: 'info',
                            message: '恢复失败!'
                        }))
                        })
                        .catch(res => {
                             this.$api.error();         
                        });  
                    }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消'
                    });          
                });
            },
            // 删除
            del(i,v){
                console.log(i,v)
                this.$confirm('此操作将删除该条信息, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                    }).then(() => {
                        this.$api.warehousedel(v.id)
                        .then(res=>{
                            res.data.code == 200 ? (  this.$message({
                            type: 'success',
                            message: '删除成功!'
                        }),this.getwarehouse(this.Page)):(this.$message({
                            type: 'info',
                            message: '删除失败!'
                        }))
                        })
                        .catch(res => {
                             this.$api.error();         
                        });  
                    }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消'
                    });          
                });
            },
            
    }
}
</script>
<style lang="less">

</style>