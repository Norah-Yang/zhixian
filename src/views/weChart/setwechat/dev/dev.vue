<template>
    <div>
        <el-row>
            <el-col :span="24">
                <el-card shadow="always">
                    <el-button type="primary" @click="onaddClass(row)">添加</el-button>
                    <div class="height"></div>
                    <el-table border="" :data="tableData" style="width: 100%" stripe>
                        <el-table-column label="内容" prop="title"></el-table-column>
                        <el-table-column label="状态">
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
                    <!-- <div class="pagination">
            <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :page-sizes="[7, 12, 15, 20]"
              layout="total, sizes, prev, pager, next, jumper"
              :total="Page.count"
            ></el-pagination>
                    </div>-->
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
                label-width="100px"
                class="demo-ruleForm"
            >
                <el-form-item label="分类名称" prop="title">
                    <el-input v-model="ruleForm.title"></el-input>
                </el-form-item>
                <el-form-item label="状态">
                    <el-switch
                        v-model="ruleForm.state"
                        active-color="#008080"
                        inactive-color="#ff4949"
                        active-text="是"
                        inactive-text="否"
                    ></el-switch>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="oncancel" v-no-click>取 消</el-button>
                <el-button type="primary" @click="onconfirm" v-no-click v-if="!isedit">确 定</el-button>
                <el-button type="primary" @click="oniseditconfirm" v-no-click v-else>修改</el-button>
            </span>
        </el-dialog>
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
      isedit: false,
      dialogVisible: false,
      tableData: [],
      Page: {
        pagenum: 1,
        pagesize: 10,
        count: 0
      },
      ruleForm: {
        merchant_id: "",
        title: "",
        state: true,
        dev_id: ""
      },
      rules: {
        title: [{ required: true, message: "请输入分类名称", trigger: "blur" }]
      }
    };
  },
  // 方法
  methods: {
    getweiOrder() {
      this.$api
        .getdev({})
        .then(res => {
          if (res.data.code == 200) {
            res.data.data.forEach(x => {
              if (x.state == 1) {
                x.state = true;
              } else {
                x.state = false;
              }
            });
            this.tableData = res.data.data;
            this.ruleForm.merchant_id = res.data.merchant_id;
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
    //开关的切换
    onswitchType(row) {
      this.$api
        .getswithdev({
          dev_id: row.row.id,
          state: row.row.state ? 1 : 0
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
    // 点击了添加
    onaddClass() {
      this.dialogVisible = true;
      //         this.$api
      // .getaddDev(this.ruleForm)
      // .then(res => {
      //   if (res.data.code == 200) {
      //     this.$message.success(res.data.msg);
      //     this.getweiOrder();
      //   } else {
      //     this.$message.error(res.data.msg);
      //   }
      // })
      // .catch(res => {
      //   this.$message.error("网络错误");
      //   console.log(res);
      // });
    },
    // 点击了确定提交
    onconfirm() {
      this.$refs.ruleForm.validate(valid => {
        if (!valid) return;
        this.$api
          .getaddDev({
            merchant_id: this.ruleForm.merchant_id,
            title: this.ruleForm.title,
            state: this.ruleForm.state ? 1 : 0
          })
          .then(res => {
            if (res.data.code == 200) {
              this.getweiOrder();
              this.ruleForm.title = "";
              this.dialogVisible = false;
              this.$message.success(res.data.msg);
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
      this.dialogVisible = false;
      this.ruleForm.title = "";
    },
    ondelGoods(row) {
      this.$confirm("确认删除吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$api
            .getdelDev({
              dev_id: row.row.id
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
    // 点击了编辑
    oneditone(row) {
      this.$api
        .geteditDev({
          params: {
            dev_id: row.row.id
          }
        })
        .then(res => {
          if (res.data.code == 200) {
            this.isedit = true;
            // id: 1
            // title: "文本"
          } else {
            this.$message.error(res.data.msg);
          }
        })
        .catch(res => {
          this.$message.error("网络错误");
          console.log(res);
        });
      //             25、编辑素材分类    编辑前
      //  get  ->  mapi/editDev
      //  请求参数
      //   dev_id      分类id
      //  返回参数
      //   id       分类id
      //   title      分类名称

      // 26、编辑素材分类    编辑后
      //  post  ->  mapi/editDev
      //  请求参数
      //   dev_id      分类id
      //   title      分类名称
      //  返回参数
      //   true:{
      //    code:200       http状态码
      //    msg:'编辑成功'   业务提示信息
      //    data:[]
      //   }
      //   false:{
      //    code:500       http状态码
      //    msg:'系统发生错误'  业务提示信息
      //    data:[]
      //   }
    },
    oniseditconfirm() {}
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