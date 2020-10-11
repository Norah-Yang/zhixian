<template>
  <el-card id="el_card" >
  <div v-if='send_type == 0'>
    <el-row :gutter="15" style="margin-bottom:10px">
      <el-col :span="3">
        <el-select v-model="value" placeholder="请选择">
          <el-option v-for="item in options" :key="item.value" :label="item.title" :value="item.id"></el-option>
        </el-select>
      </el-col>
      <el-col :span="6">
        <el-input placeholder="请在这里输入搜索内容" v-model="input" clearable></el-input>
      </el-col>
      <el-col :span="1.5">
        <el-button type="primary" icon="el-icon-search" @click="search">搜索</el-button>
      </el-col>
    </el-row>
    <el-row>
      <el-col>
        <el-table :data="tableData" border style="width: 100%">
          <el-table-column prop="id" label="交易ID" width="310"></el-table-column>
          <el-table-column prop="title" label="产品名称" width="400"></el-table-column>
          <el-table-column prop="serial_number" label="消费金额" width="300"></el-table-column>
          <el-table-column prop="intro" label="短信条数" width="400"></el-table-column>
          <el-table-column prop="address" label="时间" width="400"></el-table-column>
        </el-table>
      </el-col>
    </el-row>
    <el-row style="margin-top:50px">
      <el-col>
        <div class="pagination">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :page-sizes="[7, 12, 15, 20]"
            layout="total, sizes, prev, pager, next, jumper"
            :total="Page.count"
          ></el-pagination>
        </div>
      </el-col>
    </el-row>
  </div>
    <div v-if='send_type == 1'>
    <el-row :gutter="15" style="margin-bottom:10px">
      <el-col :span="6">
        <el-input placeholder="请在这里输入手机号" v-model="input" clearable></el-input>
      </el-col>
      <el-col :span="1.5">
        <el-button type="primary" icon="el-icon-search" @click="search">搜索</el-button>
      </el-col>
    </el-row>
    <el-row>
      <el-col>
        <el-table :data="tableData" border style="width: 100%">
          <el-table-column prop="id" label="批次号" width="200"></el-table-column>
          <el-table-column prop="title" label="手机号" width="300"></el-table-column>
          <el-table-column prop="address" label="归属地" width="300"></el-table-column>
          <el-table-column prop="intro" label="运营商" width="400"></el-table-column>
          <el-table-column prop="address" label="发送内容" width="310"></el-table-column>
          <el-table-column prop="address" label="接收时间" width="300"></el-table-column>
        </el-table>
      </el-col>
    </el-row>
    <el-row style="margin-top:50px">
      <el-col>
        <div class="pagination">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :page-sizes="[7, 12, 15, 20]"
            layout="total, sizes, prev, pager, next, jumper"
            :total="Page.count"
          ></el-pagination>
        </div>
      </el-col>
    </el-row>
  </div>
  </el-card>
  
</template>

<script>
export default {
  created() {
      console.log(this.$route.query)
      this.send_type = this.$route.query.send_type
      this.getmachine();
  },
  data() {
    return {
      send_type:0,
      options: [
        { value: 1, title: "验证短信",id:1 },
        { value: 2, title: "营销短信",id:2}
      ],
      input: "",
      value: "",
      tableData: [],
      Page: {
        pagenum: 1,
        pagesize: 10,
        count: 0,
        id: "",
        shop_id: "",
        keyword: "",
        key_id:""
      }
    };
  },
  methods: {
    getmachine() {
        console.log(this.send_type)
      this.$api
        .storeManagementList(this.Page)
        .then(res => {
          if (res.data.code == 200) {
            this.$message.success("查询成功");
            this.tableData = res.data.list.data;
            this.Page.count = res.data.list.total;
          } else {
            this.$api.error(res.data.msg);
          }
        })
        .catch(res => {
          console.log(res);

          this.$api.error();
        });
    },
    search() {
      var data = {};
      if(this.value == 1){
        data = {key_id:this.value,id: this.input};
      }else if(this.value == 2){
        data = {key_id:this.value,keyword: this.input };
      }
      console.log(data)
      Object.assign(this.Page, data);
      this.getmachine();
    },
    // 分页
    handleCurrentChange(e) {
      this.Page.pagenum = e;
      this.getmachine(this.Page);
    },
    // 分页
    handleSizeChange(e) {
      this.Page.pagesize = e;
      this.getmachine(this.Page);
    }
  }
};
</script>
<style lang="less">
</style>