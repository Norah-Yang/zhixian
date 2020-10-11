<template>
    <div>
        <!-- 卡片视图区域 -->
        <el-card>
            <el-row>
                <el-col :span="24">
                    <el-select v-model="parameter.cate_id" placeholder="分类选择"  size="mini">
                        <el-option
                            v-for="item in shopList"
                            :key="item.id"
                            :label="item.title"
                            :value="item.id"
                        ></el-option>
                    </el-select>
                    <!-- <el-select v-model="value" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
                    </el-select>-->
                    <el-select v-model="parameter.forsale" placeholder="上架状态"  size="mini">
                        <el-option
                            v-for="item in orderType"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                        ></el-option>
                    </el-select>
                    <!-- <el-select v-model="value" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
                    </el-select>-->
                    <!-- <el-select v-model="times" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
                    </el-select>-->
                    <!-- <el-date-picker
         :disabled="getisdisabled"
         :clearable="false"
      v-model="times"
      type="daterange"
       value-format="timestamp"
      start-placeholder="开始日期"
      end-placeholder="结束日期"
     >
                    </el-date-picker>-->
                    <el-select v-model="parameter.hot" placeholder="推荐类型"  size="mini">
                        <el-option
                            v-for="item in dateList"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                        ></el-option>
                    </el-select>
                    <el-select v-model="parameter.id" placeholder="请选择"  size="mini">
                        <el-option
                            v-for="item in  orderQuery"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                        ></el-option>
                    </el-select>
                        <el-select v-model="parameter.shop_id" placeholder="店铺"  @change="order"  size="mini">
                        <el-option
                            v-for="item in shop"
                            :key="item.id"
                            :label="item.title"
                            :value="item.id"
                        ></el-option>
                    </el-select>
                    <el-input
                        placeholder="请输入内容"
                        v-model="parameter.keyword"
                        class="input-with-select"
                        size="mini"
                    >
                        <el-button slot="append" @click="onserch"    v-no-click  >搜索</el-button>
                    </el-input>
                    <el-button type="danger" @click="onclear"   v-no-click  size="mini">清除</el-button>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="24">
                    <div class="height"></div>
                    <el-button-group>
                        <el-button
                            size="mini"
                            type="primary"
                            icon="el-icon-success"
                            @click="toggleSelectionConfirm()"
                              v-no-click
                        >全选</el-button>
                        <el-button
                            size="mini"
                            type="primary"
                            icon="el-icon-error"
                            @click="toggleSelectionCancel()"
                              v-no-click
                        >取消</el-button>
                        <el-button
                            size="mini"
                            type="primary"
                            icon="el-icon-delete"
                            @click="onallDel"
                              v-no-click
                        >删除</el-button>
                        <el-button size="mini" type="primary" icon="el-icon-top" @click="onupper"   v-no-click>上架</el-button>
                        <el-button
                            size="mini"
                            type="primary"
                            icon="el-icon-bottom"
                            @click="lower"
                              v-no-click
                        >下架</el-button>
                        <el-button size="mini" type="primary" icon="el-icon-circle-plus" @click="onaddgoods"   v-no-click>新增</el-button>
                    </el-button-group>
                      <el-select v-model="vaselectvalue"  placeholder="推荐为" size="mini" multiple class="multiple_select">
                        <el-option
                  v-for="item in selectArr"
                     :key="item.value"
                 :label="item.label"
                     :value="item.value">
                     </el-option>
                </el-select>
                <el-button size="mini" @click="ondetermine"   v-no-click>确定</el-button>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="24">
                    <!-- 占位符 -->
                    <div class="height"></div>
                    <el-table
                        ref="multipleTable"
                        :data="tableData"
                        border=""
                        style="width: 100%"
                        @selection-change="onselectionChange"
                    >
                        <el-table-column type="selection" width="55"></el-table-column>
                        <el-table-column prop="pid" label="商品Id"></el-table-column>
                        <el-table-column prop="title" label="商品名称"></el-table-column>
                        <el-table-column prop="order_no" label="商品图片" width="180">
                            <template slot-scope="row">
                                <el-image
                                    style="width: 50px; height:50px"
                                    :src="row.row.thumb"
                                    fit="contain"
                                ></el-image>
                            </template>
                        </el-table-column>
                        <el-table-column prop="title" label="商品分类"></el-table-column>
                        <el-table-column prop="commodity_code" label="商品编号" width="180"></el-table-column>
                        <el-table-column prop="forsale" label="上架状态">
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
                        <el-table-column prop="pay_state" label="商品推荐" width="220">
                            <template slot-scope="row">
                                <!-- <div>{{row.row.goods_hot_one}}</div> -->
                                <el-tag
                                   type:='success'
                                     effect="dark" v-if="row.row.goods_hot_one==1" @click="ontag(row,1)">
                                     新品
                                   </el-tag>
                                   <el-tag
                                   type:='success'
                                     effect="plain" v-else @click="ontag(row,1)">
                                    新品
                                   </el-tag>
                                   <el-tag
                                   type:='success'
                                     effect="dark" v-if="row.row.goods_hot_two==1" @click="ontag(row,2)">
                                    喜欢
                                   </el-tag>
                                    <el-tag
                                   type:='success'
                                     effect="plain" v-else @click="ontag(row,2)">
                                    喜欢
                                   </el-tag>
                                     <el-tag
                                   type:='success'
                                     effect="dark" v-if="row.row.goods_hot_three==1" @click="ontag(row,3)">
                                    新人专享
                                   </el-tag>
                                     <el-tag
                                   type:='success'
                                     effect="plain" v-else @click="ontag(row,3)">
                                    新人专享
                                   </el-tag>
                                     
                                <!-- <div>{{row.row.goods_hot_three}}</div>
                                <div>{{row.row.goods_hot_two}}</div> -->
                            </template>
                        </el-table-column>
                        <el-table-column prop="sort" label="排序"></el-table-column>
                        <el-table-column prop="add_time" label="时间" width="180"></el-table-column>
                        <el-table-column label="操作" width="280">
                            <template slot-scope="row">
                                <el-button size="mini" type="primary" @click="onShowDialog(row)"   v-no-click>查看</el-button>
                                <el-button size="mini" type="danger" @click="onShowDel(row)"   v-no-click>删除</el-button>
                                <el-button
                                    size="mini"
                                    type="primary"
                                    icon="el-icon-full-screen"
                                    @click="onShowDialog(row)"
                                ></el-button>
                                <el-button size="mini" type="success" @click="onShowDialog(row)"   v-no-click>推广</el-button>
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
                            :total="count"
                        ></el-pagination>
                    </div>
                </el-col>
            </el-row>
        </el-card>
        <!-- 对话框 -->
        <el-dialog title="订单详情" :visible="dialogVisible" width="50%" :show-close="false" :close-on-click-modal="false" :close-on-press-escape="false">
            <el-row>
                <el-col :span="12">
                    <div class="grid-content bg-purple">1</div>
                </el-col>
                <el-col :span="12">
                    <div class="grid-content bg-purple-light">2</div>
                </el-col>
            </el-row>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false"   v-no-click>取 消</el-button>
                <el-button type="primary" @click="dialogVisible = false"   v-no-click>确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
//门店:shop_id,订单类型:refund_state(0:销售/1:退款),时间选择(create_time:1-10/自定义:start_time - end_time),
//搜索框(number:[1:订单号查询,2:会员卡号查询,3:会员电话查询],keyword:搜索框内容)
export default {
  // props:[],
  // 页面加载
  created() {
    // 获取订单列表
    this.getshops()
  },
  // 页面加载完成
  mounted() {},
  data() {
    return {
        selectArr:[
            {
             label:"新品" ,value:1
            },
            {    label:"喜欢",value:2},
            {    label:"新人专享",value:3}
        ],
        vaselectvalue:"",//下拉菜单选择的列表
      tableData: [], //表格的数据
      shop:[],
      shopList: [], //门店列表
      selection: [],
      count: 0,
      dialogVisible: false, //对话框开关
      orderType: [
        {
          value: 0,
          label: "下架"
        },
        {
          value: 1,
          label: "上架"
        }
      ],
      times: "",
      parameter: {
        cate_id: "",
        pagenum: 1,
        pagesize: 10,
        forsale: "",
        hot: "",
        start_time: "",
        end_time: "",
        id: "",
        keyword: "",
        shop_id:""
      },
      orderQuery: [
        {
          value: 1,
          label: "商品ID"
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
      dateList: [
        {
          value: 1,
          label: "新品"
        },
        {
          value: 2,
          label: "喜欢"
        },
        {
          value: 3,
          label: "新人专享"
        },
      
       
      ],
      options: [
        {
          value: "选项1",
          label: "黄金糕"
        },
        {
          value: "选项2",
          label: "双皮奶"
        },
        {
          value: "选项3",
          label: "蚵仔煎"
        },
        {
          value: "选项4",
          label: "龙须面"
        },
        {
          value: "选项5",
          label: "北京烤鸭"
        }
      ],
      value: "",
      input3: ""
    };
  },
  // 方法
  methods: {
       async getshops(){
         const loading = this.$loading({
          lock: true,
          text: 'Loading',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.1)'
        });
         this.$api
        .getshops({}) .then(res => {
          if (res.data.code == 200) {
            loading.close();
            this.shop=res.data.shop
            if(res.data.shop.length>0){
            this.parameter.shop_id=res.data.shop[0].id
            }
             this.order();
          } else {
            this.$message.error(res.data.msg);
          }
        })
        .catch(res => {
          this.$api.error();
          console.log(res);
        });
    },
    order() {
      this.$api
        .getGoodsList(this.parameter)
        .then(res => {
          if (res.data.code == 200) {
            res.data.list.forEach(x => {
              if (x.forsale == "1") {
                x.value = true;
              } else {
                x.value = false;
              }
            });
            this.tableData = res.data.list;
            this.shopList = res.data.cate;
            this.count = res.data.count;
          } else {
            this.$message.error(res.data.msg);
          }
        })
        .catch(res => {
          console.log(res);
          this.$message.error("获取数据列表失败");
        });
    },
    // 分页
    handleSizeChange(e) {
      this.parameter.pagesize = e;
      this.order();
    },
    // 分页
    handleCurrentChange(e) {
      this.parameter.pagenum = e;
      this.order();
    },
    // 查看订单详情
    onShowDialog(e) {
       this.$router.push({name:"addgoods", params:{
            id:e.row.pid
          }})
    },
    // 搜搜
    onserch() {
          this.parameter.pagenum = 1;
      this.parameter.pagesize = 10;
      this.order();
    },
    // 清除查询
    onclear() {
      this.parameter = {
        shop_id: "",
        pagenum: 1,
        pagesize: 7,
        refund_state: "",
        create_time: "",
        start_time: "",
        end_time: "",
        number: "",
        keyword: ""
      };
      this.order();
    },
    // 开关切换回掉函数
    onswitchType(row) {
      let type = null;
      if (row.row.value) {
        type = "1";
      } else {
        type = "0";
      }
      this.$api
        .getweiUpStatus({
          id: row.row.pid,
          forsale: type
        })
        .then(res => {
          if (res.data.code == 200) {
            this.$message.success(res.data.msg);
            this.order();
          } else {
            this.$api.error(res.data.msg);
          }
        })
        .catch(res => {
          this.$api.error();
          console.log(res);
        });
    },
    onselectionChange(e) {
      this.selection = e;
    },
    toggleSelectionConfirm() {
      this.$refs.multipleTable.toggleAllSelection();
    },
    toggleSelectionCancel() {
      this.$refs.multipleTable.clearSelection();
    },
    onupper() {
      if (this.selection.length == 0) {
        this.$api.error("请选择列表");
        return;
      }
      let selectionArr = this.selection.map(x => {
        return x.pid;
      });
      this.$api
        .getweiAllStatus({
          id: selectionArr.join(","),
          forsale: 1
        })
        .then(res => {
          if (res.data.code == 200) {
            this.$message.success(res.data.msg);
            this.order();
          } else {
            this.$api.error(res.data.msg);
          }
        })
        .catch(res => {
          this.$api.error();
          console.log(res);
        });
    },
    lower() {
      if (this.selection.length == 0) {
        this.$api.error("请选择列表");
        return;
      }
      let selectionArr = this.selection.map(x => {
        return x.pid;
      });
      this.$api
        .getweiAllStatus({
          id: selectionArr.join(","),
          forsale: 0
        })
        .then(res => {
          if (res.data.code == 200) {
            this.$message.success(res.data.msg);
            this.order();
          } else {
            this.$api.error(res.data.msg);
          }
        })
        .catch(res => {
          this.$api.error();
          console.log(res);
        });
    },
    // 删除
    onShowDel(row) {
      this.$confirm("此操作将永久删除, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$api
            .getweiDel({
              id: row.row.pid
            })
            .then(res => {
              if (res.data.code == 200) {
                this.$message.success(res.data.msg);
                this.order();
              } else {
                this.$api.error(res.data.msg);
              }
            })
            .catch(res => {
              this.$api.error();
              console.log(res);
            });
        })
        .catch(() => {});
    },
    onallDel() {
      if (this.selection.length == 0) {
        this.$api.error("请选择列表");
        return;
      }
      let selectionArr = this.selection.map(x => {
        return x.pid;
      });
      this.$confirm("此操作将永久删除, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$api
            .getweiAllDel({
              id: selectionArr.join(",")
            })
            .then(res => {
              if (res.data.code == 200) {
                this.$message.success(res.data.msg);
                this.order();
              } else {
                this.$api.error(res.data.msg);
              }
            })
            .catch(res => {
              this.$api.error();
              console.log(res);
            });
        })
        .catch(() => {});
    },
    // tag标签切换
    ontag(row,e){
           let data={id: row.row.pid}
            if(e==1){
                if(row.row.goods_hot_one==1){
                       data.goods_hot_one=0
                }else{
                       data.goods_hot_one=1
                }
            }else if(e==2){
                   
                  if(row.row.goods_hot_two==1){
                        data.goods_hot_two=0
                }else{
                        data.goods_hot_two=1
                }
            }else{
                if(row.row.goods_hot_three==1){
                       data.goods_hot_three=0
                }else{
                data.goods_hot_three=1

                } 
            }
                this.$api
            .getweiRecommend(data)
            .then(res => {
              if (res.data.code == 200) {
                this.$message.success(res.data.msg);
                this.order();
              } else {
                this.$api.error(res.data.msg);
              }
            })
            .catch(res => {
              this.$api.error();
              console.log(res);
            });
    },
       // tag标签批量切换
    ondetermine(){
        let data={}
     if (this.selection.length == 0) {
        this.$api.error("请选择批量处理列表");
        return;
      }
      if(!this.vaselectvalue){
            this.$api.error("请选择商品推荐列表");
        return;
      }
            let selectionArr = this.selection.map(x => {
        return x.pid;
      });
        data.id=selectionArr.join(",");
            this.vaselectvalue.forEach(x=>{
                           if(x==1){
                            data.goods_hot_one=1 
            }else if(x==2){
                        data.goods_hot_two=1
            }else if(x==3){
                data.goods_hot_three=1

            }
            })
          this.$api
            .getweiAllRecommend(data)
            .then(res => {
                this.vaselectvalue=[]
              if (res.data.code == 200) {
                this.$message.success(res.data.msg);
                this.order();
              } else {
                this.$api.error(res.data.msg);
              }
            })
            .catch(res => {
              this.$api.error();
              console.log(res);
            });
    },
    // 跳转到商品添加
    onaddgoods(){
        this.$router.push({
          name:"addgoods",params:{
            shop_id:this.parameter.shop_id
          }
        })
    },
  },
  // 监听属性
  watch: {},
  // 组件
  component: {},
  // 计算属性
  computed: {}
};
// mapi/weiRecommend  微信商品推荐 post   :pid  
// goods_hot_one  goods_hot_two   goods_hot_three
</script>

<style lang="less" scoped>
.el-select {
  width: 150px;
  margin-right: 10px;
}
.el-input {
  width: 20%;
  margin-right: 10px;
}
.el-date-editor {
  width: 230px;
  margin-right: 10px;
}
.el-tag{
    margin-right: 5px;
    cursor: pointer;
}
.multiple_select{
    margin-left: 10px;
}
</style>