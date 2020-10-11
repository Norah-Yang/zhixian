
<template>
  <div>
    <el-card shadow="always">
      <el-row>
        <el-col :span="20">
          <el-select v-model="Page.state" placeholder="上架状态">
            <el-option
              v-for="item in coupons.state"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
          <el-select v-model="Page.type" placeholder="优惠券类型">
            <el-option
              v-for="item in coupons.type"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
          <el-select v-model="Page.id" placeholder="优惠券类型">
            <el-option
              v-for="item in coupons.name"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
          <el-input placeholder="请输入内容" v-model="Page.keyword" clearable class="input-with-select">
            <el-button slot="append" icon="el-icon-search" @click="onserch"></el-button>
          </el-input>
          <el-button type="danger" @click="onclears">清除搜索</el-button>
        </el-col>
        <el-col :span="4" style="text-align: right;">
          <el-button type="primary" @click="onaddtuan">新增</el-button>
        </el-col>
      </el-row>
      <div class="height"></div>
      <el-row>
        <el-col :span="24">
          <el-table border="" :data="tableList" style="width: 100%" stripe>
            <el-table-column label="优惠券名称" prop="name"></el-table-column>
            <el-table-column label="优惠券类型" prop="type" width="180">
              <template slot-scope="row">
                <div v-if="row.row.type=='1'">代金券</div>
                <div v-else-if="row.row.type=='2'">折扣券</div>
                <div v-else>免单券</div>
              </template>
            </el-table-column>
            <el-table-column label="面值（元）" prop="money"></el-table-column>
            <el-table-column label="使用条件" prop="use_state">
              <template slot-scope="row">
                <div v-if="row.row.use_state==0">通用</div>
                <div v-if="row.row.use_state==1">线上商城</div>
                <div v-if="row.row.use_state==2">门店收银</div>
                <div v-if="row.row.use_state==3">微社区小程序</div>
              </template>
            </el-table-column>
            <el-table-column label="有效期" prop="time_state" width="180">
              <template slot-scope="row">
                <div v-if="row.row.pay_state==0">固定期限</div>
                <div v-else>领取后，{{row.row.time_state}}天内有效</div>
              </template>
            </el-table-column>
            <el-table-column label="数量" prop="amount"></el-table-column>
            <el-table-column label="使用方式" prop="use_state">
              <template slot-scope="row">
                <div v-if="row.row.use_state==0">通用</div>
                <div v-if="row.row.use_state==1">线上商城</div>
                <div v-if="row.row.use_state==2">门店收银</div>
                <div v-if="row.row.use_state==3">微社区小程序</div>
              </template>
              <!-- $use_state = input('post.use_state');//0 通用 1线上商城 2门店收银 3微社区小程序 -->
            </el-table-column>
            <el-table-column label="状态">
              <template slot-scope="row">
                <el-switch
                  v-model="row.row.open"
                  active-color="#008080"
                  inactive-color="#ff4949"
                  active-text="是"
                  inactive-text="否"
                  @change="onchange(row)"
                ></el-switch>
              </template>
            </el-table-column>
            <el-table-column label="发放方式" prop="coupon_give" width="250">
              <template slot-scope="row">
                <div v-if="row.row.coupon_give">
                  <span v-if="row.row.coupon_give.type==1">【线上发放】</span>
                  <span v-if="row.row.coupon_give.type==2">【线下发放】</span>
                  <span v-if="row.row.coupon_give.type==3">【满减赠券】</span>
                  <span v-if="row.row.coupon_give.up==1">线上关注公众号</span>
                  <span v-if="row.row.coupon_give.up==3">关键词回复</span>
                  <span v-if="row.row.coupon_give.up==3">会员卡储值</span>
                  <span v-if="row.row.coupon_give.up==4">购买发放</span>
                  <span v-if="row.row.coupon_give.up==5">扫码发放</span>
                  <span v-if="row.row.coupon_give.up==6">会员标签群发</span>
                  <span v-if="row.row.coupon_give.up==7">主动领取</span>
                  <span v-if="row.row.coupon_give.up==8">积分兑换</span>
                </div>
                <div v-else>免单券</div>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="280">
              <template slot-scope="row">
                <!-- <el-button size="small" type="primary" @click="onaddClass(row)">添加</el-button> -->
                <el-button
                  size="small"
                  type="primary"
                  @click="onfafang(row)"
                  v-if="row.row.type!=3"
                  v-no-click
                >发放</el-button>
                <el-button
                  size="small"
                  type="info"
                  v-if="!row.row.coupon_give"
                  @click="oneditone(row)"
                  v-no-click
                >编辑</el-button>
                <el-button v-else size="small" type="info" v-no-click @click="onview(row)">查看</el-button>
              </template>
            </el-table-column>
          </el-table>
          <div class="height"></div>
          <div class="pagination">
            <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
      :page-sizes="[10, 12, 15, 20]"
              layout="total, sizes, prev, pager, next, jumper"
              :total="Page.count"
            ></el-pagination>
          </div>
        </el-col>
      </el-row>
    </el-card>
    <!-- 优惠券添加 -->
    <el-dialog
      title="提示"
      :visible.sync="dialogVisible"
      width="50%"
      :show-close="false"
      :destroy-on-close="true"
    >
      <el-form :model="ruleForm1" :rules="rules" ref="ruleForms" label-width="130px">
        <el-form-item label="优惠券类型">
          <el-select v-model="ruleForm1.type" :disabled="isdetie" placeholder="上架状态">
            <el-option
              v-for="item in coupons.type"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="优惠券名称" prop="name">
          <el-input v-model="ruleForm1.name" :disabled="isdetie" placeholder="10元优惠券"></el-input>
        </el-form-item>
        <el-form-item label="面值(元)" prop="money" v-if="rule.face">
          <el-input v-model="ruleForm1.money" placeholder="10元优惠券"></el-input>
        </el-form-item>
        <el-form-item label="折扣(折)" prop="money" v-if="rule.shekou">
          <el-input v-model="ruleForm1.money"></el-input>
        </el-form-item>
        <el-form-item label="每人限领" prop="everyone">
          <el-input v-model="ruleForm1.everyone" placeholder="建议每人限领一张"></el-input>
          <div style="color:#8B8B8B">优惠券限制领取数量，只能为大于零的整数</div>
        </el-form-item>
        <el-form-item label="使用有效期">
          <el-radio v-model="ruleForm1.time_state" label="0">固定日期</el-radio>
          <el-date-picker
            v-model="ruleForm1.times"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            format="yyyy 年 MM 月 dd 日"
            value-format="timestamp"
          ></el-date-picker>
          <div class="height"></div>
          <div>
            <el-radio v-model="ruleForm1.time_state" label="1">领取后</el-radio>
            <el-input v-model.trim="ruleForm1.time" style="width:20%" type="number"></el-input>天内有效
          </div>
        </el-form-item>
        <el-form-item label="时间段限制">
          <el-switch
            v-model="ruleForm1.time_type"
            active-color="#008080"
            inactive-color="#ff4949"
            active-text="是"
            inactive-text="否"
          ></el-switch>
          <div v-if="ruleForm1.time_type">
            <el-time-picker
              is-range
              v-model="ruleForm1.timearr"
              range-separator="至"
              value-format="HH:mm"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
              placeholder="选择时间范围"
            ></el-time-picker>
          </div>
        </el-form-item>
        <el-form-item label="使用限制" v-if="ruleForm1.type!=3">
          <el-radio v-model="ruleForm1.use_state" label="0">通用(线上/门店)</el-radio>
          <el-radio v-model="ruleForm1.use_state" label="1">线上商城</el-radio>
          <el-radio v-model="ruleForm1.use_state" label="2">门店收银</el-radio>
          <el-radio v-model="ruleForm1.use_state" label="3">微社区小程序</el-radio>
        </el-form-item>
        <el-form-item label="门店限制" v-if="rule.store">
          <el-radio v-model="ruleForm1.shop_state" label="0">所有门店</el-radio>
          <el-radio v-model="ruleForm1.shop_state" label="1">指定门店</el-radio>
        </el-form-item>
        <el-form-item label="门店选择" v-if="rule.mendain">
          <el-checkbox v-model="ruleForm1.checked">蔬当家</el-checkbox>
        </el-form-item>
        <!--   -->
        <el-form-item label="商品限制" v-if="rule.restrictions">
          <el-radio v-model="ruleForm1.goods_state" label="0" v-if="ruleForm1.type!=3">全部类型</el-radio>
          <el-radio v-model="ruleForm1.goods_state" label="1" v-if="rule.restriction_ra">指定类型</el-radio>
          <div style="color:#8B8B8B">(指定类型仅限线上商城商品)</div>
        </el-form-item>
        <el-form-item label="商品类型" v-if="rule.shop_type">
          <el-radio v-model="ruleForm1.goods_type" label="0" v-if="rule.tong">普通商品</el-radio>
          <el-radio v-model="ruleForm1.goods_type" label="1" v-if="rule.tuan">拼团商品</el-radio>
          <el-radio v-model="ruleForm1.goods_type" label="2" v-if="rule.miao">秒杀商品</el-radio>
        </el-form-item>
        <el-form-item label="活动商品" v-if="rule.goods">
          <el-radio
            v-model="ruleForm1.activity_goods_state"
            label="0"
            v-if="rule.activity_goods_state"
          >全部商品</el-radio>
          <el-radio v-model="ruleForm1.activity_goods_state" label="1">指定可用商品</el-radio>
          <el-radio
            v-model="ruleForm1.activity_goods_state"
            label="2"
            v-if="ruleForm1.type!=3"
          >指定不可用商品</el-radio>
          <div style="color:#8B8B8B">（免单券指定商品必须为团购商品中的分享团商品）</div>
        </el-form-item>
        <el-form-item label="添加商品" v-if="rule.commodity">
          <el-button type="primary" @click="onGoodsList">添加商品</el-button>
        </el-form-item>
        <el-form-item label="商品列表" v-if="rule.commodityList">
          <el-table ref="multipleTable" :data="ruleForm1.selecttable" border="" style="width: 100%">
            <el-table-column prop="pid" label="商品Id"></el-table-column>
            <el-table-column prop="title" label="商品名称"></el-table-column>
            <el-table-column prop="order_no" label="商品图片" width="180">
              <template slot-scope="row">
                <el-image style="width: 50px; height:50px" :src="row.row.thumb" fit="contain"></el-image>
              </template>
            </el-table-column>
            <el-table-column prop="title" label="商品分类"></el-table-column>
            <el-table-column prop="commodity_code" label="商品编号" width="180"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="row">
                <el-button size="mini" type="danger" @click="onShowDel(row)" v-no-click>删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
        <el-form-item label="优惠券描述">
          <el-input type="textarea" v-model="ruleForm1.message" :rows="3"></el-input>
        </el-form-item>
        <el-form-item label="是否可叠加">
          <el-switch
            v-model="ruleForm1.open"
            active-color="#008080"
            inactive-color="#ff4949"
            active-text="是"
            inactive-text="否"
          ></el-switch>
        </el-form-item>
        <el-form-item label="状态">
          <el-switch
            v-model="ruleForm1.states"
            active-color="#008080"
            inactive-color="#ff4949"
            active-text="是"
            inactive-text="否"
          ></el-switch>
        </el-form-item>
        <!-- 发放总量 -->
        <el-form-item label="发放总量(张)" prop="amount" v-if="ruleForm1.type!=3">
          <el-input v-model="ruleForm1.amount"></el-input>
          <div style="color:#8B8B8B">优惠券发放总量，只能为大于零的整数</div>
        </el-form-item>
        <el-form-item label="消费限制" v-if="ruleForm1.type!=3">
          <el-input v-model="ruleForm1.limit_money"></el-input>
          <div style="color:#8B8B8B">消费满多少元可用</div>
          <div style="color:#8B8B8B">默认为零时消费任意金额可用</div>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="onclose">取 消</el-button>
        <el-button type="primary" @click="onsubmit" v-if="!isdetie">提交</el-button>
        <el-button type="primary" @click="onedit" v-else>修改</el-button>
      </span>
      <!-- 亲淘对话框 -->
      <el-dialog
        width="50%"
        title="挑选商品"
        :visible.sync="innerVisible"
        append-to-body
        :show-close="false"
        :close-on-click-modal="false" :close-on-press-escape="false"
      >
        <el-row>
          <el-col :span="24">
            <el-select v-model="parameter.id" placeholder="请选择">
              <el-option
                v-for="item in  orderQuery"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
            <el-input placeholder="请输入内容" v-model="parameter.keyword" class="input-with-select">
              <el-button slot="append" @click="onserch" v-no-click>搜索</el-button>
            </el-input>
            <el-button type="danger" @click="onclear" v-no-click>清除</el-button>
          </el-col>
        </el-row>
        <div class="height"></div>
        <el-table
          ref="multipleTable"
          :data="tableData"
          border=""
          style="width: 100%"
          @selection-change="onselect"
        >
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column prop="pid" label="商品Id"></el-table-column>
          <el-table-column prop="title" label="商品名称"></el-table-column>
          <el-table-column prop="order_no" label="商品图片" width="180">
            <template slot-scope="row">
              <el-image style="width: 50px; height:50px" :src="row.row.thumb" fit="contain"></el-image>
            </template>
          </el-table-column>
          <el-table-column prop="title" label="商品分类"></el-table-column>
          <el-table-column prop="commodity_code" label="商品编号" width="180"></el-table-column>
        </el-table>
        <div class="height"></div>
        <div class="pagination">
          <el-pagination
            @size-change="handleSizeChanges"
            @current-change="handleCurrentChanges"
        :page-sizes="[10, 12, 15, 20]"
            layout="total, sizes, prev, pager, next, jumper"
            :total="parameter.count"
          ></el-pagination>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="innerVisible = false"  type="primary">确定</el-button>
        </span>
      </el-dialog>
    </el-dialog>
    <!-- 查看优惠券对话框 -->
    <el-dialog title="提示" :visible.sync="dialogview" width="30%" :show-close="false" :close-on-click-modal="false" :close-on-press-escape="false">
      <div class="dialog">
        <div>
          * 优惠券类型：
          <span v-if="viewData.type=='1'">代金券</span>
          <span v-else-if="viewData.type=='2'">折扣券</span>
          <span v-else>免单券</span>
        </div>
        <div>
          * 优惠券名称：
          <span>{{viewData.name}}</span>
        </div>
        <div>* 面值： {{viewData.money}}元</div>
        <div>* 发放总量： {{viewData.amount}}张</div>
        <div>* 每人限领：{{viewData.everyone}}张</div>
        <div>使用限制： 消费满{{viewData.limit_money}}元可用</div>
        <div>有效期： {{$moment(parseFloat(viewData.start_time)).format("YYYY-MM-DD")}}至 {{$moment(parseFloat(viewData.end_time)).format("YYYY-MM-DD")}}</div>
        <div>时间段限制： {{viewData.time_type=="0"?"是":"否"}}</div>
        <div>
          使用限制：
          <span v-if="viewData.use_state=='0'">通用</span>
          <span v-else-if="viewData.use_state=='1'">线上商城</span>
          <span v-else-if="viewData.use_state=='2'">门店收银</span>
          <span v-else-if="viewData.use_state=='3'">微社区小程序</span>
        </div>
        <div>门店限制： {{viewData.shop_state==0?"所有门店":"指定门店"}}</div>
        <div>商品限制： {{viewData.goods_state==0?"全部商品":"指定类型"}}</div>
        <div>
          商品类型：
          <span v-if="viewData.goods_type=='0'">普通商品</span>
          <span v-else-if="viewData.type=='1'">拼团商品</span>
          <span v-else>秒杀商品</span>
        </div>
        <!-- 0全部 1指定可用  2指定不可用 -->
        <div>
          活动商品：
          <span v-if="viewData.goods_type=='0'">全部</span>
          <span v-else-if="viewData.type=='1'">指定可用</span>
          <span v-else>指定不可用</span>
        </div>
        <div>优惠券描述：</div>
        <!-- <pre>{{viewData.give.type}}</pre> -->
        <div>
          * 发放方式：
          <span v-if="viewData.give.type=='1'">线上发放</span>
          <span v-else-if="viewData.give.type=='2'">线下发放</span>
          <span v-else-if="viewData.give.type=='3'">满减赠券</span>
        </div>
        <div>
          * 领取方式：
          <span v-if="viewData.give.up=='1'">【线上】关注公众号</span>
          <span v-else-if="viewData.give.up=='2'">关键词回复</span>
          <span v-else-if="viewData.give.up=='3'">会员卡储值</span>
          <span v-else-if="viewData.give.up=='4'">购买发放</span>
          <span v-else-if="viewData.give.up=='5'">扫码发放</span>
          <span v-else-if="viewData.give.up=='6'">会员标签群发</span>
          <span v-else-if="viewData.give.up=='7'">主动领取</span>
          <span v-else-if="viewData.give.up=='8'">积分兑换</span>
        </div>
        <div>发放总量： {{viewData.amount}}张</div>
        <div>每人限领： {{viewData.everyone}}张</div>
        <div>使用限制： 消费满{{viewData.limit_money}}元可用</div>
        <div>标题 :{{viewData.give.title}}</div>
        <div>* 描述 : {{viewData.give.intro}}</div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogview = false">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { coupons } from "@/common/select.js";
import { isonenumber } from "@/utils/validtel.js";
import { setTimeout } from "timers";
import { log } from "util";
export default {
  // props:[],
  // 页面加载
  created() {
    this.getwxcoupon();
  },
  // 页面加载完成
  mounted() {
    this.ruleForm1.use_state = "1";
    setTimeout(() => {
      this.ruleForm1.use_state = "0";
    });
    this.ruleForm1.type = 2;
    setTimeout(() => {
      this.ruleForm1.type = 1;
    });
  },
  data() {
    return {
      viewData: {
        give: {}
      }, //查看优惠券详情对像
      dialogview: false,
      isdetie: false,
      dialogVisible: false,
      innerVisible: false,
      coupons,
      tableData: [],
      tableList: [],
      Page: {
        pagenum: 1,
        pagesize: 10,
        count: 0,
        state: "",
        id: "",
        type: "",
        keyword: ""
      },
      ruleForm1: {
        type: 1,
        name: "",
        money: "",
        everyone: "",
        time_state: "0",
        times: [],
        start_time: "",
        end_time: "",
        time: "",
        time_type: false,
        use_state: "0",
        shop_state: "0",
        goods_state: "0",
        activity_goods_state: "0",
        message: "",
        open: true,
        amount: "",
        limit_money: "",
        goods_type: "1",
        selecttable: [],
        activity_goods_id: "",
        timearr: "",
        isgoods: true,
        checked: true,
        states: true
      },
      rule: {
        shekou: false, //折扣
        face: true, //面值
        store: true, //门店限制
        restrictions: true, //商品限制
        shop_type: false, //商品类型
        goods: true, //活动商品
        commodity: false, //添加商品
        commodityList: false, //商品列表
        restriction_ra: true,
        mendain: false, //门店选择
        tuan: true,
        miao: true,
        activity_goods_state: true
      },
      parameter: {
        pagenum: 1,
        pagesize: 10,
        id: "",
        keyword: "",
        count: 0
      },
      orderQuery: [
        {
          value: 1,
          label: "商品ID"
        },
        {
          value: 2,
          label: "商品名称"
        },
        {
          value: 3,
          label: "商品编号"
        }
      ],
      rules: {
        name: [
          { required: true, message: "请输入优惠券名称", trigger: "blur" }
        ],
        money: [
          { required: true, message: "请输入优惠券面值", trigger: "blur" },
          { validator: isonenumber, trigger: "blur" }
        ],
        everyone: [
          //   { required: true, message: "请输入每人限领", trigger: "blur" },
          { validator: isonenumber, trigger: "blur" }
        ],
        amount: [
          { required: true, message: "请输入发放总量", trigger: "blur" },
          { validator: isonenumber, trigger: "blur" }
        ]
      }
    };
  },
  // 方法
  methods: {
    getwxcoupon() {
      this.$api
        .getwxcoupon(this.Page)
        .then(res => {
          if (res.data.code == 200) {
            res.data.coupon.forEach(x => {
              if (x.state == 0) {
                x.open = false;
              } else {
                x.open = true;
              }
            });
            this.tableList = res.data.coupon;

            console.log(this.tableList);

            this.Page.count = res.data.count;
          } else {
            this.$message.error(res.data.msg);
          }
        })
        .catch(res => {
          this.$message.error("网络错误");
          console.log(res);
        });
    },
    // 分页
    handleCurrentChange(e) {
      this.Page.pagenum = e;
      this.getwxcoupon();
    },
    // 分页
    handleSizeChange(e) {
      this.Page.pagesize = e;
      this.getwxcoupon();
    },
    // getGoodsList
    onGoodsList() {
      this.$api
        .getGoodsList(this.parameter)
        .then(res => {
          if (res.data.code == 200) {
            this.tableData = res.data.list;
            console.log(res.data);
            this.innerVisible = true;
            // this.shopList = res.data.cate;
            this.parameter.count = res.data.count;
          } else {
            this.$message.error(res.data.msg);
          }
        })
        .catch(res => {
          console.log(res);
          this.$message.error("获取数据列表失败");
        });
    },
    // /搜搜
    onserch() {
          this.Page.pagenum = 1;
      this.Page.pagesize = 10;
      this.getwxcoupon();
    },
    // 清除查询
    onclear() {
      this.parameter = {
        id: "",
        pagenum: 1,
        pagesize: 7,
        refund_state: "",
        create_time: "",
        start_time: "",
        end_time: "",
        number: "",
        keyword: ""
      };
      this.getwxcoupon();
    },
    handleSizeChanges(e) {
      this.parameter.pagesize = e;
      this.getwxcoupon();
    },
    handleCurrentChanges(e) {
      this.parameter.pagenum = e;
      this.getwxcoupon();
    },
    onselect(e) {
      this.ruleForm1.selecttable = e;
    },
    onaddtuan() {
      this.dialogVisible = true;
    },
    // 添加商品提交
    onsubmit() {
      this.$refs.ruleForms.validate(valid => {
        if (!valid) return;
        if (this.ruleForm1.goods_state != "0") {
          if (
            this.ruleForm1.selecttable.length == 0 &&
            this.ruleForm1.activity_goods_state != 0
          ) {
            this.$message.error("请选择商品列表");
            return;
          }
        }

        if (this.ruleForm1.time_type) {
          this.ruleForm1.up_time = this.ruleForm1.timearr[0] / 1000;
          this.ruleForm1.down_time = this.ruleForm1.timearr[1] / 1000;
        }

        if (this.ruleForm1.time_state == "0") {
          if (this.ruleForm1.times.length == 0) {
            this.$message.error("请选择开始和结束时间");
            return;
          }
          this.ruleForm1.start_time = this.ruleForm1.times[0] / 1000;
          this.ruleForm1.end_time = this.ruleForm1.times[1] / 1000;
        } else {
          if (this.ruleForm1.time == "") {
            this.$message.error("请选择天数");
            return;
          }
        }
        this.ruleForm1.activity_goods_id = this.ruleForm1.selecttable.map(x => {
          return x.pid;
        });

        // if()
        if (this.ruleForm1.activity_goods_id.length > 0) {
          this.ruleForm1.activity_goods_id = this.ruleForm1.activity_goods_id.join(
            ","
          );
        }
        if (this.ruleForm1.open) {
          this.ruleForm1.is_add = 1;
        } else {
          this.ruleForm1.is_add = 0;
        }
        if (this.ruleForm1.time_type) {
          this.ruleForm1.time_type = 1;
        } else {
          this.ruleForm1.time_type = 0;
        }
        if (this.ruleForm1.states) {
          this.ruleForm1.state = 1;
        } else {
          this.ruleForm1.state = 0;
        }
        this.$api
          .getwxcouponAdd(this.ruleForm1)
          .then(res => {
            if (res.data.code == 200) {
              this.$message.success(res.data.msg);
              this.dialogVisible = false;
              this.getwxcoupon();
              this.ruleForm1 = {
                type: 1,
                name: "",
                money: "",
                everyone: "",
                time_state: "0",
                times: [],
                start_time: "",
                end_time: "",
                time: "",
                time_type: false,
                use_state: "0",
                shop_state: "0",
                goods_state: "0",
                activity_goods_state: "0",
                message: "",
                open: true,
                amount: "",
                limit_money: "",
                goods_type: "1",
                selecttable: [],
                activity_goods_id: "",
                timearr: "",
                isgoods: true,
                checked: true
              };
              this.tableData = [];
            } else {
              this.$message.error(res.data.msg);
            }
          })
          .catch(res => {
            console.log(res);
            this.$message.error("获取数据列表失败");
          });
      });
    },
    onclose() {
      this.isdetie = false;
      this.dialogVisible = false;
      this.tableData = [];
      this.ruleForm1 = {
        type: 1,
        name: "",
        money: "",
        everyone: "",
        time_state: "0",
        times: [],
        start_time: "",
        end_time: "",
        time: "",
        time_type: false,
        use_state: "0",
        shop_state: "0",
        goods_state: "0",
        activity_goods_state: "0",
        message: "",
        open: true,
        amount: "",
        limit_money: "",
        goods_type: "1",
        selecttable: [],
        activity_goods_id: "",
        timearr: "",
        isgoods: true,
        checked: true
      };
    },
    onShowDel(row) {
      this.ruleForm1.selecttable.splice(row.$index, 1);
    },
    onclears() {
      this.Page = {
        pagenum: 1,
        pagesize: 10,
        count: 0,
        forsale: "",
        id: "",
        type: "",
        keyword: ""
      };
      this.getwxcoupon();
    },
    oneditone(row) {
      this.isdetie = true;
      this.$api
        .getwxcouponDetail({ coupon_id: row.row.id })
        .then(res => {
          if (res.data.code == 200) {
            this.ruleForm1 = {
              coupon_id: row.row.id,
              type: parseInt(res.data.coupon.type),
              name: res.data.coupon.name,
              money: res.data.coupon.money,
              everyone: res.data.coupon.everyone,
              time_state: "0",
             
              start_time: "",
              end_time: "",
              time: "",
              time_type: false,
              use_state: res.data.coupon.use_state,
              shop_state: res.data.coupon.shop_state,
              goods_state: res.data.coupon.goods_state,
              activity_goods_state: res.data.coupon.activity_goods_state,
              message: res.data.coupon.message,
              open: res.data.coupon.is_add == 1 ? true : false,
              amount: res.data.coupon.amount,
              limit_money: res.data.coupon.limit_money,
              goods_type: res.data.coupon.goods_type,
              selecttable: [],
              activity_goods_id: res.data.coupon.activity_goods_id,
              isgoods: true,
              checked: true,
              states: res.data.coupon.state == 1 ? true : false
            };
                  if (res.data.coupon.start_time && res.data.coupon.end_time) {
              this.ruleForm1.times = [
                res.data.coupon.start_time * 1000,
               res.data.coupon.end_time * 1000
              ];
            }
             
            if (res.data.coupon.up_time && res.data.coupon.down_time) {
              this.ruleForm1.timearr = [
                res.data.coupon.up_time * 1000,
                res.data.coupon.down_time * 1000
              ];
            }
            this.dialogVisible = true;
          } else {
            this.$message.error(res.data.msg);
          }
        })
        .catch(res => {
          console.log(res);

          this.$message.error("获取数据列表失败");
        });
    },
    onedit() {
      this.$refs.ruleForms.validate(valid => {
        if (!valid) return;
        if (this.ruleForm1.goods_state != "0") {
          if (
            this.ruleForm1.selecttable.length == 0 &&
            this.ruleForm1.activity_goods_state != 0
          ) {
            this.$message.error("请选择商品列表");
            return;
          }
        }

        if (this.ruleForm1.time_type) {
          this.ruleForm1.up_time = this.ruleForm1.timearr[0];
          this.ruleForm1.down_time = this.ruleForm1.timearr[1];
        }

        if (this.ruleForm1.time_state == "0") {
          if (this.ruleForm1.times.length == 0) {
            this.$message.error("请选择开始和结束时间");
            return;
          }
          this.ruleForm1.start_time = this.ruleForm1.times[0] / 1000;
          this.ruleForm1.end_time = this.ruleForm1.times[1] / 1000;
        } else {
          if (this.ruleForm1.time == "") {
            this.$message.error("请选择天数");
            return;
          }
        }
        if (this.ruleForm1.type != 3) {
          this.ruleForm1.activity_goods_id = this.ruleForm1.selecttable.map(
            x => {
              return x.pid;
            }
          );
        }
        if (
          Array.isArray(this.ruleForm1.activity_goods_id) &&
          this.ruleForm1.activity_goods_id.length > 0
        ) {
          this.ruleForm1.activity_goods_id = this.ruleForm1.activity_goods_id.join(
            ","
          );
        }
        if (this.ruleForm1.open) {
          this.ruleForm1.is_add = 1;
        } else {
          this.ruleForm1.is_add = 0;
        }
        if (this.ruleForm1.time_type) {
          this.ruleForm1.time_type = 1;
        } else {
          this.ruleForm1.time_type = 0;
        }
        if (this.ruleForm1.states) {
          this.ruleForm1.state = 1;
        } else {
          this.ruleForm1.state = 0;
        }
        this.$api
          .getwxgiveUpdate(this.ruleForm1)
          .then(res => {
            if (res.data.code == 200) {
              this.$message.success(res.data.msg);
              this.dialogVisible = false;
              this.ruleForm1 = {
                type: 1,
                name: "",
                money: "",
                everyone: "",
                time_state: "0",
                times: [],
                start_time: "",
                end_time: "",
                time: "",
                time_type: false,
                use_state: "0",
                shop_state: "0",
                goods_state: "0",
                activity_goods_state: "0",
                message: "",
                open: true,
                amount: "",
                limit_money: "",
                goods_type: "1",
                selecttable: [],
                activity_goods_id: "",
                timearr: "",
                isgoods: true,
                checked: true
              };
              this.tableData = [];
              this.isdetie = false;
            } else {
              this.$message.error(res.data.msg);
            }
          })
          .catch(res => {
            console.log(res);
            this.$message.error("获取数据列表失败");
          });
      });
    },
    onchange(row, e) {
      if (row.row.open) {
        var state = 1;
      } else {
        var state = 0;
      }
      this.$api
        .getwxcouponState({ state: state, coupon_id: row.row.id })
        .then(res => {
          if (res.data.code == 200) {
            this.$message.success(res.data.msg);
            this.getwxcoupon();
          } else {
            this.$message.error(res.data.msg);
          }
        })
        .catch(res => {
          this.$message.error("获取数据列表失败");
        });
    },
    onfafang(row) {
      let state = "";
      // state//值是0是新增为1是修改
      if (row.row.coupon_give) {
        state = 1;
      } else {
        state = 0;
      }
      let id = "";
      if (row.row.coupon_give) {
        id = row.row.coupon_give.id;
      } else {
        id = row.row.id;
      }
      this.$router.push({
        name: "fafang",
        params: {
          id: id,
          ff: state
        }
      });
    },
    // 查看优惠券
    onview(row) {
      this.$api
        .getwxcouponDetail({
          coupon_id: row.row.id
        })
        .then(res => {
          if (res.data.code == 200) {
            this.viewData = res.data.coupon;

            this.dialogview = true;
          } else {
            this.$message.error(res.data.msg);
          }
        })
        .catch(res => {
          console.log(res);
          this.$message.error("获取数据列表失败");
        });
    }
  },
  // 监听属性
  watch: {
    "ruleForm1.type": {
      handler: function(e) {
        if (e == 3) {
          this.ruleForm1.goods_state = "0";
          this.ruleForm1.goods_type = "1";
          this.ruleForm1.activity_goods_state = "1";
          this.rule.shekou = false;
          this.rule.face = false;
          this.rule.restrictions = true;
          this.ruleForm1.goods_state = "1";
          this.rule.shop_type = true;
          this.rule.activity_goods_state = false;
          this.rule.tong = false;
          this.ruleForm1.activity_goods_state = "1";
          this.rule.miao = false;
          this.rule.store = false;
        } else if (e == 2) {
          this.rule.shekou = true;
          this.rule.face = false;
          this.rule.tong = true;
          this.rule.miao = true;
          this.rule.store = true;
        } else if (e == 1) {
          this.rule.shekou = false;
          this.rule.face = true;
          this.rule.store = true;
          this.rule.tong = true;
          this.rule.miao = true;
          this.rule.goods = true;
          this.rule.shop_type = true;
          this.rule.restriction_ra = true;
        }
      }
    },
    "ruleForm1.use_state": {
      handler: function(e) {
        if (e == "0") {
          (this.rule.tuan = true),
            (this.rule.miao = true),
            (this.ruleForm1.goods_state = "0");
          this.ruleForm1.shop_state = "0";
          this.rule.restriction_ra = false;
          this.rule.store = true;
          this.rule.restrictions = true;
          this.rule.shop_type = false;
          this.rule.goods = false;
          this.rule.commodity = false;
          this.rule.commodityList = false;
        }
        if (e == 1) {
          this.rule.tuan = true;
          this.rule.miao = true;
          this.rule.restriction_ra = true;
          this.ruleForm1.goods_state = "1";
          this.ruleForm1.shop_state = "0";
          this.ruleForm1.goods_state = "1";
          this.ruleForm1.goods_type = "1";
          this.ruleForm1.goods_type = "1";
          this.ruleForm1.activity_goods_state = "1";
          this.ruleForm1.activity_goods_state = "1";
          this.rule.store = false;
          this.rule.restrictions = true;
          this.rule.shop_type = true;
          this.rule.goods = true;
          this.rule.commodity = true;
          this.rule.commodityList = true;
          this.rule.activity_goods_state = true;
        }
        if (e == 2) {
          this.rule.tuan = true;
          this.rule.miao = true;
          this.rule.restriction_ra = false;
          this.ruleForm1.shop_state = "0";
          this.ruleForm1.goods_state = "0";
          this.ruleForm1.goods_state = "0";
          this.rule.store = true;
          this.rule.restrictions = true;
          this.rule.shop_type = false;
          this.rule.goods = false;
          this.rule.commodity = false;
          this.rule.commodityList = false;
        }
        if (e == 3) {
          (this.rule.tuan = false),
            (this.rule.miao = false),
            (this.ruleForm1.activity_goods_state = "1");
          this.ruleForm1.goods_type = "0";
          this.ruleForm1.goods_state = "0";
          this.rule.restriction_ra = false;
          this.ruleForm1.goods_type = "0";
          this.ruleForm1.activity_goods_state = "1";
          this.rule.store = false;
          this.rule.restrictions = true;
          this.rule.shop_type = true;
          this.rule.goods = true;
          this.rule.commodity = true;
          this.rule.commodityList = true;
        }
      }
    },
    "ruleForm1.activity_goods_state": {
      handler: function(e) {
        if (e == 0) {
          this.rule.commodity = false;
          this.rule.commodityList = false;
        } else {
          this.rule.commodity = true;
          this.rule.commodityList = true;
        }
      }
    },
    "ruleForm1.shop_state": {
      handler: function(e) {
        if (e == 0) {
          this.rule.mendain = false;
        } else {
          this.rule.mendain = true;
          this.rule.goods = true;
        }
      }
    },
    "ruleForm1.goods_state": {
      handler: function(e) {
        if (e == 0) {
          this.rule.shop_type = false;
          this.rule.goods = false;
          this.ruleForm1.activity_goods_state = "0";
        } else {
          this.rule.shop_type = true;
          this.rule.goods = true;
        }
      }
    }
  },
  // 组件
  component: {},
  // 计算属性
  computed: {
    // end_time(){
    //   let data=this.viewData.end_time
    //   console.log(data);
    //   console.log(this.$moment(parseFloat(data)).format("YYYY-MM-DD"));
    //       return  this.$moment(parseFloat(this.viewData.end_time)).format("YYYY-MM-DD")
    // }
  }
};
</script>

<style lang="less" scoped>
.el-select {
  margin-right: 10px;
}
.input-with-select {
  width: 30%;
  margin-right: 10px;
}
.dialog {
  div {
    height: 50px;
    line-height: 50px;
    font-size: 16px;
  }
  div:nth-child(odd) {
    background: #ecf0f5;
  }
  div:nth-child(even) {
    background: #f8f8f8;
  }
}
</style>