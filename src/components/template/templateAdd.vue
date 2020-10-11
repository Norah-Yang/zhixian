<template>
  <el-card>
    <el-row :gutter="5">
        <el-col :span="15">
            <el-form :model="ruleForm"  ref="ruleForm" label-width="150px" class="demo-ruleForm">
                <el-form-item label="模板名称" >
                    <el-input v-model="ruleForm.name"></el-input>
                </el-form-item>
                <el-form-item label="是否显示" >
                    <el-switch
                        v-model="ruleForm.status" 
                        active-color="#008080"  
                        active-text="是"
                        inactive-text="否" 
                        inactive-color="#ff4949"
                        :active-value="1"
                        :inactive-value="0">
                      </el-switch>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="submitForm('ruleForm')" size="mini">保存</el-button>
                    <el-button @click="resetForm('ruleForm')" size="mini">重置</el-button>
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
        id:"",
        ruleForm: {},
    }
   },
    created(){
      let id = this.$route.query.id;
      this.id = id
      id ? ( this.carouselUp()) : id;
          
    },
    mounted(){
    },
    methods:{
      carouselUp(){
          this.$api.carouselUp({
             params:{
              id:this.id
            }
          }).then(res=>{
            if(res.data.code == 200){
               this.ruleForm = res.data.list
            }else{
                this.$api.error(res.data.msg)
            }
          })
          .catch(res=>{
              this.$api.error()
          })
      },
      submitForm(formName) {
          this.$refs[formName].validate((valid) => {
            if (valid) {
              let id = this.id
              if(id){
                  this.$api.carouselUpStting(this.ruleForm)
                  .then(res=>{
                      res.data.code == 200 ? (this.$message.success("修改成功"),this.$router.push("./carousel")):(this.$api.error(res.data.msg))
                  })
                  .catch(res => {
                  this.$api.error();
                  }); 
              }else{
                  this.$api.carouselAddSetting(this.ruleForm)
                  .then(res=>{
                      res.data.code == 200 ? ( this.$router.push("./carousel")):(this.$api.error(res.data.msg))
                  })
                  .catch(res => {
                  this.$api.error();
                  }); 
              }
                
            } else {
              return false;
            }
          });
        },
      resetForm(formName) {
        this.$refs['ruleForm'].resetFields()
      },
  }
}
</script>
<style lang="less" scoped>
  .gray{
    color:gray;
  }
</style>