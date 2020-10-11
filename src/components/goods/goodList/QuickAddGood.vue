<template>
    <div>
       <el-card>
           <div class="title">快速添加商品</div>
           <el-form :model="addGoodForm" :rules="addGoodFormRules" ref="addGoodFormRef" label-width="90px" class="addGoodForm" >
            <!-- <el-form-item label="商品分类" prop="sort" >
                <el-select v-model="addGoodForm.sort" placeholder="商品分类" @change="onselect">
                    <el-option
                    v-for="item in sortOptions"
                    :key="item.id"
                    :label="item.title"
                    :value="item.id"
                    ></el-option>
                </el-select>
            </el-form-item> -->
            <el-form-item label="店铺列表" >
          <el-table
            :data="tableData"
            border=""
            style="width: 100%"
            @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55" ></el-table-column>
            <el-table-column prop="title" label="店铺名称"></el-table-column>
            <el-table-column label="选择分类">
              <template slot-scope="scope">
                  <!--<el-select v-model="addGoodForm.sort" placeholder="商品分类" @change="cate_select(scope.$index)">
                  <el-option
                    v-for="item in scope.row.cate"
                    :key="item.id"
                    :label="item.title"
                    :value="item.id"
                  ></el-option>
                </el-select> -->
                <el-button type="primary" size="mini" class="select_cate" @click="selectCate(scope.row,scope.$index)">选择分类</el-button>
                <el-tag size="mini" v-if="scope.row.tag">{{scope.row.tag}}</el-tag>
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
            <el-form-item label="商品名称" prop="name">
                <el-input
                    v-model="addGoodForm.name"
                    placeholder="请输入商品名称"
                    class="w217"
                    @input="nameChange"
                ></el-input>
            </el-form-item>
            
            <el-form-item label="商品助记码">
                <el-input v-model="addGoodForm.mnemonicCode" class="w217"></el-input>
            </el-form-item>
            <el-form-item label="商品条码" prop="barcode">
                <el-input v-model="addGoodForm.barcode"  class="w217"></el-input>
            </el-form-item> 
            <el-form-item label="商品货号"  prop="goods_no">
                <el-input v-model="addGoodForm.goods_no" class="w217"></el-input>
            </el-form-item>
            <el-form-item label="成本价"  prop="supply_price">
                <el-input v-model="addGoodForm.supply_price" class="w217"></el-input>
            </el-form-item>
            <el-form-item label="销售价"  prop="price">
                <el-input v-model="addGoodForm.price" class="w217"></el-input>
            </el-form-item>
            <el-form-item label="会员价"  prop="member_price">
                <el-input v-model="addGoodForm.member_price" class="w217"></el-input>
            </el-form-item>
           <el-form-item label="是否称重">
                <el-switch v-model="isweight" :active-value="1" :inactive-value="0"  active-text="是" inactive-text="否"></el-switch>
            </el-form-item>
            <el-form-item label="是否上架" required>
              <el-switch v-model="addGoodForm.puaway" :active-value="1" :inactive-value="0" active-text="是" inactive-text="否"></el-switch>
           </el-form-item>
           <!-- <el-form-item label="是否同步" v-if="default_shopid && tableData.length>0">
                <el-switch v-model="shopshow" active-text="是" inactive-text="否"></el-switch>
            </el-form-item> -->
            <!-- <el-form-item label="店铺列表" v-if="shopshow">
                <el-table :data="tableData" border="" style="width: 100%"  @selection-change="handleSelectionChange" >
                    <el-table-column type="selection" width="55"></el-table-column>
                    <el-table-column prop="id" label="店铺Id"></el-table-column>
                    <el-table-column prop="title" label="店铺名称"></el-table-column>
                </el-table>
            </el-form-item> -->
            <el-form-item>
                <el-button @click="resetForm('addGoodFormRef')">重置</el-button>
                <el-button type="primary" @click="submitForm('addGoodFormRef')" v-no-click :disabled="tableData.length == 0">提交</el-button>
            </el-form-item>
        </el-form>
        <el-dialog title="选择商品分类" :visible.sync="cateFormVisible" @close="cateDialogClose">
        <el-form :model="cateForm">
          <el-form-item label="分类" label-width="120px">
             <el-select v-model="cateForm.id" placeholder="选择商品分类" @change="cateChange">
                  <el-option
                    v-for="item in cateList"
                    :key="item.id"
                    :label="item.title"
                    :value="item.id"
                  ></el-option>
                </el-select>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="cateFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="cateAdd(shopIndex)" :disabled="cateList.length == 0 ">确 定</el-button>
        </div>
      </el-dialog>
      </el-card>  
    </div>
</template>

<script>
import vPinyin from "@/assets/js/vue-py.js";
export default {
    data() {
        return {
            tableData:[], // 店铺列表
            shopshow: false,
            shop_id: "",
            shopSelected: [],
            cateForm: { // 商品分类
              title: '',
              id: ''
            },
            cateList: [], //商品分类列表
            cateFormVisible:false, // 商品分类弹框
            shopIndex: '', // 店铺索引
            addGoodFormRules: {
                sort: [{ required: true, message: "请选择商品分类", trigger: "blur" }],
                name: [{ required: true, message: "请输入商品名称", trigger: "blur" }],
                supply_price: [
                  { required: true, message: "请输入成本价格", trigger: "blur" }
                ],
                price: [
                { required: true, message: "请输入销售价格", trigger: "blur" }
                ],
                member_price: [
                { required: true, message: "请输入会员价格", trigger: "blur" }
                ],
                goods_no:[
                { required: true, message: "请输入货号", trigger: "blur" }
                ],
                barcode:[
                { required: true, message: "请输入条码", trigger: "blur" }
                ],
            },
            isweight: 0, // 是否称重
            shopshow: false, // 是否显示同步店铺
            addGoodForm: {
                name: "",// 商品名称
                goods_no:"", // 商品货号
                barcode:"", //商品条码
                shop: "", // 商品分类
                mnemonicCode: "",  // 商品助记码
                puaway: 1, // 是否上架
                sku: 1,// sku单位
                change_price: 1,// 允许改价
                change_discount: 1, // 允许折扣
                change_integral: 1, // 允许积分
                supply_price: "",// 成本价
                price: "", // 销售价
                member_price: "",// 会员价
                base_unit: "", // 单位数量
            }
        };
    },
    created() {
        this.getGoodInfo()
    },
    methods: {
      async getGoodInfo(){
        const loading = this.$loading({
          lock: true,
          text: 'Loading',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.1)'
        });
        const { data: res } = await this.$http.get('mapi/quickAddGoods')
        if (res.status !== 1) return this.$message.error(res.msg);
      // this.$message.success("加载成功！");
        loading.close()
        this.tableData = res.shop
      },
      handleSelectionChange (e) {
        console.log('e',e);
      this.shopSelected = JSON.parse(JSON.stringify(e))
    },
    // eslint-disable-next-line camelcase
    cateChange (i) {
      console.log('分类选择', i)
      var obj = {}
      obj = this.cateList.find(item => {
        return item.id === i
      })
      console.log(obj)
      this.cateForm = obj
    },
    selectCate (row, index) {
      console.log('asdfasd',this.shopSelected);
      if (this.shopSelected.length === 0) return this.$message.error('请先选择店铺再选择商品分类')
      const sShop = this.shopSelected.some(item => {
        return item.id === row.id
      })
      if (!sShop) {
        return this.$message.error('请先选择店铺再选择商品分类')
      }
      this.cateForm.id = ''
      this.cateForm.title = ''
      this.cateList = []
      this.cateList = JSON.parse(JSON.stringify(row.cate))
      // this.cateForm = row
      console.log('this.cateForm.id', this.cateForm.id,this.cateForm.title)
      this.shopIndex = index
      this.cateFormVisible = true
    },
    cateDialogClose () {
      this.cateFormVisible = false
      // this.cateForm.sort = ''
    },
    cateAdd (i) {
      console.log('---', this.cateForm)
      this.tableData[i].tag = this.cateForm.title
      this.tableData[i].cate_id = this.cateForm.id
      this.tableData.forEach((item) =>{
         this.shopSelected.forEach((val) => {
           if(item.id === val.id){
              val.cate_id = item.cate_id
              val.tag = item.tag
           }
         })
      })
      // this.$set(this.tableData, this.shopIndex, this.tableData[this.shopIndex].tag)
      this.cateFormVisible = false
    },
      // //选择商品分类
      // async onselect(e) {
      //   const { data: res } = await this.$http.get("mapi/addGoods", {
      //       params: {
      //       cate_id: e
      //       }
      //   });
      //   if (res.status !== 1) return this.$message.error(res.msg);
      //   console.log(res);
      //   this.tableData = res.shop;
      //   this.default_shopid = res.default_shop.id
      //   if(!this.default_shopid){ this.disabled = true }
      // },
      // // 获取商品分类
      // async getGoodSort(){
      //   const { data: res } = await this.$http.get('mapi/ShareCommon/sort')
      //   if (res.code !== 200) return this.$message.error(res.msg)
      //   this.sortOptions = res.sort
      //   //  console.log('getGoodSort',res.sort);
      // },
      // 商品助记码
      nameChange() {
      let name = vPinyin.chineseToPinYin(this.addGoodForm.name.trim());
      let SX = "";
      for (var i = 0; i < name.length; i++) {
        var c = name.charAt(i);
        if (/^[A-Z]+$/.test(c)) {
          SX += c;
        }
      }
      this.addGoodForm.mnemonicCode = SX;
      },
      // handleSelectionChange(e) {
      //    this.other_shopid = e.map(x => x.id).join(",");
      // },
      submitForm(formName){
           this.$refs[formName].validate(async valid => {
               if(valid){
                   if(this.shopSelected.length == 0) return this.$message.error('请先选择店铺及商品分类')
                    console.log('shopSelected',this.shopSelected);
                    const isSelected = this.shopSelected.some(item => {
                        if(item.cate_id == ''){
                          return false
                        }else{
                          return true
                        }
                    })
                    if(!isSelected) return this.$message.error('请选择已选店铺的商品分类')
                    let addGoodInfo = this.addGoodForm
                    const spec = 
                            {
                            name: this.isweight==1?'千克':'个', // 包装单位
                            amount: 1, // 数量
                            unit: this.isweight==1?'千克':'个', // 单位
                            // eslint-disable-next-line camelcase
                            supply_price: addGoodInfo.supply_price, // 成本价
                            price: addGoodInfo.price, // 销售价
                            // eslint-disable-next-line camelcase
                            member_price: addGoodInfo.member_price, // 会员价
                            // eslint-disable-next-line camelcase
                            type: 1, // 标识，1 为默认的三种销售方式，2为其它销售方式
                            plu: '', // plu码
                            // eslint-disable-next-line camelcase
                            change_price: 1, // 允许改价
                            // eslint-disable-next-line camelcase
                            change_discount: 1, // 允许折扣
                            // eslint-disable-next-line camelcase
                            change_integral: 1, // 允许积分
                            // eslint-disable-next-line camelcase
                            default_sale: 1, // 销售方式
                            // eslint-disable-next-line eqeqeq
                            default: 1,
                            is_weigh: this.isweight==1?1:0, 
                            }
                    const oGoodInfo = {
                        shop: JSON.stringify(this.shopSelected),
                        mnemonic_code: addGoodInfo.mnemonicCode,
                        goods_no: addGoodInfo.goods_no,
                        barcode:addGoodInfo.barcode,
                        name:addGoodInfo.name,
                        forsale: addGoodInfo.puaway, // 是否上架
                        unit_conversion:this.isweight == 1? '箱,千克': '箱,个',
                        base_unit:this.isweight == 1?'1,1,0':'1,0,1',
                        sku: this.isweight == 1?1:2,
                        basic_information:this.isweight==1?'0,1,0':'0,0,1',
                        specification: spec
                    }
                    const { data: res } = await this.$http.post("mapi/quickAddGoods", oGoodInfo);
                    console.log('快速添加商品',res);
                    if(res.code !== 200) return this.$message.error('添加商品失败')
                    this.$message.success('添加商品成功')
                    this.$router.push('goods')
                   
          }
           })
          
      }
    }
};
</script>

<style scoped lang="less">
.w217 {
  width: 217px;
}
.title{margin-bottom:20px;padding:10px 0 0 10px;font-size:20px;}
.unit {
  margin-right: 0;
  margin-left: 10px;
}
.weigh {
  margin-right: 0;
}
.last-checkbox {
  margin-right: 0;
  margin-left: 30px;
}
.gray {
  color: #ccc;
  line-height: 5px;
  font-size:12px;
}
.el-col {
  border: 1px solid transparent;
}
.el-form-item {
  margin-bottom: 15px;
}
.addGoodForm /deep/ .el-input__inner{height:30px !important;line-height: 30px !important;}
.addGoodForm /deep/ .el-form-item__content{line-height: 30px !important;}
.addGoodForm /deep/ .el-form-item__label{line-height: 30px;}
.addGoodForm /deep/ .el-input__icon{line-height: 30px;}
.addGoodForm /deep/ .el-upload--picture-card{width:110px;height: 110px;line-height: 110px;}
.addGoodForm /deep/ .el-upload-list--picture-card .el-upload-list__item{height: 110px;width: 110px;}
.addGoodForm /deep/ .el-form-item__error{padding-top: 1px;}
.addSaleMode {
  margin-top: 10px;
}
.pintro {
  color: #ccc;
  font-size: 12px;
  line-height: 15px;
}
.percent {
  font-size: 12px;
}
.select_cate{margin-right:10px;}
</style>
