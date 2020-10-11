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
                        <el-table-column label="Id" prop="id"></el-table-column>
                        <el-table-column label="推荐内容" prop="intro"></el-table-column>
                        <el-table-column label="排序" prop="sort"></el-table-column>
                        <el-table-column label="是否显示">
                            <template slot-scope="row">
                                <el-switch
                                    v-model="row.row.status"
                                    active-color="#008080"
                                    inactive-color="#ff4949"
                                    active-text="是"
                                    inactive-text="否"
                                    @change="onswitchType(row)"
                                ></el-switch>
                            </template>
                        </el-table-column>
                        <el-table-column label="时间">
                            <template slot-scope="row">{{row.row.add_time}}</template>
                        </el-table-column>
                        <el-table-column label="操作" width="180">
                            <template slot-scope="row">
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
                </el-card>
            </el-col>
        </el-row>
        <el-dialog
            title="商品列表"
            :visible="dialogVisible"
            width="50%"
            :show-close="false"
            :close-on-click-modal="false"
            :close-on-press-escape="false"
        >
            <el-form
                :model="ruleForm"
                :rules="rules"
                ref="ruleForm"
                label-width="130px"
                class="demo-ruleForm"
            >
                <el-form-item label="热门推荐内容" prop="intro">
                    <el-input v-model="ruleForm.intro" placeholder="请输入热门推荐内容"></el-input>
                </el-form-item>
                <el-form-item label="排序">
                    <el-input v-model.number="ruleForm.sort"></el-input>
                </el-form-item>
                <el-form-item label="是否显示">
                    <el-switch
                        v-model="ruleForm.status"
                        active-color="#008080"
                        inactive-color="#ff4949"
                        active-text="是"
                        inactive-text="否"
                        @change="onswitchType(row)"
                    ></el-switch>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="oncancel" v-no-click>取消</el-button>
                <el-button type="primary" @click="onconfirm" v-no-click v-if="!isedit">确 定</el-button>
                <el-button type="primary" @click="onedit" v-no-click v-else>修改</el-button>
            </span>
        </el-dialog>
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
      isedit: false,
      dialogVisible: false,
      tableData: [],
      Page: {
        pagenum: 1,
        pagesize: 10,
        count: 0
      },
      ruleForm: {
        intro: "",
        sort: 99,
        status: true,
        id: ""
      },
      rules: {
        intro: [
          { required: true, message: "请输入推荐内容", trigger: "blur" },
          { min: 2, message: "长度最少2字符", trigger: "blur" }
        ]
      }
    };
  },
  // 方法
  methods: {
    getweiOrder() {
      this.$api
        .geweirecommendSetting(this.Page)
        .then(res => {
          if (res.data.code == 200) {
            res.data.list.data.forEach(x => {
              if (x.status == 1) {
                x.status = true;
              } else {
                x.status = false;
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
    onadd() {
      this.dialogVisible = true;
    },
    onconfirm() {
      this.$refs.ruleForm.validate(valid => {
        if (!valid) return;
        this.$api
          .geweirecommendAddSetting({
            intro: this.ruleForm.intro,
            sort: this.ruleForm.sort,
            status: this.ruleForm.status ? 1 : 0
          })
          .then(res => {
            if (res.data.code == 200) {
              this.$message.success(res.data.msg);
              this.ruleForm = {
                intro: "",
                sort: 99,
                status: true,
                id: ""
              };
              this.getweiOrder();
              this.dialogVisible = false;
            } else {
              this.$message.error(res.data.msg);
            }
          })
          .catch(res => {
            this.$message.error("网络错误");
            console.log(res);
          });
      });
    },
    oncancel() {
      this.ruleForm = {
        intro: "",
        sort: 99,
        status: true,
        id: ""
      };
      this.isedit = false;
      this.dialogVisible = false;
      this.$refs.ruleForm.resetFields();
    },
    oneditone(row) {
      this.$api
        .geweirecommendUpdateSetting({
          params: {
            id: row.row.id
          }
        })
        .then(res => {
          if (res.data.code == 200) {
            this.isedit = true;
            this.dialogVisible = true;
            this.ruleForm.id = row.row.id;
            this.ruleForm.intro = res.data.list.intro;
            this.ruleForm.sort = res.data.list.sort;
            this.ruleForm.status = res.data.list.status == 1 ? true : false;
          } else {
            this.$message.error(res.data.msg);
          }
        })
        .catch(res => {
          this.$message.error("网络错误");
          console.log(res);
        });
    },
    onedit(){
             this.$refs.ruleForm.validate(valid => {
        if (!valid) return;
        this.$api
          .geweirecommendUpdateSettings({
            intro: this.ruleForm.intro,
            sort: this.ruleForm.sort,
            status: this.ruleForm.status ? 1 : 0,
            id:this.ruleForm.id
          })
          .then(res => {
            if (res.data.code == 200) {
              this.$message.success(res.data.msg);
              this.ruleForm = {
                intro: "",
                sort: 99,
                status: true,
                id: ""
              };
                this.isedit = false;
              this.getweiOrder();
              this.dialogVisible = false;
            } else {
              this.$message.error(res.data.msg);
            }
          })
          .catch(res => {
            this.$message.error("网络错误");
            console.log(res);
          });
      });  
    },
    ondelGoods(row){
         this.$confirm('此操作将永久删除, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
                    this.$api
          .geweirecommendDelSetting({
            params:{
                id:row.row.id
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
        }).catch(() => {
                  
        });
    },
    onswitchType(row){
        
                  this.$api
          .geweirecommendStatusSettings({
            params:{
                id:row.row.id,
                status:row.row.status?1:0
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
</style>