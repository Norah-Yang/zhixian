<template>
  <div>
    <el-card>
      <el-row>
        <el-col>
          <label class="el-form-item__label" style="width: 130px;">拼团类型</label>
          <el-select v-model="type">
            <el-option
              v-for="item in tuanlist.selectForsale"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-col>
      </el-row>
      <div class="height"></div>
      <el-row>
        <el-col :span="24">
          <el-form :model="ruleForm1" :rules="rules" ref="ruleForms" label-width="130px">
            <el-form-item label="定制团数量" v-if="type==2" prop="customization_tuan_num">
              <el-input v-model="ruleForm1.customization_tuan_num" placeholder="商品标题"></el-input>
              <div style="color:#8B8B8B">（输入正整数,定制团数量设置要大于零）</div>
            </el-form-item>
            <el-form-item label="商品名称" v-if="!isedit">
              <el-button
                type="primary"
                icon="el-icon-circle-plus-outline"
                size="small"
                @click="ontable"
                v-no-click
              >{{btnTitle}}</el-button>
            </el-form-item>
            <el-form-item label="商品标题">
              <el-input v-model="ruleForm1.name" placeholder="商品标题"></el-input>
            </el-form-item>
            <el-form-item label="商品描述">

              
              <el-input type="textarea" v-model="ruleForm1.intro"  :rows="3"  placeholder="商品描述"></el-input>
            </el-form-item>
            <el-form-item label="商品标签">
              <div class="input_box">
                <el-input
                  v-model="ruleForm1.short_title[0].text"
                  placeholder="输入如正品保证"
                  style="width:20%"
                ></el-input>
                <div class="height"></div>
                <el-input
                  v-model="ruleForm1.short_title[1].text"
                  placeholder="输入如支持7天退换"
                  style="width:20%"
                ></el-input>
                <div class="height"></div>
                <el-input
                  v-model="ruleForm1.short_title[2].text"
                  placeholder="输入如24小时发货"
                  style="width:20%"
                ></el-input>
                <div class="height"></div>
                <el-input
                  v-model="ruleForm1.short_title[3].text"
                  placeholder="输入如极速退款"
                  style="width:20%"
                ></el-input>
              </div>
            </el-form-item>
            <el-form-item label="佣金推广">
              <el-switch
                v-model="ruleForm1.commission"
                active-color="#008080"
                inactive-color="#ff4949"
                active-text="是"
                inactive-text="否"
              ></el-switch>
            </el-form-item>
            <el-form-item label="门店价格" v-if="tableList.length>0">
              <el-table :data="tableList" style="width: 100%" border="">
                <el-table-column prop="name" label="销售单位">
                  <template slot-scope="row">
                    <div>{{row.row.name}}</div>
                  </template>
                </el-table-column>
                <el-table-column prop="supply_price" label="成本价">
                  <template slot-scope="row">
                    <div>{{row.row.supply_price}}</div>
                  </template>
                </el-table-column>
                <el-table-column prop="price" label="销售价">
                  <template slot-scope="row">
                    <div>{{row.row.price}}</div>
                  </template>
                </el-table-column>
                <el-table-column prop="member_price" label="会员价格">
                  <template slot-scope="row">
                    <div>{{row.row.member_price}}</div>
                  </template>
                </el-table-column>
                <!-- <el-table-column prop label="真实库存"></el-table-column>
                <el-table-column prop label="预占库存"></el-table-column>
                <el-table-column prop label="可用库存"></el-table-column>-->
              </el-table>
            </el-form-item>
            <el-form-item label="销售方式" v-if="tableList.length>0">
              <!-- 加工商品 -->
              <el-table :data="ruleForm1.price" border="" style="width: 100%">
                <el-table-column label="单位名称" width="180">
                  <template slot-scope="row">
                    <el-input v-model.trim="row.row.specification_name"></el-input>
                  </template>
                </el-table-column>
                <el-table-column label="*计件数" width="280">
                  <template slot-scope="row">
                    <el-input
                      v-model.trim="row.row.amount"
                      type="Number"
                      style="width:50%"
                    ></el-input>
                    <el-select v-model="row.row.unit" style="width:50%">
                      <el-option
                        v-for="(item,index) in ruleForm1.optionsPiece"
                        :key="index"
                        :label="item.name"
                        :value="item.name"
                      ></el-option>
                    </el-select>
                  </template>
                </el-table-column>
                <el-table-column label="*成本价(元)" width="180">
                  <template slot-scope="row">
                    <el-input v-model.trim="row.row.supply_price" type="Number"></el-input>
                  </template>
                </el-table-column>
                <el-table-column label="*市场价(元)" width="180">
                  <template slot-scope="row">
                    <el-input v-model.trim="row.row.market_price" type="number"></el-input>
                  </template>
                </el-table-column>
                <!-- 商城价(元)/ -->
                <el-table-column label="*销售价(元)" width="180">
                  <template slot-scope="row">
                    <el-input v-model.trim="row.row.price" type="number"></el-input>
                  </template>
                </el-table-column>
                <el-table-column prop label="库存设置" width="150">
                  <template slot-scope="row">
                    <!-- <el-input v-model="ruleForm.prices.discount" ></el-input> -->
                    <el-select v-model.trim="row.row.inventory_state" placeholder="库存设置">
                      <el-option
                        v-for="item in tuanlist.optionsinventory_state"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id"
                      ></el-option>
                    </el-select>
                  </template>
                </el-table-column>
                <el-table-column label="虚拟库存" width="180">
                  <template slot-scope="row">
                    <el-input v-model.trim="row.row.inventory" type="number"></el-input>
                  </template>
                </el-table-column>
                <!-- 佣金方式 -->
                <el-table-column label="佣金方式" width="180">
                  <template slot-scope="row">
                    <el-select v-model.trim="row.row.commission_state" placeholder="佣金方式">
                      <el-option
                        v-for="item in tuanlist.commission_state"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id"
                      ></el-option>
                    </el-select>
                  </template>
                </el-table-column>
                <el-table-column label="佣金数值" width="180">
                  <template slot-scope="row">
                    <el-input
                      v-model.trim="row.row.commission_num"
                      placeholder="百分比%"
                      type="number"
                    ></el-input>
                  </template>
                </el-table-column>
                <el-table-column label="重量(克)" width="180">
                  <template slot-scope="row">
                    <el-input v-model.trim="row.row.weight" placeholder="重量(克)" type="number"></el-input>
                  </template>
                </el-table-column>
                <el-table-column label="体积(cm3)" width="180">
                  <template slot-scope="row">
                    <el-input v-model.trim="row.row.bulk" placeholder="体积(cm3)" type="number"></el-input>
                  </template>
                </el-table-column>
              </el-table>
            </el-form-item>
            <!-- ---------------------------------------- -->
            <el-form-item label="拼团价格" v-if="tableList.length>0">
              <el-table border="" :data="ruleForm1.people" style="width: 100%" stripe>
                <el-table-column label="人数" prop="people">
                  <template slot-scope="row">
                    <el-input v-model="row.row.people" type="number" style="width:25%"></el-input>
                    <!-- <el-table border="" :data="ruleForm1.people" style="width: 100%" stripe>
                    </el-table>-->
                  </template>
                </el-table-column>
                <el-table-column label="拼团价(元)	" prop="people_price">
                  <template slot-scope="row">
                    <el-input v-model="row.row.people_price" type="number" style="width:25%"></el-input>
                  </template>
                </el-table-column>
                <el-table-column label="操作" prop="people_price" v-if="type==3">
                  <template slot-scope="row">
                    <el-button size="small" type="danger" @click="ondeltable(row)" v-no-click>删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
              <el-button size="small" type="primary" @click="onadded" v-no-click v-if="type==3">新增一行</el-button>
            </el-form-item>
            <!-- 结束时间 -->
            <el-form-item label="结束时间" v-if="type==3">
              <el-date-picker
                v-model="ruleForm1.end_time"
                type="datetime"
                placeholder="选择日期时间"
                value-format="timestamp"
                default-time="12:00:00"
              ></el-date-picker>
              <div style="color:#8B8B8B">（拼团结束时间，到达结束时间拼团结束）</div>
            </el-form-item>
            <el-form-item label="拼团时间" prop="tuan_time">
              <el-input v-model="ruleForm1.tuan_time" placeholder="（拼团时间，以开团时间为准，多少小时后过期）"></el-input>
              <div style="color:#8B8B8B">（拼团时间，以开团时间为准，多少小时后过期）</div>
            </el-form-item>
            <el-form-item label="限购数量" prop="limit_amount">
              <el-input v-model="ruleForm1.limit_amount" placeholder="（输入正整数，默认为零时不限制购买数量）"></el-input>
              <div style="color:#8B8B8B">（输入正整数，默认为零时不限制购买数量）</div>
            </el-form-item>
            <el-form-item label="限购次数" prop="limit_num">
              <el-input v-model="ruleForm1.limit_num" placeholder="（输入正整数，默认为零时不限制购买次数）"></el-input>
              <div style="color:#8B8B8B">（输入正整数，默认为零时不限制购买次数）</div>
            </el-form-item>
            <el-form-item label="虚拟销量" prop="virtual_sales_volume" v-if="type!=3">
              <el-input v-model="ruleForm1.virtual_sales_volume" placeholder="（输入正整数，默认为零时不限制购买次数）"></el-input>
              <div style="color:#8B8B8B">（输入正整数，商城显示销量等于真实销量+虚拟销量，不适用于阶梯团）</div>
            </el-form-item>
            <el-form-item label="商品主图">
              <el-upload
                ref="upload"
                :action="$uplaadUrl"
                list-type="picture-card"
                :file-list="ruleForm1.file"
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
              <div style="color:#8B8B8B">图片格式JPEG，建议大小为640*400，文件大小800k以内。</div>
            </el-form-item>
            <el-form-item label=" 商品图片">
              <el-upload
                ref="upload"
                :action="$uplaadUrl"
                list-type="picture-card"
                :file-list="ruleForm1.fileList"
                :limit="9"
                :on-preview="handlePictureCardPreview"
                :headers="header"
                :on-remove="handleRemovelist"
                :on-success="AvatarSuccesslist"
                :on-exceed="onexceedlist"
                :before-upload="beforeUpload"
         accept=".jpg, .png"
              >
                <i class="el-icon-plus"></i>
              </el-upload>
              <div
                style="color:#8B8B8B"
              >图片格式JPEG，建议大小为640*400,文件大小800k以内，您最多可以上传 5 张图片,切勿盗用他人图片，以免受网规处罚。</div>
            </el-form-item>
            <el-form-item label="详情描述">
              <quill-editor
                class="editor"
                v-model="ruleForm1.content"
                ref="myQuillEditor"
                :options="editorOption"
              ></quill-editor>
            </el-form-item>
            <el-form-item label="上架状态">
              <el-switch
                v-model="ruleForm1.forsale"
                active-color="#008080"
                inactive-color="#ff4949"
                active-text="是"
                inactive-text="否"
              ></el-switch>
            </el-form-item>
            <el-form-item label="配送设置">
              <el-checkbox v-model="ruleForm1.dispatchings[0].checked">快递</el-checkbox>
              <el-checkbox v-model="ruleForm1.dispatchings[1].checked">自提</el-checkbox>
            </el-form-item>
            <el-form-item label="是否显示自提时间">
              <el-switch
                v-model="ruleForm1.show_extract_time"
                active-color="#008080"
                inactive-color="#ff4949"
                active-text="是"
                inactive-text="否"
              ></el-switch>
            </el-form-item>
            <el-form-item label="是否会员卡支付">
              <el-switch
                v-model="ruleForm1.member_pay"
                active-color="#008080"
                inactive-color="#ff4949"
                active-text="是"
                inactive-text="否"
              ></el-switch>
            </el-form-item>
            <el-form-item label="是否使用优惠券">
              <el-switch
                v-model="ruleForm1.discount_coupon"
                active-color="#008080"
                inactive-color="#ff4949"
                active-text="是"
                inactive-text="否"
              ></el-switch>
            </el-form-item>
            <el-form-item label="是否关注购买">
              <el-switch
                v-model="ruleForm1.attention_buy"
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
    <!-- 预览图片 -->
    <el-dialog :visible.sync="imgVisible" width="30%">
      <img width="100%" :src="temppis" alt="">
    </el-dialog>
    <!--  添加对话框-->
    <el-dialog title="商品列表" :visible="dialogVisible" width="50%" :show-close="false" :close-on-click-modal="false" :close-on-press-escape="false">
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
        <el-table-column label="商品图片" prop="thumb">
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
/*富文本编辑图片上传配置*/
import _ from "lodash";
import { quillRedefine } from "vue-quill-editor-upload";
import { quillEditor } from "vue-quill-editor";
import { isnumber } from "@/utils/validtel.js";
import { log } from "util";
import { tuanlist } from "@/common/select.js";

export default {
  created() {
    // 判断是添加还是删除 根据传过来的id判断
    if (this.$route.params.id) {
      sessionStorage.setItem("goods_id", this.$route.params.id);
    }
    if (this.$route.params.id || sessionStorage.getItem("goods_id")) {
      this.isedit = true;
      this.editId = this.$route.params.id || sessionStorage.getItem("goods_id");
      this.getwxupdateTuan();
    }
    if (this.$route.params.shop_id || sessionStorage.getItem("shop_id")) {
      this.Page.shop_id = this.$route.params.shop_id || sessionStorage.getItem("shop_id");
    }
    // 
      this.editorOption = quillRedefine({
      uploadConfig: {
        token: sessionStorage.getItem("token") || "",
        action: "https://manage.zhixianyun.cn/mapi/upload/pic", // 必填参数 图片上传地址
        // 必选参数  res是一个函数，函数接收的response为上传成功时服务器返回的数据
        accept: "image/*,image/png, image/gif, image/jpeg, image/bmp, image/x-icon,image/jpg", // 可选参数 可上传的图片格式
        // 你必须把返回的数据中所包含的图片地址 return 回去
        res: respnse => {
          if(respnse.code==200){
                   return respnse.url
          }
          // var path = respnse.path; //这里return你的图片地址即可
          //  path;
        },
        methods: "POST",
        error: () => {
          this.$api.error("上传图片失败");
        }, //
        success: () => {
          this.$message.success("上传成功");
        }, // 可选参数 接收一个函数 上传数据成功时会触发
        name: "file" // 图片上传参数名
      },
      placeholder:
        "详细描述一般包含商品功能属性、商品细节图片、支付物流、售后服务、公司实力等内容"
    });
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
      isedit: false,
      editId: "",
      tableList: [],
      header: {
        Authorization: sessionStorage.getItem("token") || ""
      },
      tuanlist,
      type: 1, //选中的下拉菜单值
      Page: {
        pagenum: 1,
        pagesize: 10,
        count: 0,
        id: "",
        keyword: "",
        shop_id:""
      },
      selection: [],
      tableData: [],
      btnTitle: "选择商品",
      //   分享团
      temppis: "",
      editorOption: {
        placeholder:
          "详细描述一般包含商品功能属性、商品细节图片、支付物流、售后服务、公司实力等内容"
      },
      imgVisible: false,
      dialogVisible: false,
      ruleForm1: {
        goods_id: "",
        name: "",
        intro: "",
        commission: false,
        tuan_time: 24,
        limit_amount: 0,
        limit_num: 0,
        virtual_sales_volume: 0,
        short_title: [{ text: "" }, { text: "" }, { text: "" }, { text: "" }],
        thumb: "",
        file: [],
        fileList: [],
        picture: [],
        content: "",
        tuan_time: "",
        forsale: true,
        dispatchings: [{ checked: true }, { checked: true }],
        show_extract_time: true,
        member_pay: true,
        discount_coupon: true,
        attention_buy: true,
        customization_tuan_num: 10,
        end_time: "",
        optionsPiece: [],
        price: [
          {
            specification_name: "",
            amount: "",
            unit: "",
            supply_price: "",
            market_price: "",
            price: "",
            inventory_state: 1,
            inventory: "",
            commission_state: 1,
            commission_num: "",
            weight: "",
            bulk: ""
          }
        ],
        people: [
          {
            people: 5,
            people_price: ""
          }
        ],
        // 要type==3用到的数组
        peopleList: []
      },
      rules: {
        tuan_time: [{ validator: isnumber, trigger: "blur" }],
        limit_amount: [{ validator: isnumber, trigger: "blur" }],
        limit_num: [{ validator: isnumber, trigger: "blur" }],
        virtual_sales_volume: [{ validator: isnumber, trigger: "blur" }],
        customization_tuan_num: [{ validator: isnumber, trigger: "blur" }]
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
    // 点击了删除主图
    handleRemove() {
      this.ruleForm1.thumb = "";
    },
    // 主图上传成功
    AvatarSuccess(e) {
      if (e.code == 200) {
        this.ruleForm1.thumb = e.name;
      }
    },
    onexceed() {
      this.$api.error("主图只允许上传一张图片");
    },
    onexceedlist() {
      this.$api.error("图片只允许上传九张图片");
    },
    handleRemovelist(e) {
      if (this.isedit) {
        let index = this.ruleForm1.picture.findIndex(x => {
          return x.thumb == e.url;
        });
        if (index != -1) {
          this.ruleForm1.picture.splice(index, 1);
        }
      } else {
        let index = this.ruleForm1.picture.findIndex(x => {
          return x.thumb == e.response.name;
        });
        if (index != -1) {
          this.ruleForm1.picture.splice(index, 1);
        }
      }
    },
    AvatarSuccesslist(e) {
      if (e.code == 200) {
        this.ruleForm1.picture.push({ thumb: e.name });
      }
    },
    handlePictureCardPreview(e) {
      this.temppis = e.response.name;
      this.imgVisible = true;
    },
    oncancel() {
      this.dialogVisible = false;
      this.selection = [];
    },
    onconfirm() {
      if (this.selection.length == 0) {
        this.$message.error("请选择商品");
        return;
      }
      if (this.selection.length > 1) {
        this.$message.error("最多只能选择一件商品");
        return;
      }
      //
      this.$api
        .getwxgoodsTuanSub({
          id: this.selection[0].id,
          shop_id: this.Page.shop_id
        })
        .then(res => {
          if (res.data.code == 200) {
            this.ruleForm1.goods_id = res.data.data.id;
            this.ruleForm1.name = res.data.data.name;
            this.btnTitle = res.data.data.name;
            this.tableList = res.data.data.price;

            res.data.data.price.map(x => {
              this.ruleForm1.optionsPiece.push(x);
            });
            if (res.data.data.price.length > 0) {
              this.ruleForm1.price.map(x => {
                x.unit = res.data.data.price[0].name;
              });
            }
            this.dialogVisible = false;
          } else {
            this.$api.error(res.data.msg);
          }
        })
        .catch(res => {
          this.$api.error();
        });
    },
    handleCurrentChange(e) {
      this.Page.pagenum = e;

      this.ontable();
    },
    handleSizeChange(e) {
      this.Page.pagesize = e;

      this.ontable();
    },
    ontable() {
      this.$api
        .getwxgoodsTuanList(this.Page)
        .then(res => {
          if (res.data.code == 200) {
            this.Page.count = res.data.count;
            this.tableData = res.data.list;
            this.dialogVisible = true;
          } else {
            this.$api.error(res.data.msg);
          }
        })
        .catch(res => {
          this.$api.error();
          console.log(res);
        });
    },
    // 表格被选中
    handleSelectionChange(e) {
      this.selection = [];
      this.selection = e;
    },
    // 搜索接口
    onserch() {
      if (this.serchinput == "") {
        this.$api.error("请输入内容");
        return;
      }
      this.Page.pagenum = 1;
      this.ontable();
    },
    onclery() {
      this.Page.id == "";
      this.Page.pagenum = 1;
      this.ontable();
    },
    // 修改加工商品
    // oninputs(row) {
    //   let value =
    //     this.ruleForm1.price[row.$index].unit *
    //     this.ruleForm1.price[row.$index].amount;
    //   function rounding(value) {
    //     //debugger
    //     //console.log("====",value);
    //     if (typeof value == "number") {
    //       return value.toFixed(2);
    //     } else {
    //       return value;
    //     }
    //   }
    //   this.ruleForm1.price[row.$index].supply_price = rounding(value);
    // },
    // 点击了删除一行表格
    ondeltable(row) {
      if (this.ruleForm1.people.length == 1) {
        this.$api.error("只能保留一行");
        return;
      }
      this.$confirm("此操作将永久删除, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.ruleForm1.people.splice(row.$index, 1);
        })
        .catch(() => {});
    },
    // 点击新增一行
    onadded() {
      this.ruleForm1.people.push({
        people: 5,
        people_price: ""
      });
    },
    onsubmit() {
      if (this.ruleForm1.id == "") {
        this.$api.error("请选择商品名称");
        return;
      }

      if (!this.check()) {
        return;
      }
      // 判断结束
      let data = _.cloneDeep(this.ruleForm1);
      for (const key in data) {
        if (data[key] === true) {
          data[key] = 1;
        } else if (data[key] === false) {
          data[key] = 0;
        }
        if (key == "price") {
          data[key].map(x => {
            for (const keys in x) {
              data[keys] = x[keys];
            }
          });
        }
      }
      if (data.dispatchings[0].checked && data.dispatchings[1].checked) {
        data.dispatching = 0;
      } else if (
        data.dispatchings[0].checked == true &&
        data.dispatchings[1].checked == false
      ) {
        data.dispatching = 1;
      } else if (
        data.dispatchings[0].checked == false &&
        data.dispatchings[1].checked == true
      ) {
        data.dispatching = 2;
      } else if (
        data.dispatchings[0].checked == false &&
        data.dispatchings[1].checked == false
      ) {
        data.dispatching = 3;
      }
      data.type = this.type;
      if (data.end_time) {
        data.end_time = data.end_time / 1000;
      }
      data.short_title = this.labelfun();
      data.picture = JSON.stringify(data.picture);
      data.people = JSON.stringify(data.people);
      data.shop_id=this.Page.shop_id
      this.$api
        .getwxaddTuan(data)
        .then(res => {
          if (res.data.code == 200) {
            this.$message.success(res.data.msg);
            this.$router.push("/tuan");
          } else {
            this.$api.error(res.data.msg);
          }
        })
        .catch(res => {
          this.$api.error();
        });
    },
    labelfun() {
      let arr = [];
      this.ruleForm1.short_title.forEach(x => {
        if (!x.text == "") {
          arr.push(x.text);
        }
      });
      if (arr.length > 0) {
        return arr.join("_");
      }
      return "";
    },
    // 封装表单校验
    check() {
      let issome = true;
      this.ruleForm1.price.forEach(x => {
        if (x.specification_name == "") {
          this.$api.error("请输入单位名称");
          issome = false;
        }
        if (x.unit == "") {
          this.$api.error("请输入计件数");
          issome = false;
        }
        if (x.supply_price == "") {
          this.$api.error("请输入成本价");
          issome = false;
        }
        if (x.market_price == "") {
          this.$api.error("请输入市场价");
          issome = false;
        }
        if (x.price == "") {
          this.$api.error("请输入销售价");
          issome = false;
        }
      });
      this.ruleForm1.people.forEach(x => {
        if (x.people == "") {
          this.$api.error("请输入拼团人数");
          issome = false;
        }
        if (x.people_price == "") {
          this.$api.error("请输入拼团价");
          issome = false;
        }
      });
      return issome;
    },
    // 调取修改数据
    getwxupdateTuan() {
      this.$api
        .getwxupdateTuan({
          params: {
            id: this.editId
          }
        })
        .then(res => {
          if (res.data.code == 200) {
            console.log(res.data);

            this.ruleForm1.goods_id = res.data.list.goods.id;
            this.ruleForm1.name = res.data.list.tuan.name;
            this.btnTitle = res.data.list.goods.name;
            this.tableList = res.data.list.price;

            res.data.list.price.map(x => {
              this.ruleForm1.optionsPiece.push(x);
            });
            // console.log(this.ruleForm1.optionsPiece);

            if (this.ruleForm1.optionsPiece.length > 0) {
              this.ruleForm1.optionsPiece.map(x => {
                this.ruleForm1.price[0].unit = x.name;
              });
            }
            // res.data.list.tuan

            // this.ruleForm1.price[0].amount = res.data.list.tuan.amount;
            this.ruleForm1.attention_buy =
              res.data.list.tuan.attention_buy == "1" ? true : false;
            this.ruleForm1.price[0].bulk = res.data.list.tuan.bulk;
            this.ruleForm1.commission =
              res.data.list.tuan.commission == "1" ? true : false;
            this.ruleForm1.price[0].commission_num =
              res.data.list.tuan.commission_num;
            this.ruleForm1.price[0].commission_state = parseInt(
              res.data.list.tuan.commission_state
            );
            this.ruleForm1.content = res.data.list.tuan.content;
            this.ruleForm1.discount_coupon =
              res.data.list.tuan.discount_coupon == "1" ? true : false;
            if (res.data.list.tuan.dispatching == 0) {
              this.ruleForm1.dispatchings[0].checked = true;
              this.ruleForm1.dispatchings[1].checked = true;
            } else if (res.data.list.tuan.dispatching == 1) {
              this.ruleForm1.dispatchings[0].checked = true;
              this.ruleForm1.dispatchings[1].checked = false;
            } else if (res.data.list.tuan.dispatching == 2) {
              this.ruleForm1.dispatchings[0].checked = false;
              this.ruleForm1.dispatchings[1].checked = true;
            } else if (res.data.list.tuan.dispatching == 3) {
              this.ruleForm1.dispatchings[0].checked = false;
              this.ruleForm1.dispatchings[1].checked = false;
            }
            this.ruleForm1.forsale =
              res.data.list.tuan.forsale == "1" ? true : false;
            this.ruleForm1.intro = res.data.list.tuan.intro;
            this.ruleForm1.price[0].inventory = res.data.list.tuan.inventory;
            this.ruleForm1.price[0].inventory_state = parseInt(
              res.data.list.tuan.inventory_state
            );
            this.ruleForm1.limit_amount = res.data.list.tuan.limit_amount;
            this.ruleForm1.limit_num = res.data.list.tuan.limit_num;
            this.ruleForm1.price[0].market_price = parseFloat(
              res.data.list.tuan.market_price
            );

            this.ruleForm1.member_pay =
              res.data.list.tuan.member_pay == "1" ? true : false;

            this.ruleForm1.price[0].price = parseFloat(
              res.data.list.tuan.price
            );

            //  this.ruleForm1.short_title=res.data.list.tuan.short_title
            // 获取商品标签

            if (
              res.data.list.tuan.short_title != "" &&
              res.data.list.tuan.short_title.length > 1 &&
              res.data.list.tuan.short_title.split("_").length > 1
            ) {
              res.data.list.tuan.short_title.split("_").forEach((x, i) => {
                this.ruleForm1.short_title[i].text = x;
              });
            } else {
              this.ruleForm1.short_title[0].text =
                res.data.list.tuan.short_title;
            }

            this.ruleForm1.show_extract_time =
              res.data.list.tuan.show_extract_time == "1" ? true : false;
            this.ruleForm1.price[0].specification_name =
              res.data.list.tuan.specification_name;
            this.ruleForm1.price[0].supply_price =
              res.data.list.tuan.supply_price;

            if (res.data.list.tuan.thumb) {
              this.ruleForm1.thumb = res.data.list.tuan.thumb;
              this.ruleForm1.file.push({
                name: "123.jpg",
                url: res.data.list.tuan.thumb
              });
            }
            this.type = parseInt(res.data.list.tuan.type);
            res.data.list.picture.map(x => {
              this.ruleForm1.picture.push({ thumb: x.picture });
              this.ruleForm1.fileList.push({ name: "123.jpg", url: x.picture });
            });
            if (this.ruleForm1.type == 1 && this.ruleForm1.type == 2) {
              this.ruleForm1.people = res.data.list.people;
            } else {
              this.ruleForm1.peopleList = res.data.list.people;
            }

            this.ruleForm1.tuan_time = res.data.list.tuan.tuan_time;
            this.ruleForm1.end_time = res.data.list.tuan.end_time * 1000;
            this.ruleForm1.price[0].unit = res.data.list.tuan.unit;
            this.ruleForm1.virtual_sales_volume =
              res.data.list.tuan.virtual_sales_volume;
            this.ruleForm1.price[0].weight = res.data.list.tuan.weight;
            //富文本编辑器神坑处理
            this.$nextTick(function() {
              this.$refs.myQuillEditor.quill.enable(true);
              this.$refs.myQuillEditor.quill.blur();
            });
          } else {
            this.$api.error(res.data.msg);
          }
        })
        .catch(res => {
          console.log(res);

          this.$api.error();
        });
    },
    // 点击了修改
    onedit() {
      if (this.ruleForm1.id == "") {
        this.$api.error("请选择商品名称");
        return;
      }

      if (!this.check()) {
        return;
      }
      // 判断结束
      let data = _.cloneDeep(this.ruleForm1);
      console.log(data);

      for (const key in data) {
        if (data[key] === true) {
          data[key] = 1;
        } else if (data[key] === false) {
          data[key] = 0;
        }
        if (key == "price") {
          data[key].map(x => {
            for (const keys in x) {
              data[keys] = x[keys];
            }
          });
        }
      }

      // picture
      if (data.dispatchings[0].checked && data.dispatchings[1].checked) {
        data.dispatching = 0;
      } else if (
        data.dispatchings[0].checked == true &&
        data.dispatchings[1].checked == false
      ) {
        data.dispatching = 1;
      } else if (
        data.dispatchings[0].checked == false &&
        data.dispatchings[1].checked == true
      ) {
        data.dispatching = 2;
      } else if (
        data.dispatchings[0].checked == false &&
        data.dispatchings[1].checked == false
      ) {
        data.dispatching = 3;
      }
      data.type = this.type;
      if (data.end_time) {
        data.end_time = data.end_time / 1000;
      }
      data.short_title = this.labelfun();
      data.picture = JSON.stringify(data.picture);
      data.people = JSON.stringify(data.people);
      data.id = this.editId;
      this.$api
        .getwxupdateTuans(data)
        .then(res => {
          if (res.data.code == 200) {
            this.$message.success(res.data.msg);
            this.$router.push("/tuan");
          } else {
            this.$api.error(res.data.msg);
          }
        })
        .catch(res => {
          this.$api.error();
        });
    }
  },
  // 监听属性
  watch: {
    type(e) {
      if (e == 1 || e == 2) {
        this.ruleForm1.people = [
          {
            people: 5,
            people_price: ""
          }
        ];
      } else {
        if (this.isedit && this.ruleForm1.peopleList.length > 0) {
          this.ruleForm1.people = this.ruleForm1.peopleList;
        }
      }
    }
  },
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
    sessionStorage.removeItem("goods_id");
    sessionStorage.removeItem("shop_id");
  }
};
</script>

<style lang="less" scoped>
// .editor{
//     height: 300px;
// }
/deep/ .editor .ql-container {
   min-height: 300px !important;
}
.input_box {
  display: flex;
  justify-content: space-between;
}
</style>