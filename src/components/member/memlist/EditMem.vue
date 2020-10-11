<template>
    <div>
      <!-- 面包屑导航区域 -->
      <!-- <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>您当前所在位置</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>会员卡管理</el-breadcrumb-item>
        <el-breadcrumb-item>会员卡修改</el-breadcrumb-item>
      </el-breadcrumb> -->
      <!-- 卡片视图区 -->
      <el-card>
        <el-form :model="cardForm" :rules="cardFormRules" ref="cardFormRef" label-width="130px">
          <el-form-item label="会员姓名" prop="name">
            <el-input v-model="cardForm.name"></el-input>
          </el-form-item>
          <el-form-item label="会员手机号" prop="phone" >
            <el-input v-model="cardForm.phone" maxlength="11"></el-input>
          </el-form-item>
          <el-form-item label="会员卡号" prop="card_number">
            <el-input v-model="cardForm.card_number"></el-input>
            <span>实体卡会员一实体卡号为准</span>
          </el-form-item>
          <el-form-item label="会员卡类型" prop="member_type_id">
            <el-select v-model="cardForm.member_type_id" placeholder="选择卡类型" @change="memTypeChange">
              <el-option
                v-for="item in cardTypeOptions"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="会员卡等级" :rules="{ required: true, message: '请选择会员卡等级', trigger: 'blur' }" v-if="show">
            <el-select v-model="cardForm.member_grade_id" placeholder="选择卡等级" @change="cardStepChange">
              <el-option
                v-for="item in cardStepOptions"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="交易密码">
            <el-input v-model="cardForm.password"></el-input>
            <span>如无需修改密码，为空即可</span>
          </el-form-item>
          <el-form-item label="有效期">
             <el-date-picker
            v-model="cardForm.start_time"
            type="date"
            value-format="timestamp"
            placeholder="开始日期">
          </el-date-picker>
          <span> 至 </span>
          <el-date-picker
            v-model="cardForm.end_time"
            type="date"
            value-format="timestamp"
            placeholder="结束日期">
          </el-date-picker>
          </el-form-item>
          <el-form-item label="会员生日">
            <el-date-picker
              v-model="cardForm.birthday"
              type="date"
              value-format="timestamp"
              placeholder="会员生日">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="性别">
            <el-radio-group v-model="cardForm.gender">
              <el-radio :label="'0'">男</el-radio>
              <el-radio :label="'1'">女</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="会员卡地址">
            <el-input type="textarea" :rows="2" v-model="cardForm.address"></el-input>
          </el-form-item>
          <el-form-item label="备注">
            <el-input type="textarea" :rows="4" v-model="cardForm.remark" class="halfwidth"></el-input>
          </el-form-item>
           <el-form-item>
            <el-button  @click="resetForm('cardFormRef')">重置</el-button>
            <el-button type="primary" @click="onSubmit('cardFormRef')">保存</el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </div>
</template>

<script>
export default {
  data () {
    var validatePhone = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('手机号不能为空'))
      } else {
        if (!(/^1[3456789]\d{9}$/.test(value))) {
          callback(new Error('请输入正确手机号'))
        } else {
          callback()
        }
      }
    }
    return {
      cardFormRules: {
        name: [
          { required: true, message: '请输入会员姓名', trigger: 'blur' }
        ],
        phone: [
          { required: true, validator: validatePhone, trigger: 'blur' }
        ],
        // eslint-disable-next-line camelcase
        card_number: [
          { required: true, message: '请输入会员卡号', trigger: 'blur' }
        ],
        // eslint-disable-next-line camelcase
        shop_id: [
          { required: true, message: '请选择所属门店', trigger: 'blur' }
        ],
        // eslint-disable-next-line camelcase
        member_type_id: [
          { required: true, message: '请选择会员卡类型', trigger: 'blur' }
        ]
        // eslint-disable-next-line camelcase
        // member_grade_id: [
        //   { required: true, message: '请选择会员卡等级', trigger: 'blur' }
        // ]
      },
      cardTypeOptions: [], // 会员卡类型
      cardStepOptions: [], // 会员卡等级
      shopOtions: [], // 所属门店
      cardForm: {},
      show: false, // 会员卡等级显隐
      mid: ''
    }
  },
  created () {
    this.mid = this.$route.params.id || sessionStorage.getItem('mid')
    this.getCardInfo()
    this.endTime()
    this.getNowTime()
  },
  methods: {
    async getCardInfo () {
      const { data: res } = await this.$http.get('mapi/memberMemberUpdate', { params: { id: this.mid } })
      console.log(res)
      if (res.code !== 200) return this.$message.error('获取卡信息失败！')
      this.cardStepOptions = res.arr.grade
      this.shopOtions = res.arr.shop
      this.cardTypeOptions = res.arr.type
      this.cardForm = res.list
      // eslint-disable-next-line eqeqeq
      if (this.cardForm.member_grade_id != 0) {
        this.show = true
      }
    },
    getNowTime () {
      // const date = new Date()
      // this.cardForm.start_time = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()
      // eslint-disable-next-line camelcase
      this.cardForm.start_time = new Date().getTime()
      this.cardForm.birthday = new Date().getTime()
      // this.cardForm.birthday = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()
    },
    endTime () {
      const date = new Date()
      // eslint-disable-next-line camelcase
      this.cardForm.end_time = new Date((date.getFullYear() + 100) + '-' + (date.getMonth() + 1) + '-' + date.getDate()).getTime()
    },
    memTypeChange (val) {
      this.cardTypeOptions.forEach(item => {
        // eslint-disable-next-line eqeqeq
        if (item.id == val && item.member_grade_state == 1) {
          this.show = true
          // eslint-disable-next-line camelcase
          this.cardForm.member_grade_id = ''
          return false
        } else {
          this.show = false
          // eslint-disable-next-line camelcase
          delete this.cardForm.member_grade_id
        }
      })
    },
    cardStepChange (val) {
      this.$forceUpdate() // 手动强制刷新渲染
      console.log(this.cardForm)
    },
    // 提交表单
    onSubmit (formName) {
      this.$refs[formName].validate(async valid => {
        if (valid) {
          console.log(this.cardForm)
          const { data: res } = await this.$http.post('mapi/memberMemberUpdate', this.cardForm)
          if (res.code !== 200) return this.$message.error('修改失败, 请重新修改！')
          this.$message.success('修改成功')
          this.$router.push('cardlist')
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
  },
  computed: {

  }
}
</script>

<style scoped lang="less">
.el-date-editor{width:140px;}
.el-form-item span{line-height: 30px; color:#ccc;}
</style>
