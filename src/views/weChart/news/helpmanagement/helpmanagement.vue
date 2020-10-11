<template>
    <div>
        <el-row>
            <el-col :span="24">
                <el-card shadow="always">
                    <el-row>
                        <el-col>
                            <el-button type="primary" @click="onadd()" v-no-click size="mini">添加</el-button>
                            <div class="height"></div>
                        </el-col>
                    </el-row>
                    <el-table border="" :data="tableData" style="width: 100%" stripe>
                        <el-table-column label="分类id" prop="help_cate_id"></el-table-column>
                        <el-table-column label="分类名称" prop="cate_title"></el-table-column>
                        <el-table-column label="标题" prop="title"></el-table-column>
                        <el-table-column label="发布时间" prop="add_time"></el-table-column>
                        <el-table-column label="显示状态">
                            <template slot-scope="row">
                              <div v-if="row.row.status==1">显示</div>
                              <div v-else>隐藏</div>
                            </template>
                        </el-table-column>
                      
                        <el-table-column label="操作" width="180">
                            <template slot-scope="row">
                                <el-button
                                    size="mini"
                                    type="info"
                                    @click="oneditone(row)"
                                    v-no-click
                                >编辑</el-button>
                                <el-button
                                    size="mini"
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
        count: 0,
      },
    };
  },
  // 方法
  methods: {
    oncahnge(){
        this.ruleForm.url=this.ruleForm.url_type
    },
    getweiOrder() {
      this.$api
        .gethelpList({
          params: this.Page
        })
        .then(res => {
          if (res.data.code == 200) {
            console.log(res.data);

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
    handleRemoveNavigation() {
      this.ruleForm.thumb = "";
    },
    AvatarSuccessNavigation(e) {
      if (e.code == 200) {
        this.ruleForm.thumb = e.name;
      }
    },
    onexceedNavigation() {
      this.$message.error("只能上传一张图");
    },
    onadd() {
        this.$router.push("/addhelpmanagement")

    },
 
  
    ondelGoods(row) {
      this.$confirm("此操作将永久删除, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$api
            .gethelpDels({
              params: {
                id: row.row.id
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
        })
        .catch(() => {});
    },
    onswitchType(row) {
      this.$api
        .gethelpDel({
          params: {
            id: row.row.id,
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
  oneditone(row){
     this.$router.push({
   name:"addhelpmanagement",
   params:{
     id:row.row.id
   }
 })
  }
  
    // geweirecommendDelSetting
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
.select {
  margin-left: 10px;
}
</style>