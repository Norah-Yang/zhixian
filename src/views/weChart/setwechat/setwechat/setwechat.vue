<template>
  <div>
    <el-row>
      <el-col :span="24">
        <el-card shadow="always">
          <div class="setwachert">
            <div>
              <h1>小程序设置</h1>
              <el-form ref="form" :model="form" label-width="80px" v-if="!isxcx">
                <el-form-item label="token">
                  <el-input v-model="form.token"></el-input>
                </el-form-item>
                <el-form-item label="AppID">
                  <el-input v-model="form.AppID"></el-input>
                </el-form-item>
                <el-form-item label="AppSecret">
                  <el-input v-model="form.AppSecret"></el-input>
                </el-form-item>
              </el-form>
            </div>
            <div>
              <h1>公众号设置</h1>
              <el-form ref="form" :model="form1" label-width="80px" v-if="!isgzh">
                <el-form-item label="AppId">
                  <el-input v-model="form1.AppID"></el-input>
                </el-form-item>
                <el-form-item label="AppSecret">
                  <el-input v-model="form1.AppSecret"></el-input>
                </el-form-item>
              </el-form>
            </div>
          </div>
          <div class="footer">
            <el-button  type="primary" @click="onsubmit" v-no-click size="mini">提交</el-button>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>
<script>
export default {
  // props:[],
  // 页面加载
  created() {
    this.getsetwechat();
  },
  // 页面加载完成
  mounted() {},
  data() {
    return {
      form: {
        AppID: "",
        AppSecret: "",
        token: "",
        merchant_id:""
      },
      form1: {
        AppID: "",
        AppSecret: ""
      },
      isxcx: false,
      isgzh: false
    };
  },
  // 方法
  methods: {
    getsetwechat() {
      this.$api
        .getsetwechat({})
        .then(res => {
          if (res.data.code == 200) {
            this.form.token = res.data.data.token;
            this.form.merchant_id = res.data.data.merchant_id;
            if (res.data.data.xcx && res.data.data.xcx.type == 1) {
              this.form.AppSecret = res.data.data.xcx.AppSecret;
              this.form.AppID = res.data.data.xcx.AppID;
              this.form.id = res.data.data.xcx.id;
            } else {
              this.isxcx = true;
            }
            if (res.data.data.gzh && res.data.data.gzh.type == 2) {
              this.form1.AppSecret = res.data.data.gzh.AppSecret;
              this.form1.AppID = res.data.data.gzh.AppID;
              this.form1.id = res.data.data.gzh.id;
            } else {
              this.isgzh = true;
            }
          } else {
            this.$api.error(res.data.msg);
          }
        })
        .catch(res => {
          this.$api.error();
          console.log(res);
        });
    },
    onsubmit() {
      let obj={};
      if(!this.isxcx){
             obj.xcx=this.form
      }
      if(!this.isgzh){
           obj.gzh=this.form1
      }
      if(this.isgzh&&this.isxcx){
          this.$api.error();
            return 
      }
      obj.token=this.form.token
      obj.merchant_id=this.form.merchant_id
        
      this.$api
        .getsetwechats(obj)
        .then(res => {
          if (res.data.code == 200) {
             this.$message.success(res.data.msg)
          }
        })
        .catch(res => {
          this.$api.error();
          console.log(res);
        });
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
.setwachert {
  display: flex;
  h1 {
    text-align: center;
    margin-bottom: 10px;
  }
  div {
    flex: 1;
  }
}
.footer {
  text-align: center;
}
</style>