<template>
  <div>
    <el-row>
      <el-col :span="24">
        <el-card shadow="always">
          <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="130px">
            <el-form-item label="挑选商品">
              <el-button type="primary" size="small" @click="addGoods">挑选商品</el-button>
            </el-form-item>
            <el-form-item label="商品信息" v-if="ruleForm.price.length>0">
              <el-alert style="line-height: 20px" title="购买数量必须是正整数" type="warning"></el-alert>
              <div class="height"></div>
              <el-table
                border=""
                :data="ruleForm.price"
                style="width: 100%"
                stripe
                @selection-change="handleSelectionChange"
              >
                <el-table-column label="商品名称" prop="name"></el-table-column>
                <el-table-column label="购买数量">
                  <template slot-scope="row">
                    <el-input v-model="row.row.num" type="number"></el-input>
                  </template>
                </el-table-column>
                <el-table-column label="购买单位" prop="units"></el-table-column>
                <el-table-column label="购买价格" prop="price">
                  <template slot-scope="row">
                    <div>{{Math.floor(row.row.num)*row.row.price}}元</div>
                  </template>
                </el-table-column>
                <el-table-column label="价格参考" prop="price_reference"></el-table-column>
                <el-table-column label="操作" width="180">
                  <template slot-scope="row">
                    <el-button size="small" type="danger" @click="ondelGoods(row)" v-no-click>删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-form-item>
            <el-form-item label="收货方式">
              <el-radio v-model="ruleForm.send_type" label="1">快递</el-radio>
              <el-radio v-model="ruleForm.send_type" label="2">自提</el-radio>
            </el-form-item>
            <el-form-item label="选择发货/自提点" prop="shop_id">
              <el-select v-model="ruleForm.shop_id" placeholder="请选择" v-if="ruleForm.send_type==1">
                <el-option
                  v-for="item in expressage"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
              <el-select v-model="ruleForm.shop_id" placeholder="请选择" v-else>
                <el-option
                  v-for="item in pick_up"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="手机号码" prop="phone">
              <el-input v-model="ruleForm.phone"></el-input>
            </el-form-item>
            <el-form-item label="联系人" prop="name">
              <el-input v-model="ruleForm.name"></el-input>
            </el-form-item>
            <el-form-item label="提货时间" prop="extract_time">
              <el-date-picker
                v-model="ruleForm.extract_time"
                type="datetime"
                value-format="timestamp"
                placeholder="选择日期时间"
                default-time="12:00:00"
              ></el-date-picker>
            </el-form-item>
            <el-form-item label="选择区域 " v-if="ruleForm.send_type==1">
              <el-cascader v-model="ruleForm.city" :options="options"></el-cascader>
            </el-form-item>
            <el-form-item label="详细地址" v-if="ruleForm.send_type==1" prop="address">
              <el-input v-model="ruleForm.address"></el-input>
            </el-form-item>
            <el-form-item label="配送费">
              <el-input v-model="ruleForm.freight" type="number"></el-input>
            </el-form-item>
            <el-form-item label="订单金额">
              <el-input v-model="ruleForm.goods_money" type="number"></el-input>
            </el-form-item>
            <el-form-item label="优惠金额">
              <el-input v-model="ruleForm.discount_money" type="number"></el-input>
            </el-form-item>
            <el-form-item label="付款金额">
              <el-input v-model="ruleForm.money" type="number"></el-input>
            </el-form-item>
            <el-form-item label="付款类型">
              <el-radio v-model="ruleForm.pay_type" label="1">微信支付</el-radio>
              <el-radio v-model="ruleForm.pay_type" label="2">余额(会员卡)</el-radio>
              <el-radio v-model="ruleForm.pay_type" label="4">支付宝</el-radio>
              <el-radio v-model="ruleForm.pay_type" label="5">现金</el-radio>
            </el-form-item>
            <el-form-item label="会员卡号" v-if="ruleForm.pay_type==2" prop="card_number">
              <el-input v-model="ruleForm.card_number" type="number"></el-input>
            </el-form-item>
            <el-form-item label="备注">
              <el-input v-model="ruleForm.note" type="textarea" :rows="3"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" v-no-click @click="onsubmit" size="mini">提交</el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>
    </el-row>
    <el-dialog
      title="商品列表"
      :visible="dialogVisible"
      width="50%"
      :show-close="false"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <el-row>
        <el-col>
          <el-select v-model="Page.id" placeholder="请选择" v-if="ruleForm.send_type==1">
            <el-option
              v-for="item in ruleForm.list"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
          <el-input placeholder="请输入内容" v-model="Page.keyword" class="input-with-select">
            <el-button slot="append" icon="el-icon-search" @click="onserch"></el-button>
          </el-input>
        </el-col>
      </el-row>
      <div class="height"></div>
      <el-table
        border=""
        :data="tableData"
        style="width: 100%"
        stripe
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column label="商品名称" prop="name"></el-table-column>
        <el-table-column label="id" prop="pid"></el-table-column>
        <el-table-column label="商品图片">
          <template slot-scope="row">
            <div v-if="row.row.thumb">
              <el-image style="width: 50px; height: 50px" :src="row.row.thumb"></el-image>
            </div>
            <div v-else>暂无图片</div>
          </template>
        </el-table-column>
        <el-table-column label="商品分类" prop="title"></el-table-column>
        <el-table-column label="商品编号" prop="commodity_code"></el-table-column>
      </el-table>
      <div class="height"></div>
      <div class="pagination">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :page-sizes="[7, 12, 15, 20]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="Page.count"
        ></el-pagination>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="oncancel" v-no-click>取 消</el-button>
        <el-button type="primary" @click="onconfirm" v-no-click>确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { options } from "@/assets/js/cityDataArr.js";
import { validtel } from "@/utils/validtel.js";
import _ from 'lodash'
export default {
  // props:[],
  // 页面加载
  components: {},
  created() {
    this.getweiOrder();
    console.log(123);
  },
  // 页面加载完成
  mounted() {},
  data() {
    return {
      expressage: [],
      pick_up: [],
      options,
      tableData: [],
      dialogVisible: false,
      ruleForm: {
        send_type: "1",
        shop_id: "",
        phone: "",
        city: "",
        address: "",
        freight: 0,
        money: 0,
        goods_money:0,
        discount_money: 0,
        pay_type: "5",
        card_number: "",
        pid: [],
        price: [],
        name:"",
        list: [
          {
            name: "id查询",
            id: 1
          },
          {
            name: "名称查询",
            id: 2
          },
          {
            name: "编码查询",
            id: 3
          }
        ],
        extract_time:""
      },
      rules: {
        name:[ { required: true, message: '请输入联系人', trigger: 'blur' }],
        card_number:[ { required: true, message: '请输入会员卡号', trigger: 'blur' }],
        address:[ { required: true, message: '请输入详细地址', trigger: 'blur' }],
        extract_time:[ { required: true, message: '请选择提货时间', trigger: 'change' }],
        phone:[          { required: true, message: "请输入手机号", trigger: "blur" },
          { validator: validtel, trigger: "blur" }],
        shop_id:[ { required: true, message: '请选择发货/自提点', trigger: 'change' }],
      },
      Page: {
        pagenum: 1,
        pagesize: 10,
        count: 0,
        id: "",
        keyword: ""
      }
    };
  },
  // 方法
  methods: {
    getweiOrder() {
      this.$api
        .getaddWeiOrder({})
        .then(res => {
          if (res.data.code == 200) {
            this.expressage = res.data.expressage;
            this.pick_up = res.data.pick_up;
          } else {
            this.$message.error(res.data.msg);
          }
        })
        .catch(res => {
          this.$message.error("网络错误");
          console.log(res);
        });
    },
    addGoods() {
      this.$api
        .getweiShopOrder(this.Page)
        .then(res => {
          if (res.data.code == 200) {
            this.dialogVisible = true;
            this.tableData = res.data.list.data;
            this.Page.count = res.data.list.total;
          } else {
            this.$message.error(res.data.msg);
          }
        })
        .catch(res => {
          this.$message.error("网络错误");
          console.log(res);
        });
    },
    oncancel() {
      this.dialogVisible = false;
      this.Page.id = "";
      this.Page.keyword = "";
    },
    // 分页
    handleCurrentChange(e) {
      this.Page.pagenum = e;
      this.addGoods();
    },
    // 分页
    handleSizeChange(e) {
      this.Page.pagesize = e;
      this.addGoods();
    },
    onconfirm() {
      if (this.ruleForm.pid.length != 1) {
        this.$message.error("只能选择一个商品");
        return;
      }
      this.$api
        .getproductSubmitOrder({
          id: this.ruleForm.pid[0].pid
        })
        .then(res => {
          if (res.data.code == 200) {
            this.dialogVisible = false;
            res.data.data.price[0].pid=this.ruleForm.pid[0].pid
            this.ruleForm.price = [
              ...this.ruleForm.price,
              ...res.data.data.price
            ];
          } else {
            this.$message.error(res.data.msg);
          }
        })
        .catch(res => {
          this.$message.error("网络错误");
          console.log(res);
        });
    },
    handleSelectionChange(e) {
      this.ruleForm.pid = e;
    },
    ondelGoods(row) {
      this.ruleForm.price = this.ruleForm.price.filter((x, index) => {
        return row.$index != index;
      });
    },
    onserch() {
      this.addGoods();
    },
    onsubmit(){
      if(this.ruleForm.price.length==0){
        this.$message.error("请挑选商品");
        return 
      } 
         if(this.ruleForm.city.length==0){
        this.$message.error("请选择地区");
        return 
      } 
    
        let data = _.cloneDeep(this.ruleForm);
        if(data.extract_time){
          data.extract_time= data.extract_time/1000
        }
          data.id=data.price.map(x=>{
            return {
                 goods_id:x.pid,price_id:x.id,num:x.num
            }
          })
          data.id=JSON.stringify(data.id)
          data.pid=[]
          data.price=[]
          data.list=[]
          data.address=data.city.join("")+data.address
            this.$refs.ruleForm.validate((valid) => {
          if (!valid) return 
        this.$api
        .getaddWeiOrders(data)
        .then(res => {
          if (res.data.code == 200) {
          this.$message.success(res.data.msg);
          } else {
            this.$message.error(res.data.msg);
          }
        })
        .catch(res => {
          this.$message.error("网络错误");
          console.log(res);
        });
            })
    }
  },
  // 监听属性
  watch: {
    "ruleForm.send_type"() {
      this.ruleForm.shop_id = "";
    }
  },
  // 组件
  component: {},
  // 计算属性
  computed: {}
};
</script>

<style lang="less" scoped>
.input-with-select {
  width: 35%;
  margin-left: 10px;
}
</style>