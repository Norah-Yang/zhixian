<template>
    <div>
      <!-- 面包屑导航区域 -->
      <!-- <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>您当前所在位置</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>权限管理</el-breadcrumb-item>
        <el-breadcrumb-item>角色编辑</el-breadcrumb-item>
      </el-breadcrumb> -->
      <!-- 卡片视图区域 -->
      <el-card>
          <el-row>修改角色信息</el-row>
          <el-form ref="rolesForm" :rules="rolesFormRules" :model="rolesForm" label-width="120px">
            <el-form-item label="角色名称">
              <el-col :span="12"><el-input v-model="rolesForm.title"></el-input></el-col>
            </el-form-item>
            <el-form-item label="角色标识">
              <el-col :span="12"><el-input type="textarea"  :rows="3" v-model="rolesForm.tag"></el-input></el-col>
            </el-form-item>
            <el-form-item label="是否启用">
              <!-- 0启用 1未启用 -->
              <el-switch v-model="rolesForm.del" :inactive-value="1" :active-value="0"></el-switch>
            </el-form-item>
            <el-form-item label="是否采购">
              <el-switch v-model="rolesForm.procurement" :inactive-value="1" :active-value="0"></el-switch>
            </el-form-item>
            <el-form-item label="单品折让比率"  prop="discount_rate_for_single_item" >
              <el-col :span="20">
                <el-input v-model="rolesForm.discount_rate_for_single_item" @input="e => rolesForm.discount_rate_for_single_item = convertNum(e)"></el-input>
                <div class="i-span">为零不限制，单品最高折让比率为0-100，如：设置为80，商员原价100元，商品打折只能打8折=80元或者商品改价最低改为80元</div>
              </el-col>
              <el-col :span="2">%</el-col>
            </el-form-item>
            <el-form-item label="最高抹零金额" prop="max_erasure_money" >
              <el-col :span="20">
                <el-input v-model="rolesForm.max_erasure_money" @input="e => rolesForm.max_erasure_money = convertNum(e)"></el-input>
                <div class="i-span">为零时不允许抹零，超过最高抹零金额的，按最高抹零金额算</div>
              </el-col>
              <el-col :span="2">元</el-col>
            </el-form-item>
            <el-form-item label="整单折让比率" prop="whole_order_discount" >
              <el-col :span="20">
                <el-input v-model="rolesForm.whole_order_discount"  @input="e => rolesForm.whole_order_discount = convertNum(e)"></el-input>
                <div class="i-span">为零不限制，整单最高折让比率为0-100，如：设置为80，订单原价100元，订单打折只能打8折=80元</div>
              </el-col>
              <el-col :span="2">%</el-col>
            </el-form-item>
            <el-form-item label="选择权限" required >
               <el-tree :data="rightsList" ref="treeRef" :props="treeProps" show-checkbox node-key="id" default-expand-all :default-checked-keys="defKeys" @check-change="getChecked"></el-tree>
            </el-form-item>
            <el-form-item>
            <el-button  @click="resetForm('rolesForm')">重置</el-button>
            <el-button type="primary" @click="onSubmit('rolesForm')" v-no-click>保存</el-button>
          </el-form-item>
          </el-form>

      </el-card>
    </div>
</template>

<script>
export default {
  data () {
    return {
      rolesForm: {
        title: '',
        tag: '',
        del: 0,
        procurement: 0,
        // eslint-disable-next-line camelcase
        rule_id: '',
        // eslint-disable-next-line camelcase
        discount_rate_for_single_item: '',
        // eslint-disable-next-line camelcase
        max_erasure_money: '',
        // eslint-disable-next-line camelcase
        whole_order_discount: ''
      },
      rolesFormRules: {
        // eslint-disable-next-line camelcase
        discount_rate_for_single_item: [{ required: true, message: '请输入单品折让比率', trigger: 'blur' }],
        // eslint-disable-next-line camelcase
        max_erasure_money: [{ required: true, message: '请输入最高抹零金额', trigger: 'blur' }],
        // eslint-disable-next-line camelcase
        whole_order_discount: [{ required: true, message: '请输入整单折让比率', trigger: 'blur' }]
      },
      // 默认选中的节点id值数组
      defKeys: [],
      // 权限列表
      rightsList: [],
      // 树形控件的属性绑定对象
      treeProps: {
        // eslint-disable-next-line quote-props
        'label': 'title',
        // eslint-disable-next-line quote-props
        'children': 'children'
      },
      roleId: '', // 角色id
      ruleId: ''// 选择的权限
    }
  },
  created () {
    this.roleId = this.$route.params.roleId || sessionStorage.getItem('roleId')
    this.getRights()
  },
  methods: {
    async getRights () {
       const loading = this.$loading({
          lock: true,
          text: 'Loading',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.1)'
        });
      if (this.roleId) {
        const { data: res } = await this.$http.get('mapi/updateRole', { params: { id: this.roleId } })
        // console.log('权限', res)
        if (res.status !== 1) return this.$message.error('获取角色信息失败！')
        this.rolesForm = res.data
        // this.$message.success('获取角色信息成功！')
        loading.close();
        this.rightsList = res.auth.children
        this.getLeafKeys(res.my_auth, this.defKeys)
        // console.log(this.defKeys);
      } else {
        const { data: res } = await this.$http.get('mapi/addRole')
        // console.log('新增用户添加权限', res)
        if (res.status !== 1) return this.$message.error('获取权限信息失败！')
        // this.$message.success('获取权限信息成功！')
        loading.close();
        this.rightsList = res.auth.children
      }
    },
    // 通过递归的形式获取当前角色id下所有三级权限的id,并保存到defKeys数组中
    getLeafKeys (node, arr) {
      // 如果当前节点node中不包含children属性，则是三级权限
      // if (!node.children) {
      //   return arr.push(node.id)
      // }
      // node.children.forEach(item => {
      //   this.getLeafKeys(item, arr)
      // })
      if(!node) return
      node.forEach(item => {
        arr.push(item.id)
      })
    },
    getChecked () {
      // console.log(this.$refs.treeRef.getCheckedKeys().concat(this.$refs.treeRef.getHalfCheckedKeys()))
      const selectedArr = [...this.$refs.treeRef.getCheckedKeys()]
      console.log(selectedArr)
      if (selectedArr.length > 0) {
        const ruleString = selectedArr.join(',')
        this.ruleId = ruleString
        // console.log(this.ruleId)
      }
    },
    resetForm (formName) {
      this.$refs[formName].resetFields()
    },
    onSubmit (formName) {
      this.$refs[formName].validate(async valid => {
        if (valid) {
          // eslint-disable-next-line camelcase
          this.rolesForm.rule_id = this.ruleId
          console.log(this.rolesForm)
          if (this.roleId) {
            const { data: res } = await this.$http.post('mapi/updateRole', this.rolesForm)
            if (res.code !== 200) return this.$message.error('修改失败, 请重新修改！')
            this.$message.success('修改成功')
            this.$router.push('roles')
          } else {
            console.log(this.rolesForm)
            const { data: res } = await this.$http.post('mapi/addRole', this.rolesForm)
            console.log(res)
            if (res.code !== 200) return this.$message.error('添加角色失败！')
            this.$message.success('添加成功！')
            this.$router.push('roles')
          }
        } else {
          this.$message.warning('请检查是否填写完善！！')
          return false
        }
      })
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
    sessionStorage.removeItem('roleId')
    this.defKeys = []
  }
}
</script>

<style scoped lang="less">
.i-span{line-height: 20px;font-size: 14px;color: #999;display: block;}
</style>
