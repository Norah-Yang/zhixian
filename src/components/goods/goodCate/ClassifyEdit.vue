<template>
    <div>
      <!-- 面包屑导航区域 -->
      <!-- <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>您当前所在位置</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>商品管理</el-breadcrumb-item>
        <el-breadcrumb-item>分类编辑</el-breadcrumb-item>
      </el-breadcrumb> -->
      <!-- 卡片视图区域 -->
      <el-card>
        <div>修改商品分类信息</div>
        <el-form :model="sortForm" :rules="sortFormRules" ref="sortFormRef" label-width="100px" class="ruleForm">
          <el-form-item label="分类名称" prop="title">
            <el-input v-model="sortForm.title"></el-input>
          </el-form-item>
          <el-form-item label="分类介绍">
            <el-input type="textarea" :rows="4" placeholder="请输入介绍内容" v-model="sortForm.content"></el-input>
          </el-form-item>
          <el-form-item label="排序">
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
              :before-upload="beforeAvatarUpload">
              <i class="el-icon-plus"></i>
            </el-upload>
            <el-dialog :visible.sync="imgDialogVisible">
              <img width="100%" :src="dialogImageUrl" alt="">
            </el-dialog>
          </el-form-item>
          <el-form-item label="分类底色">
            <div class="block">
              <el-color-picker v-model="sortForm.bottom_colour"></el-color-picker>
            </div>
          </el-form-item>
          <el-form-item label="是否启用">
            <el-switch v-model="sortForm.del" :active-value="0" :inactive-value="1" active-text="是" inactive-text="否"></el-switch>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm('sortForm')" :loading="loading" size="mini">确定</el-button>
            <el-button @click="resetForm('sortFormRef')" size="mini">重置</el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </div>
</template>

<script>
var token = window.sessionStorage.getItem('token')
export default {
  data () {
    return {
      value1: true,
      showdisabled: false,
      uploadDisabled: '',
      showImgList: true,
      limitCount: 1,
      fileList: [],
      dialogImageUrl: '',
      handleHeader: { authorization: token },
      imgDialogVisible: false,
      // 表单的验证规则
      sortFormRules: {
        // eslint-disable-next-line camelcase
        title: [
          { required: true, message: '请输入分类名称', trigger: 'blur' }
        ],
        content: []
      },
      sortForm: {},
      copySortForm: {},
      queryObj: {},
      loading: false
    }
  },
  created () {
    this.queryObj = this.$route.query
    // console.log(this.query)
    this.getClassfiyObj(this.queryObj.id)
  },
  mounted () {

  },
  methods: {
    async getClassfiyObj (id) {
      const { data: res } = await this.$http.get('mapi/Item/update', { params: { id: this.queryObj.id } })
      // console.log('分类',res);
      this.sortForm = res.data
      this.copySortForm = JSON.parse(JSON.stringify(res.data))
      // console.log(this.copySortForm)
      if (res.data.thumb) {
        this.fileList.push({
          name: '',
          url: res.data.thumb
        })
        this.uploadDisabled = 'disabled'
        this.showdisabled = false
      }
      this.sortForm.img = ''
    },
    // 图片上传成功
    handleAvatarSuccess (file, fileList) {
      console.log(file);
      this.sortForm.img = file.url
      this.uploadDisabled = 'disabled'
      this.showdisabled = false
    },
    handleAvatarError (file, filelist) {
      // if (filelist.length === 0) {
      //   // 将变量置空
      //   this.uploadDisabled = ''
      // }
    },
    handleRemove (file, filelist) {
      console.log(file)
      console.log(filelist)

      if (filelist.length === 0) {
        // 将变量置空
        this.uploadDisabled = ''
      }
    },
    // 图片上传之前判断图片大小 不超过2M
    beforeAvatarUpload (file, filelist) {
      // const isJPG = file.type === 'image/jpeg'
      const isLt2M = file.size / 1024 / 1024 < 2
      // if (!isJPG) {
      //   this.$message.error('上传头像图片只能是 JPG 格式!')
      //   return
      // }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
        return false
      }
      // this.uploadDisabled = 'disabled'
      this.showdisabled = true
    },
    onPreviewImg (file) {
      this.dialogImageUrl = file.url
      this.imgDialogVisible = true
    },
    // 重置表单
    resetForm (fileName) {
      // console.log(this.copySortForm)
      // console.log(this.sortForm)
      this.$refs[fileName].resetFields();
    },
    // statusChange (e) {
    //   // eslint-disable-next-line camelcase
    //   this.sortForm.del = e ? '0' : '1'
    //   // console.log(this.sortForm)
    // },
    submitForm () {
      this.loading = true
      // console.log(this.sortForm)
      // console.log(this.value1)
      // console.log(this.copySortForm)
      this.$refs.sortFormRef.validate(async valid => {
        if (!valid) return this.$message.error('请填写分类名称！')
        const { data: res } = await this.$http.post('mapi/Item/update', this.sortForm)
        console.log(this.sortForm,res)
        if (res.status !== 1) return this.$message.error('修改商品分类失败！')
        this.$message.success('修改商品分类成功！')
        setTimeout(() => {
          this.$router.go(-1)
        }, 1000)
      })
    }
  }
}
</script>

<style scoped lang="less">
.ruleForm{
  margin-top:20px;
  width:50%;
  }
   .el-button {width:100px !important;}
</style>
<style lang="less">
.disabled{
   .el-upload--picture-card {
    display: none;
   }
 }

</style>
