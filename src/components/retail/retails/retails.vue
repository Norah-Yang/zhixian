<template>
  <div>
    <el-row>
      <el-col :span="24">
        <el-card shadow="always">
          <el-row>
            <el-col>
              <el-button type="primary" @click="onexittable" size="mini">导出表格</el-button>
              <el-select v-model="Page.shop_id" placeholder="请选择门店" size="mini">
                <el-option
                  v-for="item in rolefrom.shopList"
                  :key="item.id"
                  :label="item.title"
                  :value="item.id"
                ></el-option>
              </el-select>
              <el-select v-model="Page.manage_user_id" placeholder="请选择收银员" size="mini">
                <el-option
                  v-for="item in rolefrom.cashierList"
                  :key="item.id"
                  :label="item.name"
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
                v-model="rolefrom.seletTime"
                type="daterange"
                align="right"
                unlink-panels
                 size="mini"
                value-format="timestamp"
                range-separator="至"
                :default-time="['00:00:00', '23:59:59']"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                @change="timeChange"
                :clearable="false"
                :picker-options="pickerOptions"
              ></el-date-picker>
              <el-input placeholder="请输入内容" v-model="Page.keyword" class="input-with-select" size="mini">
                <el-button slot="append" icon="el-icon-search" @click="onserch"></el-button>
              </el-input>
              <el-button type="danger" @click="onaddClass(row)" size="mini">清空</el-button>
              <div class="height"></div>
            </el-col>
          </el-row>
          <el-table
            border=""
            :data="tableData"
            style="width: 100%"
            stripe
            show-summary
            :summary-method="getSummaries"
          >
            <el-table-column label="门店" prop="title"></el-table-column>
            <el-table-column label="收银机编号" prop="name"></el-table-column>
            <el-table-column label="客单数" prop="ke_dan_shu" sortable></el-table-column>
            <el-table-column label="客单价" prop="ke_dan_jia" sortable></el-table-column>
            <el-table-column label="退款金额" prop="refund_money"></el-table-column>
            <el-table-column label="抹零金额" prop="round_money"></el-table-column>
            <el-table-column label="优惠券优惠" prop="coupon_money"></el-table-column>
            <el-table-column label="实销金额" prop="sell_money" sortable></el-table-column>
            <el-table-column label="成本金额" prop="cost_money"></el-table-column>
            <el-table-column label="毛利" prop="mao_li" sortable></el-table-column>
            <el-table-column label="毛利率" prop="mao_li_lv" sortable></el-table-column>
            <el-table-column label="挂账" prop="on_account"></el-table-column>
            <el-table-column label="微信支付" prop="we_chat"></el-table-column>
            <el-table-column label="支付宝支付" prop="alipay"></el-table-column>
          </el-table>
          <div class="height"></div>
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
    this.getCashier();
  },
  // 页面加载完成
  mounted() {},
  data() {
    return {
      tableData: [],
      Page: {
        shop_id: "",
        start_time: parseInt(startTime/1000),
        end_time: parseInt(endTime / 1000),
        keyword: "",
        time: "",
        manage_user_id: ""
      },
      rolefrom: {
        shopList: [],

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
        cashierList: []
      },
      pickerOptions: {
        shortcuts: selectDate
      },
      cashierOptions:[],
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
       console.log('this.Page',this.Page);
      this.$api
        .getmachineRetail(this.Page)
        .then(res => {
          if (res.data.code == 200) {
            loading.close()
            this.tableData = res.data.list;
            // this.rolefrom.shop = res.data.shop;
            // this.rolefrom.cashier = res.data.cashier;
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
      this.rolefrom.shopList = res.shop;
      console.log("getShops", res.shop);
    },
    // 获取收银员
    async getCashier() {
      const { data: res } = await this.$http.get("mapi/ShareCommon/cashier");
      if (res.code !== 200) return this.$message.error(res.msg);
      this.rolefrom.cashierList = res.cashier;
      console.log("getCashier", this.rolefrom.cashierList);
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
      this.Page.start_time = parseInt(val[0] / 1000);
      this.Page.end_time = parseInt(val[1] / 1000);
    },
    onserch() {
      this.getweiOrder();
    },
    onaddClass() {
      this.Page.shop_id = "";
      this.Page.start_time = "";
      this.Page.end_time = "";
      this.Page.keyword = "";
      this.getweiOrder();
    },
    // 导出表格
    onexittable() {
      this.$api
        .getmachineExcel({})
        .then(res => {
          if (res.data.code == 200) {
            require.ensure([], () => {
              const { exportJsonToExcel } = require("@/vendor/Export2Excel");
              const tHeader = [
                "门店",
                "收银机编号",
                "客单数",
                "客单价",
                "退款金额",
                "抹零金额",
                "优惠券优惠",
                "实销金额",
                "成本金额",
                "毛利",
                "毛利率",
                "挂账",
                "微信支付",
                "支付宝支付"
              ];
              const filterVal = [
                "title",
                "name",
                  "ke_dan_shu",
                "ke_dan_jia",
                "refund_money",
                "round_money",
                "coupon_money",
                "sell_money",
                "cost_money",
                "mao_li",
                "mao_li_lv",
                "on_account",
                "we_chat",
                "alipay"
              ];
              if (res.data.list.length > 0) {
                const exportData = res.data.list;
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
    // 总计
    getSummaries(param) {
      // console.log(param)
      // const { columns } = param
      // const sums = []
      // columns.forEach((column, index) => {
      //   if (index === 0) {
      //     sums[index] = '总计'
      //     // eslint-disable-next-line no-useless-return
      //     return
      //   }
      //   if (index === 2) {
      //     sums[index] = this.sum_top + '元'
      //     // eslint-disable-next-line no-useless-return
      //     return
      //   }
      //   if (index === 3) {
      //     sums[index] = this.sum_consume + '元'
      //     // eslint-disable-next-line no-useless-return
      //     return
      //   }
      //   if (index === 4) {
      //     sums[index] = this.sum_account + '元'
      //     // eslint-disable-next-line no-useless-return
      //     return
      //   }
      //   if (index === 5) {
      //     sums[index] = this.sum_wei + '元'
      //     // eslint-disable-next-line no-useless-return
      //     return
      //   }
      //   if (index === 6) {
      //     sums[index] = this.sum_zhi + '元'
      //     // eslint-disable-next-line no-useless-return
      //     return
      //   }
      //   if (index === 7) {
      //     sums[index] = this.sum_refund + '元'
      //     // eslint-disable-next-line no-useless-return
      //     return
      //   }
      //   if (index === 8) {
      //     sums[index] = this.sum_xian + '元'
      //     // eslint-disable-next-line no-useless-return
      //     return
      //   }
      // })

      // return sums
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = "总价";
          return;
        }
        if (index === 1) {
          sums[index] = "";
          return;
        }
        const values = data.map(item => Number(item[column.property]));
        if (!values.every(value => isNaN(value))) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr);
            if (!isNaN(value)) {
              return prev + curr;
            } else {
              return prev;
            }
          }, 0);
          sums[index] += " 元";
        } else {
          sums[index] = "N/A";
        }
      });

      return sums;
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
  width: 250px;
  margin: 0 10px;
}
.el-select {
  margin: 0 10px;
}
</style>