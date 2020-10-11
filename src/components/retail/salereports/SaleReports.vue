<template>
    <div>
      <el-card>
        <el-row class="mb10">
          <el-col :span="24">
             <el-select
              v-model="queryInfo.shopcate"
              multiple
              size="mini"
              collapse-tags
              style="margin-left: 20px;"
              placeholder="商品分类" >
              <el-option
                v-for="item in shopcateOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
             <el-select v-model="queryInfo.shop_id" placeholder="选择门店" size="mini" clearable >
                <el-option
                  v-for="item in shopOptions"
                  :key="item.id"
                  :label="item.title"
                  :value="item.id">
                </el-option>
             </el-select>
             <el-select v-model="queryInfo.cashier" placeholder="选择收银员" size="mini" clearable >
                <el-option
                  v-for="item in cashierOptions"
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
                <el-option label="商品名称" :value="1"></el-option>
                <el-option label="商品编号" :value="2"></el-option>
                <el-option label="商品ID" :value="3"></el-option>
             </el-select>
               <el-input placeholder="请输入内容" v-model="queryInfo.keyword" size="mini" clearable >
                <el-button slot="append" @click="onSearch" icon="el-icon-search"></el-button>
              </el-input>
              <el-button type="primary" plain size="mini" class="btn" @click="outputExcel">导出EXCELL</el-button>
          </el-col>
        </el-row>
        <el-table :data="tableData" border style="width: 100%" >
            <el-table-column prop="title" label="商品名称"></el-table-column>
            <el-table-column prop="order_no" label="商品编号" width="180px" ></el-table-column>
            <el-table-column label="商品类别"></el-table-column>
            <el-table-column prop="name" label="销售数量" sortable></el-table-column>
            <el-table-column prop="add_time" label="sku数量"></el-table-column>
            <el-table-column prop="business_day" label="sku单位" sortable></el-table-column>
            <el-table-column prop="hand_over" label="销售金额" sortable ></el-table-column>
            <el-table-column prop="pay_type" label="退货数量（sku）" sortable ></el-table-column>
            <el-table-column prop="money" label="退货金额" sortable ></el-table-column>
            <el-table-column prop="card_number" label="实销数量（sku）" sortable ></el-table-column>
            <el-table-column prop="sell_money" label="实销金额" sortable ></el-table-column>
            <el-table-column prop="discount_money" label="成本" sortable ></el-table-column>
            <el-table-column prop="round_money" label="毛利" sortable ></el-table-column>
            <el-table-column prop="reality_money" label="毛利率"  sortable></el-table-column>
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
    data() {
        return {
          shopcateOptions: [], // 商品分类选项
          pickerOptions: {
            shortcuts: selectDate
          },
          seletTime: seletTime,
          shopOptions: [], // 门店选项
          cashierOptions: [], // 收银员选项
          queryInfo:{
            shopcate: '',
            shop_id: '',
            cashier: '',
            time: '',
            start_time: parseInt(startTime/1000),
            end_time: parseInt(endTime /1000),
            keyword_id: '',
            keyword: '',
            page: 1,
            pagesize:10
          },
           tableData: [], // 列表数据
            total: 0, // 列表总条数
            excelList: [] // 导出excel的数据
        }
    },
    created() {
      this.getPath()
    },
    methods: {
      getPath(){
        console.log(this.$route.fullPath); 
      },
      // 导出Excel
      outputExcel(){
        const loading = this.$loading({
        lock: true,
        text: '正在导出，请稍等......',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
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
              const tHeader = ['门店', '单号', '单据类型', '收银员', '日期', '营业日', '交班班次', '付款方式', '付款金额', '会员卡号', '销售金额', '优惠金额', '抹零金额', '实销金额', '备注']
              const filterVal = ['title', 'order_no', 'refund_state', 'name', 'add_time', 'business_day', 'hand_over', 'pay_type', 'money', 'card_number', 'sell_moeny', 'discount_money', 'round_money', 'reality_money', 'note']
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
      timeChange(){},
      onSearch(){
        
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
    }
    }
};
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
