<template>
  <div>
    <el-card>
      <el-row>
        <el-col :span="24">
          <el-form :model="ruleForm" :rules="rules" ref="ruleForms" label-width="130px">
            <el-form-item label="商品名称" v-if="!isedit">
              <el-button
                type="primary"
                icon="el-icon-circle-plus-outline"
                size="small"
                @click="ontable"
                v-no-click
              >{{btnTitle}}</el-button>
            </el-form-item>
            <el-form-item label="商品名称" v-if="isedit">
              <el-input v-model="ruleForm.name" placeholder="商品名称"></el-input>
            </el-form-item>
            <el-form-item label="商品描述" prop="intro">
               <el-input type="textarea" v-model="ruleForm.intro" :rows="3" placeholder="商品描述"></el-input>
            </el-form-item>
            <el-form-item label="商品标签">
              <div class="input_box">
                <el-input v-model="ruleForm.names[0].name" placeholder="输入如正品保证" style="width:20%"></el-input>
                <div class="height"></div>
                <el-input
                  v-model="ruleForm.names[1].name"
                  placeholder="输入如支持7天退换"
                  style="width:20%"
                ></el-input>
                <div class="height"></div>
                <el-input
                  v-model="ruleForm.names[2].name"
                  placeholder="输入如24小时发货"
                  style="width:20%"
                ></el-input>
                <div class="height"></div>
                <el-input v-model="ruleForm.names[3].name" placeholder="输入如极速退款" style="width:20%"></el-input>
              </div>
            </el-form-item>
            <el-form-item label="消耗积分" prop="score">
              <el-input v-model="ruleForm.score" placeholder="请输入积分" type="number"></el-input>
            </el-form-item>
            <el-form-item label="限购数量" prop="limit_amount">
              <el-input
                v-model="ruleForm.limit_amount"
                placeholder="（输入正整数，默认为零时不限制购买数量）"
                type="number"
              ></el-input>
            </el-form-item>
            <el-form-item label="限购次数" prop="limit_num">
              <el-input
                v-model="ruleForm.limit_num"
                placeholder="(输入正整数，默认为零时不限制购买次数)"
                type="number"
              ></el-input>
            </el-form-item>
            <el-form-item label="兑换开始/结束时间">
              <el-date-picker
                v-model="ruleForm.times"
                type="datetimerange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                format="yyyy-MM-dd HH:mm:ss"
                value-format="timestamp"
                align="right"
              ></el-date-picker>
            </el-form-item>
            <template v-if="tableList.length>0">
              <el-form-item label="门店价格">
                <el-table :data="tableList" border="" style="width: 100%">
                  <el-table-column prop="name" label="销售单位"></el-table-column>
                  <el-table-column prop="supply_price" label="成本价"></el-table-column>
                  <el-table-column prop="price" label="销售价"></el-table-column>
                  <el-table-column prop="member_price" label="会员价格"></el-table-column>
                  <el-table-column prop label="真实库存"></el-table-column>
                  <el-table-column prop label="预占库存"></el-table-column>
                  <el-table-column prop label="可用库存"></el-table-column>
                </el-table>
              </el-form-item>
              <el-form-item label="销售方式 ">
                <el-table
                  :data="ruleForm.prices"
                  border=""
                  style="width:100%"
                  v-if="tableList.length>0"
                >
                  <el-table-column label="单位名称" width="180">
                    <template slot-scope="row">
                      <el-input v-model="row.row.specification_name"></el-input>
                    </template>
                  </el-table-column>
                  <el-table-column label="*计件数" width="280">
                    <template slot-scope="row">
                      <el-input
                        v-model="row.row.amount"
                        type="Number"
                        style="width:50%"
                        @input="oninput"
                      ></el-input>
                      <el-select v-model="row.row.unit" style="width:50%">
                        <el-option
                          v-for="(item,index) in ruleForm.optionsPiece"
                          :key="index"
                          :label="item.name"
                          :value="item.name"
                        ></el-option>
                      </el-select>
                    </template>
                  </el-table-column>
                  <el-table-column label="*成本价(元)" width="180">
                    <template slot-scope="row">
                      <el-input v-model="row.row.supply_price" type="number"></el-input>
                    </template>
                  </el-table-column>
                  <el-table-column label="*零售价(元)" width="180">
                    <template slot-scope="row">
                      <el-input v-model="row.row.retail_price" type="number"></el-input>
                    </template>
                  </el-table-column>
                  <el-table-column prop label="库存设置" width="150">
                    <template slot-scope="row">
                      <el-select v-model="row.row.inventory_state" placeholder="库存设置">
                        <el-option
                          v-for="item in optionsinventory_state"
                          :key="item.id"
                          :label="item.name"
                          :value="item.id"
                        ></el-option>
                      </el-select>
                    </template>
                  </el-table-column>
                  <el-table-column label="虚拟库存" width="180">
                    <template slot-scope="row">
                      <el-input v-model="row.row.inventory" type="number"></el-input>
                    </template>
                  </el-table-column>
                  <el-table-column label="重量(克)" width="150">
                    <template slot-scope="row">
                      <el-input v-model="row.row.weight" type="number"></el-input>
                    </template>
                  </el-table-column>
                  <el-table-column label="体积(cm3)" width="150">
                    <template slot-scope="row">
                      <el-input v-model="row.row.bulk" type="number"></el-input>
                    </template>
                  </el-table-column>
                </el-table>
              </el-form-item>
            </template>
            <el-form-item label="商品主图">
              <el-tooltip
                class="item"
                effect="dark"
                content="只能上传一张图片图片格式JPEG，建议大小为400*400，文件大小800k以内。"
                placement="top-start"
              >
                <el-upload
                  ref="upload"
                   :action="$uplaadUrl"
                  list-type="picture-card"
                  :file-list="ruleForm.file"
                  :limit="1"
                  :headers="header"
                  :on-remove="onRemove"
                  :on-success="handleAvatarSuccess"
                  :before-upload="beforeUpload"
         accept=".jpg, .png"
                >
                  <i class="el-icon-plus"></i>
                </el-upload>
              </el-tooltip>
            </el-form-item>
            <el-form-item label="商品图片">
              <el-upload
                ref="upload"
                 :action="$uplaadUrl"
                list-type="picture-card"
                :file-list="ruleForm.files"
                :limit="9"
                :headers="header"
                :on-preview="handlePictureCardPreview"
                :on-remove="handleRemove"
                :on-success="AvatarSuccess"
                :on-exceed="onexceed"
                :before-upload="beforeUpload"
         accept=".jpg, .png"
              >
                <i class="el-icon-plus"></i>
              </el-upload>
            </el-form-item>
            <el-form-item label="详情描述">
              <quill-editor
                class="editor"
                v-model="ruleForm.content"
                ref="myQuillEditor"
                :options="editorOption"
                @blur="onEditorBlur($event)"
                @focus="onEditorFocus($event)"
                @change="onEditorChange($event)"
              ></quill-editor>
            </el-form-item>
            <!-- 运费模板 -->
            <!-- <el-form-item label="运费模板">
                <el-select v-model="ruleForm.freight_template" placeholder="请选择">
            <el-option
              v-for="item in  ruleForm.freight_templates"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
            </el-form-item>-->
            <el-form-item label="上架状态">
              <el-switch
                v-model="ruleForm.forsale"
                active-color="#008080"
                inactive-color="#ff4949"
                active-text="是"
                inactive-text="否"
              ></el-switch>
            </el-form-item>
            <el-form-item label="配送设置">
              <el-checkbox v-model="ruleForm.dispatching[0].checked">快递</el-checkbox>
              <el-checkbox v-model="ruleForm.dispatching[1].checked">自提</el-checkbox>
            </el-form-item>
            <el-form-item label="是否关注购买">
              <el-switch
                v-model="ruleForm.attention_buy"
                active-color="#008080"
                inactive-color="#ff4949"
                active-text="是"
                inactive-text="否"
              ></el-switch>
            </el-form-item>
            <el-form-item label="提交">
              <el-button type="primary" @click="onsubmit" v-no-click v-if="!isedit">提交</el-button>
              <el-button type="primary" @click="onedit" v-no-click v-else>修改</el-button>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </el-card>
    <el-dialog :visible.sync="imgVisible" width="30%">
      <img width="100%" :src="ruleForm.temppis" alt="">
    </el-dialog>
    <!--  添加对话框-->
    <el-dialog
      title="商品列表"
      :visible="dialogVisible"
      width="50%"
      :show-close="false"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <el-row>
        <el-col :span="6">
          <el-select v-model="Page.id" placeholder="请选择">
            <el-option
              v-for="item in tuanlist.goodsOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-col>
        <el-col :span="8">
          <el-input placeholder="请输入内容" v-model="Page.keyword" clearable @clear="onclery">
            <el-button slot="append" icon="el-icon-search" @click="onserch"></el-button>
          </el-input>
        </el-col>
      </el-row>
      <div class="height"></div>
      <el-table
        border=""
        :data="tableData"
        style="width: 100%"
        stripe
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column label="商品ID" prop="id"></el-table-column>
        <el-table-column label="商品图片" prop="commodity_code">
          <template slot-scope="row">
            <el-image style="width: 50px; height: 50px" :src="row.row.thumb" fit="contain"></el-image>
          </template>
        </el-table-column>
        <el-table-column label="商品名称" prop="name"></el-table-column>
        <el-table-column label="商品分类" prop="title"></el-table-column>
        <el-table-column label="商品编号" prop="commodity_code"></el-table-column>
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
      <span slot="footer" class="dialog-footer">
        <el-button @click="oncancel" v-no-click>取 消</el-button>
        <el-button type="primary" @click="onconfirm" v-no-click>确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { tuanlist } from "@/common/select.js";
/*富文本编辑图片上传配置*/
import _ from "lodash";
import { quillRedefine } from "vue-quill-editor-upload";
import { quillEditor } from "vue-quill-editor";
import { isnumber } from "@/utils/validtel.js";
// import { log } from "util";

export default {
  // props:[],
  created() {
    this.getgoodsSeckill();
    this.getwxaddScores();
    // this.getaddWeiGoods();
    // 判断是添加还是删除 根据传过来的id判断
    if (this.$route.params.id) {
      sessionStorage.setItem("addscoregoods_id", this.$route.params.id);
    }
    if (this.$route.params.id || sessionStorage.getItem("addscoregoods_id")) {
      this.isedit = true;
      this.ruleForm.goods_id =
        this.$route.params.id || sessionStorage.getItem("addscoregoods_id");
      this.ruleForm.id =
        this.$route.params.id || sessionStorage.getItem("addscoregoods_id");
      this.getwxupdateScore();
    }
  },
  // 页面加载完成
  mounted() {
    // 禁止富文本编辑器获取焦点
    // this.$refs.myQuillEditor.quill.enable(false);
    // 禁止富文本编辑器获取焦点
    this.$refs.myQuillEditor.quill.enable(false);
    if (!this.isedit) {
      setTimeout(() => {
        //       //富文本编辑器神坑处理
        this.$nextTick(function() {
          this.$refs.myQuillEditor.quill.enable(true);
          this.$refs.myQuillEditor.quill.blur();
        });
      }, 500);
    }
  },
  data() {
    return {
      tuanlist,
      isedit: false,
      editId: "",
      Page: {
        pagenum: 1,
        pagesize: 10,
        count: 0,
        forsale: "",
        id: "",
        type: "",
        keyword: ""
      },
      goodsSelect: 1,
      product_attribute: [], //加工商品属性模板
      selection: [], //表格被选中
      commission_state: [
        {
          name: "按金额",
          id: 1
        },
        {
          name: "百分比",
          id: 0
        }
      ],
      optionsinventory_state: [
        {
          name: "自定义库存数量",
          id: 1
        },
        {
          name: "调用真是库存",
          id: 2
        }
      ],
      tableList: [],
      tableData: [],
      editorOption: {
        placeholder:
          "详细描述一般包含商品功能属性、商品细节图片、支付物流、售后服务、公司实力等内容"
      },
      header: {
        Authorization: sessionStorage.getItem("token") || ""
      },
      btnTitle: "选择名称",
      dialogVisible: false,
      imgVisible: false,
      ruleForm: {
        limit_amount: 0, //限购数量
        limit_num: 0, //限购次数
        times: "",
        goods_id: "",
        content: "",
        names: [{ name: "" }, { name: "" }, { name: "" }, { name: "" }],
        state: true,
        optionsPiece: [],
        selectPiece: "", //件个数数组
        name: "", //商品别名
        selectValue: "", //下拉菜单选中的值
        options: [], //下拉菜单数组
        intro: "", //商品描述
        forsale: true, //商品排序
        freight_template: "",
        sale_num: 0,
        switch: true, //开关的值
        temppis: "", //预览图片的地址
        thumb: "",
        picture: [],
        file: [], //图片数组
        files: [],
        score: "",
        id: "",

        attention_buy: true, //是否关注购买

        dispatching: [{ checked: true }, { checked: true }],
        prices: [
          {
            specification_name: "",
            unit: "",
            amount: "",
            supply_price: "",
            market_price: "",
            price: "",
            member_price: "",
            discount: 0,
            inventory_state: 1,
            inventory: 0,
            state: "",
            commission_state: 1,
            commission_num: 0,
            weight: "",
            bulk: "",
            retail_price: ""
          }
        ],
        freight_template: "",
        freight_templates: []
      },
      rules: {
        name: [{ required: true, message: "请输入商品别名", trigger: "blur" }],
        score: [
          { required: true, message: "请输入积分", trigger: "blur" },
          { validator: isnumber, trigger: "blur" }
        ],
        intro: [{ required: true, message: "请输入商品描述", trigger: "blur" }],
        payment_time: [{ validator: isnumber, trigger: "blur" }],
        limit_amount: [{ validator: isnumber, trigger: "blur" }],
        limit_num: [{ validator: isnumber, trigger: "blur" }]
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
    getwxaddScores() {
      this.$api
        .getwxaddScores({})
        .then(res => {
          if (res.data.code == 200) {
            this.ruleForm.freight_templates = res.data.freight_template;
          } else {
            this.$api.error(res.data.msg);
          }
        })
        .catch(res => {
          this.$api.error();
          console.log(res);
        });
    },
    // 获取模板列表
    getgoodsSeckill() {
      this.$api
        .getwxgoodsScoreList(this.Page)
        .then(res => {
          if (res.data.code == 200) {
            this.tableData = res.data.list;
            this.Page.count = res.data.count;
          } else {
            this.$api.error(res.data.msg);
          }
        })
        .catch(res => {
          this.$api.error();
          console.log(res);
        });
    },
    // 上传图片成功
    handleAvatarSuccess(e) {
      if (e.code == 200) {
        this.ruleForm.thumb = e.name;
      }
    },
    // 上传图片成功
    AvatarSuccess(e) {
      if (e.code == 200) {
        this.ruleForm.picture.push({ thumb: e.name });
      }
    },
    // 超出上传的图片你数量
    onexceed() {
      this.$message.error("只能上传9张图片");
    },
    handlePictureCardPreview(e) {
      this.ruleForm.temppis = e.response.name;
      this.imgVisible = true;
    },
    // 删除图片
    handleRemove(e) {
      if (this.isedit) {
        let index = this.ruleForm.picture.findIndex(x => {
          return x.thumb == e.url;
        });
        if (index != -1) {
          this.ruleForm.picture.splice(index, 1);
        }
      } else {
        let index = this.ruleForm.picture.findIndex(x => {
          return x.thumb == e.response.name;
        });
        if (index != -1) {
          this.ruleForm.picture.splice(index, 1);
        }
      }
    },
    // 删除图片
    onRemove() {
      this.ruleForm.thumb = "";
    },
    onEditorBlur() {},
    onEditorFocus() {
      //获得焦点事件
    },
    onEditorChange() {
      //内容改变事件
    },
    // 对话框点击确定事件
    onconfirm() {
      if (this.selection.length == 0) {
        this.$message.error("请选择商品");
        return;
      }
      if (this.selection.length > 1) {
        this.$message.error("最多只能选择一件商品");
        return;
      }
      this.$api
        .getwxgoodsScoreSub({
          id: this.selection[0].id
        })
        .then(res => {
          if (res.data.code == 200) {
            this.ruleForm.goods_id = res.data.data.id;
            this.tableList = res.data.data.price;
            this.ruleForm.name = res.data.data.name;
            this.btnTitle = res.data.data.name;

            this.dialogVisible = false;
            res.data.data.price.map(x => {
              let obg = {};
              obg.price = x.price;
              obg.name = x.name;
              this.ruleForm.optionsPiece.push(obg);
            });
            if (this.ruleForm.optionsPiece.length > 0) {
              this.ruleForm.prices.map(x => {
                x.unit = this.ruleForm.optionsPiece[0].name;
              });
            }
          } else {
            this.$api.error(res.data.msg);
          }
        })
        .catch(res => {
          this.$api.error();
          console.log(res);
        });
    },
    // 点击取消事件
    oncancel() {
      this.dialogVisible = false;
    },
    ontable() {
      // 打开对话框
      this.dialogVisible = true;
    },
    // 分页
    handleCurrentChange(e) {
      this.Page.pagenum = e;
      this.getgoodsSeckill();
    },
    // 分页
    handleSizeChange(e) {
      this.Page.pagesize = e;
      this.getgoodsSeckill();
    },
    // 表格被选中
    handleSelectionChange(e) {
      this.selection = [];
      this.selection = e;
    },
    // 点击新增一行
    onadded() {},
    // 点击了删除一行表格
    ondeltable(row) {
      // if (this.ruleForm.type == 0) {
      //   console.log(this.ruleForm.prices.length);
      //   if (this.ruleForm.prices.length == 1) {
      //     this.$api.error("只能保留一行");
      //     return;
      //   }
      //   this.$confirm("此操作将永久删除, 是否继续?", "提示", {
      //     confirmButtonText: "确定",
      //     cancelButtonText: "取消",
      //     type: "warning"
      //   })
      //     .then(() => {
      //       this.ruleForm.prices.splice(row.$index, 1);
      //     })
      //     .catch(() => {});
      // } else {
      //   if (this.ruleForm.price.length == 1) {
      //     this.$api.error("只能保留一行");
      //     return;
      //   }
      //   this.$confirm("此操作将永久删除, 是否继续?", "提示", {
      //     confirmButtonText: "确定",
      //     cancelButtonText: "取消",
      //     type: "warning"
      //   })
      //     .then(() => {
      //       this.ruleForm.price.splice(row.$index, 1);
      //     })
      //     .catch(() => {});
      // }
    },
    oninput() {
      // let value = this.ruleForm.prices[0].unit * this.ruleForm.prices[0].amount;
      // function rounding(value) {
      //   if (typeof value == "number") {
      //     return value.toFixed(2);
      //   } else {
      //     return value;
      //   }
      // }
      // this.ruleForm.prices[0].supply_price = rounding(value);
    },
    // 封装提交表单data对象
    datafun() {
      //      let data = {
      //   inventory: this.ruleForm.prices[0].inventory,
      //   price: this.ruleForm.price,
      //   goods_id: this.ruleForm.id,
      //   name: this.ruleForm.name,
      //   intro: this.ruleForm.intro,
      //   short_title: this.labelfun(),
      //   commission: this.ruleForm.commission ? 1 : 0,
      //   commission_state: this.ruleForm.prices[0].commission_state,
      //   commission_num: this.ruleForm.prices[0].commission_num,
      //   specification_name: this.ruleForm.prices[0].specification_name,
      //   amount: this.ruleForm.prices[0].unit,
      //   unit: this.ruleForm.prices[0].amount,
      //   supply_price: this.ruleForm.prices[0].supply_price,
      //   inventory_state: this.ruleForm.prices[0].inventory_state,
      //   limit_amount: this.ruleForm.limit_amount,
      //   limit_num: this.ruleForm.limit_num,
      //   start_time: this.ruleForm.times[0] / 1000,
      //   end_time: this.ruleForm.times[1] / 1000,
      //   thumb: this.ruleForm.file.title,
      //   content: this.ruleForm.content,
      //   payment_time: this.ruleForm.payment_time,
      //   forsale: this.ruleForm.forsale ? 1 : 0,
      //   show_extract_time: this.ruleForm.show_extract_time ? 1 : 0,
      //   member_pay: this.ruleForm.member_pay ? 1 : 0,
      //   discount_coupon: this.ruleForm.discount_coupon ? 1 : 0,
      //   attention_buy: this.ruleForm.attention_buy ? 1 : 0,
      //   weight: this.ruleForm.prices[0].weight,
      //   bulk: this.ruleForm.prices[0].bulk,
      //   picture: JSON.stringify(
      //     this.ruleForm.file.list.map(x => {
      //       return { thumb: x };
      //     })
      //   ),
      //   goods_id: this.ruleForm.id
      // };
      // if (
      //   this.ruleForm.dispatching[0].checked &&
      //   this.ruleForm.dispatching[1].checked
      // ) {
      //   data.dispatching = 0;
      // } else if (
      //   this.ruleForm.dispatching[0].checked == true &&
      //   this.ruleForm.dispatching[1].checked == false
      // ) {
      //   data.dispatching = 1;
      // } else if (
      //   this.ruleForm.dispatching[0].checked == false &&
      //   this.ruleForm.dispatching[1].checked == true
      // ) {
      //   data.dispatching = 2;
      // } else if (
      //   this.ruleForm.dispatching[0].checked == false &&
      //   this.ruleForm.dispatching[1].checked == false
      // ) {
      //   this.ruleForm.dispatching = 3;
      // }
      // return data
    },
    // 提交表单
    onsubmit() {
      console.log(this.ruleForm);

      let issome = this.ruleForm.prices.some(x => {
        if (this.ruleForm.id == "") {
          this.$api.error("请输入商品名称");
          return false;
        }
        if (x.specification_name == "") {
          this.$api.error("请输入单位名称");
          return false;
        }
        if (x.unit == "") {
          this.$api.error("请输入计件数");
          return false;
        }
        if (x.supply_price == "") {
          this.$api.error("请输入成本价(元)");
          return false;
        }
        if (x.retail_price == "") {
          this.$api.error("请输入零售价");
          return false;
        }
        return true;
      });
      if (!issome) {
        return;
      }
      if (this.ruleForm.times.length == 0) {
        this.$api.error("请选择开始结束时间");
        return false;
      }
      let data = _.cloneDeep(this.ruleForm);
      if (
        this.ruleForm.dispatching[0].checked &&
        this.ruleForm.dispatching[1].checked
      ) {
        data.dispatching = 0;
      } else if (
        this.ruleForm.dispatching[0].checked == true &&
        this.ruleForm.dispatching[1].checked == false
      ) {
        data.dispatching = 1;
      } else if (
        this.ruleForm.dispatching[0].checked == false &&
        this.ruleForm.dispatching[1].checked == true
      ) {
        data.dispatching = 2;
      } else if (
        this.ruleForm.dispatching[0].checked == false &&
        this.ruleForm.dispatching[1].checked == false
      ) {
        data.dispatching = 3;
      }
      data.start_time = data.times[0] / 1000;
      data.end_time = data.times[1] / 1000;
      data.forsale = data.forsale ? 1 : 0;
      data.attention_buy = data.attention_buy ? 1 : 0;
      data.short_title = this.labelfun();
      data.prices.map(x => {
        for (const key in x) {
          data[key] = x[key];
        }
      });

      data.picture = JSON.stringify(data.picture);
      this.$refs.ruleForms.validate(valid => {
        if (!valid) return;
        this.$api
          .getwxaddScore(data)
          .then(res => {
            if (res.data.code == 200) {
              this.$message.success(res.data.msg);
              this.$router.push("/scoregoods");
            } else {
              this.$api.error(res.data.msg);
            }
          })
          .catch(res => {
            this.$api.error();
            console.log(res);
          });
      });
    },
    labelfun() {
      let arr = [];
      this.ruleForm.names.map(x => {
        if (x.name != "") {
          arr.push(x.name);
        }
      });
      if (arr.length > 0) {
        return arr.join("_");
      }
      return "";
    },
    // 搜索接口
    onserch() {
      // if (this.serchinput == "") {
      //   this.$api.error("请输入内容");
      //   return;
      // }
      // this.pagenum = 1;
      // this.$api
      //   .getgoodsLists({
      //     pagenum: this.pagenum,
      //     pagesize: this.pagesize,
      //     id: this.goodsSelect,
      //     keyword: this.serchinput
      //   })
      //   .then(res => {
      //     if (res.data.code == 200) {
      //       this.tableData = res.data.list;
      //       this.count = res.data.count;
      //     } else {
      //       this.$api.error(res.data.msg);
      //     }
      //   })
      //   .catch(res => {
      //     this.$api.error();
      //     console.log(res);
      //   });
    },
    onclery() {
      this.Page.pagenum = 1;
      this.Page.pagesize = 10;
      this.Page.id = "";
      this.Page.keyword = "";
      this.getgoodsSeckill();
    },
    // 修改秒杀接口
    getwxupdateTuan() {
      // this.$api
      //   .getwxupdateSeckill({
      //     params: {
      //       id: this.editId
      //     }
      //   })
      //   .then(res => {
      //     if (res.data.code == 200) {
      //       this.ruleForm.prices[0].amount = res.data.seckill.amount;
      //       this.ruleForm.intro = res.data.seckill.intro;
      //       this.ruleForm.name = res.data.seckill.name;
      //       this.ruleForm.price = parseInt(res.data.seckill.price);
      //       this.ruleForm.limit_amount = res.data.seckill.limit_amount;
      //       this.ruleForm.limit_num = res.data.seckill.limit_num;
      //       let arr = [
      //         res.data.seckill.start_time * 1000,
      //         res.data.seckill.end_time * 1000
      //       ];
      //       this.ruleForm.times = arr;
      //       this.ruleForm.commission =
      //         res.data.seckill.commission == 1 ? true : false;
      //       if (res.data.seckill.thumb) {
      //         this.ruleForm.file.title = res.data.seckill.thumb;
      //         this.file.push({ name: 123, url: res.data.seckill.thumb });
      //       }
      //       res.data.seckill.picture.forEach(x => {
      //         this.ruleForm.file.list.push(x.picture);
      //         let obg = {};
      //         obg.name = "123";
      //         obg.url = x.picture;
      //         this.files.push(obg);
      //       });
      //       this.ruleForm.content = res.data.seckill.content;
      //       this.ruleForm.payment_time = res.data.seckill.payment_time;
      //       if (
      //         res.data.seckill.short_title != "" &&
      //         res.data.seckill.short_title.length > 1 &&
      //         res.data.seckill.short_title.split("_").length > 1
      //       ) {
      //         res.data.seckill.short_title.split("_").forEach((x, i) => {
      //           this.ruleForm.names[i].name = x;
      //         });
      //       } else {
      //         this.ruleForm.names[0].name = res.data.seckill.short_title;
      //       }
      //       this.tableList = res.data.price;
      //       res.data.price.map(x => {
      //         let obg = {};
      //         obg.price = x.price;
      //         obg.name = x.name;
      //         this.ruleForm.optionsPiece.push(obg);
      //       });
      //       if (this.ruleForm.optionsPiece.length > 0) {
      //         this.ruleForm.prices.map(x => {
      //           x.amount = this.ruleForm.optionsPiece[0].price;
      //         });
      //       }
      //       this.ruleForm.prices[0].specification_name =
      //         res.data.seckill.specification_name;
      //       this.ruleForm.prices[0].amount = res.data.seckill.amount;
      //       this.ruleForm.prices[0].unit = res.data.seckill.unit;
      //       this.ruleForm.prices[0].supply_price =
      //         res.data.seckill.supply_price;
      //       this.ruleForm.prices[0].inventory_state = parseInt(
      //         res.data.seckill.inventory_state
      //       );
      //       this.ruleForm.prices[0].inventory = res.data.seckill.inventory;
      //       this.ruleForm.prices[0].commission_state =
      //         res.data.seckill.commission_state == "1" ? 1 : 0;
      //       this.ruleForm.prices[0].commission_num =
      //         res.data.seckill.commission_num;
      //       this.ruleForm.prices[0].weight = res.data.seckill.weight;
      //       this.ruleForm.prices[0].bulk = res.data.seckill.bulk;
      //       if (res.data.seckill.dispatching == 0) {
      //         this.ruleForm.dispatching[0].checked = true;
      //         this.ruleForm.dispatching[1].checked = true;
      //       } else if (res.data.seckill.dispatching == 1) {
      //         this.ruleForm.dispatching[0].checked = true;
      //         this.ruleForm.dispatching[1].checked = false;
      //       } else if (res.data.seckill.dispatching == 2) {
      //         this.ruleForm.dispatching[0].checked = false;
      //         this.ruleForm.dispatching[1].checked = true;
      //       } else if (res.data.seckill.dispatching == 3) {
      //         this.ruleForm.dispatching[0].checked = false;
      //         this.ruleForm.dispatching[1].checked = false;
      //       }
      //       this.ruleForm.show_extract_time =
      //         res.data.seckill.show_extract_time == "1" ? true : false;
      //       this.ruleForm.member_pay =
      //         res.data.seckill.member_pay == "1" ? true : false;
      //       this.ruleForm.discount_coupon =
      //         res.data.seckill.discount_coupon == "1" ? true : false;
      //       this.ruleForm.attention_buy =
      //         res.data.seckill.attention_buy == "1" ? true : false;
      //       //富文本编辑器神坑处理
      //       this.$nextTick(function() {
      //         this.$refs.myQuillEditor.quill.enable(true);
      //         this.$refs.myQuillEditor.quill.blur();
      //       });
      //     } else {
      //       this.$api.error(res.data.msg);
      //     }
      //   })
      //   .catch(res => {
      //     this.$api.error();
      //     console.log(res);
      //   });
    },
    // 点击修改
    onedit() {
      let issome = this.ruleForm.prices.some(x => {
        if (this.ruleForm.id == "") {
          this.$api.error("请输入商品名称");
          return false;
        }
        if (x.specification_name == "") {
          this.$api.error("请输入单位名称");
          return false;
        }
        if (x.unit == "") {
          this.$api.error("请输入计件数");
          return false;
        }
        if (x.supply_price == "") {
          this.$api.error("请输入成本价(元)");
          return false;
        }
        if (x.retail_price == "") {
          this.$api.error("请输入零售价");
          return false;
        }
        return true;
      });
      if (!issome) {
        return;
      }
      if (this.ruleForm.times.length == 0) {
        this.$api.error("请选择开始结束时间");
        return false;
      }
      let data = _.cloneDeep(this.ruleForm);
      if (
        this.ruleForm.dispatching[0].checked &&
        this.ruleForm.dispatching[1].checked
      ) {
        data.dispatching = 0;
      } else if (
        this.ruleForm.dispatching[0].checked == true &&
        this.ruleForm.dispatching[1].checked == false
      ) {
        data.dispatching = 1;
      } else if (
        this.ruleForm.dispatching[0].checked == false &&
        this.ruleForm.dispatching[1].checked == true
      ) {
        data.dispatching = 2;
      } else if (
        this.ruleForm.dispatching[0].checked == false &&
        this.ruleForm.dispatching[1].checked == false
      ) {
        data.dispatching = 3;
      }
      data.start_time = data.times[0] / 1000;
      data.end_time = data.times[1] / 1000;
      data.forsale = data.forsale ? 1 : 0;
      data.attention_buy = data.attention_buy ? 1 : 0;
      data.short_title = this.labelfun();
      data.prices.map(x => {
        for (const key in x) {
          data[key] = x[key];
        }
      });

      data.picture = JSON.stringify(data.picture);
      this.$refs.ruleForms.validate(valid => {
        if (!valid) return;
        this.$api
          .getwxupdateScores(data)
          .then(res => {
            if (res.data.code == 200) {
              this.$message.success(res.data.msg);
              this.$router.push("/scoregoods");
            } else {
              this.$api.error(res.data.msg);
            }
          })
          .catch(res => {
            this.$api.error();
            console.log(res);
          });
      });
    },
    getwxupdateScore() {
      this.$api
        .getwxupdateScore({
          params: {
            id: this.ruleForm.goods_id
          }
        })
        .then(res => {
          if (res.data.code == 200) {
            this.tableList = res.data.price;
            this.ruleForm.name = res.data.score_goods.name;
            this.ruleForm.content = res.data.score_goods.content;
            this.ruleForm.intro = res.data.score_goods.intro;
            this.ruleForm.score = res.data.score_goods.score;
            this.ruleForm.limit_amount = res.data.score_goods.limit_amount;
            this.ruleForm.thumb = res.data.score_goods.thumb;
            this.ruleForm.file.push({
              name: "2.png",
              url: res.data.score_goods.thumb
            });
            if (
              res.data.score_goods.short_title != "" &&
              res.data.score_goods.short_title.length > 1 &&
              res.data.score_goods.short_title.indexOf("_") != -1
            ) {
              res.data.score_goods.short_title
                .split("_")
                .forEach((x, index) => {
                  this.ruleForm.names[index].name = x;
                });
            }
            if (
              res.data.score_goods.start_time &&
              res.data.score_goods.end_time
            ) {
              this.ruleForm.times = [
                res.data.score_goods.start_time * 1000,
                res.data.score_goods.end_time * 1000
              ];
            }
            if (res.data.score_goods.dispatching == 0) {
              this.ruleForm.dispatching[0].checked = true;
              this.ruleForm.dispatching[1].checked = true;
            } else if (res.data.score_goods.dispatching == 1) {
              this.ruleForm.dispatching[0].checked = true;
              this.ruleForm.dispatching[1].checked = false;
            } else if (res.data.score_goods.dispatching == 2) {
              this.ruleForm.dispatching[0].checked = false;
              this.ruleForm.dispatching[1].checked = true;
            } else if (res.data.score_goods.dispatching == 3) {
              this.ruleForm.dispatching[0].checked = false;
              this.ruleForm.dispatching[1].checked = false;
            }

            this.ruleForm.forsale =
              res.data.score_goods.forsale == 1 ? true : false;
            this.ruleForm.attention_buy =
              res.data.score_goods.attention_buy == 1 ? true : false;

            //         prices: [
            //   {
            //     specification_name: "",
            //     unit: "",
            //     amount: "",
            //     supply_price: "",
            //     market_price: "",
            //     price: "",
            //     member_price: "",
            //     discount: 0,
            //     inventory_state: 1,
            //     inventory: 0,
            //     state: "",
            //     commission_state: 1,
            //     commission_num: 0,
            //     weight: "",
            //     bulk: ""
            //   }
            // ],

            this.ruleForm.prices[0].amount = res.data.score_goods.amount;
            this.ruleForm.prices[0].specification_name =
              res.data.score_goods.specification_name;
            this.ruleForm.prices[0].unit = res.data.score_goods.unit;
            this.ruleForm.prices[0].weight = res.data.score_goods.weight;
            this.ruleForm.prices[0].bulk = res.data.score_goods.bulk;
            this.ruleForm.prices[0].inventory = res.data.score_goods.inventory;
            this.ruleForm.prices[0].inventory_state = parseInt(
              res.data.score_goods.inventory_state
            );
            this.ruleForm.prices[0].retail_price =
              res.data.score_goods.retail_price;
            this.ruleForm.prices[0].supply_price =
              res.data.score_goods.supply_price;
            res.data.score_goods.picture.forEach(x => {
              this.ruleForm.picture.push({
                thumb: x.picture
              });

              this.ruleForm.files.push({
                name: "3232",
                url: x.picture
              });
            });
            res.data.price.map(x => {
              let obg = {};
              obg.price = x.price;
              obg.name = x.name;
              this.ruleForm.optionsPiece.push(obg);
            });
            if (this.ruleForm.optionsPiece.length > 0) {
              this.ruleForm.prices.map(x => {
                x.unit = this.ruleForm.optionsPiece[0].name;
              });
            }
            //富文本编辑器神坑处理
            this.$nextTick(function() {
              this.$refs.myQuillEditor.quill.enable(true);
              this.$refs.myQuillEditor.quill.blur();
            });
            //               price: "", //秒杀价格
            //   limit_amount: 0, //限购数量
            //   limit_num: 0, //限购次数
            //   times: "",
            //   goods_id: "",
            //   payment_time: "", //支付时间
            //   content: "",
            //   names: [{ name: "" }, { name: "" }, { name: "" }, { name: "" }],
            //   state: true,
            //   optionsPiece: [],
            //   selectPiece: "", //件个数数组
            //   name: "", //商品别名
            //   selectValue: "", //下拉菜单选中的值
            //   options: [], //下拉菜单数组
            //   type: "0", //单选框选中的值
            //   antistop: "", //商品关键词
            //   intro: "", //商品描述
            //   forsale: true, //商品排序
            //   freight_template: "",
            //   sale_num: 0,
            //   switch: true, //开关的值
            //   temppis: "", //预览图片的地址
            //   thumb:"",picture:[],
            //  file: [], //图片数组
            // files: [],

            //   attention_buy: true, //是否关注购买
            // ROW_NUMBER: "1"
            // amount: null
            // attention_buy: "1"
            // bulk: null
            // commodity_code: null
            // content: "<p>玩儿玩儿翁微微儿二二</p>"
            // dispatching: "0"
            // end_time: "1591372800000"
            // forsale: "1"
            // freight_template: "0"
            // goods_id: "1"
            // goods_name: "火龙果"
            // intro: "12"
            // inventory: null
            // inventory_state: null
            // limit_amount: "0"
            // limit_num: "0"
            // name: "火龙果"
            // picture: []
            // retail_price: null
            // score: "232"
            // short_title: "23_水电费是否_二二_二而特窝热热"
            // specification_name: null
            // start_time: "1591286400000"
            // supply_price: null
            // thumb: "https://www.cnzhuoyue.cn/uploads/webmanage/2020-06-03/5ed718ed032b6.png"
            // unit: null
            // weight: null
          } else {
            this.$api.error(res.data.msg);
          }
        })
        .catch(res => {
          this.$api.error();
          console.log(res);
        });
    }
  },
  // 监听属性
  watch: {},
  // 组件
  component: {
    "quill-editor": quillEditor,
    quillRedefine
  },
  // 计算属性
  computed: {
    editor() {
      return this.$refs.myQuillEditor.quill;
    }
  },
  filters: {
    rounding(value) {
      if (typeof value == "number") {
        return value.toFixed(2);
      } else {
        return value;
      }
    }
  },
  beforeDestroy() {
    sessionStorage.removeItem("addscoregoods_id");
  }
};
</script>

<style lang="less" scoped>
/deep/ .editor .ql-container {
   min-height: 300px !important;
}
.input_box {
  display: flex;
  justify-content: space-between;
}
</style>
