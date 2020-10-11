<template>
  <el-card>
    <el-row :gutter="5" style="width:100%">
        <el-col >
            <el-form :model="ruleForm"  ref="ruleForm" label-width="200px" class="demo-ruleForm">
                <el-divider content-position="center">收银配置</el-divider>
                <el-form-item  label="交班设置：" prop="be_on_duty">
                  <el-radio-group v-model="ruleForm.be_on_duty">
                    <el-radio :label="1">明交(输入交班金额)</el-radio>
                    <el-radio :label="2">暗交(显示交班金额)</el-radio>
                    <el-radio :label="3">暗交(隐藏交班金额)</el-radio>
                </el-radio-group>
                </el-form-item>
                <el-form-item label="启用备用金：" prop="petty_cash">
                    <el-switch
                        v-model="ruleForm.petty_cash"
                        active-color="#008080"
                        inactive-color="#ff4949"
                        active-text="是"
                        inactive-text="否"
                        :active-value="1"
                        :inactive-value="0"
                    ></el-switch>
                </el-form-item>
                <el-form-item label="收银机指定商品：" prop="machine_goods">
                    <el-radio-group v-model="ruleForm.machine_goods">
                        <!-- <el-radio :label="0">待选择</el-radio> -->
                        <el-radio :label="1">按商品</el-radio>
                        <el-radio :label="2">按分类</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="会员卡使用密码：" prop="member_password">
                    <el-switch
                        v-model="ruleForm.member_password"
                        active-color="#008080"
                        inactive-color="#ff4949"
                        active-text="是"
                        inactive-text="否"
                        :active-value="1"
                        :inactive-value="0"
                    ></el-switch>
                </el-form-item>
                <el-form-item label="是否开启导购：" prop="guide">
                    <el-switch
                        v-model="ruleForm.guide"
                        active-color="#008080"
                        inactive-color="#ff4949"
                        active-text="是"
                        inactive-text="否"
                        :active-value="1"
                        :inactive-value="0"
                    ></el-switch>
                </el-form-item>
                <el-form-item label="结算启用挂账：" prop="close_account">
                    <el-switch
                        v-model="ruleForm.close_account"
                        active-color="#008080"
                        inactive-color="#ff4949"
                        active-text="是"
                        inactive-text="否"
                       :active-value="1"
                        :inactive-value="0"
                    ></el-switch>
                </el-form-item>
                <el-form-item label="储值启用挂账：" prop="stored_account">
                    <el-switch
                        v-model="ruleForm.stored_account"
                        active-color="#008080"
                        inactive-color="#ff4949"
                        active-text="是"
                        inactive-text="否"
                        :active-value="1"
                        :inactive-value="0"
                    ></el-switch>
                </el-form-item>
                <el-form-item label="退款退回原账户：" prop="refund">
                    <el-switch
                        v-model="ruleForm.refund"
                        active-color="#008080"
                        inactive-color="#ff4949"
                        active-text="是"
                        inactive-text="否"
                        :active-value="1"
                        :inactive-value="0"
                    ></el-switch>
                </el-form-item>
                <el-form-item label="成本核算方式：" prop="cost_calculate">
                 <el-select v-model="ruleForm.cost_calculate" placeholder="请选择">
                    <el-option v-for="item in options" :key="item.value" :label="item.title" :value="item.id"></el-option>
                 </el-select> 
                </el-form-item>
                <el-form-item label="编辑同步数据：" prop="synchronization">
                    <el-switch
                        v-model="ruleForm.synchronization"
                        active-color="#008080"
                        inactive-color="#ff4949"
                        active-text="是"
                        inactive-text="否"
                        :active-value="1"
                        :inactive-value="0"
                    ></el-switch>
                    <div class="gray">商品编辑，是否同步数据到分店</div>
                </el-form-item>
                <el-divider content-position="center">商城配置</el-divider>
                <el-form-item label="开启微信模板消息：" prop="wechat_template">
                    <el-switch
                        v-model="ruleForm.wechat_template"
                        active-color="#008080"
                        inactive-color="#ff4949"
                        active-text="是"
                        inactive-text="否"
                        :active-value="1"
                        :inactive-value="0"
                    ></el-switch>
                </el-form-item>
                <el-form-item label="是否按店核销订单：" prop="cancel_after_verification">
                    <el-switch
                        v-model="ruleForm.cancel_after_verification"
                        active-color="#008080"
                        inactive-color="#ff4949"
                        active-text="是"
                        inactive-text="否"
                        :active-value="1"
                        :inactive-value="0"
                    ></el-switch>
                    <div class="gray">未开启状态，订单会自动分配给核销的收银机所属门店或者核销账户管理的店点（前提条件，账户只管理一个店点）</div>
                </el-form-item>
                <el-divider content-position="center">安全验证配置</el-divider>
                <el-form-item label="短信验证：" prop="note_verify">
                    <el-radio-group v-model="ruleForm.note_verify">
                        <el-radio :label="1">全不选</el-radio>
                        <el-radio :label="2">管理后台</el-radio>
                        <el-radio :label="3">收银端</el-radio>
                        <el-radio :label="4">全选</el-radio>
                    </el-radio-group>               
                    <div class="gray">开启短信验证，使用用户名密码登录后需输入短信验证码进行身份验证</div><br>
                    <div class="red">开启短信验证，必须在短信配置中的开启短信通知及手机号验证发送短信</div>
                </el-form-item>
                <el-divider content-position="center">短信配置</el-divider>
                <el-form-item label="是否开启短信通知：" prop="note_inform">
                    <el-switch
                        v-model="ruleForm.note_inform"
                        active-color="#008080"
                        inactive-color="#ff4949"
                        active-text="是"
                        inactive-text="否"
                        :active-value="1"
                        :inactive-value="0"
                    ></el-switch>
                </el-form-item>
                <div v-if="ruleForm.note_inform">
                <el-form-item label="注册会员卡发送短信：" prop="register_member">
                    <el-switch
                        v-model="ruleForm.register_member"
                        active-color="#008080"
                        inactive-color="#ff4949"
                        active-text="是"
                        inactive-text="否"
                        :active-value="1"
                        :inactive-value="0"
                    ></el-switch>
                    <div class="gray">收银客户端办理会员卡后，发送交易通知，给予用户关怀提醒</div>   <el-button type="text" @click="open">短信测试</el-button>
                </el-form-item>   
                <el-form-item label="会员卡储值发送短信：" prop="stored_member">
                    <el-switch
                        v-model="ruleForm.stored_member"
                        active-color="#008080"
                        inactive-color="#ff4949"
                        active-text="是"
                        inactive-text="否"
                        :active-value="1"
                        :inactive-value="0"
                    ></el-switch>
                    <div class="gray">收银客户端会员卡储值后，发送交易通知，给予用户关怀提醒</div>   <el-button type="text" @click="open">短信测试</el-button>
                </el-form-item>   
                <el-form-item label="会员卡退款短信提醒："  prop="refund_member">
                    <el-switch
                        v-model="ruleForm.refund_member"
                        active-color="#008080"
                        inactive-color="#ff4949"
                        active-text="是"
                        inactive-text="否"
                        :active-value="1"
                        :inactive-value="0"
                    ></el-switch>
                    <div class="gray">收银客户端订单退款退回到会员卡，发送交易通知，给予用户关怀提醒</div>   <el-button type="text" @click="open">短信测试</el-button>
                </el-form-item>   
                <el-form-item label="会员卡消费发送短信：" prop="consume_member">
                    <el-switch
                        v-model="ruleForm.consume_member"
                        active-color="#008080"
                        inactive-color="#ff4949"
                        active-text="是"
                        inactive-text="否"
                        :active-value="1"
                        :inactive-value="0"
                    ></el-switch>
                    <div class="gray">收银客户端使用会员卡消费，发送交易通知，给予用户关怀提醒</div>   <el-button type="text" @click="open">短信测试</el-button>
                </el-form-item>   
                <el-form-item label="手机号验证发送短信：" prop="phone_note">
                    <el-switch
                        v-model="ruleForm.phone_note"
                        active-color="#008080"
                        inactive-color="#ff4949"
                        active-text="是"
                        inactive-text="否"
                        :active-value="1"
                        :inactive-value="0"
                    ></el-switch>
                    <div class="gray">用户注册电子会员卡或者线上绑定会员卡发送安全验证码</div>   <el-button type="text" @click="open">短信测试</el-button>
                </el-form-item>   
                <el-form-item label="优惠券发放发送短信：" prop="coupons_note">
                    <el-switch
                        v-model="ruleForm.coupons_note"
                        active-color="#008080"
                        inactive-color="#ff4949"
                        active-text="是"
                        inactive-text="否"
                        :active-value="1"
                        :inactive-value="0"
                    ></el-switch>
                    <div class="gray">针对会员卡消费用户发放专属渠道优惠券，有利于形成第一时间的客户二次消费</div><el-button type="text" @click="open">短信测试</el-button>
                </el-form-item>   
                <el-form-item label="订单取货通知短信："  prop="order_claim_note">
                    <el-switch
                        v-model="ruleForm.order_claim_note"
                        active-color="#008080"
                        inactive-color="#ff4949"
                        active-text="是"
                        inactive-text="否"
                        :active-value="1"
                        :inactive-value="0"
                    ></el-switch>
                    <div class="gray">收银客户端提醒消费者到店取货，给予温馨提醒</div>   <el-button type="text" @click="open">短信测试</el-button>
                </el-form-item>   
                </div>
                <el-divider content-position="center">仓储配置</el-divider>
                <el-form-item label="禁止无库存调拨：" prop="forbid_repertory_allot">
                    <el-switch
                        v-model="ruleForm.forbid_repertory_allot"
                        active-color="#008080"
                        inactive-color="#ff4949"
                        active-text="是"
                        inactive-text="否"
                        :active-value="1"
                        :inactive-value="0"
                    ></el-switch>
                </el-form-item>   
                <el-form-item  label="调拨价取整：" prop="allot_integer">
                  <el-radio-group v-model="ruleForm.allot_integer">
                    <el-radio :label="0">默认不用</el-radio>
                    <el-radio :label="1">进位取整数</el-radio>
                    <el-radio :label="2">抹零取整数</el-radio>
                 </el-radio-group>
                </el-form-item>   
                <el-form-item label="调拨审核出库单：" prop="allot_audit">
                    <el-switch
                        v-model="ruleForm.allot_audit"
                        active-color="#008080"
                        inactive-color="#ff4949"
                        active-text="是"
                        inactive-text="否"
                        :active-value="1"
                        :inactive-value="0"
                    ></el-switch>
                </el-form-item>   
                <el-form-item label="报损商品价格设置："  prop="breakage_goods">
                    <el-radio-group v-model="ruleForm.breakage_goods">
                        <el-radio :label="1">按成本价</el-radio>
                        <el-radio :label="2"> 按销售价</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-divider content-position="center">积分配置</el-divider>
                <el-form-item label="会员积分：" prop="member_integral">
                     <el-radio-group v-model="ruleForm.member_integral">
                        <el-radio :label="1">全不选</el-radio>
                        <el-radio :label="2">线上使用</el-radio>
                        <el-radio :label="3">线下使用</el-radio>
                        <el-radio :label="4">全选</el-radio>
                    </el-radio-group>  
                    <div class="gray">线上使用指会员积分可以在积分商城兑换商品及优惠券，线下使用指会员积分可以在收银端抵扣金额</div>
                </el-form-item>
                <el-form-item label="会员卡积分：" prop="membership_card_integral">
                    <el-radio-group v-model="ruleForm.membership_card_integral">
                        <el-radio :label="1">全不选</el-radio>
                        <el-radio :label="2">线上使用</el-radio>
                        <el-radio :label="3">线下使用</el-radio>
                        <el-radio :label="4">全选</el-radio>
                    </el-radio-group>               
                    <div class="gray">线上使用指会员卡积分可以在积分商城兑换商品及优惠券，线下使用指会员卡积分可以在收银端抵扣金额</div>
                </el-form-item>
                <el-divider content-position="center">红包配置</el-divider>
                <el-form-item label="红包发送者名称：" style="width:40%" prop="red_packet_name">
                    <el-input v-model="ruleForm.red_packet_name"></el-input>
                    <div class="gray">（注意：敏感词会被转义成字符*）</div>
                </el-form-item>
                <el-form-item label="红包祝福语：" style="width:40%" prop="red_packet_benediction">
                    <el-input v-model="ruleForm.red_packet_benediction"></el-input>
                    <div class="gray">（注意：敏感词会被转义成字符*）</div>
                </el-form-item>
                <el-form-item label="活动名称：" style="width:40%" prop="activity_name">
                    <el-input v-model="ruleForm.activity_name"></el-input>
                    <div class="gray">（活动名称不超过16个字。注意：敏感词会被转义成字符*）</div>
                </el-form-item>
                <el-form-item label="备注信息：" style="width:40%" prop="intro">
                    <el-input v-model="ruleForm.intro"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="submitForm('ruleForm')" size="mini">确定</el-button>
                    <el-button @click="resetForm('ruleForm')" size="mini">重置</el-button>
                </el-form-item>
            </el-form>
        </el-col>
    </el-row>
    <el-row>
        <el-col>
            <el-dialog :title="title" :visible="dialogVisible" width="30%" :show-close="false">
            <el-input v-model="phone" placeholder="请输入手机号"></el-input>
            <span slot="footer" class="dialog-footer">
                <el-button @click="no"   v-no-click>取 消</el-button>
                <el-button type="primary" @click="yes"   v-no-click>发送</el-button>
            </span>
            </el-dialog>
        </el-col> 
    </el-row>
  </el-card>
</template>



<script>
export default {
     data(){
        return {
            options:[{id:1,title:"加权平均法",value:11},{id:2,title:"中心人工指定",value:22}],
            dialogVisible:false,
            title:"短信测试",
            phone:"",
            ruleForm:{
            },
        }
    },
    created() {
    this.getCommom();
    },
    methods:{
        async getCommom(){
             const loading = this.$loading({
                lock: true,
                text: 'Loading',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.1)'
            });
            this.$api
            .getCommom(this.Page)
            .then(res => {
            if (res.data.code == 200) {
                // this.$message.success("查询成功");
                loading.close();
                this.ruleForm = res.data.list;
            } else {
                this.$api.error(res.data.msg);
            }
            })
            .catch(res => {
            this.$api.error();
            });
         },
         submitForm(formName) {
          this.$refs[formName].validate((valid) => {
            if (valid) {
              let id = this.$route.query.id
               this.$api.commomEdit(this.ruleForm)
                  .then(res=>{
                      res.data.code == 200 ? ( this.$message.success(res.data.msg),this.getCommom()):(this.$api.error(res.data.msg))
                  })
                  .catch(res => {
                  this.$api.error();
                  }); 
                
            } else {
              return false;
            }
          });
        },
      resetForm(formName) {
        this.$refs['ruleForm'].resetFields()
      },
       open() {
        this.dialogVisible = true
        this.phone=''
      },
      no(){
        this.dialogVisible = false
      },
      yes(){
          let ms = (/^1[3456789]\d{9}$/).test(this.phone)
          ms ?(
            this.$message.success("发送成功"),
            setTimeout(() => {
             this.dialogVisible = false
            }, 500)
          ):(
            this.$api.error("请输入正确的手机号码"),
            this.phone = ''
          )
      },
    }
}
</script>

<style lang="less" scoped>
.el-divider{
    background: teal;
}
.el-divider--horizontal{
    width:50%;
    margin:45px 25%;
}
.el-divider__text{
     color:teal;
 }
 .gray{
     color: #ccc;
     height: 20px;
     display: inline-block;
     margin: 0 20px;
 }
 .red{
     color: #ff5656;
     height: 20px;
     display: inline-block;
     margin: 0 20px;
 }
</style>