<template>
    <div>
      <!-- 面包屑导航区域 -->
      <!-- <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>您当前所在位置</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>客户管理</el-breadcrumb-item>
        <el-breadcrumb-item>客户列表</el-breadcrumb-item>
      </el-breadcrumb> -->
      <!-- 卡片视图区域 -->
      <el-card>
         <el-row class="mb10">
           <el-col :span="24">
             <el-select v-model="queryInfo.type" placeholder="客户类型" clearable size="mini">
                <el-option label="供应商" :value="1"></el-option>
                <el-option label="分销商" :value="2"></el-option>
             </el-select>
             <el-select v-model="queryInfo.key_id" placeholder="选择" clearable size="mini">
                <el-option label="客户ID" :value="1"></el-option>
                <el-option label="客户名称" :value="0"></el-option>
             </el-select>
             <el-input placeholder="请输入内容" v-model="queryInfo.keyword" clearable size="mini">
                <el-button slot="append" @click="onSearch" icon="el-icon-search"></el-button>
              </el-input>
              <el-button type="primary" size="mini" @click="addClient">新增 <i class="el-icon-circle-plus"></i></el-button>
             <el-button type="primary" size="mini" @click="clientRecycle">回收站 <i class="el-icon-delete-solid"></i></el-button>
           </el-col>
         </el-row>
         <el-table :data="tableData" height="680" border style="width: 100%">
           <el-table-column prop="id" label="客户id"  sortable ></el-table-column>
           <el-table-column prop="name" label="客户名称" ></el-table-column>
           <el-table-column prop="type" label="客户类型" ></el-table-column>
           <el-table-column prop="address" label="客户地址" ></el-table-column>
           <el-table-column prop="relation_phone" label="固定电话" ></el-table-column>
           <el-table-column prop="phone" label="手机号码" ></el-table-column>
           <el-table-column prop="add_time" label="创建时间"></el-table-column>
           <el-table-column label="操作" width="150">
             <template slot-scope="scope">
               <el-button type="primary" size="mini" @click="editBtn(scope.row)">编辑</el-button>
               <el-button type="primary" size="mini" @click="deleteBtn(scope.row, scope.$idnex)">删除</el-button>
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
        type: '',
        // eslint-disable-next-line camelcase
        key_id: '',
        del: 0,
        keyword: '',
        page: 1,
        pagesize: 10
      },
      tableData: [],
      total: 0
    }
  },
  created () {
    this.getClientList()
  },
  methods: {
    async getClientList () {
      const loading = this.$loading({
          lock: true,
          text: 'Loading',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.1)'
        });
      const { data: res } = await this.$http.post('mapi/clientClient', this.queryInfo)
      // console.log(res)
      if (res.code !== 200) return this.$message.error('获取客户列表失败！')
      // this.$message.success('获取客户列表成功！')
      loading.close()
      this.tableData = res.list.data
      this.total = res.list.total
    },
    // 新增
    addClient () {
      this.$router.push('addclient')
    },
    // 回收站
    clientRecycle () {
      this.$router.push('clientrecycle')
    },
    // 搜索
    onSearch () {
      this.getClientList()
    },
    // 编辑
    editBtn (row) {
      console.log(row)

      sessionStorage.setItem('clientId', row.id)
      this.$router.push({
        path: 'addclient',
        params: {
          id: row.id
        }
      })
    },
    // 删除
    deleteBtn (row, index) {
      this.$confirm('确定删除此客户吗?', '温馨提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const { data: res } = await this.$http.get('mapi/clientClientDel', { params: { id: row.id } })
        if (res.code !== 200) return this.$message.error(res.msg)
        this.$message.success('删除成功！')
        this.getClientList()
      }).catch(() => {
        this.$message.info('已取消删除')
      })
    },
    // 一页显示多少条更改
    handleSizeChange (val) {
      this.queryInfo.pagesize = val
      this.getClientList()
    },
    // 显示多少页
    handleCurrentChange (val) {
      console.log(val)
      this.queryInfo.page = val
      this.getClientList()
    }
  }
}
</script>

<style scoped lang="less">
.el-input{width:220px;margin-right:10px;}
.el-select{width:120px;margin-right:10px;}
</style>
