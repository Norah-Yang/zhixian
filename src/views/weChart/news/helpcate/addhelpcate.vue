<template>
  <div>
    <el-card>
      <el-row>
        <el-col>
          <el-form :model="ruleForm" :rules="rules" ref="ruleForms" label-width="130px">
            <el-form-item label="分类名称" prop="name">
              <el-input v-model="ruleForm.name" placeholder="商品标题"></el-input>
            </el-form-item>
            <el-form-item label="分类图标">
              <el-upload
                ref="upload"
                :action="$uplaadUrl"
                list-type="picture-card"
                :file-list="ruleForm.file"
                :limit="1"
                :headers="header"
                :on-remove="handleRemove"
                :on-success="AvatarSuccess"
                :on-exceed="onexceed"
                :before-upload="beforeUpload"
                accept=".jpg, .png"
              >
                <i class="el-icon-plus"></i>
              </el-upload>
            </el-form-item>
            <el-form-item label="是否显示">
              <el-radio v-model="ruleForm.status" label="1">显示</el-radio>
              <el-radio v-model="ruleForm.status" label="2">隐藏</el-radio>
            </el-form-item>
            <el-form-item label="分类介绍">
              <el-input type="textarea" v-model="ruleForm.content" :rows="3" placeholder="请输入分类介绍"></el-input>
            </el-form-item>
            <el-form-item label="提交">
              <el-button type="primary" v-no-click v-if="!isedit" @click="onconfirm">提交</el-button>
              <el-button type="primary" v-no-click v-else  @click="onedeit">修改</el-button>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>
<script>
export default {
  // props:[],
  // 页面加载
  created() {
    // 判断是添加还是删除 根据传过来的id判断
    if (this.$route.params.id) {
      sessionStorage.setItem("news_id", this.$route.params.id);
    }
    if (this.$route.params.id || sessionStorage.getItem("news_id")) {
      this.isedit = true;
      this.ruleForm.id =
        this.$route.params.id || sessionStorage.getItem("news_id");
      this.gethelpCateUpdate();
    }
  },
  // 页面加载完成
  mounted() {},
  //实例销毁之前
  beforeDestroy() {
    sessionStorage.removeItem("news_id")
  },
  //实例销毁后
  destroyed() {},
  data() {
    return {
      header: {
        Authorization: sessionStorage.getItem("token") || ""
      },
      rules: {
        name: [{ required: true, message: "请输入分类名称", trigger: "blur" }]
      },
      isedit: false,
      ruleForm: {
        name: "",
        intro: "",
        content: "",
        file: [],
        status: "1",
        thumb: "",
        id: ""
      }
    };
  },
  // 方法
  methods: {
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
    AvatarSuccess(e) {
      if (e.code == 200) {
        this.ruleForm.thumb = e.url;
      }
    },
    onexceed() {
      this.$message({
        message: "只能上传一张图片",
        type: "warning"
      });
    },
    handleRemove() {
      this.ruleForm.thumb = "";
    },
    onconfirm() {
      this.$refs.ruleForms.validate(valid => {
        if (!valid) return;
        this.$api
          .gethelpCateAdd(this.ruleForm)
          .then(res => {
            if (res.data.code == 200) {
              this.$message.success(res.data.msg);
              this.$router.push("/helpcate");
            } else {
              this.$message.error(res.data.msg);
            }
          })
          .catch(res => {
            this.$message.error("网络错误");
            console.log(res);
          });
      });
    },
    gethelpCateUpdate() {
      this.$api
        .gethelpCateUpdate({
          params: {
            id: this.ruleForm.id
          }
        })
        .then(res => {
          if (res.data.code == 200) {
            this.ruleForm.content = res.data.list.content;
            this.ruleForm.name = res.data.list.name;
            this.ruleForm.status = res.data.list.status + "";
            if (res.data.list.thumb) {
              this.ruleForm.thumb = res.data.list.thumb;
              this.ruleForm.file.push({
                name: "21313.jspg",
                url: res.data.list.thumb
              });
            }
          } else {
            this.$message.error(res.data.msg);
          }
        })
        .catch(res => {
          this.$message.error("网络错误");
          console.log(res);
        });
    },
    onedeit(){
        this.$refs.ruleForms.validate(valid => {
        if (!valid) return;
                  this.$api
          .helpCateUpdate(this.ruleForm)
          .then(res => {
            if (res.data.code == 200) {
              this.$message.success(res.data.msg);
              this.$router.push("/helpcate");
            } else {
              this.$message.error(res.data.msg);
            }
          })
          .catch(res => {
            this.$message.error("网络错误");
            console.log(res);
          });
        })
    }
  },
  // 监听属性
  watch: {},
  // 组件
  component: {},
  // 计算属性
  computed: {}
};
</script>

<style lang="less" scoped>
</style>