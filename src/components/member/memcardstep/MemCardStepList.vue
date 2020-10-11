<template>
    <div>
       <!-- 面包屑导航区域 -->
      <!-- <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>您当前所在位置</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>会员卡管理</el-breadcrumb-item>
        <el-breadcrumb-item>会员卡等级列表</el-breadcrumb-item>
      </el-breadcrumb> -->
      <!-- 卡片视图区域 -->
      <el-card  class="card">
         <el-collapse v-model="activeNames" class="mb10">
          <el-collapse-item title="操作提示" name="1">
            <div>· 会员卡等级只适用于折扣卡，其它会员卡只享受会员价，折扣卡的优惠根据累计消费金额划分等级</div>
          </el-collapse-item>
        </el-collapse>
        <el-row class="mb10">
          <el-col :span="4" class="mb10">
            <el-button type="primary" @click="addCardStep"  size="mini"><i class="el-icon-circle-plus-outline"></i> 新增等级</el-button>
          </el-col>
          <el-table :data="tableData" border style="width: 100%">
             <el-table-column prop="name" label="等级名称" ></el-table-column>
             <el-table-column prop="money" label="消费金额" ></el-table-column>
             <el-table-column prop="discount" label="等级折扣" ></el-table-column>
             <el-table-column prop="score_rule" label="积分规则" ></el-table-column>
             <el-table-column prop="remark" label="备注" ></el-table-column>
             <el-table-column label="操作" width="150">
               <template slot-scope="scope">
                 <el-button type="primary" size="mini" @click="editMemCardStep(scope.row)">编辑</el-button>
                 <el-button type="danger" size="mini" @click="deleteMemCardStep(scope.row, scope.$index)">删除</el-button>
               </template>
             </el-table-column>
          </el-table>
        </el-row>
      </el-card>
    </div>
</template>

<script>
export default {
  data () {
    return {
      activeNames: ['1'],
      tableData: []
    }
  },
  created () {
    this.getCardStepList()
  },
  methods: {
    async getCardStepList () {
      const loading = this.$loading({
          lock: true,
          text: 'Loading',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.1)'
        });
      const { data: res } = await this.$http.post('mapi/memberGrade')
      // console.log(res)
      if (res.code !== 200) return this.$message.error('获取会员卡等级失败！')
      // this.$message.success('获取会员卡等级列表成功！')
      loading.close()
      this.tableData = res.list
    },
    // 新增
    addCardStep () {
      this.$router.push('addcardstep')
    },
    // 编辑
    editMemCardStep (row) {
      sessionStorage.setItem('cardStepId', row.id)
      this.$router.push({ name: 'cardstepedit', params: { id: row.id } })
    },
    // 删除
    deleteMemCardStep (row, index) {
      this.$confirm('确定删除此种等级卡吗?', '温馨提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const { data: res } = await this.$http.get('mapi/memberGradeDel', { params: { id: row.id } })
        if (res.code !== 200) return this.$message.error(res.msg)
        this.$message.success('删除成功！')
        this.tableData.splice(index, 1)
      }).catch(() => {
        this.$message.info('已取消删除')
      })
    }
  }
}
</script>

<style scoped lang="less">
.card /deep/ .el-collapse-item__header{font-size:18px !important;color: chocolate;}
</style>
