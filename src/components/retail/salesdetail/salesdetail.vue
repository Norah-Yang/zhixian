<template>
  <div>
    <el-row>
      <el-col :span="24">
        <el-card shadow="always">
          <el-row>
            <el-col>
              <el-button type="primary" @click="onexittable"  size="mini" class="excel">导出表格</el-button>
              <el-select v-model="Page.shop_id" placeholder="请选择门店" size="mini">
                <el-option
                  v-for="item in rolefrom.shop"
                  :key="item.id"
                  :label="item.title"
                  :value="item.id"
                ></el-option>
              </el-select>
              <el-select v-model="Page.cate_id" placeholder="请选择商品分类" size="mini">
                <el-option
                  v-for="item in rolefrom.cate"
                  :key="item.id"
                  :label="item.title"
                  :value="item.id"
                ></el-option>
              </el-select>
              <el-select v-model="Page.refund_state" placeholder="请选择单据类型" size="mini">
                <el-option
                  v-for="item in rolefrom.refund"
                  :key="item.id"
                  :label="item.title"
                  :value="item.id"
                ></el-option>
              </el-select>
              <el-select v-model="Page.time" placeholder="请选择交易时间" size="mini">
                <el-option
                  v-for="item in rolefrom.tiemList"
                  :key="item.id"
                  :label="item.title"
                  :value="item.id"
                ></el-option>
              </el-select>
              <el-date-picker
              class="picker"
                v-model="rolefrom.seletTime"
                type="daterange"
                align="right"
                 size="mini"
                unlink-panels
                value-format="timestamp"
                range-separator="至"
                :default-time="['00:00:00', '23:59:59']"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                @change="timeChange"
                :clearable="false"
                :picker-options="pickerOptions"
              ></el-date-picker>
              <el-select v-model="Page.keyword_id" placeholder="请选择" size="mini">
                <el-option
                  v-for="item in rolefrom.keyword_idlist"
                  :key="item.id"
                  :label="item.title"
                  :value="item.id"
                ></el-option>
              </el-select>
              <div class="height"></div>
              <el-input placeholder="请输入内容" v-model="Page.keyword" class="input-with-select" size="mini">
                <el-button slot="append" icon="el-icon-search" @click="onserch" size="mini"></el-button>
              </el-input>
              <el-button type="danger" @click="onaddClass(row)" size="mini">清空</el-button>
              <div class="height"></div>
            </el-col>
          </el-row>
          <el-table border="" :data="tableData" style="width: 100%" stripe  >
            <el-table-column label="门店" prop="title"></el-table-column>
            <el-table-column label="订单号" prop="order_no" width="100"></el-table-column>
            <el-table-column label="订单类型" prop="refund_state"></el-table-column>
            <el-table-column label="下单时间" prop="add_time"></el-table-column>
            <el-table-column label="商品编号" prop="commodity_code"></el-table-column>
            <el-table-column label="商品名称" prop="name"></el-table-column>
            <el-table-column label="商品分类名称" prop="ctitle"></el-table-column>
            <el-table-column label="数量" prop="num"></el-table-column>
            <el-table-column label="单位" prop="unit"></el-table-column>
            <el-table-column label="成本价" prop="supply_price"></el-table-column>
            <el-table-column label="销售价" prop="market_price"></el-table-column>
            <el-table-column label="成交价" prop="price"></el-table-column>
            <el-table-column label="原金额" prop="d_supply_price"></el-table-column>
            <el-table-column label="会员折让" prop="member_coupon_price"></el-table-column>
            <el-table-column label="商品折让" prop="coupon_price"></el-table-column>
            <el-table-column label="成交金额" prop="dprice"></el-table-column>
            <el-table-column label="收银员" prop="manage_name"></el-table-column>
            <el-table-column label="营业日" prop="business_day"></el-table-column>
            <el-table-column label="会员卡号" prop="card_number"></el-table-column>
            <el-table-column label="备注" prop="note"></el-table-column>
          </el-table>
          <div class="height"></div>
          <div class="pagination">
            <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :page-sizes="[ 20, 50, 100]"
              layout="total, sizes, prev, pager, next, jumper"
              :total="Page.count"
            ></el-pagination>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import { selectDate, seletTime, startTime, endTime } from '@/common/selectDate.js'
export default {
  // props:[],
  // 页面加载
  components: {},
  created() {
    this.getweiOrder();
    this.getShops();  
    this.getSorts();
  },
  data() {
    return {
      tableData: [],
      Page: {
        pagenum: 1,
        pagesize: 20,
        count: 0,
        shop_id: "",
        cate_id: "",
        refund_state: "",
        start_time: parseInt(startTime/1000),
        end_time: parseInt(endTime/1000),
        keyword: "",
        keyword_id: "",
        time:""
      },
      rolefrom: {
        shop: [],
        cate: [],
        refund: [
          {
            id: 0,
            title: "销售单"
          },
          {
            id: 1,
            title: "退款单"
          }
        ],
        tiemList: [
          {
            id: 1,
            title: "交易时间"
          },
          {
            id: 2,
            title: "营业时间"
          }
        ],

        seletTime: seletTime,
        keyword_idlist: [
          {
            id: 1,
            title: "商品id"
          },
          {
            id: 2,
            title: "商品名称"
          },
          {
            id: 3,
            title: "商品编号"
          },
          {
            id: 4,
            title: "交班班次"
          }
        ]
      },
      pickerOptions: {
        shortcuts:selectDate
      }
    };
  },
  // 方法
  methods: {
    getweiOrder() {
      const loading = this.$loading({
          lock: true,
          text: 'Loading',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.1)'
        });
        // console.log('this.Page',this.Page);
      this.$api
        .getsellRetails(this.Page)
        .then(res => {
          if (res.data.code == 200) {
            loading.close()
            this.tableData = res.data.list.data;
            this.Page.count = res.data.list.total;
            console.log(res);
            // shop_id
            // console.log(res.data);
            // this.rolefrom.shop = res.data.shop;
            // this.rolefrom.cate = res.data.sort;
          } else {
            this.$message.error(res.data.msg);
          }
        })
        .catch(res => {
          this.$message.error("网络错误");
          console.log(res);
        });
    },
    // 获取店铺列表
    async getShops() {
      const { data: res } = await this.$http.get("mapi/ShareCommon/shop");
      if (res.code !== 200) return this.$message.error(res.msg);
      this.rolefrom.shop = res.shop;
      console.log("getShops", res.shop);
    },
    // 获取商品分类
    async getSorts() {
      const { data: res } = await this.$http.get("mapi/ShareCommon/sort");
      if (res.code !== 200) return this.$message.error(res.msg);
      this.rolefrom.cate = res.sort;
      console.log("getSorts", res.sort);
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
    // 查询时间更改
    timeChange(val) {
      this.Page.start_time =parseInt(this.rolefrom.seletTime[0] / 1000) ;
      this.Page.end_time = parseInt(this.rolefrom.seletTime[1] / 1000);
    },
    onserch() {
      this.getweiOrder();
    },
    onaddClass() {
      this.Page.shop_id = "";
      this.Page.cate_id = "";
      this.Page.refund_state = "";
      this.Page.start_time = "";
      this.Page.end_time = "";
      this.Page.keyword = "";
      this.Page.keyword_id = "";
      this.getweiOrder();
    },
    // 导出表格
    onexittable() {
      this.$api
        .getsellExcel({})
        .then(res => {
          if (res.data.code == 200) {
            require.ensure([], () => {
              const { exportJsonToExcel } = require("@/vendor/Export2Excel");
              const tHeader = [
                "门店",
                "订单号",
                "订单类型",
                "下单时间",
                "商品编号",
                "商品名称",
                "商品分类名",
                "数量",
                "单位",
                "成本价",
                "销售价",
                "成交价",
                "原金额",
                "会员折让",
                "商品折让",
                "成交金额",
                "收银员",
                "营业日",
                "会员卡号",
                "备注"
              ];
              const filterVal = [
                "title",
                "order_no",
                "refund_state",
                "add_time",
                "commodity_code",
                "name",
                "ctitle",
                "num",
                "unit",
                "supply_price",
                "market_price",
                "price",
                "money",
                "member_coupon_price",
                "coupon_price",
                "dprice",
                "manage_name",
                "business_day",
                "card_number",
                "note"
              ];
              if (res.data.list.data.length > 0) {
                const exportData = res.data.list.data;
                const data = this.formatJson(filterVal, exportData);
                exportJsonToExcel(
                  tHeader,
                  data,
                  "商品列表" + this.$moment().format("YYYY/MM/DD HH:mm:ss")
                );
              } else {
                this.$message.error("暂无商品导出");
              }
            });
          } else {
            this.$message.error(res.data.msg);
          }
        })
        .catch(res => {
          this.$message.error("网络错误");
          console.log(res);
        });
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]));
    },
 
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
.el-select{
  width:120px;
  margin-right: 10px;
}
.el-input{
  width:220px;
}
.el-date-editor{
  width: 230px;
  margin-right: 10px;
}
.input-with-select {
  width: 400px;
  margin-right:10px;
}
.el-select {
  margin-right: 10px;
}
.picker,.excel{margin-right:10px;}
</style>