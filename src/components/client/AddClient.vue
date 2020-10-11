<template>
    <div>
      <!-- 面包屑导航区域 -->
      <!-- <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>您当前所在位置</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>客户管理</el-breadcrumb-item>
        <el-breadcrumb-item>添加客户</el-breadcrumb-item>
      </el-breadcrumb> -->
      <!-- 卡片视图区域 -->
      <el-card>
        <el-form :model="clientForm" :rules="clientFormRules" ref="clientFormRef" label-width="130px">
          <div class="title">-------基本信息-------</div>
          <el-form-item label="客户名称" prop="name">
            <el-input v-model="clientForm.name"></el-input>
          </el-form-item>
          <el-form-item label="客户类型" prop="type">
            <el-checkbox-group v-model="clientForm.type">
              <el-checkbox :label="1" size="medium">供应商</el-checkbox>
              <el-checkbox :label="2" size="medium">分销商</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item label="客户地区">
            <el-cascader
              ref="cascaderRef"
              v-model="areaDetail"
              placeholder="请选择地区"
              @change="areaChange"
              :props="{ expandTrigger: 'hover' }"
              :options="areaData"
              ></el-cascader>
          </el-form-item>
          <el-form-item label="详细地址">
            <el-input v-model="clientForm.address" placeholder="请输入地址"></el-input>
          </el-form-item>
          <el-form-item label="客户描述">
            <el-input type="textarea" :rows="3" v-model="clientForm.intro" placeholder="对您的客户进行一些说明描述"></el-input>
          </el-form-item>
          <el-form-item label="联系人">
            <el-input v-model="clientForm.relation_name" placeholder="请输入联系人"></el-input>
          </el-form-item>
          <el-form-item label="联系电话" prop="relation_phone">
            <el-input v-model="clientForm.relation_phone" placeholder="请输入联系电话（座机）"></el-input>
          </el-form-item>
          <el-form-item label="传真电话" prop="fax_phone">
            <el-input v-model="clientForm.fax_phone" placeholder="请输入传真电话"></el-input>
          </el-form-item>
          <el-form-item label="手机号码" prop="phone">
            <el-input v-model="clientForm.phone" maxlength="11" placeholder="请输入手机号码"></el-input>
          </el-form-item>
          <el-form-item class="btn">
            <el-button  @click="resetForm('clientFormRef')" size="mini">重置</el-button>
            <el-button type="primary" @click="onSubmit('clientFormRef')" v-no-click size="mini">确定</el-button>
          </el-form-item>
        </el-form>

      </el-card>
    </div>
</template>

<script>
import AreaJson from '../../static/area.json'
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
      areaData: [],
      areaDetail: [],
      clientForm: {
        name: '',
        type: [],
        province: '',
        city: '',
        district: '',
        address: '',
        intro: '',
        // eslint-disable-next-line camelcase
        relation_name: '',
        // eslint-disable-next-line camelcase
        relation_phone: '',
        // eslint-disable-next-line camelcase
        fax_phone: '',
        phone: ''
      },
      clientFormRules: {
        name: [
          { required: true, message: '请输入客户名称', trigger: 'blur' }
        ],
        type: [
          { required: true, message: '请选择客户类型', trigger: 'blur' }
        ],
        phone: [
          { required: true, validator: validatePhone, trigger: 'blur' }
        ],
        // eslint-disable-next-line camelcase
        relation_phone: [
          {
            // eslint-disable-next-line no-useless-escape
            pattern: /^(0[0-9]{2,3}\-)([2-9][0-9]{6,7})+(\-[0-9]{1,4})?$/,
            message: '请输入正确的座机号！',
            trigger: 'blur',
            required: false
          }
        ],
        // eslint-disable-next-line camelcase
        fax_phone: [
          {
            // eslint-disable-next-line no-useless-escape
            pattern: /^(0[0-9]{2,3}\-)([2-9][0-9]{6,7})+(\-[0-9]{1,4})?$/,
            message: '请输入正确的传真号！',
            trigger: 'blur',
            required: false
          }
        ]
      },
      clientId: ''

    }
  },
  created () {
    this.areaData = AreaJson
    for (var i = 0; i < this.areaData.length; i++) {
      // eslint-disable-next-line eqeqeq
      if (this.areaData[i].children.length == 0) {
        delete this.areaData[i].children // 解决因为省级区域没有下级市的BUG
      }
    }
    this.clientId = sessionStorage.getItem('clientId') || this.$route.params.id
    if (this.clientId) {
      this.getClientInfo()
    }
  },
  methods: {
    areaChange () {
      const pathvalue = this.$refs.cascaderRef.getCheckedNodes()[0].pathLabels
      this.clientForm.province = pathvalue[0]
      this.clientForm.city = pathvalue[1]
      this.clientForm.district = pathvalue[2]
      console.log(this.clientForm.province, this.clientForm.city, this.clientForm.district)
      this.clientForm.address = this.clientForm.province + this.clientForm.city + this.clientForm.district
    },
    async getClientInfo () {
       const loading = this.$loading({
          lock: true,
          text: 'Loading',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.1)'
        });
      const { data: res } = await this.$http.get('mapi/clientClientUpdate', { params: { id: this.clientId } })
      console.log(res)
      if (res.code !== 200) return this.$message.error('获取客户信息失败！')
      // this.$message.success('获取客户信息成功！')
      loading.close();
      if (res.list.type !== '') {
        res.list.type = res.list.type.split(',')
        res.list.type = res.list.type.map(item => parseInt(item))
      }
      if (res.list.province && res.list.city && res.list.district) {
        this.areaDetail[0] = res.list.province
        this.areaDetail[1] = res.list.city
        this.areaDetail[2] = res.list.district
      }
      console.log(res.list)
      console.log(this.areaDetail)
      const areaD = this.areaData
      const arr = []
      areaD.forEach(item => {
        if (item.label === res.list.province) {
          arr.push(item.value)
          item.children.forEach(val => {
            if (val.label === res.list.city) {
              arr.push(val.value)
              val.children.forEach(end => {
                if (end.label === res.list.district) {
                  arr.push(end.value)
                }
              })
            }
          })
        }
      })
      console.log(arr)
      this.areaDetail = arr
      this.clientForm = res.list
    },
    // 重置
    resetForm (formName) {
      this.$refs[formName].resetFields()
    },
    // 确定提交
    onSubmit (formName) {
      this.$refs[formName].validate(async valid => {
        if (valid) {
          console.log(this.clientForm.type)

          if (this.clientForm.type instanceof Array) {
            this.clientForm.type = this.clientForm.type.join(',')
          }
          console.log(this.clientForm.type)
          if (this.clientId) {
            const { data: res } = await this.$http.post('mapi/clientClientUpdate', this.clientForm)
            if (res.code !== 200) return this.$message.error('修改失败, 请重新修改！')
            this.$message.success('修改成功')
            this.$router.push('client')
          } else {
            console.log(this.clientForm)

            const { data: res } = await this.$http.post('mapi/clientClientAdd', this.clientForm)
            console.log(res)
            if (res.code !== 200) return this.$message.error('添加员工失败！')
            this.$message.success('添加成功！')
            this.$router.push('client')
          }
        } else {
          this.$message.warning('请检查是否填写完善！！')
          return false
        }
      })
    }
  },
  destroyed () {
    sessionStorage.removeItem('clientId')
  }
}
</script>

<style scoped lang="less">
.el-form{
  .title{
    color:teal;
    font-size: 20px;
    text-align: center;
    margin-bottom:40px;
  }
  .el-cascader{
    width:50%;
  }
}
</style>
