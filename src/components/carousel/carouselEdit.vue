<template>
  <el-card>
    <el-row :gutter="5">
        <el-col :span="15">
            <el-form :model="ruleForm"  ref="ruleForm" label-width="150px" class="demo-ruleForm">
                <el-form-item label="轮播图名称" >
                    <el-input v-model="ruleForm.name"></el-input>
                </el-form-item>
                <el-form-item label="排序" >
                    <el-input v-model="ruleForm.sort"></el-input>
                </el-form-item>
               <el-form-item label="图片上传" >
                <el-upload
                    ref="upload"
                    :action="$uplaadUrl"
                    :file-list="files"
                    list-type="picture-card"
                    :limit="limit"
                    :headers="header"
                    :on-preview="handlePictureCardPreview"
                    :on-remove="handleRemove"
                    :on-success="handleAvatarSuccess"
                    :on-exceed="onexceed"
                    :before-upload="beforeUpload"
                    accept=".jpg, .png"
                >
                    <i class="el-icon-plus"></i>
                </el-upload>
                <div class="gray">大小建议(1366*768)</div>
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
                    <el-button type="primary" @click="submitForm('ruleForm')">保存</el-button>
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
        id:"",
        limit: 1,
        header: {
            Authorization: sessionStorage.getItem("token") || ""
        },
         ruleForm: {},
        files:[],
        dialogImageUrl: '',
        dialogVisible: false,
        disabled: false,
        
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
      //上传文件类型判断
beforeUpload(file) {
    var testmsg = file.name.substring(file.name.lastIndexOf(".") + 1);
    const extension = testmsg === "jpg";
    const extension2 = testmsg === "png";
    // const isLt2M = file.size / 1024 / 1024 < 10
    if (!extension && !extension2) {
      this.$message({
        message: "上传文件只能是 jpg、png格式!",
        type: "warning"
      });
    }
    // if(!isLt2M) {
    //     this.$message({
    //         message: '上传文件大小不能超过 10MB!',
    //         type: 'warning'
    //     });
    // }
    // return (extension || extension2) && isLt2M
    return extension || extension2;
  },
      carouselUp(){
          this.$api.carouselUp({
             params:{
              id:this.id
            }
          }).then(res=>{
            if(res.data.code == 200){
               this.ruleForm = res.data.list,
                this.ruleForm.former_thumb=res.data.list.thumb
                const obj = {
                  name: 'food2.jpeg',
                  url: res.data.list.thumb
               }
              this.files.push(obj)
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
    //  轮播图上传
    onexceed(){
      this.$message.error("只能上传一张图片")
    },
    handleAvatarSuccess(e) {
      if (e.code == 200) {
       this.ruleForm.thumb = e.name
      }
    },
    handlePictureCardPreview(e) {
      this.imgVisible = true;
    },
    handleRemove(e) {
      this.ruleForm.thumb= ''
    },
  }
}
</script>
<style lang="less" scoped>
  .gray{
    color:gray;
  }
</style>