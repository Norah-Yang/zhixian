<template>
  <div>
    <el-row>
      <el-col :span="24">
        <el-card shadow="always">
          <el-alert
            title="订单退款：订单是微信支付的，交易时间超过一年的订单无法提交退款；订单是支付宝支付的，交易时间超过三个月的订单无法提交退款"
            type="warning"
            show-icon
          ></el-alert>
          <div class="height"></div>
          <el-row>
            <el-col :span="24">
              <!-- <el-date-picker
                size="mini"
                :clearable="false"
                v-model="Page.times"
                type="daterange"
                value-format="timestamp"
                :picker-options="selectDate"
                :default-time="['00:00:00', '23:59:59']"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                @change="timeChange"
              ></el-date-picker> -->
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
              <el-select v-model="Page.shop_id" placeholder="发货点"  size="mini">
                <el-option
                  v-for="item in orderList.shop_id"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
              <el-select v-model="Page.type" placeholder="订单类型"  size="mini">
                <el-option
                  v-for="item in orderList.type"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
              <el-select v-model="Page.state" placeholder="订单状态"  size="mini">
                <el-option
                  v-for="item in orderList.state"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
              <el-select v-model="Page.pay_type" placeholder="支付方式"  size="mini">
                <el-option
                  v-for="item in orderList.pay_type"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
              <div class="height"></div>
              <el-select v-model="Page.receive_state" placeholder="配货方式"  size="mini">
                <el-option
                  v-for="item in orderList.receive_state"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
              <el-select v-model="Page.sou_id" placeholder="搜索框"  size="mini">
                <el-option
                  v-for="item in orderList.sou_id"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
              <el-select v-model="Page.send_type" placeholder="发货方式"  size="mini">
                <el-option
                  v-for="item in orderList.send_type"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
              <el-input placeholder="请输入内容" v-model="Page.keyword" class="input-with-select"  size="mini">
                <el-button slot="append" @click="onserch" v-no-click>搜索</el-button>
              </el-input>
              <el-button type="danger" @click="onclear" v-no-click  size="mini">清除</el-button>
            </el-col>
          </el-row>
          <div class="height"></div>
          <el-table border="" :data="tableData" style="width: 100%" stripe>
            <el-table-column label="订单ID" prop="oid"></el-table-column>
            <el-table-column label="订单号" prop="order_no" width="180"></el-table-column>
            <el-table-column label="订单类型" prop="pay">
              <!-- <template slot-scope="row">
                <div v-if="row.row.type==0">
                  <el-tag effect="dark">会员充值</el-tag>
                </div>
                <div v-else-if="row.row.type==1">
                  <el-tag type="success" effect="dark">普通商品</el-tag>
                </div>
                <div v-else-if="row.row.type==2">
                  <el-tag type="info" effect="dark">秒杀商品</el-tag>
                </div>
                <div v-else-if="row.row.type==3">
                  <el-tag type="warning" effect="dark">团购商品</el-tag>
                </div>
              </template> -->
            </el-table-column>
            <el-table-column label="订单状态" prop="pay_state">
              <template slot-scope="row">
                <div v-if="row.row.pay_state==0">未支付</div>
                <div v-else>已支付</div>
              </template>
            </el-table-column>
            <el-table-column label="支付方式" prop="pay_type">
              <template slot-scope="row">
                <div v-if="row.row.pay_state==1">微信支付</div>
                <div v-else>余额</div>
              </template>
            </el-table-column>
            <el-table-column label="发货方式" prop="receive"></el-table-column>

            <el-table-column label="发货状态" prop="send"></el-table-column>

            <el-table-column label="发货店点" prop="shop_name"></el-table-column>

            <el-table-column label="下单时间" prop="add_time" width="180">
              <template slot-scope="row">{{row.row.add_time}}</template>
            </el-table-column>
            <el-table-column label="买家姓名" prop="name"></el-table-column>
            <el-table-column label="买家手机" prop="phone" width="180"></el-table-column>
            <el-table-column label="实收金额" prop="money"></el-table-column>
            <el-table-column label="来源渠道" prop="sources"></el-table-column>
            <el-table-column label="操作" width="180">
              <template slot-scope="row">
                <el-button size="mini" type="info" @click="oneditone(row)" v-no-click>查看</el-button>
                <el-button size="mini" type="danger" @click="ondelGoods(row)" v-no-click>删除</el-button>
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
        </el-card>
      </el-col>
    </el-row>
    <!-- 对话框 -->
      <el-dialog
      title="订单详情"
      :visible="dialogVisible"
      width="60%"
      :show-close="false"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <el-row style="border-bottom:1px solid #ccc">
        <el-col :span="12">
          <div class="title_left">
            <h1>订单信息</h1>
            <div>
              <span>订单状态：</span>
              <span>{{roleFrom.order.pay_state==0?"未支付":"已支付"}}</span>
            </div>
            <div>
              <span>订单单号：</span>
              <span>{{roleFrom.order.order_no}}</span>
            </div>
            <div>
              <span>下单时间：</span>
              <span>{{roleFrom.order.add_time}}</span>
            </div>
            <div>
              <span>商家备注：</span>
              <span>{{roleFrom.order.note}}</span>
            </div>
            <div>
              <span>支付方式：</span>
              <span>{{roleFrom.order.pay_state==1?"微信":"会员卡"}}</span>
            </div>
            <div>
              <span>支付时间：</span>
              <span>{{roleFrom.order.pay_time}}</span>
            </div>
            <div>
              <span>支付详细：</span>
              <span></span>
            </div>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="title_right">
            <h1>配送信息</h1>
            <div>
              <span>提货人：</span>
              <span>{{roleFrom.pei.name}}</span>
            </div>
            <div>
              <span>联系方式：</span>
              <span></span>
            </div>
            <div>
              <span>自提时间：</span>
              <span>{{roleFrom.pei.receive_time}}</span>
            </div>
            <div>
              <span>自提店铺：</span>
              <span></span>
            </div>
            <div>
              <span>店铺地址：</span>
              <span>{{roleFrom.pei.address}}</span>
            </div>
          </div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <div>
            <div class="height"></div>
            <h1>订单清单</h1>
            <div class="height"></div>
            <el-table :data="tableList" border="" style="width: 100%">
              <el-table-column prop="goods" label="商品名称"></el-table-column>
              <el-table-column prop="thumb" label="商品图片">
                <template slot-scope="row">
                  <el-image style="width: 50px; height: 50px" :src="row.row.thumb" fit="contain"></el-image>
                </template>
              </el-table-column>
              <el-table-column prop="market_price" label="原价"></el-table-column>
              <el-table-column prop="price" label="会员价" v-if="roleFrom.order.type!=1"></el-table-column>
              <el-table-column prop="tuan_price" label="会员价" v-if="roleFrom.order.type!=3"></el-table-column>
              <el-table-column prop="seckill_price" label="会员价" v-if="roleFrom.order.type!=2"></el-table-column>
              <el-table-column prop="discounts_price" label="商品优惠"></el-table-column>
              <el-table-column prop="sell_price" label="售价"></el-table-column>
              <el-table-column prop="amount" label="销售数量"></el-table-column>
              <el-table-column prop="name" label="销售方式"></el-table-column>
              <el-table-column prop="goods_market_price" label="	商品原价	"></el-table-column>
              <el-table-column prop="all_discounts_price" label="	总优惠	"></el-table-column>
              <el-table-column prop="money" label="	实收金额	"></el-table-column>
              <el-table-column prop="integral" label="是否积分"></el-table-column>
            </el-table>
          </div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <div>
            <div class="height"></div>
            <h1>订单操作日志</h1>
            <div class="height"></div>
            <!-- <div>
              管理员admin： 操作：微商城订单退款 时间： 2020-05-27 05:39:31
            </div>-->
          </div>
        </el-col>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false" v-no-click>取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false" v-no-click>确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { memberBalanceRecord, orderList } from "@/common/select.js";
import { selectDate, seletTime, startTime, endTime } from '@/common/selectDate.js'
export default {
  // props:[],
  created() {
    this.getweiOrder();
  },
  // 页面加载完成
  mounted() {},
  data() {
    return {
      dialogVisible:false,
      memberBalanceRecord,
      orderList,
      tableData: [],
      tableList: [],
      pickerOptions:{shortcuts:selectDate},
      seletTime:seletTime,
      Page: {
        pagenum: 1,
        pagesize: 10,
        count: 0,
        type: "",
        times: "",
        keyword: "",
        start_time: parseInt(startTime / 1000),
        end_time: parseInt(endTime / 1000),
        shop_id: "",
        type: "",
        state: "",
        pay_type: "",
        receive_state: "",
        sou_id: "",
        send_type:""
      },
      dialogVisible: false,
      roleFrom: {
        pei: {},
        order: {},
        log: {}
      }
    };
  },
  // 方法
  methods: {
    getweiOrder() {
      // console.log('参数',this.Page);
      this.$api
        .getweiOrder(this.Page)
        .then(res => {
          if (res.data.code == 200) {
            this.tableData = res.data.list;
            this.Page.count = res.data.count;
          } else {
            this.$message.error(res.data.msg);
          }
        })
        .catch(res => {
          this.$message.error();
        });
    },
    // 分页
    handleCurrentChange(e) {
      this.Page.pagenum = e;
      this.getweiOrder();
    },
    // 分页
    handleSizeChange(e) {
      this.Page.pagesize = e;
      this.getweiOrder();
    },
    // 查询时间更改
    timeChange(val) {
      console.log('val', val);
      this.Page.start_time = parseInt(val[0] / 1000);
      this.Page.end_time = parseInt(val[1] / 1000);
    },
    oneditone(row) {
      this.dialogVisible = true;
      this.$api
        .getweiOrderDetail({ id: row.row.oid })
        .then(res => {
          if (res.data.code == 200) {
            console.log(res.data);
            this.tableList = res.data.arr;
            this.tableList = res.data.arr;
            this.roleFrom.pei = res.data.pei;
            this.roleFrom.order = res.data.order;
            this.roleFrom.log = res.data.log;
          } else {
            this.$message.error(res.data.msg);
          }
        })
        .catch(res => {
          this.$message.error();
        });
    },
    // 点击了搜索
    onserch() {
      this.Page.pagenum = 1;
      this.Page.pagesize = 10;
      this.getweiOrder();
    },
    // 点击了清楚搜索
    onclear() {
      this.Page.pagenum = 1;
      this.Page.pagesize = 10;
      this.Page.type = "";
      this.Page.times = "";
      this.Page.keyword = "";
      this.Page.start_time = "";
      this.Page.end_time = "";
      this.Page.shop_id = "";
      this.Page.type = "";
      this.Page.state = "";
      this.Page.receive_state = "";
      this.Page.sou_id = "";
      this.Page.send_type = "";
      
      this.getweiOrder();
    }
  }
}
</script>

<style lang="less" scoped>
.title_left {
  h1 {
    padding: 10px 0;
  }
  div {
    padding: 10px 0;
    span:nth-child(odd) {
      margin-right: 15px;
    }
  }
}
.title_right {
  h1 {
    padding: 10px 0;
  }
  div {
    padding: 10px 0;
    span:nth-child(odd) {
      margin-right: 15px;
    }
  }
}
.el-select {
  margin-right: 10px;
}
.el-date-editor {
  margin-right: 10px;
}
.input-with-select {
  width: 20%;
  margin-right: 10px;
}
</style>