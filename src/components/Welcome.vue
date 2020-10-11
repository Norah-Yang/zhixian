<template>
    <div>
      <!-- 面包屑导航区域 -->
      <!-- <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>您当前所在位置</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      </el-breadcrumb> -->
      <el-row class="mb10">
        <el-col :span="24">
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
        </el-col>
      </el-row>
      <el-row :gutter="10" class="mb10">
        <el-col :span="6">
          <el-card>
            <h3 class="total">实销金额</h3>
            <p class="totalmoney red">{{actualMoney}}</p>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card>
            <h3 class="total">订单统计</h3>
            <p class="totalmoney green">{{orderCount}}</p>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card>
            <h3 class="total">会员充值金额</h3>
            <p class="totalmoney blue">{{memberTopup}}</p>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card>
            <h3 class="total">会员消费金额</h3>
            <p class="totalmoney orange">{{memberConsume}}</p>
          </el-card>
        </el-col>
      </el-row>
      <el-row :gutter="10" class="mb10">
        <el-col :span="12">
          <el-card>
            <div class="payMethod" ref="payMethod"></div>
          </el-card>
        </el-col>
        <el-col :span="12">
          <el-card>
            <div class="topup" ref="topup"></div>
          </el-card>
        </el-col>
      </el-row>
      <el-card class="mb10">
         <div id="saleRanks" ref="saleRanks"></div>
      </el-card>
      <el-card class="mb10">
         <div id="topupRanks" ref="topupRanks"></div>
      </el-card>
    </div>
</template>

<script>
import echarts from 'echarts'
export default {
  data () {
    return {
      memberTopup: 0,
      memberConsume: 0,
      orderCount: 0,
      actualMoney: 0,
      pickerOptions: {
        shortcuts: [
          {
            text: '今天',
            onClick (picker) {
              const end = new Date(new Date().toLocaleDateString()).getTime() + 24 * 60 * 60 * 1000 - 1
              const start = new Date(new Date().toLocaleDateString()).getTime()
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '昨天',
            onClick (picker) {
              const start = new Date(new Date().toLocaleDateString()).getTime() - 24 * 60 * 60 * 1000
              const end = start + 24 * 60 * 60 * 1000 - 1
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '本周',
            onClick (picker) {
              const date = new Date()
              const weekday = date.getDay() || 7
              const end = new Date().getTime()
              const start = date.setDate(date.getDate() - weekday + 1)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '上周',
            onClick (picker) {
              var now = new Date()// 当前日期
              var nowDayOfWeek = now.getDay()// 今天本周的第几天
              var nowDay = now.getDate()// 当前日
              var nowMonth = now.getMonth()// 当前月
              var nowYear = now.getYear()// 当前年
              nowYear += (nowYear < 2000) ? 1900 : 0//
              var start = new Date(nowYear, nowMonth, nowDay - nowDayOfWeek - 6).getTime()
              const end = new Date(nowYear, nowMonth, nowDay - nowDayOfWeek).getTime() + 24 * 60 * 60 * 1000 - 1
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '本月',
            onClick (picker) {
              const end = new Date().getTime()
              const start = new Date(new Date().getFullYear(), new Date().getMonth(), 1).getTime()
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '上月',
            onClick (picker) {
              var now = new Date()// 当前日期
              var nowYear = now.getYear()// 当前年
              nowYear += (nowYear < 2000) ? 1900 : 0//
              var lastMonthDate = new Date()// 上月日期
              lastMonthDate.setDate(1)
              lastMonthDate.setMonth(lastMonthDate.getMonth() - 1)
              var lastMonth = lastMonthDate.getMonth()
              // 获得某月天数
              var monthStartDate = new Date(nowYear, lastMonth, 1)
              var monthEndDate = new Date(nowYear, lastMonth + 1, 1)
              var days = (monthEndDate - monthStartDate) / (1000 * 60 * 60 * 24)
              // ---------------------------------------
              const start = new Date(nowYear, lastMonth, 1).getTime()
              const end = new Date(nowYear, lastMonth, days).getTime() + 24 * 60 * 60 * 1000 - 1
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '本季',
            onClick (picker) {
              var now = new Date()// 当前日期
              var nowYear = now.getYear()// 当前年
              nowYear += (nowYear < 2000) ? 1900 : 0//
              var m = now.getMonth() + 1
              const q = parseInt((m + 2) / 3)
              m = q * 3 - 2 // 得到季的首月份
              now.setMonth(m - 1)
              now.setDate(1)
              const start = new Date(nowYear, now.getMonth(), 1).getTime()
              var nextMonthFirstDay = new Date(nowYear, now.getMonth() + 3, 1)
              const end = nextMonthFirstDay.getTime() - 1
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '上季',
            onClick (picker) {
              var now = new Date()// 当前日期
              var nowYear = now.getYear()// 当前年
              nowYear += (nowYear < 2000) ? 1900 : 0//
              var m = now.getMonth() + 1
              const q = parseInt((m + 2) / 3)
              m = q * 3 - 2 // 得到季的首月份
              now.setMonth(m - 1)
              var start, end, nextMonthFirstDay
              if (m - 1 > 2) {
                start = new Date(nowYear, now.getMonth() - 3, 1).getTime()
                nextMonthFirstDay = new Date(nowYear, now.getMonth(), 1)
                end = nextMonthFirstDay.getTime() - 1
              } else {
                start = new Date(nowYear, 10, 1).getTime()
                nextMonthFirstDay = new Date(nowYear, now.getMonth(), 1)
                end = nextMonthFirstDay.getTime() - 1
              }
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '今年',
            onClick (picker) {
              const end = new Date().getTime()
              const start = new Date(new Date().getFullYear(), 0).getTime()
              picker.$emit('pick', [start, end])
            }
          }
        ]
      },
      seletTime: [new Date(new Date().toLocaleDateString()).getTime(), new Date(new Date().toLocaleDateString()).getTime() + 24 * 60 * 60 * 1000 - 1], // 选择的时间数组
      // eslint-disable-next-line camelcase
      start_time: new Date(new Date().toLocaleDateString()).getTime(),
      // eslint-disable-next-line camelcase
      end_time: new Date(new Date().toLocaleDateString()).getTime() + 24 * 60 * 60 * 1000 - 1,
      topupRanks: null,
      saleRanks: null,
      payMethod: null,
      topup: null,
      payMethodData1: [],
      payMethodData2: [],
      topupMethodData1: [],
      topupMethodData2: [],
      shopSaleData1: [],
      shopSaleData2: [],
      shopTopupData1: [],
      shopTopupData2: []
    }
  },
  mounted () {
    console.log(this.start_time, this.end_time)
    this.getEchartsInfo()
  },
  methods: {
    async getEchartsInfo () {
      // eslint-disable-next-line camelcase
      const { data: res } = await this.$http.post('mapi/index/down', { start_time: parseInt(this.start_time / 1000), end_time: parseInt(this.end_time / 1000) })
      console.log(res)
      if (res.code !== 200) return this.$message.error(res.msg)
      // this.$message.success(res.msg)
      this.memberTopup = res.one.member_top_up
      this.memberConsume = res.one.member_consume
      this.orderCount = res.one.order_count
      this.actualMoney = res.one.order_amount

      const that = this
      if (res.two.pay_type) {
        res.two.pay_type.forEach(item => {
          that.payMethodData2.push(
            Object.assign(item, { itemStyle: { normal: { color: that.getRandomColor() } } })
          )
          that.payMethodData1.push(item.name)
        })
      }
      if (res.two.to_up_type) {
        res.two.pay_type.forEach(item => {
          that.topupMethodData2.push(
            Object.assign(item, { itemStyle: { normal: { color: that.getRandomColor() } } })
          )
          that.topupMethodData1.push(item.name)
        })
      }
      if (res.three.shop_money) {
        res.three.shop_money.forEach(item => {
          that.shopSaleData1.push(item.name)
          that.shopSaleData2.push(item.money)
        })
      }
      if (res.four.shop_top_up) {
        res.four.shop_top_up.forEach(item => {
          that.shopTopupData1.push(item.name)
          that.shopTopupData2.push(item.money)
        })
      }
      this.drawLine()
      console.log(this.getRandomColor())
    },
    // 查询时间更改
    timeChange (val) {
      // console.log(val)
      // console.log(this.seletTime)
      // eslint-disable-next-line camelcase
      this.start_time = this.seletTime[0]
      // eslint-disable-next-line camelcase
      this.end_time = this.seletTime[1]
      // console.log(this.queryInfo)
      console.log(this.start_time, this.end_time)
      this.getEchartsInfo()
    },
    drawLine () {
      const that = this
      var saleRanks = this.$refs.saleRanks
      var payMethod = this.$refs.payMethod
      var topup = this.$refs.topup
      var topupRanks = this.$refs.topupRanks
      if (saleRanks) {
        this.saleRanks = echarts.init(saleRanks)
        this.saleRanks.setOption({
          title: {
            text: '门店销售排行',
            left: 'center'
          },
          tooltip: {},
          xAxis: {
            type: 'category',
            data: that.shopSaleData1
          },
          yAxis: {
            type: 'value'
          },
          series: [{
            data: that.shopSaleData2,
            type: 'line',
            lineStyle: {
              color: '#00c3e9'
            },
            symbol: 'circle', // 折线点设置为实心点
            symbolSize: 15, // 折线点的大小
            itemStyle: {
              normal: {
                color: '#00c3e9', // 折线点的颜色
                lineStyle: {
                  color: '#00c3e9' // 折线的颜色
                }
              }
            }
          }]
        })
      }
      if (topupRanks) {
        this.topupRanks = echarts.init(topupRanks)
        this.topupRanks.setOption({
          title: {
            text: '门店充值排行',
            left: 'center'
          },
          tooltip: {},
          xAxis: {
            type: 'category',
            data: that.shopTopupData1
          },
          yAxis: {
            type: 'value'
          },
          series: [{
            data: that.shopTopupData2,
            type: 'line',
            lineStyle: {
              color: '#F29700'
            },
            symbol: 'circle', // 折线点设置为实心点
            symbolSize: 15, // 折线点的大小
            itemStyle: {
              normal: {
                color: '#F29700', // 折线点的颜色
                lineStyle: {
                  color: '#F29700' // 折线的颜色
                }
              }
            }
          }]
        })
      }
      if (payMethod) {
        this.payMethod = echarts.init(payMethod)
        this.payMethod.setOption({
          title: {
            text: '支付类型',
            left: 'center'
          },
          tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b} : {c} ({d}%)'
          },
          legend: {
            orient: 'vertical',
            left: 'left',
            data: that.payMethodData1
          },
          series: [
            {
              name: '支付类型',
              type: 'pie',
              radius: '55%',
              center: ['50%', '60%'],
              data: that.payMethodData2,
              emphasis: {
                itemStyle: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: 'rgba(0, 0, 0, 0.5)'
                }

              }
            }
          ]
        }
        )
      }
      if (topup) {
        this.topup = echarts.init(topup)
        this.topup.setOption({
          title: {
            text: '充值类型',
            left: 'center'
          },
          tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b} : {c} ({d}%)'
          },
          legend: {
            orient: 'vertical',
            left: 'left',
            data: that.topupMethodData1
          },
          series: [
            {
              name: '充值类型',
              type: 'pie',
              radius: '55%',
              center: ['50%', '60%'],
              data: that.topupMethodData2,
              emphasis: {
                itemStyle: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
              }
            }
          ]
        }
        )
      }
    },
    // 获取随机颜色
    getRandomColor () {
      return '#' + (Math.random() * 0xffffff << 0).toString(16)
    }
  }
}
</script>

<style scoped lang="less">
.el-date-editor{
  width: 230px;
}
.el-row {
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
