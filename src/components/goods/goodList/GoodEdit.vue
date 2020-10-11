<template>
  <div>
    <el-card>
      <el-form
        :model="addGoodForm"
        :rules="addGoodFormRules"
        ref="addGoodFormRef"
        label-width="130px"
        class="addGoodForm"
      >
       
        <el-form-item label="商品分类" prop="sort">
          <el-select v-model="addGoodForm.sort" placeholder="商品分类">
            <el-option
              v-for="item in sortOptions"
              :key="item.id"
              :label="item.title"
              :value="item.id"
            ></el-option>
          </el-select>
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
        <el-form-item label="商品编码">
          <el-input v-model="addGoodForm.commCode" placeholder="为空系统自动生成" class="w217"></el-input>
        </el-form-item>
           <el-form-item label="商品条码" prop="barcode">
          <el-input v-model="addGoodForm.barcode"  class="w217"></el-input>
        </el-form-item> 
           <el-form-item label="商品货号"  prop="goods_no">
          <el-input v-model="addGoodForm.goods_no" class="w217"></el-input>
        </el-form-item>
        <el-form-item label="成本核算方式">
          <el-select v-model="addGoodForm.costmethod">
            <el-option
              v-for="(item, index) in costmethod"
              :label="item"
              :value="index"
              :key="index"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="基础单位" prop="packageSel1">
          <el-row>
            <el-col :span="24">
              <el-checkbox
                v-model="addGoodForm.packageSel1"
                true-label="1"
                false-label="0"
                @change="packageSel1"
              >包装</el-checkbox>
              <!-- <el-checkbox v-model="addGoodForm.packageSel1" true-label="1" false-label="0" @change="packageSel1">包装</el-checkbox> -->
              <!-- <el-checkbox v-model="addGoodForm.packageSel2" true-label="1" false-label="0" class="weigh" @change="packageSel2">重量</el-checkbox> -->
              <el-checkbox
                v-model="addGoodForm.packageSel2"
                true-label="1"
                false-label="0"
                class="weigh"
                @change="packageSel2"
              >重量</el-checkbox>
              <el-radio
                v-model="addGoodForm.skuUnit"
                v-if="addGoodForm.skuUnit == 1"
                :label="1"
                class="unit"
              >sku单位</el-radio>
              <el-checkbox
                v-model="addGoodForm.packageSel3"
                true-label="1"
                false-label="0"
                class="last-checkbox"
                @change="packageSel3"
              >计件</el-checkbox>
              <el-radio
                v-model="addGoodForm.skuUnit"
                v-if="addGoodForm.skuUnit == 2"
                :label="2"
                class="unit"
              >sku单位</el-radio>
            </el-col>
            <el-col :span="24" class="gray">sku单位选中后，将不可修改。</el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="单位换算" >
          <el-row :gutter="10">
            <el-col :span="3" v-if="addGoodForm.packageSel1  == 1">
              <el-input readonly label="1" type="text" v-model="addGoodForm.unitNum1"></el-input>
            </el-col>
            <el-col :span="2" v-if="addGoodForm.packageSel1  == 1">
              <el-select v-model="addGoodForm.costunit" @change="constUnitChange">
                <el-option
                  v-for="(item, index) in packaging"
                  :label="item"
                  :value="item"
                  :key="index"
                ></el-option>
              </el-select>
            </el-col>
            <el-col :span="3" v-if="addGoodForm.packageSel2  == 1">
              <el-input
                label=""
                type="text"
                v-model="addGoodForm.unitNum2"
                @input="e => addGoodForm.unitNum2 = convertNum(e)"
              ></el-input>
            </el-col>
            <el-col :span="2" v-if="addGoodForm.packageSel2  == 1">
              <el-select v-model="addGoodForm.kg" @change="weightChange">
                <el-option v-for="(item, index) in weight" :label="item" :value="item" :key="index"></el-option>
              </el-select>
            </el-col>
            <el-col :span="3" v-if="addGoodForm.packageSel3 == 1">
              <el-input
                label=""
                type="text"
                v-model="addGoodForm.unitNum3"
                @input="e => addGoodForm.unitNum3 = convertNum(e)"
              ></el-input>
            </el-col>
            <el-col :span="2" v-if="addGoodForm.packageSel3 == 1">
              <el-select v-model="addGoodForm.piece" @change="unitPieceChange">
                <el-option
                  v-for="(item, index) in thepiece"
                  :label="item"
                  :value="item"
                  :key="index"
                ></el-option>
              </el-select>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item  label="成本价格">
          <el-row :gutter="10">
            <el-col :span="3" v-if="addGoodForm.packageSel1 == 1">
              <el-input
                type="text"
                v-model="addGoodForm.packagePrice1"
                @input="packagePriceChange1"
              ></el-input>
            </el-col>
            <el-col :span="2" v-if="addGoodForm.packageSel1 == 1">/
              <span>{{addGoodForm.costunit}}</span>
            </el-col>
            <el-col :span="3" v-if="addGoodForm.packageSel2  == 1">
              <el-input
                type="text"
                v-model="addGoodForm.packagePrice2"
                @input="packagePriceChange2"
              ></el-input>
            </el-col>
            <el-col :span="2" v-if="addGoodForm.packageSel2  == 1">/
              <span>{{addGoodForm.kg}}</span>
            </el-col>
            <el-col :span="3" v-if="addGoodForm.packageSel3 == 1">
              <el-input
                type="text"
                v-model="addGoodForm.packagePrice3"
                @input="packagePriceChange3"
              ></el-input>
            </el-col>
            <el-col :span="2" v-if="addGoodForm.packageSel3 == 1">/
              <span>{{addGoodForm.piece}}</span>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="销售价格" >
          <el-row :gutter="10">
            <el-col :span="3" v-if="addGoodForm.packageSel1  == 1">
              <el-input type="text" v-model="addGoodForm.salePrice1" @input="salesPrice1"></el-input>
            </el-col>
            <el-col :span="2" v-if="addGoodForm.packageSel1  == 1">/
              <span>{{addGoodForm.costunit}}</span>
              <span
                class="percent"
                v-if="sprice1 !== '' && addGoodForm.packagePrice1 !== ''"
              >{{sprice1}}%</span>
            </el-col>
            <el-col :span="3" v-if="addGoodForm.packageSel2  == 1">
              <el-input type="text" v-model="addGoodForm.salePrice2" @input="salesPrice2"></el-input>
            </el-col>
            <el-col :span="2" v-if="addGoodForm.packageSel2  == 1">/
              <span>{{addGoodForm.kg}}</span>
              <span
                class="percent"
                v-if="sprice2 !== '' && addGoodForm.packagePrice2 !== ''"
              >{{sprice2}}%</span>
            </el-col>
            <el-col :span="3" v-if="addGoodForm.packageSel3 == 1">
              <el-input type="text" v-model="addGoodForm.salePrice3" @input="salesPrice3"></el-input>
            </el-col>
            <el-col :span="2" v-if="addGoodForm.packageSel3 == 1">/
              <span>{{addGoodForm.piece}}</span>
              <span
                class="percent"
                v-if="sprice3 !== ''&& addGoodForm.packagePrice3 !== ''"
              >{{sprice3}}%</span>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="会员价格" >
          <el-row :gutter="10">
            <el-col :span="3" v-if="addGoodForm.packageSel1  == 1">
              <el-input type="text" v-model="addGoodForm.memberPrice1" @input="memberPrice1"></el-input>
            </el-col>
            <el-col :span="2" v-if="addGoodForm.packageSel1 == 1">/
              <span>{{addGoodForm.costunit}}</span>
              <span class="percent" v-if="mprice1 != ''">{{mprice1}}%</span>
            </el-col>
            <el-col :span="3" v-if="addGoodForm.packageSel2  == 1">
              <el-input type="text" v-model="addGoodForm.memberPrice2" @input="memberPrice2"></el-input>
            </el-col>
            <el-col :span="2" v-if="addGoodForm.packageSel2  == 1">/
              <span>{{addGoodForm.kg}}</span>
              <span class="percent" v-if="mprice2 != ''">{{mprice2}}%</span>
            </el-col>
            <el-col :span="3" v-if="addGoodForm.packageSel3 == 1">
              <el-input type="text" v-model="addGoodForm.memberPrice3" @input="memberPrice3"></el-input>
            </el-col>
            <el-col :span="2" v-if="addGoodForm.packageSel3 == 1">/
              <span>{{addGoodForm.piece}}</span>
              <span class="percent" v-if="mprice3 != ''">{{mprice3}}%</span>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="提成规则">
          <el-row :gutter="10">
            <el-col :span="3" v-if="addGoodForm.packageSel1 == 1">
              <el-select v-model="addGoodForm.pushMoney1" @change="pushMoneyChange1">
                <el-option
                  v-for="(item, index) in cutway"
                  :label="item"
                  :value="index"
                  :key="index"
                ></el-option>
              </el-select>
            </el-col>
            <el-col :span="2" v-if="addGoodForm.packageSel1 == 1">
              <el-input
                type="text"
                :readonly="addGoodForm.pushMoney1 == 0 ? true : false"
                v-model="addGoodForm.deduct1"
                @input="e => addGoodForm.deduct1 = convertNum(e)"
              >-->
                <template slot="append" v-if="addGoodForm.pushMoney1 == '1'">%</template>
                <template slot="append" v-if="addGoodForm.pushMoney1 == '2'">元</template>
              </el-input>
            </el-col>
            <el-col :span="3" v-if="addGoodForm.packageSel2  == 1">
              <el-select v-model="addGoodForm.pushMoney2" @change="pushMoneyChange2">
                <el-option
                  v-for="(item, index) in cutway"
                  :label="item"
                  :value="index"
                  :key="index"
                ></el-option>
              </el-select>
            </el-col>
            <el-col :span="2" v-if="addGoodForm.packageSel2 == 1">
              <el-input
                type="text"
                :readonly="addGoodForm.pushMoney2 == 0? true : false"
                v-model="addGoodForm.deduct2"
                @input="e => addGoodForm.deduct2 = convertNum(e)"
              >
                <template slot="append" v-if="addGoodForm.pushMoney2 == 1">%</template>
                <template slot="append" v-if="addGoodForm.pushMoney2 == 2">元</template>
              </el-input>
            </el-col>
            <el-col :span="3" v-if="addGoodForm.packageSel3 == 1">
              <el-select v-model="addGoodForm.pushMoney3" @change="pushMoneyChange3">
                <el-option
                  v-for="(item, index) in cutway"
                  :label="item"
                  :value="index"
                  :key="index"
                ></el-option>
              </el-select>
            </el-col>
            <el-col :span="2" v-if="addGoodForm.packageSel3 == 1">
              <el-input
                type="text"
                :readonly="addGoodForm.pushMoney3 == 0? true : false"
                v-model="addGoodForm.deduct3"
                @input="e => addGoodForm.deduct3 = convertNum(e)"
              >
                <template slot="append" v-if="addGoodForm.pushMoney3 == 1">%</template>
                <template slot="append" v-if="addGoodForm.pushMoney3 == 2">元</template>
              </el-input>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="商品类型条码">
          <el-row :gutter="10">
            <el-col :span="3" v-if="addGoodForm.packageSel1 == 1">
              <el-input v-model="addGoodForm.productCode1"></el-input>
            </el-col>
            <el-col :span="2" v-if="addGoodForm.packageSel1 == 1">&emsp;</el-col>
            <el-col :span="3" v-if="addGoodForm.packageSel2 == 1">
              <el-input v-model="addGoodForm.productCode2"></el-input>
            </el-col>
            <el-col :span="2" v-if="addGoodForm.packageSel2 == 1">&emsp;</el-col>
            <el-col :span="3" v-if="addGoodForm.packageSel3 == 1">
              <el-input v-model="addGoodForm.productCode3"></el-input>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="商品PLU码">
          <el-row :gutter="10">
            <el-col :span="3" v-if="addGoodForm.packageSel1 == 1">
              <el-input v-model="addGoodForm.productPluCode1"></el-input>
            </el-col>
            <el-col :span="2" v-if="addGoodForm.packageSel1 == 1">&emsp;</el-col>
            <el-col :span="3" v-if="addGoodForm.packageSel2 == 1">
              <el-input v-model="addGoodForm.productPluCode2"></el-input>
            </el-col>
            <el-col :span="2" v-if="addGoodForm.packageSel2 == 1">&emsp;</el-col>
            <el-col :span="3" v-if="addGoodForm.packageSel3 == 1">
              <el-input v-model="addGoodForm.productPluCode3"></el-input>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="销售方式" required>
          <el-row>
            <el-col :span="24">
              <el-checkbox
                v-model="addGoodForm.saleMethod1"
                true-label="1"
                false-label="0"
                v-if="addGoodForm.packageSel1  == 1"
              >包装单位</el-checkbox>
              <el-radio
                :label="0"
                v-model="addGoodForm.salePackage"
                v-if="addGoodForm.packageSel1  == 1"
              >默认</el-radio>
              <el-checkbox
                v-model="addGoodForm.saleMethod2"
                class="weigh"
                true-label="1"
                false-label="0"
                v-if="addGoodForm.packageSel2 == 1"
              >重量单位</el-checkbox>
              <span v-if="addGoodForm.packageSel2 == 1">(
                <el-radio :label="1" v-model="addGoodForm.salePackage" class="unit">默认</el-radio>)
              </span>
              <el-checkbox
                v-model="addGoodForm.saleMethod3"
                class="last-checkbox"
                true-label="1"
                false-label="0"
                v-if="addGoodForm.packageSel3 == 1"
              >计件单位</el-checkbox>
              <span v-if="addGoodForm.packageSel3 == 1">(
                <el-radio :label="2" v-model="addGoodForm.salePackage" class="unit">默认</el-radio>)
              </span>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="允许改价">
          <el-row>
            <el-col :span="24">
              <el-checkbox
                v-model="addGoodForm.packageChangePrice"
                :true-label="1"
                :false-label="0"
                v-if="addGoodForm.packageSel1  == 1"
              >包装单位</el-checkbox>
              <el-checkbox
                v-model="addGoodForm.weightChangePrice"
                :true-label="1"
                :false-label="0"
                v-if="addGoodForm.packageSel2 == 1"
              >重量单位</el-checkbox>
              <el-checkbox
                v-model="addGoodForm.pieceChangePrice"
                :true-label="1"
                :false-label="0"
                class="last-checkbox"
                v-if="addGoodForm.packageSel3 == 1"
              >计件单位</el-checkbox>
            </el-col>
            <el-col :span="24" class="gray">勾选后商品允许有改价，前台售卖商品收银员可以点改价、折扣按钮临时修改商品单价、折扣。</el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="允许折扣">
          <el-row>
            <el-col :span="24">
              <el-checkbox
                v-model="addGoodForm.allowPackageDiscount"
                :true-label="1"
                :false-label="0"
                v-if="addGoodForm.packageSel1  == 1"
              >包装单位</el-checkbox>
              <el-checkbox
                v-model="addGoodForm.allowWeightDiscount"
                :true-label="1"
                :false-label="0"
                v-if="addGoodForm.packageSel2 == 1"
              >重量单位</el-checkbox>
              <el-checkbox
                v-model="addGoodForm.allowPieceDiscount"
                :true-label="1"
                :false-label="0"
                class="last-checkbox"
                v-if="addGoodForm.packageSel3 == 1"
              >计件单位</el-checkbox>
            </el-col>
            <el-col
              :span="24"
              class="gray"
            >勾选后，若会员卡设置了等级折扣，该商品在收银端售卖时才能享受会员等级折扣，不勾选该参数，则会员卡设置了等级折扣也不能享受折扣。</el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="允许积分">
          <el-row>
            <el-col :span="24">
              <el-checkbox
                v-model="addGoodForm.allowPackageIntegral"
                :true-label="1"
                :false-label="0"
                v-if="addGoodForm.packageSel1 == 1"
              >包装单位</el-checkbox>
              <el-checkbox
                v-model="addGoodForm.allowWeightIntegral"
                :true-label="1"
                :false-label="0"
                v-if="addGoodForm.packageSel2 == 1"
              >重量单位</el-checkbox>
              <el-checkbox
                v-model="addGoodForm.allowPieceIntegral"
                :true-label="1"
                :false-label="0"
                class="last-checkbox"
                v-if="addGoodForm.packageSel3 == 1"
              >计件单位</el-checkbox>
            </el-col>
            <el-col :span="24" class="gray">勾选后，购买商品参与积分。</el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="其它销售方式">
          <el-table
            :data="otherSalesMode"
            border=""
            :header-cell-style="{'background':'#f4f4f4', 'text-align': 'center'}"
            :cell-style="{'text-align': 'center',}"
            :header-cell-class-name="must"
          >
            <el-table-column label="名称">
              <template slot-scope="scope">
                <!-- {{scope.row}} -->
                <el-input type="text" v-model="scope.row.name"></el-input>
              </template>
            </el-table-column>
            <el-table-column label="计件数" width="200">
              <template slot-scope="scope">
                <!-- {{scope.row}} -->
                <el-row>
                  <el-col :span="10">
                    <el-input
                      type="text"
                      v-model="scope.row.amount"
                      @input="e => scope.row.amount = convertNum(e)"
                    ></el-input>
                  </el-col>
                  <el-col :span="14">
                    <el-select v-model="scope.row.unit">
                      <el-option
                        v-for="(item,index) in otherUnit"
                        :label="item"
                        :value="item"
                        :key="index"
                      ></el-option>
                    </el-select>
                  </el-col>
                </el-row>
              </template>
            </el-table-column>
            <el-table-column label="成本价（元）">
              <template slot-scope="scope">
                <el-input
                  type="text"
                  v-model="scope.row.supply_price"
                  @input="e => scope.row.supply_price = convertNum(e)"
                ></el-input>
              </template>
            </el-table-column>
            <el-table-column label="销售价（元）">
              <template slot-scope="scope">
                <el-input
                  type="text"
                  v-model="scope.row.price"
                  @input="e => scope.row.price = convertNum(e)"
                ></el-input>
              </template>
            </el-table-column>
            <el-table-column label="会员价（元）">
              <template slot-scope="scope">
                <el-input
                  type="text"
                  v-model="scope.row.member_price"
                  @input="e => scope.row.member_price = convertNum(e)"
                ></el-input>
              </template>
            </el-table-column>
            <el-table-column label="提成方式">
              <template slot-scope="scope">
                <el-select v-model="scope.row.push_money_type">
                  <el-option
                    v-for="(item, index) in cutway"
                    :label="item"
                    :value="index"
                    :key="index"
                  ></el-option>
                </el-select>
              </template>
            </el-table-column>
            <el-table-column label="提成数值">
              <template slot-scope="scope">
                <el-input
                  type="number"
                  :readonly="scope.row.push_money_type == 0 ? true : false"
                  v-model="scope.row.push_money"
                >
                  <template slot="append" v-if="scope.row.push_money_type == 1">%</template>
                  <template slot="append" v-if="scope.row.push_money_type == 2">元</template>
                </el-input>
              </template>
            </el-table-column>
            <el-table-column label="商品条码">
              <template slot-scope="scope">
                <el-input type="text" v-model="scope.row.shop_code"></el-input>
              </template>
            </el-table-column>
            <el-table-column label="商品PLU码">
              <template slot-scope="scope">
                <el-input type="text" v-model="scope.row.plu"></el-input>
              </template>
            </el-table-column>
            <el-table-column label="是否称重" width="80">
              <template slot-scope="scope">
                <el-checkbox v-model="scope.row.is_weigh" :true-label="1" :false-label="0"></el-checkbox>
              </template>
            </el-table-column>
            <el-table-column label="允许改价" width="80">
              <template slot-scope="scope">
                <el-checkbox v-model="scope.row.change_price" :true-label="1" :false-label="0"></el-checkbox>
              </template>
            </el-table-column>
            <el-table-column label="允许折扣" width="80">
              <template slot-scope="scope">
                <el-checkbox v-model="scope.row.change_discount" :true-label="1" :false-label="0"></el-checkbox>
              </template>
            </el-table-column>
            <el-table-column label="允许积分" width="80">
              <template slot-scope="scope">
                <el-checkbox v-model="scope.row.change_integral" :true-label="1" :false-label="0"></el-checkbox>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="80">
              <template slot-scope="scope">
                <el-button size="mini" @click="deleteSaleMethods(scope.$index)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-row class="addSaleMode">
            <!-- <el-button type="primary" icon="el-icon-circle-plus-outline" @click="addSalesMode" >添加</el-button> -->
            <el-button type="primary" icon="el-icon-circle-plus-outline" @click="addSalesMode" size="mini">添加</el-button>
          </el-row>
        </el-form-item>
        <el-form-item label="商品图片">
          <el-upload
            :class="uploadDisabled"
            :action="$uplaadUrl"
            :show-file-list="showImgList"
            :file-list="fileList"
            list-type="picture-card"
            :limit="limitCount"
            :on-remove="handleRemove"
            :on-success="handleAvatarSuccess"
            :on-error="handleAvatarError"
            :disabled="showdisabled"
            :on-preview="onPreviewImg"
            :headers="handleHeader"
            :before-upload="beforeAvatarUpload"
          >
            <i class="el-icon-plus"></i>
          </el-upload>
          <el-dialog :visible.sync="imgDialogVisible">
            <img width="100%" :src="dialogImageUrl" alt="">
          </el-dialog>
        </el-form-item>
        <el-form-item label="有效（保质）期：">
          <el-row>
            <el-col :span="5">
              <el-input v-model="addGoodForm.expirationdate" placeholder=""></el-input>
            </el-col>
            <el-col :span="3">/天</el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="供应商">
          <el-radio-group v-model="addGoodForm.supplier">
            <el-radio v-for="item in goodsupplier" :label="item.id" :key="item.id">{{item.name}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="是否上架" required>
          <el-switch v-model="addGoodForm.puaway" :active-value="1" :inactive-value="0"></el-switch>
        </el-form-item>
        <el-form-item label="调拨加价率类型">
          <el-select v-model="addGoodForm.markuptype">
            <el-option label="使用系统默认" value="1"></el-option>
            <el-option label="使用商品配置" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="调拨加价率" required>
          <el-input v-model="addGoodForm.markup" placeholder="" class="w217"></el-input>
          <p class="pintro">百分比，取值范围0~100之间</p>
        </el-form-item>
        <el-form-item label="排序">
          <el-input v-model="addGoodForm.markuppercent" placeholder="" class="w217"></el-input>
          <p class="pintro">排序由大到小，会影响收银端排序</p>
        </el-form-item>
        <el-form-item>
          <el-button @click="resetForm('addGoodFormRef')">重置</el-button>
          <el-button type="primary" @click="submitForm('addGoodFormRef')" v-no-click>提交</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import { makePy } from "@/assets/js/code.js";
var token = window.sessionStorage.getItem("token");
export default {
  data() {
    return {
      addGoodFormRules: {
        sort: [{ required: true, message: "请选择商品分类", trigger: "blur" }],
        name: [{ required: true, message: "请输入商品名称", trigger: "blur" }],
        packagePrice1: [
          { required: true, message: "请输入成本价格", trigger: "blur" }
        ],
        salePrice1: [
          { required: true, message: "请输入销售价格", trigger: "blur" }
        ],
        memberPrice1: [
          { required: true, message: "请输入会员价格", trigger: "blur" }
        ],
        packageSel1: [
          { required: true, message: "请输入基础单位", trigger: "blur" }
        ]
      },
      addGoodForm: {

      },
      // 其他销售方式
      otherSalesMode: [],
      // 其他销售方式的单位
      otherUnit: [],
      // 图片上传
      showdisabled: false,
      uploadDisabled: "",
      showImgList: true,
      limitCount: 1,
      handleHeader: { authorization: token },
      fileList: [],
      dialogImageUrl: "",
      imgDialogVisible: false,
      // 商品分类
      sortOptions: [],
      // 商品供货商
      goodsupplier: [],
      // 成本核算方式
      costmethod: "",
      // 提成方式
      cutway: [],
      // 包装
      packaging: [],
      weight: [],
      thepiece: [],
      skuUnit: 1,
      sprice1: "",
      sprice2: "",
      sprice3: "",
      mprice1: "",
      mprice2: "",
      mprice3: "",
      shop_id: "",
      //页码
      page:'',
    };
  },
  created() {
    // console.log('store中sort值：', this.$store.state.sort)
    // this.sortOptions = this.$store.state.sort
    this.page = this.$route.query.page;
    console.log(this.page)
    this.getGoodInfo();
  },
  methods: {
    nameChange() {
      this.addGoodForm.mnemonicCode = makePy(this.addGoodForm.name.trim());
    },
    must(obj) {
      // console.log(obj.columnIndex)
      // eslint-disable-next-line eqeqeq
      if (
        obj.columnIndex == 2 ||
        obj.columnIndex == 3 ||
        obj.columnIndex == 4
      ) {
        return "must";
      }
    },
    convertNum(str) {
      var len1 = str.substr(0, 1);
      var len2 = str.substr(1, 1);
      // 如果第一位是0，第二位不是点，就用数字把点替换掉
      // eslint-disable-next-line eqeqeq
      if (str.length > 1 && len1 == 0 && len2 != ".") {
        str = str.substr(1, 1);
      }
      // 第一位不能是.
      // eslint-disable-next-line eqeqeq
      if (len1 == ".") {
        str = "";
      }
      // eslint-disable-next-line eqeqeq
      if (len1 == "-") {
        str = "";
      }
      // 限制只能输入一个小数点
      // eslint-disable-next-line eqeqeq
      if (str.indexOf(".") != -1) {
        var str_ = str.substr(str.indexOf(".") + 1);
        // eslint-disable-next-line eqeqeq
        if (str_.indexOf(".") != -1) {
          str = str.substr(0, str.indexOf(".") + str_.indexOf(".") + 1);
        }
      }
      // 正则替换
      // eslint-disable-next-line no-useless-escape
      // str = str.replace(/\-/g, '!')
      // eslint-disable-next-line no-useless-escape
      str = str.replace(/[^\d^\.]+/g, ""); // 保留数字和小数点
      str = str.replace(/\.\d\d\d$/, ""); // 小数点后只能输两位
      return str;
    },
    async getGoodInfo() {
      // 开启loading
      // const load = this.$loading({
      //   lock: true,
      //   text: 'Loading',
      //   customClass: 'create-isLoading',
      //   spinner: 'el-icon-loading',
      //   background: 'rgba(0, 0, 0, 0.7)'
      // })

      const id = localStorage.getItem("goodId");
      const { data: res } = await this.$http.get("mapi/updateGoods", {
        params: { id: id }
      });
      console.log("getGoodInfo返回值：", res);
      this.sortOptions = res.arr.sort;
      this.goodsupplier = res.arr.supplier;
      this.costmethod = res.arr.cost_accounting_method;
      this.cutway = res.arr.push_money_type;
      this.packaging = res.arr.unit.packaging;
      this.weight = res.arr.unit.weight;
      this.thepiece = res.arr.unit.by_the_piece;
      const x = res.goods;
      const baseU = res.goods.basic_information.split(",");
      console.log('baseU',baseU);
      const spec = res.goods.specification;
      console.log(spec);
      console.log(res.goods.thumb);
      if (res.goods.shop_id) {
        this.shop_id = res.goods.shop_id;
      }
      if (res.goods.thumb) {
        this.fileList.push({
          name: "",
          url: res.goods.thumb
        });
        this.uploadDisabled = "disabled";
        this.showdisabled = false;
      }
      // 基本销售方式数组
      const upArr = [];
      spec.forEach(item => {
        // eslint-disable-next-line eqeqeq
        if (item.type == 1) {
          upArr.push(item);
        } else {
          this.otherSalesMode.push(item);
        }
      });
      console.log(this.otherSalesMode);
// barcode
// goods_no         
      this.addGoodForm = {
        barcode:x.barcode,
        goods_no:x.goods_no,
        sort: x.cate_id,
        // 商品名称
        name: x.name,
        // 商品助记码
        mnemonicCode: x.mnemonic_code,
        // 商品编码
        commCode: x.commodity_code,
        // 成本核算方式
        costmethod: Number(x.cost_accounting_method),

        // 销售价1
        salePrice1: 1,
        // 销售价2
        salePrice2: 1,
        // 销售价3
        salePrice3: 1,
        // 基础单位 包装
        packageSel1: "0",
        // 基础单位 重量
        packageSel2: "0",
        // 基础单位 计件
        packageSel3: "0",
        // 销售方式 包装单位
        saleMethod1: "1",
        // 销售方式 重量单位
        saleMethod2: "1",
        // 销售方式 计件单位
        saleMethod3: "1",
        // 基础单位 sku单位
        salePackage: 1,
        // 单位换算
        unitNum1: 1,
        unitNum2: 1,
        unitNum3: 1,
        // 单位换算 第一单位
        costunit: "箱",
        // 单位换算 第三单位
        piece: "个",
        // 单位换算 第二单位
        kg: "千克",
        // 提成规则
        pushMoney1: 0,
        // 提成金额
        deduct1: "",
        // 提成规则
        pushMoney2: 0,
        // 提成金额
        deduct2: "",
        // 提成规则
        pushMoney3: 0,
        // 提成金额
        deduct3: "",
        // 商品条码
        productCode1: "",
        productCode2: "",
        productCode3: "",
        // 商品Plu码
        productPluCode1: "",
        productPluCode2: "",
        productPluCode3: "",
        // 商品图片
        thumb: x.thumb,
        // 供货商
        supplier: "",
        // 是否上架
        puaway: x.forsale,
        // 调拨加价率
        markup: 0,
        // 调拨加价率类型
        markuptype: "1",
        // 排序
        markuppercent: x.sort,
        // 有效保质期
        expirationdate: 60,
        // sku单位
        skuUnit: 1,
        // 允许包装单位改价
        packageChangePrice: 1,
        // 允许重量单位改价
        weightChangePrice: 1,
        // 允许计件单位改价
        pieceChangePrice: 1,
        // 允许包装单位折扣
        allowPackageDiscount: 1,
        // 允许重量单位折扣
        allowWeightDiscount: 1,
        // 允许计件单位折扣
        allowPieceDiscount: 1,
        // 允许包装单位积分
        allowPackageIntegral: 1,
        // 允许重量单位积分
        allowWeightIntegral: 1,
        // 允许计件单位积分
        allowPieceIntegral: 1,
        // 商品成本价
        packagePrice1: 1,
        packagePrice2: 1,
        packagePrice3: 1,
        // 会员价
        memberPrice1: 1,
        memberPrice2: 1,
        memberPrice3: 1
      };
      console.log(this.addGoodForm);
      this.addGoodForm.packageSel1 = baseU[0];
      this.addGoodForm.packageSel2 = baseU[1];
      this.addGoodForm.packageSel3 = baseU[2];
      this.addGoodForm.skuUnit = x.sku;
      // eslint-disable-next-line eqeqeq
      if (baseU[0] == 1) {
        // console.log(baseU[0])

        this.addGoodForm.costunit = upArr[0].unit;
        this.addGoodForm.unitNum1 = upArr[0].amount;
        this.addGoodForm.packagePrice1 = upArr[0].supply_price;
        this.addGoodForm.salePrice1 = upArr[0].price;
        this.addGoodForm.memberPrice1 = upArr[0].member_price;
        this.addGoodForm.pushMoney1 = Number(upArr[0].push_money_type);
        this.addGoodForm.deduct1 = Number(upArr[0].push_money);
        this.addGoodForm.productCode1 = upArr[0].shop_code;
        this.addGoodForm.productPluCode1 = upArr[0].plu;
        this.addGoodForm.packageChangePrice = upArr[0].change_price;
        this.addGoodForm.allowPackageDiscount = upArr[0].change_discount;
        this.addGoodForm.allowPackageIntegral = upArr[0].change_integral;
        this.otherUnit.push(upArr[0].unit);
      } else {
        this.addGoodForm.costunit = "箱";
        this.addGoodForm.unitNum1 = 1;
        this.addGoodForm.packagePrice1 = "";
        this.addGoodForm.salePrice1 = "";
        this.addGoodForm.memberPrice1 = "";
        this.addGoodForm.pushMoney1 = 0;
        this.addGoodForm.deduct1 = "";
        this.addGoodForm.productCode1 = "";
        this.addGoodForm.productPluCode1 = "";
        this.addGoodForm.packageChangePrice = 0;
        this.addGoodForm.allowPackageDiscount = 0;
        this.addGoodForm.allowPackageIntegral = 0;
      }
      // eslint-disable-next-line eqeqeq
      if (baseU[0] == 1 && baseU[1] == 1) {
        console.log(baseU[1]);

        this.addGoodForm.kg = upArr[1].unit;
        this.addGoodForm.unitNum2 = upArr[1].amount;
        this.addGoodForm.packagePrice2 = upArr[1].supply_price;
        this.addGoodForm.salePrice2 = upArr[1].price;
        this.addGoodForm.memberPrice2 = upArr[1].member_price;
        this.addGoodForm.pushMoney2 = Number(upArr[1].push_money_type);
        this.addGoodForm.deduct2 = Number(upArr[1].push_money);
        this.addGoodForm.productCode2 = upArr[1].shop_code;
        this.addGoodForm.productPluCode2 = upArr[1].plu;
        this.addGoodForm.weightChangePrice = upArr[1].change_price;
        this.addGoodForm.allowWeightDiscount = upArr[1].change_discount;
        this.addGoodForm.allowPieceIntegral = upArr[1].change_integral;
        this.otherUnit.push(upArr[1].unit);
        if (upArr[1].default == 1) {
          this.addGoodForm.salePackage = 1;
        }
      } else if (baseU[0] == 0 && baseU[1] == 1) {
        this.addGoodForm.kg = upArr[0].unit;
        this.addGoodForm.unitNum2 = upArr[0].amount;
        this.addGoodForm.packagePrice2 = upArr[0].supply_price;
        this.addGoodForm.salePrice2 = upArr[0].price;
        this.addGoodForm.memberPrice2 = upArr[0].member_price;
        this.addGoodForm.pushMoney2 = Number(upArr[0].push_money_type);
        this.addGoodForm.deduct2 = Number(upArr[0].push_money);
        this.addGoodForm.productCode2 = upArr[0].shop_code;
        this.addGoodForm.productPluCode2 = upArr[0].plu;
        this.addGoodForm.weightChangePrice = upArr[0].change_price;
        this.addGoodForm.allowWeightDiscount = upArr[0].change_discount;
        this.addGoodForm.allowWeightIntegral = upArr[0].change_integral;
        this.otherUnit.push(upArr[0].unit);
        if (upArr[0].default == 1) {
          this.addGoodForm.salePackage = 1;
        }
      } else {
        this.addGoodForm.kg = "千克";
        this.addGoodForm.unitNum2 = "";
        this.addGoodForm.packagePrice2 = "";
        this.addGoodForm.salePrice2 = "";
        this.addGoodForm.memberPrice2 = "";
        this.addGoodForm.pushMoney2 = 0;
        this.addGoodForm.deduct2 = "";
        this.addGoodForm.productCode2 = "";
        this.addGoodForm.productPluCode2 = "";
        this.addGoodForm.weightChangePrice = 0;
        this.addGoodForm.allowWeightDiscount = 0;
        this.addGoodForm.allowWeightIntegral = 0;
      }
      // eslint-disable-next-line eqeqeq
      if (baseU[2] == 1) {
        console.log(baseU[2]);

        this.addGoodForm.piece = upArr[upArr.length - 1].unit;
        this.addGoodForm.unitNum3 = upArr[upArr.length - 1].amount;
        this.addGoodForm.packagePrice3 = upArr[upArr.length - 1].supply_price;
        this.addGoodForm.salePrice3 = upArr[upArr.length - 1].price;
        this.addGoodForm.memberPrice3 = upArr[upArr.length - 1].member_price;
        this.addGoodForm.pushMoney3 = Number(
          upArr[upArr.length - 1].push_money_type
        );
        this.addGoodForm.deduct3 = Number(upArr[upArr.length - 1].push_money);
        this.addGoodForm.productCode3 = upArr[upArr.length - 1].shop_code;
        this.addGoodForm.productPluCode3 = upArr[upArr.length - 1].plu;
        this.addGoodForm.pieceChangePrice =
          upArr[upArr.length - 1].change_price;
        this.addGoodForm.allowPieceDiscount =
          upArr[upArr.length - 1].change_discount;
        this.addGoodForm.allowPieceIntegral =
          upArr[upArr.length - 1].change_integral;
        this.otherUnit.push(upArr[upArr.length - 1].unit);
        if (upArr[upArr.length - 1].default == 1) {
          this.addGoodForm.salePackage = 2;
        }
      } else {
        this.addGoodForm.piece = "个";
        this.addGoodForm.unitNum3 = "";
        this.addGoodForm.packagePrice3 = "";
        this.addGoodForm.salePrice3 = "";
        this.addGoodForm.memberPrice3 = "";
        this.addGoodForm.pushMoney3 = 0;
        this.addGoodForm.deduct3 = "";
        this.addGoodForm.productCode3 = "";
        this.addGoodForm.productPluCode3 = "";
        this.addGoodForm.pieceChangePrice = 0;
        this.addGoodForm.allowPieceDiscount = 0;
        this.addGoodForm.allowPieceIntegral = 0;
      }
      // 关闭loading
      // load.close()

      // this.otherUnit[0] = this.addGoodForm.costunit
      // this.otherUnit[1] = this.addGoodForm.kg
      // this.otherUnit[2] = this.addGoodForm.piece
    },
    // 重量单位选择
    skuUnitSelect(val) {
      console.log(this.skuUnit);
      console.log(val);
    },
    // 包装切换
    constUnitChange(val) {
      // eslint-disable-next-line eqeqeq
      if (this.addGoodForm.packageSel1 != 1) {
        const i = this.otherUnit.indexOf(this.addGoodForm.costunit);
        this.otherUnit.splice(i, 1, this.addGoodForm.costunit);
      } else {
        this.otherUnit.push(this.addGoodForm.costunit);
      }
    },
    // 重量切换
    weightChange(val) {
      // eslint-disable-next-line eqeqeq
      if (this.addGoodForm.packageSel2 != 1) {
        const i = this.otherUnit.indexOf(this.addGoodForm.kg);
        this.otherUnit.splice(i, 1, this.addGoodForm.kg);
      } else {
        this.otherUnit.push(this.addGoodForm.kg);
      }
    },
    // 单位切换
    unitPieceChange(val) {
      // eslint-disable-next-line eqeqeq
      if (this.addGoodForm.packageSel3 != 1) {
        const i = this.otherUnit.indexOf(this.addGoodForm.piece);
        this.otherUnit.splice(i, 1, this.addGoodForm.piece);
      } else {
        this.otherUnit.push(this.addGoodForm.piece);
      }
    },
    packageSel1() {
      // eslint-disable-next-line eqeqeq
      if (this.addGoodForm.packageSel1 != 1) {
        const i = this.otherUnit.indexOf(this.addGoodForm.costunit);
        this.otherUnit.splice(i, 1);
      } else {
        this.otherUnit.push(this.addGoodForm.costunit);
      }
    },
    packageSel2() {
      // eslint-disable-next-line eqeqeq
      if (this.addGoodForm.packageSel2 != 1) {
        const i = this.otherUnit.indexOf(this.addGoodForm.kg);
        this.otherUnit.splice(i, 1);
      } else {
        this.otherUnit.push(this.addGoodForm.kg);
      }
    },
    packageSel3() {
      console.log(this.otherUnit.indexOf(this.addGoodForm.piece));
      // eslint-disable-next-line eqeqeq
      if (this.addGoodForm.packageSel3 != 1) {
        const i = this.otherUnit.indexOf(this.addGoodForm.piece);
        this.otherUnit.splice(i, 1);
      } else {
        this.otherUnit.push(this.addGoodForm.piece);
      }
    },
    // 提成方式改变1
    pushMoneyChange1() {
      // eslint-disable-next-line eqeqeq
      if (this.addGoodForm.pushMoney1 == "0") {
        this.addGoodForm.deduct1 = "";
      }
    },
    // 提成方式改变1
    pushMoneyChange2() {
      // eslint-disable-next-line eqeqeq
      if (this.addGoodForm.pushMoney2 == "0") {
        this.addGoodForm.deduct2 = "";
      }
    },
    // 提成方式改变1
    pushMoneyChange3() {
      // eslint-disable-next-line eqeqeq
      if (this.addGoodForm.pushMoney3 == "0") {
        this.addGoodForm.deduct3 = "";
      }
    },
    // 添加新的销售方式
    addSalesMode() {
      this.otherSalesMode.push({
        name: "",
        amount: "",
        unit: this.otherUnit[0],
        // eslint-disable-next-line camelcase
        supply_price: "",
        price: "",
        // eslint-disable-next-line camelcase
        member_price: "",
        // eslint-disable-next-line camelcase
        push_money_type: 0,
        // eslint-disable-next-line camelcase
        push_money: "",
        // eslint-disable-next-line camelcase
        shop_code: "",
        plu: "",
        is_weigh: 0,
        // eslint-disable-next-line camelcase
        change_price: "1",
        // eslint-disable-next-line camelcase
        change_discount: "1",
        // eslint-disable-next-line camelcase
        change_integral: "1",
        // eslint-disable-next-line camelcase
        default_sale: "",
        default: 0,
        type: 2
      });
    },
    // 成本价格监听1
    packagePriceChange1() {
      this.addGoodForm.packagePrice1 = this.convertNum(
        this.addGoodForm.packagePrice1
      );
      console.log(typeof this.addGoodForm.packagePrice1);
      this.addGoodForm.packagePrice2 = (
        (parseFloat(this.addGoodForm.packagePrice1) *
          parseFloat(this.addGoodForm.unitNum1)) /
        parseFloat(this.addGoodForm.unitNum2)
      ).toFixed(2);
      this.addGoodForm.packagePrice3 = (
        (parseFloat(this.addGoodForm.packagePrice1) *
          parseFloat(this.addGoodForm.unitNum1)) /
        parseFloat(this.addGoodForm.unitNum3)
      ).toFixed(2);
      // this.addGoodForm.packagePrice3 = (((parseFloat(this.addGoodForm.packagePrice1) * (parseFloat(this.addGoodForm.unitNum1)) / parseFloat(this.addGoodForm.unitNum3)).toFixed(2)
    },
    // 成本价格监听2
    packagePriceChange2() {
      this.addGoodForm.packagePrice2 = this.convertNum(
        this.addGoodForm.packagePrice2
      );
      this.addGoodForm.packagePrice1 = (
        (parseFloat(this.addGoodForm.packagePrice2) *
          parseFloat(this.addGoodForm.unitNum2)) /
        parseFloat(this.addGoodForm.unitNum1)
      ).toFixed(2);
      this.addGoodForm.packagePrice3 = (
        (parseFloat(this.addGoodForm.packagePrice2) *
          parseFloat(this.addGoodForm.unitNum2)) /
        parseFloat(this.addGoodForm.unitNum3)
      ).toFixed(2);
    },
    // 成本价格监听3
    packagePriceChange3() {
      this.addGoodForm.packagePrice3 = this.convertNum(
        this.addGoodForm.packagePrice3
      );
      this.addGoodForm.packagePrice1 = (
        (parseFloat(this.addGoodForm.packagePrice3) *
          parseFloat(this.addGoodForm.unitNum3)) /
        parseFloat(this.addGoodForm.unitNum1)
      ).toFixed(2);
      this.addGoodForm.packagePrice2 = (
        (parseFloat(this.addGoodForm.packagePrice3) *
          parseFloat(this.addGoodForm.unitNum3)) /
        parseFloat(this.addGoodForm.unitNum2)
      ).toFixed(2);
    },
    // 监听销售价格1
    salesPrice1() {
      this.addGoodForm.salePrice1 = this.convertNum(
        this.addGoodForm.salePrice1
      );
      this.sprice1 = (
        ((parseFloat(this.addGoodForm.salePrice1) -
          parseFloat(this.addGoodForm.packagePrice1)) /
          parseFloat(this.addGoodForm.salePrice1)) *
        100
      ).toFixed(2);
    },
    // 监听销售价格2
    salesPrice2() {
      this.addGoodForm.salePrice2 = this.convertNum(
        this.addGoodForm.salePrice2
      );
      this.sprice2 = (
        ((parseFloat(this.addGoodForm.salePrice2) -
          parseFloat(this.addGoodForm.packagePrice2)) /
          parseFloat(this.addGoodForm.salePrice2)) *
        100
      ).toFixed(2);
    },
    // 监听销售价格3
    salesPrice3() {
      this.addGoodForm.salePrice3 = this.convertNum(
        this.addGoodForm.salePrice3
      );
      this.sprice3 = (
        ((parseFloat(this.addGoodForm.salePrice3) -
          parseFloat(this.addGoodForm.packagePrice3)) /
          parseFloat(this.addGoodForm.salePrice3)) *
        100
      ).toFixed(2);
    },
    // 会员价格监听1
    memberPrice1() {
      this.addGoodForm.memberPrice1 = this.convertNum(
        this.addGoodForm.memberPrice1
      );
      this.mprice1 = (
        ((parseFloat(this.addGoodForm.memberPrice1) -
          parseFloat(this.addGoodForm.packagePrice1)) /
          parseFloat(this.addGoodForm.memberPrice1)) *
        100
      ).toFixed(2);
    },
    // 2
    memberPrice2() {
      this.addGoodForm.memberPrice2 = this.convertNum(
        this.addGoodForm.memberPrice2
      );
      this.mprice2 = (
        ((parseFloat(this.addGoodForm.memberPrice2) -
          parseFloat(this.addGoodForm.packagePrice2)) /
          parseFloat(this.addGoodForm.memberPrice2)) *
        100
      ).toFixed(2);
    },
    // 会员价格监听3
    memberPrice3() {
      this.addGoodForm.memberPrice3 = this.convertNum(
        this.addGoodForm.memberPrice3
      );
      this.mprice3 = (
        ((parseFloat(this.addGoodForm.memberPrice3) -
          parseFloat(this.addGoodForm.packagePrice3)) /
          parseFloat(this.addGoodForm.memberPrice3)) *
        100
      ).toFixed(2);
    },
    // 删除其他销售方式
    deleteSaleMethods(index) {
      this.otherSalesMode.splice(index, 1);
    },
    // 图片上传成功
    handleAvatarSuccess(file, fileList) {
      // this.attachmentId.push(res.name)
      // 上传图片后将 uploadDisabled 变量设置为 disabled
      this.addGoodForm.thumb = file.url;
      this.uploadDisabled = "disabled";
      this.showdisabled = false;
      console.log("上传成功：", this.addGoodForm.thumb);
    },
    handleAvatarError(file, filelist) {
      // if (filelist.length === 0) {
      //   // 将变量置空
      //   this.uploadDisabled = ''
      // }
    },
    //图片移除
    handleRemove(file, filelist) {
      // console.log(file)
      console.log(filelist)
      this.addGoodForm.thumb = "";
      console.log(this.addGoodForm.thumb)
      // // console.log(this.attachmentId)
      if (filelist.length === 0) {
        // 将变量置空
        this.uploadDisabled = "";
      }
    },
    // 图片上传之前判断图片大小 不超过2M
    beforeAvatarUpload(file, filelist) {
      // console.log(file)
      // console.log(filelist)
      // this.showNoticeUploading = true
      // const isJPG = file.type === 'image/jpeg'
      const isLt2M = file.size / 1024 / 1024 < 10;
      // if (!isJPG) {
      //   this.$message.error('上传头像图片只能是 JPG 格式!')
      //   return
      // }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 10MB!");
        return false;
      }
      // this.uploadDisabled = 'disabled'
      this.showdisabled = true;
    },
    onPreviewImg(file) {
      this.dialogImageUrl = file.url;
      this.imgDialogVisible = true;
    },
    // 重置表单
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    // 提交表单
    async submitForm(formName) {
      // console.log(this.addGoodForm.thumb)
      this.$refs[formName].validate(async valid => {
        if (valid) {
          if(this.addGoodForm.packageSel1==1&&this.addGoodForm.packagePrice1==""){
              return this.$message.error("请输入成本价");
          }
           if(this.addGoodForm.packageSel1==1&&this.addGoodForm.salePrice1==""){
              return this.$message.error("请输入销售价格");
          }
             if(this.addGoodForm.packageSel1==1&&this.addGoodForm.memberPrice1==""){
              return this.$message.error("请输入会员价格");
          }
          
          const id = localStorage.getItem("goodId");
          const addGoodForm = this.addGoodForm;
          console.log("addGoodForm：", addGoodForm);
          if (
            addGoodForm.packageSel2 !== "1" &&
            addGoodForm.packageSel3 !== "1"
          )
            return this.$message.error("sku单位至少选一种");
          const arr = [
            addGoodForm.packageSel1,
            addGoodForm.packageSel2,
            addGoodForm.packageSel3
          ];
          const spec = [
            {
              name: addGoodForm.costunit, // 包装单位
              amount: addGoodForm.unitNum1, // 数量
              unit: addGoodForm.costunit, // 单位
              // eslint-disable-next-line camelcase
              supply_price: addGoodForm.packagePrice1, // 成本价
              price: addGoodForm.salePrice1, // 销售价
              // eslint-disable-next-line camelcase
              member_price: addGoodForm.memberPrice1, // 会员价
              // eslint-disable-next-line camelcase
              push_money_type: addGoodForm.pushMoney1, // 提成方式
              // eslint-disable-next-line camelcase
              push_money: addGoodForm.deduct1, // 提成额度
              // eslint-disable-next-line camelcase
              shop_code: addGoodForm.productCode1, // 商品条码
              type: 1, // 标识，1 为默认的三种销售方式，2为其它销售方式
              plu: addGoodForm.productPluCode1, // plu码
              // eslint-disable-next-line camelcase
              change_price: addGoodForm.packageChangePrice, // 允许改价
              // eslint-disable-next-line camelcase
              change_discount: addGoodForm.allowPackageDiscount, // 允许折扣
              // eslint-disable-next-line camelcase
              change_integral: addGoodForm.allowPackageIntegral, // 允许积分
              // eslint-disable-next-line camelcase
              default_sale: addGoodForm.saleMethod1, // 销售方式
              // eslint-disable-next-line eqeqeq
              default: addGoodForm.salePackage == 0 ? 1 : 0
            },
            {
              name: addGoodForm.kg, // 包装单位
              amount: addGoodForm.unitNum2, // 数量
              unit: addGoodForm.kg, // 单位
              // eslint-disable-next-line camelcase
              supply_price: addGoodForm.packagePrice2, // 成本价
              price: addGoodForm.salePrice2, // 销售价
              // eslint-disable-next-line camelcase
              member_price: addGoodForm.memberPrice2, // 会员价
              // eslint-disable-next-line camelcase
              push_money_type: addGoodForm.pushMoney2, // 提成方式
              // eslint-disable-next-line camelcase
              push_money: addGoodForm.deduct2, // 提成额度
              // eslint-disable-next-line camelcase
              shop_code: addGoodForm.productCode2, // 商品条码
              type: 1, // 标识，1 为默认的三种销售方式，2为其它销售方式
              plu: addGoodForm.productPluCode2, // plu码
              // eslint-disable-next-line camelcase
              change_price: addGoodForm.weightChangePrice, // 允许改价
              // eslint-disable-next-line camelcase
              change_discount: addGoodForm.allowWeightDiscount, // 允许折扣
              // eslint-disable-next-line camelcase
              change_integral: addGoodForm.allowPieceIntegral, // 允许积分
              // eslint-disable-next-line camelcase
              default_sale: addGoodForm.saleMethod2, // 销售方式
              // eslint-disable-next-line eqeqeq
              default: addGoodForm.salePackage == 1 ? 1 : 0
            },
            {
              name: addGoodForm.piece, // 包装单位
              amount: addGoodForm.unitNum3, // 数量
              unit: addGoodForm.piece, // 单位
              // eslint-disable-next-line camelcase
              supply_price: addGoodForm.packagePrice3, // 成本价
              price: addGoodForm.salePrice3, // 销售价
              // eslint-disable-next-line camelcase
              member_price: addGoodForm.memberPrice3, // 会员价
              // eslint-disable-next-line camelcase
              push_money_type: addGoodForm.pushMoney3, // 提成方式
              // eslint-disable-next-line camelcase
              push_money: addGoodForm.deduct3, // 提成额度
              // eslint-disable-next-line camelcase
              shop_code: addGoodForm.productCode3, // 商品条码
              type: 1, // 标识，1 为默认的三种销售方式，2为其它销售方式
              plu: addGoodForm.productPluCode3, // plu码
              // eslint-disable-next-line camelcase
              change_price: addGoodForm.packageChangePrice, // 允许改价
              // eslint-disable-next-line camelcase
              change_discount: addGoodForm.allowPieceDiscount, // 允许折扣
              // eslint-disable-next-line camelcase
              change_integral: addGoodForm.allowPieceIntegral, // 允许积分
              // eslint-disable-next-line camelcase
              default_sale: addGoodForm.saleMethod3, // 销售方式
              // eslint-disable-next-line eqeqeq
              default: addGoodForm.salePackage == 2 ? 1 : 0
            }
          ];
          console.log(arr);
          const newSpec = [];
          let newOtherArr = [];
          let aSpec = [];
          arr.filter((item, index) => {
            // eslint-disable-next-line eqeqeq
            if (item == "1") {
              newSpec.push(spec[index]);
            }
          });

          if (this.otherSalesMode.length > 0) {
            newOtherArr = this.otherSalesMode.filter((item, index) => {
              if (item.supply_price || item.price || item.member_price) {
                // eslint-disable-next-line eqeqeq
                if (item.amount == "") {
                  item.amount = 1;
                }
                return item;
              }
            });
            aSpec = newSpec.concat(newOtherArr);
          } else {
            aSpec = newSpec;
          }
          console.log("newSpec:", newSpec);
          console.log("aSpec:", aSpec);
          console.log("otherSale:", newOtherArr);

          const Ogood = {
            barcode:this.addGoodForm.barcode,
            goods_no:this.addGoodForm.goods_no,
            id: id,
            // 基础信息
            name: addGoodForm.name, // 商品名称
            // eslint-disable-next-line camelcase
            cate_id: addGoodForm.sort, // 商品分类
            // eslint-disable-next-line camelcase
            mnemonic_code: addGoodForm.mnemonicCode, // 商品助记码
            // eslint-disable-next-line camelcase
            commodity_code: addGoodForm.commCode, // 商品编码
            // eslint-disable-next-line camelcase
            cost_accounting_method: addGoodForm.costmethod, // 成本核算方式
            forsale: addGoodForm.puaway, // 是否上架
            indate: addGoodForm.expirationdate, // 有效保质期
            // eslint-disable-next-line camelcase
            unit_conversion:
              addGoodForm.costunit +
              "," +
              addGoodForm.kg +
              "," +
              addGoodForm.piece, // 单位换算
            // eslint-disable-next-line camelcase
            base_unit:
              addGoodForm.unitNum1 +
              "," +
              addGoodForm.unitNum2 +
              "," +
              addGoodForm.unitNum3, // 基本单位
            sort: addGoodForm.markuppercent, // 排序
            // eslint-disable-next-line camelcase
            supplier_id: addGoodForm.supplier, // 供应商
            thumb: addGoodForm.thumb, // 商品图片
            sku: addGoodForm.skuUnit, // sku单位
            // eslint-disable-next-line camelcase
            basic_information:
              addGoodForm.packageSel1 +
              "," +
              addGoodForm.packageSel2 +
              "," +
              addGoodForm.packageSel3, // 基础信息
            specification: JSON.stringify(aSpec),
            shop_id: this.shop_id
          };
          const { data: res } = await this.$http.post(
            "mapi/updateGoods",
            Ogood
          );
          if (res.status !== 1) return this.$message.error("商品修改失败！");
          this.$message.success("商品修改成功！");
          this.$router.push({path:"goods",query:{
            page:this.page
          }});
          console.log(res);
        } else {
          this.$message.error("修改商品失败，请检查所填写信息是否完善！");
          return false;
        }
      });
    },
    getNowDate(date) {
      return (
        date.getFullYear() +
        "年" +
        (date.getMonth() + 1) +
        "月" +
        date.getDate() +
        "日 " +
        (date.getHours() < 10 ? "0" + date.getHours() : date.getHours()) +
        ":" +
        (date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes()) +
        ":" +
        (date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds())
      );
    }
  }
};
</script>

<style scoped lang="less">
.w217 {
  width: 217px;
}
.unit {
  margin-right: 0;
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
</style>
<style lang="less">
.disabled {
  .el-upload--picture-card {
    display: none;
  }
}
.el-input-group__append {
  padding: 0 1px !important;
}
table th.must div::before {
  content: "*";
  color: #ff1818;
}
.create-isLoading {
  .el-loading-spinner {
    top: 50%;
    left: 50%;
    margin-left: -55px;
    background: rgba(0, 0, 0, 0.7);
    padding: 20px;
    border-radius: 4px;
    width: auto;
    text-align: center;
    position: absolute;
    i {
      color: #fff;
      font-size: 18px;
    }

    .el-loading-text {
      color: #fff;
      font-size: 18px;
    }
  }
}
</style>
