<template>
    <div>
        <el-row>
            <el-col :span="24">
                <el-card shadow="always">
                    <el-row>
                        <el-col :span="24">
                            <el-date-picker
                                :clearable="false"
                                v-model="Page.times"
                                type="datetimerange"
                                :picker-options="pickerOptions"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期"
                            ></el-date-picker>
                            <el-button type="primary" @click="onserch" v-no-click>搜索</el-button>
                            <el-button type="danger" @click="onclear" v-no-click>清除</el-button>
                        </el-col>
                    </el-row>
                    <div class="height"></div>
                    <!-- <el-table border="" :data="tableData" style="width: 100%" stripe>
                        <el-table-column label="订单ID" prop="oid"></el-table-column>
                        <el-table-column label="订单号" prop="order_no"></el-table-column>
                        <el-table-column label="发货方式" prop="receive"></el-table-column>
                        <el-table-column label="发货状态" prop="send"></el-table-column>
                        <el-table-column label="发货店点" prop="shop_name"></el-table-column>
                    </el-table> -->
                         <el-row  class="mb10">
        <el-col :span="4">
          <el-card>
            <h3 class="total">储值金额</h3>
            <p class="totalmoney red">{{data.all_money}}</p>
          </el-card>
        </el-col>
        <el-col :span="4">
          <el-card>
            <h3 class="total">消费金额</h3>
            <p class="totalmoney green">{{data.consume_money}}</p>
          </el-card>
        </el-col>
        <el-col :span="4">
          <el-card>
            <h3 class="total">微信储值</h3>
            <p class="totalmoney blue">{{data.all__wei_money}}</p>
          </el-card>
        </el-col>
        <el-col :span="4">
          <el-card>
            <h3 class="total">支付宝储值</h3>
            <p class="totalmoney orange">{{data.all__zhi_money}}</p>
          </el-card>
        </el-col>
          <el-col :span="4">
          <el-card>
            <h3 class="total">退款</h3>
            <p class="totalmoney orange">{{data.refund_money}}</p>
          </el-card>
        </el-col>
      </el-row>
                </el-card>
            </el-col>
        </el-row>
    </div>
</template>
<script>
export default {
  // props:[],
  created() {
    this.getweiOrder();
  },
  // 页面加载完成
  mounted() {},
  data() {
    return {
      Page: {
        times: "",
        start_time: "",
        end_time: "",
      },
      data:{
          all__wei_money: 0,
all__zhi_money: 0,
all_money: 0,
consume_money: 0,
refund_money: 1,
      },
      pickerOptions: {
        shortcuts: [
          {
            text: "今天",
            onClick(picker) {
              const end =
                new Date(new Date().toLocaleDateString()).getTime() +
                24 * 60 * 60 * 1000 -
                1;
              const start = new Date(new Date().toLocaleDateString()).getTime();
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "昨天",
            onClick(picker) {
              const start =
                new Date(new Date().toLocaleDateString()).getTime() -
                24 * 60 * 60 * 1000;
              const end = start + 24 * 60 * 60 * 1000 - 1;
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "本周",
            onClick(picker) {
              const date = new Date();
              const weekday = date.getDay() || 7;
              const end = new Date().getTime();
              const start = date.setDate(date.getDate() - weekday + 1);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "上周",
            onClick(picker) {
              var now = new Date(); // 当前日期
              var nowDayOfWeek = now.getDay(); // 今天本周的第几天
              var nowDay = now.getDate(); // 当前日
              var nowMonth = now.getMonth(); // 当前月
              var nowYear = now.getYear(); // 当前年
              nowYear += nowYear < 2000 ? 1900 : 0; //
              var start = new Date(
                nowYear,
                nowMonth,
                nowDay - nowDayOfWeek - 6
              ).getTime();
              const end =
                new Date(nowYear, nowMonth, nowDay - nowDayOfWeek).getTime() +
                24 * 60 * 60 * 1000 -
                1;
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "本月",
            onClick(picker) {
              const end = new Date().getTime();
              const start = new Date(
                new Date().getFullYear(),
                new Date().getMonth(),
                1
              ).getTime();
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "上月",
            onClick(picker) {
              var now = new Date(); // 当前日期
              var nowYear = now.getYear(); // 当前年
              nowYear += nowYear < 2000 ? 1900 : 0; //
              var lastMonthDate = new Date(); // 上月日期
              lastMonthDate.setDate(1);
              lastMonthDate.setMonth(lastMonthDate.getMonth() - 1);
              var lastMonth = lastMonthDate.getMonth();
              // 获得某月天数
              var monthStartDate = new Date(nowYear, lastMonth, 1);
              var monthEndDate = new Date(nowYear, lastMonth + 1, 1);
              var days =
                (monthEndDate - monthStartDate) / (1000 * 60 * 60 * 24);
              // ---------------------------------------
              const start = new Date(nowYear, lastMonth, 1).getTime();
              const end =
                new Date(nowYear, lastMonth, days).getTime() +
                24 * 60 * 60 * 1000 -
                1;
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "本季",
            onClick(picker) {
              var now = new Date(); // 当前日期
              var nowYear = now.getYear(); // 当前年
              nowYear += nowYear < 2000 ? 1900 : 0; //
              var m = now.getMonth() + 1;
              const q = parseInt((m + 2) / 3);
              m = q * 3 - 2; // 得到季的首月份
              now.setMonth(m - 1);
              now.setDate(1);
              const start = new Date(nowYear, now.getMonth(), 1).getTime();
              var nextMonthFirstDay = new Date(nowYear, now.getMonth() + 3, 1);
              const end = nextMonthFirstDay.getTime() - 1;
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "上季",
            onClick(picker) {
              var now = new Date(); // 当前日期
              var nowYear = now.getYear(); // 当前年
              nowYear += nowYear < 2000 ? 1900 : 0; //
              var m = now.getMonth() + 1;
              const q = parseInt((m + 2) / 3);
              m = q * 3 - 2; // 得到季的首月份
              now.setMonth(m - 1);
              var start, end, nextMonthFirstDay;
              if (m - 1 > 2) {
                start = new Date(nowYear, now.getMonth() - 3, 1).getTime();
                nextMonthFirstDay = new Date(nowYear, now.getMonth(), 1);
                end = nextMonthFirstDay.getTime() - 1;
              } else {
                start = new Date(nowYear, 10, 1).getTime();
                nextMonthFirstDay = new Date(nowYear, now.getMonth(), 1);
                end = nextMonthFirstDay.getTime() - 1;
              }
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "今年",
            onClick(picker) {
              const end = new Date().getTime();
              const start = new Date(new Date().getFullYear(), 0).getTime();
              picker.$emit("pick", [start, end]);
            }
          }
        ]
      }
    };
  },
  // 方法
  methods: {
    getweiOrder() {
      this.$api
        .getweiCount(this.Page)
        .then(res => {
          if (res.data.code == 200) {
            this.data.all__wei_money=res.data.all__wei_money;
            this.data.all__zhi_money=res.data.all__zhi_money;
            this.data.all_money=res.data.all_money;
            this.data.consume_money=res.data.consume_money;
            this.data.refund_money=res.data.refund_money;
          } else {
            this.$message.error(res.data.msg);
          }
        })
        .catch(res => {
          this.$message.error();
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
    // 点击了搜索
    onserch() {
      if (this.Page.times.length > 0 ) {
        this.Page.start_time = parseInt(this.Page.times[0] / 1000);
        this.Page.end_time = parseInt(this.Page.times[1] / 1000);
      }
      if (this.Page.times.length == 0) {
        this.$message.error("请选择时间段");
        return;
      }
      this.getweiOrder();
    },
    // 点击了清楚搜索
    onclear() {
      this.Page.pagenum = 1;
      this.Page.pagesize = 10;
      this.Page.times = "";
      this.Page.start_time = "";
      this.Page.end_time = "";
      this.getweiOrder();
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
.title_left {
  h1 {
    padding: 10px 0;
  }
  div {
    padding: 10px 0;
    span:nth-child(odd) {
      margin-right: 15px;
    }
  }
}
.title_right {
  h1 {
    padding: 10px 0;
  }
  div {
    padding: 10px 0;
    span:nth-child(odd) {
      margin-right: 15px;
    }
  }
}
.el-select {
  margin-right: 10px;
}
.el-date-editor {
  margin-right: 10px;
}
.input-with-select {
  width: 20%;
  margin-right: 10px;
}
.el-date-editor{
  width: 230px;
}
.el-row {
    display: flex;
    justify-content:space-between;
  .el-col{
     .total{font-size:16px;font-weight:normal;text-align: center;padding-bottom:20px;}
    .totalmoney{font-size:16px;text-align: center;font-weight: bold;}
    .totalmoney.red{color:#ff3800;}
    .totalmoney.green{color:#00ce99;}
    .totalmoney.blue{color:#00c3e9;}
    .totalmoney.orange{color:#f1aa00;}
    .linetitle{
      padding-left:10px;
      font-size:14px;
      border-left:2px solid #13c4c9;
    }
  }
}
.payMethod, .topup{height:300px;width:100%;}
#saleRanks,#topupRanks{height: 300px;width:100%;}
.card-title{margin-bottom:30px;}
</style>