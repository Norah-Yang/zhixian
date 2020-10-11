<template>
    <div>
      <!-- 面包屑导航区域 -->
      <!-- <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>您当前所在位置</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>商品管理</el-breadcrumb-item>
        <el-breadcrumb-item>商品回收站</el-breadcrumb-item>
      </el-breadcrumb> -->
      <!-- 卡片视图区域 -->
      <el-card>
        <el-row :gutter="10"  class="mb10">
          <el-col :span="3">
            <el-select v-model="goodsort"  placeholder="商品分类" class="goodsort" @change="goodSortChange" size="mini">
              <el-option
                v-for="item in sortOptions"
                :key="item.id"
                :label="item.title"
                :value="item.id">
              </el-option>
            </el-select>
          </el-col>
          <el-col :span="3">
             <el-select v-model="searchcondition"  placeholder="商品名称" class="goodsort" @change="goodcondition"  size="mini">
              <el-option
                v-for="item in condOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-col>
          <el-col :span="5">
            <el-input placeholder="请在这里输入搜索内容" v-model="queryInfo.keyword" class="input-with-select"  size="mini">
              <el-button slot="append" icon="el-icon-search" @click="searchGood"></el-button>
            </el-input>
          </el-col>
        </el-row>
        <el-row class="mb10">
          <el-col :span="2">
            <el-button type="primary" @click="massReduction"  size="mini">批量还原 <i class="el-icon-refresh-left"></i></el-button>
          </el-col>
        </el-row>
        <el-row>
          <el-table :data="goodList" height="580" border style="width: 100%" class="table" @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column prop="id" label="商品Id" ></el-table-column>
          <el-table-column prop="name" label="商品名称" ></el-table-column>
          <el-table-column  label="商品图片">
            <template slot-scope="scope">
              <img :src="scope.row.thumb" alt="" width="60" class="goodimg">
            </template>
          </el-table-column>
          <el-table-column prop="type" label="商品分类" ></el-table-column>
          <el-table-column prop="commodity_code" label="商品编号"></el-table-column>
          <el-table-column prop="specification" label="价格" width="250" >
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
          <el-table-column  label="商品状态">
            <template slot-scope="scope">
              <div>
                {{ scope.row.forsale == '1'? '上架': '下架'}}
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="add_time" label="时间" width="170"></el-table-column>
          <el-table-column label="操作" width="80">
            <template slot-scope="scope">
               <el-button type="primary" round size="mini" @click="backGoodList(scope.row, scope.$index)">还原</el-button>
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
        </el-row>
      </el-card>
    </div>
</template>

<script>
export default {
  name: 'recycle',
  data () {
    return {
      // 搜索商品条件
      queryInfo: {
        // eslint-disable-next-line camelcase
        cate_id: '',
        id: '',
        keyword: '',
        pagenum: 1,
        pagesize: 10
      },
      // 商品分类
      goodsort: '',
      // 商品分类选项
      sortOptions: [],
      // 商品查询条件
      searchcondition: '2',
      condOptions: [
        {
          label: '商品id',
          value: '1'
        },
        {
          label: '商品名称',
          value: '2'
        },
        {
          label: '商品编码',
          value: '3'
        }
      ],
      // 商品列表
      goodList: [],
      // 商品列表总条数
      total: 0,
      // 批量多选
      multipleSelection: '',
      // 批量选择的商品id
      selectGoods: ''
    }
  },
  created () {
    this.getGoodInfo()
    this.getGoodSort()
  },
  methods: {
    // 获取回收站商品列表
    async getGoodInfo () {
      const loading = this.$loading({
          lock: true,
          text: 'Loading',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.1)'
        });
      const { data: res } = await this.$http.post('mapi/merchandise/recycleBin', this.queryInfo)
      if (res.status !== 1) return this.$message.error(res.msg)
      loading.close()
      this.goodList = res.data
      this.total = res.count
    },
    async getGoodSort(){
      const { data: res } = await this.$http.get('mapi/ShareCommon/sort')
      console.log('getGoodSort',res);
      if (res.code !== 200) return this.$message.error(res.msg)
      this.sortOptions = res.sort
    },
    // 商品分类更改
    goodSortChange (val) {
      console.log(val)

      // eslint-disable-next-line camelcase
      this.queryInfo.cate_id = val
    },
    // 商品查询条件更改
    goodcondition (val) {
      console.log(val)
      this.queryInfo.id = val
    },
    // 点击搜索商品
    searchGood () {
      this.getGoodInfo()
    },
    // 分页 一页显示多少条
    handleSizeChange (newSize) {
      this.queryInfo.pagesize = newSize
      this.getGoodInfo()
    },
    // 分页 跳转到多少页
    handleCurrentChange (newPage) {
      this.queryInfo.pagenum = newPage
      this.getGoodInfo()
    },
    // 单个还原到商品列表
    async backGoodList (row, index) {
      const { data: res } = await this.$http.post('mapi/merchandise/restore', { id: row.id })
      if (res.status !== 1) return this.$message.error('还原失败！')
      this.$message.success('还原成功！')
      const totalPage = Math.ceil((this.total - 1) / this.queryInfo.pagesize)
      const currentPage = this.queryInfo.pagenum > totalPage ? totalPage : this.queryInfo.pagenum
      this.queryInfo.pagenum = this.queryInfo.pagenum < 1 ? 1 : currentPage
      this.getGoodInfo()
    },
    // 批量（多选）
    handleSelectionChange (val) {
      // console.log(val)
      var goods = ''
      this.multipleSelection = val
      val.forEach(function (value, index, arr) {
        // console.log(value, index, arr)
        goods += value.id + ','
      })
      this.selectGoods = goods.substring(0, goods.length - 1)
      console.log(this.selectGoods)
    },
    // 批量还原
    async massReduction () {
      // eslint-disable-next-line eqeqeq
      if (this.selectGoods == '') return this.$message.warning('请先选择商品！')
      const { data: res } = await this.$http.post('mapi/merchandise/allRestore ', { id: this.selectGoods })
      console.log(res)

      if (res.status !== 1) return this.$message.error('批量还原失败！')
      this.$message.success('批量还原成功！')
      // 批量还原最后一个分页剩余项跳转上一分页
      const totalPage = Math.ceil((this.total - this.multipleSelection.length) / this.queryInfo.pagesize)
      const currentPage = this.queryInfo.pagenum > totalPage ? totalPage : this.queryInfo.pagenum
      this.queryInfo.pagenum = this.queryInfo.pagenum < 1 ? 1 : currentPage
      this.getGoodInfo()
    }
  }
}
</script>

<style scoped lang="less">
.el-pagination{margin-top:10px;text-align:right;}
</style>
