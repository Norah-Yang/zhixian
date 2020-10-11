<template>
    <div>
      <!-- 面包屑导航区域 -->
      <!-- <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>您当前所在位置</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>会员卡管理</el-breadcrumb-item>
        <el-breadcrumb-item>会员卡类型添加</el-breadcrumb-item>
      </el-breadcrumb> -->
      <!-- 卡片视图区域 -->
      <el-card>
        <el-form :model="cardTypeForm" :rules="cardTypeFormRules" ref="cardTypeFormRef" label-width="130px">
          <el-divider class="title">基本信息</el-divider>
          <el-form-item label="卡型名称" prop="name">
            <el-input v-model="cardTypeForm.name"></el-input>
          </el-form-item>
          <el-form-item label="会员有效期">
            <el-input v-model="cardTypeForm.indate"></el-input>
            <p>(单位天，默认为零时, 永久有效)</p>
          </el-form-item>
          <el-divider class="title">储值设置</el-divider>
          <el-form-item label="是否支持储值">
            <el-switch v-model="cardTypeForm.money_state" active-value="1" inactive-value="0" @change="moneyState"></el-switch> <span class="tips">(会员卡是否支持储值)</span>
          </el-form-item>
          <el-form-item label="是否储值消费" v-if="cardTypeForm.money_state == 1">
            <el-switch v-model="cardTypeForm.money_type" active-value="1" inactive-value="0"></el-switch> <span class="tips">(会员卡必须全额消费，不支持组合付款，余额不足必须储值消费)</span>
          </el-form-item>
          <el-form-item label="编辑赠送金额" v-if="cardTypeForm.money_state == 1">
            <el-switch v-model="cardTypeForm.give_money" active-value="1" inactive-value="0"></el-switch> <span class="tips">(会员卡支持储值时，收银端赠送金额是否可编辑)</span>
          </el-form-item>
          <el-divider class="title">支付设置</el-divider>
          <el-form-item label="支持积分支付">
            <el-switch v-model="cardTypeForm.score_state" active-value="1" inactive-value="0"></el-switch> <span class="tips">(会员卡是否支持积分支付)</span>
          </el-form-item>
          <el-form-item label="支持优惠券支付">
            <el-switch v-model="cardTypeForm.coupon_state" active-value="1" inactive-value="0"></el-switch> <span class="tips">(会员卡是否支持优惠券支付)</span>
          </el-form-item>
          <el-form-item label="支持跨店使用">
            <el-switch v-model="cardTypeForm.shop_state" active-value="1" inactive-value="0"></el-switch> <span class="tips">(
会员卡是否支持跨店使用（适用场景：订单消费、会员卡储值、会员卡整单退款）)</span>
          </el-form-item>
          <el-form-item label="会员卡价格设置">
            <el-radio v-model="cardTypeForm.sale_state" label="0" border>销售价</el-radio>
            <el-radio v-model="cardTypeForm.sale_state" label="1" border>会员价</el-radio> <span class="tips">(会员卡结算时使用的商品售价)</span>
          </el-form-item>
          <el-form-item label="开启支付密码">
            <el-switch v-model="cardTypeForm.password_state" active-value="1" inactive-value="0"></el-switch>
          </el-form-item>
          <el-divider class="title">积分与等级设置</el-divider>
          <el-form-item label="会员卡支持积分" >
            <el-switch v-model="cardTypeForm.member_score_state" active-value="1" inactive-value="0" @change="scoreState"></el-switch>
          </el-form-item>
          <el-form-item label="会员卡积分规则" v-if="cardTypeForm.member_score_state == 1">
            <el-input v-model="cardTypeForm.score_rule">
              <template slot="append">元=1分</template>
            </el-input> <span class="tips">（积分的数值精确到个位（舍弃小数点，不四舍五入））</span>
          </el-form-item>
          <el-form-item label="使用会员卡等级">
            <el-switch v-model="cardTypeForm.member_grade_state" active-value="1" inactive-value="0"></el-switch>
          </el-form-item>
          <el-form-item label="使用卡等级积分">
            <el-switch v-model="cardTypeForm.score_grade_state" active-value="1" inactive-value="0"></el-switch><span class="tips"> （开启使用会员卡等级后有效，否则默认使用会员卡类型的积分规则）</span>
          </el-form-item>
          <el-form-item label="会员卡升级规则">
            <el-select v-model="cardTypeForm.member_rule" placeholder="选择默认规则">
              <el-option
                v-for="item in ruleOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-divider class="title">网店设置</el-divider>
          <el-form-item label="网点注册默认类型">
            <el-switch v-model="cardTypeForm.internet_state" active-value="1" inactive-value="0"></el-switch><span class="tips"> （设置提醒，线上商城会员卡消费不支持会员等级）</span>
          </el-form-item>
          <el-divider class="title">其它设置</el-divider>
          <el-form-item label="备注">
            <el-input type="textarea" :rows="4" placeholder="请输入内容" v-model="cardTypeForm.remark"> </el-input>
          </el-form-item>
          <el-form-item label="是否启用">
            <el-switch v-model="cardTypeForm.state" active-value="1" inactive-value="0"></el-switch>
          </el-form-item>
          <el-form-item>
            <el-button  @click="resetForm('cardTypeFormRef')" size="mini">重置</el-button>
            <el-button type="primary" @click="onSubmit('cardTypeFormRef')" size="mini">保存</el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </div>
</template>

<script>
export default {
  data () {
    return {
      cardTypeFormRules: {
        name: [
          { required: true, message: '请输入卡型名称', trigger: 'blur' }
        ]
      },
      cardTypeForm: {},
      ruleOptions: [
        {
          label: '只升不降',
          value: 0
        },
        {
          label: '只降不升',
          value: 1
        }
      ],
      cardId: ''
    }
  },
  created () {
    this.cardId = this.$route.params.id || sessionStorage.getItem('cardId')
    console.log(this.cardId)
    this.getCardInfo()
  },
  methods: {
    async getCardInfo () {
      const loading = this.$loading({
          lock: true,
          text: 'Loading',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.1)'
        });
      const { data: res } = await this.$http.get('mapi/memberTypeUpdate', { params: { id: this.cardId } })
      if (res.code !== 200) return this.$message.error('获取卡类型信息失败！')
      // this.$message.success('获取卡类型信息成功！')
      loading.close();
      this.cardTypeForm = res.list
    },
    moneyState () {
      // eslint-disable-next-line eqeqeq
      if (this.cardTypeForm.money_state == '0') {
        console.log('关')
        // eslint-disable-next-line eqeqeq
        if (this.cardTypeForm.money_type == undefined && this.cardTypeForm.give_money == undefined) {
          return false
        }
        // eslint-disable-next-line camelcase
        this.cardTypeForm.money_type = '0'
        // eslint-disable-next-line camelcase
        this.cardTypeForm.give_money = '0'
      } else {
        const obj1 = this.cardTypeForm
        if (obj1.money_type !== undefined && obj1.give_money !== undefined) {
          return false
        }
        const obj2 = {
          // eslint-disable-next-line camelcase
          money_type: '0',
          // eslint-disable-next-line camelcase
          give_money: '1'
        }
        this.cardTypeForm = {
          ...obj1,
          ...obj2
        }
      }
    },
    scoreState () {
      // eslint-disable-next-line eqeqeq
      if (this.cardTypeForm.member_score_state == '0') {
        console.log('关')
        // eslint-disable-next-line eqeqeq
        if (this.cardTypeForm.score_rule == undefined) {
          return false
        }
        // eslint-disable-next-line camelcase
        this.cardTypeForm.score_rule = '0'
      } else {
        const obj1 = this.cardTypeForm

        if (obj1.score_rule !== undefined) {
          return false
        }
        const obj2 = {
          // eslint-disable-next-line camelcase
          score_rule: 1
        }
        this.cardTypeForm = {
          ...obj1,
          ...obj2
        }
      }
    },
    onSubmit (formName) {
      this.$refs[formName].validate(async valid => {
        if (valid) {
          const obj1 = this.cardTypeForm
          const obj2 = { id: this.cardId }
          const obj3 = {
            ...obj1,
            ...obj2
          }
          const { data: res } = await this.$http.post('mapi/memberTypeUpdate', obj3)
          if (res.code !== 200) return this.$message.error('编辑失败, 请重新修改！')
          console.log('编辑成功')

          this.$router.push('membercard')
        } else {
          this.$message.error('请检查是否填写完善！！')
          return false
        }
      })
    },
    resetForm (formName) {
      this.$refs[formName].resetFields()
    }
  }
}
</script>

<style scoped lang="less">
.el-form{
  .title{
    color:teal;
    padding-bottom: 5px;
    margin-bottom:20px;
    .el-divider__text {
      color:teal;
      font-size:20px;

    }
  }
  .el-form-item{
    margin-bottom: 20px;
    label{
      color:#000;
    }
    span.tips{
      color:#999;
      font-size:12px;
      margin-left:20px;
    }
    .el-input{width:40%;}
  }
}

</style>
