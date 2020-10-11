<template>
    <el-card id="el_card">
        <el-row>
            <el-collapse class="mb10">
                <el-collapse-item title="操作提示" name="1">
                    <div>· 您还可以添加{{num}}个收银机！</div>
                </el-collapse-item>
            </el-collapse>
        </el-row>
        <el-row :gutter="5" style="margin-bottom:10px">
            <el-col :span="3">
                <el-select v-model="value" placeholder="请选择门店" size="mini">
                    <el-option
                        v-for="item in options"
                        :key="item.id"
                        :label="item.title"
                        :value="item.id"
                    ></el-option>
                </el-select>
            </el-col>
            <el-col :span="6">
                <el-input placeholder="请在这里输入机器码" v-model="input" clearable size="mini"></el-input>
            </el-col>
            <el-col :span="5">
                <el-button type="primary" icon="el-icon-search" @click="search" size="mini">搜索</el-button>
            </el-col>
        </el-row>
        <el-row>
            <el-col>
                <el-table :data="tableData" border="" style="width: 100%">
                    <el-table-column prop="machine" label="机器ID(码)" width="200"></el-table-column>
                    <el-table-column prop="title" label="店铺" width="250"></el-table-column>
                    <el-table-column prop="machine_code" label="机器码" width="300"></el-table-column>
                    <el-table-column prop="add_time" label="创建时间" width="300"></el-table-column>
                    <el-table-column :formatter="stateFormat" prop="type" label="状态" width="300"></el-table-column>
                    <el-table-column label="收银吧激活">
                        <template slot-scope="scope">
                            <el-button
                                type="primary"
                                size="mini"
                                icon="el-icon-message-solid"
                                @click="activation(scope.$index, scope.row)"
                            >激活</el-button>
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
    this.getShops()
  },
  data() {
    return {
      num: 99,
      options: [],
      input: "",
      value: "",
      tableData: [],
      Page: {
        pagenum: 1,
        pagesize: 10,
        count: 0,
        id: "",
        shop_id: "",
        machine: ""
      }
    };
  },
  methods: {
    async getmachine() {
      const loading = this.$loading({
        lock: true,
        text: "Loading",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.1)"
      });
      this.$api
        .machineList(this.Page)
        .then(res => {
          let i = res.data;
          console.log(i.list.data);
          i.code == 200
            ? // this.$message.success("查询成功"),
              (loading.close(),
            //   (this.options = i.shop),
              (this.tableData = i.list.data),
              (this.Page.count = i.list.total),
              (this.Page.pagenum = i.list.current_page))
            : this.$api.error(res.data.msg);
        })
        .catch(res => {
          this.$api.error();
        });
    },
    // 获取店铺列表
    async getShops() {
      const { data: res } = await this.$http.get("mapi/ShareCommon/shop");
      if (res.code !== 200) return this.$message.error(res.msg);
      this.options = res.shop;
      console.log("getShops", res.shop);
    },
    stateFormat(row, column) {
      console.log(row);
      if (row.type == 1) {
        return "开启";
      } else {
        return "关闭 ";
      }
    },
    search() {
      let data = { shop_id: this.value, machine: this.input };
      Object.assign(this.Page, data);
      this.getmachine();
    },
    activation(i, el) {
      Object.assign(this.Page, {
        machine: el.machine,
        shop_id: el.id,
        id: el.id
      });
      this.$api
        .machineEdit(this.Page)
        .then(res => {
          res.data.code == 200
            ? ((this.tableData = res.data.tableData), this.getmachine())
            : this.$api.error(res.data.msg);
        })
        .catch(res => {
          this.$api.error();
        });
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