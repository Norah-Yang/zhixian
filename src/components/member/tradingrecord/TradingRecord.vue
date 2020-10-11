<template>
    <div>
      <!-- 面包屑导航区域 -->
      <!-- <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>您当前所在位置</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>会员卡管理</el-breadcrumb-item>
        <el-breadcrumb-item>交易记录</el-breadcrumb-item>
      </el-breadcrumb> -->
      <el-card>
        <div class="total_box mb10">
           <p>· 会员充值金额: {{statistics.AllTopUp}} ( 优惠:{{statistics.AllDiscounts}} 实收:{{statistics.AllOfficialReceipts}} )</p>
           <p>· 会员消费金额:{{statistics.AllConsume}}</p>
        </div>
        <el-row class="mb10">
          <el-col :span="24">
             <el-select v-model="queryInfo.shop_id" placeholder="选择门店" @change="this.getCardInfo" clearable size="mini">
                <el-option
                  v-for="item in shopOptions"
                  :key="item.id"
                  :label="item.title"
                  :value="item.id">
                </el-option>
             </el-select>
             <el-select v-model="queryInfo.cashier_id" placeholder="选择收银员" @change="this.getCardInfo" clearable size="mini">
                <el-option
                  v-for="item in cashierOptions"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
             </el-select>
             <el-select v-model="queryInfo.type" placeholder="选择卡类型" @change="this.getCardInfo" clearable size="mini">
                <el-option
                  v-for="item in TypeOptions"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
             </el-select>
             <el-select v-model="queryInfo.note" placeholder="操作类型" @change="this.getCardInfo" clearable size="mini">
                <el-option
                  v-for="item in operationOptions"
                  :key="item.label"
                  :label="item.label"
                  :value="item.label"
                  :disabled="item.disabled">
                </el-option>
             </el-select>
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
             <el-select v-model="queryInfo.id" placeholder="请选择" clearable size="mini">
                <el-option
                  v-for="item in resourceOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
             </el-select>
             <el-input placeholder="请输入内容" v-model="queryInfo.keyword" clearable size="mini">
                <el-button slot="append" @click="onsearch" icon="el-icon-search"></el-button>
              </el-input>
              <el-button type="primary" @click="excelExport" size="mini">导出EXCEL</el-button>
          </el-col>
        </el-row>
        <el-table :data="tableData" height="580" border  style="width: 100%">
            <el-table-column prop="id" label="交易单号"></el-table-column>
            <el-table-column prop="card_number" label="会员卡号" ></el-table-column>
            <el-table-column prop="phone" label="会员手机号" width="100"></el-table-column>
            <el-table-column prop="title" label="门店" width="100"></el-table-column>
            <el-table-column prop="cashier" label="收银员" width="100"></el-table-column>
            <el-table-column prop="order_no" label="来源单号" width="100"></el-table-column>
            <el-table-column label="交易类型" width="100">
              <template slot-scope="scope">
                {{scope.row.type == 1? '充值订单': '消费订单'}}
              </template>
            </el-table-column>
            <el-table-column prop="note" label="交易说明" width="100"></el-table-column>
            <el-table-column prop="intro" label="补充说明" ></el-table-column>
            <el-table-column prop="front_money" label="交易前金额"></el-table-column>
            <el-table-column prop="money" label="交易实收金额"></el-table-column>
            <el-table-column prop="rear_money" label="交易后金额"></el-table-column>
            <el-table-column prop="pay_type" label="付款方式"></el-table-column>
            <el-table-column prop="OAddTime" label="交易时间" width="120"></el-table-column>
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
import { selectDate, seletTime, startTime, endTime } from '@/common/selectDate.js'
export default {
  data () {
    return {
      statistics: {
        AllRemainingSum: 0, // 会员卡余额
        AllConsume: 0, // 会员消费金额
        AllOfficialReceipts: 0, // 实收金额
        AllDiscounts: 0, // 优惠
        AllTopUp: 0 // 会员充值金额
      },
      seletTime: seletTime, // 选择的时间段
      queryInfo: {
        // eslint-disable-next-line camelcase
        shop_id: '', // 门店id
        // eslint-disable-next-line camelcase
        cashier_id: '', // 收银员id
        type: '', // 卡类型
        // eslint-disable-next-line camelcase
        start_time: parseInt(startTime/1000),
        // eslint-disable-next-line camelcase
        end_time: parseInt(endTime /1000),
        note: '', // 操作类型
        id: '', // 查询条件
        keyword: ''
      },
      shopOptions: [], // 门店选项
      cashierOptions: [], // 收银员选项
      operationOptions: [
        {
          label: '充值',
          value: '充值',
          disabled: true
        },
        {
          label: '所有充值',
          value: 1,
          disabled: false
        },
        {
          label: '收银机充值',
          value: 2,
          disabled: false
        },
        {
          label: '微商城充值',
          value: 3,
          disabled: false
        },
        {
          label: '收银机退款充值',
          value: 4,
          disabled: false
        },
        {
          label: '微商城退款充值',
          value: 5,
          disabled: false
        },
        {
          label: '管理员后台充值',
          value: 6,
          disabled: false
        },
        {
          label: '消费',
          value: '消费',
          disabled: true
        },
        {
          label: '所有消费',
          value: 7,
          disabled: false
        },
        {
          label: '收银机消费',
          value: 8,
          disabled: false
        },
        {
          label: '微商城消费',
          value: 9,
          disabled: false
        },
        {
          label: '挂账收款消费',
          value: 10,
          disabled: false
        }
      ],
      TypeOptions: [ // 卡类型选项
        {
          label: '充值',
          value: 1
        },
        {
          label: '消费',
          value: 2
        }
      ],
      resourceOptions: [
        {
          label: '会员卡号',
          value: 1
        },
        {
          label: '会员手机',
          value: 2
        },
        {
          label: '交易单号',
          value: 3
        },
        {
          label: '来源单号',
          value: 4
        }
      ],
      pickerOptions: {
        shortcuts: selectDate
      },
      cardNum: '', // 会员卡号
      tableData: [], // 交易记录数据
      total: 0
    }
  },
  created () {
    this.cardNum = this.$route.params.tradeCardNum || sessionStorage.getItem('tradeCardNum')
    if(this.cardNum){
      this.queryInfo.id = 1
      this.queryInfo.keyword = this.cardNum
    }
    this.getCardInfo()
  },
  methods: {
    async getCardInfo () {
      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.1)'
      })
      // eslint-disable-next-line camelcase
      const { data: res } = await this.$http.post('mapi/memberRecordListAll', this.queryInfo)
      // console.log(res)
      this.statistics = res.all
      this.shopOptions = res.sort.shop
      this.cashierOptions = res.sort.cashier
      this.TypeOptions = res.sort.type
      this.tableData = res.list.data
      this.total = res.list.total
      this.queryInfo.page = res.list.current_page
      this.queryInfo.pagesize = res.list.per_page
      loading.close()
    },
    onsearch () {
      this.getCardInfo()
    },
    timeChange (val) {
      // console.log(this.seletTime === val)
 
        // eslint-disable-next-line camelcase
        this.queryInfo.start_time = parseInt(this.seletTime[0] / 1000)
        // eslint-disable-next-line camelcase
        this.queryInfo.end_time = parseInt(this.seletTime[1] / 1000)
        // this.getCardInfo()
    },
    // 分页 一页显示多少条
    handleSizeChange (newSize) {
      this.queryInfo = {
        // eslint-disable-next-line camelcase
        shop_id: '', // 门店id
        // eslint-disable-next-line camelcase
        cashier_id: '', // 收银员id
        type: '', // 操作类型
        // eslint-disable-next-line camelcase
        start_time: '',
        // eslint-disable-next-line camelcase
        end_time: '',
        resource: '', // 来源
        page: this.queryInfo.page,
        pagesize: newSize
      }
      this.getCardInfo()
    },
    // 分页 跳转到多少页
    handleCurrentChange (newPage) {
      this.queryInfo = {
        // eslint-disable-next-line camelcase
        shop_id: '', // 门店id
        // eslint-disable-next-line camelcase
        cashier_id: '', // 收银员id
        type: '', // 操作类型
        // eslint-disable-next-line camelcase
        start_time: '',
        // eslint-disable-next-line camelcase
        end_time: '',
        resource: '', // 来源,
        page: newPage,
        pagesize: this.queryInfo.pagesize
      }
      this.getCardInfo()
    },
    excelExport () {
      this.$confirm('每次最多导出1万条数据，多余1万条数据导出请联系技术人员协助', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const loading = this.$loading({
          lock: true,
          text: '正在导出，请稍等......',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        })
        const _this = this
        this.$http.post('mapi/recordExcel', this.queryInfo)
          .then(function (res) {
          // console.log(res.data.list)
            _this.exportList = res.data.list
            const exportData = res.data.list
            if (exportData.length > 0) {
              require.ensure([], () => {
                const { exportJsonToExcel } = require('../../../vendor/Export2Excel.js')
                const tHeader = ['交易单号', '会员卡号', '会员手机号', '门店', '收银员', '来源单号', '交易类型', '交易说明', '补充说明', '交易前金额', '交易应收金额', '交易后金额', '付款类型', '交易时间']
                const filterVal = ['id', 'card_number', 'phone', 'title', 'manage_user_id', 'order_no', 'type', 'note', 'intro', 'front_money', 'money', 'rear_money', 'pay_type', 'OAddTime']
                const data = _this.formatJson(filterVal, exportData)
                exportJsonToExcel(tHeader, data, '会员卡交易记录' + _this.getNowDate(new Date()))
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
      }).catch(() => {
        // this.$message.error('取消删除！')
      })
    },
    getNowDate (date) {
      return date.getFullYear() + ((date.getMonth() + 1) >= 10 ? (date.getMonth() + 1) : '0' + (date.getMonth() + 1)) + (date.getDate() >= 10 ? date.getDate() : '0' + date.getDate())
    },
    formatJson (filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]))
    }
  },
  destroyed() {
    sessionStorage.removeItem('tradeCardNum')
  },
}
</script>

<style scoped lang="less">
.total_box{
  padding:20px 10px;
  border:1px dashed #e5e5e5;
  border-radius: 10px;
  p {
    line-height: 30px;
    font-size:14px;
    color:#666;
  }
}
.el-select{
  width:120px;
  margin-right: 10px;
  margin-bottom:10px;
}
.el-input{
  width:220px;
  margin-bottom:10px;
  margin-right:10px;
}
.el-date-editor{
  width: 230px;
  margin-right: 10px;
  margin-bottom:10px;
}
.el-pagination{
  text-align: right;
  margin-top:20px;
}
.el-loading-spinner{
  font-size: 30px;
}
</style>
