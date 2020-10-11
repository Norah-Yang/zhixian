<template>
  <div>
    <el-row>
      <el-col :span="24">
        <el-card shadow="always">
          <el-table border="" :data="tableData" style="width: 100%" stripe>
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column label="订单ID" prop="oid"></el-table-column>
            <el-table-column label="订单号" prop="order_no" width="180"></el-table-column>
            <el-table-column label="订单类型" prop="type">
              <template slot-scope="row">
                <div v-if="row.row.type==0">
                  <el-tag effect="dark">会员充值</el-tag>
                </div>
                <div v-else-if="row.row.type==1">
                  <el-tag type="success" effect="dark">普通商品</el-tag>
                </div>
                <div v-else-if="row.row.type==2">
                  <el-tag type="info" effect="dark">秒杀商品</el-tag>
                </div>
                <div v-else-if="row.row.type==3">
                  <el-tag type="warning" effect="dark">团购商品</el-tag>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="订单状态" prop="pay_state">
              <template slot-scope="row">
                <div v-if="row.row.pay_state==0">未支付</div>
                <div v-else>已支付</div>
              </template>
            </el-table-column>
            <el-table-column label="支付方式" prop="pay_type">
              <template slot-scope="row">
                <div v-if="row.row.pay_state==1">微信支付</div>
                <div v-else>余额</div>
              </template>
            </el-table-column>
            <el-table-column label="发货方式" prop="send_type">
              <!-- <template slot-scope="row">
                <el-switch
                  v-model="row.row.value"
                  active-color="#008080"
                  inactive-color="#ff4949"
                  active-text="是"
                  inactive-text="否"
                  @change="onswitchType(row)"
                ></el-switch>
              </template>-->
            </el-table-column>
            <el-table-column label="下单时间" prop="add_time" width="180">
              <template slot-scope="row">
                {{row.row.add_time}}
                <!-- <div>{{1589872226|datefmt("YYYY-MM-DD HH:mm:ss")}}</div> -->
              </template>
            </el-table-column>
            <el-table-column label="买家姓名" prop="user_name"></el-table-column>
            <el-table-column label="买家手机" prop="phone"></el-table-column>
            <el-table-column label="实收金额" prop="money"></el-table-column>
            <el-table-column label="来源渠道" prop="sources"></el-table-column>
            <el-table-column label="操作" width="180">
              <template slot-scope="row">
                <!-- <el-button size="small" type="primary" @click="onaddClass(row)">添加</el-button> -->
                <el-button size="mini" type="info" @click="oneditone(row)" v-no-click>编辑</el-button>
                <el-button size="mini" type="danger" @click="ondelGoods(row)" v-no-click>删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <div class="height"></div>
          <div class="pagination">
            <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :page-sizes="[7, 12, 15, 20]"
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
   components: {},
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
        count: 0
      }
    };
  },
  // 方法
  methods: {
   async getweiOrder() {
     const loading = this.$loading({
          lock: true,
          text: 'Loading',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.1)'
        });
      this.$api
        .getweiOrder(this.Page)
        .then(res => {
          if (res.data.code == 200) {
            // this.$message.success(res.data.msg);
            loading.close();
            this.tableData = res.data.list;
            this.Page.count = res.data.count;

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