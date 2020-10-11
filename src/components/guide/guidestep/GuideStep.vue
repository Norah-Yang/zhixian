<template>
    <div>
      <!-- 面包屑导航区域 -->
      <!-- <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>您当前所在位置</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>导购管理</el-breadcrumb-item>
        <el-breadcrumb-item>导购等级</el-breadcrumb-item>
      </el-breadcrumb> -->
      <el-card>
        <el-row class="mb10">
          <el-col :span="24">
             <el-button type="primary" size="mini" @click="addGuideStep">新增 <i class="el-icon-circle-plus-outline"></i></el-button>
          </el-col>
        </el-row>
        <el-table :data="tableData"  border  style="width: 100%">
           <el-table-column prop="name" label="等级名称"></el-table-column>
           <el-table-column prop="money" label="订单金额"></el-table-column>
           <el-table-column label="提成方式">
             <template slot-scope="scope">
               {{scope.row.extract_type == 1? '按百分比': '按金额'}}
             </template>
           </el-table-column>
           <el-table-column prop="extract_num" label="提成数值">
             <template slot-scope="scope">
               {{scope.row.extract_num}}{{scope.row.extract_type == 1? '%':'元'}}
             </template>
           </el-table-column>
           <el-table-column prop="intro" label="备注"></el-table-column>
           <el-table-column label="操作">
             <template slot-scope="scope">
                <el-button type="primary" size="mini" @click="editGuideStep(scope.row)">编辑</el-button>
                <el-button type="warning" size="mini" @click="deleteGuideStep(scope.row, scope.$index)">删除</el-button>
             </template>
           </el-table-column>
        </el-table>
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="queryInfo.page"
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
      tableData: [],
      queryInfo: {
        page: 1,
        pagesize: 10
      },
      total: 0
    }
  },
  created () {
    this.getGuideStepList()
  },
  methods: {
    async getGuideStepList () {
      const loading = this.$loading({
          lock: true,
          text: 'Loading',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.1)'
        });
      const { data: res } = await this.$http.post('mapi/guideGradeList', this.queryInfo)
      // console.log(res)
      if (res.code !== 200) return this.$message.error(res.msg)
      // this.$message.success('获取导购等级成功！')
      loading.close()
      this.total = res.list.total
      this.tableData = res.list.data
    },
    addGuideStep () {
      this.$router.push('aeguidestep')
    },
    editGuideStep (row) {
      console.log(row)
      sessionStorage.setItem('gStepId', row.id)
      this.$router.push('aeguidestep')
    },
    deleteGuideStep (row, index) {
      console.log(row, index)
      this.$confirm('此操作将永久删除该等级, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const { data: res } = await this.$http.get('mapi/guideDel', { params: { id: row.id } })
        if (res.code !== 200) return this.$message.error('删除失败！')
        this.tableData.splice(index, 1)
        this.$message.success('删除成功')
      }).catch(() => {
      })
    },
    // 分页 一页显示多少条
    handleSizeChange (newSize) {
      this.queryInfo.pagesize = newSize
      this.getGuideStepList()
    },
    // 分页 跳转到多少页
    handleCurrentChange (newPage) {
      this.queryInfo.page = newPage
      this.getGuideStepList()
    }
  }
}
</script>

<style scoped lang="less">
.el-pagination{
  text-align: right;
  margin-top:20px;
}
</style>
