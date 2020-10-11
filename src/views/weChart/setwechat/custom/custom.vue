<template>
  <div>
    <el-row>
      <el-col :span="24">
        <el-card shadow="always">
          <el-button type="primary" @click="onaddmenu()" size="mini">新建菜单</el-button>
          <el-button type="primary" @click="onmenus()" size="mini">生成菜单</el-button>
          <div class="height"></div>
          <el-table border="" :data="tableData" style="width: 100%" stripe class="table_expand">
            <el-table-column type="expand">
              <template slot-scope="row">
                <el-table
                  border=""
                  :data="row.row.sub"
                  style="width: 100%"
                  stripe
                  :show-header="false"
                >
                  <el-table-column label="菜单名称" prop="name"></el-table-column>
                  <el-table-column label="类型" prop="type" width="180">
                    <template slot-scope="row">
                      <div>
                        <div v-if="row.row.type==0">无操作</div>
                        <div v-if="row.row.type==1">链接</div>
                        <div v-if="row.row.type==2">点击事件</div>
                        <div v-if="row.row.type==3">小程序</div>
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column label="关键字" prop="key"></el-table-column>
                  <el-table-column label="链接" prop="url"></el-table-column>
                  <el-table-column label="显示">
                    <template slot-scope="row">
                      <el-switch
                        v-model="row.row.state"
                        active-color="#008080"
                        inactive-color="#ff4949"
                        active-text="是"
                        inactive-text="否"
                        @change="onchangeson(row)"
                      ></el-switch>
                    </template>
                  </el-table-column>
                  <el-table-column label="操作" width="280">
                    <template slot-scope="row">
                      <el-button size="small" type="info" @click="oneditone(row)" v-no-click>编辑</el-button>
                      <el-button size="small" type="danger" @click="ondelGoods(row)" v-no-click>删除</el-button>
                      <el-button
                        size="small"
                        type="primary"
                        @click="onaddClass(row)"
                        v-if="row.row.pid==0"
                      >添加</el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </template>
            </el-table-column>
            <el-table-column label="菜单名称" prop="name"></el-table-column>
            <el-table-column label="类型" prop="type" width="180">
              <template slot-scope="row">
                <div>
                  <div v-if="row.row.type==0">无操作</div>
                  <div v-if="row.row.type==1">链接</div>
                  <div v-if="row.row.type==2">点击事件</div>
                  <div v-if="row.row.type==3">小程序</div>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="关键字" prop="key"></el-table-column>
            <el-table-column label="链接" prop="url"></el-table-column>
            <el-table-column label="显示">
              <template slot-scope="row">
                <el-switch
                  v-model="row.row.state"
                  active-color="#008080"
                  inactive-color="#ff4949"
                  active-text="是"
                  inactive-text="否"
                  @change="onchange(row)"
                ></el-switch>
              </template>
            </el-table-column>
            <!-- state -->
            <el-table-column label="操作" width="280">
              <template slot-scope="row">
                <el-button size="small" type="info" @click="oneditone(row)" v-no-click>编辑</el-button>
                <el-button size="small" type="danger" @click="ondelGoods(row)" v-no-click>删除</el-button>
                <el-button
                  size="small"
                  type="primary"
                  @click="onaddClass(row)"
                  v-if="row.row.pid==0"
                >添加</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
    </el-row>
    <el-dialog
      title="新建菜单"
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
        label-width="110px"
        class="demo-ruleForm"
      >
        <el-form-item label="菜单名称" prop="name">
          <el-input v-model="ruleForm.name"></el-input>
        </el-form-item>
        <el-form-item label="菜单名称">
          <el-select v-model="ruleForm.type" placeholder="分类选择">
            <el-option
              v-for="item in ruleForm.menuList"
              :key="item.id"
              :label="item.label"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="链接地址" v-if="ruleForm.type==1">
          <el-input v-model="ruleForm.url"></el-input>
        </el-form-item>
        <el-form-item label="关键字" v-if="ruleForm.type==2">
          <el-input v-model="ruleForm.key"></el-input>
        </el-form-item>
        <el-form-item label="链接地址" v-if="ruleForm.type==3">
          <el-input v-model="ruleForm.url"></el-input>
        </el-form-item>
        <el-form-item label="小程序页面路径" v-if="ruleForm.type==3">
          <el-input v-model="ruleForm.page"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="oncancel" v-no-click>取 消</el-button>
        <el-button type="primary" @click="onaddconfirm" v-no-click v-if="isadd">添加</el-button>
        <el-button type="primary" @click="onconfirm" v-no-click v-else>确定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑菜单对话框 -->
    <el-dialog
      title="新建菜单"
      :visible="dialogVisible1"
      width="50%"
      :show-close="false"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <el-form
        :model="ruleForm1"
        :rules="rules"
        ref="ruleForm"
        label-width="110px"
        class="demo-ruleForm"
      >
        <el-form-item label="菜单名称" prop="name">
          <el-input v-model="ruleForm1.name"></el-input>
        </el-form-item>
        <el-form-item label="菜单名称">
          <el-select v-model="ruleForm1.type" placeholder="分类选择">
            <el-option
              v-for="item in ruleForm1.menuList"
              :key="item.id"
              :label="item.label"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="链接地址" v-if="ruleForm1.type==1">
          <el-input v-model="ruleForm1.url"></el-input>
        </el-form-item>
        <el-form-item label="关键字" v-if="ruleForm1.type==2">
          <el-input v-model="ruleForm1.key"></el-input>
        </el-form-item>
        <el-form-item label="链接地址" v-if="ruleForm1.type==3">
          <el-input v-model="ruleForm1.url"></el-input>
        </el-form-item>
        <el-form-item label="小程序页面路径" v-if="ruleForm1.type==3">
          <el-input v-model="ruleForm1.page"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="oncancel1" v-no-click>取 消</el-button>
        <el-button type="primary" @click="onconfirm1" v-no-click>编辑</el-button>
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
      isadd: false,
      dialogVisible1: false,
      tableData: [],
      Page: {
        // pagenum: 1,
        // pagesize: 10,
        // count: 0
      },
      dialogVisible: false,
      ruleForm: {
        menuList: [
          {
            label: "无操作",
            id: 0
          },
          {
            label: "链接",
            id: 1
          },
          {
            label: "点击事件",
            id: 2
          },
          {
            label: "小程序",
            id: 3
          }
        ],
        type: 0,
        name: "",
        key: "",
        merchant_id: "",
        url: "",
        page: "",
        pid: 0,
        sonPid: ""
      },
      ruleForm1: {
        menuList: [
          {
            label: "无操作",
            id: 0
          },
          {
            label: "链接",
            id: 1
          },
          {
            label: "点击事件",
            id: 2
          },
          {
            label: "小程序",
            id: 3
          }
        ],
        type: 0,
        name: "",
        key: "",
        merchant_id: "",
        url: "",
        page: "",
        pid: 0,
        mid: ""
      },
      rules: {
        name: [{ required: true, message: "请输入菜单名称", trigger: "blur" }]
      }
    };
  },
  // 方法
  methods: {
    getweiOrder() {
      this.$api
        .getcustom(this.Page)
        .then(res => {
          if (res.data.code == 200) {
            console.log(res.data);
            res.data.data.forEach(x => {
              if (x.state == 1) {
                x.state = true;
              } else {
                x.state = false;
              }
              if (x.sub.length > 0) {
                x.sub.forEach(v => {
                  if (v.state == 1) {
                    v.state = true;
                  } else {
                    v.state = false;
                  }
                });
              }
            });
            this.tableData = res.data.data;
            this.ruleForm.merchant_id = res.data.merchant_id;

            // this.Page.count = res.data.count;

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
      this.getcustom();
    },
    // 分页
    handleSizeChange(e) {
      this.Page.pagesize = e;
      this.getcustom();
    },
    onchange(row) {
      this.$api
        .getcustomState({
          menu_id: row.row.id,
          state: row.row.state ? 1 : 0
        })
        .then(res => {
          if (res.data.code == 200) {
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
    onaddmenu() {
      this.dialogVisible = true;
    },
    onconfirm() {
      this.$refs.ruleForm.validate(valid => {
        if (!valid) return;
        this.$api
          .getaddCustom(this.ruleForm)
          .then(res => {
            if (res.data.code == 200) {
              this.$message.success(res.data.msg);
              this.dialogVisible = false;
              this.ruleForm.type = 0;
              this.ruleForm.name = "";
              this.ruleForm.key = "";
              this.ruleForm.url = "";
              this.ruleForm.page = "";
              this.getweiOrder();
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
      this.ruleForm.type = 0;
      this.ruleForm.name = "";
      this.ruleForm.key = "";
      this.ruleForm.url = "";
      this.ruleForm.page = "";
      this.dialogVisible = false;
      this.ruleForm.sonPid = "";
      this.isadd = false;
      this.$refs.ruleForm.resetFields();
    },
    onaddClass(row) {
      this.isadd = true;
      this.dialogVisible = true;
      this.ruleForm.sonPid = row.row.id;
    },
    onaddconfirm() {
      this.$refs.ruleForm.validate(valid => {
        if (!valid) return;
        this.$api
          .getaddSonCustom(this.ruleForm)
          .then(res => {
            if (res.data.code == 200) {
              this.$message.success(res.data.msg);
              this.dialogVisible = false;
              this.ruleForm.type = 0;
              this.ruleForm.name = "";
              this.ruleForm.key = "";
              this.ruleForm.url = "";
              this.ruleForm.page = "";
              this.ruleForm.sonPid = "";
              this.isadd = false;
              this.getweiOrder();
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
    // 点击了生成菜单
    onmenus() {
      this.$api
        .getaddsetCustom({
          params: {
            merchant_id: this.ruleForm.merchant_id
          }
        })
        .then(res => {
          if (res.data.code == 200) {
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
    onchangeson(row) {
      this.$api
        .getcustomState({
          menu_id: row.row.id,
          state: row.row.state ? 1 : 0
        })
        .then(res => {
          if (res.data.code == 200) {
            this.$message.success(res.data.msg);
            // this.getweiOrder();
          } else {
            this.$message.error(res.data.msg);
          }
        })
        .catch(res => {
          this.$message.error("网络错误");
          console.log(res);
        });
    },
    // 点击了编辑
    oneditone(row) {
      this.ruleForm1.mid = row.row.id;
      this.$api
        .geteviewCustom({
          params: {
            mid: row.row.id
          }
        })
        .then(res => {
          if (res.data.code == 200) {
            // this.$message.success(res.data.msg);
            this.ruleForm1.name = res.data.data.name;
            this.ruleForm1.key = res.data.data.key;
            this.ruleForm1.url = res.data.data.url;
            this.ruleForm1.page = res.data.data.page;
            this.ruleForm1.type = parseInt(res.data.data.type);
            this.dialogVisible1 = true;
          } else {
            this.$message.error(res.data.msg);
          }
        })
        .catch(res => {
          this.$message.error("网络错误");
          console.log(res);
        });
    },
    // 点击了确定编辑
    onconfirm1() {
      this.$refs.ruleForm.validate(valid => {
        if (!valid) return;
        this.$api
          .geteditCustom(this.ruleForm1)
          .then(res => {
            if (res.data.code == 200) {
              this.$message.success(res.data.msg);
              this.dialogVisible1 = false;
              this.ruleForm1.type = 0;
              this.ruleForm1.name = "";
              this.ruleForm1.key = "";
              this.ruleForm1.url = "";
              this.ruleForm1.page = "";
              this.ruleForm1.mid = "";
              this.getweiOrder();
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
    oncancel1() {
      this.ruleForm1.mid = "";
      this.ruleForm1.name = "";
      this.ruleForm1.key = "";
      this.ruleForm1.url = "";
      this.ruleForm1.page = "";
      this.ruleForm1.type = "";
      this.dialogVisible1 = false;
    },
    ondelGoods(row) {
      this.$confirm("确定删除吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$api
            .getdelCustom({
              del_id: row.row.id
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
.table_expand {
  /deep/ .el-table__expanded-cell {
    // padding: 0;
    // padding-left: 48px;
    padding: 5px 0 5px 48px;
  }
}
</style>