<template>
  <el-card>
    <el-row :gutter="5">
      <el-col :span="15">
        <el-form
          :model="ruleForm"
          :rules="rules"
          ref="ruleForm"
          label-width="150px"
          class="demo-ruleForm"
        >
          <el-form-item label="名称" prop="title">
            <el-input v-model="ruleForm.title"></el-input>
          </el-form-item>
          <el-form-item label="电话号码" prop="phone">
            <el-input v-model="ruleForm.phone"></el-input>
          </el-form-item>
          <el-form-item label="店铺介绍" prop="intro">
            <el-input type="textarea" v-model="ruleForm.intro" :rows="3"></el-input>
          </el-form-item>
          <el-form-item label="店铺类型" prop="intro">
            <el-select v-model="ruleForm.type" placeholder="请选择店铺">
              <el-option
                v-for="item in shoplist"
                :key="item.id"
                :label="item.title"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>

          <!-- 隐藏掉 -->
              <!-- <el-form-item label="云币抵扣率" prop="coin_rate" style="width:50%">
            <el-input type="number" v-model="ruleForm.coin_rate" placeholder="折扣率只能选择10%~50%"></el-input>
          </el-form-item> -->


          <el-form-item label="店铺地区">
            <area-cascader
              type="text"
              style="line-height: 18px;"
              :level="1"
              v-model="ruleForm.addresss"
              :data="pcaa"
              @change="cityChange"
            ></area-cascader>
          </el-form-item>
          <el-form-item label="店铺地址" prop="address">
            <el-input v-model="ruleForm.address"></el-input>
          </el-form-item>
          <el-form-item label="地图定位">
            <baidu-map :position="position" @select-location="onlocation"></baidu-map>
          </el-form-item>
          <el-form-item label="经度" prop="longitude">
            <el-input v-model="ruleForm.longitude" disabled></el-input>
          </el-form-item>
          <el-form-item label="维度" prop="latitude">
            <el-input v-model="ruleForm.latitude" disabled></el-input>
          </el-form-item>
          <el-form-item label="店铺域名" prop="shop_url ">
            <el-input v-model="ruleForm.shop_url"></el-input>
          </el-form-item>
          <el-form-item label="店铺版权" prop="copyright">
            <el-input v-model="ruleForm.copyright"></el-input>
          </el-form-item>
          <el-form-item label="序列号" prop="number">
            <el-input v-model="ruleForm.number"></el-input>
          </el-form-item>
          <el-form-item label="营业时间">
            <el-time-select
              placeholder="起始时间"
              v-model="ruleForm.opening_time"
              :picker-options="{
                      start: '00:00',
                      step: '00:15',
                      end: '23:30'
                    }"
            ></el-time-select>
            <span style="margin:0 5px">--</span>
            <el-time-select
              placeholder="结束时间"
              v-model="ruleForm.closing_time"
              :picker-options="{
                      start: '00:30',
                      step: '00:15',
                      end: '23:30',
                      minTime: ruleForm.opening_time
                    }"
            ></el-time-select>
          </el-form-item>
          <el-form-item label="是否关闭店铺" prop="del">
            <el-switch
              v-model="ruleForm.del"
              active-color="#008080"
              active-text="是"
              inactive-text="否"
              inactive-color="#ff4949"
            ></el-switch>
          </el-form-item>
          <el-form-item label="关店时间" v-if="ruleForm.del" prop="end_time1">
            <el-date-picker
              v-model="ruleForm.end_time1"
              type="datetime"
              placeholder="选择日期时间"
              value-format="timestamp"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="关闭店铺的原因" v-if="ruleForm.del">
            <el-input type="textarea" v-model="ruleForm.end_intro" :rows="3"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm('ruleForm')" size="mini">确定</el-button>
            <el-button @click="resetForm('ruleForm')" size="mini">重置</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </el-card>
</template>

<script>
import "vue-area-linkage/dist/index.css";
import { pca, pcaa } from "area-data";
import baiduMap from "@/components/baiduMap";
export default {
  components: {
    baiduMap
  },
  data() {
    return {
      keyword: "",
      position: {},
      pca: pca,
      pcaa: pcaa,
      id: "",
      shoplist:[],
      ruleForm: { end_time1: "" ,type:"",coin_rate:""},
      dialogImageUrl: "",
      dialogVisible: false,
      disabled: false,
      limit: 1,
      rules: {
        title: [{ required: true, message: "请输入名称", trigger: "change" }],
        phone: [
          { required: true, message: "请输入联系电话", trigger: "change" }
        ],
        coin_rate:[ { required: true, message: "请输入云币抵扣率", trigger: "blur" }],
        shop_url: [
          { required: true, message: "请输入店铺域名", trigger: "change" }
        ],
        longitude: [
          { required: true, message: "请在地图选择详细地址", trigger: "change" }
        ],
        latitude: [
          { required: true, message: "请在地图选择详细地址", trigger: "change" }
        ]
      }
    };
  },
  created() {
    let id = this.$route.query.id;
    let position = {
      longitude: 108.953457,
      latitude: 34.265633,
      keyword: "中贸广场"
    };
    this.shopAdds();

    id ? this.Edit() : (this.position = position);
  },
  methods: {
    Edit() {
      this.$api
        .storeManagementEdit({
          params: {
            id: this.$route.query.id
          }
        })
        .then(res => {
          if (res.data.code == 200) {
            if (res.data.list.del == 1) {
              res.data.list.del = true;
            } else {
              res.data.list.del = false;
            }
            // console.log(res.data.list);
            this.ruleForm = res.data.list;
            this.ruleForm.end_time1 = this.ruleForm.end_time;
            this.position = {
              longitude: this.ruleForm.longitude,
              latitude: this.ruleForm.latitude,
              keyword: this.ruleForm.address
            };
            console.log(this.position);
          } else {
            this.$api.error(res.data.msg);
          }
        })
        .catch(res => {
          this.$api.error();
        });
    },
    shopAdds() {
      this.$api
        .shopAdds({})
        .then(res => {
          if (res.data.code == 200) {
            // console.log(res.data.arr);
            this.shoplist=res.data.arr
          } else {
            this.$api.error(res.data.msg);
          }
        })
        .catch(res => {
          this.$api.error();
        });
    },
    cityChange(val) {
      this.ruleForm.address = "";
      this.ruleForm.longitude == "",
        (this.ruleForm.latitude = ""),
        (this.ruleForm.province = val[0]);
      this.ruleForm.city = val[1];
      this.ruleForm.district = val[2];
      val.forEach(el => {
        this.ruleForm.address += el;
      });
      this.keyword = this.ruleForm.address;
    },
    submitForm(formName) {
      this.ruleForm.end_time = this.ruleForm.end_time1;
      this.$refs[formName].validate(valid => {
        if (valid) {
          let id = this.$route.query.id;
          if (id) {
            this.$api
              .storeManagementUpdate(this.ruleForm)
              .then(res => {
                res.data.code == 200
                  ? this.$router.push("./settings")
                  : this.$api.error(res.data.msg);
              })
              .catch(res => {
                this.$api.error();
              });
          } else {
            if(this.ruleForm.type==""){
               return  this.$api.error("请选择店铺")
            }
            // if(this.ruleForm.coin_rate<10||this.ruleForm.coin_rate>50){
            //     return  this.$api.error("折扣率只能选择10%~50%")
            // }
            this.$api
              .storeManagementAdd(this.ruleForm)
              .then(res => {
                res.data.code == 200
                  ? this.$router.push("./settings")
                  : this.$api.error(res.data.msg);
              })
              .catch(res => {
                this.$api.error();
              });
          }
        } else {
          return false;
        }
      });
    },
    resetForm(formName) {
      this.ruleForm.address = "";
      this.ruleForm.longitude = "";
      this.ruleForm.latitude = "";
      this.position = {};
      this.$refs["ruleForm"].resetFields();
    },
    onlocation(e) {
      console.log(e);
      this.ruleForm.address = e.address;
      this.ruleForm.longitude = e.point.lng;
      this.ruleForm.latitude = e.point.lat;
      this.position = { lng: e.point.lng, lat: e.point.lat };
    }
  }
};
</script>
<style lang="less" scoped>
</style>