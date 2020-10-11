<template>
  <div>
    <!-- 面包屑导航区域 -->
    <!-- <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>您当前所在位置</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb> -->
    <!-- 卡片视图区域 -->
    <el-card>
      <el-row :gutter="10"  class="mb10">
        <el-col :span="24">
          <el-select v-model="parameter.shop_id" placeholder="选择门店" size="mini">
            <el-option v-for="item in shopList" :key="item.id" :label="item.title" :value="item.id"></el-option>
          </el-select>
          <el-select v-model="parameter.cashier" placeholder="选择收银员" size="mini">
            <el-option
              v-for="item in cashierOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
          <el-select v-model="parameter.refund_state" placeholder="订单类型" size="mini">
            <el-option
              v-for="item in orderType"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
          <el-date-picker
                v-model="seletTime"
                type="daterange"
                align="right"
                unlink-panels
                 size="mini"
                value-format="timestamp"
                range-separator="至"
                :default-time="['00:00:00', '23:59:59']"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                @change="timeChange"
                :clearable="false"
                :picker-options="pickerOptions"
              ></el-date-picker>
            <el-select v-model="parameter.number" placeholder="查询条件" size="mini" @change="conditionSelect">
            <el-option
              v-for="item in  orderQuery"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
          <el-input placeholder="请输入内容" v-model="parameter.keyword" class="input-with-select" size="mini">
            <el-button slot="append"   @click="onserch"   v-no-click>搜索</el-button>
          </el-input>
        </el-col>
    </el-row>
    <el-row :gutter="10" class="mb10">
        <el-col :span="2">
           <el-button type="danger" @click="onclear"   v-no-click size="mini">批量删除 <i class="el-icon-s-order"></i></el-button>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-table :data="tableData" border style="width: 100%"  @cell-click="cellClick"  @selection-change="handleSelectionChange">
            <el-table-column type="selection"></el-table-column>
            <el-table-column prop="order_no" label="订单号" width="140"></el-table-column>
            <el-table-column prop="title" label="门店"></el-table-column>
            <el-table-column prop="cashier_name" label="收银员"></el-table-column>
            <!-- <el-table-column prop="business_day" label="营业日"></el-table-column> -->
            <!-- <el-table-column prop="hand_over" label="交班班次"></el-table-column> -->
            <el-table-column prop="amount" label="订单金额"></el-table-column>
            <el-table-column prop="discount_money" label="优惠金额"></el-table-column>
            <el-table-column prop="erase_zero" label="抹零金额"></el-table-column>
            <el-table-column prop="pay_amount" label="实收金额"></el-table-column>
            <el-table-column prop="add_time" label="下单时间" width="180"></el-table-column>
            <el-table-column prop="pay_state" label="订单状态">
              <template slot-scope="row">
                <div v-if="row.row.pay_state==1">已支付</div>
                <div v-else>未支付</div>
              </template>
            </el-table-column>
            <el-table-column prop="pay_type" label="支付类型">
              <template slot-scope="row">
                <div v-if="row.row.refund_state==1">退款</div>
                <div v-else>收款</div>
              </template>
            </el-table-column>
            <el-table-column prop="pay_type" label="支付方式">
              <!-- <template slot-scope="row">
                <div v-if="row.row.pay_type==1">微信支付</div>
                <div v-else-if="row.row.pay_type==2">余额</div>
                <div v-else>其他方式支付</div>
              </template> -->
            </el-table-column>

            <el-table-column prop="card_number" label="会员卡号"></el-table-column>
            <!-- <el-table-column prop="phone" label="商品总数"></el-table-column> -->
            <el-table-column label="操作" >
              <template slot-scope="scope">
                <el-button size="mini" type="primary" @click="onShowDialog(scope.row)"   v-no-click>查看</el-button>
              </template>
            </el-table-column>
          </el-table>
            <div class="height"></div>
            <div class="pagination">
           <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :page-sizes="[20, 50, 100]"
              layout="total, sizes, prev, pager, next, jumper"
              :total="total">
            </el-pagination>
            </div>
        </el-col>
      </el-row>
    </el-card>
<!-- 对话框 -->
<el-dialog
  :visible.sync="dialogVisible"
  width="75%"
  class="mydialog"
 >
 <el-row>
  <el-col :span="12">
    <div class="title">订单信息</div>
    <p>订单状态: {{orderMess.pay_state == 1? '已完成': '已退款'}}</p>
    <p v-if="orderMess.refund_state == 0">订单单号: {{orderMess.order_no}}</p>
    <p v-if="orderMess.refund_state == 1">退款单号: {{orderMess.refund_seq}}</p>
    <p v-if="orderMess.refund_state == 1" style="color:red">原始单号: {{orderMess.order_no}}</p>
    <p>下单时间: {{orderMess.add_time}}</p>
    <p>商家备注: {{orderMess.note}}</p>
  </el-col>
  <el-col :span="12">
    <div class="title">付款信息</div>
    <p>支付方式:{{payMess.pay_time}}
      <span v-if="payMess.pay_type == 1">微信支付</span>
      <span v-if="payMess.pay_type == 2">支付宝支付</span>
      <span v-if="payMess.pay_type == 3">现金支付</span>
      <span v-if="payMess.pay_type == 4">会员卡支付</span>
    </p>
    <p>支付时间: {{payMess.pay_time}}</p>
    <p>支付详细:
      {{payMess.pay_type}}：￥{{payMess.pay_amount}}
    </p>
  </el-col>
</el-row>
<el-row class="mt20">
  <el-col :span="24">
    <div class="title">订单清单</div>
    <el-table :data="orderTableList" style="width:100%" border :header-row-style="{background:'#eef1f6'}">
      <el-table-column label="商品">
         <template slot-scope="scope">
           <!-- <img :src="scope.row.goods_thumb?scope.row.goods_thumb: ''" alt="" class="goods_img"> -->
           {{scope.row.goods_name}}
         </template>
      </el-table-column>
      <el-table-column label="分类" prop="goods_cate"></el-table-column>
      <el-table-column label="原价" prop="supply_price"></el-table-column>
      <el-table-column label="会员价" prop="member_price"></el-table-column>
      <!-- <el-table-column label="会员优惠" prop="member_coupon_price"></el-table-column> -->
      <!-- <el-table-column label="优惠类型" prop="coupon_type"></el-table-column> -->
      <el-table-column label="商品优惠" prop="coupon_price"></el-table-column>
      <el-table-column label="售价" prop="sale_price"></el-table-column>
      <el-table-column label="销售数量" prop="num"></el-table-column>
      <el-table-column label="销售方式" prop="unit"></el-table-column>
      <!-- <el-table-column label="商品原价" prop="'supply_num_price"></el-table-column>
      <el-table-column label="会员优惠" prop="member_coupon_num_price"></el-table-column>
      <el-table-column label="是否积分" prop="change_integral"></el-table-column>
      <el-table-column label="商品优惠" prop="coupon_num_price"></el-table-column>
      <el-table-column label="实收金额" prop="amount"></el-table-column> -->
    </el-table>
  </el-col>
</el-row>
<el-row class="mt20">
  <el-col :span="18">
    <el-row>
      <el-col :span="4">买家留言：</el-col>
      <el-col :span="20">{{totalList.intro}}</el-col>
    </el-row>
  </el-col>
  <el-col :span="6" style="text-align:right">
    <p>订单原始金额：￥{{totalList.goods_money}}</p>
    <p>订单应收金额：￥{{totalList.amount}}</p>
    <p>订单优惠金额：￥{{totalList.order_coupon_price}}</p>
    <p>订单抹零金额：￥{{totalList.erase_zero}}</p>
    <p>订单满减金额：￥{{totalList.reduce_amount}}</p>
    <p style="color:red">订单实收金额：￥{{totalList.money}}</p>
    <!-- <p>订单原始金额：￥{{totalList.intro}}</p>
    <p>会员优惠金额：￥{{totalList.member_coupon_price}}</p>
    <p>商品优惠金额：￥{{totalList.coupon_price}}</p>
    <p>订单应收金额：￥{{totalList.ying_money}}</p>
    <p>订单优惠金额：￥{{totalList.order_coupon_price}}</p>
    <p>订单抹零金额：￥{{totalList.erase_zero}}</p>
    <p style="color:red">订单实收金额：￥{{totalList.money}}</p> -->
  </el-col>
</el-row>
<el-row class="mt20">
  <el-col :span="24">
     <div class="title"> 订单操作日志</div>
     <p v-if="orderMess.refund_state == 0">收银员：{{orderLog.shengChengFuKuan.cashier}} 操作：生成门店收款订单 时间： {{orderLog.shengChengFuKuan.time}}</p>
     <p v-if="orderMess.refund_state == 1">收银员：{{orderLog.tuiKuan.cashier}} 操作：生成门店退款订单 时间： {{orderLog.tuiKuan.time}}</p>
  </el-col>
</el-row>
  <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false" >取 消</el-button>
    <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
  </span>
</el-dialog>
  </div>
</template>
<script>
// 门店:shop_id,订单类型:refund_state(0:销售/1:退款),时间选择(create_time:1-10/自定义:start_time - end_time),
// 搜索框(number:[1:订单号查询,2:会员卡号查询,3:会员电话查询],keyword:搜索框内容)
import { selectDate, seletTime, startTime, endTime } from '@/common/selectDate.js'
export default {
  data () {
    return {
      tableData: [], // 表格的数据
      shopList: [], // 门店列表
      total: 0,
      cashierOptions: [], // 收银员选项
      dialogVisible: false, // 对话框开关
      orderType: [
        {
          value: 0,
          label: '销售'
        }, {
          value: 1,
          label: '退款'
        }
      ],
      seletTime:seletTime, // 默认日期 当天
      pickerOptions:{shortcuts:selectDate}, // 时间选项
      parameter: {
        // eslint-disable-next-line camelcase
        shop_id: '', // 门店id
        page: 1,
        pagesize: 20,
        // eslint-disable-next-line camelcase
        refund_state: '', // 订单类型
        // eslint-disable-next-line camelcase
        // create_time: '', // 交易时间
        // eslint-disable-next-line camelcase
        start_time: parseInt(startTime/ 1000), // 开始时间
        // eslint-disable-next-line camelcase
        end_time: parseInt(endTime/ 1000), // 结束时间
        number: '', // 订单号查询、会员卡号查询、会员电话查询、交班班次查询
        keyword: '', // 搜索内容
        // eslint-disable-next-line camelcase
        cashier_id: '' // 收银员
      },
      orderQuery: [{
        value: 1,
        label: '订单号'
      }, {
        value: 2,
        label: '会员卡号'
      }, {
        value: 3,
        label: '会员电话'
      }
      ],
      value: '',
      input3: '',
      // 订单详情中的列表
      orderTableList: [],
      // 订单详情 订单信息
      orderMess: {},
      // 订单详情 付款信息
      payMess: {},
      // 订单详情 清单汇总
      totalList: {},
      // 订单详情 订单操作日志
      orderLog: {},
      selectOrders:[], // 选中的订单
      deleteId: '' // 需要删除的id以','隔开
    }
  },
  // 页面加载
  created () {
    // 获取订单列表
    this.order()
    this.getShops()
    this.getCashier()
  },
  // 方法
  methods: {
    async order () {
       const loading = this.$loading({
          lock: true,
          text: 'Loading',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.1)'
        }); 
        // console.log(this.parameter);
      const { data: res } = await this.$http.post('mapi/order', this.parameter)
      // console.log('获取订单列表', this.parameter,res)
      if (res.status !== 1) return this.$message.error(res.msg)
      // this.$message.success('获取订单列表成功！')
      loading.close()
      this.tableData = res.list.data
      // this.shopList = res.shop
      this.total = res.list.total
      // this.cashierOptions = res.cashier
    },
    // 获取店铺列表
    async getShops(){
      const { data: res } = await this.$http.get('mapi/ShareCommon/shop')
       if (res.code !== 200) return this.$message.error(res.msg)
       this.shopList = res.shop
    },
    // 获取收银员列表
    async getCashier(){
      const { data: res } = await this.$http.get('mapi/ShareCommon/cashier')
       if (res.code !== 200) return this.$message.error(res.msg)
       this.cashierOptions = res.cashier
       
    },
    // 查询时间更改
    timeChange(val) {
      // console.log('val', val);
      this.parameter.start_time = parseInt(val[0] / 1000);
      this.parameter.end_time = parseInt(val[1] / 1000);
    },
    // 分页
    handleSizeChange (e) {
      this.parameter.pagesize = e
      this.order()
    },
    // 分页
    handleCurrentChange (e) {
      this.parameter.page = e
      this.order()
    },
    // 条件id选择  page置1
    conditionSelect(){
      this.parameter.page = 1
    },
    // 订单多选
    handleSelectionChange(val){
      this.selectOrders = val
      let idlist = ''
      val.forEach(item => {
        // console.log(value, index, arr)
        idlist += item.oid + ','
      })
      this.deleteId = idlist.substring(0, idlist.length - 1)
    },
    // 查看订单详情
    async onShowDialog (row) {
      const { data: res } = await this.$http.post('mapi/orderDetail', { id: row.oid })
      // console.log(res)
      if (res.code !== 200) return this.$message.error(res.msg)
      this.orderMess = res.order1
      this.payMess = res.order2
      this.totalList = res.order3.money
      this.orderTableList = res.order3.detail
      this.orderLog = res.order_4
      // console.log('------',res.order_4);
      this.dialogVisible = true
    },
    // /搜搜
    onserch () {
      this.order()
    },
    // 删除订单
    onclear () {
      
      console.log(this.deleteId);
      if (this.deleteId == '') return this.$message.warning('请先选择要删除订单！')
      this.$confirm('确定删除这些订单, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const { data: res } = await this.$http.post('mapi/orderDel', { id: this.deleteId })
        if (res.code !== 200) return this.$message.error(res.msg)
        this.$message.success('批量删除订单成功！')
        // 批量删除最后一个分页剩余项跳转上一分页
        const totalPage = Math.ceil((this.total - this.selectOrders.length) / this.parameter.pagesize)
        const currentPage = this.parameter.page > totalPage ? totalPage : this.parameter.page
        this.parameter.page = this.parameter.page < 1 ? 1 : currentPage
        this.order()
      }).catch(() => {
        // this.$message.error('取消删除！')
      })
    },
    cellClick (row, column, cell, event) {
      // console.log(row, column, cell, event)
    }
  }
}
</script>

<style lang="less" scoped>
.el-select {
  width: 120px;
  margin-right: 10px;
}
.el-date-editor{
  width: 230px;
    margin-right: 10px;
}
.el-input {
  width:250px;
}
.el-row.mt20{margin-top:20px;}
.el-row .title{font-size:20px;color:#333;padding-bottom:10px;border-bottom:1px solid #f9f9f9;}
.el-row p{line-height: 30px;font-size:12px;}
.el-row p span{font-size:12px;}
.mydialog /deep/ .el-dialog__header{display: none !important;}
.goods_img{width:50px;height:50px;margin-right:10px;}
</style>
