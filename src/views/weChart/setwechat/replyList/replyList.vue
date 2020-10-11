<template>
  <div>
    <el-row>
      <el-col :span="24">
        <el-card shadow="always">
          <el-row>
            <el-col>
              <el-button type="primary" @click="onadd" size="mini">新增</el-button>
            </el-col>
          </el-row>
          <div class="height"></div>
          <el-table border="" :data="tableData" style="width: 100%" stripe>
            <el-table-column label="关键词" prop="keyword"></el-table-column>
            <el-table-column label="关键词类型" prop="type"></el-table-column>
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
        <el-form-item label="关键词" prop="keyword">
          <el-input v-model="ruleForm.keyword"></el-input>
        </el-form-item>
        <el-form-item label="回复类型">
          <el-radio
            v-model="ruleForm.dev_id"
            :label="item.id"
            v-for="item in ruleForm.list"
            :key="item.id"
          >{{item.title}}</el-radio>
        </el-form-item>
        <el-form-item label="回复类型" v-if="ruleForm.dev_id==3">
          <el-button type="primary" @click="addSource" v-no-click>添加图文</el-button>
        </el-form-item>
        <el-form-item label="回复内容" v-if="ruleForm.dev_id==1">
          <el-input type="textarea" v-model="ruleForm.content" :rows="3"></el-input>
        </el-form-item>
        <el-form-item label="图片上传" v-if="ruleForm.dev_id==2">
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
        <el-button type="primary" @click="oneditconfirm" v-no-click v-else>修改</el-button>
      </span>
      <el-dialog
        title="选择图文"
        :visible="sonDialogVisible"
        width="50%"
        :show-close="false"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        append-to-body
      >
        <el-table
          @selection-change="handleSelectionChange"
          border=""
          :data="tableDatas"
          style="width: 100%"
          stripe
        >
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column label="id" prop="id"></el-table-column>
          <el-table-column label="图片" prop="resources">
            <template slot-scope="row">
              <el-image style="width: 50px; height: 50px" :src="row.row.resources" fit="contain"></el-image>
            </template>
          </el-table-column>
          <el-table-column label="文本内容" prop="content"></el-table-column>
          <el-table-column label="更新时间" prop="time"></el-table-column>
        </el-table>
        <div class="height"></div>
        <div class="pagination">
          <el-pagination
            @size-change="handleSize"
            @current-change="handleCurrent"
            :page-sizes="[10, 12, 15, 20]"
            layout="total, sizes, prev, pager, next, jumper"
            :total="ruleForm.count"
          ></el-pagination>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="oncancelson" v-no-click>取 消</el-button>
          <el-button type="primary" @click="onconfirmson" v-no-click>确 定</el-button>
        </span>
      </el-dialog>
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
      isedit:false,
      tableData: [],
      tableDatas: [],
      Page: {
        pagenum: 1,
        pagesize: 10,
        count: 0
      },
      dialogVisible: false,
      sonDialogVisible: false,
      ruleForm: {
        keyword: "",
        merchant_id: "",
        list: [
          { id: 1, title: "文本" },
          { id: 2, title: "图片" },
          { id: 3, title: "图文" }
        ],
        dev_id: 1,
        content: "",
        state: true,
        tableData: [],
        count: 0,
        pagenum: 1,
        pagesize: 10,
        select: [],
        file: [],
        pic: "",
        url: "",
        id:"",
        keyword_id:"",
        pics:''
      },
      rules: {
        keyword: [{ required: true, message: "请输入关键词", trigger: "blur" }]
      },
      header: {
        Authorization: sessionStorage.getItem("token") || ""
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
        .getreplyList({
          params: this.Page
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
    // 点击了添加图文
    addSource() {
      this.$api
        .getSource({
          params: {
            pagenum: this.ruleForm.pagenum,
            pagesize: this.ruleForm.pagesize,
            dev_id: this.ruleForm.dev_id
          }
        })
        .then(res => {
          if (res.data.code == 200) {
            this.sonDialogVisible = true;
            this.ruleForm.tableData = res.data.data;
            this.tableDatas = res.data.data;

            this.ruleForm.count = res.data.count;
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
    // 分页
    handleSize(e) {
      this.ruleForm.pagesize = e;
      this.addSource();
    },
    // 分页
    handleCurrent(e) {
      this.ruleForm.pagenum = e;
      this.addSource();
    },
    onadd() {
      this.dialogVisible = true;
    },
    handleSelectionChange(e) {
      this.ruleForm.select = e;
    },
    // 点击了确实能够事件
    onconfirmson() {
      if (this.ruleForm.select.length == 0) {
        this.$message.error("请选择图文");
        return;
      }
      if (this.ruleForm.select.length > 1) {
        this.$message.error("图文只能选择一个");
        return;
      }
      this.sonDialogVisible = false;
    },
    oncancelson() {
      this.sonDialogVisible = false;
    },
    onexceed() {
      this.$message.error("图片只能上传一个");
    },
    // 图片上传成功
    AvatarSuccess(e) {
      if (e.code == 200) {
        this.ruleForm.pic = e.name;
        this.ruleForm.url = e.url;
        this.ruleForm.pics = e.pics;
        
      }
    },
    onconfirm() {
      this.$refs.ruleForm.validate(valid => {
        if (!valid) return;
        this.$api
          .getpostKeyword({
            merchant_id: this.ruleForm.merchant_id,
            keyword: this.ruleForm.keyword,
            dev_id: this.ruleForm.dev_id,
            content: this.ruleForm.content,
            state: this.ruleForm.state ? 1 : 0,
            pic: this.ruleForm.pic,
            url: this.ruleForm.url,
            sid: this.ruleForm.select.length ? this.ruleForm.select[0].id : "",
            pics: this.ruleForm.pics
          })
          .then(res => {
            if (res.data.code == 200) {
              this.ruleForm.keyword = "";
              this.ruleForm.dev_id = "";
              this.ruleForm.content = "";
              this.ruleForm.state = true;
              this.ruleForm.pic = "";
              this.ruleForm.url = "";
              this.dialogVisible = false;
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
    // 点击了删除图片
    handleRemove(e) {
      this.ruleForm.pic = "";
    },
    onswitchType(row) {
      this.$api
        .getswithreplyList({
          rid: row.row.id,
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
    // 点击了取消
    oncancel() {
      this.ruleForm.keyword = "";
      this.ruleForm.dev_id = "";
      this.ruleForm.content = "";
      this.ruleForm.state = true;
      this.ruleForm.pic = "";
      this.ruleForm.url = "";
      this.dialogVisible = false;
        this.isedit=false
      this.$refs.ruleForm.resetFields();
    },
    oneditone(row){
       this.ruleForm.keyword_id= row.row.id
         this.$api
        .geteditKeyword({
         params:{
            keyword_id: row.row.id,
         }
        })
        .then(res => {
          if (res.data.code == 200) {
                   this.isedit=true
      this.ruleForm.keyword =res.data.data.keyword;
      this.ruleForm.dev_id =res.data.data.dev_id;
      this.ruleForm.content =res.data.data.content;
      this.ruleForm.pic = res.data.data.resources;
      this.ruleForm.title = res.data.data.title;
      this.ruleForm.sid = res.data.data.sid;
      this.ruleForm.id = res.data.data.id;
              if(res.data.data.resources){
                this.ruleForm.file.push({
                  name:"1213.jpg",
                  url:res.data.data.resources
                })
              }
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
    oneditconfirm(){
      let sid=''
      if(this.ruleForm.sid){
          sid=this.ruleForm.sid
      }else{
         sid= this.ruleForm.select.length ? this.ruleForm.select[0].id : ""
      }
                  this.$api
        .geteditKeywords({
          keyword_id: this.ruleForm.keyword_id,
          state: this.ruleForm.state ? 1 : 0,
   merchant_id: this.ruleForm.merchant_id,
            keyword: this.ruleForm.keyword,
            dev_id: this.ruleForm.dev_id,
            content: this.ruleForm.content,
            state: this.ruleForm.state ? 1 : 0,
            pic: this.ruleForm.pic,
            url: this.ruleForm.url,
            sid,
            
        })
        .then(res => {
          if (res.data.code == 200) {
            this.$message.success(res.data.msg);
         this.ruleForm.keyword = "";
      this.ruleForm.dev_id = "";
      this.ruleForm.content = "";
      this.ruleForm.state = true;
      this.ruleForm.pic = "";
      this.ruleForm.url = "";
      this.dialogVisible = false;
      this.ruleForm.file=[]
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
    ondelGoods(row){
       this.$confirm('确认删除吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
                                 this.$api
        .getdelKeyword({
            keyword_id:row.row.id
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
