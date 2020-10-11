<template>
  <div>
    <el-row>
      <el-col :span="24">
        <el-card shadow="always">
            <el-tabs type="card"  v-model="type" @tab-click="handleClick" >
              <el-tab-pane :label="item.name" :name="item.id+''" v-for="item in list" :key="item.id"></el-tab-pane>
            </el-tabs>
            <el-form
            :model="ruleForm"
            :rules="rules"
            ref="ruleForm"
            label-width="130px"
            class="demo-ruleForm"
          >
              <el-form-item label="分享标题">
              <el-radio v-model="ruleForm.title_type" :label="0">默认</el-radio>
              <el-radio v-model="ruleForm.title_type" :label="1">自定义</el-radio>
            </el-form-item>
            <el-form-item label="" prop="title" v-if="ruleForm.title_type==1">
              <el-input v-model="ruleForm.title"  placeholder="请输入标题"></el-input>
            </el-form-item>
                 <el-form-item label="分享简介">
              <el-radio v-model="ruleForm.intro_type" :label="0">默认</el-radio>
              <el-radio v-model="ruleForm.intro_type" :label="1">自定义</el-radio>
            </el-form-item>
            <el-form-item label="" v-if="ruleForm.intro_type==1">
              <el-input v-model="ruleForm.intro" type="textarea"  :rows="3" placeholder="请输入简介"></el-input>
            </el-form-item>
                   <el-form-item label="分享图片">
              <el-radio v-model="ruleForm.thumb_type" :label="0">默认</el-radio>
              <el-radio v-model="ruleForm.thumb_type" :label="1">自定义</el-radio>
            </el-form-item>
            <el-form-item label="" v-if="ruleForm.thumb_type==1">
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
                <el-form-item>
                  <el-button type="info" @click="onresetForm" v-no-click size="mini">重值</el-button>
                  <el-button type="primary" @click="onconfirms" v-no-click size="mini">提交</el-button>
                </el-form-item>
          </el-form>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>
<script>
export default {
  // props:[],
  // 页面加载
   components: {},
  created() {
    this.getweiOrder();
  },
  // 页面加载完成
  mounted() {},
  data() {
    return {
          header: {
            Authorization: sessionStorage.getItem("token") || ""
          },
        list:[],
        type: '1',
        ruleForm:{
            title:"",
            type:"1",
            title_type:1,
            intro_type:1,
            thumb_type:1,
            file:[],
            intro:'',
            thumb:""
        },
        rules:{
             title: [
            { required: true, message: '请输入标题', trigger: 'blur' },
            { min: 2,  message: '长度最少2字符', trigger: 'blur' }
          ],
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
    getweiOrder() {
      this.$api
        .geweishareSetting({params:{type: this.type}})
        .then(res => {
          if (res.data.code == 200) {
            // console.log(res);
            this.list=res.data.type
            this.ruleForm.type= this.list[0].id+"";
                if(JSON.stringify(res.data.list) != "{}"){
                  this.ruleForm.title=res.data.list.title
                  this.ruleForm.intro=res.data.list.intro
                  this.ruleForm.merchant_id=parseInt(res.data.list.intro_type)
                  this.ruleForm.thumb_type=parseInt(res.data.list.thumb_type)
                  this.ruleForm.title_type=parseInt(res.data.list.title_type)
                  this.ruleForm.type=res.data.list.type+""
                  if(res.data.list.thumb){
                    this.ruleForm.thumb=res.data.list.thumb
                    this.ruleForm.file.push({
                        name:"1213",
                        url:res.data.list.thumb
                    })
                  }
                }
          } else {
            this.$message.error(res.data.msg);
          }
        })
        .catch(res => {
          this.$message.error('网络错误');
          // console.log(res);
        });
    },
    // 分页
    handleCurrentChange(e) {
      this.Page.pagenum = e;
      this.getweiOrder();
    },
    // 分页
    handleSizeChange(e) {
      this.Page.pagesize = e;
      this.getweiOrder();
    },
     handleRemove() {
      this.ruleForm.thumb = "";
    },
       AvatarSuccess(e) {
      if (e.code == 200) {
        this.ruleForm.thumb = e.name;
      }
    },
      onexceed() {
      this.$message.error("只能上传一张图");
    },
    onconfirms(){
      this.$api
        .geweishareSettings(this.ruleForm)
        .then(res => {
          if (res.data.code == 200) {
            this.$message.success(res.data.msg);
          } else {
            this.$message.error(res.data.msg);
          }
        })
        .catch(res => {
          this.$message.error("网络错误");
          console.log(res);
        });
    },
    onresetForm(){
        this.$refs.ruleForm.resetFields();
             this.ruleForm={
            title:"",
            type:"1",
            title_type:1,
            intro_type:1,
            thumb_type:1,
            file:[],
            intro:'',
            thumb:""
        }
    },
    handleClick(e){
        this.type = e.name
        // this.$refs.ruleForm.resetFields();
        this.ruleForm.title=""
        this.ruleForm.file=[]
        this.ruleForm.thumb=""
        this.ruleForm.intro=""
        this.getweiOrder()
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