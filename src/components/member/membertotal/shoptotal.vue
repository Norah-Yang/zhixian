<template>
  <div>
    <el-row>
      <el-col :span="24">
        <el-date-picker
          :clearable="false"
          v-model="seletTime"
          type="daterange"
          size="mini"
          :picker-options="pickerOptions"
          value-format="timestamp"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
        <el-select v-model="Page.shop_id" placeholder="选择门店" size="mini" clearable >
          <el-option v-for="item in shops" :key="item.id" :label="item.title" :value="item.id"></el-option>
        </el-select>
        <el-button type="primary" @click="onserch" v-no-click size="mini" class="search_btn">搜索</el-button>
        <!-- <el-button v-no-click @click="onRemove">清除</el-button> -->
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <el-card shadow="always">
          <el-table border :data="tableData" style="width: 100%" stripe show-summary :summary-method="getSummaries">
            <!-- <el-table-column type="selection" width="55"></el-table-column> -->
            <el-table-column prop="title" label="店铺名称"></el-table-column>
            <!-- <el-table-column prop="name" label="员工名称"></el-table-column> -->
            <el-table-column prop="top_up_money" label="充值金额"></el-table-column>
            <el-table-column prop="consume_money" label="消费金额"></el-table-column>
            <el-table-column prop="on_account" label="挂账"></el-table-column>
            <el-table-column prop="wei" label="微信"></el-table-column>
            <el-table-column prop="xian" label="现金"></el-table-column>
            <el-table-column prop="wei" label="支付宝"></el-table-column>
            <el-table-column prop="refund" label="退款充值"></el-table-column>
<!-- wei -->
          </el-table>
          <!-- <div class="height"></div>
          <div class="pagination">
            <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :page-sizes="[7, 12, 15, 20]"
              layout="total, sizes, prev, pager, next, jumper"
              :total="Page.count"
            ></el-pagination>
          </div> -->
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
  components: {},
  created() {
    this.getShops()
    this.getStore();
  },
  // 页面加载完成
  mounted() {},
  data() {
    return {
      tableData: [],
      orderList,
      seletTime: seletTime,
      Page: {
        start_time: parseInt(startTime/1000),
        end_time: parseInt(endTime/1000),
        shop_id: ''
      },
      shops: [],
      pickerOptions: {
        shortcuts:selectDate
      }
    };
  },
  // 方法
  methods: { ///mapi/downShopCount
    async getStore() {//async 
    const loading = this.$loading({
          lock: true,
          text: 'Loading',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.1)'
        }); 
        console.log('参数', this.Page.shop_id);
      const { data: res } = await this.$http.post('mapi/downShopCount', this.Page) 
      // console.log('mapi/downShopCount',res);
      loading.close()
      if(res.code !== 200) return this.$message.error(res.msg)
      this.tableData = res.money
      
    },
    // 点击搜索
    onserch() {
      this.getStore();
    },
    // 获取店铺列表
    async getShops(){
      const { data: res } = await this.$http.get('mapi/ShareCommon/shop')
       if (res.code !== 200) return this.$message.error(res.msg)
       this.shops = res.shop
      //  console.log('getShops',res.shop);
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
.search_btn{margin-left:10px;}
</style>