<template>
    <div>
      <!-- 面包屑导航区域 -->
    <!-- <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>您当前所在位置</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>会员卡管理</el-breadcrumb-item>
      <el-breadcrumb-item>会员卡类型</el-breadcrumb-item>
    </el-breadcrumb> -->
    <!-- 卡片视图区域 -->
    <el-card class="card">
      <el-collapse v-model="activeNames" class="mb10">
        <el-collapse-item title="操作提示" name="1">
          <div>· 系统默认支持储值卡和折扣卡,需要做调整可编辑</div>
          <div>· 储值卡，会员卡需要预存金额，默认按照会员价结算，可享受积分</div>
          <div>· 折扣卡，别名等级卡，会员卡可以不储值，根据会员等级按销售价给折扣与积分</div>
        </el-collapse-item>
      </el-collapse>
      <el-row class="mb10">
        <el-col :span="4">
          <el-button type="primary" @click="addCardType"  size="mini"><i class="el-icon-circle-plus-outline"></i> 新增</el-button>
        </el-col>
      </el-row>
      <el-table :data="tableData" border style="width: 100%">
        <el-table-column prop="id" label="编号" ></el-table-column>
        <el-table-column prop="name" label="会员卡类型名称" ></el-table-column>
        <el-table-column label="是否储值" >
          <template slot-scope="scope">
            {{scope.row.money_state == 0? '否': '是'}}
          </template>
        </el-table-column>
        <el-table-column label="是否储值消费" >
          <template slot-scope="scope">
            {{scope.row.give_money == 0? '否': '是'}}
          </template>
        </el-table-column>
        <el-table-column label="是否支持积分支付" >
          <template slot-scope="scope">
            {{scope.row.score_state == 0? '否': '是'}}
          </template>
        </el-table-column>
        <el-table-column label="是否支持优惠券支付" >
          <template slot-scope="scope">
            {{scope.row.coupon_state == 0? '否': '是'}}
          </template>
        </el-table-column>
        <el-table-column label="是否支持跨店使用" >
          <template slot-scope="scope">
            {{scope.row.shop_state == 0? '否': '是'}}
          </template>
        </el-table-column>
        <el-table-column label="是否积分" >
          <template slot-scope="scope">
            {{scope.row.member_score_state == 0? '否': '是'}}
          </template>
        </el-table-column>
        <el-table-column label="积分规则" >
          <template slot-scope="scope">
            {{scope.row.score_rule == 0? '无': scope.row.score_rule +'元1积分'}}
          </template>
        </el-table-column>
        <el-table-column label="价格设置" >
          <template slot-scope="scope">
            {{scope.row.sale_state == 0? '销售价': '会员价'}}
          </template>
        </el-table-column>
        <el-table-column label="支持会员等级" >
          <template slot-scope="scope">
            {{scope.row.member_grade_state == 0? '否': '是'}}
          </template>
        </el-table-column>
        <el-table-column label="使用会员等级积分规则" >
          <template slot-scope="scope">
            {{scope.row.member_rule == 0? '否': '是'}}
          </template>
        </el-table-column>
        <el-table-column label="有效天数" >
          <template slot-scope="scope">
            {{scope.row.indate == 0? '永久': scope.row.indate+'天'}}
          </template>
        </el-table-column>
        <el-table-column label="使用支付密码">
          <template slot-scope="scope">
            {{scope.row.password_state == 0? '否': '是'}}
          </template>
        </el-table-column>
        <el-table-column label="线上商城会员卡默认类型" >
          <template slot-scope="scope">
            {{scope.row.internet_state == 0? '否': '是'}}
          </template>
        </el-table-column>
        <el-table-column prop="state" label="启用状态" >
          <template slot-scope="scope">
            {{scope.row.state == 0? '否': '是'}}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="editMemCardType(scope.row)">编辑</el-button>
            <el-button type="danger" size="mini" @click="deleteMemCardType(scope.row, scope.$index)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
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
    this.getCartTypeList()
  },
  mounted () {

  },
  methods: {
    // 获取会员卡类型列表
    async getCartTypeList () {
      const loading = this.$loading({
          lock: true,
          text: 'Loading',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.1)'
        });
      const { data: res } = await this.$http.post('mapi/memberType', this.query)
      if (res.code !== 200) return this.$message.error(res.msg)
      // this.$message.success('获取会员卡类型列表成功！')
      loading.close()
      this.tableData = res.list
    },
    // 编辑会员卡类型
    editMemCardType (row) {
      sessionStorage.setItem('cardId', row.id)
      this.$router.push({ name: 'memcardtypeedit', params: { id: row.id } })
    },
    // 删除会员卡类型
    deleteMemCardType (row, index) {
      this.$confirm('确定删除此种卡类型吗?', '温馨提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const { data: res } = await this.$http.get('mapi/memberTypeDel', { params: { id: row.id } })
        if (res.code !== 200) return this.$message.error(res.msg)
        this.$message.success('删除成功！')
        this.tableData.splice(index, 1)
      }).catch(() => {
        this.$message.info('已取消删除')
      })
    },
    // 新增会员卡类型
    addCardType () {
      this.$router.push('addmemcardtype')
    }
  }
}
</script>

<style scoped lang="less">
.card /deep/ .el-collapse-item__header{font-size:18px !important;color: chocolate;}
</style>
