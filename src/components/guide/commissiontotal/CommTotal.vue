<template>
    <div>
      <!-- 面包屑导航区域 -->
      <!-- <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>您当前所在位置</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>会员卡管理</el-breadcrumb-item>
        <el-breadcrumb-item>提成统计</el-breadcrumb-item>
      </el-breadcrumb> -->
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
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              size="mini"
              clearable
              @change="timeChange"
              :picker-options="pickerOptions">
            </el-date-picker>
            <el-select v-model="queryInfo.shop_id" placeholder="选择门店" clearable size="mini">
                <el-option
                  v-for="item in shopOptions"
                  :key="item.id"
                  :label="item.title"
                  :value="item.id">
                </el-option>
             </el-select>
             <el-select v-model="queryInfo.key_id" placeholder="搜索条件" clearable size="mini">
                <el-option label="导购编号" :value="1"></el-option>
                <el-option label="导购姓名" :value="2"></el-option>
             </el-select>
             <el-input type="text" placeholder="在这里输入搜索内容" clearable size="mini" >
               <el-button slot="append" icon="el-icon-search" @click="onSearch"></el-button>
             </el-input>
             <el-button type="primary" @click="excelExport" size="mini">导出EXCEL <i class=""></i></el-button>
          </el-col>
        </el-row>
        <el-table :data="tableData" border :summary-method="getSummaries" show-summary style="width: 100%;">
          <el-table-column prop="title" label="门店"></el-table-column>
          <el-table-column prop="number" label="导购员编号"></el-table-column>
          <el-table-column prop="nName" label="导购员姓名"></el-table-column>
          <el-table-column prop="count_order" label="订单数"></el-table-column>
          <el-table-column prop="order_money" label="销售额"></el-table-column>
          <el-table-column prop="extract_money" label="提成金额"></el-table-column>
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
      seletTime: [new Date(new Date().toLocaleDateString()).getTime(), new Date(new Date().toLocaleDateString()).getTime() + 24 * 60 * 60 * 1000 - 1], // 选择的时间数组
      // 查询条件
      queryInfo: {
        // eslint-disable-next-line camelcase
        start_time: parseInt((new Date(new Date().toLocaleDateString()).getTime()) / 1000),
        // eslint-disable-next-line camelcase
        end_time: parseInt((new Date(new Date().toLocaleDateString()).getTime() + 24 * 60 * 60 * 1000 - 1) / 1000),
        // eslint-disable-next-line camelcase
        shop_id: '',
        // eslint-disable-next-line camelcase
        key_id: '',
        keyword: '',
        page: 1,
        pagesize: 10
      },
      shopOptions: [], // 门店列表
      total: 0, // 总条数
      tableData: [], // 列表总数
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近一个月',
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近三个月',
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近六个月',
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 180)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近一年',
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 365)
            // start.setTime(start.getTime() - 3600 * 1000 * 24 * 365.242199) 一年为365(平年),闰年(366),但是存在一个平均数365.242199
            picker.$emit('pick', [start, end])
          }
        }]
      },
      exportList: []
    }
  },
  created () {
    this.getCommTotal()
  },
  methods: {
    async getCommTotal () {
      const loading = this.$loading({
          lock: true,
          text: 'Loading',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.1)'
        });
      const { data: res } = await this.$http.post('mapi/guideCount', this.queryInfo)
      // console.log(res)
      if (res.code !== 200) return this.$message.error(res.msg)
      // this.$message.success('获取提成统计成功！')
      loading.close()
      this.shopOptions = res.shop
      this.tableData = res.list.data
      this.total = res.list.total
    },
    // 查询时间更改
    timeChange (val) {
      // console.log(val)
      // console.log(this.seletTime)
      // eslint-disable-next-line camelcase
      if (this.seletTime) {
        // eslint-disable-next-line camelcase
        this.queryInfo.start_time = parseInt(this.seletTime[0] / 1000)
        // eslint-disable-next-line camelcase
        this.queryInfo.end_time = parseInt(this.seletTime[1] / 1000)
      // console.log(this.queryInfo)
      }
    },
    onSearch () {
      console.log(11);
      this.getCommTotal()
    },
    excelExport () {
      const loading = this.$loading({
        lock: true,
        text: '正在导出，请稍等......',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.1)'
      })
      const _this = this
      this.$http.post('mapi/countExcel', this.queryInfo)
        .then(function (res) {
          _this.excelGoodList = res.data.list
          console.log(res.data.list)
          const exportData = res.data.list
          if (exportData.length > 0) {
            require.ensure([], () => {
              const { exportJsonToExcel } = require('../../../vendor/Export2Excel')
              const tHeader = ['门店', '导购员编号', '导购员姓名', '订单总量', '销售金额', '提成金额']
              const filterVal = ['title', 'number', 'nName', 'count_order', 'order_money', 'extract_money']
              const data = _this.formatJson(filterVal, exportData)
              exportJsonToExcel(tHeader, data, '导购提成统计' + _this.getNowDate(new Date()))
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
    getSummaries (param) {
      const { columns, data } = param
      const sums = []
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '总计'
          return
        }
        if (index === 1) {
          return
        }
        const values = data.map(item => Number(item[column.property]))
        console.log(values)

        if (!values.every(value => isNaN(value))) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr)
            if (!isNaN(value)) {
              return prev + curr
            } else {
              return prev
            }
          }, 0)
        } else {
          sums[index] = ''
        }
      })

      return sums
    },
    // 分页 一页显示多少条
    handleSizeChange (newSize) {
      this.queryInfo.pagesize = newSize
      this.getCommTotal()
    },
    // 分页 跳转到多少页
    handleCurrentChange (newPage) {
      this.queryInfo.page = newPage
      this.getCommTotal()
    },
    getNowDate (date) {
      return date.getFullYear() + ((date.getMonth() + 1) >= 10 ? (date.getMonth() + 1) : '0' + (date.getMonth() + 1)) + (date.getDate() >= 10 ? date.getDate() : '0' + date.getDate())
    },
    formatJson (filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]))
    }
  }
}
</script>

<style scoped lang="less">
.el-date-editor{
  width: 230px;
    margin-right: 10px;
}
.el-select {width:150px;margin-right:10px;}
.el-input {width:250px;margin-right:10px;}
</style>
