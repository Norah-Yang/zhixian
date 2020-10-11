<template>
  <div>
    <el-row>
      <el-col :span="24">
        <el-card shadow="always">
            <el-select v-model="Page.type" placeholder="配送类型"  size="mini">
              <el-option v-for="item in list" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
            <el-select v-model="Page.key_id" placeholder="店铺名称"  size="mini">
              <el-option v-for="item in lists" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
            <el-input
              placeholder="请输入内容"
              v-model="Page.keyword"
              clearable
               size="mini"
              class="input-with-select"
            >
              <el-button slot="append" icon="el-icon-search" @click="onserch"></el-button>
            </el-input>
            <el-button type="danger" @click="onclear"  size="mini">清除搜索</el-button>
            <el-button type="primary" @click="onaddmenu()" size="mini">添加</el-button>
          <div class="height"></div>
          <el-table border="" :data="tableData" style="width: 100%" stripe>
            <el-table-column label="店点Id" prop="id"></el-table-column>
            <el-table-column label="店点名称" prop="name"></el-table-column>
            <el-table-column label="使用仓库" prop="storage_name"></el-table-column>
            <el-table-column label="仓库店铺" prop="title"></el-table-column>
            <el-table-column label="店点地址" prop="address"></el-table-column>
            <el-table-column label="联系电话" prop="phone"></el-table-column>
            <el-table-column label="是否快递">
              <template slot-scope="row">
                <el-switch
                  v-model="row.row.express_status"
                  active-color="#008080"
                  inactive-color="#ff4949"
                  active-text="是"
                  inactive-text="否"
                  @change="onswitchexpress(row)"
                ></el-switch>
              </template>
            </el-table-column>
            <el-table-column label="是否自提">
              <template slot-scope="row">
                <el-switch
                  v-model="row.row.pick_status"
                  active-color="#008080"
                  inactive-color="#ff4949"
                  active-text="是"
                  inactive-text="否"
                  @change="onswitchpickLineshop(row)"
                ></el-switch>
              </template>
            </el-table-column>
            <el-table-column label="启用状态">
              <template slot-scope="row">
                <el-switch
                  v-model="row.row.del"
                  active-color="#008080"
                  inactive-color="#ff4949"
                  active-text="是"
                  inactive-text="否"
                  @change="onswitchType(row)"
                ></el-switch>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="180">
              <template slot-scope="row">
                <!-- <el-button size="small" type="primary" @click="onaddClass(row)">添加</el-button> -->
                <el-button size="small" type="info" @click="oneditone(row)" v-no-click>编辑</el-button>
              </template>
            </el-table-column>
          </el-table>
          <div class="height"></div>
          <div class="pagination">
            <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :page-sizes="[10, 12, 15, 20]"
              layout="total, sizes, prev, pager, next, jumper"
              :total="Page.count"
            ></el-pagination>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>
<script>
export default {
  // props:[],
  // 页面加载
  created() {
    this.getweiOrder();
  },
  // 页面加载完成
  mounted() {},
  data() {
    return {
      tableData: [],
      Page: {
        pagenum: 1,
        pagesize: 10,
        count: 0,
        keyword: "",
        type: "",
        key_id: ""
      },
      list: [
        {
          name: "快递点",
          id: 1
        },
        {
          name: "自提点",
          id: 2
        }
      ],
      lists: [
        {
          name: "店点名称",
          id: 1
        },
        {
          name: "店点id",
          id: 2
        }
      ]
    };
  },
  // 方法
  methods: {
    getweiOrder() {
      this.$api
        .getlineshop(this.Page)
        .then(res => {
          if (res.data.code == 200) {
            res.data.list.data.forEach(x => {
              if (x.express_status) {
                x.express_status = true;
              } else {
                x.express_status = false;
              }
              if (x.pick_status) {
                x.pick_status = true;
              } else {
                x.pick_status = false;
              }
              if (x.del) {
                x.del = true;
              } else {
                x.del = false;
              }
            });
            this.tableData = res.data.list.data;
            this.Page.count = res.data.list.total;

            // console.log(res.data);
          } else {
            this.$message.error(res.data.msg);
          }
        })
        .catch(res => {
          this.$message.error("网络错误");
          console.log(res);
        });
    },
    // 分页
    handleCurrentChange(e) {
      this.Page.pagenum = e;
      this.getweiOrder();
    },
    // 分页
    handleSizeChange(e) {
      this.Page.pagesize = e;
      this.getweiOrder();
    },
    // 点击清楚搜索
    onclear() {
      this.Page.pagenum = 1;
      this.Page.pagesize = 10;
      this.Page.keyword = "";
      this.Page.type = "";
      this.Page.key_id = "";
      this.getweiOrder();
    },
    // 点击了搜索
    onserch() {
      this.getweiOrder();
    },
    onaddmenu() {
      this.$router.push("/addlineshop");
    },
    oneditone(row) {
      this.$router.push({
        name: "addlineshop",
        params: {
          id: row.row.id
        }
      });
    },
    onswitchexpress(row) {
      this.$api
        .getexpressageLineshop({
          params:{
            id: row.row.id,
          status: row.row.express_status ? 1 : 0
          }
        })
        .then(res => {
          if (res.data.code == 200) {
            this.$message.success(res.data.msg);
            this.getweiOrder();
          } else {
            this.$message.error(res.data.msg);
          }
        })
        .catch(res => {
          this.$message.error("网络错误");
          console.log(res);
        });
    },
    onswitchpickLineshop(row){
        this.$api
        .getpickLineshop({
          params:{
            id: row.row.id,
          status: row.row.pick_status ? 1 : 0
          }
        })
        .then(res => {
          if (res.data.code == 200) {
            this.$message.success(res.data.msg);
            this.getweiOrder();
          } else {
            this.$message.error(res.data.msg);
          }
        })
        .catch(res => {
          this.$message.error("网络错误");
          console.log(res);
        });
    },
    onswitchType(row){
       this.$api
        .getstatusLineshop({
          params:{
            id: row.row.id,
          status: row.row.del ? 1 : 0
          }
        })
        .then(res => {
          if (res.data.code == 200) {
            this.$message.success(res.data.msg);
            this.getweiOrder();
          } else {
            this.$message.error(res.data.msg);
          }
        })
        .catch(res => {
          this.$message.error("网络错误");
          console.log(res);
        });
    }
    // getupdateLineshop
  },
  // 监听属性
  watch: {},
  // 组件
  component: {},
  // 计算属性
  computed: {}
};
</script>

<style lang="less" scoped>
.input-with-select {
  width: 25%;
  margin-right: 5px;
}
.el-select {
  margin: 0 5px;
}
</style>