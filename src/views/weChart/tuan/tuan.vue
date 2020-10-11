<template>
    <div>
      <el-card shadow="always">
        <el-row>
            <el-col :span="20">
                <el-select v-model="Page.forsale" placeholder="上架状态" clearable size="mini">
                    <el-option
                        v-for="item in tuan.selectForsale"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id"
                    ></el-option>
                </el-select>
                <el-select v-model="Page.type" placeholder="图类型" size="mini">
                    <el-option
                        v-for="item in tuan.selectType"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id"
                    ></el-option>
                </el-select>
                <el-select v-model="Page.id" placeholder="搜索条件" size="mini">
                    <el-option
                        v-for="item in tuan.selectId"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id"
                    ></el-option>
                </el-select>
                  <el-select v-model="Page.shop_id" placeholder="店铺" size="mini">
                <el-option
                  v-for="item in shop"
                  :key="item.id"
                  :label="item.title"
                  :value="item.id"
                ></el-option>
              </el-select>
                <el-input
                    placeholder="请输入内容"
                    v-model="Page.keyword"
                    clearable
                    size="mini"
                    class="input-with-select"
                >
                    <el-button slot="append" icon="el-icon-search" @click="onserch" ></el-button>
                </el-input>
                <el-button type="danger" @click="onclear" size="mini">清除搜索</el-button>
            </el-col>
             <el-col :span="4" style="text-align: right;">
                <el-button type="primary" @click="onaddtuan" size="mini">新增</el-button>
             </el-col>
        </el-row>
        <div class="height"></div>
        <el-row>
            <el-col :span="24">
                    <el-table border="" :data="tableData" style="width: 100%" stripe>
                        <el-table-column type="selection" width="55"></el-table-column>
                        <!-- <el-table-column label="商品ID" prop="gid"></el-table-column> -->
                        <el-table-column label="ID" prop="id"></el-table-column>
                        <el-table-column label="商品名称" prop="name"></el-table-column>
                        <el-table-column label="商品编号" prop="commodity_code" width="180"></el-table-column>
                        <el-table-column label="拼团类型" prop="type">
                            <template slot-scope="row">
                                <div v-if="row.row.type==1">
                                    <el-tag type="success" effect="dark">分享团</el-tag>
                                </div>
                                <div v-else-if="row.row.type==2">
                                    <el-tag type="info" effect="dark">定制团</el-tag>
                                </div>
                                <div v-else-if="row.row.type==3">
                                    <el-tag type="warning" effect="dark">阶梯团</el-tag>
                                </div>
                            </template>
                        </el-table-column>
                        <!-- 成团人数 -->
                        <!-- <el-table-column label="成团人数" prop="pay_state">
              <template slot-scope="row">
                <div v-if="row.row.pay_state==0">未支付</div>
                <div v-else>已支付</div>
              </template>
                        </el-table-column>-->
                        <!-- <el-table-column label="支付方式" prop="pay_type">
              <template slot-scope="row">
                <div v-if="row.row.pay_state==1">微信支付</div>
                <div v-else>余额</div>
              </template>
                        </el-table-column>-->

                        <el-table-column label="成团人数" prop="people">
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
                        <!-- <el-table-column label="下单时间" prop="add_time" width="180">
              <template slot-scope="row">
                {{row.row.add_time}}
            <div>{{1589872226|datefmt("YYYY-MM-DD HH:mm:ss")}}</div> 
              </template>
                        </el-table-column>-->
                        <el-table-column label="销售价格" prop="price"></el-table-column>
                        <el-table-column label="拼团价格" prop="people_price" width="180"></el-table-column>
                        <el-table-column label="拼团库存" prop="inventory"></el-table-column>
                        <el-table-column label="限购数量" prop="limit_amount"></el-table-column>
                        <el-table-column label="限购次数" prop="limit_num"></el-table-column>
                        <el-table-column label="首页推荐" prop="forsale" width="180">
                                 <template slot-scope="row">
                                       <el-switch
                v-model="row.row.hot"
                active-color="#008080"
                inactive-color="#ff4949"
                active-text="推荐"
                inactive-text="不推荐"
                  @change="onchangehot(row)"
              ></el-switch>
                            </template>
                          </el-table-column>
                          <el-table-column label="上架状态" prop="forsale" width="180">
                                 <template slot-scope="row">
                                       <el-switch
                v-model="row.row.forsale"
                active-color="#008080"
                inactive-color="#ff4949"
                active-text="上架"
                inactive-text="下架"
                  @change="onchange(row)"
              ></el-switch>
                            </template>
                          </el-table-column>
                        

                        <el-table-column label="操作" width="180">
                            <template slot-scope="row">
                                <!-- <el-button size="small" type="primary" @click="onaddClass(row)">添加</el-button> -->
                                <el-button
                                    size="small"
                                    type="info"
                                    @click="oneditone(row)"
                                    v-no-click
                                >编辑</el-button>
                                <el-button
                                    size="small"
                                    type="danger"
                                    @click="ondelGoods(row)"
                                    v-no-click
                                >删除</el-button>
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
            </el-col>
        </el-row>
                </el-card>

    </div>
</template>
<script>
import { tuan } from "@/common/select.js";
export default {
  // props:[],
  // 页面加载
  created() {
    this.getshops();
  },
  // 页面加载完成
  mounted() {},
  data() {
    return {
      tuan,
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
      },
      shop:[]
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
            loading.close();
            this.shop=res.data.shop
            if(res.data.shop.length>0){
            this.Page.shop_id=res.data.shop[0].id
            }

             this.getwxlist();

          } else {
            this.$message.error(res.data.msg);
          }
        })
        .catch(res => {
          this.$api.error();
          console.log(res);
        });
    },
    getwxlist() {
      this.$api
        .getwxlist(this.Page)
        .then(res => {
          if (res.data.code == 200) {
            this.tableData = res.data.list;
            this.tableData.forEach(x=>{
              if(x.forsale=="1"){
                    x.forsale=true
              }else{
                 x.forsale=false
              }
                if(x.hot=="1"){
                    x.hot=true
              }else{
                 x.hot=false
              }
              
            })  
            this.Page.count = res.data.count;
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
      this.getwxlist();
    },
    // 分页
    handleSizeChange(e) {
      this.Page.pagesize = e;
      this.getwxlist();
    },
    // 点击了搜索
    onserch() {
          this.Page.pagenum = 1;
      this.Page.pagesize = 10;
      this.getwxlist();
    },
    // 点击了清楚搜索
    onclear() {
      this.Page.forsale = "";
      this.Page.type = "";
      this.Page.keyword = "";
      this.Page.id = "";
      this.getwxlist();
    },
    // 点击了新增
    onaddtuan(){
        this.$router.push({
          name:"addtuan",
          params:{
            shop_id:this.Page.shop_id
          }
        })
    },
    // 点击了编辑
    oneditone(row){
          this.$router.push({name:"addtuan", params:{
            id:row.row.id
          }})
    },
    // 点击了删除
    ondelGoods(row){

        this.$confirm('此操作将永久删除, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
              this.$api
        .getwxdelTuan({params:{
          id:row.row.id
        }})
        .then(res => {
          if (res.data.code == 200) {
                   this.$message.success(res.data.msg);
                   this.getwxlist()
          } else {
            this.$message.error(res.data.msg);
          }
        })
        .catch(res => {
          this.$message.error();
        });
        }).catch(() => {
                
        });
         
    },
    onchange(row){
       this.$api
        .forsaleTuan({
         params:{forsale:row.row.forsale?1:0,
          id:row.row.id
         } 
        })
        .then(res => {
          if (res.data.code == 200) {
                 this.getwxlist();
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
    onchangehot(row){
 this.$api
        .getwxmhotTuan({
         params:{hot:row.row.forsale?1:0,
          id:row.row.id
         } 
        })
        .then(res => {
          if (res.data.code == 200) {
                 this.getwxlist();
            this.$message.success(res.data.msg);
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
.el-select {
  margin-right: 10px;
}
.input-with-select {
  width: 20%;
  margin-right: 10px;
}
</style>
