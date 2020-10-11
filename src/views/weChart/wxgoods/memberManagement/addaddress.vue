<template>
    <div>
        <el-row>
            <el-col :span="24">
                <el-card shadow="always">
                    <el-row>
                        <el-col :span="24">
                            <el-button type="primary" @click="onaddress">添加地址</el-button>
                        </el-col>
                    </el-row>
                    <div class="height"></div>
                    <el-table border="" :data="tableData" style="width: 100%" stripe>
                        <el-table-column label="ID" prop="id"></el-table-column>
                        <el-table-column label="姓名" prop="name" width="180"></el-table-column>
                        <el-table-column label="联系电话" prop="phone"></el-table-column>
                        <el-table-column label="地址" prop="phone" width="180">
                            <template slot-scope="row">
                                <div>{{row.row.address}}</div>
                                <div>{{row.row.detailed_address}}</div>
                            </template>
                        </el-table-column>
                        <el-table-column label="标签" prop="intro"></el-table-column>
                        <el-table-column label="操作">
                            <template slot-scope="row">
                                <!-- <el-button size="small" type="primary" @click="onaddClass(row)">添加</el-button> -->
                                <el-button
                                    size="small"
                                    type="info"
                                    @click="oneditone(row)"
                                    v-no-click
                                >编辑</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-card>
            </el-col>
        </el-row>
        <el-dialog
            title="商品列表"
            :visible="dialogVisible"
            width="50%"
            :show-close="false"
            :close-on-click-modal="false"
            :close-on-press-escape="false"
        >
            <el-form :model="ruleForm1" :rules="rule1" ref="ruleForms" label-width="130px">
                <el-form-item label="收货人" prop="name">
                    <el-input v-model="ruleForm1.name" placeholder="请输入收货人"></el-input>
                </el-form-item>
                <el-form-item label="手机号" prop="phone">
                    <el-input v-model="ruleForm1.phone" placeholder="请输入手机号"></el-input>
                </el-form-item>
                <el-form-item label="标签">
                    <el-input v-model="ruleForm1.intro" placeholder="请输入标签"></el-input>
                </el-form-item>
                <el-form-item label="选择地区">
                    <!-- <el-cascader v-model="ruleForm1.address" :options="options"></el-cascader> -->
                    <el-input v-model="ruleForm1.address" disabled></el-input>
                </el-form-item>
                <el-form-item label="选择收货地址">
                    <el-button type="primary" @click="innerVisible=true" v-no-click>选择收货地址</el-button>
                </el-form-item>
                <el-form-item label="详细地址" prop="detailed_address">
                    <el-input v-model="ruleForm1.detailed_address" placeholder="请输入详细地址"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="oncancel" v-no-click>取 消</el-button>
                <el-button type="primary" @click="onconfirm" v-no-click v-if="!isedit">确 定</el-button>
                <el-button type="primary" @click="oneditconfirm" v-no-click v-else>确 定</el-button>
            </span>
            <el-dialog
                width="50%"
                title="选择收货地址"
                :visible.sync="innerVisible"
                :show-close="false"
                :close-on-click-modal="false"
                :close-on-press-escape="false"
                append-to-body
            >
                <el-row>
                    <el-col>
                        <el-input
                            placeholder="请输入地址"
                            v-model="map.keyword"
                            clearable
                            class="input-with-select"
                        ></el-input>
                    </el-col>
                </el-row>
                <baidu-map :map="map" @select-location="onlocation"></baidu-map>
                <span slot="footer" class="dialog-footer">
                    <el-button type="primary" @click="onconfirms" v-no-click>确 定</el-button>
                </span>
            </el-dialog>
        </el-dialog>
    </div>
</template>
<script>
import { options } from "@/assets/js/cityDataArr.js";
import { validtel } from "@/utils/validtel.js";
// import { log } from "util";
import baiduMap from "@/views/components/baiduMap/baiduMap";
export default {
  // props:[],
  // 页面加载
  components: {
    baiduMap
  },
  created() {
    // 判断是添加还是删除 根据传过来的id判断
    if (this.$route.params.id) {
      sessionStorage.setItem("addmembers_ids", this.$route.params.id);
      sessionStorage.setItem("adduser_id", this.$route.params.user_id);
    }
    if (this.$route.params.id || sessionStorage.getItem("addmembers_ids")) {
      this.ruleForm.id =
        this.$route.params.id || sessionStorage.getItem("addmembers_ids");
      this.ruleForm1.user_id = this.$route.params.user_id|| sessionStorage.getItem("adduser_id");
      this.getMemberupaddressSearch();
    }
  },
  // 页面加载完成
  mounted() {},
  data() {
    return {
      options,
      isedit: false,
      dialogVisible: false,
      innerVisible: false,
      tableData: [],
      ruleForm: {
        id: ""
      },
      ruleForm1: {
        name: "",
        phone: "",
        address: "",
        user_id: "",
        detailed_address: "",
        longitude: "",
        latitude: "",
        intro: "",
        address_id: ""
      },
      rule1: {
        name: [{ required: true, message: "请输入收货人", trigger: "blur" }],
        phone: [
          { required: true, message: "请输入手机号", trigger: "blur" },
          { validator: validtel, trigger: "blur" }
        ],
        detailed_address: [
          { required: true, message: "请输入详细地址", trigger: "blur" }
        ]
      },
      map: {
        center: { lng: 108.952082, lat: 34.248943 },
        zoom: 13,
        show: true,
        dragging: true,
        keyword: "中贸广场"
      }
    };
  },
  // 方法
  methods: {
    getMemberupaddressSearch() {
      this.$api
        .getMemberupaddressSearch(this.ruleForm)
        .then(res => {
          if (res.data.code == 200) {
            this.tableData = res.data.list.address;
          } else {
            this.$message.error(res.data.msg);
          }
        })
        .catch(res => {
          this.$message.error("网络错误");
          console.log(res);
        });
    },
    onaddress() {
      this.dialogVisible = true;
    },
    onconfirm() {
      this.$refs.ruleForms.validate(valid => {
        if (!valid) return;
        if (this.ruleForm1.address.length == 0) {
          this.$message.error("请选择地区");
          return;
        }
        this.$api
          .getMemberupaddressAdd(this.ruleForm1)
          .then(res => {
            if (res.data.code == 200) {
              this.$message.success(res.data.msg);
              this.dialogVisible = false;
              this.ruleForm1.name = "";
              this.ruleForm1.phone = "";
              this.ruleForm1.address = "";
              this.ruleForm1.detailed_address = "";
              this.ruleForm1.intro = "";
              this.ruleForm1.longitude = "";
              this.ruleForm1.latitude = "";

              this.getMemberupaddressSearch();
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
    // handler({ BMap, map }) {
    //   let me = this;
    //   // 鼠标缩放
    //   map.enableScrollWheelZoom(true);
    //   // 点击事件获取经纬度
    //   map.addEventListener("click", function(e) {
    //     new BMap.Geocoder().getLocation(
    //       new BMap.Point(e.point.lng, e.point.lat),
    //       function(result) {
    //         console.log(result);
    //       }
    //     );
    //   });
    // },
    oncancel() {
      this.dialogVisible = false;
      this.ruleForm1.name = "";
      this.ruleForm1.phone = "";
      this.ruleForm1.address = "";
      this.ruleForm1.detailed_address = "";
      this.ruleForm1.intro = "";
      this.ruleForm1.longitude = "";
      this.ruleForm1.latitude = "";
      this.$refs.ruleForms.resetFields();
    },
    onlocation(e) {
      this.ruleForm1.address =
        e.addressComponents.province +
        e.addressComponents.city +
        e.addressComponents.district;
      this.ruleForm1.detailed_address =
        e.addressComponents.street + e.addressComponents.streetNumber;
      this.ruleForm1.latitude = e.point.lat;
      this.ruleForm1.longitude = e.point.lng;
    },
    onconfirms() {
      this.innerVisible = false;
    },
    // 点击了编辑
    oneditone(row) {
      this.$api
        .getMemberupAddressDetail({
          address_id: row.row.id
        })
        .then(res => {
          this.isedit = true;
          if (res.data.code == 200) {
            this.ruleForm1.name = res.data.list.name;
            this.ruleForm1.phone = res.data.list.phone;
            this.ruleForm1.address = res.data.list.address;
            this.ruleForm1.detailed_address = res.data.list.detailed_address;
            this.ruleForm1.intro = res.data.list.intro;
            this.ruleForm1.address_id = res.data.list.id;

            this.dialogVisible = true;
          } else {
            this.$message.error(res.data.msg);
          }
        })
        .catch(res => {
          this.$message.error("网络错误");
          console.log(res);
        });
    },
    // 点击了修改
    oneditconfirm() {
      this.$refs.ruleForms.validate(valid => {
        if (!valid) return;
        if (this.ruleForm1.address.length == 0) {
          this.$message.error("请选择地区");
          return;
        }
        this.$api
          .getMemberupaddressUpdate(this.ruleForm1)
          .then(res => {
            if (res.data.code == 200) {
              this.$message.success(res.data.msg);
              this.dialogVisible = false;
              this.ruleForm1.name = "";
              this.ruleForm1.phone = "";
              this.ruleForm1.address = "";
              this.ruleForm1.detailed_address = "";
              this.ruleForm1.intro = "";
              this.ruleForm1.longitude = "";
              this.ruleForm1.latitude = "";

              this.getMemberupaddressSearch();
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
  component: {},
  // 计算属性
  computed: {},
  beforeDestroy(){
    sessionStorage.removeItem("adduser_id")
    sessionStorage.removeItem("addmembers_ids")
  }
};
</script>

<style lang="less" scoped>
.input-with-select {
  margin-bottom: 10px;
}
</style>