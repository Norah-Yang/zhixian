<template>
  <div>
    <el-card>
      <el-row>
        <el-col>
          <el-form :model="ruleForm" :rules="rules" ref="ruleForms" label-width="130px">
            <el-form-item label="商品标题" prop="title">
              <el-input v-model="ruleForm.title" placeholder="商品标题"></el-input>
            </el-form-item>
            <el-form-item label="商品描述">
              <el-input type="textarea" v-model="ruleForm.intro" :rows="3" placeholder="商品描述"></el-input>
            </el-form-item>
            <el-form-item label="详情描述">
              <quill-editor
                class="editor"
                v-model="ruleForm.content"
                ref="myQuillEditor"
                :options="editorOption"
              ></quill-editor>
            </el-form-item>
            <el-form-item label="商品描述">
              <el-radio v-model="ruleForm.status" label="1">待审核</el-radio>
              <el-radio v-model="ruleForm.status" label="2">显示</el-radio>
              <el-radio v-model="ruleForm.status" label="3">隐藏</el-radio>
            </el-form-item>
            <el-form-item label="提交">
              <el-button type="primary" v-no-click v-if="!isedit" @click="onconfirm">提交</el-button>
              <el-button type="primary" v-no-click v-else @click="onedit">修改</el-button>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>
<script>
import { quillRedefine } from "vue-quill-editor-upload";
import { quillEditor } from "vue-quill-editor";

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
      this.ruleForm.id = this.$route.params.id || sessionStorage.getItem("news_id");
      this.journalismUpdate();
    }
       this.editorOption = quillRedefine({
      uploadConfig: {
        token: sessionStorage.getItem("token") || "",
        action: "https://manage.zhixianyun.cn/mapi/upload/pic", // 必填参数 图片上传地址
        // 必选参数  res是一个函数，函数接收的response为上传成功时服务器返回的数据
        accept: "image/png, image/gif, image/jpeg, image/bmp, image/x-icon", // 可选参数 可上传的图片格式
        // 你必须把返回的数据中所包含的图片地址 return 回去
        res: respnse => {
          if(respnse.code==200){
                   return respnse.url
          }
          // var path = respnse.path; //这里return你的图片地址即可
          //  path;
        },
        methods: "POST",
        error: () => {
          this.$api.error("上传图片失败");
        }, //
        success: () => {
          this.$message.success("上传成功");
        }, // 可选参数 接收一个函数 上传数据成功时会触发
        name: "file" // 图片上传参数名
      },
      placeholder:
        "详细描述一般包含商品功能属性、商品细节图片、支付物流、售后服务、公司实力等内容"
    });
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
      rules: {
        title:[  { required: true, message: '请输入标题', trigger: 'blur' },]
      },
      isedit: false,
      ruleForm: {
        title: "",
        intro: "",
        content: "",
        status: "2",
        id:""
      },
      editorOption: {
        placeholder:
          "详细描述一般包含商品功能属性、商品细节图片、支付物流、售后服务、公司实力等内容"
      }
    };
  },
  // 方法
  methods: {
    onconfirm(){
        this.$refs.ruleForms.validate((valid) => {
          if (!valid) return
           this.$api
        .getjournalismAdd(this.ruleForm)
        .then(res => {
          if (res.data.code == 200) {
              this.$message.success(res.data.msg);
              this.$router.push("/newsmanagement")
          } else {
            this.$message.error(res.data.msg);
          }
        })
        .catch(res => {
          this.$message.error("网络错误");
          console.log(res);
        });
        })
    },
    onedit(){
         this.$refs.ruleForms.validate((valid) => {
          if (!valid) return
        this.$api
        .getjournalismUpdate(this.ruleForm)
        .then(res => {
          if (res.data.code == 200) {
              this.$message.success(res.data.msg);
              this.$router.push("/newsmanagement")
          } else {
            this.$message.error(res.data.msg);
          }
        })
        .catch(res => {
          this.$message.error("网络错误");
          console.log(res);
        });
         })
    },
    journalismUpdate(){

          this.$api
        .journalismUpdate({
          params:{
            id:this.ruleForm.id
          }
        })
        .then(res => {
          if (res.data.code == 200) {
               this.ruleForm.content=res.data.list.content                            
               this.ruleForm.intro=res.data.list.intro                            
               this.ruleForm.status=res.data.list.status+""                            
               this.ruleForm.title=res.data.list.title                            
          } else {
            this.$message.error(res.data.msg);
          }
        })
        .catch(res => {
          this.$message.error("网络错误");
          console.log(res);
        });
    }
  },
  // 监听属性
  watch: {},
  // 组件
  component: {
    "quill-editor": quillEditor,
    quillRedefine
  },
  // 计算属性
  computed: {}
};
</script>

<style lang="less" scoped>
/deep/ .editor .ql-container {
  min-height: 300px !important;
}
</style>