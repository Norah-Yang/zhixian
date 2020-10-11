<template>
    <div>
        <el-row>
            <el-col :span="24">
                <el-card shadow="always">
                    <el-row>
                        <el-col>
                            <el-button type="primary" @click="onadd()" v-no-click size="mini">添加</el-button>
                            <el-select v-model="Page.place" placeholder="请选择" @change="onselect" class="select" size="mini">
                                <el-option
                                    v-for="item in ruleForm.list"
                                    :key="item.id"
                                    :label="item.name"
                                    :value="item.id"
                                ></el-option>
                            </el-select>
                            <div class="height"></div>
                        </el-col>
                    </el-row>
                    <el-table border="" :data="tableData" style="width: 100%" stripe>
                        <el-table-column label="Id" prop="id"></el-table-column>
                        <el-table-column label="广告名称" prop="name"></el-table-column>
                        <el-table-column label="广告图片">
                            <template slot-scope="row">
                                <div v-if="row.row.thumb">
                                    <el-image
                                        style="max-width: 250px; max-height:250px"
                                        :src="row.row.thumb"
                                        fit="scale-down"
                                    ></el-image>
                                </div>
                                <div v-else>暂无图片</div>
                            </template>
                        </el-table-column>
                        <el-table-column label="广告位置" prop="place"></el-table-column>
                        <el-table-column label="广告链接" prop="url"></el-table-column>
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
                <el-form-item label="广告名称" prop="name">
                    <el-input v-model="ruleForm.name" placeholder="请输入广告名称"></el-input>
                </el-form-item>
                <el-form-item label="广告链接" prop="url">
                    <el-input v-model="ruleForm.url" placeholder="请输入广告链接"></el-input>
                </el-form-item>
                <el-form-item label="广告位置">
                    <el-select v-model="ruleForm.place" placeholder="广告位置" @change="onselect">
                        <el-option
                            v-for="item in ruleForm.list"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="排序">
                    <el-input v-model.number="ruleForm.sort"></el-input>
                </el-form-item>
                <el-form-item label="广告图片">
                    <el-upload
                        ref="upload"
                        :action="$uplaadUrl"
                        list-type="picture-card"
                        :file-list="ruleForm.file"
                        :limit="1"
                        :headers="header"
                        :on-remove="handleRemoveNavigation"
                        :on-success="AvatarSuccessNavigation"
                        :on-exceed="onexceedNavigation"
                        :before-upload="beforeUpload"
         accept=".jpg, .png"
                    >
                        <i class="el-icon-plus"></i>
                    </el-upload>
                </el-form-item>
                <el-form-item label="是否显示">
                    <el-switch
                        v-model="ruleForm.status"
                        active-color="#008080"
                        inactive-color="#ff4949"
                        active-text="是"
                        inactive-text="否"
                    ></el-switch>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="oncancel" v-no-click size="mini">取消</el-button>
                <el-button type="primary" @click="onconfirm" v-no-click v-if="!isedit" size="mini">确 定</el-button>
                <el-button type="primary" @click="onedit" v-no-click v-else size="mini">修改</el-button>
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
      header: {
        Authorization: sessionStorage.getItem("token") || ""
      },
      Page: {
        pagenum: 1,
        pagesize: 10,
        count: 0,
        place: ""
      },
      ruleForm: {
        name: "",
        sort: 99,
        status: true,
        id: "",
        list: [],
        place: "",
        url: "",
        thumb: "",
        file: []
      },
      rules: {
        name: [
          { required: true, message: "请输入广告名称", trigger: "blur" },
          { min: 2, message: "长度最少2字符", trigger: "blur" }
        ],
        url: [{ required: true, message: "请输入广告链接", trigger: "blur" }]
      }
    };
  },
  // 方法
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
    getweiOrder() {
      this.$api
        .getweiAdvertisingSetting({
          params: this.Page
        })
        .then(res => {
          if (res.data.code == 200) {
            console.log(res.data);

            res.data.list.data.forEach(x => {
              if (x.status == 1) {
                x.status = true;
              } else {
                x.status = false;
              }
            });
            this.tableData = res.data.list.data;
            this.Page.count = res.data.list.total;
            this.ruleForm.list = res.data.arr;
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
      this.dialogVisible = true;
    },
    onconfirm() {
      this.$refs.ruleForm.validate(valid => {
        if (!valid) return;
        if (this.ruleForm.place == "") {
          this.$message.error("请选择广告位置");
          return;
        }
        this.$api
          .getweiAdvertisingAddSetting({
            name: this.ruleForm.name,
            url: this.ruleForm.url,
            sort: this.ruleForm.sort,
            thumb: this.ruleForm.thumb,
            place: this.ruleForm.place,
            status: this.ruleForm.status ? 1 : 0
          })
          .then(res => {
            if (res.data.code == 200) {
              this.$message.success(res.data.msg);
              this.ruleForm = {
                name: "",
                sort: 99,
                status: true,
                id: "",
                place: "",
                thumb: "",
                url: "",
                file: []
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
        name: "",
        sort: 99,
        status: true,
        id: "",
        place: "",
        thumb: "",
        url: "",
        file: [],
        id: ""
      };
      this.isedit = false;
      this.dialogVisible = false;
      this.$refs.ruleForm.resetFields();
    },
    oneditone(row) {
      this.$api
        .getweiAdvertisingUpdateSetting({
          params: {
            id: row.row.id
          }
        })
        .then(res => {
          if (res.data.code == 200) {
            this.isedit = true;
            this.dialogVisible = true;
            this.ruleForm.id = row.row.id;
            this.ruleForm.name = res.data.list.name;
            this.ruleForm.sort = res.data.list.sort;
            this.ruleForm.status = res.data.list.status == 1 ? true : false;
            this.ruleForm.place = parseInt(res.data.list.place);
            this.ruleForm.url = res.data.list.url;
            if (res.data.list.thumb) {
              this.ruleForm.file = [];
              this.ruleForm.thumb = res.data.list.thumb;
              this.ruleForm.file.push({
                name: "12131",
                url: res.data.list.thumb
              });
            }
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
        if (this.ruleForm.place == "") {
          this.$message.error("请选择广告位置");
          return;
        }
        this.$api
          .getweiAdvertisingUpdateSettings({
            name: this.ruleForm.name,
            url: this.ruleForm.url,
            sort: this.ruleForm.sort,
            thumb: this.ruleForm.thumb,
            place: this.ruleForm.place,
            status: this.ruleForm.status ? 1 : 0,
            id: this.ruleForm.id
          })
          .then(res => {
            if (res.data.code == 200) {
              this.$message.success(res.data.msg);
            this.ruleForm.name=""
            this.ruleForm.sort=99
            this.ruleForm.status=true
            this.ruleForm.id=""
            this.ruleForm.place=""
            this.ruleForm.thumb=""
            this.ruleForm.url=""
            this.ruleForm.file=[]
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
    ondelGoods(row) {
      this.$confirm("此操作将永久删除, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$api
            .getweiAdvertisingDelSetting({
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
        .getweiAdvertisingStatusSetting({
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
    onselect() {
      this.getweiOrder();
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