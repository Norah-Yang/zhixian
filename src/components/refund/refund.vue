<template>
  <el-card id="el_card">
    <el-row :gutter="15" style="margin-bottom:10px">
      <el-col :span="3">
        <el-select v-model="value" placeholder="请选择店铺" size="mini">
          <el-option v-for="item in shop" :key="item.id" :label="item.title" :value="item.id"></el-option>
        </el-select>
      </el-col>
      <el-col :span="1.5">
        <el-button type="primary" icon="el-icon-search" @click="search" size="mini">搜索</el-button>
      </el-col>
      <el-col :span="1">
        <el-button type="primary" @click="add" size="mini">新增</el-button>
      </el-col>
    </el-row>
    <el-row>
      <el-col>
        <el-table :data="tableData" border style="width: 100%">
          <el-table-column prop="id" label="ID" width="100"></el-table-column>
          <el-table-column prop="intro" label="退款原因" width="400"></el-table-column>
          <el-table-column prop="shop_id" label="管理站点" width="400"></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button
                type="primary"
                size="mini"
                icon="el-icon-edit"
                @click="edit(scope.$index, scope.row)"
              >编辑</el-button>
              <el-button
                type="danger"
                size="mini"
                icon="el-icon-delete"
                @click="del(scope.$index, scope.row)"
              >删除</el-button>
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
    this.refundSetting();
    this.getShops();
  },
  data() {
    return {
      num: 99,
      shop: [ ],
      input: "",
      value: "",
      tableData: [],
      Page: {
        pagenum: 1,
        pagesize: 10,
        count: 0,
        id: "",
        shop_id: "",
      }
    };
  },
  methods: {
    async refundSetting() {
      const loading = this.$loading({
          lock: true,
          text: 'Loading',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.1)'
        });
      this.$api
        .refundSetting(this.Page)
        .then(res => {
          if (res.data.code == 200) {
            // this.$message.success("查询成功");
            loading.close();
            // this.shop = res.data.shop
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
    // 获取店铺列表
    async getShops() {
      const { data: res } = await this.$http.get("mapi/ShareCommon/shop");
      if (res.code !== 200) return this.$message.error(res.msg);
      this.shop = res.shop;
      console.log("getShops", res.shop);
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
            this.refundSetting();
          }
        })
        .catch(res => {
          console.log(res);
        });
    },
    search() {
      let data ={shop_id:this.value}
      console.log(data)
      Object.assign(this.Page, data);
      console.log(this.Page)
      this.refundSetting();
    },
    add() {
      this.$router.push("./refundAdd");
    },
    edit(i, el) {
      this.$router.push({ path: "./refundAdd", query: { id: el.id } });
    },
    del(i, el) {
      console.log(el.id)
        this.$api
        .refundDelSetting({
          params:{
            id:el.id
          }
         })
        .then(res => {
          if (res.data.code == 200) {
            this.$message.success("删除成功");
            this.refundSetting()
          } else {
            this.$api.error(res.data.msg);
          }
        })
        .catch(res => {
          this.$api.error();
        });
    },
    // 分页
    handleCurrentChange(e) {
      this.Page.pagenum = e;
      this.refundSetting(this.Page);
    },
    // 分页
    handleSizeChange(e) {
      this.Page.pagesize = e;
      this.refundSetting(this.Page);
    }
  }
};
</script>
<style lang="less">
</style>