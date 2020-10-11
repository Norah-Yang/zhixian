<template>
  <div>
    <el-row>
      <el-col :span="24">
        <el-card shadow="always">
          <el-button type="primary" @click="onaddmenu()">添加</el-button>
          <div class="height"></div>
          <el-table border="" :data="tableData" style="width: 100%" stripe>
            <el-table-column label="微信模板名称" prop="title"></el-table-column>
            <el-table-column label="行业" prop="industry"></el-table-column>
            <el-table-column label="模板ID" prop="number_id">
              <!-- <template slot-scope="row">
                        <el-input v-model="row.row.number_id" @blur="oninputblur(row)"></el-input>
              </template>-->
            </el-table-column>
            <el-table-column label="自定义描述" prop="describe">
              <template slot-scope="row">
                <el-input v-model="row.row.describe" @blur="oninputblur(row)"></el-input>
              </template>
            </el-table-column>
            <el-table-column label="自定义链接" prop="url">
              <template slot-scope="row">
                <el-input v-model="row.row.url" @blur="oninputblur(row)"></el-input>
              </template>
            </el-table-column>
            <el-table-column label="使用场景" prop="send_type">
              <template slot-scope="row">
                <div style="color:#CC0000">{{row.row.scene}}</div>
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
        pagesize:10,
        count: 0,
        merchant_id: ""
      }
    };
  },
  // 方法
  methods: {
    getweiOrder() {
      this.$api
        .gettemplatev({
          params:this.Page
        })
        .then(res => {
          if (res.data.code == 200) {
            this.tableData = res.data.data;
            this.Page.count = res.data.count;
            this.Page.merchant_id = res.data.merchant_id;

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
    oninputblur(row) {
      console.log(row);

      this.$api
        .geteditTemplate({
          describe: row.row.describe,
          url: row.row.url,
          tid: row.row.id
        })
        .then(res => {
          if (res.data.code == 200) {
            this.Page.pagenum = 1;
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
    onaddmenu() {
      if (!this.Page.merchant_id) return;
      this.$api
        .getgetTemplate({
          merchant_id: this.Page.merchant_id
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
</style>