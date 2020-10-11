<template>
  <el-card>
    <el-row>
        <el-col :span="15">
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
                <el-form-item label="加盟商名称" prop="name">
                    <el-input v-model="ruleForm.name"></el-input>
                </el-form-item>
                <el-form-item label="开通产品" prop="type">
                    <el-checkbox-group v-model="ruleForm.type">
                    <el-checkbox label="实体店" name="type"></el-checkbox>
                    <el-checkbox label="微商店" name="type"></el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
                <el-form-item label="详细地址" prop="address">
                    <el-input v-model="ruleForm.address"></el-input>
                </el-form-item>
                <el-form-item label="联系人" prop="people">
                    <el-input v-model="ruleForm.people"></el-input>
                </el-form-item>
                <el-form-item label="手机号码" prop="phone_">
                    <el-input v-model="ruleForm.phone_"></el-input>
                </el-form-item>
                <el-form-item label="电话号码" prop="phone__">
                    <el-input v-model="ruleForm.phone__"></el-input>
                </el-form-item>
                <el-form-item label="禁用权限" prop="dis">
                    <el-checkbox-group v-model="ruleForm.dis">
                    <el-checkbox label="新增商品" name="type"></el-checkbox>
                    <el-checkbox label="采购管理" name="type"></el-checkbox>
                    <el-checkbox label="要货管理" name="type"></el-checkbox>
                    <el-checkbox label="调拨价格" name="type"></el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
                <el-form-item label="备注">
                    <el-input type="textarea" v-model="ruleForm.note" :rows="3"></el-input>
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
export default {
    data(){
    return {
         ruleForm: {
          name: '',
          type: [],
          dis:[],
          address:'',
          note:"",
          people:"",
          phone_:"",
          phone__:"",
        },
       rules: {
          name: [
            { required: true, message: '请输入加盟商名称', trigger: 'change' },
          ],
          address: [
            { required: true, message: '请输入详细地址', trigger: 'change' }
          ],
          type: [
            { type: 'array', required: true, message: '请至少选择一个开通产品', trigger: 'change' }
          ],
          dis: [
            { type: 'array', required: true, message: '请至少选择一个禁用权限', trigger: 'change' }
          ],
          people:[
            { required: true, message: '请输入联系人姓名', trigger: 'change' }
          ],
          phone_:[
            { required: true, message: '请输入手机号码', trigger: 'change' }
          ],
          phone_:[
            { required: true, message: '请输入电话号码', trigger: 'change' }
          ]
        }
    }
   },
    created() {
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
    submitForm(formName) {
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
      }
   }
}
</script>
<style lang="less" scoped>

</style>