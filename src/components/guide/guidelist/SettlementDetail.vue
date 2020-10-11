<template>
    <div>
       <!-- 面包屑导航区域 -->
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>您当前所在位置</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/guides' }">导购管理</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/guides' }">导购员管理</el-breadcrumb-item>
        <el-breadcrumb-item>结算明细</el-breadcrumb-item>
      </el-breadcrumb>
      <el-card>
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
         <el-table :data="tableData" height="610" border  style="width: 100%">
           <el-table-column prop="oid" label="编号"></el-table-column>
           <el-table-column prop="number" label="导购员编号"></el-table-column>
           <el-table-column prop="nName" label="导购员姓名"></el-table-column>
           <el-table-column prop="money" label="结算金额"></el-table-column>
           <el-table-column prop="add_time" label="结算时间"></el-table-column>
           <el-table-column prop="admin" label="结算人"></el-table-column>
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
export default {
  data () {
    return {
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

      queryInfo: {
        // eslint-disable-next-line camelcase
        start_time: parseInt((new Date(new Date().toLocaleDateString()).getTime()) / 1000),
        // eslint-disable-next-line camelcase
        end_time: parseInt((new Date(new Date().toLocaleDateString()).getTime() + 24 * 60 * 60 * 1000 - 1) / 1000),
        id: '',
        page: 1,
        pagesize: 10
      },
      tableData: [],
      total: 0
    }
  },
  created () {
    this.queryInfo.id = sessionStorage.getItem('settId')
    this.getDetailList()
  },
  methods: {
    async getDetailList () {
      // eslint-disable-next-line camelcase
      const { data: res } = await this.$http.post('mapi/guideFinishDetail', this.queryInfo)
      console.log(res)
      if (res.code !== 200) return this.$message.error('获取明细失败！')
      this.$message.success('获取明细成功！')
      this.total = res.list.total
      this.tableData = res.list.data
    },
    timeChange () {
      console.log(this.seletTime)
      if (this.seletTime) {
        // eslint-disable-next-line camelcase
        this.queryInfo.start_time = parseInt(this.seletTime[0] / 1000)
        // eslint-disable-next-line camelcase
        this.queryInfo.end_time = parseInt(this.seletTime[1] / 1000)
        this.getDetailList()
      }
    },
    // 分页 一页显示多少条
    handleSizeChange (newSize) {
      this.queryInfo.pagesize = newSize
      this.getDetailList()
    },
    // 分页 跳转到多少页
    handleCurrentChange (newPage) {
      this.queryInfo.page = newPage
      this.getDetailList()
    }
  },
  destroyed () {
    sessionStorage.removeItem('settId')
  }
}
</script>

<style scoped lang="less">
.el-date-editor{
  width: 230px;
}
</style>
