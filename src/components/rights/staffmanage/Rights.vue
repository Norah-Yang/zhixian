<template>
    <div>
        <!-- 面包屑导航区域 -->
      <!-- <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>您当前所在位置</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>权限管理</el-breadcrumb-item>
        <el-breadcrumb-item>员工管理</el-breadcrumb-item>
      </el-breadcrumb> -->
      <!-- 卡片视图区域 -->
      <el-card>
         <el-row class="mb10">
           <el-col :span="24">
             <el-select v-model="queryInfo.login" placeholder="限制登录" clearable size="mini">
                <el-option label="是" :value="1"></el-option>
                <el-option label="否" :value="0"></el-option>
             </el-select>
              <el-select v-model="queryInfo.shop_id" placeholder="选择门店" clearable size="mini">
                <el-option
                  v-for="item in shopOptions"
                  :key="item.id"
                  :label="item.title"
                  :value="item.id">
                </el-option>
             </el-select>
             <el-select v-model="queryInfo.role_id" placeholder="选择角色" clearable size="mini">
                <el-option
                  v-for="item in roleOptions"
                  :key="item.id"
                  :label="item.title"
                  :value="item.id">
                </el-option>
             </el-select>
             <el-select v-model="queryInfo.key_id" placeholder="搜索条件" clearable size="mini">
                <el-option label="用户Id" :value="1"></el-option>
                <el-option label="用户名" :value="2"></el-option>
                <el-option label="姓名" :value="3"></el-option>
             </el-select>
             <el-input placeholder="请输入内容" v-model="queryInfo.keyword" clearable size="mini">
                <el-button slot="append" @click="onsearch" icon="el-icon-search"></el-button>
              </el-input>
              <el-button type="primary" size="mini" @click="addStaff">新增 <i class="el-icon-circle-plus"></i></el-button>
             <el-button type="primary" size="mini" @click="staffRecycle">回收站 <i class="el-icon-delete-solid"></i></el-button>
           </el-col>
         </el-row>
         <el-table :data="tableData" height="680" border style="width: 100%">
           <el-table-column prop="id" label="用户id" width="70"></el-table-column>
           <el-table-column prop="name" label="用户名" width="100"></el-table-column>
           <el-table-column prop="nickname" label="姓名" width="100"></el-table-column>
           <el-table-column prop="role" label="角色" width="100" ></el-table-column>
           <el-table-column prop="shop" label="管理站点" ></el-table-column>
           <el-table-column label="限制登录" width="80">
             <template slot-scope="scope">
              <!-- 0启用，1未启用 -->
              <el-switch v-model="scope.row.login" :disabled="scope.row.super == 1" :inactive-value="0" :active-value="1" @change="limitChange(scope.row)"></el-switch>
            </template>
           </el-table-column>
           <el-table-column label="开启通知"  width="80">
             <template slot-scope="scope">
              <!-- 0启用，1未启用 -->
              <el-switch v-model="scope.row.inform" :disabled="scope.row.super == 1" :inactive-value="0" :active-value="1" @change="informChange(scope.row)"></el-switch>
            </template>
           </el-table-column>
           <el-table-column label="开启核销"  width="80">
             <template slot-scope="scope">
              <!-- 0启用，1未启用 -->
              <el-switch v-model="scope.row.cancel_after_verification" :disabled="scope.row.super == 1" :inactive-value="0" :active-value="1" @change="verificationChange(scope.row)"></el-switch>
            </template>
           </el-table-column>
           <el-table-column label="操作" width="250">
             <template slot-scope="scope">
               <el-button type="primary" size="mini" @click="updateBtn(scope.row)">更新二维码</el-button>
               <el-button type="primary" size="mini" @click="editBtn(scope.row)">编辑</el-button>
               <el-button type="danger" size="mini" v-if="scope.row.super !== 1" @click="deleteBtn(scope.row, scope.$index)">删除</el-button>
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
    </div>
</template>

<script>
export default {
  data () {
    return {
      queryInfo: {
        login: '',
        // eslint-disable-next-line camelcase
        shop_id: '',
        // eslint-disable-next-line camelcase
        role_id: '',
        // eslint-disable-next-line camelcase
        key_id: '',
        keyword: '',
        page: 1,
        pagesize: 10
      },
      shopOptions: '',
      roleOptions: [],
      tableData: [],
      total: 0
    }
  },
  created () {
    this.getStaffList()
  },
  mounted () {

  },
  methods: {
    async getStaffList () {
      const loading = this.$loading({
          lock: true,
          text: 'Loading',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.1)'
        });
      const { data: res } = await this.$http.get('mapi/EmployeeList', { params: this.queryInfo })
      console.log(res)
      if (res.code !== 200) return this.$message.error('获取员工列表失败！')
      // this.$message.success('获取员工列表成功！')
      loading.close();
      this.tableData = res.user.data
      this.total = res.user.total
      this.shopOptions = res.shop
      this.roleOptions = res.role
    },
    onsearch () {
      this.getStaffList()
    },
    // 新增员工
    addStaff () {
      this.$router.push('aestaff')
    },
    // 回收站
    staffRecycle () {
      this.$router.push('staffrecycle')
    },
    // 编辑新员工
    editBtn (row) {
      console.log(row)
      sessionStorage.setItem('staffId', row.id)
      this.$router.push({
        path: 'aestaff',
        params: {
          staffId: row.id
        }
      })
    },
    // 删除员工
    deleteBtn (row, index) {
      this.$confirm('确定删除此员工吗?', '温馨提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const { data: res } = await this.$http.get('mapi/delEmployee', { params: { id: row.id } })
        if (res.code !== 200) return this.$message.error(res.msg)
        this.$message.success('删除成功！')
        this.tableData.splice(index, 1)
      }).catch(() => {
        this.$message.info('已取消删除')
      })
    },
    // 限制登录状态
    async limitChange (row) {
      const { data: res } = await this.$http.get('mapi/logEmployee', { params: { id: row.id, login: row.login } })
      console.log(res)
      if (res.code !== 200) return this.$message.error('更改限制登录失败！')
      this.$message.success('员工限制登录状态更改成功！')
    },
    // 开启通知状态
    async informChange (row) {
      const { data: res } = await this.$http.get('mapi/informEmployee', { params: { id: row.id, inform: row.inform } })
      console.log(res)
      if (res.code !== 200) return this.$message.error('更改通知状态失败！')
      this.$message.success('更改通知状态成功！')
    },
    // 开启核销状态
    async verificationChange (row) {
      // eslint-disable-next-line camelcase
      const { data: res } = await this.$http.get('mapi/verificationEmployee', { params: { id: row.id, verification: row.cancel_after_verification } })
      console.log(res)
      if (res.code !== 200) return this.$message.error('更改核销状态失败！')
      this.$message.success('更改核销状态成功！')
    },
    // 更新绑定二维码
    updateBtn (row) {
      console.log('更新二维码')
    },
    handleSizeChange (val) {
      this.queryInfo.pagesize = val
      // this.getRolesList()
    },
    handleCurrentChange (val) {
      console.log(val)
      this.queryInfo.page = val
      // this.getRolesList()
    }
  }
}
</script>

<style scoped lang="less">
.el-input{width:220px;margin-right:10px;}
.el-select{width:120px;margin-right:10px;}
</style>
