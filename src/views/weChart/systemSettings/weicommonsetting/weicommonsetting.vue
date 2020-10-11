 <template>
  <div>
    <el-row>
      <el-col :span="24">
        <el-card shadow="always">
          <el-collapse>
            <el-collapse-item title="商家信息">
              <div class="list">
                <div class="item">商城地区：</div>
                <div class="item">{{ruleForm.address}}</div>
              </div>
              <div class="list">
                <div class="item">页面标题：</div>
                <div class="item">{{ruleForm.name}}</div>
              </div>
              <div class="list">
                <div class="item">商城logo：</div>
                <div class="item">
                  <el-image style="width:100px; height: 100px" :src="ruleForm.logo" fit="contain"></el-image>
                </div>
              </div>
              <div class="list">
                <div class="item">联系电话：</div>
                <div class="item">{{ruleForm.phone}}</div>
              </div>
              <div class="list">
                <div class="item">商城域名：</div>
                <div class="item">{{ruleForm.domain_name}}</div>
              </div>
              <div class="list">
                <div class="item">商城简介：</div>
                <div class="item">{{ruleForm.intro}}</div>
              </div>
              <div class="list">
                <div class="item">商城版权：</div>
                <div class="item">{{ruleForm.copyright}}</div>
              </div>
            </el-collapse-item>
          </el-collapse>
          <el-form
            :model="from"
            :rules="rules"
            ref="ruleForm"
            label-width="130px"
            class="demo-ruleForm"
          >
            <el-form-item label="自提">
              <el-radio v-model="from.pick" label="1">开启</el-radio>
              <el-radio v-model="from.pick" label="0">关闭</el-radio>
              <span class="tip_red">设置开启后，单独购商品支持到店自提方式</span>
            </el-form-item>
            <el-form-item label="自提时间" v-if="from.pick==1">
              <el-radio v-model="from.pick_time" label="1">开启</el-radio>
              <el-radio v-model="from.pick_time" label="0">关闭</el-radio>
              <span class="tip_red">自提时间开启显示后，单独购商品结算页面显示自提时间</span>
            </el-form-item>
            <el-form-item label="快递">
              <el-radio v-model="from.expressage" label="1">开启</el-radio>
              <el-radio v-model="from.expressage" label="0">关闭</el-radio>
              <span class="tip_red">设置开启后，单独购商品支持快递发货方式</span>
            </el-form-item>
            <el-form-item label="快递时间" v-if="from.expressage==1">
              <el-radio v-model="from.expressage_time" label="1">开启</el-radio>
              <el-radio v-model="from.expressage_time" label="0">关闭</el-radio>
              <span class="tip_red">快递时间开启显示后，结算页面显示快递时间</span>
            </el-form-item>
            <el-form-item label="分类样式">
              <el-radio v-model="from.classify" label="1">综合版</el-radio>
              <el-radio v-model="from.classify" label="0">精简版</el-radio>
              <span class="tip_red">精简版，左分类右商品</span>
            </el-form-item>
            <el-form-item label="默认自提点">
              <el-radio v-model="from.default_pick" label="1">开启</el-radio>
              <el-radio v-model="from.default_pick" label="0">关闭</el-radio>
              <span class="tip_red">结算页面的默认自提点，显示自动加载默认自提点，隐藏自己选择自提点</span>
            </el-form-item>
            <el-form-item label="自提信息">
              <el-radio v-model="from.pick_intro" label="1">开启</el-radio>
              <el-radio v-model="from.pick_intro" label="0">关闭</el-radio>
              <span class="tip_red">结算页面的自提电话和姓名显示或隐藏</span>
            </el-form-item>
            <el-form-item label="">
              <el-divider style="display:block;text-align:center">小程序显示设置</el-divider>
            </el-form-item>
            <el-form-item label="小程序客服">
              <el-radio v-model="from.customer_service" label="1">开启</el-radio>
              <el-radio v-model="from.customer_service" label="0">关闭</el-radio>
              <span class="tip_red">小程序首页显示或隐藏悬浮的客服图标</span>
            </el-form-item>
            <el-form-item label="拨打电话">
              <el-radio v-model="from.making_call" label="1">开启</el-radio>
              <el-radio v-model="from.making_call" label="0">关闭</el-radio>
              <span class="tip_red">小程序首页显示或隐藏悬浮的电话图标</span>
            </el-form-item>
            <el-form-item label="">
              <el-divider style="display:block;text-align:center">商品设置</el-divider>
            </el-form-item>
            <el-form-item label="商品评价">
              <el-radio v-model="from.goods_evaluate" label="1">开启</el-radio>
              <el-radio v-model="from.goods_evaluate" label="0">关闭</el-radio>
              <span class="tip_red">评价将在商品详情页对客户进行展示</span>
            </el-form-item>
            <el-form-item label="用户评论">
              <el-radio v-model="from.user_evaluate" label="1">开启</el-radio>
              <el-radio v-model="from.user_evaluate" label="0">关闭</el-radio>
              <span class="tip_red">评论开启显示后，用户评论默认显示或者不显示</span>
            </el-form-item>
            <el-form-item label="购买记录">
              <el-radio v-model="from.shopping" label="1">开启</el-radio>
              <el-radio v-model="from.shopping" label="0">关闭</el-radio>
              <span class="tip_red">购买记录将在商品详情页对买家进行展示，仅针对模板themefour</span>
            </el-form-item>
            <el-form-item label="显示进行中的团">
              <el-radio v-model="from.tuan_ing" label="1">开启</el-radio>
              <el-radio v-model="from.tuan_ing" label="0">关闭</el-radio>
              <span class="tip_red">团购商品详情页，是否显示正在进行中的团</span>
            </el-form-item>
            <el-form-item label="显示市场价">
              <el-radio v-model="from.price" label="1">开启</el-radio>
              <el-radio v-model="from.price" label="0">关闭</el-radio>
              <span class="tip_red">普通商品列表及详情页是否显示市场价，拼团、秒杀及积分兑换商品列表及详情页是否显示销售价</span>
            </el-form-item>
               <el-form-item label="">
              <el-divider style="display:block;text-align:center">交易设置</el-divider>
            </el-form-item>
            <el-form-item label="支付时间"  prop="pay_tine">
              <el-input v-model.number="from.pay_tine"></el-input>
              <div style="color:#737373">单位秒，下单后支付时间限制，逾期未付款将取消订单，最小为900秒</div>
            </el-form-item>
            <el-form-item label="自动确认收货时间" prop="take">
              <el-input v-model="from.take"></el-input>
              <div style="color:#737373">发货后自动确认收货时间设置，以小时为单位，默认7天</div>
            </el-form-item>
                 <el-form-item label="">
              <el-divider style="display:block;text-align:center">推广配置</el-divider>
            </el-form-item>
            <el-form-item label="推广配置">
              <el-radio v-model="from.generalize" label="0">全民推广</el-radio>
              <el-radio v-model="from.generalize" label="1">社群推广</el-radio>
              <div class="tip_red">
                开启全民推广后，人人都可以当推广员，人人都可以看到赚字，分享出去当客户发生购买行为，推广者可获得邀请奖励；
                开启社群推广后，只有审核通过的在用社群推广员才能看到赚字，社群推广员邀请好友，当客户发生购买行为时，社群推广员可获得邀请奖励；
                社群推广可以将社群推广员和客户之间的关系进行绑定；社群推广员自己购买不给予邀请奖励，推广员之间相互购买也不给予邀请奖励。
              </div>
            </el-form-item>
            <el-form-item label="建立客户关系" v-if="from.generalize==1">
              <el-switch
                v-model="from.client"
                active-color="#008080"
                active-text="是"
                inactive-text="否"
                inactive-color="#ff4949"
              ></el-switch>
              <div
                class="tip_rer"
              >1. 建立客户关系，开启后允许社群推广员和客户之间绑定关系，在有效绑定期限内，已建立绑定关系的客户下单允许推广的商品即可给社群推广员给予邀请奖励；</div>
              <div
                class="tip_rer"
              >2. 当设置了不允许社群推广员建立客户关系后，社群推广员和客户之间关系则不会绑定，每次通过社群推广员推广的链接或者海报购买才会获得邀请奖励；</div>
              <div class="tip_rer">3. 若允许建立关系，在有效期内，已建立绑定关系的客户下单允许推广的商品即可给社群推广员给予邀请奖励；</div>
              <div
                class="tip_rer"
              >4. 建立客户关系修改后24小时生效：当设置了不允许社群推广员建立客户关系后，社群推广员之间的客户关系会失效，同时社群推广员和客户之间也无法再建立新的客户关系；而对于之前已经建立客户关系的社群推广员，购买后对方也无法获得邀请奖励（若重新允许后，之前绑定的客户关系会继续，且社群推广员和客户之间可以建立新的客户关系）</div>
            </el-form-item>
            <el-form-item label="绑定期限" v-if="from.generalize==1">
              <el-radio v-model="from.binding_deadline" label="1">有效时间段</el-radio>
              <el-radio v-model="from.binding_deadline" label="0">永久期限</el-radio>
              <div
                class="tip_rer"
              >1. 绑定期限是指客户关系在多久内受到保护，在保护期内，社群推广员发展的客户不会变更绑定关系，即使客户点了其他社群推广员的的链接，也不会改变客户关系；</div>
              <div
                class="tip_rer"
              >2. 绑定效期修改后24小时生效，并且会影响到之前的绑定关系。例如：若从永久变更为30天有效，则之前的绑定关系30天有效，超过30天的关系解除；若从30天变更为永久有效期，则之前在有效期内的客户关系将变为永久。已经解除关系的要重新邀请，客户关系才能变为永久。</div>
            </el-form-item>
            <el-form-item label="绑定时间" v-if="from.generalize==1&&from.binding_deadline==1" prop="binding_time">
              <el-input v-model.number="from.binding_time"></el-input>
              <div class="tip_red">单位天，客户绑定关系的有效期限</div>
            </el-form-item>
            <el-form-item label="提交">
              <el-button type="info" @click="onresetForm" v-no-click size="mini">重值</el-button>
              <el-button type="primary" @click="onconfirms" v-no-click size="mini">添加</el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import {isonenumber} from "@/utils/validtel.js"
import _ from "lodash";
export default {
  // props:[],
  // 页面加载
  created() {
    this.getaddLineshop();
  },
  // 页面加载完成
  mounted() {},
  data() {
    return {
      ruleForm: {
        address: "",
        copyright: "",
        domain_name: "",
        intro: "",
        logo: "",
        name: "",
        phone: ""
      },
      from: {
        pick: "1",
        pick_time: "1",
        pick_time: "1",
        expressage: "1",
        expressage_time:"1",
        classify: "1",
        default_pick:"1",
        customer_service:"1",
        making_call: "1",
        goods_evaluate: "1",
        user_evaluate: "1",
        shopping: "1",
        tuan_ing: "1",
        price: "1",
        generalize: "1",
        pick_intro: "1",
        pay_tine: 60,
        take: 168,
        client: true,
        binding_deadline: "1",
        binding_time: "1"
      },
      rules: {
         binding_time: [
            { validator: isonenumber, trigger: 'blur' }
          ],
            pay_tine: [
            { validator: isonenumber, trigger: 'blur' }
          ],
            take: [
            { validator: isonenumber, trigger: 'blur' }
          ]
      }
    };
  },
  // 方法
  methods: {
    getaddLineshop() {
      this.$api
        .geweiCommonSetting()
        .then(res => {
          if (res.data.code == 200) {
                                this.ruleForm = res.data.all;
                               this.from.binding_deadline=res.data.list.binding_deadline+""||"1"
                               this.from.binding_time=res.data.list.binding_time+""||"1"
                               this.from.classify=res.data.list.classify+""||"1"
                               this.from.client=res.data.list.client?true:false
                               this.from.customer_service=res.data.list.customer_service+""||"1"
                               this.from.default_pick=res.data.list.default_pick+""||"1"
                               this.from.expressage=res.data.list.expressage+""||"1"
                               this.from.expressage_time=res.data.list.expressage_time+""||"1"
                               this.from.generalize=res.data.list.generalize+""||"1"
                               this.from.goods_evaluate=res.data.list.goods_evaluate+""||"1"
                               this.from.making_call=res.data.list.making_call+""||"1"
                               this.from.pay_tine=res.data.list.pay_tine+""||60
                               this.from.pick=res.data.list.pick+""||"1"
                               this.from.pick_intro=res.data.list.pick_intro+""||"1"
                               this.from.pick_time=res.data.list.pick_time+""||"1"
                               this.from.price=res.data.list.price+""||"1"
                               this.from.shopping=res.data.list.shopping+""||"1"
                               this.from.take=res.data.list.take||168
                               this.from.tuan_ing=res.data.list.tuan_ing+""||"1"
          } else {
            this.$message.error(res.data.msg);
          }
        })
        .catch(res => {
          this.$message.error("网络错误");
          console.log(res);
        });
    },
    onconfirms(){

       let data = _.cloneDeep(this.from);
       data.client=data.client?1:0
         this.$refs.ruleForm.validate(valid => {
        if (!valid) return;
            this.$api
        .geweiCommonSettings(data)
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
    },
    onresetForm(){
 this.$refs.ruleForm.resetFields();
      this.from= {
        pick: 1,
        pick_time: 1,
        pick_time: 1,
        expressage: 1,
        expressage_time: 1,
        classify: 1,
        default_pick: 1,
        customer_service: 1,
        making_call: 1,
        goods_evaluate: 1,
        user_evaluate: 1,
        shopping: 1,
        tuan_ing: 1,
        price: 1,
        generalize: 1,
        pick_intro: 1,
        pay_tine: 60,
        take: 168,
        client: true,
        binding_deadline: 1,
        binding_time: 1
      }
    }
  },
  // 监听属性
  watch: {},
  // 组件
  components: {},
  // 计算属性
  computed: {},
  beforeDestroy() {}
};
</script>

<style lang="less" scoped>
.list {
  padding: 10px 70px;
  display: flex;
  align-items: center;
  .item {
    padding: 0 20px;
  }
}
.tip_red {
  color: red;
}
</style>