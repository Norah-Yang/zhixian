<template>
    <el-card id="el_card">
     
     <el-form :model="dynamicValidateForm" ref="dynamicValidateForm" label-width="100px" class="demo-dynamic">
        <el-form-item
            v-for="(domain, index) in dynamicValidateForm.domains"
            :label="'充值金额' + ''"
            :key="domain.key"
            :prop="'domains.' + index + '.value'"
        >
            <el-row :gutter='5'>
                <el-col :span="5">
                    <el-input v-model="domain.sale_price"></el-input>
                </el-col>
                <el-col  :span="0.1">
                  <el-link type="primary">储值金额</el-link>
                </el-col>
                  <el-col  :span="5">
                    <el-input v-model="domain.price"></el-input>
                </el-col>
              
                <el-col  :span="5">
                    <el-button @click.prevent="removeDomain(domain)" v-if='domain.id'>删除</el-button>
                    <el-button @click.prevent="removeDomain_(domain)" v-if='!domain.id'>删除</el-button>
                    <el-button type="primary" @click="submitForm(domain)">提交</el-button>
                </el-col>
            </el-row>
        </el-form-item>
        <el-form-item>
           <el-button type="primary" @click="addDomain">新增</el-button> 
        </el-form-item>
        </el-form>
    </el-card>
    
</template>

<script>

export default {
    created() {
        this.gerules();
    },
    data() {
        return {
                dynamicValidateForm: {
                domains: [],
                }
            }
        },
    methods:{
            submitForm(val) {
                    val.id ? this.edit(val) :
                    this.$api.rulesAdd(val)
                        .then(res=>{
                            res.data.code == 200 ? (this.$message({
                                    type: 'success',
                                    message: '添加成功!'
                                }),this.gerules()):(this.$api.error(res.data.msg))
                        })
                        .catch(res => {
                        this.$api.error();
                        });
            },
            removeDomain_(item){
                let index = this.dynamicValidateForm.domains.indexOf(item)
                index !== -1 ? (this.dynamicValidateForm.domains.splice(index, 1)) : ""
            },
            removeDomain(item) {
                let index = this.dynamicValidateForm.domains.indexOf(item)
                    this.$confirm('此操作将删除该条信息, 是否继续?', '提示', {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            type: 'warning'
                            }).then(() => {
                                this.$api.rulesDel(item)
                                .then(res=>{
                                    res.data.code == 200 ? (this.$message({
                                    type: 'success',
                                    message: '删除成功!'
                                }), this.gerules()) : (
                                    this.$message({
                                    type: 'info',
                                    message: '已取消'
                                })
                                )
                                })
                                .catch(res => {
                                this.$api.error();
                                });
                            }) 
            },
            addDomain() {
                this.dynamicValidateForm.domains.push({
                sale_price: 0,
                price:0,
                key: Date.now()
                });
            },
            gerules() {
                this.$api.rules()
                .then(res=>{
                    res.data.code == 200 ? (  this.dynamicValidateForm.domains = res.data.list):(this.$api.error(res.data.msg))
                })
                .catch(res => {
                this.$api.error();
                });
            },
            // 新增
            add(){
                this.tableData.push(
                    {
                        sale_price:0,
                        price:0
                    }
                )
            },
            // 修改
            edit(val){
                console.log(val)
                   this.$api.rulesEdit(val)
                        .then(res=>{
                            res.data.code == 200 ? (  this.$message({
                            type: 'success',
                            message: '修改成功!'
                        }),this.gerules()):(this.$message({
                            type: 'info',
                            message: '修改失败!'
                        }))
                        })
                        .catch(res => {
                             this.$api.error();         
                    });
            },
            
    }
}
</script>
<style lang="less">

</style>