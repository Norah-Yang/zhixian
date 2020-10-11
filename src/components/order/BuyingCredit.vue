<template>
  <div>
    <!-- 面包屑导航区域 -->
    <!-- <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>您当前所在位置</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>挂账列表</el-breadcrumb-item>
    </el-breadcrumb> -->
    <!-- 卡片视图区域 -->
    <el-card>
      <el-row :gutter="10"  class="mb10 selec120">
        <el-col :span="24">
          <el-select v-model="queryInfo.shop_id" placeholder="选择门店" size="mini">
            <el-option v-for="item in shopList" :key="item.id" :label="item.title" :value="item.id"></el-option>
          </el-select>
          <el-select v-model="queryInfo.cashier_id" placeholder="选择收银员" size="mini">
            <el-option
              v-for="item in cashierOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
          <el-select v-model="queryInfo.way" placeholder="挂账方式" size="mini">
            <el-option
              v-for="item in creditType"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
          <el-select v-model="queryInfo.type" placeholder="挂账类型" size="mini">
            <el-option
              v-for="item in creditGenre"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
          <el-select v-model="queryInfo.state" placeholder="挂账状态" size="mini">
            <el-option
              v-for="item in creditStatus"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>

         <!-- <el-date-picker
         :disabled="getisdisabled"
         :clearable="false"
          v-model="times"
          type="daterange"
          size="mini"
          @change="dateChange"
          value-format="timestamp"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        >
        </el-date-picker> -->
          <!-- <el-select  v-model="queryInfo.create_time" placeholder="选择时间" size="mini">
            <el-option
              v-for="item in dateList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select> -->
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
            <el-select v-model="queryInfo.number" placeholder="请选择" size="mini">
            <el-option
              v-for="item in  orderQuery"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
          <el-input placeholder="请输入订单号" v-model="queryInfo.keyword" class="input-with-select" size="mini">
            <el-button slot="append"   @click="onsearch">搜索</el-button>
          </el-input>
        </el-col>
    </el-row>
    <el-row :gutter="10" class="mb10">
        <el-col>
           <el-button type="danger" @click="allChange" size="mini">批量处理 <i class="el-icon-s-order"></i></el-button>
        </el-col>
      </el-row>
      <el-row class="mb10">
        <el-col :span="24">
          <el-table :data="tableData" border :summary-method="getSummaries" show-summary style="width: 100%"  @selection-change="handleSelectionChange"  @cell-click="cellClick" >
            <el-table-column type="selection" width="55" align="center" :selectable="checkboxT" disabled="true"></el-table-column>
            <el-table-column prop="order_no" label="订单号"></el-table-column>
            <el-table-column prop="title" label="门店"></el-table-column>
            <el-table-column prop="cashier" label="收银员"></el-table-column>
            <el-table-column prop="price" label="挂账金额"></el-table-column>
            <el-table-column prop="pay_price" label="已付金额（不含优惠）"></el-table-column>
            <el-table-column prop="coupon_price" label="优惠金额"></el-table-column>
            <el-table-column prop="await_price" label="待收金额"></el-table-column>
            <el-table-column  label="挂账方式">
              <template slot-scope="scope">
                <div v-if="scope.row.way==1">消费挂账</div>
                <div v-else>储值挂账</div>
              </template>
            </el-table-column>
            <el-table-column label="挂账状态">
              <template slot-scope="scope">
                <div v-if="scope.row.state==0" style="color:red">待处理</div>
                <div v-else-if="scope.row.state==1" style="color:orange">部分支付</div>
                <div v-else style="color:green">已结清</div>
              </template>
            </el-table-column>
            <el-table-column  label="挂账类型">
              <template slot-scope="scope">
                <div v-if="scope.row.type==1">门店</div>
                <div v-else>公司</div>
              </template>
            </el-table-column>
            <el-table-column prop="note" label="挂账单位"></el-table-column>
            <el-table-column prop="phone" label="联系方式"></el-table-column>
            <el-table-column prop="add_time" label="挂账时间"></el-table-column>
            <el-table-column prop="remark" label="挂账备注"></el-table-column>
            <el-table-column label="操作" width="180">
              <template slot-scope="scope">
                <el-button size="mini" type="primary" @click="onShowDetail(scope.row)" >查看</el-button>
                <el-button size="mini" type="danger" @click="onShowDialog(scope.row)"  v-if="scope.row.state != 2">挂账收款</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>
      <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="queryInfo.pagenum"
          :page-sizes="[5, 10, 20, 50, 100,]"
          :page-size="queryInfo.pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
        </el-pagination>
    </el-card>
      <!-- 对话框 -->
      <el-dialog
        :visible.sync="creditDialogVisible"
        width="75%">
        <div class="d_body">
          <el-row class="mb10">
            <el-col :span="12">
               <div class="title">挂单信息</div>
               <p>挂单状态：
                 <span v-if="creditDetail.state == 0" style="color:red">未处理</span>
                 <span v-if="creditDetail.state == 1" style="color:orange">部分支付</span>
                 <span v-if="creditDetail.state == 2" style="color:green">已结清</span>
                 </p>
               <p>订单单号： {{creditDetail.order_no}}</p>
               <p>创建时间： {{creditDetail.add_time}}</p>
               <p>挂账备注： {{creditDetail.remark}}</p>
            </el-col>
            <el-col :span="12">
              <div class="title">挂帐信息</div>
               <p>挂账单位： {{creditDetail.note}}</p>
               <p>联系方式： {{creditDetail.phone}}</p>
               <p>挂账金额： {{creditDetail.price}}</p>
               <p>已收金额： {{creditDetail.pay_price}}</p>
               <p>优惠金额： {{creditDetail.coupon_price}}</p>
               <p>待收金额： {{creditDetail.await_price}}</p>
            </el-col>
          </el-row>
          <el-row>
             <el-col :span="24">
                <div class="title">收款清单</div>
                <el-table :data="tableList" border  style="width: 100%"   >
                   <el-table-column label="收款金额(不含优惠)" prop="payee_price"></el-table-column>
                   <el-table-column label="优惠金额" prop="coupon_price"></el-table-column>
                   <el-table-column label="收款方式">
                     <template slot-scope="scope">
                      <p v-if="scope.row.type == 2">非会员卡</p>
                      <p v-else>会员卡({{scope.row.card_number}})</p>
                     </template>
                   </el-table-column>
                   <el-table-column label="收款对象">
                     <template slot-scope="scope">
                       <div v-if="scope.row.payee_object == 2">门店</div>
                        <div v-if="scope.row.payee_object == 1">公司</div>
                     </template>
                   </el-table-column>
                   <el-table-column label="收款时间" prop="add_time"></el-table-column>
                   <el-table-column label="收款操作人" prop="admin"></el-table-column>
                   <el-table-column label="收款凭证" prop="thumb"></el-table-column>
                   <el-table-column label="收款备注" prop="intro"></el-table-column>
                </el-table>
             </el-col>
          </el-row>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="creditDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="creditDialogVisible = false">确 定</el-button>
        </span>
      </el-dialog>
      <el-dialog  :visible.sync="gatherDialogVisible"
        width="75%">
        <el-form :model="gatherForm" ref="gatherForm" label-width="100px" >
          <el-form-item label="收款方式"  required>
            <el-select v-model="gatherForm.type" placeholder="选择支付方式">
              <el-option v-for="item in gatherMethods" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="收款机构"  v-if="gatherForm.type == 2" required>
            <el-select v-model="gatherForm.payee_object" placeholder="选择付款到">
              <el-option v-for="item in gatherObject" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="会员卡号"  v-if="gatherForm.type == 1" required>
            <el-input v-model="gatherForm.card_number"></el-input>
          </el-form-item>
          <el-form-item label="收款金额"   required>
            <el-input v-model="gatherForm.payee_price" ></el-input>
          </el-form-item>
          <el-form-item label="优惠金额" >
            <el-input v-model="gatherForm.coupon_price" ></el-input>
          </el-form-item>
          <el-form-item label="收款凭证">
            <el-upload
              :class="uploadDisabled"
              action="mapi/upload/pic"
              with-credentials
              :show-file-list="showImgList"
              :file-list="fileList"
              list-type="picture-card"
              :limit="limitCount"
              :on-remove="handleRemove"
              :on-success="handleAvatarSuccess"
              :on-error="handleAvatarError"
              :disabled="showdisabled"
              :on-preview="onPreviewImg"
              :headers="handleHeader"
              :before-upload="beforeAvatarUpload">
              <i class="el-icon-plus"></i>
            </el-upload>
            <el-dialog :visible.sync="imgDialogVisible">
              <img width="100%" :src="dialogImageUrl" alt="">
            </el-dialog>
          </el-form-item>
          <el-form-item label="收款备注">
            <el-input type="textarea" :rows="5" placeholder="请输入备注" v-model="gatherForm.intro"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="gatherDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="gatherBtn(flag)" :loading="btnLoading">确 定</el-button>
        </span>
      </el-dialog>
  </div>
</template>
<script>
var token = window.sessionStorage.getItem('token')
// 门店:shop_id,订单类型:refund_state(0:销售/1:退款),时间选择(create_time:1-10/自定义:start_time - end_time),
// 搜索框(number:[1:订单号查询,2:会员卡号查询,3:会员电话查询],keyword:搜索框内容)
import { selectDate, seletTime, startTime, endTime } from '@/common/selectDate.js'
export default {
  data () {
    return {
      // 挂账收款
      gatherForm: {
        // eslint-disable-next-line camelcase
        on_account_id: '', // 挂账单id
        type: '', // 收款方式
        // eslint-disable-next-line camelcase
        member_id: '', // 会员id
        // eslint-disable-next-line camelcase
        card_number: '', // 会员卡号
        // eslint-disable-next-line camelcase
        payee_object: 2, // 收款对象
        // eslint-disable-next-line camelcase
        payee_price: '', // 收款金额
        // eslint-disable-next-line camelcase
        coupon_price: 0, // 优惠金额
        thumb: '', // 收款凭证图片
        intro: '' // 备注
      },
      // 收款凭证
      dialogImageUrl: '',
      // 图片上传一张
      limitCount: 1,
      gatherMethods: [
        {
          label: '会员卡',
          value: 1
        },
        {
          label: '非会员卡',
          value: 2
        }
      ],
      gatherObject: [
        {
          label: '公司收款',
          value: 1
        },
        {
          label: '门店收款',
          value: 2
        }
      ],
      fileList: [],
      showImgList: true,
      uploadDisabled: '', // 图片上传样式
      // 图片上传
      showdisabled: false,
      handleHeader: { authorization: token },
      tableData: [], // 表格的数据
      tableList: [], // 收款清单
      creditDetail: {}, // 挂账详情
      shopList: [], // 门店列表
      total: 0,
      creditDialogVisible: false, // 挂账详情对话框开关,
      gatherDialogVisible: false, // 挂账收款对话框开关
      imgDialogVisible: false, // 图片展示对话框开关
      orderType: [
        {
          value: 0,
          label: '销售'
        }, {
          value: 1,
          label: '退款'
        }
      ],
      times: '',
      seletTime:seletTime, // 默认日期 当天
      pickerOptions:{shortcuts:selectDate}, // 时间选项
      // 搜索条件
      queryInfo: {
        // eslint-disable-next-line camelcase
        shop_id: '', // 门店id
        // eslint-disable-next-line camelcase
        cashier_id: '', // 选择收银员
        pagenum: 1, // 分页当前页
        pagesize: 5, //  分页一页显示数量
        way: '', // 挂账方式
        state: '', // 挂账状态
        type: '', // 挂账类型
        // eslint-disable-next-line camelcase
       start_time: parseInt(startTime/ 1000), // 开始时间
        // eslint-disable-next-line camelcase
        end_time: parseInt(endTime/ 1000), // 结束时间
        number: '',
        keyword: ''
      },
      orderQuery: [
        {
          value: 1,
          label: '订单号'
        },
        {
          value: 2,
          label: '挂账单位'
        },
        {
          value: 3,
          label: '联系方式'
        }
      ],
      cashierOptions: [], // 收银员选项
      value: '',
      input3: '',
      creditType: [
        {
          label: '消费挂账',
          value: '1'
        },
        {
          label: '储值挂账',
          value: '2'
        }
      ],
      creditGenre: [
        {
          label: '挂账门店',
          value: '1'
        },
        {
          label: '挂账公司',
          value: '2'
        }
      ],
      creditStatus: [
        {
          label: '待处理',
          value: '0'
        },
        {
          label: '部分支付',
          value: '1'
        },
        {
          label: '已结清',
          value: '2'
        }
      ],
      // 汇总
      gather: {},
      flag: true,
      // 多选
      multipleTable: [],
      // 选中的挂账单
      allChecked: [],
      // 防止重复提交
      btnLoading: false
    }
  },
  // 页面加载
  created () {
    // 获取订单列表
    this.creditList(),
    this.getShops(),
    this.getCashier()
  },
  // 方法
  methods: {
    async creditList () {
      // eslint-disable-next-line eqeqeq
      // if (this.times.length > 0 && this.queryInfo.create_time == 10) {
      //   // eslint-disable-next-line camelcase
      //   this.queryInfo.start_time = this.times[0] / 1000
      //   // eslint-disable-next-line camelcase
      //   this.queryInfo.end_time = this.times[1] / 1000
      // }
      // // eslint-disable-next-line eqeqeq
      // if (this.queryInfo.create_time == 10 && this.times.length == 0) return this.$message.warning('请选择自定义时间段')
      const loading = this.$loading({
          lock: true,
          text: 'Loading',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.1)'
        });
      const { data: res } = await this.$http.post('mapi/account', this.queryInfo)
      if (res.status !== 1) return this.$message.error('获取挂账列表失败！')
      // this.$message.success('获取挂账列表成功！')
      // console.log('挂账列表', res);
      loading.close()
      this.tableData = res.list
      // this.shopList = res.shop
      // this.cashierOptions = res.cashier
      this.total = res.count
      this.gather = res.total
    },
    // 获取店铺列表
    async getShops() {
      const { data: res } = await this.$http.get("mapi/ShareCommon/shop");
      if (res.code !== 200) return this.$message.error(res.msg);
      this.shopList = res.shop;
      console.log("getShops", res.shop);
    },
    // 获取收银员
    async getCashier() {
      const { data: res } = await this.$http.get("mapi/ShareCommon/cashier");
      if (res.code !== 200) return this.$message.error(res.msg);
      this.cashierOptions = res.cashier;
      console.log("getCashier", res.cashier);
    },
    // 分页
    handleSizeChange (e) {
      this.queryInfo.pagesize = e
      this.creditList()
    },
    // 分页
    handleCurrentChange (e) {
      this.queryInfo.pagenum = e
      this.creditList()
    },
     // 查询时间更改
    timeChange(val) {
      console.log('val', val);
      this.queryInfo.start_time = parseInt(val[0] / 1000);
      this.queryInfo.end_time = parseInt(val[1] / 1000);
    },
    // 查看订单详情
    onShowDialog (row) {
      this.gatherForm = {
        // eslint-disable-next-line camelcase
        on_account_id: row.oid, // 挂账单id
        type: '', // 收款方式
        // eslint-disable-next-line camelcase
        member_id: '', // 会员id
        // eslint-disable-next-line camelcase
        card_number: '', // 会员卡号
        // eslint-disable-next-line camelcase
        payee_object: 2, // 收款对象
        // eslint-disable-next-line camelcase
        payee_price: row.await_price, // 收款金额
        // eslint-disable-next-line camelcase
        coupon_price: 0, // 优惠金额
        thumb: '', // 收款凭证图片
        intro: '' // 备注
      }
      this.flag = true
      this.gatherDialogVisible = true
    },
    // /搜搜
    onsearch () {
      // eslint-disable-next-line eqeqeq
      if (this.queryInfo.number == 1) return this.$message.warning('请输入订单号')
      // eslint-disable-next-line eqeqeq
      if (this.queryInfo.number == 2) return this.$message.warning('请输入挂账单位')
      // eslint-disable-next-line eqeqeq
      if (this.queryInfo.number == 3) return this.$message.warning('请输入联系方式')
      this.creditList()
    },
    cellClick (row, column, cell, event) {
      console.log(row, column, cell, event)
    },
    checkboxT (row, index) {
      // eslint-disable-next-line eqeqeq
      if (row.state == 2) {
        return 0
      } else {
        return 1
      }
    },
    dateChange () {
      console.log(this.times)
    },
    // 总计
    getSummaries (param) {
      const { columns } = param
      const sums = []
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '总计'
          // eslint-disable-next-line no-useless-return
          return
        }
        if (index === 4) {
          sums[index] = this.gather.price + '元'
          // eslint-disable-next-line no-useless-return
          return
        }
        if (index === 5) {
          sums[index] = this.gather.pay_price + '元'
          // eslint-disable-next-line no-useless-return
          return
        }
        if (index === 6) {
          sums[index] = this.gather.coupon_price + '元'
          // eslint-disable-next-line no-useless-return
          return
        }
        if (index === 7) {
          sums[index] = this.gather.await_price + '元'
          // eslint-disable-next-line no-useless-return
          return
        }
      })

      return sums
    },
    // 挂账详情
    async onShowDetail (row) {
      console.log(row.oid)
      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      const { data: res } = await this.$http.get('mapi/detailAccount', { params: { id: row.oid } })
      if (res.status !== 1) return this.$message.error('查看挂账详情失败！')
      console.log(res)
      this.creditDetail = res.one
      this.tableList = res.two
      loading.close()
      this.creditDialogVisible = true
    },
    // 凭证放大
    onPreviewImg (file) {
      this.dialogImageUrl = file.url
      this.imgDialogVisible = true
    },
    // 图片上传之前判断图片大小 不超过2M
    beforeAvatarUpload (file, filelist) {
      const isLt2M = file.size / 1024 / 1024 < 10
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 10MB!')
        return false
      }
      // this.uploadDisabled = 'disabled'
      this.showdisabled = true
    },
    // 图片上传成功
    handleAvatarSuccess (file, fileList) {
      this.gatherForm.thumb = file.name
      this.uploadDisabled = 'disabled'
      this.showdisabled = false
      console.log('上传成功：', this.gatherForm.thumb)
    },
    handleAvatarError (file, filelist) {},
    handleRemove (file, filelist) {
      if (filelist.length === 0) {
      // 将变量置空
        this.uploadDisabled = ''
      }
    },
    async gatherBtn (flag) {
      this.btnLoading = true
      // eslint-disable-next-line eqeqeq
      if (this.gatherForm.type == '') return this.$message.warning('请选择收款方式！')

      // eslint-disable-next-line eqeqeq
      if (this.gatherForm.type == 1 && this.gatherForm.card_number == '') return this.$message.warning('请输入会员卡号！')
      // eslint-disable-next-line eqeqeq
      if (this.gatherForm.payee_price == '') return this.$message.warning('请输入收款金额！')
      // eslint-disable-next-line eqeqeq
      if (this.gatherForm.type == 1) {
        // eslint-disable-next-line camelcase
        this.gatherForm.payee_object = ''
      }
      // eslint-disable-next-line eqeqeq
      if (this.gatherForm.type == 2) {
        // eslint-disable-next-line camelcase
        this.gatherForm.card_number = ''
      }
      // console.log(this.oid)
      if (flag) {
        const { data: res } = await this.$http.post('mapi/proceedsAccount', this.gatherForm)
        console.log(res)
        if (res.status !== 1) return this.$message.error(res.msg)
        this.$message.success('收款成功！')
        this.gatherDialogVisible = false
        this.btnLoading = false
        this.creditList()
      } else {
        // eslint-disable-next-line eqeqeq
        if (this.gatherForm.payee_object == '') return this.$message.warining('请选择支付到')
        this.allChecked.forEach((item, index) => {
          this.allChecked[index].type = this.gatherForm.type
          // eslint-disable-next-line camelcase
          this.allChecked[index].payee_object = this.gatherForm.payee_object
          this.allChecked[index].intro = this.gatherForm.intro
          this.allChecked[index].thumb = this.gatherForm.thumb
          // eslint-disable-next-line camelcase
          this.allChecked[index].member_id = this.gatherForm.member_id
          // eslint-disable-next-line camelcase
          this.allChecked[index].card_number = this.gatherForm.card_number
        })
        console.log('allChecked', this.allChecked)
        // eslint-disable-next-line camelcase
        const { data: res } = await this.$http.post('mapi/proceedsAccountAll', { on_account: JSON.stringify(this.allChecked) })
        console.log(res)
        if (res.status !== 1) return this.$message.error(res.msg)
        this.$message.success('批量收款成功！')
        this.gatherDialogVisible = false
        this.btnLoading = false
        this.creditList()
      }
    },
    // 多选
    handleSelectionChange (val) {
      // eslint-disable-next-line camelcase
      this.gatherForm = {
        // eslint-disable-next-line camelcase
        on_account_id: '', // 挂账单id
        type: '', // 收款方式
        // eslint-disable-next-line camelcase
        member_id: '', // 会员id
        // eslint-disable-next-line camelcase
        card_number: '', // 会员卡号
        // eslint-disable-next-line camelcase
        payee_object: 2, // 收款对象
        // eslint-disable-next-line camelcase
        payee_price: 0, // 收款金额
        // eslint-disable-next-line camelcase
        coupon_price: 0, // 优惠金额
        thumb: '', // 收款凭证图片
        intro: '' // 备注
      }
      this.multipleTable = val
      this.allChecked = []

      val.forEach((item, index) => {
        const obj = {
        // eslint-disable-next-line camelcase
          on_account_id: item.oid, // 挂账单id
          type: '', // 收款方式
          // eslint-disable-next-line camelcase
          member_id: '', // 会员id
          // eslint-disable-next-line camelcase
          card_number: '', // 会员卡号
          // eslint-disable-next-line camelcase
          payee_object: 2, // 收款对象
          // eslint-disable-next-line camelcase
          payee_price: item.await_price, // 收款金额
          thumb: '', // 收款凭证图片
          intro: '' // 备注
        }
        this.allChecked.push(obj)
        // eslint-disable-next-line camelcase
        this.gatherForm.payee_price += parseFloat(item.await_price)
      })
      console.log(this.gatherForm.payee_price)
    },
    // 批量处理
    allChange () {
      // eslint-disable-next-line eqeqeq
      if (this.multipleTable.length == 0) return this.$message.warning('请选择要处理的挂账单！')
      this.flag = false
      console.log(this.allChecked)
      this.gatherDialogVisible = true
    }
  },
  // 监听属性
  watch: {},
  // 组件
  component: {},
  // 计算属性
  computed: {
    getisdisabled () {
      // eslint-disable-next-line eqeqeq
      if (this.queryInfo.create_time == 10) {
        return false
      }
      // eslint-disable-next-line vue/no-side-effects-in-computed-properties
      this.times = ''
      return true
    }

  }
}
</script>

<style lang="less" scoped>
.el-select {
  width: 120px;
  margin-right: 10px;
}
.el-input {
  width: 250px;
  }
.el-date-editor{
  width: 230px;
    margin-right: 10px;
}
.el-pagination {
  text-align: right;
}
.el-row .title{font-size:20px;color:#333;padding-bottom:10px;border-bottom:1px solid #f9f9f9;margin-bottom:10px;}
.el-row p{line-height: 30px;font-size:12px;}
</style>
<style lang="less">
   .disabled{
   .el-upload--picture-card {
    display: none;
   }
 }
 </style>
