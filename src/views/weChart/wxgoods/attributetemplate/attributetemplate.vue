
<template>
  <div>
    <el-row>
      <el-col :span="24">
        <el-card shadow="always">
          <el-alert title="属性模板仅适用于加工商品" type="info" show-icon></el-alert>
          <div class="height"></div>
          <el-row>
              <el-select v-model="Page.shop_id" placeholder="优惠券类型" style="margin-right:10px" size="mini">
                <el-option
                  v-for="item in shop"
                  :key="item.id"
                  :label="item.title"
                  :value="item.id"
                ></el-option>
              </el-select>
              <el-select v-model="Page.id" placeholder="优惠券类型" size="mini">
                <el-option
                  v-for="item in attributetemplate.type"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
              <el-input
                placeholder="请输入内容"
                v-model="Page.keyword"
                clearable
                size="mini"
                class="input-with-select"
              >
                <el-button slot="append" icon="el-icon-search" @click="onserch" size="mini"></el-button>
              </el-input>
              <el-button type="danger" @click="onclears" size="mini">清除搜索</el-button>
              <el-button type="primary" @click="onaddClass" size="mini">添加</el-button>
          </el-row>
          <div class="height"></div>
          <el-table border="" :data="tableData" style="width: 100%" stripe>
            <el-table-column label="商品属性" prop="name"></el-table-column>
            <el-table-column label="模板内容">
              <template slot-scope="row">
                <div class="goods_list">
                  <div v-for="item in row.row.note" :key="item.id">
                    <span>{{item.name}}</span>
                    <span>{{item.title}}</span>
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column>
              <template slot-scope="row">
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
    <!-- 商品模板添加 -->
    <el-dialog
      title="商品列表"
      :visible="dialogVisible"
      width="50%"
      :show-close="false"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <el-form :model="ruleForm" :rules="rules" ref="ruleForms" label-width="130px">
        <el-form-item label="模板名称">
          <el-input v-model.trim="ruleForm.name" placeholder="模板名称"></el-input>
        </el-form-item>
        <el-form-item label="模板名称">
          <div v-for="(item,index) in ruleForm.attribute" :key="index">
            <div class="iten_name">
              <el-input v-model="item.name" placeholder="属性名" style="width:80%">
                <i
                  slot="suffix"
                  class="el-input__icon el-icon-close"
                  @click="onattribute(index)"
                  v-if="index!=0"
                ></i>
              </el-input>
            </div>
            <template v-for="(items,i) in item.title">
              <el-input v-model="items.title" placeholder="属性值" :key="i" class="input_list">
                <i
                  slot="suffix"
                  class="el-input__icon el-icon-close"
                  @click="ondelinput(index,i)"
                  v-if="i!=0"
                ></i>
              </el-input>
            </template>
            <div>
              <el-button size="small" type="primary" @click="onaddinput(index)">添加</el-button>
            </div>
          </div>
          <div>
            <el-button size="small" type="primary" @click="onaddattribute()">添加属性项目</el-button>
          </div>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="oncancel" v-no-click>取 消</el-button>
        <el-button type="primary" @click="onconfirm" v-no-click v-if="!isedit">提交</el-button>
        <el-button type="primary" @click="onconfirmisEdit" v-no-click v-else>修改</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { attributetemplate } from "@/common/select.js";
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
      shop:"",
      editId: "",
      isedit: false,
      visiblessss: true,
      dialogVisible: false,
      attributetemplate,
      tableData: [],
      Page: {
        pagenum: 1,
        pagesize: 10,
        count: 0,
        id: "",
        keyword: "",
        shop_id:""
      },
      ruleForm: {
        name: "",
        attribute: [
          {
            name: "",
            title: [
              {
                title: ""
              }
            ]
          }
        ]
      },
      rules: {}
    };
  },
  // 方法
  methods: {
          getshops(){
         this.$api
        .getshops({}) .then(res => {
          if (res.data.code == 200) {
            this.shop=res.data.shop
            if(res.data.shop.length>0){
            this.Page.shop_id=res.data.shop[0].id
            }

             this.getweiAttribute();

          } else {
            this.$message.error(res.data.msg);
          }
        })
        .catch(res => {
          this.$api.error();
          console.log(res);
        });
    },
    getweiAttribute() {
      this.$api
        .getweiAttribute(this.Page)
        .then(res => {
          if (res.data.code == 200) {
            this.tableData = res.data.list;
            this.Page.count = res.data.count;
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
      this.getweiAttribute();
    },
    // 分页
    handleSizeChange(e) {
      this.Page.pagesize = e;
      this.getweiAttribute();
    },
    onclears() {
      this.Page.pagenum = 1;
      this.Page.pagesize = 10;
      this.Page.id = "";
      this.Page.keyword = "";
    },
    // 点击了搜索
    onserch() {
      this.Page.pagenum = 1;
      this.Page.pagesize = 10;
      this.getweiAttribute();
    },
    // 点击取消
    oncancel() {},
    // 点击了确定
    onconfirm() {
      let data = this.$_.cloneDeep(this.ruleForm);
      if (this.ruleForm.name == "") {
        this.$message.error("请输入模板名称");
        return;
      }
      let isreturn = false;
      this.ruleForm.attribute.map((x, index) => {
        if (x.name == "") {
          isreturn = 1;
        }
        data.attribute[index].arr = [];
        x.title.map(v => {
          if (v.title == "") {
            isreturn = 2;
          }
          data.attribute[index].arr.push(v.title);
        });
      });
      if (isreturn == 1) {
        this.$message.error("请输入属性名");
        return;
      } else if (isreturn == 2) {
        this.$message.error("请输入属性值");
        return;
      }
      data.attribute.map((x, index) => {
        data.attribute[index].title = data.attribute[index].arr.join(",");
      });
      let { name, attribute } = data;
      attribute = JSON.stringify(attribute);
      this.$api
        .getweiAttributeAdd({
          name,
          attribute,
          shop_id:this.Page.shop_id
        })
        .then(res => {
          if (res.data.code == 200) {
            this.dialogVisible = false;
            this.ruleForm = {
              name: "",
              attribute: [
                {
                  name: "",
                  title: [
                    {
                      title: ""
                    }
                  ]
                }
              ]
            };
            this.getweiAttribute();
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
    },
    onaddinput(index) {
      if (this.ruleForm.attribute[index].title.length > 7) {
        this.$message({
          message: "属性值最多为8个",
          type: "warning"
        });
        return;
      }
      this.ruleForm.attribute[index].title.push({
        title: ""
      });
      console.log(index);
    },
    onaddattribute() {
      this.ruleForm.attribute.push({
        name: "",
        title: [
          {
            title: ""
          }
        ]
      });
    },
    // 点击删除input
    ondelinput(index, i) {
      this.ruleForm.attribute[index].title.splice(i, 1);
    },
    onattribute(index) {
      this.$confirm("确定删除这一行吗, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.ruleForm.attribute.splice(index, 1);
        })
        .catch(() => {});
    },
    oneditone(row) {
      this.isedit = true;
      this.editId = row.row.id;
      this.$api
        .getweiAttributeUpdate({
          params: {
            id: row.row.id
          }
        })
        .then(res => {
          if (res.data.code == 200) {
            let obj1 = {};
            obj1.name = res.data.list.name;
            obj1.attribute = [];
            res.data.list.sub.map((x, index) => {
              let obg = {};
              obg.name = x.name;
              obj1.attribute.push(obg);
              obj1.attribute[index].title = [];
              x.title.split(",").map(v => {
                let obj = {};
                obj.title = v;
                obj1.attribute[index].title.push(obj);
              });
            });
            this.ruleForm = obj1;
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
    // 点击了取消
    oncancel() {
      this.ruleForm = {
        name: "",
        attribute: [
          {
            name: "",
            title: [
              {
                title: ""
              }
            ]
          }
        ]
      };
      this.isedit = false;
      this.dialogVisible = false;
    },
    onconfirmisEdit() {
      let data = this.$_.cloneDeep(this.ruleForm);
      if (this.ruleForm.name == "") {
        this.$message.error("请输入模板名称");
        return;
      }
      this.ruleForm.attribute.map((x, index) => {
        if (x.name == "") {
          this.$message.error("请输入属性名");
          return;
        }
        data.attribute[index].arr = [];
        x.title.map(v => {
          if (v.title == "") {
            this.$message.error("请输入属性值");
            return;
          }
          data.attribute[index].arr.push(v.title);
        });
      });

      data.attribute.map((x, index) => {
        data.attribute[index].title = data.attribute[index].arr.join(",");
      });
      let { name, attribute } = data;
      attribute = JSON.stringify(attribute);
      console.log(this.ruleForm);
      this.$api
        .getweiAttributeUpdates({
          name,
          attribute,
          id: this.editId
        })
        .then(res => {
          if (res.data.code == 200) {
            this.dialogVisible = false;
            this.isedit = false;
            this.getweiAttribute();
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
    ondelGoods(row) {
      this.$confirm("确定删除这一行吗, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$api
            .getweiAttributeDel({
              params: {
                id: row.row.id
              }
            })
            .then(res => {
              if (res.data.code == 200) {
                this.$message.success(res.data.msg);
                this.getweiAttribute();
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
    //
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
.goods_list {
  font-size: 16px;
  div:nth-child(odd) {
    background: #ecf0f5;
  }
  div span {
    margin-right: 10px;
    font-size: 14px;
  }
}
.input-with-select {
  width: 25%;
  margin: 0 10px;
}
.el-input__icon {
  cursor: pointer;
}
.input_list {
  width: 23%;
  margin: 0 5px 5px 0;
}
.iten_name {
  margin-bottom: 10px;
}
</style>