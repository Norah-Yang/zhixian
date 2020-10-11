<template>
    <div>
      <!-- 面包屑导航区域 -->
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>您当前所在位置</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>导购管理</el-breadcrumb-item>
        <el-breadcrumb-item>导购员编辑</el-breadcrumb-item>
      </el-breadcrumb>
      <el-card>
        <div class="title mb20">导购员详细信息</div>
         <el-form :model="guideForm" :rules="guideFormRules" ref="guideForm" label-width="100px" class="demo-ruleForm">
          <el-form-item label="导购编号" prop="number">
            <el-input v-model="guideForm.number" clearable></el-input>
          </el-form-item>
          <el-form-item label="姓名" prop="name">
            <el-input v-model="guideForm.name" clearable></el-input>
          </el-form-item>
          <el-form-item label="手机号码" prop="phone">
            <el-input v-model="guideForm.phone" clearable maxlength="11"></el-input>
          </el-form-item>
          <el-form-item label="关联站点" prop="shop_id">
            <el-select v-model="guideForm.shop_id" placeholder="选择门店" clearable>
              <el-option v-for="item in shopOptions" :label="item.title" :value="item.id" :key="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="导购等级" prop="guide_grade_id">
            <el-select v-model="guideForm.guide_grade_id" placeholder="选择等级" clearable>
              <el-option v-for="item in stepOptions" :label="item.name" :value="item.id" :key="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="关联员工" prop="staff_id">
            <el-select v-model="guideForm.staff_id" placeholder="选择员工" clearable>
              <el-option v-for="item in staffOptions" :label="item.name" :value="item.id" :key="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="启用状态">
            <el-switch :active-value="1" :inactive-value="0" v-model="guideForm.status"></el-switch>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm('guideForm')" size="mini">确定</el-button>
            <el-button @click="resetForm('guideForm')" size="mini">重置</el-button>
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
      shopOptions: [], // 门店
      stepOptions: [], // 等级
      staffOptions: [], // 员工
      guideForm: {
        number: '',
        name: '',
        phone: '',
        // eslint-disable-next-line camelcase
        shop_id: '',
        // eslint-disable-next-line camelcase
        guide_grade_id: '',
        // eslint-disable-next-line camelcase
        staff_id: '',
        status: 1
      },
      guideFormRules: {
        number: [
          { required: true, message: '请输入导购编号', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '请输入导购姓名', trigger: 'blur' }
        ],
        phone: [
          { required: true, validator: validatePhone, trigger: 'blur' }
        ],
        // eslint-disable-next-line camelcase
        shop_id: [
          { required: true, message: '请选择关联站点', trigger: 'blur' }
        ],
        // eslint-disable-next-line camelcase
        guide_grade_id: [
          { required: true, message: '请选择导购等级', trigger: 'blur' }
        ],
        // eslint-disable-next-line camelcase
        staff_id: [
          { required: true, message: '请选择关联员工', trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    this.gid = sessionStorage.getItem('guideId')
    this.getInfo()
  },
  methods: {
    async getInfo () {
      if (this.gid) {
        const { data: res } = await this.$http.get('mapi/guideNameUpdate', { params: { id: this.gid } })
        console.log(res)
        if (res.code !== 200) return this.$message.error('获取导购员信息失败！')
        this.guideForm = res.list
        this.shopOptions = res.arr.shop
        this.stepOptions = res.arr.grade
        this.staffOptions = res.arr.cashier
        // this.shopOptions = res.data.shop
        // this.stepOptions = res.data.grade
        // this.staffOptions = res.data.cashier
      } else {
        const { data: res } = await this.$http.get('mapi/guideNameAdd')
        console.log(res)
        this.shopOptions = res.data.shop
        this.stepOptions = res.data.grade
        this.staffOptions = res.data.cashier
      }
    },
    submitForm (formName) {
      this.$refs[formName].validate(async valid => {
        if (valid) {
          if (this.gid) {
            const { data: res } = await this.$http.post('mapi/guideNameUpdate', this.guideForm)
            console.log(res)
            if (res.code !== 200) return this.$message.error('修改失败！')
            this.$router.push('guides')
          } else {
            const { data: res } = await this.$http.post('mapi/guideNameAdd', this.guideForm)
            console.log(res)
            if (res.code !== 200) return this.$message.error('添加失败！')
            this.$router.push('guides')
          }
        } else {
          return false
        }
      })
    },
    resetForm (formName) {
      this.$refs[formName].resetFields()
    }
  },
  destroyed () {
    sessionStorage.removeItem('guideId')
  }
}
</script>

<style scoped lang="less">
.el-input{width:50%;}
</style>
