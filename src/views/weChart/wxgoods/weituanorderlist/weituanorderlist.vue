<template>
    <div>
        <el-row>
            <el-col :span="24">
                <el-card shadow="always">
                    <el-row>
                        <el-col :span="24">
                            <el-select v-model="Page.sou_id" placeholder="搜索类型" size="mini">
                                <el-option
                                    v-for="item in memberBalanceRecord.sou_id"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value"
                                ></el-option>
                            </el-select>
                            <el-date-picker
                                :disabled="Page.create_time!=10"
                                :clearable="false"
                                size="mini"
                                v-model="Page.times"
                                type="daterange"
                                value-format="timestamp"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期"
                            ></el-date-picker>
                            <el-select v-model="Page.create_time" placeholder="时间选择" size="mini">
                                <el-option
                                    v-for="item in memberBalanceRecord.dateList"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value"
                                ></el-option>
                            </el-select>
                            <el-input
                                placeholder="请输入内容"
                                v-model="Page.keyword"
                                class="input-with-select"
                                size="mini"
                            >
                                <el-button slot="append" @click="onserch" v-no-click>搜索</el-button>
                            </el-input>
                            <el-button type="danger" @click="onclear" v-no-click size="mini">清除</el-button>
                        </el-col>
                    </el-row>
                    <div class="height"></div>
                    <el-table border="" :data="tableData" style="width: 100%" stripe>
                        <el-table-column label="团购id" prop="tuan_order_id"></el-table-column>
                        <el-table-column label="会员名称" prop="nickname"></el-table-column>
                        <el-table-column label="会员手机" prop="phone"></el-table-column>
                        <el-table-column label="商品id" prop="tuan_id"></el-table-column>
                        <el-table-column label="商品编号" prop="commodity_code"></el-table-column>
                        <el-table-column label="商品名称" prop="name"></el-table-column>
                        <el-table-column label="拼团价格" prop="money"></el-table-column>
                        <el-table-column label="拼团状态" prop="tuan_state"></el-table-column>
                        <el-table-column label="所需人数" prop="phone"></el-table-column>
                        <el-table-column label="缺少人数" prop="lack_people"></el-table-column>
                        <el-table-column label="失败已经退款" prop="refund">
                            <template slot-scope="row">
                                <div v-if="row.row.refund==1">是</div>
                            </template>
                        </el-table-column>
                        <el-table-column label="操作">
                            <template slot-scope="row">
                                <el-button
                                    type="primary"
                                    v-no-click
                                    @click="onview(row)"
                                    size="small"
                                >查看</el-button>
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
                            <span>团购状态：</span>
                            <span>{{roleFrom.order.tuan_state}}</span>
                        </div>
                        <div>
                            <span>团购ID：</span>
                            <span>{{roleFrom.order.Addtime}}</span>
                        </div>
                        <div>
                            <span>到期时间</span>
                            <span>{{roleFrom.order.end_time}}</span>
                        </div>
                        <div>
                            <span>团购购人数:</span>
                            <span>{{roleFrom.order.people}}</span>
                        </div>
                        <div>
                            <span>失败已经退款</span>
                            <span>{{roleFrom.order.refund}}</span>
                        </div>
                        <div>
                            <span>支付详细：</span>
                            <span></span>
                        </div>
                    </div>
                </el-col>
                <el-col :span="12">
                    <div class="title_right">
                        <!-- <h1>配送信息</h1>
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
                        </div>-->
                    </div>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="24">
                    <div>
                        <div class="height"></div>
                        <h1>订单清单</h1>
                        <div class="height"></div>
                        <el-table :data="roleFrom.tableList" border="" style="width: 100%">
                            <el-table-column prop="head_img" label="商品图片">
                                <template slot-scope="row">
                                    <el-image
                                        style="width: 50px; height: 50px"
                                        :src="row.row.head_img"
                                        fit="contain"
                                    ></el-image>
                                </template>
                            </el-table-column>
                            <el-table-column prop="nickname" label="昵称"></el-table-column>
                            <el-table-column prop="order_no" label="订单号 " width="180"></el-table-column>
                            <el-table-column prop="name" label="商品名"></el-table-column>
                            <el-table-column prop="num" label="数量"></el-table-column>
                            <el-table-column prop="money" label="价格"></el-table-column>
                            <el-table-column prop="unit" label="销售单位"></el-table-column>
                            <el-table-column prop="send_type" label="配送方式">
                                <template slot-scope="row">
                                    <div v-if="row.row.send_type=='1'">配送</div>
                                    <div v-if="row.row.send_type=='2'">自提</div>
                                </template>
                            </el-table-column>
                            <el-table-column prop="oname" label="收货人"></el-table-column>
                            <el-table-column prop="shop_name" label="	店铺名	"></el-table-column>
                            <el-table-column prop="address" label="	收货地址	" show-overflow-tooltip></el-table-column>
                            <el-table-column prop="add_time" label="	参与时间	" width="180"></el-table-column>
                            <el-table-column prop="state" label="已付款"></el-table-column>
                            <el-table-column label="操作 " width="100">
                                <template slot-scope="row">
                                    <el-button
                                        type="primary"
                                           @click="onviewOder(row)"
                                        size="mini"
                                        v-no-click
                                    >查看</el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
                </el-col>
            </el-row>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="dialogVisible = false" v-no-click>确 定</el-button>
            </span>
            <el-dialog
                title="订单详情"
                :visible="dialogVisibleson"
                width="60%"
                :show-close="false"
                :close-on-click-modal="false"
                :close-on-press-escape="false"
                append-to-body
            >
                <!-- 寒月:
$de['state']='已付款';//订单信息
$de['order_no']=$order['order_no'];//订单号
$de['add_time']=date('Y-m-d H:i:s',$order['add_time']);//下单时间
$de['pay_type']=$order['pay_type'];//1微信支付2会员卡支付3积分支付
$de['pay_time']=date('Y-m-d H:i:s',$order['pay_time']);//支付时间
$de['pay_detail']='';//支付详细
//配送信息

 -->

                <el-row style="border-bottom:1px solid #ccc">
                <el-col :span="12">
                    <div class="title_left">
                        <h1>订单信息</h1>
                        <div>
                            <span>团购状态：</span>
                            <span>{{roleFromSon.order.state}}</span>
                        </div>
                         <div>
                            <span>订单号:</span>
                            <span>{{roleFromSon.order.order_no}}</span>
                        </div>
                        <div>
                            <span>下单时间:</span>
                            <span>{{roleFromSon.order.add_time}}</span>
                        </div>
                        <div>
                            <span>支付方式</span>
                            <span v-if="roleFromSon.order.pay_type==1">微信支付</span>
                            <span v-if="roleFromSon.order.pay_type==2">会员卡支付</span>
                            <span v-if="roleFromSon.order.pay_type==3">积分支付</span>
                          
                        
                        </div>
                        <div>
                            <span>支付时间:</span>
                            <span>{{roleFromSon.order.pay_time}}</span>
                        </div>
                        <div>
                            <span>支付详细</span>
                            <span>{{roleFromSon.order.pay_detail}}</span>
                        </div>
                    </div>
                </el-col>
                <el-col :span="12">
                    <div class="title_right">
                        <h1>配送信息</h1>
            <div>
              <span>提货人：</span>
              <span>{{roleFromSon.address.name}}</span>
            </div>
            <div>
              <span>联系方式：</span>
              <span>{{roleFromSon.address.phone}}</span>
            </div>
            <div>
              <span>发货时间:</span>
              <span>{{roleFromSon.address.receive_time}}</span>
            </div>
            <div>
              <span>店铺地址：</span>
              <span>{{roleFromSon.address.address}}</span>
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
                        <el-table :data="roleFromSon.tableList" border="" style="width: 100%">
                            <el-table-column prop="head_img" label="商品图片">
                                <template slot-scope="row">
                                    <el-image
                                        style="width: 50px; height: 50px"
                                        :src="row.row.head_img"
                                        fit="contain"
                                    ></el-image>
                                </template>
                            </el-table-column>
                            <el-table-column prop="price" label="商品原价"></el-table-column>
                            <el-table-column prop="people_price" label="拼团价 " ></el-table-column>
                            <el-table-column prop="people_price" label="拼团优惠"></el-table-column>
                            <el-table-column prop="sale_price" label="售价"></el-table-column>
                            <el-table-column prop="num" label="售数量"></el-table-column>
                            <el-table-column prop="unit" label="销售单位"></el-table-column>
                            <el-table-column prop="score" label="是否积分"></el-table-column>
                        </el-table>
                    </div>
                </el-col>
            </el-row>
              <el-row style="border-bottom:1px solid #ccc">
                <el-col :span="12">
                    <div class="title_left">
                        <h1>买家信息</h1>
                        <div>
                            <span>订单应收金额:</span>
                            <span>{{roleFromSon.user.money}}</span>
                        </div>
                        <div>
                            <span>运费:</span>
                            <span>{{roleFromSon.user.freight}}</span>
                        </div>
                             <div>
                            <span>订单优惠:</span>
                            <span>{{roleFromSon.user.coupon_money}}</span>
                        </div>
                              <div>
                            <span>订单实收金额:</span>
                            <span>{{roleFromSon.user.true_money}}</span>
                        </div>
                       
                       
                    </div>
                </el-col>
                <el-col :span="12">
                    <div class="title_right">
                        <!-- <h1>配送信息</h1>
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
                        </div>-->
                    </div>
                </el-col>
            </el-row>
                <span slot="footer" class="dialog-footer">
                    <el-button type="primary" @click="dialogVisibleson = false" v-no-click>确 定</el-button>
                </span>
            </el-dialog>
        </el-dialog>
    </div>
</template>
<script>
import { memberBalanceRecord } from "@/common/select.js";
import { log } from 'util';
export default {
  // props:[],
  // 页面加载
  created() {
    this.getMemberupMoneyList();
  },
  // 页面加载完成
  mounted() {},
  data() {
    return {
      dialogVisible: false,
      dialogVisibleson: false,
      memberBalanceRecord,
      tableData: [],
      Page: {
        pagenum: 1,
        pagesize: 10,
        count: 0,
        sou_id: "",
        create_time: "",
        times: "",
        keyword: "",
        start_time: "",
        end_time: ""
      },
      roleFrom: {
        order: {},
        tableList: []
      },
      roleFromSon:{
             order: {},
        tableList: [],
        address:{},
        user:{}
      }
    };
  },
  // 方法
  methods: {
   async getMemberupMoneyList() {
     const loading = this.$loading({
          lock: true,
          text: 'Loading',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.1)'
        });
      this.$api
        .gettuanOrder(this.Page)
        .then(res => {
          if (res.data.code == 200) {
            // console.log(res.data);
            loading.close();
            this.tableData = res.data.list;
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
      this.getMemberupMoneyList();
    },
    // 分页
    handleSizeChange(e) {
      this.Page.pagesize = e;
      this.getMemberupMoneyList();
    },
    // 点击了搜索
    onserch() {
      if (this.Page.times.length > 0 && this.Page.create_time == 10) {
        this.Page.start_time = this.Page.times[0] / 1000;
        this.Page.end_time = this.Page.times[1] / 1000;
      }
      if (this.Page.create_time == 10 && this.Page.times.length == 0) {
        this.$message.error("请选择自定义时间段");
        return;
      }
       this.Page.pagenum = 1;
      this.Page.pagesize = 10;
      this.getMemberupMoneyList();
    },
    // 点击了清楚搜索
    onclear() {
      this.Page.pagenum = 1;
      this.Page.pagesize = 10;
      this.Page.create_time = "";
      this.Page.times = "";
      this.Page.keyword = "";
      this.Page.start_time = "";
      this.Page.end_time = "";
      this.getMemberupMoneyList();
    },
    // 点击了查看
    onview(row) {
  

      this.$api
        .gettuanOrderDetail({
          id: row.row.id
        })
        .then(res => {
          if (res.data.code == 200) {
            console.log(res.data.detail);
            this.roleFrom.order = res.data.detail.order;
            this.roleFrom.tableList = [];
            this.roleFrom.tableList.push(res.data.detail.tuan);
            // this.tableData = res.data.list;
            // this.Page.count = res.data.count;
          } else {
            this.$message.error(res.data.msg);
          }
        })
        .catch(res => {
          this.$message.error("网络错误");
          console.log(res);
        });

      this.dialogVisible = true;
    },
    onviewOder(row) {
         this.$api
        .gettuanOrderDetailDetail({
          id: row.row.id
        })
        .then(res => {
          if (res.data.code == 200) {
            console.log(res.data.detail);
            
            this.roleFromSon.order = res.data.detail.order;
            this.roleFromSon.address = res.data.detail.address;
            this.roleFromSon.tableList = [];
            this.roleFromSon.tableList.push(res.data.detail.order_list);
            this.roleFromSon.user = res.data.detail.user;

            
            // this.tableData = res.data.list;
            // this.Page.count = res.data.count;
          } else {
            this.$message.error(res.data.msg);
          }
        })
        .catch(res => {
          this.$message.error("网络错误");
          console.log(res);
        });

        
      this.dialogVisibleson = true;
    }
  },
  // 监听属性
  watch: {},
  // 组件
  component: {},
  // 计算属性
  computed: {}
};
</script>

<style lang="less" scoped>
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
</style>