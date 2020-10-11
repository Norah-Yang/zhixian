<template>
  <div>
    <el-row>
      <el-col :span="24">
        <el-card shadow="always">
          <el-row>
            <el-col>
              <el-button type="primary" @click="addseckill" v-no-click>添加</el-button>
                <el-select v-model="Page.shop_id" placeholder="店铺" style="margin-left:10px" @change="onselect">
                <el-option
                  v-for="item in shop"
                  :key="item.id"
                  :label="item.title"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-col>
          </el-row>
          <div class="height"></div>
          <el-table border="" :data="tableData" style="width: 100%" stripe>
            <el-table-column label="活动Id" prop="id" width="180"></el-table-column>
            <el-table-column label="商品ID" prop="goods_id"></el-table-column>
            <el-table-column label="商品名称" prop="name">
              <!-- <template slot-scope="row">
                <div v-if="row.row.pay_state==0">未支付</div>
                <div v-else>已支付</div>
              </template>-->
            </el-table-column>
            <!-- <el-table-column label="支付方式" prop="pay_type">
              <template slot-scope="row">
                <div v-if="row.row.pay_state==1">微信支付</div>
                <div v-else>余额</div>
              </template>
            </el-table-column>-->

            <!-- <el-table-column label="发货方式" prop="send_type"> -->
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
            <!-- </el-table-column> -->
            <el-table-column label="秒杀价格" prop="price"></el-table-column>
            <el-table-column label="秒杀库存" prop="inventory"></el-table-column>
            <el-table-column label="限购次数" prop="limit_num"></el-table-column>
            <el-table-column label="开始时间" prop="start_time" width="180"></el-table-column>
            <el-table-column label="结束时间" prop="end_time" width="180"></el-table-column>
            <el-table-column label="首页推荐" prop="hot" width="180">
              <template slot-scope="row">
                <el-switch
                  v-model="row.row.hot"
                  active-color="#008080"
                  inactive-color="#ff4949"
                  active-text="推荐"
                  inactive-text="不推荐"
                  @change="onchange(row)"
                ></el-switch>
              </template>
            </el-table-column>
            <el-table-column label="上架状态" prop="forsale" >
              <template slot-scope="row">
                <el-switch
                  v-model="row.row.forsale"
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
                <el-button size="small" type="primary" @click="oneditone(row)" v-no-click>修改</el-button>
                <el-button size="small" type="danger" @click="ondelGoods(row)" v-no-click>删除</el-button>
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
    <!-- <li :index="name" class="li"></li> -->
  </div>
</template>
<script>
export default {
  // props:[],
  // 页面加载
  created() {
    this.getshops()
  },
  // 页面加载完成
  mounted() {},
  data() {
    return {
      shop:[],
      tableData: [],
      Page: {
        pagenum: 1,
        pagesize: 10,
        count: 0,
        forsale: "",
        id: "",
        type: "",
        keyword: "",
        shop_id:""
      }
    };
  },
  // 方法
  methods: {
     async getshops(){
       const loading = this.$loading({
          lock: true,
          text: 'Loading',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.1)'
        });
         this.$api
        .getshops({}).then(res => {
          if (res.data.code == 200) {
            this.shop=res.data.shop
            if(res.data.shop.length>0){
            this.Page.shop_id=res.data.shop[0].id
            }
            loading.close();

             this.getgoodsSeckill();

          } else {
            this.$message.error(res.data.msg);
          }
        })
        .catch(res => {
          this.$api.error();
          console.log(res);
        });
    },
    getgoodsSeckill() {
      this.$api
        .getwxseckillList(this.Page)
        .then(res => {
          if (res.data.code == 200) {
            this.tableData = res.data.list;
            this.Page.count = res.data.count;
            console.log(res.data);
            this.tableData.forEach(x => {
              if (x.forsale == "1") {
                x.forsale = true;
              } else {
                x.forsale = false;
              }
              if (x.hot == "1") {
                x.hot = true;
              } else {
                x.hot = false;
              }
            });
          } else {
            this.$message.error(res.data.msg);
          }
        })
        .catch(res => {
          this.$message.error("网络错误");
          console.log(res);
        });
    },
    // 切换表格上线状态
    onswitchType(row) {
          this.$api
        .getwxforsaleSeckill({
         params:{forsale:row.row.forsale?1:0,
          id:row.row.id
         } 
        })
        .then(res => {
          if (res.data.code == 200) {
                    this.getgoodsSeckill();
            this.$message.success(res.data.msg);
          } else {
            this.$message.error(res.data.msg);
          }
        })
        .catch(res => {
          this.$message.error("网络错误");
          console.log(res);
        });
    },
    onchange(row){
 this.$api
        .getwxhotSeckill({
         params:{hot:row.row.hot?1:0,
          id:row.row.id
         } 
        })
        .then(res => {
          if (res.data.code == 200) {
                    this.getgoodsSeckill();
            this.$message.success(res.data.msg);
          } else {
            this.$message.error(res.data.msg);
          }
        })
        .catch(res => {
          this.$message.error("网络错误");
          console.log(res);
        });
    },
    // 页数
    handleSizeChange(e) {
      this.Page.pagesize = e;
      this.getgoodsSeckill();
    },
    handleCurrentChange() {
      this.Page.pagenum = e;
      this.getgoodsSeckill();
    },
    // 跳转到添加页面
    addseckill() {
      this.$router.push({
        name:"addseckill",
        params:{
          shop_id:this.Page.shop_id
        }
      });
    },
    oneditone(row){
      this.$router.push({name:"addseckill", params:{
            id:row.row.id
          }})
    },
    onselect(){
        this.Page.pagenum=1;
        this.Page.pagesize=10;
        this.getgoodsSeckill()
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