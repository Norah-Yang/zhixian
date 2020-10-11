
<template>
  <div class="goods_wapper">
    <el-row>
      <el-col :span="24">
        <el-card shadow="always">
          <el-row>
            <el-col :span="24">
              <el-button type="primary" @click="onaddGoods" v-no-click  size="mini">添加分类</el-button>
                   <el-select v-model="shop_id" placeholder="店铺" style="margin-left:10px" @change="getcate"  size="mini">
                        <el-option
                            v-for="item in shop"
                            :key="item.id"
                            :label="item.title"
                            :value="item.id"
                        ></el-option>
                    </el-select>
            </el-col>
          </el-row>
          <div class="height"></div>
          <el-table border="" :data="tableData" style="width: 100%" stripe>
            <el-table-column label="商品分类ID" prop="id"></el-table-column>
            <el-table-column label="商品名称" prop="title"></el-table-column>
            <el-table-column label="分类介绍" prop="content">
              <template slot-scope="row">
                <div v-if="row.row.content">{{row.row.content}}</div>
                <div v-else>暂无描述</div>
              </template>
            </el-table-column>
            <el-table-column label="分类图片" prop="thumb">
              <template slot-scope="row">
                <div v-if="row.row.thumb">
                  <el-image style="width: 50px; height: 50px" :src="row.row.thumb" fit="contain"></el-image>
                </div>
                <div v-else>无图</div>
              </template>
            </el-table-column>
            <el-table-column label="是否显示" prop="type">
              <template slot-scope="row">
                <el-switch
                  v-model="row.row.value"
                  active-color="#008080"
                  inactive-color="#ff4949"
                  active-text="是"
                  inactive-text="否"
                  @change="onswitchType(row)"
                ></el-switch>
              </template>
            </el-table-column>
            <el-table-column label="排序" prop="sort"></el-table-column>
            <el-table-column label="操作" width="150px">
              <template slot-scope="row">
                <!-- <el-button size="small" type="primary" @click="onaddClass(row)">添加</el-button> -->
                <el-button size="mini" type="info" @click="oneditone(row)" v-no-click>编辑</el-button>
                <el-button size="mini" type="danger" @click="ondelGoods(row)" v-no-click>删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
    </el-row>
    <!--  添加对话框-->
    <el-dialog
      :title="title"
      :visible="dialogVisible"
      width="30%"
      :show-close="false"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="120px"
        class="demo-ruleForm"
      >
        <el-form-item label="商品分类名称" prop="name">
          <el-input v-model="ruleForm.name"></el-input>
        </el-form-item>
        <el-form-item label="分类介绍">
          <el-input type="textarea" v-model="ruleForm.desc" :rows="3"></el-input>
        </el-form-item>
        <el-form-item label="排序">
          <el-input v-model="ruleForm.sort" type="number"></el-input>
        </el-form-item>
        <el-form-item label="访问地址">
          <el-input v-model.number="ruleForm.url" placeholder="http://"></el-input>
        </el-form-item>
        <el-form-item label="是否展示">
          <el-switch
            v-model="ruleForm.value"
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
        <el-button type="primary" @click="onconfirm" v-no-click>确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog :visible.sync="imgVisible" width="30%">
      <img width="100%" :src="ruleForm.pic" alt="">
    </el-dialog>
  </div>
</template>
<script>
export default {
  // props:[],
  // 页面加载
  created() {
   
    this.getshops()
  },
  // 页面加载完成
  mounted() {},
  data() {
    return {
      shop:[],
      shop_id:"",
      title: "",
      header: {
        Authorization: sessionStorage.getItem("token") || ""
      },
      isRepeat: false, //去除重复点击变量
      tableData: [],
      isclass: false,
      value: true,
      dialogVisible: false,
      imgVisible: false,
      ruleForm: {
        name: "",
        sort: "",
        value: true,
        pic: "",
        desc: "",
        url: "",
        parent_id: "",
        file: [],
        id: ""
      },
      isedit: false,
      rules: {
        name: [
          { required: true, message: "请输入商品分类名称", trigger: "blur" },
          { min: 1, max: 15, message: "长度在 2 到 15 个字符", trigger: "blur" }
        ]
      },
      limit: 1
    };
  },
  // 方法
  methods: {
    //上传文件类型判断
    beforeUpload(file) {
      var testmsg = file.name.substring(file.name.lastIndexOf(".") + 1);
      const extension = testmsg === "jpg";
      const extension2 = testmsg === "png";
      if (!extension && !extension2) {
        this.$message({
          message: "上传文件只能是 jpg、png格式!",
          type: "warning"
        });
      }
      return extension || extension2;
    },
    getshops(){
         this.$api
        .getshops({}) .then(res => {
          if (res.data.code == 200) {
            this.shop=res.data.shop
            if(res.data.shop.length>0){
            this.shop_id=res.data.shop[0].id
            }
             this.getcate();
          } else {
            this.$message.error(res.data.msg);
          }
        })
        .catch(res => {
          this.$api.error();
          console.log(res);
        });
    },
    getcate() {
      this.$api
        .getcate({
          params:{
            shop_id:this.shop_id
          }
        })
        .then(res => {
          console.log(res)
          if (res.data.code == 200) {
            // 处理开关布尔值切换问题
            res.data.sort.forEach(x => {
              if (x.type == 1) {
                x.value = true;
              } else {
                x.value = false;
              }
              // if (x.subcate.length > 0) {
              //   x.subcate.forEach(x => {
              //     if (x.type == 1) {
              //       x.value = true;
              //     } else {
              //       x.value = false;
              //     }
              //   });
              // }
            });
            this.tableData = res.data.sort;
            // console.log(this.tableData);
          } else {
            this.$message.error(res.data.msg);
          }
        })
        .catch(res => {
          this.$api.error();
          console.log(res);
        });
    },
    // 开关切换回掉函数
    onswitchType(row, e) {
      let type = null;
      if (row.row.value) {
        type = "1";
      } else {
        type = "0";
      }
      this.$api
        .getcateType({
          params: {
            id: row.row.id,
            type: type
          }
        })
        .then(res => {
          console.log(res);
          if (res.data.code == 200) {
            this.$message.success(res.data.msg);
            this.getcate();
          }
        })
        .catch(res => {
          console.log(res);
        });
    },
    // 删除商品
    ondelGoods(row) {
      // 去除重复点击
      if (this.isRepeat) return;
      this.isRepeat = true;
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$api
            .getcateDel({
              params: {
                id: row.row.id
              }
            })
            .then(res => {
              this.isRepeat = false;
              if (res.data.code == 200) {
                this.$message.success(res.data.msg);
                this.getcate();
              } else {
                this.$message.error(res.data.msg);
              }
            })
            .catch(res => {
              this.$message.error("网络错误");
            });
        })
        .catch(() => {
          this.isRepeat = false;
        });
    },
    // 添加商品
    onaddGoods() {
      this.title = "添加商品分类";
      this.dialogVisible = true;
    },
    // 点击了添加二级上商品分类
    onaddClass(row) {
      this.title = "添加商品分类";
      this.ruleForm.parent_id = row.row.id;
      this.isclass = true;
      this.dialogVisible = true;
    },
    // 上传图片回掉函数
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
    // /点击确定添加分类
    onconfirm() {
      // 去除重复点击
      if (this.isRepeat) return;
      this.isRepeat = true;
      this.$refs.ruleForm.validate(valid => {
        if (!valid) return;
        let value = "";
        if (this.ruleForm.value) {
          value = "1";
        } else {
          value = "0";
        }
        // 判断是修改还是添加
        if (this.isedit) {
          // 修改分类
          let values = null;
          if (this.ruleForm.value) {
            values = "1";
          } else {
            values = "0";
          }
          this.$api
            .getupdateCates({
              title: this.ruleForm.name,
              sort: this.ruleForm.sort,
              content: this.ruleForm.desc,
              url: this.ruleForm.url,
              type: values,
              thumb: this.ruleForm.pic,
              id: this.ruleForm.id
            })
            .then(res => {
              this.isRepeat = false;
              this.isedit = false;
              if (res.data.code == 200) {
                this.$message.success(res.data.msg);
                this.dialogVisible = false;
                this.ruleForm.name = "";
                this.ruleForm.sort = "";
                this.ruleForm.desc = "";
                this.ruleForm.url = "";
                this.ruleForm.pic = "";
                this.ruleForm.file = [];
                this.$refs.upload.clearFiles();
                this.getcate();
              } else {
                this.$message.error(res.data.msg);
              }
            })
            .catch(res => {
              console.log(res);
            });
        } else {
          // 添加分类
          // 判断是添加一级分类还是二级分类
          let promise = null;
          if (this.isclass) {
            promise = this.$api.getaddCateTwo({
              title: this.ruleForm.name,
              sort: this.ruleForm.sort,
              content: this.ruleForm.desc,
              url: this.ruleForm.url,
              type: value,
              thumb: this.ruleForm.pic,
              parent_id: this.ruleForm.parent_id
            });
            this.isclass = false;
          } else {
            promise = this.$api.getaddCateOnee({
              title: this.ruleForm.name,
              sort: this.ruleForm.sort,
              content: this.ruleForm.desc,
              url: this.ruleForm.url,
              type: value,
              thumb: this.ruleForm.pic,
              shop_id:this.shop_id
            });
          }
          promise
            .then(res => {
              this.isRepeat = false;
              if (res.data.code == 200) {
                this.$message.success(res.data.msg);
                this.dialogVisible = false;
                this.ruleForm.name = "";
                this.ruleForm.sort = "";
                this.ruleForm.desc = "";
                this.ruleForm.url = "";
                this.ruleForm.pic = "";
                this.ruleForm.file = [];
                this.$refs.upload.clearFiles();
                this.getcate();
              } else {
                this.$message.error(res.data.msg);
              }
            })
            .catch(res => {
              console.log(res);
            });
        }
      });
    },
    // 点击了取消
    oncancel() {
      this.dialogVisible = false;
      this.isedit = false;
       this.$refs.upload.clearFiles();
      this.$refs.ruleForm.resetFields();
      this.ruleForm.name = "";
      this.ruleForm.sort = "";
      this.ruleForm.desc = "";
      this.ruleForm.url = "";
      this.ruleForm.pic = "";
      this.ruleForm.file = [];
     
    },
    onexceed() {
      this.$message.error("只能上传一张图片");
    },
    // 编辑一级分类
    oneditone(row) {
      this.title = "修改商品分类";
      // 去除重复点击
      if (this.isRepeat) return;
      this.isRepeat = true;
      this.isedit = true;
      this.ruleForm.id = row.row.id;
      this.$api
        .getupdateCate({
          params: {
            id: row.row.id
          }
        })
        .then(res => {
          this.isRepeat = false;
          if (res.data.code == 200) {
            if (res.data.data.type == "1") {
              this.ruleForm.value = true;
            } else {
              this.ruleForm.value = false;
            }
            this.ruleForm.name = res.data.data.title;
            this.ruleForm.sort = res.data.data.sort;
            this.ruleForm.desc = res.data.data.content;
            this.ruleForm.url = res.data.data.url;
            this.ruleForm.pic = res.data.data.thumb;
            if (res.data.data.thumb) {
              let obg = {
                name: "img",
                url: res.data.data.thumb
              };
              this.ruleForm.file.push(obg);
            }
            this.dialogVisible = true;
          }
        })
        .catch(res => {
          console.log(res);
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
.goods_wapper /deep/ .el-table__expanded-cell {
  padding: 5px 0;
  border-right: none;
  border-left: none;
}
</style>

