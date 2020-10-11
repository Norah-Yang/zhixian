<template>
  <el-card id="el_card">
    <el-row>
      <el-tabs type="border-card" @tab-click="handleClick" :style="{width:type? '20.3%' : '100%'}">
        <el-tab-pane label="第三方收款"></el-tab-pane>
        <el-tab-pane label="POS收款"></el-tab-pane>
      </el-tabs>
      <el-col style="margin:15px 0" v-if="!type">
        <el-button type="primary" @click="add" size="mini">新增POS收款</el-button>
      </el-col>
    </el-row>
    <el-row v-if="!type" :style="{width:type? '24%' : '100%'}">
      <el-col>
        <el-table :data="tableData" border="" style="width: 100%">
          <el-table-column prop="id" label="名称" width="100"></el-table-column>
          <el-table-column prop="title" label="编码"></el-table-column>
          <el-table-column prop="serial_number" label="排序"></el-table-column>
          <el-table-column prop="intro" label="类型" width="300"></el-table-column>
          <el-table-column prop="address" label="适用" width="200"></el-table-column>
          <el-table-column prop="phone" label="交班输入" width="200"></el-table-column>
          <el-table-column label="图片">
            <template slot-scope="row">
              <div v-if="row.row.thumb">
                <el-image style="width: 300px; height: 100px" :src="row.row.thumb" fit="contain"></el-image>
              </div>
              <div v-else>暂无图片</div>
            </template>
          </el-table-column>
          <el-table-column label="状态" prop="status">
            <template slot-scope="row">
              <el-switch
                v-model="row.row.status"
                active-color="#008080"
                inactive-color="#ff4949"
                active-text="是"
                inactive-text="否"
                disabled
                @change="onswitchType(row)"
              ></el-switch>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="200">
            <template slot-scope="scope">
              <el-button
                type="primary"
                size="mini"
                icon="el-icon-edit"
                @click="edit_2(scope.$index, scope.row)"
              >编辑</el-button>
              <el-button
                type="danger"
                size="mini"
                icon="el-icon-delete"
                @click="del(scope.$index, scope.row)"
              >删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
    <el-row style="margin-top:50px" v-if="!type" :style="{width:type? '20.3%' : '100%'}">
      <el-col>
        <div class="pagination">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :page-sizes="[7, 12, 15, 20]"
            layout="total, sizes, prev, pager, next, jumper"
            :total="Page.count"
          ></el-pagination>
        </div>
      </el-col>
    </el-row>
    <el-row v-if="type" :style="{width:type? '20.3%' : '100%'}">
      <el-col>
        <el-table :data="tableData_" border="" style="width: 100%">
          <el-table-column prop="title" label="收款方式" width="200"></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button
                type="primary"
                size="mini"
                icon="el-icon-edit"
                @click="edit_1(scope.$index, scope.row)"
              >编辑</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
    <!-- POS收款 -->
    <el-dialog :title="title" :visible="dialogVisible" width="30%" :show-close="false">
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="120px"
        class="demo-ruleForm"
      >
        <el-form-item label="编码" prop="name">
          <el-input v-model="ruleForm.name" :disabled="ruleForm.id ? true : false"></el-input>
        </el-form-item>
        <el-form-item label="名称" prop="sort">
          <el-input v-model="ruleForm.sort" :disabled="ruleForm.id ? true : false"></el-input>
        </el-form-item>
        <el-form-item label="排序" prop="status1">
          <el-input v-model.number="ruleForm.status1" type="number"></el-input>
          <div style="color:gray">(排序默认由大到小)</div>
        </el-form-item>
        <el-form-item label="适用场景" prop="checkbox">
          <el-checkbox-group v-model="ruleForm.checkbox">
            <el-checkbox label="收银结算"></el-checkbox>
            <el-checkbox label="退款结算"></el-checkbox>
            <el-checkbox label="会员卡储值"></el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="状态" prop="value1">
          <el-switch
            v-model="ruleForm.value1"
            active-color="#008080"
            active-text="是"
            inactive-text="否"
            inactive-color="#ff4949"
          ></el-switch>
        </el-form-item>
        <el-form-item label="明交输入金额" prop="value2">
          <el-switch
            v-model="ruleForm.value2"
            active-color="#008080"
            active-text="是"
            inactive-text="否"
            inactive-color="#ff4949"
          ></el-switch>
        </el-form-item>
        <el-form-item label="图片上传">
          <el-upload
            ref="upload"
            :action="$uplaadUrl"
            list-type="picture-card"
            :file-list="ruleForm.file"
            :limit="limit"
            :headers="header"
            :on-preview="handlePictureCardPreview"
            :on-remove="handleRemove"
            :on-success="handleAvatarSuccess"
            :on-exceed="onexceed"
            :before-upload="beforeUpload"
            accept=".jpg, .png"
          >
            <i class="el-icon-plus"></i>
          </el-upload>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="oncancel" v-no-click>取 消</el-button>
        <el-button type="primary" @click="onconfirm_" v-no-click :disabled="click_key">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog :visible.sync="imgVisible" width="30%">
      <img width="100%" :src="ruleForm.pic" alt="">
    </el-dialog>
    <!-- 第三方收款 -->
    <el-dialog :title="title" :visible="dialogVisible_" width="40%" :show-close="false">
      <el-form
        :model="ruleForm_"
        :rules="rules_"
        ref="ruleForm_"
        label-width="130px"
        class="demo-ruleForm"
      >
        <el-form-item label="支付类型">
          <el-input v-model="ruleForm_.type" disabled></el-input>
        </el-form-item>
        <el-form-item label="支付宝企业账户" prop="name">
          <el-input v-model="ruleForm_.name"></el-input>
        </el-form-item>
        <el-form-item label="合作者身份(PID)" prop="sort">
          <el-input v-model="ruleForm_.sort"></el-input>
        </el-form-item>
        <el-form-item label="开发者应用ID" prop="status1">
          <el-input v-model.number="ruleForm_.status1"></el-input>
        </el-form-item>
        <el-form-item label="应用公钥(Key)" prop="status1">
          <el-input v-model.number="ruleForm_.status1"></el-input>
        </el-form-item>
        <el-form-item label="开发者私钥(Key)" prop="status1">
          <el-input v-model.number="ruleForm_.status1"></el-input>
        </el-form-item>
        <el-form-item label="支付宝公钥(Key)" prop="status1">
          <el-input v-model.number="ruleForm_.status1"></el-input>
        </el-form-item>
        <el-form-item label="适用终端" prop="checkbox">
          <el-checkbox-group v-model="ruleForm_.checkbox">
            <el-checkbox label="门店"></el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="签名类型" prop="value2">
          <el-radio-group v-model="ruleForm_.value2" prop="value2">
            <el-radio :label="1">RSA(SHA1)</el-radio>
            <el-radio :label="2">RSA2(SHA256)</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="状态" prop="value1">
          <el-switch
            v-model="ruleForm_.value1"
            active-color="#008080"
            active-text="启用"
            inactive-text="关闭"
            inactive-color="#ff4949"
          ></el-switch>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="oncancel_" v-no-click>取 消</el-button>
        <el-button type="primary" @click="onconfirm_" v-no-click :disabled="click_key_">确 定</el-button>
      </span>
    </el-dialog>
  </el-card>
</template>

<script>
export default {
  created() {
    console.log(this.$route.query);
    this.head = this.$route.query.head;
    this.id = this.$route.query.id;
    this.getmachine();
  },
  data() {
    return {
      click_key: false,
      click_key_: false,
      options: [
        { value: 1, title: "店铺ID", id: 1 },
        { value: 2, title: "门店名称", id: 2 }
      ],
      type: true,
      input: "",
      value: "",
      tableData: [],
      tableData_: [],
      Page: {
        pagenum: 1,
        pagesize: 10,
        count: 0,
        id: "",
        shop_id: "",
        keyword: "",
        key_id: ""
      },
      dialogVisible: false,
      dialogVisible_: false,
      imgVisible: false,
      ruleForm: {
        name: "",
        sort: "",
        value1: true,
        value2: true,
        status1: "",
        pic: "",
        url: "",
        file: [],
        id: "",
        checkbox: []
      },
      ruleForm_: {
        name: "",
        sort: "",
        value1: true,
        value2: true,
        status1: "",
        url: "",
        id: "",
        checkbox: []
      },
      title: "",
      limit: 1,
      header: {
        Authorization: sessionStorage.getItem("token") || ""
      },
      rules: {
        name: [{ required: true, message: "请填写POS编码", trigger: "blur" }],
        sort: [
          { required: true, message: "请填写POS收款名称", trigger: "blur" }
        ],
        status1: [{ required: true, message: "请填写排序", trigger: "blur" }],
        value1: [{ required: true, message: "请选择状态", trigger: "blur" }],
        value2: [
          { required: true, message: "请选择明交输入金额", trigger: "blur" }
        ],
        checkbox: [
          { required: true, message: "请选择适用场景", trigger: "blur" }
        ]
      },
      rules_: {
        name: [{ required: true, message: "请填写POS编码", trigger: "blur" }],
        sort: [
          { required: true, message: "请填写POS收款名称", trigger: "blur" }
        ],
        status1: [{ required: true, message: "请填写排序", trigger: "blur" }],
        value1: [{ required: true, message: "请选择状态", trigger: "blur" }],
        value2: [
          { required: true, message: "请选择明交输入金额", trigger: "blur" }
        ],
        checkbox: [
          { required: true, message: "请选择适用场景", trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    //上传文件类型判断
    beforeUpload(file) {
      var testmsg = file.name.substring(file.name.lastIndexOf(".") + 1);
      const extension = testmsg === "jpg";
      const extension2 = testmsg === "png";
      // const isLt2M = file.size / 1024 / 1024 < 10
      if (!extension && !extension2) {
        this.$message({
          message: "上传文件只能是 jpg、png格式!",
          type: "warning"
        });
      }
      // if(!isLt2M) {
      //     this.$message({
      //         message: '上传文件大小不能超过 10MB!',
      //         type: 'warning'
      //     });
      // }
      // return (extension || extension2) && isLt2M
      return extension || extension2;
    },
    async getmachine() {
      const loading = this.$loading({
          lock: true,
          text: 'Loading',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.1)'
        });
      this.$api
        .storeManagementList(this.Page)
        .then(res => {
          if (res.data.code == 200) {
            loading.close();
            // this.$message.success("查询成功");
            res.data.list.data.forEach(x => {
              if (x.status == "1") {
                x.status = true;
              } else {
                x.status = false;
              }
            });
            this.tableData = res.data.list.data;
            this.tableData_ = res.data.list.data;
            this.Page.count = res.data.list.total;
          } else {
            this.$api.error(res.data.msg);
          }
        })
        .catch(res => {
          console.log(res);

          this.$api.error();
        });
    },
    handleClick(tab, event) {
      tab.label == "第三方收款" ? (this.type = true) : (this.type = false);
    },
    // 修改状态
    onswitchType(row, e) {
      let type = null;
      if (row.row.status) {
        type = "1";
      } else {
        type = "0";
      }
      this.$api
        .changeType({
          params: {
            id: row.row.id,
            status: type
          }
        })
        .then(res => {
          if (res.data.code == 200) {
            this.$message.success(res.data.msg);
            this.getmachine();
          }
        })
        .catch(res => {
          console.log(res);
        });
    },
    search() {
      var data = {};
      if (this.value == 1) {
        data = { key_id: this.value, id: this.input };
      } else if (this.value == 2) {
        data = { key_id: this.value, keyword: this.input };
      }
      console.log(data);
      Object.assign(this.Page, data);
      this.getmachine();
    },
    // pos收款新增
    add() {
      this.ruleForm.id = "";
      this.title = "添加POS收款方式";
      this.dialogVisible = true;
    },
    // POS收款新增上传图片回掉函数
    handleAvatarSuccess(e) {
      if (e.code == 200) {
        this.ruleForm.pic = e.name;
      }
    },
    handlePictureCardPreview(e) {
      this.imgVisible = true;
    },
    handleRemove(e) {
      this.ruleForm.pic = "";
    },
    onexceed() {
      this.$message.error("只能上传一张图片");
    },
    // POS新增提交
    onconfirm() {
      this.click_key = true;
      setTimeout(() => {
        this.click_key = false;
      }, 1500);
      console.log(this.ruleForm);
      return;
      this.ruleForm.id
        ? this.$api
            .edit_2({
              params: {
                id: el.id
              }
            })
            .then(res => {
              if (res.data.code == 200) {
                this.$message.success(res.data.msg);
                this.this.getmachine();
              }
            })
            .catch(res => {
              console.log(res);
            })
        : this.$api
            .edit_2({
              params: {
                id: el.id
              }
            })
            .then(res => {
              if (res.data.code == 200) {
                this.$message.success(res.data.msg);
                this.this.getmachine();
              }
            })
            .catch(res => {
              console.log(res);
            });
    },
    // 取消POS新增
    oncancel() {
      this.dialogVisible = false;
      this.ruleForm.pic = "";
      this.ruleForm.file = [];
      this.title = "";
      this.$refs.upload.clearFiles();
      this.$refs.ruleForm.resetFields();
    },
    // 第三方收款取消
    oncancel_() {
      this.dialogVisible_ = false;
      this.title = "";
      this.$refs.ruleForm_.resetFields();
    },
    // 第三方收款修改
    onconfirm_() {
      this.click_key_ = true;
      setTimeout(() => {
        this.click_key_ = false;
      }, 1500);
      console.log(this.ruleForm_);
      return;
      this.$api
        .edit_2({
          params: {
            id: el.id
          }
        })
        .then(res => {
          if (res.data.code == 200) {
            this.$message.success(res.data.msg);
            this.this.getmachine();
          }
        })
        .catch(res => {
          console.log(res);
        });
    },
    // 第三方收款编辑
    edit_1(i, el) {
      // this.$router.push({ path: "./settingsAdd", query: { id: el.id } });
      this.title = "编辑第三方收款方式";
      this.dialogVisible_ = true;
      this.ruleForm_.id = el.id;
      this.$api
        .edit_2({ id: el.id })
        .then(res => {
          if (res.data.code == 200) {
            this.$message.success(res.data.msg);
            this.ruleForm_ = res.data.list.data;
          }
        })
        .catch(res => {
          console.log(res);
        });
    },
    // POS删除
    del(i, el) {
      this.$api
        .edit_2({
          params: {
            id: el.id
          }
        })
        .then(res => {
          if (res.data.code == 200) {
            this.$message.success(res.data.msg);
            const obj = {
              name: "food2.jpeg",
              url: res.data.list.thumb
            };
            this.ruleForm.files.push(obj);
            this.ruleForm = res.data.list.data;
          }
        })
        .catch(res => {
          console.log(res);
        });
    },
    // pos收款编辑
    edit_2(i, el) {
      this.title = "编辑POS收款方式";
      this.dialogVisible = true;
      this.ruleForm.id = el.id;
      this.$api
        .edit_2({
          params: {
            id: el.id
          }
        })
        .then(res => {
          if (res.data.code == 200) {
            this.$message.success(res.data.msg);
            const obj = {
              name: "food2.jpeg",
              url: res.data.list.thumb
            };
            this.ruleForm.files.push(obj);
            this.ruleForm = res.data.list.data;
          }
        })
        .catch(res => {
          console.log(res);
        });
    },
    // 分页
    handleCurrentChange(e) {
      this.Page.pagenum = e;
      this.getmachine(this.Page);
    },
    // 分页
    handleSizeChange(e) {
      this.Page.pagesize = e;
      this.getmachine(this.Page);
    }
  }
};
</script>
<style lang="less">
</style>