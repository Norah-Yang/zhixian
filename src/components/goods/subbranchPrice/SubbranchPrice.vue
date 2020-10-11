<template>
    <div>
       <!-- 面包屑导航区域 -->
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>您当前所在位置</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>商品管理</el-breadcrumb-item>
        <el-breadcrumb-item>分店价格</el-breadcrumb-item>
      </el-breadcrumb>
      <!-- 卡片视图区域 -->
      <el-card>
        <el-row :gutter="10">
          <el-col :span="2">
              <el-select v-model="searchTerm" placeholder="请选择" @change="termChange">
                <el-option
                  v-for="item in optionsVal"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
          </el-col>
          <el-col :span="4">
            <el-input placeholder="请输入内容" v-model="searchVal" @input="searchValChange">
              <el-button slot="append" icon="el-icon-search" @click="searchGood"></el-button>
            </el-input>
          </el-col>
        </el-row>
        <el-row :gutter="10">
            <el-col :span="4">
             <el-select v-model="shopId" placeholder="请选择" @change="shopChange">
                <el-option
                  v-for="item in shopOptions"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-col>
            <el-col :span="4">
              <el-button type="primary" @click="export2Excel">按门店导出商品</el-button>
            </el-col>
        </el-row>
        <el-row>
          <el-col :span="4">
            <el-row>
              <el-col :span="24" v-for="(item, index) in sortList" :key="index" class="catebg">
                <el-button class="textbtn" type="text" @click="getGoodById(item.id)">{{item.title}}<i class="el-icon-arrow-right el-icon--right"></i></el-button>
              </el-col>
            </el-row>
          </el-col>
          <el-col :span="20">
            <div class="tab_div">
            <el-table
              :data="goodList"
              border
              :span-method='objectSpanMethod'
              @row-click="rowClick"
              style="width: 100%" row-key="1" class="onlybody">
                <el-table-column
                prop="goods_name,commodity_code"
                label="商品名称(商品编号)"
                width="250">
                  <template slot-scope="scope">
                    {{scope.row.goods_name}}({{scope.row.commodity_code}})
                  </template>
                </el-table-column>
                <el-table-column prop="price_name" label="销售方式"></el-table-column>
                <el-table-column prop="supply_price" label="成本价格"></el-table-column>
                <el-table-column prop="price" label="销售价格"></el-table-column>
                <el-table-column prop="member_price" label="会员价格"></el-table-column>
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
            </div>
          </el-col>
        </el-row>
      </el-card>
      <el-dialog :title="goodName+'分店价格设置'" :visible.sync="dialogTableVisible">
        <el-table :data="goodData" height="500"  :span-method='objectSpanMethodOne' border>
          <el-table-column prop="title" label="店铺名称" width="200"></el-table-column>
          <el-table-column prop="name" label="销售方式" ></el-table-column>
          <el-table-column label="成本价格（元）">
            <template slot-scope="scope">
              <el-input type="text" v-model="scope.row.supply_price" @input="e => scope.row.supply_price = convertNum(e)"></el-input>
            </template>
          </el-table-column>
          <el-table-column label="销售价格（元）">
            <template slot-scope="scope">
              <el-input type="text" v-model="scope.row.price" @input="e => scope.row.price = convertNum(e)"></el-input>
            </template>
          </el-table-column>
          <el-table-column label="会员价格（元）">
            <template slot-scope="scope">
              <el-input type="text" v-model="scope.row.member_price" @input="e => scope.row.member_price = convertNum(e)"></el-input>
            </template>
          </el-table-column>
          <el-table-column property="address" label="操作">
            <template slot-scope="scope">
              <el-button type="primary" size="mini" @click="syncPrice(scope.row)">同步</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogTableVisible = false">取 消</el-button>
          <el-button type="primary" @click="changePrice">确 定</el-button>
        </div>
      </el-dialog>
    </div>
</template>

<script>
export default {
  data () {
    return {
      // 按什么条件
      searchTerm: '2',
      // 按什么内容
      searchVal: '',
      // 条件分类
      optionsVal: [
        {
          label: '商品id',
          value: '1'
        },
        {
          label: '商品名称',
          value: '2'
        },
        {
          label: '商品编号',
          value: '3'
        }
      ],
      queryInfo: {
        // eslint-disable-next-line camelcase
        search_id: '',
        keyword: '',
        // eslint-disable-next-line camelcase
        cate_id: '',
        pagenum: 1,
        pagesize: 20

      },
      // 门店列表
      shopOptions: [],
      // 门店
      shopId: '',
      shopName: '',
      // 商品列表
      goodList: [],
      // 商品分类列表
      sortList: [],
      // 商品总数
      total: 0,
      spanArr: [],
      pos: 0,
      spanArr1: [],
      pos1: 0,
      dialogTableVisible: false,
      goodData: [],
      goodName: '',
      // 分店商品的列表
      excelGoodList: []
    }
  },
  created () {
    this.getGood()
  },
  methods: {
    // 获取商品分类
    async getGood () {
      const { data: res } = await this.$http.post('mapi/subbranch', this.queryInfo)
      if (res.status !== 1) return this.$message.error('获取列表失败！')
      this.$message.success('获取列表成功！')
      this.goodList = res.data
      this.sortList = res.sort
      this.shopOptions = res.shop
      this.total = res.count
      this.spanArr = []
      this.pos = 0
      this.getSpanArr(res.data)
      console.log(res)
    },
    // 导出门店选择
    shopChange (val) {
      this.outputList()
      this.shopOptions.forEach(item => {
        // eslint-disable-next-line eqeqeq
        if (item.id == val) {
          this.shopName = item.name
        }
      })
    },
    // 按门店导出商品列表
    async outputList () {
      // eslint-disable-next-line eqeqeq
      if (this.shopId == '') return this.$message.error('请选择需要导出商品的门店！')
      // eslint-disable-next-line camelcase
      const { data: res } = await this.$http.get('mapi/shopPrice', { params: { shop_id: this.shopId } })
      if (res.status !== 1) return this.$message.error('导出Excel失败！')
      // this.$message.success('导出Excel成功！')
      this.excelGoodList = res.data
      console.log(res.data)
    },
    // 商品搜索条件更改
    termChange (val) {
      console.log(val)
      // eslint-disable-next-line camelcase
      this.queryInfo.search_id = val
    },
    // 商品搜索关键字更改
    searchValChange (val) {
      console.log(val)
      this.queryInfo.keyword = val.trim()
    },
    // 点击搜索按钮
    searchGood () {
      const queryInfo = this.queryInfo
      // eslint-disable-next-line camelcase
      this.queryInfo.search_id = this.searchTerm
      // eslint-disable-next-line eqeqeq
      if (queryInfo.search_id == '1') {
        // eslint-disable-next-line eqeqeq
        if (isNaN(queryInfo.keyword) == true) {
          return this.$message.error('商品id必须为数字！')
        }
      }
      console.log(queryInfo)

      this.getGood()
    },
    // 搜索商品根据的商品条件
    getGoodById (id) {
      // eslint-disable-next-line camelcase
      this.queryInfo.cate_id = id
      this.getGood()
    },
    // 列表table 列合并
    objectSpanMethod ({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0) {
        const _row = this.spanArr[rowIndex]
        const _col = _row > 0 ? 1 : 0
        return {
          rowspan: _row,
          colspan: _col
        }
      }
      // console.log(this.spanArr)
    },
    // 弹出框table 列合并
    objectSpanMethodOne ({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0) {
        const _row = this.spanArr1[rowIndex]
        const _col = _row > 0 ? 1 : 0
        return {
          rowspan: _row,
          colspan: _col
        }
      }
    },
    // 列表页获取列合并的数组
    getSpanArr (data) {
      for (var i = 0; i < data.length; i++) {
        if (i === 0) {
          this.spanArr.push(1)
          this.pos = 0
        } else {
          // 判断当前元素与上一个元素是否相同
          if (data[i].gid === data[i - 1].gid) {
            this.spanArr[this.pos] += 1
            this.spanArr.push(0)
          } else {
            this.spanArr.push(1)
            this.pos = i
          }
        }
      }
    },
    // 弹出框获取列合并的数组
    getSpanArr1 (data) {
      for (var i = 0; i < data.length; i++) {
        if (i === 0) {
          this.spanArr1.push(1)
          this.pos1 = 0
        } else {
          // 判断当前元素与上一个元素是否相同
          if (data[i].sid === data[i - 1].sid) {
            this.spanArr1[this.pos1] += 1
            this.spanArr1.push(0)
          } else {
            this.spanArr1.push(1)
            this.pos1 = i
          }
        }
      }
    },
    // 分页 一页显示多少条
    handleSizeChange (newSize) {
      this.queryInfo.pagesize = newSize
      this.getGood()
    },
    // 分页 跳转到多少页
    handleCurrentChange (newPage) {
      console.log('newpage:', newPage)
      this.queryInfo.pagenum = newPage
      this.getGood()
    },
    // 行点击
    async rowClick (row, column, event) {
      this.goodData = []
      this.goodName = row.goods_name
      this.spanArr1 = []
      this.pos1 = 0
      // eslint-disable-next-line camelcase
      const { data: res } = await this.$http.get('mapi/subbranchDetail', { params: { goods_id: row.gid } })
      if (res.status !== 1) return this.$message.error('获取分店价格设置失败！')
      this.$message.success('获取分店价格设置成功！')
      this.goodData = res.data
      console.log(res.data)

      this.getSpanArr1(res.data)
      this.dialogTableVisible = true
    },
    // 同步各个分店的价格
    syncChange () {},
    formatJson (filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]))
    },
    // 导出excel
    export2Excel () {
      require.ensure([], () => {
        const { exportJsonToExcel } = require('@/vendor/Export2Excel')
        const tHeader = ['商品id', '商品名称', '商品分类', '商品编号', '助记码', '销售单位', '商品条码', '商品PLU码', '成本价格', '销售价格', '会员价格']
        const filterVal = ['id', 'goods_name', 'cate_name', 'commodity_code', 'mnemonic_code', 'price_name', 'shop_code', 'plu', 'supply_price', 'price', 'member_price']
        if (this.excelGoodList.length > 0) {
          // console.log(this.excelGoodList)
          const exportData = this.excelGoodList
          const data = this.formatJson(filterVal, exportData)
          exportJsonToExcel(tHeader, data, this.shopName + '门店商品列表' + this.getNowDate(new Date()))
        }
      })
    },
    getNowDate (date) {
      return (
        date.getFullYear() +
        '年' +
        (date.getMonth() + 1) +
        '月' +
        date.getDate() +
        '日 ' +
        (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) +
        ':' +
        (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) +
        ':' +
        (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds())
      )
    },
    // 只能输入正整数和小数
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
    },
    syncPrice (row) {
      console.log(row)
      const newSupplyPrice = row.supply_price
      const newPrice = row.price
      const newMemberPrice = row.member_price
      this.goodData.forEach(item => {
        // eslint-disable-next-line eqeqeq
        if (item.unit_type == row.unit_type) {
          // eslint-disable-next-line camelcase
          item.supply_price = newSupplyPrice
          item.price = newPrice
          // eslint-disable-next-line camelcase
          item.member_price = newMemberPrice
        }
      })
    },
    async changePrice () {
      const query = {
        // eslint-disable-next-line camelcase
        goods_id: this.goodData[0].gid,
        price: JSON.stringify(this.goodData)
      }
      const { data: res } = await this.$http.post('mapi/subbranchDetail', query)
      console.log(res)
      if (res.status !== 1) return this.$message.error('分店价格修改失败！')
      this.$message.success('分店价格修改成功！')
      this.dialogTableVisible = false
      this.getGood()
    }
  }
}
</script>

<style scoped lang="less">
.el-row{ margin-bottom:10px;}
.el-col .el-select {width:100%;}
.el-col .textbtn{width:100%;padding:15px 10px;height: 100%;text-align: left;}
.el-col.catebg:nth-of-type(odd){background: #f9f9f9;}
.el-pagination{margin-top:10px;text-align:right;}
.tab_div{padding-left:20px;}
</style>
<style>
.el-table__row:hover{cursor: pointer; color: #409eff}
</style>
