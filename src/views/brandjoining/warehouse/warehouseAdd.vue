<template>
  <el-card>
    <el-row>
        <el-col :span="15">
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
                <el-form-item label="仓库名称" prop="name">
                    <el-input v-model="ruleForm.name"></el-input>
                </el-form-item>
                <el-form-item label="仓库地址" prop="name">
                   <area-cascader type='text' :level='1' v-model='ruleForm.addresss' :data="pcaa" @change="cityChange" ></area-cascader>
                </el-form-item>
                <el-form-item label="详细地址" prop="address">
                    <el-input v-model="ruleForm.address"></el-input>
                </el-form-item>
                <el-form-item label="手机号码" prop="phone_">
                    <el-input v-model="ruleForm.phone_"></el-input>
                </el-form-item>
                <el-form-item label="电话号码" prop="phone__">
                    <el-input v-model="ruleForm.phone__"></el-input>
                </el-form-item>
                <el-form-item label="仓库描述">
                    <el-input type="textarea" v-model="ruleForm.warehouseCont" :rows="3"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="submitForm('ruleForm')">确定</el-button>
                    <el-button @click="resetForm('ruleForm')">重置</el-button>
                </el-form-item>
            </el-form>
        </el-col>
    </el-row>
  </el-card>

  
</template>

<script>
// import 'vue-area-linkage/dist/index.css'
import { pca, pcaa } from 'area-data'
export default {
    data(){
    return {
         pca: pca,
         pcaa: pcaa,
         selected:"",
         ruleForm: {
          name: '',
          address:'',
          addresss:"",
          warehouseCont:"",
          phone_:"",
          phone__:"",
        },
       rules: {
          name: [
            { required: true, message: '请输入仓库名称', trigger: 'change' },
          ],
          address: [
            { required: true, message: '请输入仓库详细地址', trigger: 'change' }
          ],
          phone_:[
            { required: true, message: '请输入手机号码', trigger: 'change' }
          ],
          phone__:[
            { required: true, message: '请输入联系电话', trigger: 'change' }
          ]
        }
    }
   },
    created(){
      this.getmerchant();
		},
    methods:{
    getmerchant(){
        this.$api.getMerchant(this.id).then(res=>{
            res.data.code == 200 ? ( this.ruleForm = res.data.ruleForm) :(this.$api.error(res.data.msg))
        })
        .catch(res=>{
            this.$api.error()
        })
    },
    cityChange(val){
    this.ruleForm.address = ""
    val.forEach( (el)=>{
      this.ruleForm.address +=el
    })
    },
    submitForm(formName) {
      console.log(this.ruleForm)
        this.$refs[formName].validate((valid) => {
          if (valid) {
              console.log(valid)
               this.$api.merchantEdit(this.ruleForm)
                .then(res=>{
                    res.data.code == 200 ? ( this.$router.push("./merchant")):(this.$api.error(res.data.msg))
                })
                .catch(res => {
                this.$api.error();
                });
          } else {
            return false;
          }
        });
      },
    resetForm(formName) {
        this.$refs[formName].resetFields();
        this.ruleForm.note = '';
    },
  }
}
</script>
<style lang="less" scoped>


</style>