<template>
  <el-card>
    <el-row :gutter="5" style="width:100%">
        <el-col >
            <el-form :model="ruleForm"  ref="ruleForm" label-width="200px" class="demo-ruleForm">
                <el-divider content-position="center">基础配置</el-divider>
                <el-form-item label="活动名称："   prop="name"  style="width:40%">
                    <el-input v-model="ruleForm.name"></el-input>
                </el-form-item>
                <el-form-item label="折扣类型：" prop="discount_state">
                    <el-radio-group v-model="ruleForm.discount_state">
                        <el-radio :label="0">限时特价</el-radio>
                        <el-radio :label="1">限时折扣</el-radio>
                    </el-radio-group>
                </el-form-item>
                <!-- <el-form-item  label="活动渠道：" prop="checkbox">
                <el-checkbox-group v-model="ruleForm.checkbox">
                    <el-checkbox label="线上商城"></el-checkbox>
                    <el-checkbox label="小程序"></el-checkbox>
                </el-checkbox-group>
                </el-form-item> -->
                <el-form-item  label="生效时间：" prop="time">
                <el-date-picker
                    v-model="time"
                    type="daterange"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期">
                </el-date-picker>
                </el-form-item>
                <el-form-item  label="按周期：" prop="time_state">
                <el-checkbox-group  >
                    <el-switch
                        v-model="ruleForm.time_state"
                        active-color="#008080"
                        inactive-color="#ff4949"
                        active-text="是"
                        inactive-text="否"
                        :active-value="1"
                        :inactive-value="0"
                    ></el-switch><br>
                </el-checkbox-group>
                </el-form-item>
                <el-form-item  label="执行周期：" prop="day_state" v-if='ruleForm.time_state'>
                  <el-radio-group v-model="ruleForm.day_state">
                    <el-radio :label="1">每天</el-radio>
                    <el-radio :label="2">每周</el-radio>
                    <el-radio :label="3">每月</el-radio>
                </el-radio-group>
                <el-checkbox-group v-model="weeks" v-if='ruleForm.day_state == 2' style="border:1px solid #ccc;border-radius:3px;padding:0 10px;">
                    <el-checkbox v-for="operate in 7"  :label="operate"   :key="operate" >
                    周{{operate == 7? '天': operate}}
                   </el-checkbox>
                </el-checkbox-group>
                <el-checkbox-group v-model="month"  v-if='ruleForm.day_state == 3' style="border:1px solid #ccc;border-radius:3px;padding:0 10px;"  >
                     <el-checkbox v-for="operate in 31"  :label="operate"   :key="operate">
                   {{operate}}号
                   </el-checkbox>
                </el-checkbox-group>
                <!-- 添加时间段 -->
                </el-form-item> 
                 <el-form-item
                    v-for="(domain, index) in ruleForm.time"
                    :label="'时间段' + index"
                    :key="domain.key"
                    :prop="'time.' + index + '.value'"
                >
                    <el-time-select
                    placeholder="起始时间"
                    v-model="ruleForm.time[index].up_time"
                    :picker-options="{
                    start: '00:00',
                    step: '00:15',
                    end: '23:30'
                    }">
                    </el-time-select> 
                    <span class="gray"> ~ </span>
                    <el-time-select 
                    placeholder="结束时间"
                    v-model="ruleForm.time[index].down_time"
                    :picker-options="{
                    start: '00:30',
                    step: '00:15',
                    end: '23:30',
                    minTime: ruleForm.opening_time
                    }">
                    </el-time-select>
                    <span v-if='ruleForm.goods_state == 0'  >
                        <span class="gray" v-if='ruleForm.discount_state == 0'>特价</span>
                        <el-input v-model="ruleForm.time[index].sale_price" placeholder="请输入价格" style="width:8%" v-if='ruleForm.discount_state == 0'></el-input>  <span class="gray"  v-if='ruleForm.discount_state == 0'>元</span>
                        <span class="gray" v-if='ruleForm.discount_state == 1'>折扣</span>
                        <el-input v-model="ruleForm.time[index].discount" placeholder="请输入折扣" style="width:8%" v-if='ruleForm.discount_state == 1'></el-input>  <span class="gray"  v-if='ruleForm.discount_state == 1'>折</span>
                        <span class="gray"></span>
                    </span>     
                    <span class="gray"></span>
                    <el-button @click.prevent="removeDomain(domain)" type="danger">删除</el-button>
                    <el-button @click="addDomain" type="primary">新增时间段</el-button>
                </el-form-item>
                <!-- 选择折扣设置 -->
                <el-divider content-position="center">折扣设置</el-divider>
                <el-form-item  label="适用商品：" prop="goods_state">
                  <el-radio-group v-model="ruleForm.goods_state" @change="check()">
                    <el-radio :label="0">全部商品</el-radio>
                    <el-radio :label="1">指定可用商品</el-radio>
                    <el-radio :label="2">指定分类</el-radio>
                </el-radio-group>
                </el-form-item>
                <!-- 添加 -->
                <el-form-item label="活动商品：" v-if='ruleForm.goods_state != 0'>
                <div v-if='ruleForm.goods_state == 1'>
                    <el-button @click="add_goods" type="primary">添加商品</el-button>
                    <el-button @click="del_goods" type="danger">清空列表</el-button>
                </div>
                <div v-if='ruleForm.goods_state == 2'>
                    <el-button @click="add_fl" type="primary">添加分类</el-button>
                    <el-button @click="del_fl" type="danger">清空列表</el-button>
                </div>
                </el-form-item>
                
                <!-- 折扣   指定商品 -->
                <el-form-item  prop="goods_zk" v-if='ruleForm.discount_state == 1 && ruleForm.goods_state  == 1' style="min-height:300px;height:300px;overflow-y:scroll">
                    <el-table
                        :data="goods_list_zk"
                        style="width: 100%;border:1px solid #EBEEF5;">
                        <el-table-column
                        prop="iid"
                        label="商品ID"
                        width="180">
                        </el-table-column>
                        <el-table-column label="图片">
                        <template slot-scope="row">
                            <div v-if="row.row.thumb">
                            <el-image :src="row.row.thumb"   ></el-image>
                            </div>
                            <div v-else>暂无图片</div>
                        </template>
                        </el-table-column>
                        <el-table-column
                        prop="name"
                        label="品名">
                        </el-table-column>
                        <el-table-column
                        prop="type"
                        label="分类">
                        </el-table-column>
                        <el-table-column
                        prop="amount"
                        label="规格">
                        </el-table-column>
                        <el-table-column
                        prop="price"
                        label="售价">
                        </el-table-column>
                        <el-table-column
                        label="折扣">
                        <template slot-scope="row">
                           <el-input v-model="row.row.discount" style="width:40%"></el-input>
                        </template>
                        </el-table-column>
                        <el-table-column
                        label="折后价">
                        <template slot-scope="row">
                           <el-input v-model="row.row.sale_price" style="width:40%"></el-input>
                        </template>
                        </el-table-column>
                        <el-table-column
                            fixed="right"
                            label="操作">
                            <template slot-scope="scope">
                                <el-button
                                @click.native.prevent="del(scope.$index, goods_list_zk)"
                                type="text"
                                size="small">
                                移除
                                </el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-form-item>
                <!-- 折扣  指定分类-->
                <el-form-item  prop="goods_zk1" v-if='ruleForm.discount_state == 1 && ruleForm.goods_state == 2' style="min-height:300px;height:300px;overflow-y:scroll">
                    <el-table
                        :data="goods_list_zk1"
                        style="width: 100%;border:1px solid #ddd;margin-top:12px;">
                        <el-table-column
                        prop="cate_id"
                        label="分类ID">
                        </el-table-column>
                        <el-table-column
                        prop="type"
                        label="分类名称">
                        </el-table-column>
                        <el-table-column
                        label="折扣">
                        <template slot-scope="row">
                           <el-input v-model="row.row.discount" style="width:40%"></el-input>
                        </template>
                        </el-table-column>
                        <el-table-column
                            fixed="right"
                            label="操作">
                            <template slot-scope="scope">
                                <el-button
                                @click.native.prevent="del(scope.$index, goods_list_zk1)"
                                type="text"
                                size="small">
                                移除
                                </el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-form-item>
            
                
                <!-- 特价  指定商品 -->
                <el-form-item  prop="goods_tj" v-if='ruleForm.discount_state == 0 && ruleForm.goods_state == 1' style="min-height:300px;height:300px;overflow-y:scroll">
                    <el-table
                        :data="goods_list_tj"
                        style="width: 100%;border:1px solid #ddd;margin-top:12px;">
                        <el-table-column
                        prop="iid"
                        label="商品ID"
                        width="180">
                        </el-table-column>
                        <el-table-column label="图片">
                        <template slot-scope="row">
                            <div v-if="row.row.thumb">
                            <el-image :src="row.row.thumb"  ></el-image>
                            </div>
                            <div v-else>暂无图片</div>
                        </template>
                        </el-table-column>
                        <el-table-column
                        prop="name"
                        label="品名">
                        </el-table-column>
                        <el-table-column
                        prop="type"
                        label="分类">
                        </el-table-column>
                        <el-table-column
                        prop="amount"
                        label="规格">
                        </el-table-column>
                        <el-table-column
                        prop="price"
                        label="售价">
                        </el-table-column>
                        <el-table-column
                        label="特价">
                        <template slot-scope="row">
                           <el-input v-model="row.row.sale_price" style="width:40%"></el-input>
                        </template>
                        </el-table-column>
                        <el-table-column
                            fixed="right"
                            label="操作">
                            <template slot-scope="scope">
                                <el-button
                                @click.native.prevent="del(scope.$index, goods_list_tj)"
                                type="text"
                                size="small">
                                移除
                                </el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-form-item>
                <!-- 特价  指定分类 -->
                <el-form-item  prop="goods_tj1" v-if='ruleForm.discount_state == 0 && ruleForm.goods_state == 2' style="min-height:300px;height:300px;overflow-y:scroll">
                    <el-table
                        :data="goods_list_tj1"
                        style="width: 100%;border:1px solid #ddd;margin-top:12px;">
                         <el-table-column
                        prop="cate_id"
                        label="分类ID">
                        </el-table-column>
                        <el-table-column
                        prop="type"
                        label="分类名称">
                        </el-table-column>
                        <el-table-column
                        label="特价">
                        <template slot-scope="row">
                           <el-input v-model="row.row.sale_price" style="width:40%"></el-input>
                        </template>
                        </el-table-column>
                        <el-table-column
                            fixed="right"
                            label="操作">
                            <template slot-scope="scope">
                                <el-button
                                @click.native.prevent="del(scope.$index, goods_list_tj1)"
                                type="text"
                                size="small">
                                移除
                                </el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-form-item>

                <!-- 统一设置价格和折扣 -->
 
                <el-form-item label="批量设置统一折扣：" prop="price_zk" v-if='ruleForm.discount_state == 1   && ruleForm.goods_state != 0'   >
                    <el-input type="text" placeholder="请输入统一折扣" v-model="price_zk" style="width:8%;" @keyup.native="blur_zk()"></el-input> 折 <el-button style="margin-left:2%" type="primary" size="small" @click="price_all('ruleForm')">确定</el-button>
                </el-form-item>
                <el-form-item label="批量设置统一特价：" prop="price_tj" v-if='ruleForm.discount_state == 0   && ruleForm.goods_state != 0'   >
                    <el-input type="text" placeholder="请输入统一特价" v-model="price_tj" style="width:8%;" @keyup.native="blur_fl()"></el-input> 元 <el-button style="margin-left:2%" type="primary" size="small" @click="price_all_fl('ruleForm')">确定</el-button>
                </el-form-item>

                <el-divider content-position="center">高级配置</el-divider>
                <el-form-item label="会员积分：" prop="score_state">
                     <el-radio-group v-model="ruleForm.score_state">
                        <el-radio :label="0">不积分</el-radio>
                        <el-radio :label="1">积分</el-radio>
                    </el-radio-group>  <br>
                    <div class="red">积分：参与活动商品仍有积分；不积分：参与活动商品无积分</div>
                </el-form-item>
                <el-form-item label="商品限购：" prop="limit_state">
                    <el-radio-group v-model="ruleForm.limit_state">
                        <el-radio :label="0">不限购</el-radio>
                        <el-radio :label="1">每人每种商品限购</el-radio>
                        <el-radio :label="2">每人每种商品限购前</el-radio>
                    </el-radio-group>
                    <br>   
                    <div class="red">限购仅对每单生效，如每单仅允许购买3件（公斤）限时折扣商品，买了5件（公斤），超过限购的部分以原价购买</div>
                </el-form-item>
                <el-form-item label="限购"   prop="limit_sale" v-if='ruleForm.limit_state == 1'  style="width:500px">
                    <el-input v-model="ruleForm.limit_sale" style="width:20%;"></el-input>件/公斤/箱
                </el-form-item>
                <el-form-item label="限购前"   prop="limit_sale" v-if='ruleForm.limit_state == 2'  style="width:500px">
                    <el-input v-model="ruleForm.limit_sale222"></el-input>件/公斤/箱享受折扣
                </el-form-item>
                <el-form-item label="活动状态" prop="state">
                    <el-switch
                        v-model="ruleForm.state"
                        active-color="#008080"
                        inactive-color="#ff4949"
                        active-text="是"
                        inactive-text="否"
                        :active-value="1"
                        :inactive-value="0"
                    ></el-switch><br>
                    <div class="red">限时折扣活动生效状态</div>
                </el-form-item>  
                <el-form-item>
                    <el-button type="primary" @click="submitForm('ruleForm')">确定</el-button>
                    <el-button @click="resetForm('ruleForm')">取消</el-button>
                </el-form-item>
            </el-form>
        </el-col>
    </el-row>
    <el-row>
        <el-col>
            <el-dialog title="添加分类" :visible="fl_dialog" width="30%" :show-close="false">
                <el-checkbox-group v-model="sel_type_list" style="border:1px solid #dedede;padding:10px 20px;">
                   <el-checkbox v-for="operate in type_list"  :label="operate.title"   
                   :key="operate.id">
                   {{operate.title}}
                   </el-checkbox>
                </el-checkbox-group>
            <span slot="footer" class="dialog-footer">
                <el-button @click="no_add"   v-no-click>取 消</el-button>
                <el-button type="primary" @click="add_fl_yes"   v-no-click>确定</el-button>
            </span>
            </el-dialog>
        </el-col> 
    </el-row>
    <el-row>
        <el-dialog title="添加商品" :visible="goods_dialog" width="70%" :show-close="false">
                <el-row :gutter="15" style="margin-bottom:10px">
                <el-col :span="3">
                    <el-select v-model="Page.id" placeholder="请选择">
                        <el-option v-for="item in goods_type" :key="item.id" :label="item.title" :value="item.id"></el-option>
                    </el-select>
                </el-col>
                <el-col :span="3">
                    <el-select v-model="Page.cate_id" placeholder="请选择">
                    <el-option v-for="item in type_list" :key="item.value" :label="item.title" :value="item.id"></el-option>
                    </el-select>
                </el-col>
                <el-col :span="6">
                    <el-input placeholder="请在这里输入搜索内容" v-model="Page.keyword" clearable></el-input>
                </el-col>
                <el-col :span="3">
                     <el-button type="primary" icon="el-icon-search" @click="search">搜索</el-button>
                </el-col>
            </el-row>
            <el-row>
                <el-col>
                    <el-table
                        :data="tableData"
                        border
                        @selection-change="handleSelectionChange"
                        style="width: 100%">
                        <el-table-column
                        type="selection"
                        width="55">
                        </el-table-column>
                        <el-table-column
                        prop="iid"
                        label="商品ID">
                        </el-table-column>
                        <el-table-column
                        prop="name"
                        label="商品名称">
                        </el-table-column>
                        <el-table-column
                        prop="type"
                        label="分类">
                        </el-table-column>
                        <el-table-column
                        prop="amount"
                        label="规格">
                        </el-table-column>
                        <el-table-column
                        prop="price"
                        label="售价">
                        </el-table-column>
                        <el-table-column
                        prop="member_price"
                        label="会员价">
                        </el-table-column>
                    </el-table>
                </el-col>
            </el-row>
            <el-row style="margin-top:50px">
            <el-col>
                    <div class="pagination">
                            <el-pagination
                                @size-change="handleSizeChange"
                                @current-change="handleCurrentChange"
                                :pagenum="Page.pagenum"
                                :page-sizes="[7, 12, 15, 20]"
                                layout="total, sizes, prev, pager, next, jumper"
                                :total="Page.count"
                            ></el-pagination>
                    </div>
                </el-col> 
            </el-row>
            <span slot="footer" class="dialog-footer">
                <el-button @click="no_add_"   v-no-click>取 消</el-button>
                <el-button type="primary" @click="add_goods_list"   v-no-click>确定</el-button>
            </span>
        </el-dialog>
    </el-row>
  </el-card>
</template>



<script>
export default {
     data(){
        return {
            id:"",
            fl_dialog:false,//添加分类弹框
            goods_dialog:false,//添加商品弹框
            week:[
                {id:1,name:"7"},
                {id:2,name:"1"},
                {id:3,name:"2"},
                {id:4,name:"3"},
                {id:5,name:"4"},
                {id:6,name:"5"},
                {id:7,name:"6"}],
            goods_list_zk:[],// 折扣 指定商品
            goods_list_zk1:[],// 折扣 指定分类
            goods_list_tj:[],// 特价 指定商品
            goods_list_tj1:[],// 特价 指定分类
            price_tj:0,//统一特价
            price_zk:0,//统一折扣
            time:[],//选择生效时间
            weeks:[],//选择的周
            month:[],//选择的月
            ruleForm:{
                name:"",//活动名称
                time_state:false,//是否按周期
                discount_state:0,//折扣类型
                // checkbox:["线上商城"],
                goods_state:0,// 折扣类型
                score_state:0,// 积分
                limit_state:0,//限购状态
                limit_sale:1,//限购条数
                state:1,//活动状态
                start_time:"",
                end_time:"",//生效时间
                time:[
                    {up_time:"",down_time:"",sale_price:0}
                ],
                day_state:1,// 天 ， 周 ，月
                day:0,
                week:'',
                month:'',
                product:[ //选择完商品或者分类的列表
                    // {
                    //     sale_price:0,// 特价,折扣价
                    //     discount:0, // 折扣
                    //     iid:'',// 商品ID
                    //     cate_id:"", //分类ID
                    // }
                ],
            },
            
            goods_type:[
                {id:0,title:"暂不选择",},
                {id:1,title:"商品ID",},
                {id:2,title:"商品名称",},
                {id:3,title:"商品编号",}
            ],
               Page: {
                pagenum: 1,
                pagesize: 10,
                count: 0,
                id:"",// 选择搜索条件
                cate_id:'',//分类id
                keyword:"",//搜索内容
            },
            tableData:[],//选择的商品列表
            multipleSelection:[],//选中的商品列表
            type_list:[],
            sel_type_list:[],//选中的商品分类
        }
    },
    created() {
        console.log(this.$route.query.id)
        // 查询商品分类
        this.$api.getcate( )
                  .then(res=>{
                       if(res.data.code == 200){
                            this.type_list = res.data.sort
                       }else{
                           this.$api.error(res.data.msg)
                       }
                  })
                  .catch(res => {
                  this.$api.error();
        }); 
        this.getGoodsList_()// 获取商品列表
        if(this.$route.query.id){
            this.limitShopDetail() //查询编辑
        }
    },
    methods:{
        getGoodsList_() {
                 this.$api.getGoodsList_(this.Page)
                .then(res=>{
                        if(res.data.code == 200){
                            this.tableData = res.data.data
                            this.Page.count = res.data.count
                            this.Page.pagenum =  res.data.current_page
                            if(res.data.data.length == 0){
                                this.$api.error(res.data.msg)
                            }
                        }else{
                            this.$api.error(res.data.msg)
                        }       
                })
        },
        limitShopDetail(){
            this.$api
            .limitShopDetail({sale_id:this.$route.query.id })
            .then(res => {
            if (res.data.code == 200) {
                this.$message.success("查询成功");
                this.ruleForm = res.data.store;
                if(res.data.store.start_time){
                    this.time = [res.data.store.start_time,res.data.store.end_time]
                }else{
                    this.time = []
                }
                console.log(this.time)
                let mon = [] , wee = [];
                if(res.data.store.month.length > 0 && res.data.store.month !=0 ){
                    res.data.store.month.split(",").forEach(ele=>{
                        mon.push(Number(ele))
                    })
                    this.month = mon
                }else{
                    this.month = []
                }
                if(res.data.store.week.length > 0 && res.data.store.week !=0 ){
                    res.data.store.week.split(",").forEach(ele=>{
                        wee.push(Number(ele))
                    })
                    this.weeks = wee
                }else{
                    this.weeks = []
                }
                if(this.ruleForm.time == undefined){  //未添加时间段
                    this.ruleForm.time = [{up_time:"",down_time:"",sale_price:0}]
                }else{
                    console.log(this.ruleForm.time)
                }
                console.log('类型---',res.data.store.discount_state,'----','商品分类----',res.data.store.goods_state)
                if(res.data.store.discount_state == 0){
                    if(res.data.store.goods_state == 0){
                        this.goods_list_zk = []
                        this.goods_list_zk1 = []
                        this.goods_list_tj = []
                        this.goods_list_tj1 = []
                    }else if(res.data.store.goods_state == 1){
                        this.goods_list_zk = []
                        this.goods_list_zk1 = []
                        this.goods_list_tj = res.data.store.goods
                        this.goods_list_tj1 = []
                    }else if(res.data.store.goods_state == 2){
                        this.goods_list_zk = []
                        this.goods_list_zk1 = []
                        this.goods_list_tj = []
                        this.goods_list_tj1 = res.data.store.category
                    }
                }
                if(res.data.store.discount_state == 1){
                    if(res.data.store.goods_state == 0){
                        this.goods_list_zk = []
                        this.goods_list_zk1 = []
                        this.goods_list_tj = []
                        this.goods_list_tj1 = []
                    }else if(res.data.store.goods_state == 1){
                        this.goods_list_zk =  res.data.store.goods
                        this.goods_list_zk1 = []
                        this.goods_list_tj = []
                        this.goods_list_tj1 = []

                    }else if(res.data.store.goods_state == 2){
                        this.goods_list_zk =  []
                        this.goods_list_zk1 = res.data.store.category
                        this.goods_list_tj = []
                        this.goods_list_tj1 = []
                    }
                }
                if(res.data.store.end_time== null || res.data.store.start_time == null){ // 未添加时间区域
                    this.time = []
                }
            } else {
                this.$api.error(res.data.msg);
            }
            })
            .catch(res => {
            this.$api.error();
            });
         },
         submitForm(formName) {
            //  生效时间
            
            this.ruleForm.start_time =  ''
            this.ruleForm.end_time =  ''

            if(!this.time || this.time.length == 0 ){
                this.$api.error("请填写活动时间")
                return false
            }else{
                let A = []
            if(this.$route.query.id){
                console.log( typeof this.time[0])
                if(typeof this.time[0] == 'object'){
                    this.ruleForm.start_time =   Date.parse(this.time[0])
                    this.ruleForm.end_time = Date.parse(this.time[1])
                }else if(typeof this.time[0] == 'number'){
                    this.ruleForm.start_time =  this.time[0]
                    this.ruleForm.end_time = this.time[1]
                }
            }else{
                this.time.forEach((ele,i)=>{
                        ele = Date.parse(ele)
                        A.push(ele)
                })
                this.ruleForm.start_time =  A[0]
                this.ruleForm.end_time =  A[1]
            }
            }
            // 执行周期
            if(this.ruleForm.day_state == 1){
                this.ruleForm.day = 1
            }else{
                this.ruleForm.day = 0
            }
            if(this.ruleForm.day_state != 2){
               this.ruleForm.week = 0 
            }else{
                let A = ''
                this.weeks.forEach((ele,i)=>{
                    A += (ele + ",")
                })
                this.ruleForm.week = A.substring(0,A.length - 1)
            }
            if(this.ruleForm.day_state != 3){
                this.ruleForm.month = 0    
            }else{
                let B = ''
                this.month.forEach((ele,i)=>{
                    B += (ele + ",")
                })
                this.ruleForm.month = B.substring(0,B.length - 1)
            }
          
            // 选择的商品或分类
            this.ruleForm.product = []
                if( this.ruleForm.discount_state == 0 &&this.ruleForm.goods_state == 0){
                    //  特价  全部商品
                    this.ruleForm.product = []
                }
                if( this.ruleForm.discount_state == 0 &&this.ruleForm.goods_state == 1 && this.goods_list_tj.length > 0 ){
                    //  特价 选择商品
                    this.goods_list_tj.forEach((ele,i)=>{
                        this.ruleForm.product.push({"sale_price":ele.sale_price ,"iid":ele.iid,"cate_id":'',"discount":''})
                    }) 
                }
                if( this.ruleForm.discount_state == 0 &&this.ruleForm.goods_state == 2 && this.goods_list_tj1.length > 0 ){
                    //  特价 选择分类
                    this.goods_list_tj1.forEach((ele,i)=>{
                        this.ruleForm.product.push({"sale_price":ele.sale_price  ,"iid":'',"cate_id":ele.cate_id,"discount":''})
                    }) 
                }
                if( this.ruleForm.discount_state == 1 &&this.ruleForm.goods_state == 1 && this.goods_list_zk.length > 0 ){
                    //  折扣 选择商品
                    this.goods_list_zk.forEach((ele,i)=>{
                        this.ruleForm.product.push({"sale_price":ele.sale_price  ,"iid":ele.iid,"cate_id":'',"discount":ele.discount})
                    }) 
                }
                if( this.ruleForm.discount_state == 1 &&this.ruleForm.goods_state == 2 && this.goods_list_zk1.length > 0 ){
                    //  折扣 选择分类
                    this.goods_list_zk1.forEach((ele,i)=>{
                        this.ruleForm.product.push({"sale_price":ele.sale_price  ,"iid":'',"cate_id":ele.cate_id,"discount":ele.discount})
                    }) 
                }
            this.$refs[formName].validate((valid) => {
            if (valid) {
              let id = this.$route.query.id
              if(id){
                //  修改
                   Object.assign(this.ruleForm,{sale_id:id})
                   console.log(this.ruleForm.start_time - 0)
                   if(this.ruleForm.start_time == null || this.ruleForm.end_time == null || this.ruleForm.start_time - 0 ==0){
                        this.$api.error("请填写活动时间")
                        return false
                    }else{
                        this.$api.limitStoreUpdate_(this.ruleForm)
                  .then(res=>{
                      res.data.code == 200 ? ( this.$message.success(res.data.msg),( this.$router.push("./shopDiscount"))):(this.$api.error(res.data.msg))
                  })
                  .catch(res => {
                  this.$api.error();
                  });
                    }
                    
              }else{
                    // 新增  
                    this.$api.limitShopAdd(this.ruleForm)
                    .then(res=>{
                      res.data.code == 200 ? ( this.$message.success(res.data.msg),( this.$router.push("./shopDiscount"))):(this.$api.error(res.data.msg))
                    })
                    .catch(res => {
                     this.$api.error();
                   }); 
              } 
            } else {
              return false;
            }
          });
        },
        // 新增时间段
        removeDomain(item) {
        var index = this.ruleForm.time.indexOf(item)
        if (index !== -1) {
          this.ruleForm.time.splice(index, 1)
        }
      },
      addDomain() {
        this.ruleForm.time.push({
          up_time:"",//开始时间
          down_time:"",//结束时间
          sale_price:0,// 时间段折扣价
        });
      },
      resetForm(formName) {
        this.$router.push("./shopDiscount")
      },
    //  移除商品
    del(index, data) {
        console.log(data[index].id)
        data.splice(index, 1);
    },
    blur_fl(){
         
    },
    check(){
        console.log(this.ruleForm.goods_state)
        if(this.ruleForm.goods_state == 0){
            // 特价
            if(this.ruleForm.discount_state == 0){
                // 商品
                this.goods_list_zk1 = []
                this.goods_list_zk  = []
                this.goods_list_tj1 = []
            }else if(this.discount_state == 1){
                // 分类
                this.goods_list_zk = []
                this.goods_list_tj  = []
                this.goods_list_zk1 = []
            }
        }else if(this.ruleForm.goods_state == 1){
            // 折扣
             if(this.ruleForm.discount_state == 0){
                // 商品
                this.goods_list_zk1 = []
                this.goods_list_tj1 = []
                this.goods_list_tj = []
            }else if(this.ruleForm.discount_state == 1){
                // 分类
                this.goods_list_tj = []
                this.goods_list_zk  = []
                this.goods_list_tj = []
            }
        }
    },
    // 统一修改折扣
    blur_zk(){
        if(this.price_zk-0>=100){
            this.price_zk = 100
        }else if(this.price_zk-0<=0){
            this.price_zk = 0
        }
    },
    price_all(){
        let zk = (100 - this.price_zk)/100;
        if(this.ruleForm.goods_state == 1){
            // 商品
            this.goods_list_zk.forEach((ele,index)=>{
                this.$set(ele,"id",ele.id)
                this.$set(ele,"name",ele.name)
                this.$set(ele,"title",ele.title)
                this.$set(ele,"thumb",ele.thumb)
                this.$set(ele,"amount",ele.amount)
                this.$set(ele,'discount',this.price_zk)
                this.$set(ele,'sale_price',(ele.price * zk).toFixed(2))
            })
                this.$set(this.goods_list_zk1,[])
        }else{
            // 分类
            this.goods_list_zk1.forEach((ele,index)=>{
                this.$set(ele,'id',ele.id)
                this.$set(ele,'title',ele.title)
                this.$set(ele,'discount',this.price_zk)
                this.$set(ele,'sale_price',(ele.price * zk).toFixed(2))
            }) 
                this.$set(this.goods_list_zk,[])
        }
        console.log(this.goods_list_zk)
        console.log(this.goods_list_zk1)
    },
    // 统一修改商品特价
    price_all_fl(){
        //特价指定 商品
        this.goods_list_tj.forEach((ele,index)=>{ 
            this.$set(ele,'id',ele.id)
            this.$set(ele,'name',ele.name)
            this.$set(ele,'title',ele.title)
            this.$set(ele,'thumb',ele.thumb)
            this.$set(ele,"amount",ele.amount)
            this.$set(ele,'sale_price',Number(Number(this.price_tj).toFixed(2)))
        }) 
        //特价指定 分类
        this.goods_list_tj1.forEach((ele,index)=>{
            this.$set(ele,"id",ele.id)
            this.$set(ele,"title",ele.title)
            this.$set(ele,"sale_price",Number(Number(this.price_tj).toFixed(2)))
        }) 
         console.log(this.goods_list_tj)
        console.log(this.goods_list_tj1)
    },
    // 添加商品
    add_goods(){
        this.goods_dialog = true
    },
    // 添加分类
    add_fl(){
        this.fl_dialog = true        
    },
    // 取消分类添加
    no_add(){
        this.fl_dialog = false
    },
    // 取消商品添加
    no_add_(){
        this.goods_dialog = false
    },
    // 添加分类
    add_fl_yes(){
        let type1 = this.ruleForm.discount_state
        let type2 = this.ruleForm.goods_state
        let newA = []
        this.type_list.forEach((ele,i)=>{
            this.sel_type_list.forEach((ele_,i_)=>{
                if(ele_ == ele.title){
                    this.$set(this.sel_type_list,{discount:0})
                    this.$set(this.sel_type_list,{sale_price:0})
                    this.$set(this.sel_type_list,{cate_id:ele.id})
                    this.$set(this.sel_type_list,{thumb:ele.thumb})
                    this.$set(this.sel_type_list,{name:ele.name})
                    this.$set(this.sel_type_list,{title:ele.title})
                    this.$set(this.sel_type_list,{amount:ele.amount})
                    this.$set(this.sel_type_list,{price:ele.price})
                    
                    ele.cate_id = ele.id
                    newA.push(ele)
                }
            })
        })
        if(type1 == 0 && type2 == 2){
            // 新增折扣分类
            this.goods_list_tj1 = newA
            this.goods_list_zk1  = []
        }else if(type1 == 1 && type2 == 2){
            // 新增特价分类
            this.goods_list_tj1 = []
            this.goods_list_zk1 = newA
        }
        this.fl_dialog = false
    },
    // 添加商品
    add_goods_list(){
        let type1 = this.ruleForm.discount_state
        let type2 = this.ruleForm.goods_state
        if(type1 == 0 && type2 == 1){
            // 新增 特价指定商品
            this.goods_list_tj = this.multipleSelection
            this.goods_list_zk  =  []
            this.goods_list_tj1 = []
            this.goods_list_zk1  =  []
        }
        if(type1 == 1 && type2 == 1){
           // 新增 折扣指定商品
            this.goods_list_zk = this.multipleSelection
            this.goods_list_tj = []
            this.goods_list_tj1 = []
            this.goods_list_zk1  =  []
        }
        if(type1 == 0 && type2 == 2){
            // 新增 特价指定分类
            this.goods_list_tj1 = this.multipleSelection
            this.goods_list_zk  =  []
            this.goods_list_tj = []
            this.goods_list_zk1  =  []
        }
        if(type1 == 1 && type2 == 2){
           // 新增 折扣指定分类
            this.goods_list_zk = []
            this.goods_list_tj = []
            this.goods_list_tj1 = []
            this.goods_list_zk1  =  this.multipleSelection
        }
        this.goods_dialog = false 

    },
    // 删除折扣商品列表
    del_goods(){
        this.goods_list_tj = []
        this.goods_list_tj1 = []
        this.goods_list_zk = []
        this.goods_list_zk1 = []
    },
    // 删除商品分类列表
    del_fl(){
        this.$api.limitProductDel({
           params:{
               id:'all_type'
           }
       }).then(res=>{
           if(res.data.code == 200){
               this.$message.success(res.data.msg)
                this.goods_list_tj = []
                this.goods_list_tj1 = []
                this.goods_list_zk = []
                this.goods_list_zk1 = []
           }else{
               this.$api.error(res.dara.msg)
           }
       })
       .catch(res=>{
           this.$api.error()
       })
    },
    // 查询
    search() {
        console.log(this.Page)
        this.getGoodsList_()
    },
    // 全选
    handleSelectionChange(val) {
        this.multipleSelection = val;
    },
    // 分页
    handleCurrentChange(e) {
        this.Page.pagenum = e;
        this.getGoodsList_(this.Page);
    },
    // 分页
    handleSizeChange(e) {
        this.Page.pagesize = e;
        this.getGoodsList_(this.Page);
    },
    }
}
</script>
 
<style lang="less" scoped>
.el-divider{
    background: teal;
}
.el-divider--horizontal{
    width:50%;
    margin:45px 25%;
}
.el-divider__text{
     color:teal;
 }
 .red{
     color: #ff5656;
     height: 20px;
     display: inline-block;
     font-size: 12px;
 }
 .gray{
     color:gray;
     display: inline-block;
     margin:0 5px;
 }

</style>