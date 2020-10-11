<template>
  <div>
    <el-card>
      <el-row>
        <el-col>
          <el-form :model="ruleForm" :rules="rules" ref="ruleForms" label-width="130px">
            <el-form-item label="所属分类">
              <el-select v-model="ruleForm.help_cate_id" placeholder="请选择所属分类">
                <el-option
                  v-for="item in ruleForm.cate"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="商品标题" prop="title">
              <el-input v-model="ruleForm.title" placeholder="商品标题"></el-input>
            </el-form-item>
            <el-form-item label="关键字">
              <el-input v-model="ruleForm.keyword" placeholder="关键字"></el-input>
            </el-form-item>
            <el-form-item label="摘要">
              <el-input v-model="ruleForm.abstract" placeholder="摘要"></el-input>
            </el-form-item>
            <el-form-item label="商品描述">
              <el-input type="textarea" :rows="3" v-model="ruleForm.intro" placeholder="商品描述"></el-input>
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
              <el-radio v-model="ruleForm.status" label="1">显示</el-radio>
              <el-radio v-model="ruleForm.status" label="2">隐藏</el-radio>
            </el-form-item>
            <el-form-item label="提交">
              <el-button type="primary" v-no-click @click="onconfrom" v-if="!isedit">提交</el-button>
              <el-button type="primary" v-no-click v-else @click="onidet">修改</el-button>
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
    this.helpList();
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
      rules: {
        title:[ { required: true, message: '请输入标题', trigger: 'blur' },]
      },
      isedit: false,
      ruleForm: {
        keyword: "",
        intro: "",
        title: "",
        content: "",
        radio: "1",
        id: "",
        cate: [],
        help_cate_id: "",
        abstract: "",
        status: "1"
      },
      editorOption: {
        placeholder:
          "详细描述一般包含商品功能属性、商品细节图片、支付物流、售后服务、公司实力等内容"
      }
    };
  },
  // 方法
  methods: {
    helpList() {
      this.$api
        .helpList({})
        .then(res => {
          if (res.data.code == 200) {
            this.ruleForm.cate = res.data.cate;
          } else {
            this.$message.error(res.data.msg);
          }
        })
        .catch(res => {
          this.$message.error("网络错误");
          console.log(res);
        });
    },
    onconfrom(){
      if(this.ruleForm.cate.length==0){
           this.$message.error("请先添加帮助分类");
              return 
        } 
        this.$refs.ruleForms.validate(valid => {
        if (!valid) return;
        if(this.ruleForm.help_cate_id=="")this.$message.error("请选择所属分类");
          this.$api
          .helpAdd(this.ruleForm)
          .then(res => {
            if (res.data.code == 200) {
              this.$message.success(res.data.msg);
              this.$router.push("/helpmanagement");
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
    gethelpCateUpdate(){
           this.$api
        .gethelpUpdate({
          params: {
            id: this.ruleForm.id
          }
        })
        .then(res => {
          if (res.data.code == 200) {
              this.ruleForm.content = res.data.list.content;
              this.ruleForm.help_cate_id = parseInt(res.data.list.help_cate_id);
              this.ruleForm.intro = res.data.list.intro;
              this.ruleForm.keyword = res.data.list.keyword;
              this.ruleForm.status = res.data.list.status+"";
              this.ruleForm.title = res.data.list.title;
              this.ruleForm.title = res.data.list.title;
          } else {
            this.$message.error(res.data.msg);
          }
        })
        .catch(res => {
          this.$message.error("网络错误");
          console.log(res);
        }); 
    },
    onidet(){
          if(this.ruleForm.cate.length==0){
           this.$message.error("请先添加帮助分类");
              return 
        } 
        this.$refs.ruleForms.validate(valid => {
        if (!valid) return;
        if(this.ruleForm.help_cate_id=="")this.$message.error("请选择所属分类");
          this.$api
          .gethelpUpdates(this.ruleForm)
          .then(res => {
            if (res.data.code == 200) {
              this.$message.success(res.data.msg);
              this.$router.push("/helpmanagement");
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