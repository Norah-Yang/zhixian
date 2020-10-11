<template>
  <el-card id="el_card">
    <!-- <el-row>
      <el-collapse class="mb10">
        <el-collapse-item title="操作提示" name="1">
          <div>· 您还可以添加{{num}}个收银机！</div>
        </el-collapse-item>
      </el-collapse>
    </el-row> -->
    <el-row :gutter="15" style="margin-bottom:10px">
      <el-col :span="3">
        <el-select v-model="value" placeholder="请选择"  size="mini">
          <el-option v-for="item in options" :key="item.value" :label="item.title" :value="item.id"></el-option>
        </el-select>
      </el-col>
      <el-col :span="6">
        <el-input placeholder="请在这里输入搜索内容" v-model="input" clearable  size="mini"></el-input>
      </el-col>
      <el-col :span="1.5">
        <el-button type="primary" icon="el-icon-search" @click="search"  size="mini">搜索</el-button>
      </el-col>
      <el-col :span="1">
        <el-button type="primary" @click="add" size="mini">新增</el-button>
      </el-col>
    </el-row>
    <el-row>
      <el-col>
        <el-table :data="tableData" border style="width: 100%">
          <el-table-column prop="id" label="店铺ID" ></el-table-column>
          <el-table-column prop="title" label="店铺名称" ></el-table-column>
          <el-table-column prop="serial_number" label="序列号" ></el-table-column>
          <el-table-column prop="intro" label="店铺介绍"></el-table-column>
          <el-table-column prop="address" label="店铺地址"></el-table-column>
          <el-table-column prop="phone" label="联系电话"></el-table-column>
          <el-table-column label="启用状态" prop="status">
            <template slot-scope="row">
              <el-switch
                v-model="row.row.status"
                active-color="#008080"
                inactive-color="#ff4949"
                active-text="是"
                inactive-text="否"
                @change="onswitchType(row)"
              ></el-switch>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button
                type="primary"
                size="mini"
                icon="el-icon-edit"
                @click="edit(scope.$index, scope.row)"
              >编辑</el-button>
            </template>
          </el-table-column>
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
  </el-card>
</template>

<script>
export default {
  created() {
    this.getmachine();
  },
  data() {
    return {
      num: 99,
      options: [
        { value: 1, title: "店铺ID",id:1 },
        { value: 2, title: "门店名称",id:2}
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
    async getmachine() {
      const loading = this.$loading({
          lock: true,
          text: 'Loading',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.1)'
        });
      this.$api
        .storeManagementList(this.Page)
        .then(res => {
          if (res.data.code == 200) {
            // this.$message.success("查询成功");
            loading.close();
            res.data.list.data.forEach(x => {
              if (x.status == "1") {
                x.status = true;
              } else {
                x.status = false;
              }
            });
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
    // 修改状态
    onswitchType(row, e) {
      let type = null;
      if (row.row.status) {
        type = "1";
      } else {
        type = "0";
      }
      this.$api
        .changeType({
          params: {
            id: row.row.id,
            status: type
          }
        })
        .then(res => {
          console.log(res);
          if (res.data.code == 200) {
            this.$message.success(res.data.msg);
            this.getmachine();
          }
        })
        .catch(res => {
          console.log(res);
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
    add() {
      this.$router.push("./settingsAdd");
    },
    edit(i, el) {
      this.$router.push({ path: "./settingsAdd", query: { id: el.id } });
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