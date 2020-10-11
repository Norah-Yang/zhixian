<template>
  <div>
        <el-card shadow="always">

    <el-row>
      <el-col :span="20">
        <el-select v-model="Page.id" placeholder="请选择">
          <el-option
            v-for="item in scoregoods.type"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          ></el-option>
        </el-select>
        <el-input placeholder="请输入内容" v-model="Page.keyword" clearable class="input-with-select">
          <el-button slot="append" icon="el-icon-search" @click="onserch"></el-button>
        </el-input>
        <el-button type="danger" @click="onclear">清除搜索</el-button>
      </el-col>
      <el-col :span="4" style="text-align: right;">
        <el-button type="primary" @click="onaddtuan">新增</el-button>
      </el-col>
    </el-row>
    <div class="height"></div>
    <el-row>
      <el-col :span="24">
        <!-- 'id',//活动id
'goods_id',//商品id
'name',//商品名称
'retail_price',//零售价
'score',//消耗积分
'inventory',//库存
'limit_amount',//限购数量
'limit_num',//限购次数
'start_time',//开始时间
'end_time',//结束时间
'forsale',//上架状态 -->
          <el-table border :data="tableData" style="width: 100%" stripe>
            <el-table-column label="活动Id" prop="id"></el-table-column>
            <el-table-column label="商品ID" prop="goods_id"></el-table-column>
            <el-table-column label="商品名称" prop="name"></el-table-column>
            <el-table-column label="零售价" prop="retail_price"></el-table-column>
            <el-table-column label="库存" prop="inventory"></el-table-column>
            <el-table-column label="限购数量" prop="limit_amount"></el-table-column>
            <el-table-column label="限购次数" prop="limit_num"></el-table-column>
            <el-table-column label="开始时间" prop="start_time" width="180"></el-table-column>
            <el-table-column label="结束时间" prop="end_time"  width="180"></el-table-column>
            <el-table-column label="上架状态" prop="forsale">
              <template slot-scope="row">
                      <el-switch
                v-model="row.row.forsale"
                active-color="#008080"
                inactive-color="#ff4949"
                active-text="是"
                inactive-text="否"
                @change="onchange(row)"
              ></el-switch>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="180">
              <template slot-scope="row">
                <!-- <el-button size="small" type="primary" @click="onaddClass(row)">添加</el-button> -->
                <el-button size="small" type="info" @click="oneditone(row)" v-no-click>修改</el-button>
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
      </el-col>
    </el-row>
        </el-card>
  </div>
</template>
<script>
import { scoregoods } from "@/common/select.js";
import { log } from 'util';
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
      scoregoods,
      tableData: [],
      Page: {
        pagenum: 1,
        pagesize: 7,
        count: 0,
        forsale: "",
        id: "",
        type: "",
        keyword: ""
      }
    };
  },
  // 方法
  methods: {
    getweiOrder() {
      this.$api
        .getwxlistScore(this.Page)
        .then(res => {
          if (res.data.code == 200) {
            res.data.list.forEach(x=>{
                    if(x.forsale==1){
                        x.forsale=true
                    }else{
                      x.forsale=false
                    }
            })
            this.tableData = res.data.list;
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
      this.getweiOrder();
    },
    // 分页
    handleSizeChange(e) {
      this.Page.pagesize = e;
      this.getweiOrder();
    },
    // 点击了新增
    onaddtuan() {
      this.$router.push("addscoregoods");
    },
    // 点击了清除搜索
    onclear(){
      this.Page.pagenum=1
      this.Page.pagesize=10
      this.Page.id=""
          this.getweiOrder();
    },
    // 点击了搜索
    onserch(){
        this.getweiOrder()
    },
    oneditone(row){
        this.$router.push({
        name: "addscoregoods",
        params: {
          id: row.row.id,
        }
      });
    },
    ondelGoods(row){
         

        this.$confirm('确定删除吗, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
           this.$api
        .getwxdelScore({
         params:{id:row.row.id} 
        })
        .then(res => {
          if (res.data.code == 200) {
                     this.getweiOrder();
            this.$message.success(res.data.msg);
          } else {
            this.$message.error(res.data.msg);
          }
        })
        .catch(res => {
          this.$message.error("网络错误");
          console.log(res);
        });
        }).catch(() => {
             
        });
          
          
    },
    onchange(row){
             this.$api
        .getwxforsaleScoreGoods({
         params:{forsale:row.row.forsale?1:0,
          id:row.row.id
         } 
        })
        .then(res => {
          if (res.data.code == 200) {
                     this.getweiOrder();
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
.el-input {
  width: 20%;
  margin-right: 10px;
}
.el-select {
  margin-right: 10px;
}
</style>