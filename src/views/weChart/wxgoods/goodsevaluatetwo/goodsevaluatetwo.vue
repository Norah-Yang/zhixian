<template>
  <div>
    <el-row>
      <el-col :span="24">
        <el-card shadow="always">
              <el-select v-model="Page.shop_id" placeholder="店铺" @change="onselect" size="mini">
                <el-option
                  v-for="item in shop"
                  :key="item.id"
                  :label="item.title"
                  :value="item.id"
                ></el-option>
              </el-select>
              <div class="height"></div>
          <el-table border="" :data="tableData" style="width: 100%" stripe>
            <el-table-column label="会员名" prop="nickname"></el-table-column>
            <el-table-column label="商品名称" prop="goods_name" width="180"></el-table-column>
            <el-table-column label="评价星级" prop="state"></el-table-column>
            <el-table-column label="评价内容" prop="comment" ></el-table-column>
            <el-table-column label="评价时间" prop="add_time"></el-table-column>
            <el-table-column label="是否审核" prop="state">
                    <template slot-scope="row">
                                <el-switch
                                    v-model="row.row.state"
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
        shop_id:""
      }
    };
  },
  // 方法
  methods: {
        getshops(){
         this.$api
        .getshops({}).then(res => {
          if (res.data.code == 200) {
            this.shop=res.data.shop
            if(res.data.shop.length>0){
            this.Page.shop_id=res.data.shop[0].id
            }

             this.getweiComment();

          } else {
            this.$message.error(res.data.msg);
          }
        })
        .catch(res => {
          this.$api.error();
          console.log(res);
        });
    },
    onselect(){
        this.Page.pagenum=1;
        this.Page.pagesize=10;
        this.getweiComment()
    },
    getweiComment() {
      this.$api
        .getweiComment(this.Page)
        .then(res => {
          if (res.data.code == 200) {
            res.data.list.forEach(x=>{
              if(x.state==1){
                x.state=true
              }else{
                 x.state=false
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
      this.getweiComment();
    },
    // 分页
    handleSizeChange(e) {
      this.Page.pagesize = e;
      this.getweiComment();
    },
    // 切换审核
    onswitchType(row){
         let state=""
        if(row.row.state){
          state=1
        }else{
          state=0
        }
        
         this.$api
        .getweiCommentState({
          params:{
          state,
          id:row.row.cid

          }
        })
        .then(res => {
          if (res.data.code == 200) {
            this.$message.success(res.data.msg);
                this.getweiComment();
         
          } else {
            this.$message.error(res.data.msg);
          }
        })
        .catch(res => {
          this.$message.error("网络错误");
          console.log(res);
        });
    },
    ondelGoods(row){
          this.$confirm('确定删除吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
                 this.$api
        .getweiCommentDel({
          params:{
          id:row.row.cid

          }
        })
        .then(res => {
          if (res.data.code == 200) {
            this.$message.success(res.data.msg);
                this.getweiComment();
         
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