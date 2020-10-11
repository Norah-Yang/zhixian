<template>
  <div>
    <el-row>
      <el-col :span="24">
        <!-- <el-date-picker
          :clearable="false"
          v-model="Page.times"
          type="daterange"
          :picker-options="pickerOptions"
          value-format="timestamp"
          size="mini"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker> -->
        <el-date-picker
              v-model="seletTime"
              type="daterange"
              align="right"
              unlink-panels
              size="mini"
              :default-time="['00:00:00', '23:59:59']"
              value-format="timestamp"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :picker-options="pickerOptions"
              clearable
              @change="timeChange">
            </el-date-picker>
        <el-select v-model="Page.shop_id" placeholder="选择门店" size="mini" clearable>
          <el-option v-for="item in shops" :key="item.id" :label="item.title" :value="item.id"></el-option>
        </el-select>
        <el-select v-model="Page.manage_user_id" placeholder="选择收银员" size="mini" clearable>
          <el-option
            v-for="(item,index) in employee"
            :key="index"
            :label="item.name"
            :value="item.id"
          ></el-option>
        </el-select>
        <el-button type="primary" @click="onserch" v-no-click size="mini" class="search_btn">搜索</el-button>
        <!-- <el-button> -->

      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <el-card shadow="always">
          <el-table border :data="tableData" style="width: 100%" stripe show-summary :summary-method="getSummaries">
            <!-- <el-table-column type="selection" width="55"></el-table-column>  show-summary :summary-method="getSummaries"-->
            <el-table-column prop="title" label="店铺名称"></el-table-column>
            <el-table-column prop="name" label="员工名称"></el-table-column>
            <el-table-column prop="top_up_money" label="充值金额"></el-table-column>
            <el-table-column prop="consume_money" label="消费金额"></el-table-column>
            <el-table-column prop="on_account" label="挂账"></el-table-column>
            <el-table-column prop="wei" label="微信"></el-table-column>
            <el-table-column prop="xian" label="现金"></el-table-column>
            <el-table-column prop="zhi" label="支付宝"></el-table-column>
            <el-table-column prop="refund" label="退款充值"></el-table-column>
          </el-table>
          <!-- <div class="height"></div>-->
          <div class="pagination">
            <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :page-sizes="[20, 50, 100]"
              layout="total, sizes, prev, pager, next, jumper"
              :total="total"
            ></el-pagination>
          </div> 
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import { memberBalanceRecord, orderList } from "@/common/select.js";
import { selectDate, seletTime, startTime, endTime } from '@/common/selectDate.js'
export default {
  // props:[],
  // 页面加载
  created() {
    this.getCashier()
    this.getShops()
    this.getToatal();

  },
  data() {
    return {
      tableData: [],
      orderList,
      Page: {
        page: 1, // 第几页
        pagesize: 20, // 一页显示多少条
        shop_id: '', // 门店id
        manage_user_id: '', // 收银员id
        start_time: parseInt(startTime/ 1000), // 开始时间
        end_time:  parseInt(endTime/1000), // 结束时间
      },
      total:0,
      seletTime:seletTime,
      shops: [],
      employee: [],
      sum_top:'',
      sum_consume:'',
      sum_account:'',
      sum_wei:'',
      sum_zhi:'',
      sum_refund:'',
      sum_xian:'',
      pickerOptions: {
        shortcuts: selectDate
      }
    };
  },
  // 方法
  methods: {
    async getToatal() {
      const loading = this.$loading({
          lock: true,
          text: 'Loading',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.1)'
        }); 
        console.log(this.Page);
        const { data: res } = await this.$http.post('/mapi/downCollectCount', this.Page)
        console.log('结果',res);
        if (res.code !== 200) return this.$message.error(res.msg)
        loading.close()
        this.tableData = res.money.data;
        this.total = res.money.total
    },
    // 获取收银员
    async getCashier(){
      const { data: res } = await this.$http.get('mapi/ShareCommon/cashier')
      // console.log(res);
       if (res.code !== 200) return this.$message.error(res.msg)
       this.employee = res.cashier
       console.log('getCashier',res.list);
    },
    // 获取店铺列表
    async getShops(){
      const { data: res } = await this.$http.get('mapi/ShareCommon/shop')
      
       if (res.code !== 200) return this.$message.error(res.msg)
       this.shops = res.shop
       console.log('getShops',res.shop);
    },
    // 点击搜索
    onserch() {
      this.getToatal();
    },
    // 分页
    handleCurrentChange(e) {
      this.Page.page = e;
      this.getToatal();
    },
    // 分页
    handleSizeChange(e) {
      this.Page.pagesize = e;
      this.getToatal();
    },
    timeChange (val) {
        // eslint-disable-next-line camelcase
        this.Page.start_time = parseInt(this.seletTime[0] / 1000)
        // eslint-disable-next-line camelcase
        this.Page.end_time = parseInt(this.seletTime[1] / 1000)
        // this.getCardInfo()
    },
    // 总计
    getSummaries (param) {
      console.log(param)
      const { columns, data } = param
      const sums = []
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '总计'
          // eslint-disable-next-line no-useless-return
          return
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
            sums[index] += ' 元';
          } else {
            sums[index] = 'N/A';
          }
        });
        return sums
    }
  }
}
</script>

<style lang="less" scoped>
.search_btn{margin-left:10px;}
</style>