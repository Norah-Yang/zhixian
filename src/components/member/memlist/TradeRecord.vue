<template>
    <div>
      <!-- 面包屑导航区域 -->
      <!-- <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>您当前所在位置</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>会员卡管理</el-breadcrumb-item>
        <el-breadcrumb-item>交易明细</el-breadcrumb-item>
      </el-breadcrumb> -->
      <el-card>
        <el-row class="mb10">
          <el-col :span="24">
             <el-select v-model="queryInfo.shop_id" placeholder="选择门店" @change="this.getCardInfo">
                <el-option
                  v-for="item in shopOptions"
                  :key="item.id"
                  :label="item.title"
                  :value="item.id">
                </el-option>
             </el-select>
             <el-select v-model="queryInfo.cashier_id" placeholder="选择收银员" @change="this.getCardInfo">
                <el-option
                  v-for="item in cashierOptions"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
             </el-select>
             <el-select v-model="queryInfo.type" placeholder="操作类型" @change="this.getCardInfo">
                <el-option
                  v-for="item in TypeOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
             </el-select>
             <el-date-picker
              v-model="seletTime"
              type="daterange"
              align="right"
              unlink-panels
              :default-time="['00:00:00', '23:59:59']"
              value-format="timestamp"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :picker-options="pickerOptions"
              @change="timeChange">
            </el-date-picker>
             <el-select v-model="queryInfo.resource" placeholder="请选择" >
                <el-option
                  v-for="item in resourceOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
             </el-select>
             <el-input placeholder="请输入内容" v-model="queryInfo.keyword">
                <el-button slot="append" @click="onsearch" icon="el-icon-search"></el-button>
              </el-input>
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
      seletTime: seletTime, // 选择的时间段
      queryInfo: {
        // eslint-disable-next-line camelcase
        shop_id: '', // 门店id
        // eslint-disable-next-line camelcase
        cashier_id: '', // 收银员id
        type: '', // 操作类型
        // eslint-disable-next-line camelcase
        start_time: parseInt(startTime/1000),
        // eslint-disable-next-line camelcase
        end_time: parseInt(endTime/1000),
        resource: '' // 来源
      },
      shopOptions: [], // 门店选项
      cashierOptions: [], // 收银员选项
      TypeOptions: [ // 类型选项
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
          label: '交易单号',
          value: 1
        },
        {
          label: '来源单号',
          value: 2
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
    this.getCardInfo()
  },
  methods: {
    async getCardInfo () {
      // eslint-disable-next-line camelcase
      const { data: res } = await this.$http.post('mapi/memberRecordListOne', { card_number: this.cardNum })
      console.log(res)
      this.shopOptions = res.sort.shop
      this.cashierOptions = res.sort.cashier
      this.tableData = res.list.data
      this.total = res.list.total
      this.queryInfo.page = res.list.current_page
      this.queryInfo.pagesize = res.list.per_page
    },
    onsearch () {
      this.getCardInfo()
    },
    timeChange (val) {
      // console.log(this.seletTime === val)
      // eslint-disable-next-line camelcase
      this.queryInfo.start_time = val[0]
      // eslint-disable-next-line camelcase
      this.queryInfo.end_time = val[1]
      this.getCardInfo()
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
    }
  }
}
</script>

<style scoped lang="less">
.el-select{
  width:120px;
  margin-right: 10px;
  margin-bottom:10px;
}
.el-input{
  width:220px;
  margin-bottom:10px;
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
</style>
