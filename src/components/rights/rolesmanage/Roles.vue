<template>
    <div>
        <!-- 面包屑导航区域 -->
      <!-- <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>您当前所在位置</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>权限管理</el-breadcrumb-item>
        <el-breadcrumb-item>角色管理</el-breadcrumb-item>
      </el-breadcrumb> -->
      <!-- 卡片视图区域 -->
      <el-card>
         <el-row>
           <el-col :span="24">
             <el-button type="primary" size="mini" @click="addRoles">+新增</el-button>
             <el-button type="primary" size="mini" @click="addMechant" v-if="merchantId == 10 && msuper == 1">+新增商户</el-button>
           </el-col>
         </el-row>
         <!-- 角色列表区域 -->
         <el-table :data="tableData" height="680" border style="width: 100%">
           <el-table-column prop="title" label="角色名" ></el-table-column>
          <el-table-column prop="tag" label="角色标识" ></el-table-column>
          <el-table-column  label="是否启用">
            <template slot-scope="scope">
              <!-- 0启用，1未启用 -->
              <el-switch v-model="scope.row.del" :inactive-value="1" :active-value="0" @change="statusChange(scope.row)"></el-switch>
            </template>
          </el-table-column>
          <el-table-column prop="add_time" label="添加时间" sortable></el-table-column>
          <el-table-column label="操作" width="120">
            <template slot-scope="scope">
               <el-button type="primary" size="mini" @click="editBtn(scope.row.id)">编辑</el-button>
            </template>
          </el-table-column>
         </el-table>
         <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="queryInfo.pagenum"
          :page-sizes="[10, 20, 50, 100,]"
          :page-size="queryInfo.pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
        </el-pagination>
      </el-card>
      <el-dialog title="添加商户" :visible.sync="dialogmerchantVisible">
        <el-form :model="merchantForm" :rules="merchantFormRules"  ref="merchantForm">
          <el-form-item label="商户名" :label-width="formLabelWidth">
            <el-input v-model="merchantForm.name" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="AppId" :label-width="formLabelWidth">
            <el-input v-model="merchantForm.AppID" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="AppSecret" :label-width="formLabelWidth">
            <el-input v-model="merchantForm.AppSecret" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="云币抵扣率" :label-width="formLabelWidth">
            <el-input v-model="merchantForm.coin_rate" autocomplete="off" placeholder="输入0~50"></el-input>
          </el-form-item>
          <el-form-item label="商户手机号" :label-width="formLabelWidth">
            <el-input v-model="merchantForm.phone" autocomplete="off"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogmerchantVisible = false">取 消</el-button>
          <el-button type="primary" @click="onSubmit('merchantForm')">确 定</el-button>
        </div>
      </el-dialog>
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
      // 角色列表
      tableData: [],
      // 请求列表所带参数
      queryInfo: {
        pagenum: 1,
        pagesize: 10
      },
      // 角色列表总条数
      total: 0,
      merchantId:'',
      msuper: '',
      dialogmerchantVisible:false,
      merchantForm: {
        name: '',
        AppID: '',
        AppSecret: '',
        coin_rate: '',
        phone: ''
      },
       formLabelWidth: '120px',
       merchantFormRules: {
        name: [
          { required: true, message: '请输入商户名', trigger: 'blur' }
        ],
        AppID: [
          { required: true, message: '请输入AppId', trigger: 'blur' }
        ],
        AppSecret: [
          { required: true, message: '请输入AppSecret', trigger: 'blur' }
        ],
        coin_rate: [
          { required: true, message: '请输入云币折扣率', trigger: 'blur' }
        ],
        phone: [
          { required: true, validator: validatePhone, trigger: 'blur' }
        ],
       }
    }
  },
  created () {
    this.getRolesList()
    
  },
  methods: {
    async getRolesList () {
      const loading = this.$loading({
          lock: true,
          text: 'Loading',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.1)'
        });
      const { data: res } = await this.$http.get('/mapi/role', this.queryInfo)
      // console.log(res)
      // console.log('vuex角色信息：',this.$store.state.userInfo);
      if (res.code !== 200) return this.$message.error('查询角色列表失败！')
      // this.$message.success('查询角色列表成功！')
      loading.close();
      this.tableData = res.role
      this.total = res.total
      this.merchantId = res.merchant_id
      this.msuper = res.super
    },
    handleSizeChange (val) {
      this.queryInfo.pagesize = val
      this.getRolesList()
    },
    addRoles () {
      this.$router.push('/rolesedit')
    },
    addMechant () {
      this.dialogmerchantVisible = true
    },
    handleCurrentChange (val) {
      console.log(val)
      this.queryInfo.pagenum = val
      this.getRolesList()
    },
    async statusChange (row) {
      console.log(row)
      const info = {
        id: row.id,
        del: row.del
      }
      // console.log('info', info)
      const { data: res } = await this.$http.post('mapi/start', info)
      // console.log(res)
      if (res.code !== 200) return this.$message.error(res.msg)
      this.$message.success('修改成功！')
    },
    editBtn (id) {
      sessionStorage.setItem('roleId', id)
      const url = '/rolesedit'
      this.$router.push({
        path: url,
        params: {
          roleId: id
        }
      })
    },
    // 确定提交
    onSubmit (formName) {
      this.$refs[formName].validate(async valid => {
        if (valid) {
          // eslint-disable-next-line camelcase
            const { data: res } = await this.$http.post('mapi/merchant', this.merchantForm)
            if (res.code !== 200) return this.$message.error('添加失败, 请重新添加！')
            this.$message.success('添加成功')
            this.dialogmerchantVisible = false;
            this.getRolesList()
         
        } else {
          this.$message.warning('请检查是否填写完善！！')
          return false
        }
      })
    },
    formatDate (time) {
      const date = new Date(parseInt(time) * 1000)
      const YY = date.getFullYear() + '-'
      const MM = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-'
      const DD = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate())
      const hh = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':'
      const mm = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':'
      const ss = (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds())
      return YY + MM + DD + ' ' + hh + mm + ss
    }
  }
}
</script>

<style scoped lang="less">
.el-table{margin: 20px 0;}
</style>
