<template>
    <div>
      <!-- 面包屑导航区域 -->
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>您当前所在位置</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>导购管理</el-breadcrumb-item>
        <el-breadcrumb-item>导购明细</el-breadcrumb-item>
      </el-breadcrumb>
      <el-card class="card mb10">
        <el-collapse v-model="activeNames" class="mb10">
          <el-collapse-item title="提示说明" name="1">
            <div class="tips">
              <h3>· 导购提成方式是按照商品提成：</h3>
              <p>1.商品提成方式如果选择百分比，则提成金额=实际销售金额*百分比；如：A商品设定的按百分比4.00%，该商品总销售额22.27元，则提成金额=22.27*4.00%=0.89</p>
              <p>2.商品提成方式如果选择按金额，则提成金额=数量*按金额；如：A商品设定的按金额0.40元，该商品卖出去4.23千克，则提成金额=4.23*0.40=1.69</p>
            </div>
            <div class="tips">
              <h3>· 导购提成方式是按照订单提成：注意事项：按照订单是需要设定订单规则，满多少给予提成，如果订单不满足设定的条件，则没有提成金额</h3>
              <p>1.订单提成方式如果选择百分比，则提成金额=实际订单金额*百分比；如：按照订单设定的按百分比2.00%， 该订单151015505490726总销售额15.00元，则提成金额=150*2.00%=3.00元</p>
              <p>2.订单提成方式如果选择按金额，则提成金额=固定金额；如：按照订单设定的按金额3.00元，订单151015507166387提成金额也是3.00元，这个订单总的销售金额不管是多少都是给予固定3.00元</p>
            </div>
          </el-collapse-item>
        </el-collapse>
      </el-card>
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
              clearable
              :picker-options="pickerOptions"
              size="mini">
            </el-date-picker>
            <el-select v-model="queryInfo.type" placeholder="请选择" clearable  size="mini" class="select">
                <el-option label="按订单" :value="1"></el-option>
                <el-option label="按商品" :value="2"></el-option>
             </el-select>
             <el-select v-model="queryInfo.shop_id" placeholder="选择门店" clearable size="mini">
                <el-option
                  v-for="item in shopOptions"
                  :key="item.id"
                  :label="item.title"
                  :value="item.id">
                </el-option>
             </el-select>
            <el-select v-model="queryInfo.key_id" placeholder="请选择" size="mini"  class="select">
                <el-option label="导购编号" :value="1"></el-option>
                <el-option label="导购姓名" :value="2"></el-option>
                <el-option label="订单ID" :value="3"></el-option>
             </el-select>
             <el-input placeholder="请输入内容" v-model="queryInfo.keyword" clearable size="mini">
                <el-button slot="append" @click="onSearch" icon="el-icon-search"></el-button>
              </el-input>
             <el-button type="primary" @click="excelExport" size="mini">导出EXCEL <i class=""></i></el-button>
          </el-col>
        </el-row>
        <el-table :data="tableData"  border  style="width: 100%">
           <el-table-column prop="title" label="门店"></el-table-column>
           <el-table-column prop="number" label="导购员编号"></el-table-column>
           <el-table-column prop="nName" label="导购员姓名"></el-table-column>
           <el-table-column prop="order_no" label="订单号"></el-table-column>
           <el-table-column prop="order_time" label="下单时间"></el-table-column>
           <el-table-column prop="order_status" label="订单状态"></el-table-column>
           <el-table-column prop="order_money" label="销售金额"></el-table-column>
           <el-table-column label="提成方式">
             <template slot-scope="scope">
               <span v-if="scope.row.extract_type == 1">按百分比:</span>
               <span v-else>按金额:</span>{{ scope.row.extract_money}}元
             </template>
           </el-table-column>
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
      activeNames: ['1'],
      seletTime: [new Date(new Date().toLocaleDateString()).getTime(), new Date(new Date().toLocaleDateString()).getTime() + 24 * 60 * 60 * 1000 - 1], // 选择的时间数组
      queryInfo: {
        // eslint-disable-next-line camelcase
        start_time: parseInt((new Date(new Date().toLocaleDateString()).getTime()) / 1000),
        // eslint-disable-next-line camelcase
        end_time: parseInt((new Date(new Date().toLocaleDateString()).getTime() + 24 * 60 * 60 * 1000 - 1) / 1000),
        // eslint-disable-next-line camelcase
        shop_id: '',
        // eslint-disable-next-line camelcase
        type: '',
        // eslint-disable-next-line camelcase
        key_id: '',
        keyword: '',
        page: 1,
        pagesize: 10
      },
      tableData: [],
      total: 0,
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
      shopOptions: [], // 门店选项
      exportList: []
    }
  },
  created () {
    this.getDeductList()
  },
  methods: {
    async getDeductList () {
      const loading = this.$loading({
          lock: true,
          text: 'Loading',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.1)'
        });
      const { data: res } = await this.$http.post('mapi/guideExtractDetail', this.queryInfo)
      // console.log(res)
      if (res.code !== 200) return this.$message.error(res.msg)
      // this.$message.success('获取明细成功！')
      loading.close()
      this.tableData = res.list.data
      this.total = res.list.total
      this.shopOptions = res.arr
    },
    timeChange () {},
    // 搜索查询
    onSearch () {
      this.getDeductList()
    },
    excelExport () {
      const loading = this.$loading({
        lock: true,
        text: '正在导出，请稍等......',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      const _this = this
      this.$http.post('mapi/guideExcel', this.queryInfo)
        .then(function (res) {
          // console.log(res.data.list)
          _this.exportList = res.data.list
          const exportData = res.data.list
          if (exportData.length > 0) {
            require.ensure([], () => {
              const { exportJsonToExcel } = require('../../../vendor/Export2Excel.js')
              const tHeader = ['门店', '导购员编号', '导购员姓名', '订单号', '下单时间', '订单状态', '销售金额', '提成方式', '提成金额']
              const filterVal = ['title', 'number', 'nName', 'order_no', 'order_time', 'order_status', 'order_money', 'extract_type', 'extract_money']
              const data = _this.formatJson(filterVal, exportData)
              exportJsonToExcel(tHeader, data, '提成明细' + _this.getNowDate(new Date()))
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
      this.getDeductList()
    },
    // 分页 跳转到多少页
    handleCurrentChange (newPage) {
      this.queryInfo.page = newPage
      this.getDeductList()
    },
    formatJson (filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]))
    },
    getNowDate (date) {
      return date.getFullYear() + ((date.getMonth() + 1) >= 10 ? (date.getMonth() + 1) : '0' + (date.getMonth() + 1)) + (date.getDate() >= 10 ? date.getDate() : '0' + date.getDate())
    }
  }
}
</script>

<style scoped lang="less">
.card /deep/ .el-collapse-item__header{font-size:18px !important;color: chocolate;}
.card /deep/  .el-card__body{
  padding:10px 20px;
}
.card /deep/  .el-collapse-item__content{ padding-bottom:10px; }
.tips{
  h3{padding: 5px 0;}
  p{
    padding-left:15px;
    &:nth-child(1){
      padding-top:15px;
    }
  }
}
.el-date-editor{
  width: 230px;
    margin-right: 10px;
}
.el-select {width:150px;margin-right:10px;}
.el-select.select{width:100px;}
.el-input {width:250px;margin-right:10px;}
</style>
