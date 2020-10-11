 <template>
    <div>
        <el-row>
            <el-col :span="24">
                <el-card shadow="always">
                    <!-- name -->
                    <el-form
                        :model="ruleForm"
                        :rules="rules"
                        ref="ruleForm"
                        label-width="130px"
                        class="demo-ruleForm"
                    >
                        <el-form-item label="店点名称" prop="name">
                            <el-input v-model="ruleForm.name" :disabled="this.isedit"></el-input>
                        </el-form-item>
                        <el-form-item label="电话" prop="phone">
                            <el-input v-model="ruleForm.phone" :disabled="this.isedit"></el-input>
                        </el-form-item>
                        <!-- <el-form-item label="地区">
                            <el-cascader
                                v-model="ruleForm.addressList"
                                :options="options"
                                @change="handleChange"
                            ></el-cascader>
                        </el-form-item>-->
                        <el-form-item label="地址" prop="address">
                            <el-input
                                v-model="ruleForm.address"
                                @input="oninput"
                                placeholder="请输入您的地址" :disabled="this.isedit"
                            ></el-input>
                        </el-form-item>
                        <el-form-item label="地图定位" v-if="!this.isedit">
                            <baidu-map :map="map" @select-location="onlocation"></baidu-map>
                        </el-form-item>
                        <el-form-item label="经度">
                            <el-input v-model="ruleForm.longitude" disabled></el-input>
                        </el-form-item>
                        <el-form-item label="纬度">
                            <el-input v-model="ruleForm.latitude" disabled></el-input>
                        </el-form-item>
                        <el-form-item label="营业时间">
                            <el-time-picker
                                is-range
                                v-model="ruleForm.times"
                                range-separator="至"
                                start-placeholder="开始时间"
                                end-placeholder="结束时间"
                                placeholder="选择时间范围"
                                value-format="timestamp"
                                :disabled="this.isedit"
                            ></el-time-picker>
                        </el-form-item>
                        <el-form-item label="选择关联仓库" prop="storage_id">
                            <el-select v-model="ruleForm.storage_id" placeholder="请选择"  :disabled="this.isedit">
                                <el-option
                                    v-for="item in ruleForm.storage_idList"
                                    :key="item.id"
                                    :label="item.name"
                                    :value="item.id"
                                ></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="店点logo">
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
                        <el-form-item label="店点描述">
                            <el-input type="textarea" v-model="ruleForm.intro" :rows="3"></el-input>
                        </el-form-item>
                        <el-form-item label="是否自提店点">
                            <el-switch
                                v-model="ruleForm.pick_status"
                                active-color="#008080"
                                inactive-color="#ff4949"
                                active-text="是"
                                inactive-text="否"
                            ></el-switch>
                        </el-form-item>
                        <el-form-item label="是否快递店点">
                            <el-switch
                                v-model="ruleForm.express_status"
                                active-color="#008080"
                                inactive-color="#ff4949"
                                active-text="是"
                                inactive-text="否"
                            ></el-switch>
                        </el-form-item>
                        <el-form-item label="自提时间显示天数">
                            <el-input v-model.number="ruleForm.pick_day"></el-input>
                        </el-form-item>
                        <el-form-item label="快递时间显示天数">
                            <el-input v-model.number="ruleForm.express_day"></el-input>
                        </el-form-item>
                        <el-form-item label="选择云打印机">
                            <el-select v-model="ruleForm.printer" placeholder="请选择">
                                <el-option
                                    v-for="item in ruleForm.printerList"
                                    :key="item.id"
                                    :label="item.name"
                                    :value="item.id"
                                ></el-option>
                            </el-select>
                            <div>线上订单打印，云打印机未选择时，使用默认打印机</div>
                        </el-form-item>
                        <el-form-item label="门店导航图片">
                            <el-upload
                                ref="upload"
                                :action="$uplaadUrl"
                                list-type="picture-card"
                                :file-list="ruleForm.fileNavigation"
                                :limit="1"
                                :headers="header"
                                :on-remove="handleRemoveNavigation"
                                :on-success="AvatarSuccessNavigation"
                                :on-exceed="onexceedNavigation"
                                :before-upload="beforeUpload"
         accept=".jpg, .png"
                            >
                                <i class="el-icon-plus"></i>
                                <div slot="tip" class="el-upload__tip">文件大小为 640*320</div>
                            </el-upload>
                        </el-form-item>
                        <el-form-item label="是否关闭店点"  v-if="!this.isedit">
                            <el-switch
                                v-model="ruleForm.close"
                                active-color="#008080"
                                inactive-color="#ff4949"
                                active-text="是"
                                inactive-text="否"
                            ></el-switch>
                        </el-form-item>
                        <el-form-item label="关闭店点时间"  v-if="!this.isedit">
                            <el-date-picker
                                v-model="ruleForm.close_time"
                                type="date"
                                placeholder="选择日期"
                                value-format="timestamp"
                            ></el-date-picker>
                        </el-form-item>
                        <el-form-item label="关闭店点的原因" v-if="!this.isedit">
                            <el-input type="textarea" v-model="ruleForm.close_intro" :rows="3"></el-input>
                        </el-form-item>
                        <el-form-item label="提交">
                            <el-button type="info"  @click="onresetForm"  v-no-click v-if="!isedit" size="mini">重值</el-button>
                            <el-button type="primary" @click="onconfirms" v-no-click v-if="!isedit" size="mini">添加</el-button>
                            <el-button type="primary" @click="oneditconfirms" v-no-click v-else size="mini">修改</el-button>
                        </el-form-item>
                    </el-form>
                </el-card>
            </el-col>
        </el-row>
    </div>
</template>
<script>
import { options } from "@/assets/js/cityDataArr.js";
import baiduMap from "@/views/components/baiduMap/baiduMap";
import { validtel } from "@/utils/validtel.js";
import _ from "lodash";
export default {
  // props:[],
  // 页面加载
  created() {
    this.getaddLineshop();
     // 判断是添加还是删除 根据传过来的id判断
    if (this.$route.params.id) {
      sessionStorage.setItem("lineshop_id", this.$route.params.id);
    }
    if (this.$route.params.id || sessionStorage.getItem("lineshop_id")) {
      this.isedit = true;
      this.ruleForm.editId = this.$route.params.id || sessionStorage.getItem("lineshop_id");
      this.getupdateLineshop();
    }
  },
  // 页面加载完成
  mounted() {},
  data() {
    return {
      isedit:false,
      header: {
        Authorization: sessionStorage.getItem("token") || ""
      },
      options,
      map: {
        center: { lng: 108.952082, lat: 34.248943 },
        zoom: 18,
        show: true,
        dragging: true,
        keyword: "中贸广场"
      },
      ruleForm: {
        name: "",
        phone: "",
        address: "",
        longitude: "",
        latitude: "",
        opening_time: "",
        closing_time: "",
        times: "",
        logo: "",
        file: [],
        express_status: true,
        pick_status: true,
        navigation: "",
        fileNavigation: [],
        close_time: "",
        close: false,
        close_intro: "",
        printer: "",
        printerList: [],
        storage_id: "",
        storage_idList: [],
        province: "",
        city: "",
        district: "",
        editId:"",
        pick_day:7,
        express_day:7
      },
      rules: {
        name: [{ required: true, message: "请输入店铺名称", trigger: "blur" }],
        phone: [
          { required: true, message: "请输入手机号", trigger: "blur" },
          { validator: validtel, trigger: "blur" }
        ],
        storage_id: [
          { required: true, message: "请选择关联仓库", trigger: "blur" }
        ],
        address: [{ required: true, message: "请输入地址", trigger: "blur" }]
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
    onlocation(e) {
      this.ruleForm.address = e.address;
      this.ruleForm.city = e.addressComponents.city;
      this.ruleForm.district = e.addressComponents.district;
      this.ruleForm.province = e.addressComponents.province;
      this.ruleForm.longitude = e.point.lng;
      this.ruleForm.latitude = e.point.lat;
    },
    onexceed() {
      this.$message.error("只能上传一张图");
    },
    onexceedNavigation() {
      this.$message.error("只能上传一张图");
    },
    handleRemove() {
      this.ruleForm.logo = "";
    },
    AvatarSuccess(e) {
      if (e.code == 200) {
        this.ruleForm.logo = e.name;
      }
    },
    handleRemoveNavigation() {
      this.ruleForm.navigation = "";
    },
    AvatarSuccessNavigation(e) {
      if (e.code == 200) {
        this.ruleForm.navigation = e.name;
      }
    },
    getaddLineshop() {
      this.$api
        .getaddLineshop()
        .then(res => {
          if (res.data.code == 200) {
            this.ruleForm.storage_idList = res.data.storage;
            this.ruleForm.printerList = res.data.printer;
          } else {
            this.$message.error(res.data.msg);
          }
        })
        .catch(res => {
          this.$message.error("网络错误");
          console.log(res);
        });
    },
    oninput() {
      this.map.keyword = this.ruleForm.address;
    },
    onconfirms() {
      if (!this.ruleForm.longitude||!this.ruleForm.latitude) {
        this.$message.error("请选择经纬度");
        return;
      }
      let data = _.cloneDeep(this.ruleForm);
      data.close = data.close ? 1 : 0;
      data.express_status = data.express_status ? 1 : 0;
      data.pick_status = data.pick_status ? 1 : 0;
      data.close_time = data.close_time ? data.close_time / 1000 : "";
      if (data.times.length > 0) {
        data.opening_time = data.times[0] / 1000;
        data.closing_time = data.times[1] / 1000;
      }
      this.$refs.ruleForm.validate(valid => {
        if (!valid) return;
        this.$api
          .getpostLineshop(data)
          .then(res => {
            if (res.data.code == 200) {
                this.$message.success(res.data.msg);
                   this.$router.push("/lineshop") 
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
    onresetForm(){
    this.$refs.ruleForm.resetFields();
         this.ruleForm={
        name: "",
        phone: "",
        address: "",
        longitude: "",
        latitude: "",
        opening_time: "",
        closing_time: "",
        times: "",
        logo: "",
        file: [],
        express_status: true,
        pick_status: true,
        navigation: "",
        fileNavigation: [],
        close_time: "",
        close: false,
        close_intro: "",
        printer: "",
        printerList: [],
        storage_id: "",
        storage_idList: [],
        province: "",
        city: "",
        district: ""
      }
    },
    getupdateLineshop(){
       this.$api
          .getupdateLineshop({
            params:{
                id:this.ruleForm.editId
            }
          })
          .then(res => {
            if (res.data.code == 200) {
                  console.log(res.data.list);
                  this.ruleForm.name=res.data.list.name
                  this.ruleForm.address=res.data.list.address
                  this.ruleForm.close=res.data.list.close==1?true:false
                  this.ruleForm.close_intro=res.data.list.close_intro
                  this.ruleForm.close_time=res.data.list.close_time?res.data.list.close_time*1000:res.data.list.close_time
                  this.ruleForm.express_day=res.data.list.express_day
                  this.ruleForm.express_status=res.data.list.express_status==1?true:false
                  this.ruleForm.intro=res.data.list.intro
                  this.ruleForm.latitude=res.data.list.latitude
                  if(res.data.list.logo){
                  this.ruleForm.logo=res.data.list.logo
                      this.ruleForm.file.push({
                        name:"1213.jpg",
                        url:res.data.list.logo
                      })
                  }
                  this.ruleForm.longitude=res.data.list.longitude
                  
                     if(res.data.list.navigation){
                                this.ruleForm.navigation=res.data.list.navigation
                      this.ruleForm.fileNavigation.push({
                        name:"1213.jpg",
                        url:res.data.list.logo
                      })
                  }
                  this.ruleForm.phone=res.data.list.phone
                  this.ruleForm.pick_day=res.data.list.pick_day
                  this.ruleForm.pick_status=res.data.list.pick_status==1?true:false
                  this.ruleForm.printer=parseInt(res.data.list.printer)
                  this.ruleForm.storage_id=res.data.list.storage_id
                  if(res.data.list.closing_time&&res.data.list.opening_time){
                      this.ruleForm.times=[res.data.list.opening_time*1000,res.data.list.closing_time*1000]
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
    // /点击了修改
    oneditconfirms(){
        if (!this.ruleForm.longitude||!this.ruleForm.latitude) {
        this.$message.error("请选择经纬度");
        return;
      }
      let data = _.cloneDeep(this.ruleForm);
      data.close = data.close ? 1 : 0;
      data.express_status = data.express_status ? 1 : 0;
      data.pick_status = data.pick_status ? 1 : 0;
      data.close_time = data.close_time ? data.close_time / 1000 : "";
      if (data.times&&data.times.length > 0) {
        data.opening_time = data.times[0] / 1000;
        data.closing_time = data.times[1] / 1000;
      }
      data.id=this.ruleForm.editId
      this.$refs.ruleForm.validate(valid => {
        if (!valid) return;
        this.$api
          .getupdateLineshops(data)
          .then(res => {
            if (res.data.code == 200) {
                this.$message.success(res.data.msg);
                   this.$router.push("/lineshop") 
            } else {
              this.$message.error(res.data.msg);
            }
          })
          .catch(res => {
            this.$message.error("网络错误");
            console.log(res);
          });
      });
    }
  },
  // 监听属性
  watch: {},
  // 组件
  components: {
    baiduMap
  },
  // 计算属性
  computed: {},
  beforeDestroy(){
    sessionStorage.removeItem("lineshop_id")
  }
};
</script>

<style lang="less" scoped>
.el-input,
.el-textarea {
  width: 50%;
}
.el-date-editor {
  width: 220px;
}
</style>