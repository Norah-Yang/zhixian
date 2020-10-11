<template>
    <div>
      <el-card>
        <el-row :gutter="10">
            <el-select v-model="queryInfo.type" multiple placeholder="商品分类" class="goodsort" size="mini" clearable>
            <el-option
              v-for="item in sortOptions"
              :key="item.id"
              :label="item.title"
              :value="item.id">
            </el-option>
          </el-select>
          <!-- 筛选供应商 -->
            <el-select v-model="queryInfo.supplier" placeholder="选择供应商" class="goodsort" @change="supplierChange" size="mini" clearable>
              <el-option
                v-for="item in supplierOptions"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
            <el-select v-model="queryInfo.forsale" placeholder="上架状态" class="goodsort" @change="onStateChange" size="mini" clearable >
              <el-option
                v-for="item in onstateOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
            <el-select v-model="queryInfo.shop_id" placeholder="选择店铺" class="goodsort" size="mini" clearable >
            <el-option
              v-for="item in shop"
              :key="item.id"
              :label="item.title"
              :value="item.id">
            </el-option>
          </el-select>
            <el-select v-model="queryInfo.id" placeholder="请选择搜索类型" class="goodsort" @change="goodTypeChange" size="mini" clearable>
              <el-option
                v-for="item in goodtypeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
            <el-input placeholder="请在这里输入搜索内容" v-model="queryInfo.keyword" class="input-with-select" size="mini" clearable>
              <el-button slot="append" icon="el-icon-search" @click="searchGood" class="searchbtn"></el-button>
            </el-input>
        </el-row>
        <el-row :gutter="5" class="elrow">
            <el-button type="primary" class="button" @click="export2Excel" size="mini">导出EXCEL</el-button>
            <el-button type="success" class="button" @click="putaway" size="mini">上架 <i class="el-icon-upload2"></i></el-button>
            <el-button type="info" class="button" @click="soldout" size="mini">下架 <i class="el-icon-download"></i></el-button>
            <el-select v-model="goodsort1" placeholder="设置商品分类" class="goodsort" size="mini">
            <el-option
              v-for="item in sortOptions"
              :key="item.id"
              :label="item.title"
              :value="item.id">
            </el-option>
          </el-select>
            <el-button type="primary" class="button" @click="cateChange" size="mini">确认</el-button>
            <el-button type="success" class="button" @click="addGood" size="mini">新增 <i class="el-icon-circle-plus-outline"></i></el-button>
            <el-button type="primary" class="button" @click="quickAddGood" size="mini">快速添加商品</el-button>
            <el-button type="danger" class="button" @click="deleteBatches" size="mini">删除 <i class="el-icon-delete"></i></el-button>
        </el-row>
        <el-table :data="goodList" border style="width: 100%" class="table"  @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column prop="iid" label="商品Id" width="70"></el-table-column>
          <el-table-column prop="name" label="商品名称" ></el-table-column>
          <el-table-column  label="商品图片">
            <template slot-scope="scope">
              <img :src="scope.row.thumb" alt="" width="60" class="goodimg">
            </template>
          </el-table-column>
          <el-table-column prop="shop_name" label="所属门店" ></el-table-column>
          <el-table-column prop="type" label="分类名称" ></el-table-column>
          <el-table-column prop="commodity_code" label="商品编号"  width="160"></el-table-column>
          <el-table-column prop="specification" label="规格" width="250" >
            <template slot-scope="scope">
              <el-row>
                 <el-col :span="6">规格:</el-col>
                 <el-col :span="6">成本价</el-col>
                 <el-col :span="6">销售价</el-col>
                 <el-col :span="6">会员价</el-col>
              </el-row>
              <el-row v-for="item in scope.row.specification" :key="item.id">
                 <el-col :span="6">{{item.name}}:</el-col>
                 <el-col :span="6">{{item.supply_price}}</el-col>
                 <el-col :span="6">{{item.price}}</el-col>
                 <el-col :span="6">{{item.member_price}}</el-col>
              </el-row>
            </template>
          </el-table-column>
          <el-table-column label="自有商品" width="80">
              <template slot-scope="scope">
                 <span>{{scope.row.status == 1 ? '否': '是' }}</span>
              </template>
          </el-table-column>
          <el-table-column label="排序" prop="sort"  width="80">
          </el-table-column>
          <el-table-column  label="上架状态" width="80">
            <template slot-scope="scope">
              <el-switch v-model="scope.row.forsale" :active-value="1" :inactive-value="0" active-color="#13ce66" inactive-color="#dcdfe6" @change="statusChange(scope.row)" size="small"></el-switch>
            </template>
          </el-table-column>
          <el-table-column prop="add_time" label="修改时间" width="170"></el-table-column>
          <el-table-column label="操作" width="190">
            <template slot-scope="scope">
               <el-button type="primary" size="mini" @click="editBtn(scope.row.iid)">编辑</el-button>
               <el-button type="primary" size="mini" @click="eidtPrice(scope.row)">修改价格</el-button>
               <el-button type="danger" size="mini" @click="deleteBtn(scope.row,scope.$index)">删除</el-button>
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
      <el-dialog :title="goodName+'价格修改'" :visible.sync="dialogPriceVisible" @close="dialogClose">
        <el-table :data="goodData" height="500"  border>
          <el-table-column prop="pName" label="销售方式" ></el-table-column>
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
        </el-table>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogTableVisible = false">取 消</el-button>
          <el-button type="primary" @click="changePrice" v-no-click>确 定</el-button>
        </div>
      </el-dialog>
    </div>
</template>

<script>
// import { mapMutations } from 'vuex'
export default {
  data () {
    return {
      // 商品分类选项
      sortOptions: [],
      // 商品分类
      goodsort: '',
      // 商品分类1
      goodsort1: '',
      // 商品列表
      goodList: [],
      // 供应商
      supplier: '',
      // 供应商选择项
      supplierOptions: [],
      // 上下架
      onstate: '',
      // 上下架选择项
      onstateOptions: [
        {
          label: '上架',
          value: 1
        },
        {
          label: '下架',
          value: 0
        }
      ],
      // 商品类型
      prodtype: '',
      // 商品类型选择项
      prodtypeOptions: [
        {
          label: '自建商品',
          value: '自建商品'
        },
        {
          label: '下载商品',
          value: '下载商品'
        }
      ],
      // 商品种类
      goodtype: '',
      // 商品种类选项
      goodtypeOptions: [
        {
          label: '商品名称',
          value: 2
        },
        {
          label: '商品编号',
          value: 3
        }
      ],
      // 多选数组
      multipleSelection: [],
      // 总条数
      total: 0,
      // 商品查询参数
      queryInfo: {
        keyword: '',
        id: 2,
        supplier: '',
        type: '',
        forsale: '',
        page: 1,
        pagesize: 10,
        shop_id:""
      },
      // 选中的商品
      selectGoods: '',
      // 导出Excel的列表数据
      excelGoodList: [],
      shop:[],
      // 商品价格修改弹框
      dialogPriceVisible:false,
      // 修改商品名称
      goodName: '',
      // 修改商品信息
      goodData: [],
      goodId: ''
    }
  },
  created () {
      this.queryInfo.page = parseInt(this.$route.query.page) ;
    
    this.getGoodList()
    this.getGoodSort()
    this.getSupplier()
    this.getShops()
  },
  methods: {
    // ...mapMutations,
    // 获取商品列表
    async getGoodList () {
        const loading = this.$loading({
          lock: true,
          text: 'Loading',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.1)'
        });
      const { data: res } = await this.$http.post('mapi/Item/shop', this.queryInfo)
      console.log('getgoodlist分类返回值：', res)
      if (res.status !== 1) return this.$message.error(res.msg)
      // this.$message.success('获取商品列表成功！')
      loading.close()
      this.total = res.data.total
      this.goodList = res.data.data
    },
    // 获取商品分类
    async getGoodSort(){
      const { data: res } = await this.$http.get('mapi/ShareCommon/sort')
       if (res.code !== 200) return this.$message.error(res.msg)
       this.sortOptions = res.sort
      //  console.log('getGoodSort',res.sort);
    },
    // 获取供应商
    async getSupplier(){
      const { data: res } = await this.$http.get('mapi/ShareCommon/supplier')
      // console.log(res);
       if (res.code !== 200) return this.$message.error(res.msg)
       this.supplierOptions = res.list
      //  console.log('getSupplier',res.list);
    },
    // 获取店铺列表
    async getShops(){
      const { data: res } = await this.$http.get('mapi/ShareCommon/shop')
      
       if (res.code !== 200) return this.$message.error(res.msg)
       this.shop = res.shop
       console.log('getShops',res.shop);
    },
    async getExcelGoodList () {
      const { data: res } = await this.$http.post('mapi/goodsExcel')
      if (res.status !== 1) return this.$message.error('导出Excel失败！')
      this.$message.success('导出Excel成功！')
      this.excelGoodList = res.data
    },
    searchGood () {
      // console.log(this.queryInfo);
      // if (this.queryInfo.id && this.queryInfo.keyword === '') {
      //   return this.$message.error('请输入搜索的关键字！')
      // }
      // if (this.queryInfo.id =='' && this.queryInfo.keyword != '') {
      //   return this.$message.error('请选择商品搜索类型！')
      // }
      this.getGoodList()
    },
    // 批量（多选）
    handleSelectionChange (val) {
      var goods = ''
      this.multipleSelection = val
      val.forEach(function (value, index, arr) {
        // console.log(value, index, arr)
        goods += value.iid + ','
      })
      this.selectGoods = goods.substring(0, goods.length - 1)
    },
    // 商品上下架状态修改
    async statusChange (row) {
      const { data: res } = await this.$http.post('mapi/Item/goodUpStatus', { id: row.iid, forsale:row.forsale })
      console.log(res)
      if (res.status !== 1) return this.$message.error('商品状态修改失败！')
      this.$message.success('商品状态修改成功！')
    },
    // 分页 一页显示多少条
    handleSizeChange (newSize) {
      console.log('newsize',newSize)
      this.queryInfo.pagesize = newSize
      this.getGoodList()
    },
    // 分页 跳转到多少页
    handleCurrentChange (newPage) {
      this.queryInfo.page = newPage
      this.getGoodList()
    },
    // 商品种类筛选
    goodTypeChange (val) {
      // console.log(val)
      this.queryInfo.id = val
    },
    // 商品分类筛选
    goodSortChange (val) {
      // console.log(val instanceof Array)
      var aSort = ''
      val.forEach(item => {
        aSort += item + ','
      })
      console.log(aSort)
      this.queryInfo.type = aSort
      // this.queryInfo.type = val
      // console.log(this.queryInfo.type instanceof Array)
    },
    // 供应商查询条件
    supplierChange () {},
    // 上下架查询条件
    onStateChange (val) {
      // console.log(val)
      this.queryInfo.status = val
    },
    formatJson (filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]))
    },
    // 导出excel
    export2Excel () {
      this.getExcelGoodList()
      require.ensure([], () => {
        const { exportJsonToExcel } = require('../../../vendor/Export2Excel')
        const tHeader = ['商品id', '商品名称', '商品分类', '商品编号', '助记码', '销售单位', '商品条码', '商品PLU码', '成本价格', '销售价格', '会员价格']
        const filterVal = ['id', 'name', 'type', 'commodity_code', 'mnemonic_code', 'default_sale', 'shop_code', 'plu', 'supply_price', 'price', 'member_price']
        if (this.excelGoodList.length > 0) {
          console.log(this.excelGoodList)
          const exportData = this.excelGoodList
          const data = this.formatJson(filterVal, exportData)
          exportJsonToExcel(tHeader, data, '商品列表' + this.getNowDate(new Date()))
        }
      })
    },
    // 批量上架
    async putaway () {
      if (!this.selectGoods) return this.$message.error('请选择需要上架的商品')
      const { data: res } = await this.$http.post('mapi/Item/goodAllStatus', { id: this.selectGoods, forsale: 1 })
      console.log(res)
      if (res.status !== 1) {
        this.$message.error('批量上架失败！')
        // console.log(arr)
        return false
      }
      this.$message.success('批量上架成功！')
      this.getGoodList()
    },
    // 批量下架
    async soldout () {
      if (!this.selectGoods) return this.$message.error('请选择需要下架的商品')
      const { data: res } = await this.$http.post('mapi/Item/goodAllStatus', { id: this.selectGoods, forsale: 0 })
      if (res.status !== 1) return this.$message.error('批量下架失败！')
      this.$message.success('批量下架成功！')
      this.getGoodList()
    },
    // 添加商品
    addGood () {
      this.$router.push('/addgood')
    },
    // 快速添加商品
    quickAddGood(){
      this.$router.push('/quickaddgood')
    },
    getNowDate (date) {
      return date.getFullYear() + '-' + ((date.getMonth() + 1) > 10 ? (date.getMonth() + 1) : '0' + (date.getMonth() + 1)) + '-' + (date.getDate() > 10 ? date.getDate() : '0' + date.getDate())
    },
    // 编辑商品
    editBtn (id) {
      console.log(this.queryInfo.page)
      localStorage.setItem('goodId', id)
      this.$router.push({
        path:'/goodedit',
        query:{
          page:this.queryInfo.page
        }})
    },
    // 删除商品
    deleteBtn (row, index) {
      this.$confirm('确定删除该商品, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const query = { id: row.iid }
        const { data: res } = await this.$http.post('mapi/merchandise/del', query)
        if (res.status !== 1) return this.$message.error('删除商品失败！')
        this.$message.success('删除成功！')
        // 删除最后一个分页最后一项跳转上一分页
        const totalPage = Math.ceil((this.total - 1) / this.queryInfo.pagesize)
        const currentPage = this.queryInfo.pagenum > totalPage ? totalPage : this.queryInfo.pagenum
        this.queryInfo.pagenum = this.queryInfo.pagenum < 1 ? 1 : currentPage
        this.getGoodList()
      }).catch(() => {
        // this.$message.error('取消删除！')
      })
    },
    // 快速修改价格
    async eidtPrice(row){
      console.log(row);
      this.dialogPriceVisible = true
      this.goodName = row.name
      const { data: res } = await this.$http.get('mapi/alterItemPrice',{ params: { id: row.iid} })
      // console.log(res);
      if(res.code !== 200) return this.$message.error(res.msg)
      this.goodData = res.price
    },
    // 修改价格
    async changePrice(){
       const { data: res } = await this.$http.post('mapi/alterItemPrice',{price:JSON.stringify(this.goodData)})
       console.log(res);
      if(res.code !== 200) return this.$message.error(res.msg)
      this.$message.success('商品价格修改成功！')
      this.dialogPriceVisible = false
      this.getGoodList()
    },
    // 批量删除
    async deleteBatches () {
      // eslint-disable-next-line eqeqeq
      if (this.selectGoods.length == 0) return this.$message.warning('请先选择要删除商品！')
      this.$confirm('确定删除这些商品, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const { data: res } = await this.$http.post('mapi/merchandiseAll/del', { id: this.selectGoods })
        if (res.status !== 1) return this.$message.error('批量删除商品失败！')
        this.$message.success('批量删除商品成功！')
        // 批量删除最后一个分页剩余项跳转上一分页
        const totalPage = Math.ceil((this.total - this.multipleSelection.length) / this.queryInfo.pagesize)
        const currentPage = this.queryInfo.pagenum > totalPage ? totalPage : this.queryInfo.pagenum
        this.queryInfo.pagenum = this.queryInfo.pagenum < 1 ? 1 : currentPage
        this.getGoodList()
      }).catch(() => {
        // this.$message.error('取消删除！')
      })
    },
    dialogClose(){
      this.goodData = []
    },
    // 批量修改商品分类
    async cateChange () {
      // eslint-disable-next-line eqeqeq
      if (this.goodsort1 == '') return this.$message.error('请选择商品分类！')
      // eslint-disable-next-line eqeqeq
      if (this.selectGoods.length == 0) return this.$message.error('请选择需要修改分类的商品！')
      // eslint-disable-next-line camelcase
      const { data: res } = await this.$http.post('mapi/Item/goodAllType', { id: this.selectGoods, cate_id: this.goodsort1 })
      if (res.status !== 1) return this.$message.error('商品分类修改失败！')
      this.$message.success('商品分类修改成功！')
      this.getGoodList()
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
    }
  }
}
</script>

<style scoped lang="less">
.goodsort{
  width:100%;
}
.elrow{
  margin-top:5px;
}
.button {
  width:100%;
}
.table{
  margin-top:5px;
  font-size:14px;
}
.goodimg{
  max-height: 60px;
  display: block;
  margin:0 auto;
}
.el-select{width:130px;margin-right:10px;}
.input-with-select{width:230px;}
.el-button.button{width:100px;}
.goodsort{margin-left:10px;}
.table /deep/ .el-button--mini {
   padding:7px 7px;
}
.searchbtn{padding:0 20px !important;}
.el-pagination{margin-top:10px;}
</style>
