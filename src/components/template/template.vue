<template>
  <el-card id="el_card">
    <el-row :gutter="15" style="margin-bottom:10px">
      <el-col :span="3">
        <el-select v-model="value" placeholder="请选择启用状态" size="mini">
          <el-option v-for="item in options" :key="item.value" :label="item.title" :value="item.id"></el-option>
        </el-select>
      </el-col>
      <el-col :span="3">
        <el-select v-model="value1" placeholder="请选择"  size="mini">
          <el-option v-for="item in options1" :key="item.value" :label="item.title" :value="item.id"></el-option>
        </el-select>
      </el-col>
      <el-col :span="6">
        <el-input placeholder="请在这里输入搜索内容" v-model="input" clearable  size="mini"></el-input>
      </el-col>
      <el-col :span="1.5">
        <el-button type="primary" icon="el-icon-search" @click="search"  size="mini">搜索</el-button>
      </el-col>
      <el-col :span="1">
        <el-button type="primary" @click="add"  size="mini">新增</el-button>
      </el-col>
    </el-row>
    <el-row>
      <el-col>
        <el-table :data="tableData" border style="width: 100%">
          <el-table-column prop="id" label="模板编号" width="300"></el-table-column>
          <el-table-column prop="title" label="模板名称" width="500"></el-table-column>
          <el-table-column prop="phone" label="创建时间" width="500"></el-table-column>
          <el-table-column label="模板状态" prop="status" width="300">
            <template slot-scope="row">
              <el-switch
                v-model="row.row.status"
                active-color="#008080"
                inactive-color="#ff4949"
                active-text="是"
                inactive-text="否"
                disabled
                @change="onswitchType(row)"
              ></el-switch>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="220">
            <template slot-scope="scope">
              <el-button
                type="danger"
                size="mini"
                @click="edit(scope.$index, scope.row)"
              >编辑</el-button>
              <el-button
                type="primary"
                size="mini"
                @click="typeList(scope.$index, scope.row)"
              >收款方式</el-button>
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
        { value: 1, title: "启用",id:1 },
        { value: 2, title: "禁用",id:2}
      ],
      options1: [
        { value: 1, title: "模板ID",id:1 },
        { value: 2, title: "模板名称",id:2}
      ],
      input: "",
      value: "",
      value1: "",
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
    async  getmachine() {
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
            loading.close();
            // this.$message.success("查询成功");
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
      data = {type:this.value,type1:this.value1,input: this.input};
      Object.assign(this.Page, data);
      console.log(this.Page)
      // this.getmachine();
    },
    add() {
      this.$router.push("./templateAdd");
    },
    edit(i, el) {
      this.$router.push({ path: "./templateAdd", query: { id: el.id } });
    },
    typeList(i, el) {
      console.log(el)
      this.$router.push({ path: "./templateType", query: { id: el.id ,head:el.title} });
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