<template>
    <div>
      <!-- 面包屑导航区域 -->
      <!-- <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>您当前所在位置</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>商品管理</el-breadcrumb-item>
        <el-breadcrumb-item>商品分类</el-breadcrumb-item>
      </el-breadcrumb> -->
      <!-- 卡片视图区域 -->
      <el-card>
        <el-row :gutter="20">
          <el-col :span="3">
            <el-select v-model="statusValue" placeholder="启用状态" @change="statusValueChange" size="mini">
              <el-option
                v-for="item in statusOptions"
                :key="item.label"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-col>
           <el-col :span="3">
            <el-select v-model="getListParams.id" placeholder="请选择" size="mini">
              <el-option
                v-for="item in cateOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-col>
               <el-col :span="3">
            <el-select v-model="getListParams.shop" placeholder="请选择" size="mini">
              <el-option
                v-for="item in shop"
                :key="item.id"
                :label="item.title"
                :value="item.id">
              </el-option>
            </el-select>
          </el-col>
          <el-col :span="5">
            <el-input placeholder="请在这里输入搜索内容" v-model="getListParams.keyword" class="input-with-select" size="mini">
              <el-button slot="append" icon="el-icon-search" @click="searchCate"></el-button>
            </el-input>
          </el-col>
        </el-row>
        <el-row :gutter="20" class="martop">
          <el-col>
            <el-button type="primary" @click="addClassify" size="mini">+新增</el-button>
          </el-col>
        </el-row>
        <el-table :data="tableData" border style="width: 100%">
          <el-table-column prop="id" label="分类Id" width="180"></el-table-column>
          <el-table-column prop="title" label="分类名称" width="180"></el-table-column>
          <el-table-column prop="shop_name" label="所属店铺" ></el-table-column>
          <el-table-column prop="content" label="分类介绍"></el-table-column>
          <el-table-column  label="分类图标">
            <template slot-scope="scope">
              <p v-if="!scope.row.thumb">无图</p>
              <img v-else :src="scope.row.thumb" alt="" class="classify_img">
            </template>
          </el-table-column>
          <el-table-column  label="是否启用">
            <template slot-scope="scope">
              <el-switch v-model="scope.row.del" :active-value="0" :inactive-value="1"  @change="statusChange(scope.row)"></el-switch>
            </template>
          </el-table-column>
          <el-table-column prop="sort" label="排序" sortable></el-table-column>
          <el-table-column label="操作" width="100">
            <template slot-scope="scope">
               <el-button type="primary" size="mini" @click="editBtn(scope.row.id)">编辑</el-button>
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
      // select 禁用/启用
      statusValue: 1,
      currentPage: 1,
      // select分类
      cateValue: '分类Id',
      shop:[],
      // select 禁用/启用 options
      statusOptions: [
        {
          label: '启用',
          value: 1
        },
        {
          label: '禁用',
          value: 0
        }
      ],
      // select 分类 options
      cateOptions: [
        {
          label: '分类Id',
          value: 1
        },
        {
          label: '分类名称',
          value: 2
        }
      ],
      // 输入的搜索内容
      inputValue: '',
      tableData: [],
      getListParams: {
        status: 1,
        id: 1,
        keyword: '',
        shop:''
      }
    }
  },
  created () {
    this.getSortList()
  },
  mounted () {

  },
  methods: {
    async getSortList () {
      const loading = this.$loading({
          lock: true,
          text: 'Loading',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.1)'
        });
      const { data: res } = await this.$http.post('mapi/Item/sort', this.getListParams)
      this.shop=res.shop
      if (res.status !== 1) return this.$message.error('获取商品分类失败！')
      // this.$message.success('获取商品分类成功！')
      loading.close()
      this.tableData = res.sort
      // console.log(this.tableData)
    },
    editBtn (id) {
      const url = '/classifyedit'
      console.log(url)
      this.$router.push({
        path: url,
        query: {pathname: this.$route.path,id: id}
      })
    },
    async statusChange (row) {
      console.log(row)
      const queryObj = {
        id: row.id,
        status: row.del
      }
      const { data: res } = await this.$http.post('mapi/Item/sortDisplay', queryObj)
      // console.log(res)
      if (res.status !== 1) return this.$message.error('修改状态失败！')
      this.$message.success('修改状态成功！')
      this.getSortList()
    },
    // // 禁用/启用更改
    statusValueChange () {
      // console.log(this.statusValue)
      this.getListParams.status = this.statusValue
      this.getSortList()
    },
    // // 分类选择更改
    // cateValueChange () {
    //   console.log(this.cateValue)
    //   this.getListParams.id = this.cateValue
    //   this.getSortList()
    // },
    searchCate () {
      this.getSortList()
    },
    // 新增分类
    addClassify () {
      this.$router.push('addsort')
    }
  }
}
</script>

<style scoped lang="less">
.martop {
  margin-top:5px;
}
.el-table {
  margin-top:5px;
}
.classify_img{
  width:30px;
  height: 30px;
}
</style>
