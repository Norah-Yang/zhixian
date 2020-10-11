<template>
    <div>
      <!-- 面包屑导航区域 -->
      <!-- <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>您当前所在位置</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>会员卡管理</el-breadcrumb-item>
        <el-breadcrumb-item>会员卡列表</el-breadcrumb-item>
      </el-breadcrumb> -->
      <el-card>
        <div class="total_box mb10">
           <p>· 会员卡总数: {{total}}</p>
           <p>· 会员充值金额: {{statistics.AllTopUp}} ( 优惠:{{statistics.AllDiscounts}} 实收:{{statistics.AllOfficialReceipts}} 会员消费金额:{{statistics.AllConsume}} 会员卡余额: {{statistics.AllRemainingSum}} )</p>
        </div>
        <el-row class="mb10">
          <el-col :span="24">
             <el-select v-model="queryInfo.shop_id" placeholder="选择门店" size="mini">
                <el-option
                  v-for="item in shopOptions"
                  :key="item.id"
                  :label="item.title"
                  :value="item.id">
                </el-option>
             </el-select>
            <el-select v-model="queryInfo.cashier_id" placeholder="选择收银员" size="mini">
                <el-option
                  v-for="item in cashierOptions"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
             </el-select>
            <el-select v-model="queryInfo.type_id" placeholder="选择卡类型" size="mini">
                <el-option
                  v-for="item in cardTypeOptions"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
             </el-select>
            <el-date-picker
              v-model="seletTime"
              type="daterange"
              align="right"
              unlink-panels
              size="mini"
              value-format="timestamp"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              @change="timeChange"
              :picker-options="pickerOptions">
            </el-date-picker>
            <el-select v-model="queryInfo.key_id" placeholder="请选择" size="mini">
                <el-option
                  v-for="item in memberOptions"
                  :key="item.id"
                  :label="item.value"
                  :value="item.id">
                </el-option>
             </el-select>
             <el-input placeholder="请输入内容" v-model="queryInfo.keyword" size="mini">
                <el-button slot="append" @click="onsearch" icon="el-icon-search"></el-button>
              </el-input>
          </el-col>
        </el-row>
        <el-row class="mb10">
          <el-col :span="24">
            <el-button type="primary"  size="mini" @click="AddCard">新增 <i class="el-icon-circle-plus-outline"></i></el-button>
            <el-button type="primary" size="mini" @click="outputExcel">导出会员卡 <i class="el-icon-upload2" ></i></el-button>
          </el-col>
        </el-row>
         <el-table :data="tableData" border style="width: 100%" height="500">
            <el-table-column prop="mid" label="会员id" width="70px" ></el-table-column>
            <el-table-column prop="name" label="会员卡姓名" width="100px"></el-table-column>
            <el-table-column prop="card_number" label="会员卡号" width="100px"></el-table-column>
            <el-table-column prop="type_name" label="会员卡类型" width="120px" ></el-table-column>
            <el-table-column prop="grade_name" label="会员卡等级" width="100px" ></el-table-column>
            <el-table-column prop="phone" label="会员卡手机"  width="120px"></el-table-column>
            <el-table-column prop="remaining_sum" label="会员卡余额" width="100px" ></el-table-column>
            <el-table-column prop="score" label="会员卡积分"  width="100px"></el-table-column>
            <el-table-column prop="top_up" label="累计充值" sortable width="120px"></el-table-column>
            <el-table-column prop="give_money" label="累计优惠" sortable  width="120px"></el-table-column>
            <el-table-column prop="official_receipts" label="累计实收" sortable  width="120px"></el-table-column>
            <el-table-column prop="consume" label="累计消费" sortable  width="120px"></el-table-column>
            <el-table-column prop="add_time" label="注册日期"  width="170px"></el-table-column>
            <el-table-column prop="title" label="注册门店"  width="100px"></el-table-column>
            <el-table-column prop="cashier" label="注册人"  width="70px"></el-table-column>
            <el-table-column prop="address" label="会员卡地址"  width="120px"></el-table-column>
            <el-table-column label="状态"  width="70px">
              <template slot-scope="scope">
                {{scope.row.del == 0? '正常': '停用'}}
              </template>
            </el-table-column>
            <el-table-column prop="mid" label="操作" width="250" fixed="right">
              <template slot-scope="scope">
                  <el-button class="elbtn" type="primary" @click="editMem(scope.row)" size="mini">编辑</el-button>
                  <el-button class="elbtn" @click="checkRecord(scope.row)" size="mini">交易记录</el-button>
                   <el-select v-model="scope.row.moreOperations" placeholder="更多操作" size="mini" @change="moreChange(scope.row)"  class="elselect" propper-class="elselect">
                      <el-option
                        v-for="item in moreOptions"
                        class="moreOpt"
                        :key="item.id"
                        :label="item.value"
                        :value="item.id">
                      </el-option>
                  </el-select>
              </template>
            </el-table-column>
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
      <el-dialog :title="topupform.money_type == 1?'会员卡充值':'会员卡扣款'" :visible.sync="topupFormVisible" class="elDialog" @closed="topupFormClosed('topupformRef')">
        <el-form :model="topupform" :rules="topupFormRules" ref="topupformRef">
          <el-form-item label="会员卡号" :label-width="formLabelWidth">
            <el-input v-model="topupform.card_number" disabled  autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="选择储值门店" :label-width="formLabelWidth" prop="shop_id">
            <el-select v-model="topupform.shop_id" placeholder="请选择门店" @change="topupShopChange">
              <el-option v-for="item in shopArr" :label="item.title" :value="item.id" :key="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="收银员" :label-width="formLabelWidth" v-if="topupform.shop_id !== ''">
            <el-select v-model="topupform.manage_user_id" placeholder="请选择收银员">
              <el-option v-for="item in cashierArr" :label="item.name" :value="item.mid" :key="item.mid"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="机器码" :label-width="formLabelWidth"  v-if="topupform.shop_id !== ''">
            <el-select v-model="topupform.machine" placeholder="请选择机器码">
              <el-option v-for="item in machineArr" :label="item.machine" :value="item.machine" :key="item.machine"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="营业日" :label-width="formLabelWidth"  v-if="topupform.shop_id !== ''">
            <el-input v-model="topupform.date" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="班次" :label-width="formLabelWidth"  v-if="topupform.shop_id !== ''">
            <el-input v-model="topupform.classes" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item :label="topupform.money_type == 1?'支付方式':'扣款方式'" :label-width="formLabelWidth" prop="pay_type">
             <el-select v-model="topupform.pay_type" placeholder="请选择支付方式">
              <el-option v-for="item in payArr" :label="item.name" :value="item.id" :key="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item :label="topupform.money_type == 1?'储值实收金额':'扣实收金额'" :label-width="formLabelWidth" prop="money">
            <el-input v-model="topupform.money" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item :label="topupform.money_type == 1?'赠送储值金额':'扣赠送金额'" :label-width="formLabelWidth" >
            <el-input v-model="topupform.give_money" autocomplete="off"></el-input>
          </el-form-item>
           <el-form-item :label="topupform.money_type == 1?'储值说明':'扣款说明'" :label-width="formLabelWidth" >
            <el-input type="textarea" :rows="3" v-model="topupform.intro" autocomplete="off" class="area"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="topupFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="topupSubmit('topupformRef')" v-no-click>确 定</el-button>
        </div>
      </el-dialog>
      <el-dialog :title="scoreform.score_type == 1?'会员卡增加积分': '会员卡扣除积分'" :visible.sync="scoreFormVisible" class="elDialog" @closed="scoreFormClosed('scoreformRef')">
        <el-form :model="scoreform" :rules="scoreFormRules" ref="scoreformRef">
          <el-form-item label="会员卡号" :label-width="formLabelWidth">
            <el-input v-model="scoreform.card_number" disabled  autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="会员积分" :label-width="formLabelWidth">
            <el-input v-model="scoreform.front_score" disabled  autocomplete="off"></el-input>
          </el-form-item>

          <el-form-item :label="scoreform.score_type == 1?'增加积分':'减少积分'" :label-width="formLabelWidth" prop="score">
            <el-input v-model="scoreform.score" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="关联订单" :label-width="formLabelWidth" v-if="scoreform.score_type == 2" >
            <el-input v-model="scoreform.order_no" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="备注说明" :label-width="formLabelWidth" >
            <el-input type="textarea" :rows="3" v-model="scoreform.note" autocomplete="off" class="area"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="scoreFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="scoreSubmit('scoreformRef')" v-no-click>确 定</el-button>
        </div>
      </el-dialog>
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
      shopOptions: [], // 门店选项
      cashierOptions: [], // 收银员选项
      cardTypeOptions: [], // 可类型选项
      moreOperations: '', // 操作更多
      moreOptions: [
        {
          id: 1,
          value: '充值'
        },
        {
          id: 2,
          value: '扣款'
        },
        {
          id: 3,
          value: '积分明细'
        },
        {
          id: 4,
          value: '加积分'
        },
        {
          id: 5,
          value: '减积分'
        }
      ],
      pickerOptions: {
        shortcuts: selectDate
      },
      seletTime: seletTime, // 选择的时间数组
      // 查询条件
      queryInfo: {
        // eslint-disable-next-line camelcase
        shop_id: '', // 门店id
        // eslint-disable-next-line camelcase
        cashier_id: '', // 收银员
        // eslint-disable-next-line camelcase
        type_id: '', // 卡类型
        keyword: '', // 关键字
        // eslint-disable-next-line camelcase
        start_time: parseInt(startTime/1000), // 开始时间
        // eslint-disable-next-line camelcase
        end_time: parseInt(endTime /1000), // 结束时间
        // eslint-disable-next-line camelcase
        key_id: '',
        page: 1,
        pagesize: 10
      },
      memberOptions: [
        {
          id: 1,
          value: '会员卡号'
        },
        {
          id: 2,
          value: '会员手机'
        },
        {
          id: 3,
          value: '会员姓名'
        },
        {
          id: 4,
          value: '会员ID'
        }
      ],
      tableData: [], // 列表数据
      total: 0, // 列表总条数
      // 会员卡充值
      topupform: {
        // eslint-disable-next-line camelcase
        card_number: '',
        // eslint-disable-next-line camelcase
        shop_id: '',
        // eslint-disable-next-line camelcase
        pay_type: '',
        // eslint-disable-next-line camelcase
        manage_user_id: '',
        date: '',
        classes: '',
        machine: '',
        // eslint-disable-next-line camelcase
        money: 0,
        // eslint-disable-next-line camelcase
        give_money: 0,
        // eslint-disable-next-line camelcase
        intro: '',
        // eslint-disable-next-line camelcase
        money_type: '',
        // eslint-disable-next-line camelcase
        score_type: ''

      },
      formLabelWidth: '120px', // label宽度
      topupFormVisible: false, // 充值弹框
      shopArr: [],
      cashierArr: [],
      machineArr: [],
      payArr: [], // 支付方式
      // 充值验证
      topupFormRules: {
        // eslint-disable-next-line camelcase
        shop_id: [
          { required: true, message: '请选择储值门店', trigger: 'blur' }
        ],
        // eslint-disable-next-line camelcase
        pay_type: [
          { required: true, message: '请选择支付方式', trigger: 'blur' }
        ],
        // eslint-disable-next-line camelcase
        money: [
          { required: true, message: '请输入金额', trigger: 'blur' }
        ]
      },
      scoreFormVisible: false, // 积分修改弹窗
      scoreform: {
        // eslint-disable-next-line camelcase
        card_number: '', // 会员卡号
        // eslint-disable-next-line camelcase
        front_score: '', // 会员现有积分
        score: '', // 增加或删除积分
        // eslint-disable-next-line camelcase
        order_no: '', // 删除积分关联单号
        note: '', // 备注说明
        // eslint-disable-next-line camelcase
        score_type: ''
      },
      // 积分加扣验证
      scoreFormRules: {
        // eslint-disable-next-line camelcase
        score: [
          { required: true, message: '请填写积分', trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    this.getCardList()
    this.getShops()
    this.getCashier()
    this.getCardType()
  },
  methods: {
    async getCardList () {
      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.1)'
      })
      // console.log('this.queryInfo',this.queryInfo);
      const { data: res } = await this.$http.post('mapi/memberMember', this.queryInfo)
      this.tableData = res.list.data
      this.total = res.list.total
      this.statistics = res.statistics
      loading.close()
    },
    // 获取店铺列表
    async getShops(){
      const { data: res } = await this.$http.get('mapi/ShareCommon/shop')
       if (res.code !== 200) return this.$message.error(res.msg)
       this.shopOptions = res.shop
       
    },
    // 获取收银员列表
    async getCashier(){
      const { data: res } = await this.$http.get('mapi/ShareCommon/cashier')
       if (res.code !== 200) return this.$message.error(res.msg)
       this.cashierOptions = res.cashier
       
    },
    // 获取会员卡类型列表
    async getCardType(){
      const { data: res } = await this.$http.get('mapi/ShareCommon/memberType')
       if (res.code !== 200) return this.$message.error(res.msg)
      //  console.log('cardTypeOptions',res);
       this.cardTypeOptions = res.type
       
    },
    // 查询时间更改
    timeChange (val) {
        // eslint-disable-next-line camelcase
        this.queryInfo.start_time = parseInt(this.seletTime[0] / 1000)
        // eslint-disable-next-line camelcase
        this.queryInfo.end_time = parseInt(this.seletTime[1] / 1000)

    },
    // 搜索
    onsearch () {
      this.getCardList()
    },
    AddCard () {
      this.$router.push('addmemcard')
    },
    // 分页 一页显示多少条
    handleSizeChange (newSize) {
      this.queryInfo = {
        // eslint-disable-next-line camelcase
        shop_id: '', // 门店id
        // eslint-disable-next-line camelcase
        cashier_id: '', // 收银员
        // eslint-disable-next-line camelcase
        type_id: '', // 卡类型
        keyword: '', // 关键字
        // eslint-disable-next-line camelcase
        start_time: '', // 开始时间
        // eslint-disable-next-line camelcase
        end_time: '', // 结束时间
        // eslint-disable-next-line camelcase
        key_id: '',
        page: this.queryInfo.page,
        pagesize: newSize
      }
      this.getCardList()
    },
    // 分页 跳转到多少页
    handleCurrentChange (newPage) {
      this.queryInfo = {
        // eslint-disable-next-line camelcase
        shop_id: '', // 门店id
        // eslint-disable-next-line camelcase
        cashier_id: '', // 收银员
        // eslint-disable-next-line camelcase
        type_id: '', // 卡类型
        keyword: '', // 关键字
        // eslint-disable-next-line camelcase
        start_time: '', // 开始时间
        // eslint-disable-next-line camelcase
        end_time: '', // 结束时间
        // eslint-disable-next-line camelcase
        key_id: '',
        page: newPage,
        pagesize: this.queryInfo.pagesize
      }
      this.getCardList()
    },
    // 交易记录
    checkRecord (row) {
      sessionStorage.setItem('tradeCardNum', row.card_number)
      this.$router.push({ name: 'tradingrecord', params: { tradeCardNum: row.card_number } })
    },
    // 编辑会员
    editMem (row) {
      // console.log(row)
      sessionStorage.setItem('mid', row.mid)
      this.$router.push({
        name: 'editmemcard',
        params: {
          id: row.mid
        }
      })
    },
    // 更多操作
    async moreChange (row) {
      console.log(row)
      // eslint-disable-next-line camelcase
      this.topupform.card_number = row.card_number
      // eslint-disable-next-line camelcase
      this.scoreform.card_number = row.card_number
      // eslint-disable-next-line eqeqeq
      if (row.moreOperations == 1) {
        this.topupFormVisible = true
        // eslint-disable-next-line camelcase
        this.topupform.money_type = 1
        // eslint-disable-next-line camelcase
        const { data: res } = await this.$http.get('mapi/memberTopUp', { params: { card_number: row.card_number } })
        console.log(res)
        if (res.code !== 200) return this.$message.error('获取会员卡信息失败！')
        this.shopArr = res.shop
        this.payArr = res.pay_type
      // eslint-disable-next-line eqeqeq
      } else if (row.moreOperations == 2) {
        this.topupFormVisible = true
        // eslint-disable-next-line camelcase
        this.topupform.money_type = 2
        // eslint-disable-next-line camelcase
        const { data: res } = await this.$http.get('mapi/memberTopUp', { params: { card_number: row.card_number } })
        console.log(res)
        if (res.code !== 200) return this.$message.error('获取会员卡信息失败！')
        this.shopArr = res.shop
        this.payArr = res.pay_type
      // eslint-disable-next-line eqeqeq
      } else if (row.moreOperations == 3) {
        sessionStorage.setItem('mCardNum', row.card_number)
        this.$router.push({
          name: 'scorerecord',
          params: { mCardNum: row.card_number }
        })
      // eslint-disable-next-line eqeqeq
      } else if (row.moreOperations == 4) {
        this.scoreFormVisible = true
        // eslint-disable-next-line camelcase
        this.scoreform.score_type = 1
        // eslint-disable-next-line camelcase
        const { data: res } = await this.$http.get('mapi/memberPlusScore', { params: { card_number: row.card_number } })
        // eslint-disable-next-line camelcase
        if (res.code !== 200) return this.$message.error('获取积分失败！')
        // eslint-disable-next-line camelcase
        this.scoreform.front_score = res.score
        console.log(res)
      // eslint-disable-next-line eqeqeq
      } else if (row.moreOperations == 5) {
        this.scoreFormVisible = true
        // eslint-disable-next-line camelcase
        this.scoreform.score_type = 2
        // eslint-disable-next-line camelcase
        const { data: res } = await this.$http.get('mapi/memberPlusScore', { params: { card_number: row.card_number } })
        // eslint-disable-next-line camelcase
        if (res.code !== 200) return this.$message.error('获取积分失败！')
        // eslint-disable-next-line camelcase
        this.scoreform.front_score = res.score
        console.log(res)
      }
      row.moreOperations = ''
    },
    // 充值扣除门店更改
    topupShopChange (val) {
      console.log(val)
      this.shopArr.forEach(item => {
        // eslint-disable-next-line eqeqeq
        if (item.id == val) {
          this.cashierArr = item.cashier
          this.machineArr = item.machine
          this.topupform.cashier = item.cashier[0].mid || ''
          this.topupform.machine = item.machine[0].machine || ''
          this.topupform.date = this.getNowDate(new Date())
          return false
        }
      })
    },
    // 充值扣除提交
    topupSubmit (formName) {
      this.$refs[formName].validate(async valid => {
        if (valid) {
          console.log(this.topupform)
          const { data: res } = await this.$http.post('mapi/memberTopUp', this.topupform)
          this.topupform = {
            // eslint-disable-next-line camelcase
            card_number: '',
            // eslint-disable-next-line camelcase
            shop_id: '',
            // eslint-disable-next-line camelcase
            pay_type: '',
            cashier: '',
            date: '',
            classes: '',
            machine: '',
            // eslint-disable-next-line camelcase
            money: 0,
            // eslint-disable-next-line camelcase
            give_money: 0,
            // eslint-disable-next-line camelcase
            intro: '',
            // eslint-disable-next-line camelcase
            money_type: '',
            // eslint-disable-next-line camelcase
            score_type: ''
          }
          if (res.code !== 200) return this.$message.error('修改失败, 请重新修改！')
          this.$message.success('修改成功')
          this.topupFormVisible = false
          // eslint-disable-next-line camelcase
          this.topupform.member_type = ''
          this.getCardList()
        } else {
          this.$message.error('请检查是否填写完善！！')
          return false
        }
      })
    },
    // 积分增加扣除提交
    scoreSubmit (formName) {
      this.$refs[formName].validate(async valid => {
        if (valid) {
          console.log(this.scoreform)
          const { data: res } = await this.$http.post('mapi/memberPlusScore', this.scoreform)
          this.scoreform = {
            // eslint-disable-next-line camelcase
            card_number: '', // 会员卡号
            // eslint-disable-next-line camelcase
            front_score: '', // 会员现有积分
            score: '', // 增加或删除积分
            // eslint-disable-next-line camelcase
            order_no: '', // 删除积分关联单号
            note: '', // 备注说明
            // eslint-disable-next-line camelcase
            score_type: ''
          }
          if (res.code !== 200) return this.$message.error('修改失败, 请重新修改！')
          this.$message.success('修改成功')
          this.scoreFormVisible = false
          // eslint-disable-next-line camelcase
          this.topupform.score_type = ''
          this.getCardList()
        } else {
          this.$message.error('请检查是否填写完善！！')
          return false
        }
      })
    },
    // 导出会员卡列表信息
    outputExcel () {
      this.$confirm('每次最多导出1万条数据，多余1万条数据导出请联系技术人员协助', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
      // this.getExcelGoodList()
        const loading = this.$loading({
          lock: true,
          text: '正在导出，请稍等......',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        })
        const _this = this
        this.$http.post('mapi/memberExcel ')
          .then(function (res) {
            _this.excelGoodList = res.data.list
            console.log(res.data.list)
            const exportData = res.data.list
            if (exportData.length > 0) {
              require.ensure([], () => {
                const { exportJsonToExcel } = require('../../../vendor/Export2Excel')
                const tHeader = ['门店', '收银员', '会员ID', '会员卡号', '会员姓名', '会员手机', '会员生日', '会员卡余额', '会员卡积分', '累计充值', '累计优惠', '累计实收', '累计消费', '地址', '注册日期']
                const filterVal = ['title', 'cashier', 'id', 'card_number', 'name', 'phone', 'birthday', 'remaining_sum', 'score', 'top_up', 'give_money', 'official_receipts', 'consume', 'address', 'add_time']
                const data = _this.formatJson(filterVal, exportData)
                exportJsonToExcel(tHeader, data, '会员卡' + _this.getNowDate(new Date()))
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
      // this.$message.success('导出Excel成功！')
    },
    // 充值扣款Dialog关闭时清除验证
    topupFormClosed (formName) {
      this.$refs[formName].clearValidate()
    },
    // 加减积分Dialog关闭时清除验证
    scoreFormClosed (formName) {
      this.$refs[formName].clearValidate()
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
}
.el-select.elselect{
  width:92px;
  margin-right:0;
}
.el-input{
  width:220px;
}
.elbtn{
  margin-left:0;
}
.el-date-editor{
  width: 230px;
    margin-right: 10px;
}
.elDialog .el-select {width:80%;}
.elDialog .el-input {width:80%;}
.elDialog .area{ width:80%;}
// .elselect /deep/ .moreOpt:nth-child(2) span,
// .elselect /deep/ .moreOpt:last-child span {color:red;}
.el-pagination{text-align: right;margin-top:20px;}

</style>
