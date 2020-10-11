<template>
    <div>
        <el-row>
            <el-col :span="24">
                <el-card shadow="always">
                    <el-row>
                        <el-col>
                            <el-button type="primary" @click="onaddGoods" v-no-click  size="mini">添加</el-button>
                        </el-col>
                    </el-row>
                    <div class="height"></div>
                    <el-table border="" :data="tableData" style="width: 100%" stripe>
                        <el-table-column label="订单ID" prop="id"></el-table-column>
                        <el-table-column label="储值金额" prop="money"></el-table-column>
                        <el-table-column label="赠送金额" prop="send_money"></el-table-column>
                        <el-table-column label="适用门店" prop="shop_name"></el-table-column>
                        <el-table-column label="适用会员卡类型" prop="member_type"></el-table-column>
                        <el-table-column label="创建时间" prop="add_time"></el-table-column>
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
                </el-card>
            </el-col>
        </el-row>
        <el-dialog
            title="储值金额"
            :visible="dialogVisible"
            width="40%"
            :show-close="false"
            :close-on-click-modal="false"
            :close-on-press-escape="false"
        >
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px">
                <el-form-item label="储值金额" prop="money">
                    <el-input v-model="ruleForm.money" type="number"></el-input>
                </el-form-item>
                <el-form-item label="赠送金额">
                    <el-input v-model="ruleForm.send_money" type="number"></el-input>
                </el-form-item>
                <el-form-item label="赠送云币" prop="send_cloud_coin">
                    <el-input v-model="ruleForm.send_cloud_coin" type="number"></el-input>
                </el-form-item>
                <el-form-item label="适用门店" prop="use_shop_id">
                    <el-checkbox v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
                    <el-checkbox-group
                        v-model="ruleForm.use_shop_id"
                        @change="handleCheckedCitiesChange"
                    >
                        <el-checkbox
                            v-for="item in shop"
                            :label="item.id"
                            :key="item.id"
                        >{{item.title}}</el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
                <el-form-item label=" 适用卡类型" prop="use_member_type_id">
                    <el-checkbox v-model="checkAlltype" @change="handletypeChange">全选</el-checkbox>
                    <el-checkbox-group
                        v-model="ruleForm.use_member_type_id"
                        @change="handleTypeChange"
                    >
                        <el-checkbox
                            v-for="item in type"
                            :label="item.id"
                            :key="item.id"
                        >{{item.name}}</el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="oncancel" v-no-click>取 消</el-button>
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
      tableData: [],
      Page: {
        // pagenum: 1,
        // pagesize: 10,
        // count: 0
      },
      isedit: false,
      shop: [],
      type: [],
      ruleForm: {
        money: "",
        send_money: "",
        use_shop_id: [],
        use_member_type_id: [],
        send_cloud_coin: "",
        id: ""
      },
      rules: {
        money: [
          { required: true, message: "请输入储值金额", trigger: "blur" }
        ],
        use_shop_id: [
          { required: true, message: "请选择用门店", trigger: "change" }
        ],
        use_member_type_id: [
          { required: true, message: "请选择适用卡类型", trigger: "change" }
        ],
        send_cloud_coin: [
          { required: true, message: "请选择赠送云币", trigger: "change" }
        ],
      },
      checkAlltype: false,
      checkAll: false,
      checkedCities: false,
      dialogVisible: false
    };
  },
  // 方法
  methods: {
    getweiOrder() {
      this.$api
        .memberStoreRule(this.Page)
        .then(res => {
          if (res.data.code == 200) {
            this.tableData = res.data.list;
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
    onaddGoods() {
      this.$api
        .memberStoreRuleAdd({})
        .then(res => {
          if (res.data.code == 200) {
            this.shop = res.data.shop;
            this.type = res.data.type;
            this.dialogVisible = true;
          } else {
            this.$message.error(res.data.msg);
          }
        })
        .catch(res => {
          this.$message.error("网络错误");
          console.log(res);
        });
    },
    onconfirm() {
      this.$refs.ruleForm.validate(valid => {
        if (!valid) return;
        if (this.ruleForm.send_money < 0) {
          return this.$message.error("赠送金额请输入正整数");
        }
        let data = this.$_.cloneDeep(this.ruleForm);
        data.use_member_type_id = data.use_member_type_id.join(",");
        data.use_shop_id = data.use_shop_id.join(",");
        this.$api
          .memberStoreRules(data)
          .then(res => {
            if (res.data.code == 200) {
              this.$message.success(res.data.msg);
              this.checkAlltype = false;
              this.checkAll = false;
              this.dialogVisible = false;
              this.ruleForm.money = "";
              this.ruleForm.send_money = "";
              this.ruleForm.use_shop_id = [];
              this.ruleForm.use_member_type_id = [];
              this.ruleForm.send_cloud_coin = "";
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
      this.dialogVisible = false;
      this.ruleForm.money = "";
      this.ruleForm.send_money = "";
      this.ruleForm.use_shop_id = [];
      this.ruleForm.use_member_type_id = [];
      this.ruleForm.send_cloud_coin = "";
      this.checkAlltype = false;
      this.checkAll = false;
      this.$refs.ruleForm.resetFields();
      this.isedit = false;
    },
    handleCheckedCitiesChange(checkedCount) {
      this.checkAll = checkedCount.length == this.shop.length;
    },
    handleCheckAllChange(val) {
      if (val) {
        this.ruleForm.use_shop_id = this.shop.map(x => x.id);
      } else {
        this.ruleForm.use_shop_id = [];
      }
    },
    handletypeChange(val) {
      if (val) {
        this.ruleForm.use_member_type_id = this.type.map(x => x.id);
      } else {
        this.ruleForm.use_member_type_id = [];
      }
    },
    handleTypeChange(checkedCount) {
      this.checkAlltype = checkedCount.length == this.type.length;
    },
    // 点击了修改
    oneditone(row) {
      this.$api
        .memberStoreRuleUpdate({
          params: {
            id: row.row.id
          }
        })
        .then(res => {
          if (res.data.code == 200) {
            this.shop = res.data.shop;
            this.type = res.data.type;
            this.ruleForm.money = res.data.list.money;
            this.ruleForm.id = res.data.list.id;
            this.ruleForm.send_money = res.data.list.send_money;
            this.ruleForm.send_cloud_coin = res.data.list.send_cloud_coin;
            this.ruleForm.use_member_type_id = res.data.list.use_member_type_id
              .split(",")
              .map(x => parseInt(x));
            this.ruleForm.use_shop_id = res.data.list.use_shop_id
              .split(",")
              .map(x => parseInt(x));
            this.checkAlltype =
              this.ruleForm.use_member_type_id.length == this.type.length;
            this.checkAll =
              this.ruleForm.use_shop_id.length == this.shop.length;
            this.isedit = true;
            this.dialogVisible = true;
          } else {
            this.$message.error(res.data.msg);
          }
        })
        .catch(res => {
          this.$message.error("网络错误");
          console.log(res);
        });
    },
    onedit() {
      this.$refs.ruleForm.validate(valid => {
        if (!valid) return;
        if (this.ruleForm.send_money < 0) {
          return this.$message.error("赠送金额请输入正整数");
        }
        let data = this.$_.cloneDeep(this.ruleForm);
        data.use_member_type_id = data.use_member_type_id.join(",");
        data.use_shop_id = data.use_shop_id.join(",");
        this.$api
          .memberStoreRuleUpdates(data)
          .then(res => {
            if (res.data.code == 200) {
              this.$message.success(res.data.msg);
              this.checkAlltype = false;
              this.checkAll = false;
              this.dialogVisible = false;
              this.ruleForm.money = "";
              this.ruleForm.send_money = "";
              this.ruleForm.id = "";
              this.isedit = false;
              this.ruleForm.use_shop_id = [];
              this.ruleForm.use_member_type_id = [];
              this.ruleForm.send_cloud_coin = "";
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
    ondelGoods(row) {
      this.$confirm("此操作将永久删除, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$api
            .memberStoreRuleDel({
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