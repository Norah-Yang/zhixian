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
                    label="店铺Id"
                    width="150">
                    </el-table-column>
                    <el-table-column
                    prop="name"
                    label="店铺名称"
                    width="150">
                    </el-table-column>
                    <el-table-column
                    prop="member_number"
                    label="序列号"
                    width="200">
                    </el-table-column>
                    <el-table-column
                    prop="shop_cont"
                    label="店铺介绍"
                    width="350">
                    </el-table-column>
                    <el-table-column
                    prop="address_shop"
                    label="店铺地址"
                    width="350">
                    </el-table-column>
                    <el-table-column
                    prop="phone_m"
                    label="联系电话"
                    width="250">
                    </el-table-column>
                    <el-table-column  label="是否启用">
                        <template slot-scope="scope">
                        <el-switch v-model="scope.row.del"  @change="statusChange(scope.row)"></el-switch>
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
        this.getshoplist();
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
                label: '选择店铺'
                },{
                value: '2',
                label: '店铺ID'
                }, {
                value: '3',
                label: '店铺名称'
            }],
            value: '1',
            value_: '1',
            input:"",
            tableData: [{
                id:1,
                name:"张三",
                address_shop:"上海市普陀区金沙江路 1518 弄",
                phone_m:"159293947652",
                shop_cont:"aaaa大叔大婶多奥术大师大所大",
                status:true,
                member_number:1321600640663
                },
                {
                id:2,
                name:"张三",
                address_shop:"上海市普陀区金沙江路 1518 弄",
                phone_m:"159293947652",
                shop_cont:"啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊",
                status:false,
                member_number:1321600640663
                }],
                Page: {
                    pagenum: 1,
                    pagesize: 10,
                    count: 0,
                    forsale: "",
                    id: "",
                    type: "",
                    keyword: "",
                },
            }
        },
    methods:{
            getshoplist() {
                this.$api.getshoplist(this.Page)
                .then(res=>{
                    res.data.code == 200 ? (  this.tableData = res.data.tableData):(this.$api.error(res.data.msg))
                })
                .catch(res => {
                this.$api.error();
                console.log(res);
                });
            },
            search(){
                this.$api.shopsearch(this.input)
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
                this.getshoplist(this.Page);
            },
            // 分页
            handleSizeChange(e) {
                this.Page.pagesize = e;
                this.getshoplist(this.Page);
            },
            // 修改状态
             statusChange (row) {
                const newdata =Object.assign(this.Page,row)
                console.log(newdata)
                this.$api.shopstatus(newdata)
                .then(res=>{
                    res.data.code == 200 ?
                    (this.tableData = res.data.tableData, this.Page.count = res.data.count,this.$message.success('查询成功'),this.getshoplist(this.Page))
                    :(this.$message.error('修改状态失败！'),this.getshoplist(this.Page))
                })
                .catch(res => {
                this.$api.error();
                console.log(res);
                });
                
            },
    }
}
</script>
<style lang="less">

</style>