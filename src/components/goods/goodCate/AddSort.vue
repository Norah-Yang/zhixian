<template>
  <div>
  
    <!-- 卡片视图区域 -->
    <el-card>
      <el-form :model="sortForm" :rules="sortFormRules" ref="sortFormRef" label-width="100px" class="ruleForm" >
        <el-form-item label="分类名称" prop="title">
          <el-input v-model="sortForm.title"></el-input>
        </el-form-item>
        <el-form-item label="分类介绍" prop="content">
          <el-input type="textarea" :rows="4" placeholder="请输入介绍内容" v-model="sortForm.content"></el-input>
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input v-model="sortForm.sort" type="number"></el-input>
        </el-form-item>
        <el-form-item label="分类图标">
          <el-upload
            :class="uploadDisabled"
            :action="$uplaadUrl"
            :show-file-list="showImgList"
            :file-list="fileList"
            list-type="picture-card"
            :limit="limitCount"
            :on-remove="handleRemove"
            :on-success="handleAvatarSuccess"
            :on-error="handleAvatarError"
            :disabled="showdisabled"
            :on-preview="onPreviewImg"
            :headers="handleHeader"
            :before-upload="beforeAvatarUpload"
          >
            <i class="el-icon-plus"></i>
          </el-upload>
          <el-dialog :visible.sync="imgDialogVisible">
            <img width="100%" :src="dialogImageUrl" alt="">
          </el-dialog>
        </el-form-item>
        <el-form-item label="分类底色" prop="bottom_colour">
          <div class="block">
            <el-color-picker v-model="sortForm.bottom_colour"></el-color-picker>
          </div>
        </el-form-item>
        <el-form-item label="是否同步" v-if="default_shopid && tableData.length>0">
          <el-switch v-model="shopshow" active-text="是" inactive-text="否"></el-switch>
        </el-form-item>
        <el-form-item label="店铺列表" v-if="shopshow">
          <el-table :data="tableData" border="" style="width: 100%" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column prop="id" label="店铺Id"></el-table-column>
            <el-table-column prop="title" label="店铺名称"></el-table-column>
          </el-table>
        </el-form-item>
        <el-form-item label="是否启用">
          <el-switch v-model="sortForm.del" :active-value="0" :inactive-value="1" active-text="是" inactive-text="否" ></el-switch>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('sortForm')" :loading="loading" v-if="default_shopid" size="mini">提交</el-button>
          <el-button @click="resetForm('sortForm')" size="mini">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
var token = window.sessionStorage.getItem("token");
export default {
  data() {
    return {
      shopshow: false,
      tableData: [],
      showdisabled: false,
      uploadDisabled: "",
      showImgList: true,
      limitCount: 1,
      handleHeader: { authorization: token },
      fileList: [],
      dialogImageUrl: "",
      imgDialogVisible: false,
      // 表单的验证规则
      sortFormRules: {
        title: [{ required: true, message: "请输入分类名称", trigger: "blur" }]
      },
      sortForm: {
        title: "",
        del: 1,
        sort: "",
        content: "",
        thumb: "",
        // eslint-disable-next-line camelcase
        bottom_colour: "",
        shop_id:""
      },
      loading: false,
      default_shopid: ''
    };
  },
  created() {
    this.shoplist();
  },
  methods: {
    // 图片上传成功
    handleAvatarSuccess(file, fileList) {
      // this.attachmentId.push(res.name)
      // console.log(file, fileList);
      if (file.code !== 200) return this.$message.error("图片上传失败！");
      // 上传图片后将 uploadDisabled 变量设置为 disabled
      this.sortForm.thumb = file.url;
      this.uploadDisabled = "disabled";
      this.showdisabled = false;
    },
    handleAvatarError(file, filelist) {
      // if (filelist.length === 0) {
      //   // 将变量置空
      //   this.uploadDisabled = ''
      // }
    },
    handleRemove(file, filelist) {
      // console.log(file)
      // console.log(filelist)
      // // console.log(this.attachmentId)
      if (filelist.length === 0) {
        // 将变量置空
        this.uploadDisabled = "";
      }
    },
    // 图片上传之前判断图片大小 不超过2M
    beforeAvatarUpload(file, filelist) {
      // console.log(file)
      // console.log(filelist)
      // this.showNoticeUploading = true
      // const isJPG = file.type === 'image/jpeg'
      const isLt2M = file.size / 1024 / 1024 < 2;
      // if (!isJPG) {
      //   this.$message.error('上传头像图片只能是 JPG 格式!')
      //   return
      // }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
        return false;
      }
      // this.uploadDisabled = 'disabled'
      this.showdisabled = true;
    },
    onPreviewImg(file) {
      this.dialogImageUrl = file.url;
      this.imgDialogVisible = true;
    },
    // 重置表单
    resetForm() {
      this.sortForm.thumb = "";
      this.fileList = [];
      this.uploadDisabled = "";
      this.$refs.sortFormRef.resetFields();
    },
    submitForm() {
      // console.log(this.sortForm);
      this.loading = true;
        // if(!this.shopshow){this.sortForm.shop_id=""}
        // if(this.shopshow&&this.sortForm.shop_id.length==0){
        //   return this.$message.error("请选择店铺列表！")
        // }
      // eslint-disable-next-line camelcase
      this.$refs.sortFormRef.validate(async valid => {
        if (!valid) return this.$message.error("请填写分类名称！");
        const { data: res } = await this.$http.post("mapi/Item/add",this.sortForm);
        if (res.status !== 1) return this.$message.error("添加商品分类失败！");
        this.$message.success("添加商品分类成功！");
        setTimeout(() => {
          this.$router.go(-1);
        }, 1000);
      });
    },
    async shoplist() {
      const { data: res } = await this.$http.get("mapi/Item/add");
      console.log(res);
      if (res.code == 200) {
        this.tableData = res.shop;
        this.default_shopid = res.default_shop.id
      } else {
        this.$message.error(res.msg);
      }
    },
    handleSelectionChange(e){
          let strShopid = e.map(x=>x.id).join(",")
          if(strShopid.length>0){
            this.sortForm.shop_id=this.default_shopid +','+strShopid
          }else{
            this.sortForm.shop_id=this.default_shopid
          }
          
          // console.log(this.sortForm.shop_id);
    }
  }
};
</script>

<style scoped lang="less">
.ruleForm {
  margin-top: 20px;
  width: 50%;
}
</style>
<style lang="less">
.disabled {
  .el-upload--picture-card {
    display: none;
  }
}
</style>
