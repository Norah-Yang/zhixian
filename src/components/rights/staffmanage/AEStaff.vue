<template>
    <div>
       <!-- 面包屑导航区域 -->
      <!-- <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>您当前所在位置</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>权限管理</el-breadcrumb-item>
        <el-breadcrumb-item v-if="staffId !== ''">编辑员工信息</el-breadcrumb-item>
        <el-breadcrumb-item v-else>添加员工</el-breadcrumb-item>
      </el-breadcrumb> -->
      <!-- 卡片视图区域 -->
      <el-card>
         <el-divider>员工详细信息</el-divider>
         <el-form :inline="true" :model="staffForm" :rules="staffFormRules" ref="staffForm" label-width="120px" class="demo-ruleForm">
           <el-row>
            <el-col :span="12">
              <el-form-item label="用户名" prop="name">
                <el-input v-model="staffForm.name" placeholder="请输入用户名"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="姓名" prop="nickname">
                <el-input v-model="staffForm.nickname" placeholder="请输入员工姓名"></el-input>
              </el-form-item>
            </el-col>
           </el-row>
           <el-row>
            <el-col :span="12">
              <el-form-item label="手机号" prop="phone">
                <el-input v-model="staffForm.phone" placeholder="请输入员工手机号"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="邮箱" prop="email">
                <el-input v-model="staffForm.email" placeholder="请输入员工邮箱"></el-input>
              </el-form-item>
            </el-col>
           </el-row>
           <el-row>
            <el-col :span="12">
              <el-form-item label="密码" prop="password">
                <el-input type="password" minlength="6" v-model="staffForm.password" placeholder="请输入密码"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="确认密码" prop="repassword">
                <el-input type="password" minlength="6" v-model="staffForm.repassword" placeholder="请输入确认密码" ></el-input>
              </el-form-item>
            </el-col>
           </el-row>
           <el-row>
            <el-col :span="24">
              <el-form-item label="角色（岗位）" prop="role_id">
                <el-select v-model="staffForm.role_id" placeholder="请选择角色">
                  <el-option
                    v-for="item in roleOptions"
                    :key="item.id"
                    :label="item.title"
                    :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
           </el-row>
           <el-row>
            <el-col :span="24">
              <el-form-item label="是否收银员" prop="cashier">
                <el-switch v-model="staffForm.cashier" :active-value="1" :inactive-value="0"></el-switch>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="是否客服" prop="customer_service">
                <el-switch v-model="staffForm.customer_service" :active-value="1" :inactive-value="0"></el-switch>
              </el-form-item>
            </el-col>
           </el-row>
           <el-row>
              <el-col :span="24">
                <el-form-item label="管理站点" prop="shop_id">
                    <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">店铺全选</el-checkbox>
                    <!-- <div style="margin: 15px 0;"></div> -->
                    <el-checkbox-group v-model="checkedshopId" @change="handleCheckedShopChange">
                      <el-checkbox v-for="item in shopArr" :label="item.id" :key="item.id">{{item.title}}</el-checkbox>
                    </el-checkbox-group>
                    <div style="margin: 15px 0;"></div>
                    <el-checkbox :indeterminate="isIndeterminateone" v-model="checkedAll"  @change="handleCheckedAllChange">自提快递点全选</el-checkbox>
                    <el-checkbox-group v-model="checkedPick"  @change="handleCheckedPickChange">
                      <el-checkbox v-for="item in pickArr" :label="item.id" :key="item.id">{{item.name}}</el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
              </el-col>
           </el-row>
           <el-row>
              <el-col :span="24">
                <el-form-item label="管理仓库">
                    <el-checkbox :indeterminate="isIndeterminatestore" v-model="storeCheckAll" @change="storeCheckAllChange">全选</el-checkbox>
                    <!-- <div style="margin: 15px 0;"></div> -->
                    <el-checkbox-group v-model="checkedStore" @change="storeCheckedChange">
                      <el-checkbox v-for="item in storeArr" :label="item.id" :key="item.id">{{item.name}}</el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
              </el-col>
           </el-row>
           <el-row>
             <el-col :span="24">
                <el-form-item class="btn">
                  <el-button  @click="resetForm('staffForm')">重置</el-button>
                  <el-button type="primary" @click="onSubmit('staffForm')" v-no-click>确定</el-button>
                </el-form-item>
             </el-col>
           </el-row>
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
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.staffForm.password) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      staffId: '',
      staffForm: {
        name: '',
        nickname: '',
        // eslint-disable-next-line camelcase
        role_id: '',
        phone: '',
        email: '',
        password: '',
        repassword: '',
        cashier: 1,
        // eslint-disable-next-line camelcase
        customer_service: 1,
        // eslint-disable-next-line camelcase
        shop_id: '',
        // eslint-disable-next-line camelcase
        express_pick: '',
        storage: ''
      },
      staffFormRules: {
        name: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        nickname: [
          { required: true, message: '请输入员工姓名', trigger: 'blur' }
        ],
        phone: [
          { required: true, validator: validatePhone, trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入员工邮箱', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '密码不能为空', trigger: 'blur' },
          { min: 6, max: 30, message: '长度在 6 到 30 个字符' }
        ],
        repassword: [
          { required: true, validator: validatePass, trigger: 'blur' }
        ],
        // eslint-disable-next-line camelcase
        role_id: [
          { required: true, message: '请选择角色', trigger: 'blur' }
        ],
        cashier: [
          { required: true, message: '是否收银员', trigger: 'blur' }
        ],
        // eslint-disable-next-line camelcase
        customer_service: [
          { required: true, message: '是否客服', trigger: 'blur' }
        ],
        // eslint-disable-next-line camelcase
        shop_id: [
          { required: true, message: '请选择员工管理的店点', trigger: 'blur' }
        ]
      },
      roleOptions: [],
      // 店铺
      shopArr: [],
      isIndeterminate: false,
      checkAll: false,
      checkedshopId: [],
      // 自提快递点
      pickArr: [],
      checkedPick: [],
      isIndeterminateone: false,
      checkedAll: false,
      // 仓库
      isIndeterminatestore: false,
      storeCheckAll: false,
      storeArr: [],
      checkedStore: []
    }
  },
  created () {
    this.staffId = sessionStorage.getItem('staffId') || this.$route.params.staffId
    if (this.staffId) {
      this.getStaffInfo()
    } else {
      this.getInfo()
    }
  },
  methods: {
    async getInfo () {
      const { data: res } = await this.$http.get('mapi/addEmployee')
      console.log(res)
      if (res.code !== 200) return this.$message.error('获取信息失败！')
      this.roleOptions = res.role
      this.shopArr = res.shop
      this.pickArr = res.express_pick
      this.storeArr = res.storage
    },
    async getStaffInfo () {
      const { data: res } = await this.$http.get('mapi/updateEmployee', { params: { id: this.staffId } })
      console.log(res)
      if (res.code !== 200) return this.$message.error('获取信息失败！')
      const staffInfo = res.list
      this.roleOptions = res.role
      this.pickArr = res.express_pick
      this.shopArr = res.shop
      this.storeArr = res.storage
      if (staffInfo.express_pick !== '') {
      // eslint-disable-next-line camelcase
        staffInfo.express_pick = staffInfo.express_pick.split(',')
        const copypick = staffInfo.express_pick.map(item => {
          return parseInt(item)
        })
        this.checkedPick = copypick
        if (this.checkedPick.length === this.pickArr.length) {
          this.checkedAll = true
        } else if (this.checkedPick.length > 0) {
          this.isIndeterminateone = true
        }
      }
      if (staffInfo.shop_id !== '') {
        // eslint-disable-next-line camelcase
        staffInfo.shop_id = staffInfo.shop_id.split(',')
        const copyshop = staffInfo.shop_id.map(item => {
          return parseInt(item)
        })
        this.checkedshopId = copyshop
        if (this.checkedshopId.length === this.shopArr.length) {
          this.checkAll = true
        } else if (this.checkedshopId.length > 0) {
          this.isIndeterminate = true
        }
      }
      if (staffInfo.storage !== '') {
        // eslint-disable-next-line camelcase
        staffInfo.storage = staffInfo.storage.split(',')
        const copystore = staffInfo.storage.map(item => {
          return parseInt(item)
        })
        this.checkedStore = copystore
        console.log(this.checkedStore)

        if (this.checkedStore.length === this.storeArr.length) {
          this.storeCheckAll = true
        } else if (this.checkedStore.length > 0) {
          this.isIndeterminatestore = true
        }
      }
      staffInfo.repassword = staffInfo.password
      this.staffForm = staffInfo
      // this.staffForm.repassword = this.staffForm.password
    },
    // 店铺全选
    handleCheckAllChange (val) {
      // eslint-disable-next-line camelcase
      this.staffForm.shop_id = ''
      this.checkedshopId = []
      if (this.checkAll) {
        this.shopArr.forEach(item => {
          this.checkedshopId.push(item.id)
        })
        // eslint-disable-next-line camelcase
        this.staffForm.shop_id = this.checkedshopId.join(',')
      } else {
        this.checkedshopId = []
      }
      this.isIndeterminate = false
    },
    // 店铺单选
    handleCheckedShopChange (value) {
      const checkedCount = value.length
      // eslint-disable-next-line camelcase
      this.staffForm.shop_id = value.join(',')
      this.checkAll = checkedCount === this.shopArr.length
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.shopArr.length
    },
    // 自提快递点全选
    handleCheckedAllChange (val) {
      // eslint-disable-next-line camelcase
      // this.staffForm.express_pick = ''
      this.checkedPick = []
      console.log('清空自提点', this.staffForm.express_pick)
      if (this.checkedAll) {
        this.pickArr.forEach(item => {
          this.checkedPick.push(item.id)
        })
        // eslint-disable-next-line camelcase
        this.staffForm.express_pick = this.checkedPick.join(',')
        console.log('this.checkedPick:', this.checkedPick)
        console.log(this.staffForm.express_pick)
      } else {
        this.checkedPick = []
      }

      this.isIndeterminateone = false
    },
    // 自提快递点单选
    handleCheckedPickChange (value) {
      const checkedCount = value.length
      // eslint-disable-next-line camelcase
      this.staffForm.express_pick = value.join(',')
      this.checkedAll = checkedCount === this.pickArr.length
      this.isIndeterminateone = checkedCount > 0 && checkedCount < this.pickArr.length
    },
    // 管理仓库全选
    storeCheckAllChange (val) {
      this.staffForm.storage = ''
      this.checkedStore = []
      if (this.storeCheckAll) {
        this.storeArr.forEach(item => {
          this.checkedStore.push(item.id)
        })
      } else {
        this.checkedStore = []
      }
      this.staffForm.storage = this.checkedStore.join(',')
      this.isIndeterminatestore = false
    },
    // 管理仓库单选
    storeCheckedChange (value) {
      // eslint-disable-next-line camelcase
      this.staffForm.storage = value.join(',')
      const checkedCount = value.length
      this.storeCheckAll = checkedCount === this.storeArr.length
      this.isIndeterminatestore = checkedCount > 0 && checkedCount < this.storeArr.length
    },
    // 重置
    resetForm (formName) {
      this.$refs[formName].resetFields()
    },
    // 确定提交
    onSubmit (formName) {
      this.$refs[formName].validate(async valid => {
        if (valid) {
          // eslint-disable-next-line camelcase
          this.staffForm.rule_id = this.ruleId
          console.log(this.staffForm)
          if (this.staffForm.shop_id instanceof Array) {
            // eslint-disable-next-line camelcase
            this.staffForm.shop_id = this.staffForm.shop_id.join(',')
          }
          if (this.staffForm.express_pick instanceof Array) {
            // eslint-disable-next-line camelcase
            this.staffForm.express_pick = this.staffForm.express_pick.join(',')
          }
          if (this.staffForm.storage instanceof Array) {
            // eslint-disable-next-line camelcase
            this.staffForm.storage = this.staffForm.storage.join(',')
          }

          if (this.staffId) {
            const { data: res } = await this.$http.post('mapi/updateEmployee', this.staffForm)
            if (res.code !== 200) return this.$message.error('修改失败, 请重新修改！')
            this.$message.success('修改成功')
            this.$router.push('rights')
          } else {
            console.log(this.staffForm)

            const { data: res } = await this.$http.post('mapi/addEmployee', this.staffForm)
            console.log(res)
            if (res.code !== 200) return this.$message.error('添加员工失败！')
            this.$message.success('添加成功！')
            this.$router.push('rights')
          }
        } else {
          this.$message.warning('请检查是否填写完善！！')
          return false
        }
      })
    }
  },
  destroyed () {
    sessionStorage.removeItem('staffId')
  }
}
</script>

<style scoped lang="less">
.el-divider--horizontal{margin:24px 0 50px;}
.el-divider__text{font-size:20px;}
.el-select{width:202px;}
.btn{padding-left:120px;}
</style>
