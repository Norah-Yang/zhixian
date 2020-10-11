<template>
  <div>
    <el-row>
      <el-col :span="24">
        <el-card shadow="always">
          <el-form
            :model="ruleForm"
            :rules="rules"
            ref="ruleForm"
            label-width="110px"
            class="demo-ruleForm"
          >
            <el-form-item label="发放">
              <el-radio v-model="ruleForm.type" label="1" :disabled="isedit">线上发放</el-radio>
              <el-radio v-model="ruleForm.type" label="2" :disabled="isedit">线下发放</el-radio>
              <el-radio v-model="ruleForm.type" label="3" :disabled="isedit">满减赠券</el-radio>
            </el-form-item>
            <el-form-item label="领取方式 " v-if="ruleForm.receive">
              <div  v-if="ruleForm.isup">
                <el-radio v-model="ruleForm.up" label="1" :disabled="isedit">【线上】关注公众号</el-radio>
                <el-radio v-model="ruleForm.up" label="2" :disabled="isedit">【线上】关键词回复</el-radio>
                <el-radio v-model="ruleForm.up" label="3" :disabled="isedit">【线上】会员卡储值</el-radio>
                <el-radio v-model="ruleForm.up" label="4" :disabled="isedit">【线上】购买发放</el-radio>
                <el-radio v-model="ruleForm.up" label="5" :disabled="isedit">【线上】购买发放</el-radio>
                <el-radio v-model="ruleForm.up" label="6" :disabled="isedit">【线上】扫码发放</el-radio>
                <el-radio v-model="ruleForm.up" label="7" :disabled="isedit">【线上】主动领取</el-radio>
                <el-radio v-model="ruleForm.up" label="8" :disabled="isedit">【线上】积分兑换</el-radio>
              </div>
              <el-radio
                v-if="!ruleForm.isup"
                v-model="ruleForm.down"
                :label="item.id"
                v-for="item in ruleForm.downLIst"
                :key="item.id"
              >{{item.name}}</el-radio>
            </el-form-item>
            <el-form-item label="  会员标签" v-if="ruleForm.ismember_title">
              <el-select v-model="ruleForm.member_title">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
              <div style="color:#8B8B8B">选择会员标签后，将自动给标签下的会员发送优惠券码</div>
            </el-form-item>
               <el-form-item label="会员卡分组"  v-if="ruleForm.ismember_group">
              <el-select v-model="ruleForm.member_group">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
              <div style="color:#8B8B8B">选择分组成功后，将自动给分组下的会员电话发送优惠券码</div>
            </el-form-item>
            <el-form-item label=" 兑换消耗积分" prop="score" v-if="ruleForm.isscore">
              <el-input v-model="ruleForm.score" placeholder="消费满多少元发放优惠券"></el-input>
              <div style="color:#8B8B8B">积分兑换时消耗积分，兑换优惠券</div>
            </el-form-item>
            <el-form-item label=" 发放限制" prop="cost_money" v-if="ruleForm.iscost_money">
              <el-input v-model="ruleForm.cost_money" placeholder="消费满多少元发放优惠券" type="unmber"></el-input>
              <div style="color:#8B8B8B">储值或消费金额大于设置金额，发放优惠券</div>
            </el-form-item>
            <el-form-item label="关键词" prop="antistop" v-if="ruleForm.isantistop">
              <el-input v-model="ruleForm.antistop"></el-input>
            </el-form-item>
            <el-form-item label="标题" prop="title" v-if="ruleForm.istitle">
              <el-input v-model="ruleForm.title"></el-input>
            </el-form-item>
            <el-form-item label="描述 " prop="intro" v-if="ruleForm.istextarea">
              <el-input type="textarea" v-model="ruleForm.intro" :rows="3"></el-input>
            </el-form-item>
            <el-form-item label="商品图片" v-if="ruleForm.isfiles">
              <el-upload
                ref="upload"
                :action="$uplaadUrl"
                list-type="picture-card"
                :file-list="ruleForm.files"
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
               <el-form-item >
                   <el-button type="primary" @click="onsubmit" v-if="!isedit">提交</el-button>
                   <el-button type="primary" @click="onedits" v-else>修改</el-button>
                   
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import { isonenumber } from "@/utils/validtel.js";
export default {
  // props:[],
  // 页面加载
  created() {
    // this.getaddWeiGoods();
    // 判断是添加还是删除 根据传过来的id判断
    if (this.$route.params.id) {
      sessionStorage.setItem("ff_id", this.$route.params.id);
      sessionStorage.setItem("ff", this.$route.params.ff);
    }
    if (this.$route.params.id || sessionStorage.getItem("ff_id")) {
      this.editId = this.$route.params.id || sessionStorage.getItem("ff_id");
      this.isedit = this.$route.params.ff || sessionStorage.getItem("ff");
      if (this.isedit == 0) {
        this.isedit = false;
      } else {
        this.isedit = true;
      }
    }

    this.ruleForm.type="2"
    setTimeout(()=>{
      this.ruleForm.type="1"
    })
        this.ruleForm.up="2"
    setTimeout(()=>{
      this.ruleForm.up="1"
    })
    if(this.isedit){
          // 调用编辑接口
          this.onedit()
    }
    
  },
  // 页面加载完成
  mounted() {},
  data() {
    return {
      editId: "",
      isedit: false,
      header: {
        Authorization: sessionStorage.getItem("token") || ""
      },
      rules: {
        title: [{ required: true, message: "请输入标题", trigger: "blur" }],
        antistop: [
          { required: true, message: "请输入关键词", trigger: "blur" }
        ],
        score: [{ required: true, message: "请输入积分", trigger: "blur" },
         { validator: isonenumber, trigger: "blur" }],
        cost_money: [
          { required: true, message: "请输入发放限制", trigger: "blur" },
           { validator: isonenumber, trigger: "blur" }
        ],
        intro:[
          { required: true, message: "请输入描述", trigger: "blur" }
        ],
       
      },
      options: [
        {
          value: 0,
          label: "黄金糕"
        },
        {
          value: 1,
          label: "双皮奶"
        },
        {
          value: 2,
          label: "蚵仔煎"
        },
        {
          value: 3,
          label: "龙须面"
        },
        {
          value: 4,
          label: "北京烤鸭"
        }
      ],
      ruleForm: {
        title: "",//标题
        type: "1",
        up: "1",
        intro: "",//描述
        picture: "",//图片
        antistop: "",
        cost_money: "",
        member_title: "",
        down: "",
        isup: true,
        downLIst: [
          {
            name: "【线下】会员卡分组群发",
            id: 1
          },
          {
            name: "【线下】纸质发放",
            id: 2
          }
        ],
        receive: true, //领取方式显示与隐藏
        ismember_title: true,
        isscore: true,
        iscost_money: true,
        isantistop: true,
        istitle: true,
        istextarea: true,
        isfiles: true,
          member_group:'',
          ismember_group:true

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
        this.ruleForm.picture=e.name
      }
    },
    handleRemove(e) {
       this.ruleForm.picture=""
    },
    onexceed() {
      this.$message.error("最多只能上传一张");
    },
    // 点击了提交
    onsubmit(){
    this.$refs.ruleForm.validate((valid) => {
          if (!valid) return 
             this.ruleForm.coupon_id=this.editId
            this.$api
        .getwxgiveAdd(this.ruleForm)
        .then(res => {
          if (res.data.code == 200) {
                this.$message.success(res.data.msg);
                            this.$router.push("/coupon")
                
          } else {  
            this.$message.error(res.data.msg);
          }
        })
        .catch(res => {
          console.log(res);
          this.$message.error();
        });
        });


        
    },
    onedit(){
       this.$api
        .getwxgiveSearch({
          coupon_give_id:this.editId
        })
        .then(res => {
          if (res.data.code == 200) {
                                   this.ruleForm.antistop=res.data.coupon_give.antistop
                                   this.ruleForm.cost_money=res.data.coupon_give.cost_money
                                   this.ruleForm.coupon_id=res.data.coupon_give.coupon_id
                                   this.ruleForm.down=res.data.coupon_give.down
                                   this.ruleForm.id=res.data.coupon_give.id
                                   this.ruleForm.intro=res.data.coupon_give.intro
                                   this.ruleForm.member_group=res.data.coupon_give.member_group
                                   this.ruleForm.member_title=res.data.coupon_give.member_title
                                   this.ruleForm.picture=res.data.coupon_give.picture
                                   this.ruleForm.score=res.data.coupon_give.score
                                   this.ruleForm.title=res.data.coupon_give.title
                                   this.ruleForm.type=res.data.coupon_give.type
                                   this.ruleForm.up=res.data.coupon_give.up
                
          } else {  
            this.$message.error(res.data.msg);
          }
        })
        .catch(res => {
          console.log(res);
          this.$message.error();
        });
    },
    onedits(){
         this.ruleForm.coupon_give_id=this.editId
          this.$api
        .getwxgiveUpdates(this.ruleForm)
        .then(res => {
          if (res.data.code == 200) {
                        this.$message.success(res.data.msg);
                            this.$router.push("/coupon")
                  
          } else {  
            this.$message.error(res.data.msg);
          }
        })
        .catch(res => {
          console.log(res);
          this.$message.error();
        });
    }
  },
  // 监听属性
  watch: {
    "ruleForm.type": {
      handler(e) {
        if (e == 1) {
          this.ruleForm.isup = true;
          this.ruleForm.receive = true;
          this.ruleForm.ismember_title = false;
          this.ruleForm.isscore = false;
          this.ruleForm.iscost_money = false;
          this.ruleForm.isantistop = false;
          this.ruleForm.istitle = true;
          this.ruleForm.istextarea = true;
          this.ruleForm.isfiles = true;
          this.ruleForm.up="1"
        } else if (e == 2) {
          this.ruleForm.isup = false;
          this.ruleForm.receive = true;
          this.ruleForm.ismember_title = false;
          this.ruleForm.isscore = false;
          this.ruleForm.iscost_money = false;
          this.ruleForm.isantistop = false;
          this.ruleForm.istitle = true;
          this.ruleForm.istextarea = true;
          this.ruleForm.isfiles = true;
        } else if (e == 3) {
          this.ruleForm.receive = false;
          this.ruleForm.ismember_title = false;
          this.ruleForm.isscore = false;
          this.ruleForm.iscost_money = false;
          this.ruleForm.isantistop = false;
          this.ruleForm.istitle = false;
          this.ruleForm.istextarea = false;
          this.ruleForm.isfiles = false;
           this.ruleForm.ismember_group=true//会员卡分组
        }
      }
    },
    "ruleForm.up":{
      handler(e){
        if(e==1){
          this.ruleForm.ismember_title = false;//会员标签
          this.ruleForm.isscore = false;//兑换消耗积分
          this.ruleForm.iscost_money = false;//发放限制
          this.ruleForm.isantistop = true;//关键词
          this.ruleForm.istitle = true;//标题
          this.ruleForm.istextarea = true;//描述
          this.ruleForm.isfiles = true;//图片
          this.ruleForm.ismember_group=false//会员卡分组
        }else if(e==2){
          this.ruleForm.ismember_title = false;//会员标签
          this.ruleForm.isscore = false;//兑换消耗积分
          this.ruleForm.iscost_money = false;//发放限制
          this.ruleForm.isantistop = true;//关键词
          this.ruleForm.istitle = true;//标题
          this.ruleForm.istextarea = true;//描述
          this.ruleForm.isfiles = true;//图片
                  this.ruleForm.ismember_group=false//会员卡分组
        }else if(e==3){
            this.ruleForm.ismember_title = false;//会员标签
          this.ruleForm.isscore = false;//兑换消耗积分
          this.ruleForm.iscost_money = true;//发放限制
          this.ruleForm.isantistop = false;//关键词
          this.ruleForm.istitle = false;//标题
          this.ruleForm.istextarea = false;//描述
          this.ruleForm.isfiles = false;//图片
                  this.ruleForm.ismember_group=false//会员卡分组
        }else if(e==4){
            this.ruleForm.ismember_title = false;//会员标签
          this.ruleForm.isscore = false;//兑换消耗积分
          this.ruleForm.iscost_money = true;//发放限制
          this.ruleForm.isantistop = false;//关键词
          this.ruleForm.istitle = false;//标题
          this.ruleForm.istextarea = false;//描述
          this.ruleForm.isfiles = false;//图片
                  this.ruleForm.ismember_group=false//会员卡分组
        }else if(e==5){
            this.ruleForm.ismember_title = false;//会员标签
          this.ruleForm.isscore = false;//兑换消耗积分
          this.ruleForm.iscost_money = false;//发放限制
          this.ruleForm.isantistop = false;//关键词
          this.ruleForm.istitle = false;//标题
          this.ruleForm.istextarea = false;//描述
          this.ruleForm.isfiles = false;//图片
                  this.ruleForm.ismember_group=false//会员卡分组
        }else if(e==6){
            this.ruleForm.ismember_title = true;//会员标签
          this.ruleForm.isscore = false;//兑换消耗积分
          this.ruleForm.iscost_money = false;//发放限制
          this.ruleForm.isantistop = false;//关键词
          this.ruleForm.istitle = false;//标题
          this.ruleForm.istextarea = false;//描述
          this.ruleForm.isfiles = false;//图片
                  this.ruleForm.ismember_group=false//会员卡分组
        }else if(e==7){
            this.ruleForm.ismember_title = false;//会员标签
          this.ruleForm.isscore = false;//兑换消耗积分
          this.ruleForm.iscost_money = false;//发放限制
          this.ruleForm.isantistop = false;//关键词
          this.ruleForm.istitle = false;//标题
          this.ruleForm.istextarea = false;//描述
          this.ruleForm.isfiles = false;//图片
                  this.ruleForm.ismember_group=false//会员卡分组
        }else if(e==8){
            this.ruleForm.ismember_title = false;//会员标签
          this.ruleForm.isscore = true;//兑换消耗积分
          this.ruleForm.iscost_money = false;//发放限制
          this.ruleForm.isantistop = false;//关键词
          this.ruleForm.istitle = false;//标题
          this.ruleForm.istextarea = false;//描述
          this.ruleForm.isfiles = false;//图片
                  this.ruleForm.ismember_group=false//会员卡分组
        }
        
      }
    },
    "ruleForm.down":{
        handler(e){
          if(e==1){
            this.ruleForm.ismember_title = false;//会员标签
          this.ruleForm.isscore = false;//兑换消耗积分
          this.ruleForm.iscost_money = false;//发放限制
          this.ruleForm.isantistop = false;//关键词
          this.ruleForm.istitle = false;//标题
          this.ruleForm.istextarea = false;//描述
          this.ruleForm.isfiles = false;//图片
                  this.ruleForm.ismember_group=true//会员卡分组
        }
          if(e==2){
            this.ruleForm.ismember_title = false;//会员标签
          this.ruleForm.isscore = false;//兑换消耗积分
          this.ruleForm.iscost_money = false;//发放限制
          this.ruleForm.isantistop = false;//关键词
          this.ruleForm.istitle = false;//标题
          this.ruleForm.istextarea = false;//描述
          this.ruleForm.isfiles = false;//图片
                  this.ruleForm.ismember_group=false//会员卡分组
        }
        }
    }
  },
  // 组件
  component: {},
  // 计算属性
  computed: {},
  beforeDestroy(){
    sessionStorage.removeItem("ff_id")
    sessionStorage.removeItem("ff")

  }
};
</script>

<style lang="less" scoped>
</style>
