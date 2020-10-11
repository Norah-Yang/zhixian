 <template>
  <div>
    <el-row>
      <el-col :span="24">
        <el-card shadow="always">
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
            <el-form-item label="地区">
              <el-cascader v-model="ruleForm.addressList" :options="options" @change="onchange"></el-cascader>
            </el-form-item>
            <el-form-item label="地址" prop="address">
              <el-input v-model="ruleForm.address" placeholder="请输入您的地址"></el-input>
            </el-form-item>
            <el-form-item label="店点描述">
              <el-input type="textarea" v-model="ruleForm.intro" :rows="3"></el-input>
            </el-form-item>
            <el-form-item label="页面标题">
              <el-input v-model="ruleForm.title"></el-input>
            </el-form-item>
            <el-form-item label="页面关键词">
              <el-input v-model="ruleForm.keyword"></el-input>
            </el-form-item>
            <el-form-item label="页面描述">
              <el-input type="textarea" v-model="ruleForm.page_intro" :rows="3"> </el-input>
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
            <el-form-item label="商城域名">
              <el-input v-model="ruleForm.domain_name"></el-input>
            </el-form-item>
            <el-form-item label="商城版权">
              <el-input v-model="ruleForm.copyright"></el-input>
            </el-form-item>
            <el-form-item label="商城模板">
              <el-select v-model="ruleForm.mall_template" placeholder="请选择">
                <el-option
                  v-for="item in ruleForm.printerList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="商城模板">
              <el-select v-model="ruleForm.poster_template" placeholder="请选择">
                <el-option
                  v-for="item in ruleForm.printerLists"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="是否关闭店点">
              <el-switch
                v-model="ruleForm.end_mall"
                active-color="#008080"
                inactive-color="#ff4949"
                active-text="是"
                inactive-text="否"
              ></el-switch>
            </el-form-item>
            <el-form-item label="关闭店点时间">
              <el-date-picker
                v-model="ruleForm.end_time"
                type="date"
                placeholder="选择日期"
                value-format="timestamp"
              ></el-date-picker>
            </el-form-item>
            <el-form-item label="关闭店点的原因">
              <el-input type="textarea" v-model="ruleForm.end_intro" :rows="3"></el-input>
            </el-form-item>
            <el-form-item label="提交">
              <el-button type="info" @click="onresetForm" v-no-click>重值</el-button>
              <el-button type="primary" @click="onconfirms" v-no-click>添加</el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import { options } from "@/assets/js/cityDataArr.js";
import { validtel } from "@/utils/validtel.js";
import _ from "lodash";
export default {
  // props:[],
  // 页面加载
  created() {
    this.getaddLineshop();
  },
  // 页面加载完成
  mounted() {},
  data() {
    return {
      isedit: false,
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
        times: "",
        logo: "",
        file: [],
        navigation: "",
        fileNavigation: [],
        end_time: "",
        end_mall: false,
        close_intro: "",
        printer: "",
        printerList: [],
        printerLists: [],
        title: "",
        keyword: "",
        page_intro: "",
        domain_name: "",
        copyright: "",
        mall_template: "",
        poster_template: "",
        storage_id: "",
        storage_idList: [],
        province: "",
        city: "",
        district: "",
        editId: "",
        end_intro: "",
        addressList: []
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
        .getweiSetting()
        .then(res => {
          if (res.data.code == 200) {
           if(res.data.list){
             this.ruleForm.name=res.data.list.name
             this.ruleForm.city=res.data.list.city
             this.ruleForm.district=res.data.list.district
             this.ruleForm.province=res.data.list.province
             this.ruleForm.end_intro=res.data.list.end_intro
             this.ruleForm.address=res.data.list.address
             this.ruleForm.intro=res.data.list.intro
             this.ruleForm.keyword=res.data.list.keyword
             this.ruleForm.mall_template=res.data.list.mall_template
             this.ruleForm.page_intro=res.data.list.page_intro
             this.ruleForm.poster_template=res.data.list.poster_template
             this.ruleForm.title=res.data.list.title
             this.ruleForm.phone=res.data.list.phone
             this.ruleForm.copyright=res.data.list.copyright
             this.ruleForm.domain_name=res.data.list.domain_name
             this.ruleForm.end_mall=res.data.list.end_mall?true:false
             if(res.data.list.end_time){
             this.ruleForm.end_time=res.data.list.end_time*1000
             }
               if(res.data.list.logo){
             this.ruleForm.logo=res.data.list.logo
             this.ruleForm.file.push({
               name:"1213",
               url:res.data.list.logo
             })
             
             }

             if(res.data.list.province&&res.data.list.city){
                  this.ruleForm.addressList = [res.data.list.province,res.data.list.city,res.data.list.district]
             }
//              add_time: 1593508320
// address: "12123"
// city: "天津市"
// copyright: ""
// district: "和平区"
// domain_name: ""
// end_intro: "23423"
// end_mall: 0
// end_time: 1591113600
// id: 3
// intro: "放到大范甘迪"
// keyword: "玩儿"
// logo: "https://www.zhixianyun.cn/uploads/webmanage/2020-06-30/5efb01dcd6291.png"
// mall_template: 1
// merchant_id: 1
// name: "分手大师对方发送的"
// page_intro: "2323"
// phone: "13227886942"
// poster_template: 2
// province: "天津市"
// title: "2323"
           }
            this.ruleForm.printerList = res.data.mall_template;
            this.ruleForm.printerLists = res.data.poster_template;
          } else {
            this.$message.error(res.data.msg);
          }
        })
        .catch(res => {
          this.$message.error("网络错误");
          console.log(res);
        });
    },
    onconfirms() {
      let data = _.cloneDeep(this.ruleForm);
      data.end_mall = data.end_mall ? 1 : 0;
      data.end_time = data.end_time ? data.end_time / 1000 : "";
      this.$refs.ruleForm.validate(valid => {
        if (!valid) return;
        this.$api
          .getweiSettings(data)
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
      });
    },
    onresetForm() {
      this.$refs.ruleForm.resetFields();
      this.ruleForm = {
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
      };
    },
    onchange(e) {
      this.ruleForm.province = e[0];
      this.ruleForm.city = e[1];
      this.ruleForm.district = e[2];
    }
  },
  // 监听属性
  watch: {},
  // 组件
  components: {},
  // 计算属性
  computed: {},
  beforeDestroy() {}
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