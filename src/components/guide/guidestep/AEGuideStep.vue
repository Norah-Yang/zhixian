<template>
    <div>
      <!-- 面包屑导航区域 -->
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>您当前所在位置</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>导购管理</el-breadcrumb-item>
        <el-breadcrumb-item>导购等级编辑</el-breadcrumb-item>
      </el-breadcrumb>
      <el-card>
        <el-form :model="guideStepForm" :rules="guideStepFormRules" ref="guideStepForm" label-width="100px" class="demo-ruleForm">
          <el-form-item label="等级名称" prop="name">
            <el-input v-model="guideStepForm.name"></el-input>
          </el-form-item>
          <el-form-item label="订单金额" prop="money">
            <el-input v-model="guideStepForm.money"  @input="e => guideStepForm.money = convertNum(e)">
              <template slot="append">元</template>
            </el-input>
            <p>（超过此金额，享受提成）</p>
          </el-form-item>
          <el-form-item label="提成方式" prop="extract_type">
            <el-select v-model="guideStepForm.extract_type" placeholder="选择提成方式">
              <el-option label="百分比" :value="1"></el-option>
              <el-option label="按金额" :value="2"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="提成数值" prop="extract_num">
            <el-input v-model="guideStepForm.extract_num" @input="e => guideStepForm.extract_num = convertNum(e)">
              <template slot="append" v-if="guideStepForm.extract_type == '1'">%</template>
              <template slot="append" v-if="guideStepForm.extract_type == '2'">元</template>
            </el-input>
          </el-form-item>
          <el-form-item label="备注" >
            <el-input type="textarea" :rows="4" v-model="guideStepForm.intro"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm('guideStepForm')" size="mini">确定</el-button>
            <el-button @click="resetForm('guideStepForm')" size="mini">重置</el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </div>
</template>

<script>
export default {
  data () {
    return {
      guideStepForm: {
        name: '',
        money: '',
        // eslint-disable-next-line camelcase
        extract_type: 1,
        // eslint-disable-next-line camelcase
        extract_num: '',
        intro: ''
      },
      guideStepFormRules: {
        name: [
          { required: true, message: '请输入等级名称', trigger: 'blur' }
        ],
        money: [
          { required: true, message: '请输入订单金额', trigger: 'blur' }
        ],
        // eslint-disable-next-line camelcase
        extract_type: [
          { required: true, message: '请选择提成方式', trigger: 'blur' }
        ],
        // eslint-disable-next-line camelcase
        extract_num: [
          { required: true, message: '请输入提成数值', trigger: 'blur' }
        ]
      },
      gid: '' // 编辑导购使用
    }
  },
  created () {
    this.gid = sessionStorage.getItem('gStepId')
    console.log(this.gid)

    if (this.gid) {
      this.getGuideStepInfo()
    }
  },
  methods: {
    async getGuideStepInfo () {
      const loading = this.$loading({
          lock: true,
          text: 'Loading',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.1)'
        });
      const { data: res } = await this.$http.get('mapi/guideUpdate', { params: { id: this.gid } })
      console.log(res)
      if (res.code !== 200) return this.$message.error('获取等级信息失败！')
      // this.$message.success('获取等级信息成功！')
      loading.close();
      this.guideStepForm = res.list
    },
    submitForm (formName) {
      this.$refs[formName].validate(async valid => {
        if (valid) {
          if (this.gid) {
            const { data: res } = await this.$http.post('mapi/guideUpdate', this.guideStepForm)
            console.log(res)
            if (res.code !== 200) return this.$message.error('修改失败！')
            this.$router.push('guidestep')
          } else {
            const { data: res } = await this.$http.post('mapi/guideAdd', this.guideStepForm)
            console.log(res)
            if (res.code !== 200) return this.$message.error('添加失败！')
            this.$router.push('guidestep')
          }
        } else {
          return false
        }
      })
    },
    resetForm (formName) {
      this.$refs[formName].resetFields()
    },
    convertNum (str) {
      var len1 = str.substr(0, 1)
      var len2 = str.substr(1, 1)
      // 如果第一位是0，第二位不是点，就用数字把点替换掉
      // eslint-disable-next-line eqeqeq
      if (str.length > 1 && len1 == 0 && len2 != '.') {
        str = str.substr(1, 1)
      }
      // 第一位不能是.
      // eslint-disable-next-line eqeqeq
      if (len1 == '.') {
        str = ''
      }
      // eslint-disable-next-line eqeqeq
      if (len1 == '-') {
        str = ''
      }
      // 限制只能输入一个小数点
      // eslint-disable-next-line eqeqeq
      if (str.indexOf('.') != -1) {
        var str_ = str.substr(str.indexOf('.') + 1)
        // eslint-disable-next-line eqeqeq
        if (str_.indexOf('.') != -1) {
          str = str.substr(0, str.indexOf('.') + str_.indexOf('.') + 1)
        }
      }
      // 正则替换
      // eslint-disable-next-line no-useless-escape
      // str = str.replace(/\-/g, '!')
      // eslint-disable-next-line no-useless-escape
      str = str.replace(/[^\d^\.]+/g, '') // 保留数字和小数点
      str = str.replace(/\.\d\d\d$/, '') // 小数点后只能输两位
      return str
    }
  },
  destroyed () {
    sessionStorage.removeItem('gStepId')
  }
}
</script>

<style scoped lang="less">

</style>
