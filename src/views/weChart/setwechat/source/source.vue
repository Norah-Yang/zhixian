<template>
  <div>
    <el-row>
      <el-col :span="24">
        <el-card shadow="always">
          <el-button type="primary" @click="onaddmenu()" size="mini">添加</el-button>
          <div class="height"></div>
          <el-table border="" :data="tableData" style="width: 100%" stripe>
            <el-table-column label="图片" prop="resources">
              <template slot-scope="row">
                <div v-if="row.row.resources">
                  <el-image
                    style="width: 50px; height: 50px"
                    :src="row.row.resources"
                    fit="contain"
                  ></el-image>
                </div>
                <div v-else>暂无图片</div>
              </template>
            </el-table-column>
            <el-table-column label="文字" prop="content"></el-table-column>
            <el-table-column label="更新时间" prop="time"></el-table-column>
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
                <el-button size="small" type="info" @click="oneditone(row)" v-no-click>编辑</el-button>
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
        <el-form-item label="回复类型">
          <el-radio
            v-model="ruleForm.dev_id"
            :label="item.id"
            v-for="item in ruleForm.list"
            :key="item.id"
          >{{item.title}}</el-radio>
        </el-form-item>
        <el-form-item label="回复内容" v-if="ruleForm.dev_id==1||ruleForm.dev_id==3" prop="content">
          <el-input type="textarea" v-model="ruleForm.content" :rows="3"></el-input>
        </el-form-item>
        <el-form-item label="图片上传" v-if="ruleForm.dev_id==2||ruleForm.dev_id==3">
          <el-upload
            ref="upload"
            action="mapi/uploadPic"
            list-type="picture-card"
            :file-list="ruleForm.file"
            :limit="1"
            :headers="header"
            :on-remove="handleRemove"
            :on-success="AvatarSuccess"
            :on-exceed="onexceed"
            :before-upload="beforeUpload"
         accept=".jpg, .png"
          >
            <i class="el-icon-plus"></i>
          </el-upload>
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
        <el-button type="primary" @click="onconfirm" v-no-click v-if="!isedit">确定</el-button>
        <el-button type="primary" @click="oneditconfirm" v-no-click v-else>编辑</el-button>
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
      tableData: [],
      Page: {
        pagenum: 1,
        pagesize: 10,
        count: 0
      },
      header: {
        Authorization: sessionStorage.getItem("token") || ""
      },
      dialogVisible: false,
      ruleForm: {
        dev_id: 1,
        content: "",
        merchant_id: "",
        state: true,
        url: "",
        pics: "",
        pic: "",
        list: [
          { id: 1, title: "文本" },
          { id: 2, title: "图片" },
          { id: 3, title: "图文" }
        ],
        file: [],
        source_id: ""
      },
      rules: {
        count: [{ required: true, message: "请输入文本内容", trigger: "blur" }]
      }
      //   merchant_id
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
        .geteviewdev({
          params:this.Page
        })
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
            this.Page.count = res.data.count;
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
    onswitchType(row) {
      this.$api
        .getSource({
          source_id: row.row.id,
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
    onaddmenu() {
      this.dialogVisible = true;
    },
    AvatarSuccess(e) {
      if (e.code == 200) {
        this.ruleForm.pic = e.name;
        this.ruleForm.pics = e.pics;
        this.ruleForm.url = e.url;
      }
    },
    onexceed() {
      this.$message.error("只能上传一张图");
    },
    handleRemove() {
      this.ruleForm.pic = "";
    },
    onconfirm() {
      this.$api
        .getsubmitSource({
          dev_id: this.ruleForm.dev_id,
          content: this.ruleForm.content,
          merchant_id: this.ruleForm.merchant_id,
          state: this.ruleForm.state ? 1 : 0,
          url: this.ruleForm.url,
          pics: this.ruleForm.pics,
          pic: this.ruleForm.pic
        })
        .then(res => {
          if (res.data.code == 200) {
            this.ruleForm.content = "";
            this.ruleForm.state = true;
            this.ruleForm.url = "";
            this.ruleForm.pics = "";
            this.ruleForm.pic = "";
            this.ruleForm.file = [];
            this.dialogVisible = false;
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

      // getsubmitSource()
    },
    oncancel() {
      this.ruleForm.content = "";
      this.ruleForm.state = true;
      this.ruleForm.url = "";
      this.ruleForm.pics = "";
      this.ruleForm.pic = "";
      this.ruleForm.file = [];
      this.dialogVisible = false;
    },
    oneditone(row) {
      this.$api
        .geteditSource({
          params: {
            source_id: row.row.id
          }
        })
        .then(res => {
          if (res.data.code == 200) {
            this.ruleForm.content = res.data.data.content;
            this.ruleForm.dev_id = res.data.data.dev_id;
            this.ruleForm.state = res.data.data.state ? true : false;
            this.ruleForm.content = res.data.data.content;
            this.ruleForm.source_id = res.data.data.id;
            if (res.data.data.resources) {
              this.ruleForm.pic = res.data.data.resources;
              this.ruleForm.file.push({
                name: "123.jpg",
                url: res.data.data.resources
              });
            }
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
    oneditconfirm() {
         this.$api
        .getposteditSource(this.ruleForm)
        .then(res => {
          if (res.data.code == 200) {
             this.ruleForm.content = "";
      this.ruleForm.state = true;
      this.ruleForm.url = "";
      this.ruleForm.pics = "";
      this.ruleForm.pic = "";
      this.ruleForm.file = [];
      this.dialogVisible = false;
        this.isedit = false;
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
    // 点击了删除
    ondelGoods(row){
 this.$confirm('确认删除吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
                                 this.$api
        .getdelSource({
            source_id:row.row.id
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