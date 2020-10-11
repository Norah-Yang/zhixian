<template>
    <div>
      <!-- 面包屑导航区域 -->
      <!-- <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>您当前所在位置</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>零售统计</el-breadcrumb-item>
        <el-breadcrumb-item>挂账明细</el-breadcrumb-item>
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
               <el-input placeholder="请输入内容" v-model="queryInfo.keyword" size="mini" clearable >
                <el-button slot="append" @click="onSearch" icon="el-icon-search"></el-button>
              </el-input>
              <el-button type="primary" plain size="mini" class="btn" @click="outputExcel">导出EXCELL</el-button>
          </el-col>
        </el-row>
         <el-table :data="tableData" border style="width: 100%" >
            <el-table-column prop="order_no" label="订单号" width="180px" ></el-table-column>
            <el-table-column prop="title" label="门店"  ></el-table-column>
            <el-table-column prop="admin" label="挂账收银员" ></el-table-column>
            <el-table-column prop="type" label="收款方式"  >
              <template slot-scope="scope">
               {{ scope.row.type == 1? '会员': '非会员'}}
              </template>
            </el-table-column>
            <el-table-column prop="payee_object" label="收款对象"  ></el-table-column>
            <el-table-column prop="payee_price" label="收款金额（不含优惠）"  ></el-table-column>
            <el-table-column prop="coupon_price" label="优惠金额"  ></el-table-column>
            <el-table-column prop="add_time" label="收款时间"  ></el-table-column>
            <el-table-column prop="name" label="收款人"  ></el-table-column>
            <el-table-column prop="thumb" label="收款凭证"  ></el-table-column>
            <el-table-column prop="intro" label="收款备注"  ></el-table-column>
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
      pickerOptions: {
        shortcuts: selectDate
      },
      seletTime: seletTime,
      shopOptions: [], // 门店选项
      queryInfo: {
        // eslint-disable-next-line camelcase
        shop_id: '',
        // eslint-disable-next-line camelcase
        start_time: parseInt(startTime /1000),
        // eslint-disable-next-line camelcase
        end_time: parseInt(endTime /1000),
        keyword: '',
        page: 1,
        pagesize: 10
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
        console.log('请求参数', this.queryInfo);
      const { data: res } = await this.$http.post('mapi/particularsAccount', this.queryInfo)
      // console.log(res)
      if (res.code !== 200) return this.$message.error(res.msg)
      // this.$message.success('列表查询成功！')
      loading.close()
      // this.shopOptions = res.shop
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
    onSearch () {},
    // 查询时间更改
    timeChange (val) {
     
        // eslint-disable-next-line camelcase
        this.queryInfo.start_time = parseInt(val[0] / 1000) 
        // eslint-disable-next-line camelcase
        this.queryInfo.end_time = parseInt(val[1] / 1000) 
        // console.log(this.queryInfo.start_time, this.queryInfo.end_time)
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
      this.$http.post('mapi/particularsExcel')
        .then(function (res) {
          _this.excelList = res.data.list
          console.log(res)
          const exportData = res.data.list
          if (exportData.length > 0) {
            require.ensure([], () => {
              const { exportJsonToExcel } = require('../../../vendor/Export2Excel')
              const tHeader = ['订单号', '门店', '挂账收银员', '收款方式', '收款对象', '收款金额（不含优惠）', '优惠金额', '收款时间', '收款人', '收款备注']
              const filterVal = ['order_no', 'title', 'admin', 'type', 'payee_object', 'payee_price', 'coupon_price', 'add_time', 'name', 'intro']
              const data = _this.formatJson(filterVal, exportData)
              exportJsonToExcel(tHeader, data, '挂账明细' + _this.getNowDate(new Date()))
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
