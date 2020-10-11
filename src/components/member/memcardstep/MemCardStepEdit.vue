<template>
    <div>
      <!-- 面包屑导航区域 -->
      <!-- <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>您当前所在位置</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>会员卡管理</el-breadcrumb-item>
        <el-breadcrumb-item>会员卡等级添加</el-breadcrumb-item>
      </el-breadcrumb> -->
      <!-- 卡片视图区域 -->
      <el-card>
        <el-form :model="cardStepForm" :rules="FormRules" ref="cardStepFormRef" label-width="100px" >
          <el-form-item label="等级名称" prop="name">
            <el-input v-model="cardStepForm.name"></el-input>
          </el-form-item>
          <el-form-item label="消费金额" prop="money">
            <el-input v-model="cardStepForm.money" maxlength="6"></el-input>
          </el-form-item>
          <el-form-item label="等级折扣" prop="discount">
            <el-input v-model="cardStepForm.discount" maxlength="6"></el-input>
          </el-form-item>
          <el-form-item label="积分规则" prop="score_rule">
            <el-input v-model="cardStepForm.score_rule" maxlength="6">
              <template slot="append">元 = 1分</template>
            </el-input>
            <span>(积分的数值精确到个位（舍弃小数点，不四舍五入）)</span>
          </el-form-item>
          <el-form-item label="备注">
            <el-input type="textarea" :rows="4" v-model="cardStepForm.remark"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button  @click="resetForm('cardStepFormRef')" size="mini">重置</el-button>
            <el-button type="primary" @click="onSubmit('cardStepFormRef')" size="mini">保存</el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </div>
</template>

<script>
export default {
  data () {
    var validateMoney = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('消费金额不能为空'))
      } else {
        if (!Number(value)) {
          callback(new Error('请输入正确数字'))
        } else {
          if (value < 0) {
            callback(new Error('输入的数字必须大于0'))
          } else {
            callback()
          }
        }
      }
    }
    var validateDiscount = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('等级折扣不能为空'))
      } else {
        if (!(/(^[1-9]\d*$)/.test(value))) {
          callback(new Error('请输入0~100之间的正整数'))
        } else {
          if (value < 0 || value > 100) {
            callback(new Error('输入的数字必须0~100之间的数字'))
          } else {
            callback()
          }
        }
      }
    }
    var validateScoreRule = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('请输入积分规则金额'))
      } else {
        if (!Number(value)) {
          callback(new Error('请输入0~100之间的正整数'))
        } else {
          if (value < 1) {
            callback(new Error('输入的数字必须大于1'))
          } else {
            callback()
          }
        }
      }
    }
    return {
      FormRules: {
        name: [
          { required: true, message: '请输入等级名称', trigger: 'blur' }
        ],
        money: [
          { required: true, validator: validateMoney, trigger: 'blur' }
        ],
        discount: [
          { required: true, validator: validateDiscount, trigger: 'blur' }
        ],
        // eslint-disable-next-line camelcase
        score_rule: [
          { required: true, validator: validateScoreRule, trigger: 'blur' }
        ]
      },
      cardStepForm: {},
      cardStepId: '' // 等级卡id
    }
  },
  created () {
    this.cardStepId = this.$route.params.id || sessionStorage.getItem('cardStepId')
    console.log(this.cardStepId)
    this.getCardStepInfo()
  },
  methods: {
    async getCardStepInfo () {
      const loading = this.$loading({
          lock: true,
          text: 'Loading',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.1)'
        });
      const { data: res } = await this.$http.get('mapi/memberGradeUpdate', { params: { id: this.cardStepId } })
      console.log(res)
      if (res.code !== 200) return this.$message.error('获取等级卡信息失败！')
      // this.$message.success('获取等级卡信息成功！')
      loading.close();
      this.cardStepForm = res.list
    },
    // 提交表单
    onSubmit (formName) {
      this.$refs[formName].validate(async valid => {
        if (valid) {
          const { data: res } = await this.$http.post('mapi/memberGradeUpdate', this.cardStepForm)
          if (res.code !== 200) return this.$message.error('修改失败, 请重新修改！')
          this.$message.success('修改成功')
          this.$router.push('cardstep')
        } else {
          this.$message.error('请检查是否填写完善！！')
          return false
        }
      })
    },
    // 重置表单
    resetForm (formName) {
      this.$refs[formName].resetFields()
    }
  }
}
</script>

<style scoped lang="less">
.el-form{
  .el-input{width:40%;}
  .el-form-item {
    span{
      font-size:12px;
      color:#999;
      margin-left:20px;
    }
  }
}
</style>
