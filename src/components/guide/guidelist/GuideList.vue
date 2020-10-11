<template>
    <div>
       <!-- 面包屑导航区域 -->
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>您当前所在位置</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>导购管理</el-breadcrumb-item>
        <el-breadcrumb-item>导购员管理</el-breadcrumb-item>
      </el-breadcrumb>
      <el-card>
        <el-row class="mb10">
          <el-col :span="24">
             <el-select v-model="queryInfo.shop_id" placeholder="选择门店" clearable size="mini">
                <el-option
                  v-for="item in shopOptions"
                  :key="item.id"
                  :label="item.title"
                  :value="item.id">
                </el-option>
             </el-select>
             <el-select v-model="queryInfo.key_id" placeholder="搜索条件" clearable  size="mini">
                <el-option label="导购编号" value="1"></el-option>
                <el-option label="导购姓名" value="2"></el-option>
             </el-select>
             <el-input type="text" placeholder="在这里输入搜索内容" clearable  size="mini" >
                <el-button slot="append" icon="el-icon-search" @click="onSearch"></el-button>
             </el-input>
             <el-button type="primary" @click="addGuides"  size="mini">新增 <i class="el-icon-circle-plus-outline"></i></el-button>
          </el-col>
        </el-row>
        <el-table :data="tableData" border  style="width: 100%">
           <el-table-column prop="nid" label="导购ID"></el-table-column>
           <el-table-column prop="number" label="导购编号"></el-table-column>
           <el-table-column prop="name" label="姓名"></el-table-column>
           <el-table-column prop="phone" label="电话"></el-table-column>
           <el-table-column prop="title" label="关联站点"></el-table-column>
           <el-table-column prop="gname" label="导购等级"></el-table-column>
           <el-table-column prop="mname" label="管理员工"></el-table-column>
           <el-table-column prop="money" label="提成金额"></el-table-column>
           <el-table-column label="是否启用">
             <template slot-scope="scope">
               <el-switch v-model="scope.row.status" :inactive-value="0" :active-value="1"  @change="statusChange(scope.row)"></el-switch>
             </template>
           </el-table-column>
           <el-table-column label="操作" width="300">
             <template slot-scope="scope">
                <el-button type="primary" size="mini" @click="editGuide(scope.row)">编辑</el-button>
                <el-button type="danger" size="mini" @click="deleteGuide(scope.row, scope.$index)">删除</el-button>
                <el-button type="primary" size="mini" plain @click="settlement(scope.row)">结算</el-button>
                <el-button type="primary" size="mini" plain @click="settlementDetail(scope.row)">结算明细</el-button>
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
      <el-dialog title="导购结算" :visible.sync="settlementFormVisible">
        <el-form :model="settlementForm" :rules="settlementFormRules" ref="settlementFormRef" class="setttleform">
          <el-form-item label="导购编号:" :label-width="formLabelWidth">
              {{settlementForm.number}}
          </el-form-item>
          <el-form-item label="导购姓名:" :label-width="formLabelWidth">
            {{settlementForm.name}}
          </el-form-item>
          <el-form-item label="手机号码:" :label-width="formLabelWidth">
            {{settlementForm.phone}}
          </el-form-item>
          <el-form-item label="提成金额:" :label-width="formLabelWidth">
            {{settlementForm.money}}元
          </el-form-item>
          <el-form-item label="结算金额:" :label-width="formLabelWidth" prop="deduct_money">
            <el-input v-model="settlementForm.deduct_money" autocomplete="off">
              <template slot="append">元</template>
            </el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="settlementFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="settlementSub('settlementFormRef')">确 定</el-button>
        </div>
      </el-dialog>
    </div>
</template>

<script>
export default {
  data () {
    var validateMoney = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('结算金额不能为空'))
      } else if (value < 0) {
        callback(new Error('输入金额不能小于0'))
      } else {
        if (value > parseFloat(this.settlementForm.money)) {
          callback(new Error('输入金额不能大于提成金额'))
        } else {
          callback()
        }
      }
    }
    return {
      // 查询条件
      queryInfo: {
        // eslint-disable-next-line camelcase
        shop_id: '',
        // eslint-disable-next-line camelcase
        key_id: '',
        keyword: '',
        page: 1,
        pagesize: 10
      },
      shopOptions: [], // 门店列表
      total: 0, // 总条数
      tableData: [], // 列表总数
      formLabelWidth: '120px',
      settlementForm: {
        id: '',
        number: '',
        name: '',
        phone: '',
        money: '',
        // eslint-disable-next-line camelcase
        deduct_money: ''
      },
      settlementFormVisible: false, // 结算弹框
      settlementFormRules: {
        // eslint-disable-next-line camelcase
        deduct_money: [
          { required: true, validator: validateMoney, trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    this.getGuidesList()
  },
  methods: {
    // 获取导购员列表
    async getGuidesList () {
      const loading = this.$loading({
          lock: true,
          text: 'Loading',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.1)'
        });
      const { data: res } = await this.$http.post('mapi/guideNameList', this.queryInfo)
      // console.log(res)
      if (res.code !== 200) return this.$message.error(res.msg)
      // this.$message.success('获取导购员列表成功！')
      loading.close()
      this.total = res.list.total
      this.shopOptions = res.arr.shop
      this.tableData = res.list.data
    },
    // 点击搜索
    onSearch () {
      // console.log(111);
      this.getGuidesList()
    },
    async statusChange (row) {
      // console.log(row)
      const { data: res } = await this.$http.post('mapi/guideNameStatus', { id: row.nid, status: row.status })
      // console.log(res)
      if (res.code !== 200) return this.$message.error('修改失败！')
      this.$message.success('修改成功！')
    },
    // 新增
    addGuides () {
      this.$router.push('aeguide')
    },
    // 编辑导购
    editGuide (row) {
      sessionStorage.setItem('guideId', row.nid)
      this.$router.push('aeguide')
    },
    deleteGuide (row, index) {
      console.log(row.nid, index)
      this.$confirm('此操作将永久删除该导购, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const { data: res } = await this.$http.get('mapi/guideNameDel', { params: { id: row.nid } })
        if (res.code !== 200) return this.$message.error('删除失败')
        this.$message.success('删除成功！')
        this.tableData.splice(index, 1)
      }).catch(() => {
      })
    },
    // 结算
    settlement (row) {
      console.log(row)
      this.settlementForm.id = row.nid
      this.settlementForm.number = row.number
      this.settlementForm.name = row.name
      this.settlementForm.phone = row.phone
      this.settlementForm.money = row.money
      this.settlementFormVisible = true
    },
    settlementSub (formName) {
      this.$refs[formName].validate(async valid => {
        if (valid) {
          // eslint-disable-next-line camelcase
          const { data: res } = await this.$http.post('mapi/guideFinish', { id: this.settlementForm.id, deduct_money: this.settlementForm.deduct_money })
          console.log(res)
          if (res.code !== 200) this.$message.error(res.msg)
          this.$message.success(res.msg)
          this.settlementForm = {
            id: '',
            number: '',
            name: '',
            phone: '',
            money: '',
            // eslint-disable-next-line camelcase
            deduct_money: ''
          }
          this.settlementFormVisible = false
          this.getGuidesList()
        } else {
          return false
        }
      })
    },
    // 结算明细
    settlementDetail (row) {
      sessionStorage.setItem('settId', row.nid)
      this.$router.push('settlementdetail')
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
.el-select {width:150px;margin-right:10px;}
.el-input {width:250px;margin-right:10px;}
.setttleform  /deep/ .el-form-item  .el-form-item__label{
      font-weight: bold;
      color:teal;
}
</style>
