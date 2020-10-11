<template>
  <div>
    <el-card>
      <el-row>
        <el-col :span="24">
          <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="120px">
            <el-form-item label="商品类别">
              <!-- <el-input v-model="ruleForm.name"></el-input> -->
              <el-select v-model="ruleForm.selectValue" placeholder="请选择商品类别">
                <el-option
                  v-for="item in ruleForm.options"
                  :key="item.id"
                  :label="item.title"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="商品名称" v-if="!this.isedit">
              <el-button
                type="primary"
                icon="el-icon-circle-plus-outline"
                size="small"
                @click="ontable"
                v-no-click
              >{{btnTitle}}</el-button>
            </el-form-item>
            <el-form-item label="商品别名">
              <el-input v-model="ruleForm.name" placeholder="线上商城对商品名称的重写，为空将读取商品名称"></el-input>
            </el-form-item>
            <el-form-item label="商品别名">
              <el-radio v-model="ruleForm.type" label="0">普通商品</el-radio>
              <el-tooltip class="item" effect="dark" content="加工商品（适用于榨汁 果切 熟食加工）" placement="top">
                <el-radio v-model="ruleForm.type" label="1">加工商品</el-radio>
              </el-tooltip>
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
            <el-form-item label="商品关键词">
              <el-input v-model="ruleForm.antistop" placeholder="此处只能填写一个关键词，如潮流风衣"></el-input>
            </el-form-item>
            <el-form-item label="商品描述">
              <el-input v-model="ruleForm.intro" placeholder="商品简要描述，最多可输入200个字符"></el-input>
            </el-form-item>
            <el-form-item label="佣金推广">
              <el-switch
                v-model="ruleForm.commission"
                active-color="#008080"
                inactive-color="#ff4949"
                active-text="是"
                inactive-text="否"
              ></el-switch>
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
                <!-- 加工商品 -->
                <el-table
                  :data="ruleForm.price"
                  border=""
                  style="width: 100%"
                  v-show="ruleForm.type=='1'"
                >
                  <el-table-column label="单位名称" width="180">
                    <template slot-scope="row">
                      <el-input v-model="row.row.name"></el-input>
                    </template>
                  </el-table-column>
                  <el-table-column label="*计件数" width="280">
                    <template slot-scope="row">
                      <el-input
                        v-model="row.row.unit"
                        type="Number"
                        style="width:50%"
                        @input="oninputs(row)"
                      ></el-input>
                      <el-select v-model="row.row.amount" style="width:50%">
                        <el-option
                          v-for="(item,index) in ruleForm.optionsPiece"
                          :key="index"
                          :label="item.name"
                          :value="item.price"
                        ></el-option>
                      </el-select>
                    </template>
                  </el-table-column>
                  <el-table-column label="*成本价(元)" width="180">
                    <template slot-scope="row">
                      <el-input v-model="row.row.supply_price" type="Number"></el-input>
                    </template>
                  </el-table-column>
                  <el-table-column label="*市场价(元)" width="180">
                    <template slot-scope="row">
                      <el-input v-model="row.row.market_price" type="number"></el-input>
                    </template>
                  </el-table-column>
                  <!-- 商城价(元)/ -->
                  <el-table-column label="*商城价(元)" width="180">
                    <template slot-scope="row">
                      <el-input v-model="row.row.price" type="number"></el-input>
                    </template>
                  </el-table-column>
                  <!--  -->
                  <!-- product_attribute -->
                  <el-table-column prop label="*会员价(元)" width="180">
                    <template slot-scope="row">
                      <el-input v-model="row.row.member_price" type="number"></el-input>
                    </template>
                  </el-table-column>
                  <el-table-column prop label="包装费" width="180">
                    <template slot-scope="row">
                      <el-select v-model="row.row.attribute_template" placeholder="库存设置">
                        <el-option
                          v-for="item in product_attribute"
                          :key="item.id"
                          :label="item.name"
                          :value="item.id"
                        ></el-option>
                      </el-select>
                    </template>
                  </el-table-column>
                  <!--  -->
                  <!-- <el-table-column prop label="当前库存" width="180">
                  <template slot-scope="row">
                    <el-input v-model="row.row.packing_expense"></el-input>
                  </template>
                  </el-table-column>-->
                  <!--  -->
                  <el-table-column prop label="包装费" width="180">
                    <template slot-scope="row">
                      <el-input v-model="row.row.packing_expense"></el-input>
                    </template>
                  </el-table-column>
                  <el-table-column prop label="新人专享(元)" width="180">
                    <template slot-scope="row">
                      <el-input v-model="row.row.discount" type="number"></el-input>
                    </template>
                  </el-table-column>
                  <el-table-column prop label="库存设置" width="150">
                    <template slot-scope="row">
                      <!-- <el-input v-model="ruleForm.prices.discount" ></el-input> -->
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
                  <el-table-column label="售完即止" width="180">
                    <template slot-scope="row">
                      <el-checkbox v-model="row.row.state"></el-checkbox>
                    </template>
                  </el-table-column>
                  <!-- 佣金方式 -->
                  <el-table-column label="佣金方式" width="180">
                    <template slot-scope="row">
                      <el-select v-model="row.row.commission_state" placeholder="佣金方式">
                        <el-option
                          v-for="item in commission_state"
                          :key="item.id"
                          :label="item.name"
                          :value="item.id"
                        ></el-option>
                      </el-select>
                    </template>
                  </el-table-column>
                  <el-table-column label="佣金数值" width="180">
                    <template slot-scope="row">
                      <el-input v-model="row.row.commission_num" placeholder="百分比%" type="number"></el-input>
                    </template>
                  </el-table-column>
                  <el-table-column label="操作">
                    <template slot-scope="row">
                      <el-button size="small" type="danger" @click="ondeltable(row)" v-no-click>删除</el-button>
                    </template>
                  </el-table-column>
                </el-table>
                <!-- 普通商品 -->
                <el-table
                  :data="ruleForm.prices"
                  border=""
                  style="width:100%"
                  v-show="ruleForm.type=='0'"
                >
                  <el-table-column label="单位名称" width="180">
                    <template slot-scope="row">
                      <el-input v-model="row.row.name"></el-input>
                    </template>
                  </el-table-column>
                  <el-table-column label="*计件数" width="280">
                    <template slot-scope="row">
                      <el-input
                        v-model="row.row.amount"
                        type="Number"
                        style="width:50%"
                        @input="oninput(row)"
                      ></el-input>
                      <el-select v-model="row.row.unit" style="width:50%">
                        <el-option
                          v-for="(item,index) in ruleForm.optionsPiece"
                          :key="index"
                          :label="item.name"
                          :value="item.price"
                        ></el-option>
                      </el-select>
                    </template>
                  </el-table-column>
                  <el-table-column label="*成本价(元)" width="180">
                    <template slot-scope="row">
                      <el-input v-model="row.row.supply_price"></el-input>
                    </template>
                  </el-table-column>
                  <el-table-column label="*市场价(元)" width="180">
                    <template slot-scope="row">
                      <el-input v-model="row.row.market_price" type="number"></el-input>
                    </template>
                  </el-table-column>
                  <!-- 商城价(元)/ -->
                  <el-table-column label="*商城价(元)" width="180">
                    <template slot-scope="row">
                      <el-input v-model="row.row.price" type="number"></el-input>
                    </template>
                  </el-table-column>
                  <!--  -->
                  <el-table-column prop label="*会员价(元)" width="180">
                    <template slot-scope="row">
                      <el-input v-model="row.row.member_price" type="number"></el-input>
                    </template>
                  </el-table-column>
                  <el-table-column prop label="新人专享(元)" width="180">
                    <template slot-scope="row">
                      <el-input v-model="row.row.discount" type="number"></el-input>
                    </template>
                  </el-table-column>
                  <el-table-column prop label="库存设置" width="150">
                    <!-- 写到这 -->
                    <template slot-scope="row">
                      <!-- <el-input v-model="ruleForm.prices.discount" ></el-input> -->
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
                  <el-table-column label="售完即止">
                    <template slot-scope="row">
                      <el-checkbox v-model="row.row.state"></el-checkbox>
                    </template>
                  </el-table-column>
                  <!-- 佣金方式 -->
                  <el-table-column label="佣金方式" width="150">
                    <template slot-scope="row">
                      <el-select v-model="row.row.commission_state" placeholder="佣金方式">
                        <el-option
                          v-for="item in commission_state"
                          :key="item.id"
                          :label="item.name"
                          :value="item.id"
                        ></el-option>
                      </el-select>
                    </template>
                  </el-table-column>
                  <el-table-column label="佣金数值" width="150">
                    <template slot-scope="row">
                      <el-input v-model="row.row.commission_num" placeholder="百分比%" type="number"></el-input>
                    </template>
                  </el-table-column>
                  <el-table-column label="操作">
                    <template slot-scope="row">
                      <el-button size="small" type="danger" @click="ondeltable(row)" v-no-click>删除</el-button>
                    </template>
                  </el-table-column>
                  <!-- commission_num -->
                </el-table>
                <div style="color:#FF0000">（商城价、会员价不能小于0.01元；商品设置为新人专享商品必须设置新人专享价，新人专享价不设置默认为商城价）</div>
                <el-button size="small" type="primary" @click="onadded" v-no-click>新增一行</el-button>
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
                  :file-list="file"
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
                :file-list="files"
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
            <el-form-item label="虚拟销量" prop="sale_num">
              <el-input
                v-model="ruleForm.sale_num"
                type="number"
                placeholder="（输入正整数，商城显示销量等于真实销量+虚拟销量）"
              ></el-input>
            </el-form-item>
            <el-form-item label="商品排序" prop="sort">
              <el-input v-model="ruleForm.sort" type="number" placeholder="商城商品排序从大到小排列"></el-input>
            </el-form-item>
            <!-- <el-form-item label="商品运费模板" prop="name">
                            <el-select v-model="ruleForm.freight_template" placeholder="请选择店铺类别">
                                <el-option
                                    v-for="item in freight_template"
                                    :key="item.id"
                                    :label="item.name"
                                    :value="item.id"
                                ></el-option>
                            </el-select>
                            <div class="herght"></div>
                            <div style="color:#ccc">不选择运费模板，系统将根据店铺默认使用的运费模板计算运费</div>
            </el-form-item>-->
            <el-form-item label="是否使用优惠券">
              <!-- <el-input v-model="ruleForm.name" placeholder="商城商品排序从大到小排列"></el-input> -->
              <el-switch
                v-model="ruleForm.switch"
                active-color="#008080"
                inactive-color="#ff4949"
                active-text="是"
                inactive-text="否"
              ></el-switch>
            </el-form-item>
            <el-form-item label="上架状态">
              <!-- <el-input v-model="ruleForm.name" placeholder="商城商品排序从大到小排列"></el-input> -->
              <el-switch
                v-model="ruleForm.state"
                active-color="#008080"
                inactive-color="#ff4949"
                active-text="上架"
                inactive-text="下架"
              ></el-switch>
              <span style="color:#ccc">微商城商品的上架状态</span>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="onsubmit" v-no-click v-if="!isedit">提交</el-button>
              <el-button type="primary" @click="onedit" v-no-click v-else>提交</el-button>
              <el-button type="info" @click="cancleBtn">取消</el-button>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </el-card>
    <el-dialog :visible.sync="imgVisible" width="30%">
      <img width="100%" :src="ruleForm.temppis" alt="">
    </el-dialog>
    <!--  添加对话框-->
    <el-dialog title="商品列表" :visible="dialogVisible" width="50%" :show-close="false" :close-on-click-modal="false" :close-on-press-escape="false">
      <el-row>
        <el-col :span="6">
          <el-select v-model="goodsSelect" placeholder="请选择">
            <el-option
              v-for="item in goodsOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-col>
        <el-col :span="8">
          <el-input placeholder="请输入内容" v-model="serchinput" clearable @clear="onclery">
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
          :total="count"
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
import { validtel } from "@/utils/validtel.js";

import { log } from "util";
import { setTimeout } from 'timers';
export default {
  // props:[],
  // 页面加载
  created() {

    let that = this;
    // 判断是添加还是删除 根据传过来的id判断
    if (this.$route.params.id) {
      sessionStorage.setItem("id", this.$route.params.id);
    }
    if (this.$route.params.id || sessionStorage.getItem("id")) {
      this.isedit = true;
      this.editId = this.$route.params.id || sessionStorage.getItem("id");
      this.getupdateWeiGoods();
    }
  if (this.$route.params.shop_id || sessionStorage.getItem("shop_id")) {
      this.ruleForm.shop_id = this.$route.params.shop_id || sessionStorage.getItem("shop_id");
    }
    this.getaddWeiGoods();
        this.getgoodsList();
    that.editorOption = quillRedefine({
      uploadConfig: {
        token: sessionStorage.getItem("token") || "",
        action: "https://manage.zhixianyun.cn/mapi/upload/pic", // 必填参数 图片上传地址
        // 必选参数  res是一个函数，函数接收的response为上传成功时服务器返回的数据
        accept: "image/*,image/png, image/gif, image/jpeg, image/bmp, image/x-icon,image/jpg", // 可选参数 可上传的图片格式
        // 你必须把返回的数据中所包含的图片地址 return 回去
        res: respnse => {
          if(respnse.code==200){
                   return respnse.url
          }
          // var path = respnse.path; //这里return你的图片地址即可
          //  path;
        },
        methods: "POST",
        error: () => {
          this.$api.error("上传图片失败");
        }, //
        success: () => {
          this.$message.success("上传成功");
        }, // 可选参数 接收一个函数 上传数据成功时会触发
        name: "file" // 图片上传参数名
      },
      placeholder:
        "详细描述一般包含商品功能属性、商品细节图片、支付物流、售后服务、公司实力等内容"
    });
  },
  // 页面加载完成
  mounted() {
    // 禁止富文本编辑器获取焦点
    this.$refs.myQuillEditor.quill.enable(false)
    if(!this.isedit){
          setTimeout(()=>{
          //富文本编辑器神坑处理
          this.$nextTick(function() {
            this.$refs.myQuillEditor.quill.enable(true);
            this.$refs.myQuillEditor.quill.blur();
          });
    },500)
    }   
    
  },
  data() {
    return {
      isedit: false, //判断是修改还是删除
      editId: "",
      goodsOptions: [
        {
          value: 1,
          label: "商品id"
        },
        {
          value: 2,
          label: "商品名称"
        },
        {
          value: 3,
          label: "商品编号"
        }
      ],
      goodsSelect: 1,
      serchinput: "", //搜搜内容
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
          name: "真实库存",
          id: 1
        },
        {
          name: "虚拟库存",
          id: 0
        }
      ],
      tableList: [],
      count: 0,
      pagenum: 1,
      pagesize: 7,
      freight_template: [],
      tableData: [],
      content: null,
      editorOption: {
        placeholder:
          "详细描述一般包含商品功能属性、商品细节图片、支付物流、售后服务、公司实力等内容"
      },
      header: {
        Authorization: sessionStorage.getItem("token") || ""
      },
      btnTitle: "选择名称",
      dialogVisible: false,
      file: [], //图片数组
      files: [],
      imgVisible: false,
      ruleForm: {
        shop_id:"",
        goods_id: "",
        id: "",
        content: "",
        names: [{ name: "" }, { name: "" }, { name: "" }, { name: "" }],
        commission: false,
        state: true,
        optionsPiece: [],
        selectPiece: "", //件个数数组
        name: "", //商品别名
        selectValue: "", //下拉菜单选中的值
        options: [], //下拉菜单数组
        type: "0", //单选框选中的值
        antistop: "", //商品关键词
        intro: "", //商品描述
        sort: 0, //商品排序
        freight_template: "",
        sale_num: 0,
        switch: true, //开关的值
        temppis: "", //预览图片的地址
        file: {
          title: "", //图片主图上传地址
          list: []
        },
        // 加工商品
        price: [
          {
            name: "",
            unit: "",
            amount: "",
            supply_price: "",
            market_price: "",
            price: "",
            member_price: "",
            discount: 0,
            packing_expense: "",
            attribute_template: "",
            inventory_state: 1,
            inventory: 0,
            state: "",
            commission_state: 1,
            commission_num: 0
          }
        ],
        // 普通商品
        prices: [
          {
            name: "",
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
            bulk: ""
          }
        ],
        freight_template: ""
      },
      rules: {
        name: [
          { required: true, message: "请输入活动名称", trigger: "blur" },
          { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" }
        ],
        sale_num: [
          { required: validtel, message: "请输入正整数", trigger: "blur" }
        ],
        sort: [{ required: validtel, message: "请输入正整数", trigger: "blur" }]

        // sale_num sort
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
    // 获取数据列表
    getaddWeiGoods() {
      this.$api
        .getaddWeiGoods({
          params:{
            id:this.ruleForm.shop_id
          }
        })
        .then(res => {
          if (res.data.code == 200) {
            this.ruleForm.options = res.data.cate;
            this.freight_template = res.data.freight_template;
            this.product_attribute = res.data.product_attribute;
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
    getgoodsList() {
      this.$api
        .getgoodsLists({
          pagenum: this.pagenum,
          pagesize: this.pagesize,
          shop_id:this.ruleForm.shop_id
        })
        .then(res => {
          if (res.data.code == 200) {
            this.tableData = res.data.list;
            this.count = res.data.count;
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
      console.log(e);
      if (e.code == 200) {
        this.ruleForm.file.title = e.url;
      }
    },
    // 上传图片成功
    AvatarSuccess(e) {
      if (e.code == 200) {
        this.ruleForm.file.list.push(e.url);
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
         let index = this.ruleForm.file.list.findIndex(x => {
        return x == e.url;
      });
      if (index != -1) {
        this.ruleForm.file.list.splice(index, 1);
      }
      } else {
         let index = this.ruleForm.file.list.findIndex(x => {
        return x == e.response.name;
      });
      if (index != -1) {
        this.ruleForm.file.list.splice(index, 1);
      }
      }


      
     
    },
    // 删除图片
    onRemove() {
      this.ruleForm.file.title = "";
    },
    onEditorBlur() {},
    onEditorFocus() {
      //获得焦点事件
      //  editor.enable(false)
    },
    onEditorChange() {
      //内容改变事件
        // this.$refs.myQuillEditor.quill.enable(true)
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
        .getweiGoodsSubmit({
          id: this.selection[0].id,
          shop_id:this.ruleForm.shop_id
        })
        .then(res => {
          if (res.data.code == 200) {
            this.ruleForm.id = res.data.data.id;
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
              // this.ruleForm.amount = this.ruleForm.optionsPiece[0].price;
              this.ruleForm.prices.map(x => {
                x.unit = this.ruleForm.optionsPiece[0].price;
              });
              this.ruleForm.price.map(x => {
                x.unit = this.ruleForm.optionsPiece[0].price;
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
      this.pagenum = e;
      this.getgoodsList();
    },
    // 分页
    handleSizeChange(e) {
      this.pagesize = e;
      this.getgoodsList();
    },
    // 表格被选中
    handleSelectionChange(e) {
      this.selection = [];
      this.selection = e;
    },
    // 点击新增一行
    onadded() {
      if (this.ruleForm.type == 0) {
        // 普通商品
        let arr = {
          name: "",
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
          bulk: ""
        };
        this.ruleForm.prices.push(arr);
      } else {
        let arr = {
          name: "",
          unit: "",
          amount: "",
          supply_price: "",
          market_price: "",
          price: "",
          member_price: "",
          discount: 0,
          packing_expense: "",
          attribute_template: "",
          inventory_state: 1,
          inventory: 0,
          state: "",
          commission_state: 1,
          commission_num: 0
        };
        this.ruleForm.price.push(arr);
      }
      //  处理默认选中计件数问题
      console.log(this.ruleForm.optionsPiece);

      if (this.ruleForm.optionsPiece.length > 0) {
        // this.ruleForm.amount = this.ruleForm.optionsPiece[0].price;
        this.ruleForm.prices.map(x => {
          x.unit = this.ruleForm.optionsPiece[0].price;
        });
        this.ruleForm.price.map(x => {
          x.unit = this.ruleForm.optionsPiece[0].price;
        });
      }
    },
    // 点击了删除一行表格
    ondeltable(row) {
      if (this.ruleForm.type == 0) {
        console.log(this.ruleForm.prices.length);
        if (this.ruleForm.prices.length == 1) {
          this.$api.error("只能保留一行");
          return;
        }
        this.$confirm("此操作将永久删除, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            this.ruleForm.prices.splice(row.$index, 1);
          })
          .catch(() => {});
      } else {
        if (this.ruleForm.price.length == 1) {
          this.$api.error("只能保留一行");
          return;
        }
        this.$confirm("此操作将永久删除, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            this.ruleForm.price.splice(row.$index, 1);
          })
          .catch(() => {});
      }
    },
    // 提交表单
    onsubmit() {
      if (this.ruleForm.selectValue == "") {
        this.$api.error("请选择店铺类别");
        return;
      }
      if (this.tableList.length == 0) {
        this.$api.error("请选择商品名称");
        return;
      }

      if (this.ruleForm.type == 0) {
        let issome = this.ruleForm.prices.some(x => {
          if (x.name == "") {
            this.$api.error("请输入单位名称");
            return false;
          }
          if (x.unit == "") {
            this.$api.error("请输入计件数");
            return false;
          }

          if (x.market_price == "") {
            this.$api.error("请输入市场价");
            return false;
          }
          if (x.price == "") {
            this.$api.error("请输入商城价");
            return false;
          }
          if (x.member_price == "") {
            this.$api.error("请输入会员价");
            return false;
          }
          return true;
        });
        if (!issome) {
          return;
        }
      } else {
        if (this.ruleForm.price.length == 1) {
          let issome = this.ruleForm.price.some(x => {
            if (x.name == "") {
              this.$api.error("请输入单位名称");
              return false;
            }
            if (x.unit == "") {
              this.$api.error("请输入计件数");
              return false;
            }
            if (x.market_price == "") {
              this.$api.error("请输入市场价");
              return false;
            }
            if (x.price == "") {
              this.$api.error("请输入商城价");
              return false;
            }
            if (x.member_price == "") {
              this.$api.error("请输入会员价");
              return false;
            }
            return true;
          });
          if (!issome) {
            return;
          }
        }
      }
      let data = {
        cate_id: this.ruleForm.selectValue,
        name: this.ruleForm.name,
        type: this.ruleForm.type,
        // 如果用户输入为空 就返回？
        short_title: this.labelfun(),
        antistop: this.ruleForm.antistop,
        intro: this.ruleForm.intro,
        thumb: this.ruleForm.file.title,
        content: this.ruleForm.content,
        sale_num: this.ruleForm.sale_num,
        sort: this.ruleForm.sort,
        forsale: this.ruleForm.switch ? 1 : 0,
        coupon_state: this.ruleForm.state ? 1 : 0,
        commission: this.ruleForm.commission ? 1 : 0,
        shop_id:this.ruleForm.shop_id,
        picture: JSON.stringify(
          this.ruleForm.file.list.map(x => {
            return { thumb: x };
          })
        ),
        goods_id: this.ruleForm.id
      };
      // data.picture=
      if (this.ruleForm.type == 0) {
        data.price = JSON.stringify(this.ruleForm.prices);
      } else {
        data.price = JSON.stringify(this.ruleForm.price);
      }
        this.$refs.ruleForm.validate((valid) => {
         if(valid){
      this.$api
        .getaddWeiGood(data)
        .then(res => {
          if (res.data.code == 200) {
            this.$message.success(res.data.msg);
            this.$router.push("/goodslisttwo");
          } else {
            this.$api.error(res.data.msg);
          }
        })
        .catch(res => {
          this.$api.error();
          console.log(res);
        });
         }
        })
    },
    cancleBtn(){
      this.$router.push('goodslisttwo')
    },
    labelfun() {
      let arr = [];
      this.ruleForm.names.forEach(x => {
        if (!x.name == "") {
          arr.push(x.name);
        }
      });
      console.log(arr);

      if (arr.length > 0) {
        return arr.join("_");
      }
      return "";
    },
    // 搜索接口
    onserch() {
      if (this.serchinput == "") {
        this.$api.error("请输入内容");
        return;
      }
      this.pagenum = 1;
      this.$api
        .getgoodsLists({
          pagenum: this.pagenum,
          pagesize: this.pagesize,
          id: this.goodsSelect,
          keyword: this.serchinput
        })
        .then(res => {
          if (res.data.code == 200) {
            this.tableData = res.data.list;
            this.count = res.data.count;
          } else {
            this.$api.error(res.data.msg);
          }
        })
        .catch(res => {
          this.$api.error();
          console.log(res);
        });
    },
    onclery() {
      this.pagenum = 1;
      this.getgoodsList();
    },
    // 修改商品价格事件
    oninput(row) {
      // console.log(row);
      // prices
      // $index
      // console.log(123);
      // row.row.unit" type="Number" style="width:50%" @input="oninput"></el-input>
      //               <el-select v-model="row.row.amount
      let value =
        this.ruleForm.prices[row.$index].unit *
        this.ruleForm.prices[row.$index].amount;
      function rounding(value) {
        //debugger
        //console.log("====",value);
        if (typeof value == "number") {
          return value.toFixed(2);
        } else {
          return value;
        }
      }
      this.ruleForm.prices[row.$index].supply_price = rounding(value);
    },
    // 修改加工商品
    oninputs(row) {
      let value =
        this.ruleForm.price[row.$index].unit *
        this.ruleForm.price[row.$index].amount;
      function rounding(value) {
        //debugger
        //console.log("====",value);
        if (typeof value == "number") {
          return value.toFixed(2);
        } else {
          return value;
        }
      }
      this.ruleForm.price[row.$index].supply_price = rounding(value);
    },
    // 修改商品
    getupdateWeiGoods() {
      this.$api
        .getupdateWeiGoods({
          params: {
            pid: this.editId,
          }
        })
        .then(res => {
          if (res.data.code == 200) {
            this.ruleForm.antistop = res.data.list.antistop;
            this.ruleForm.content = res.data.list.content;
            this.ruleForm.switch =
              res.data.list.coupon_state == 0 ? false : true;
            this.ruleForm.state = res.data.list.forsale == 0 ? false : true;
            this.ruleForm.intro = res.data.list.intro;
            this.btnTitle = res.data.list.name;
            this.ruleForm.sale_num = res.data.list.sale_num;
            this.ruleForm.id = res.data.list.pid;
            this.ruleForm.goods_id = res.data.list.gid;
            this.ruleForm.name = res.data.list.pname;
            // 获取商品标签
            if (
              res.data.list.short_title != "" &&
              res.data.list.short_title.length > 1 &&
              res.data.list.short_title.split("_").length > 1
            ) {
              res.data.list.short_title.split("_").forEach((x, i) => {
                this.ruleForm.names[i].name = x;
              });
            }
            // 获取图片
            res.data.list.picture.forEach(x => {
              let obj = {
                name: "food2.jpeg",
                url: x.picture
              };
              this.files.push(obj);
              // picture
              this.ruleForm.file.list.push(x.picture);
            });
            // pname
            // 获取主图
            if (res.data.list.thumb) {
              this.file = [
                {
                  name: "food2.jpeg",
                  url: res.data.list.thumb
                }
              ];
            }
            this.ruleForm.sort = res.data.list.sort;
            this.ruleForm.file.title = res.data.list.thumb;
            this.ruleForm.selectValue = res.data.list.cid;
            // ruleForm.selectValue

            //  price
            // 获取计件的情趣  获取图片
            res.data.list.price.forEach(x => {
              let obj = {
                name: x.name,
                price: x.price
              };
              this.ruleForm.optionsPiece.push(obj);
            });
            this.tableList = res.data.list.price;
            // 根据返回来不同的type渲染不同的加工商品生产商品
            if (res.data.list.type == 0) {
              this.ruleForm.prices = [];
              res.data.list.price_wei.map(x => {
                let arr = {
                  name: x.name,
                  unit: x.unit,
                  amount: x.amount,
                  supply_price: x.supply_price,
                  market_price: x.market_price,
                  price: x.price,
                  member_price: x.member_price,
                  discount: x.discount,
                  inventory_state: parseInt(x.inventory_state) == 0 ? 0 : 1,
                  inventory: x.inventory,
                  state: x.state,
                  commission_state: parseInt(x.commission_state) == 0 ? 0 : 1,
                  commission_num: x.commission_num,
                  weight: x.weight,
                  bulk: x.bulk
                };

                this.ruleForm.prices.push(arr);
              });
            } else {
              this.ruleForm.price = [];
              res.data.list.price_wei.map(x => {
                let arr = {
                  name: x.name,
                  unit: x.unit,
                  amount: x.amount,
                  supply_price: x.supply_price,
                  market_price: x.market_price,
                  price: x.price,
                  member_price: x.member_price,
                  discount: x.discount,
                  packing_expense: x.packing_expense,
                  attribute_template: x.attribute_template,
                  inventory_state: parseInt(x.inventory_state) == 0 ? 0 : 1,
                  inventory: x.inventory,
                  state: x.state,
                  commission_state: parseInt(x.commission_state) == 0 ? 0 : 1,
                  commission_num: x.commission_num
                };
                this.ruleForm.price.push(arr);
              });
            }
            // 默认选择计件数下拉菜单
            if (this.ruleForm.optionsPiece.length > 0) {
              this.ruleForm.prices.map(x => {
                x.unit = this.ruleForm.optionsPiece[0].price;
              });
              this.ruleForm.price.map(x => {
                x.unit = this.ruleForm.optionsPiece[0].price;
              });
            }
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
          this.$api.error();
          console.log(res);
        });
    },
    onedit() {
      if (this.tableList.length == 0) {
        this.$api.error("请选择商品名称");
        return;
      }

      if (this.ruleForm.type == 0) {
        let issome = true;
        this.ruleForm.prices.forEach(x => {
          if (x.name == "") {
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
            this.$api.error("请输入商城价");
            issome = false;
          }
          if (x.member_price == "") {
            this.$api.error("请输入会员价");
            issome = false;
          }
        });

        if (!issome) {
          return;
        }
      } else {
        let issome = true;
        this.ruleForm.price.forEach(x => {
          if (x.name == "") {
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
            this.$api.error("请输入商城价");
            issome = false;
          }
          if (x.member_price == "") {
            this.$api.error("请输入会员价");
            issome = false;
          }
        });
        if (!issome) {
          return;
        }
      }
      let data = {
        cate_id: this.ruleForm.selectValue,
        name: this.ruleForm.name,
        type: this.ruleForm.type,
        short_title: this.labelfun(),
        antistop: this.ruleForm.antistop,
        intro: this.ruleForm.intro,
        thumb: this.ruleForm.file.title,
        content: this.ruleForm.content,
        sale_num: this.ruleForm.sale_num,
        sort: this.ruleForm.sort,
        forsale: this.ruleForm.switch ? 1 : 0,
        coupon_state: this.ruleForm.state ? 1 : 0,
        commission: this.ruleForm.commission ? 1 : 0,
        picture: JSON.stringify(
          this.ruleForm.file.list.map(x => {
            return { thumb: x };
          })
        ),
        goods_id: this.ruleForm.goods_id,
        pid: this.ruleForm.id
      };
      if (this.ruleForm.type == 0) {
        data.price = JSON.stringify(this.ruleForm.prices);
      } else {
        data.price = JSON.stringify(this.ruleForm.price);
      }
       this.$refs.ruleForm.validate((valid) => {
         if(valid){
              this.$api
        .getupdatewxGoods(data)
        .then(res => {
          if (res.data.code == 200) {
            this.$message.success(res.data.msg);
            this.$router.push("/goodslisttwo");
          } else {
            this.$api.error(res.data.msg);
          }
        })
        .catch(res => {
          this.$api.error();
          console.log(res);
        });
         }
       })
      
    }
    // getupdateWeiGoods
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
      //debugger
      //console.log("====",value);
      if (typeof value == "number") {
        return value.toFixed(2);
      } else {
        return value;
      }
    }
  },
  //实例销毁之前
  beforeDestroy() {
    sessionStorage.removeItem("id");
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
