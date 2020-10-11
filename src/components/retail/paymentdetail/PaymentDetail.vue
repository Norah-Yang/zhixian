<template>
    <div>
      <!-- 面包屑导航区域 -->
      <!-- <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>您当前所在位置</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>零售统计</el-breadcrumb-item>
        <el-breadcrumb-item>付款明细</el-breadcrumb-item>
      </el-breadcrumb> -->
      <el-card>
        <el-row class="mb10">
          <el-col :span="24">
             <el-select v-model="queryInfo.shop_id" placeholder="选择门店" size="mini" clearable >
                <el-option
                  v-for="item in shopOptions"
                  :key="item.id"
                  :label="item.title"
                  :value="item.id">
                </el-option>
             </el-select>
             <el-select v-model="queryInfo.refund_state" placeholder="单据类型" size="mini" clearable >
                <el-option label="销售单" :value="0"></el-option>
                <el-option label="退款单" :value="1"></el-option>
             </el-select>
             <el-select v-model="queryInfo.pay_type" placeholder="支付方式" size="mini" clearable >
                <el-option
                  v-for="item in payOptions"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
             </el-select>
             <el-select v-model="queryInfo.time" placeholder="请选择" size="mini" clearable >
                <el-option label="交易时间" :value="1"></el-option>
                <el-option label="营业时间" :value="2"></el-option>
             </el-select>
            <el-date-picker
                v-model="seletTime"
                type="daterange"
                align="right"
                unlink-panels
                value-format="timestamp"
                range-separator="至"
                :default-time="['00:00:00', '23:59:59']"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                @change="timeChange"
                :picker-options="pickerOptions"
                size="mini">
              </el-date-picker>
              <el-select v-model="queryInfo.keyword_id" placeholder="请选择" size="mini" clearable >
                <el-option label="订单号" :value="1"></el-option>
                <el-option label="交班班次" :value="2"></el-option>
             </el-select>
               <el-input placeholder="请输入内容" v-model="queryInfo.keyword" size="mini" clearable >
                <el-button slot="append" @click="onSearch" icon="el-icon-search"></el-button>
              </el-input>
              <el-button type="primary" plain size="mini" class="btn" @click="outputExcel">导出EXCELL</el-button>
          </el-col>
        </el-row>
         <el-table :data="tableData" border style="width: 100%" >
            <el-table-column prop="title" label="门店"></el-table-column>
            <el-table-column prop="order_no" label="订单号" width="150px" ></el-table-column>
            <el-table-column label="单据类型" prop="refund_state">
              <!-- <template slot-scope="scope">
               {{ scope.row.refund_state == 0? '销售单': '退款单'}}
              </template> -->
            </el-table-column>
            <el-table-column prop="name" label="收银员" ></el-table-column>
            <el-table-column prop="add_time" label="下单时间"></el-table-column>
            <el-table-column prop="business_day" label="营业日"></el-table-column>
            <el-table-column prop="hand_over" label="交班班次"  ></el-table-column>
            <el-table-column prop="pay_type" label="付款方式"  ></el-table-column>
            <el-table-column prop="amount" label="付款金额"  ></el-table-column>
            <el-table-column prop="card_number" label="会员卡号"  ></el-table-column>
            <el-table-column prop="sell_money" label="销售金额"  ></el-table-column>
            <el-table-column prop="discount_money" label="优惠金额"  ></el-table-column>
            <el-table-column prop="round_money" label="抹零金额"  ></el-table-column>
            <el-table-column prop="reality_money" label="实销金额"  ></el-table-column>
            <el-table-column prop="note" label="备注"  ></el-table-column>
         </el-table>
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="queryInfo.page"
          :page-sizes="[10, 20, 50, 100,]"
          :page-size="queryInfo.pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
        </el-pagination>
      </el-card>
    </div>
</template>

<script>
import { selectDate, seletTime, startTime, endTime } from '../../../common/selectDate.js'
export default {
  data () {
    return {
      pickerOptions: {
        shortcuts: selectDate
      },
      seletTime: seletTime,
      shopOptions: [], // 门店选项
      payOptions: [], // 支付方式
      queryInfo: {
        // eslint-disable-next-line camelcase
        shop_id: '',
        // eslint-disable-next-line camelcase
        refund_state: '',
        // eslint-disable-next-line camelcase
        pay_type: '',
        time: 1,
        // eslint-disable-next-line camelcase
        start_time: parseInt(startTime/ 1000),
        // eslint-disable-next-line camelcase
        end_time: parseInt(endTime / 1000),
        // eslint-disable-next-line camelcase
        keyword_id: '',
        keyword: '',
        page: 1,
        pagesize: 20
      },
      tableData: [], // 列表数据
      total: 0, // 列表总条数
      excelList: [] // 导出excel的数据
    }
  },
  created () {
    this.getList();
    this.getShops();
  },
  methods: {
    async getList () {
      const loading = this.$loading({
          lock: true,
          text: 'Loading',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.1)'
        });
        console.log('请求参数',this.queryInfo);
      const { data: res } = await this.$http.post('mapi/paymentRetail', this.queryInfo)
      // console.log(res)
      if (res.code !== 200) return this.$message.error(res.msg)
      // this.$message.success('列表查询成功！')
      loading.close()
      // this.shopOptions = res.shop
      this.payOptions = res.pay_type
      this.total = res.list.total
      this.tableData = res.list.data
    },
    // 获取店铺列表
    async getShops() {
      const { data: res } = await this.$http.get("mapi/ShareCommon/shop");
      if (res.code !== 200) return this.$message.error(res.msg);
      this.shopOptions = res.shop;
      console.log("getShops", res.shop);
    },
    // 筛选查询
    onSearch () {
       this.getList()
    },
    // 查询时间更改
    timeChange (val) {
      console.log('val',val[0],val[1], seletTime);
        // eslint-disable-next-line camelcase
        this.queryInfo.start_time = parseInt(val[0] / 1000)
        // eslint-disable-next-line camelcase
        this.queryInfo.end_time = parseInt(val[1] / 1000)
        console.log(this.queryInfo.start_time, this.queryInfo.end_time)
      // this.getEchartsInfo()
    },
    outputExcel () {
      const loading = this.$loading({
        lock: true,
        text: '正在导出，请稍等......',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.1)'
      })
      const _this = this
      this.$http.post('mapi/paymentExcel')
        .then(function (res) {
          _this.excelList = res.data.list
          // console.log('导出数据',res.data.list)
          const exportData = res.data.list
          if (exportData.length > 0) {
            require.ensure([], () => {
              const { exportJsonToExcel } = require('../../../vendor/Export2Excel')
              const tHeader = ['门店', '单号', '单据类型', '收银员', '日期', '营业日', '交班班次', '付款方式', '付款金额', '会员卡号', '销售金额', '优惠金额', '抹零金额', '实销金额', '备注']
              const filterVal = ['title', 'order_no', 'refund_state', 'name', 'add_time', 'business_day', 'hand_over', 'pay_type', 'amount', 'card_number', 'sell_moeny', 'discount_money', 'round_money', 'reality_money', 'note']
              const data = _this.formatJson(filterVal, exportData)
              exportJsonToExcel(tHeader, data, '付款明细' + _this.getNowDate(new Date()))
            })
          } else {
            _this.$message.error('没有符合条件的数据！')
          }
          loading.close()
        })
        .catch(function (error) {
          _this.$message.error(error)
          loading.close()
        })
    },
    // 分页 一页显示多少条
    handleSizeChange (newSize) {
      this.queryInfo.pagesize = newSize
      this.getList()
    },
    // 分页 跳转到多少页
    handleCurrentChange (newPage) {
      this.queryInfo.page = newPage
      this.getList()
    },
    formatJson (filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]))
    },
    getNowDate (date) {
      return date.getFullYear() + '-' + ((date.getMonth() + 1) > 10 ? (date.getMonth() + 1) : '0' + (date.getMonth() + 1)) + '-' + (date.getDate() > 10 ? date.getDate() : '0' + date.getDate())
    }
  }
}
</script>

<style scoped lang="less">
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
.btn{
  margin-left:10px;
}
</style>
