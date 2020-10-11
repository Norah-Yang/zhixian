<template>
    <div>
      <!-- 面包屑导航区域 -->
      <!-- <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>您当前所在位置</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>商品管理</el-breadcrumb-item>
        <el-breadcrumb-item>收银机商品</el-breadcrumb-item>
      </el-breadcrumb> -->
      <!-- 卡片视图区域 -->
      <el-card>
        <el-row :gutter="10" class="mb10">
          <el-col :span="2">
              <el-select v-model="queryInfo.shop" placeholder="请选择" @change="shopChange"  size="mini">
                <el-option
                  v-for="item in shopOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
          </el-col>
          <el-col :span="6">
            <el-input placeholder="请输入机器码" v-model="queryInfo.searchVal" size="mini" >
              <el-button slot="append" icon="el-icon-search" @click="searchShop"></el-button>
            </el-input>
          </el-col>
        </el-row>
        <el-row>
          <el-table
              :data="shopList"
              border
              style="width: 100%"  class="mb10">
                <el-table-column
                prop="id"
                label="机器ID(码)"
                width="250">
                </el-table-column>
                <el-table-column prop="shopName" label="店铺"></el-table-column>
                <el-table-column prop="code" label="机器码"></el-table-column>
                <el-table-column prop="addTime" label="创建时间"></el-table-column>
                <el-table-column prop="status" label="状态">
                  <template slot-scope="scope">
                    {{scope.row.status == '1'? '启用': '未启用'}}
                  </template>
                </el-table-column>
                <el-table-column label="指定商品">
                  <template slot-scope="scope">
                    <el-switch v-model="scope.row.shopStatus" active-text="是" inactive-text="否" active-value="1" inactive-value="0"></el-switch>
                  </template>
                </el-table-column>
                <el-table-column label="商品管理">
                  <template slot-scope="scope">
                    <el-button type="primary" size="mini" @click="posGoodCate(scope.row)">分类管理</el-button>
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
  data () {
    return {
      shopOptions: [],
      queryInfo: {
        searchVal: '',
        shop: ''
      },
      shopList: [
        {
          id: 1,
          shopName: '京鱼鲜生',
          code: 'KJKLJLASDF',
          addTime: '2020-05-20 19:20:30',
          status: '1',
          shopStatus: '1'
        },
        {
          id: 2,
          shopName: '中贸鲜生',
          code: 'KLJLSDKFSDF',
          addTime: '2020-04-20 19:20:30',
          status: '1',
          shopStatus: '0'
        },
        {
          id: 3,
          shopName: 'namen鲜生',
          code: 'NAMENXIANSHENG',
          addTime: '2020-05-19 09:20:30',
          status: '0',
          shopStatus: '0'
        }
      ],
      total: 3
    }
  },
  created () {

  },
  methods: {
    // search门店
    searchShop () {},
    // 门店更改
    shopChange () {},
    posGoodCate () {},
    // 分页 一页显示多少条
    handleSizeChange (newSize) {
      this.queryInfo.pagesize = newSize
      // this.getGood()
    },
    // 分页 跳转到多少页
    handleCurrentChange (newPage) {
      console.log('newpage:', newPage)
      this.queryInfo.pagenum = newPage
      // this.getGood()
    }
  }
}
</script>

<style scoped lang="less">
.el-pagination{text-align: right;}
</style>
