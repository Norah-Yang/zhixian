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
                        <el-table-column label="ID" prop="id"></el-table-column>
                        <el-table-column label="新闻标题" prop="title"></el-table-column>
                        <el-table-column label="新闻描述" prop="intro"></el-table-column>
                        <el-table-column label="是否显示">
                            <template slot-scope="row">
                              <div v-if="row.row.status==1">待审核</div>
                              <div v-if="row.row.status==2">显示</div>
                              <div v-else>隐藏</div>
                            </template>
                        </el-table-column>
                        <el-table-column label="发布时间" prop="add_time"></el-table-column>

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
import { quillRedefine } from "vue-quill-editor-upload";
import { quillEditor } from "vue-quill-editor";
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
        place: ""
      },
      editorOption:{}
    };
  },
  // 方法
  methods: {
    oncahnge(){
        this.ruleForm.url=this.ruleForm.url_type
    },
    getweiOrder() {
      this.$api
        .getjournalismList({
          params: this.Page
        })
        .then(res => {
          if (res.data.code == 200) {
            this.tableData = res.data.list.data;
            this.Page.count = res.data.list.total;
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
    // 点击了编辑
   oneditone(row){
      this.$router.push({
        name:"addnewsmanagement",
        params:{
          id:row.row.id
        }
      })
   },
    onadd() {
        this.$router.push("/addnewsmanagement")

    },
 
  
    ondelGoods(row) {
      this.$confirm("此操作将永久删除, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$api
            .getjournalismDel({
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
        .getweiNavigationStatusSetting({
          params: {
            id: row.row.id,
            status: row.row.status ? 1 : 0
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