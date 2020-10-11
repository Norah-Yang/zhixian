<template>
    <div>
        <el-row>
            <el-col :span="24">
            <el-card shadow="always">
            <el-row>
            <el-col :span="20">
                <el-select v-model="Page.num" multiple placeholder="会员标签" size="mini">
                <el-option
                  v-for="(item,index) in labels"
                  :key="index"
                  :label="item.member_label"
                  :value="item.id"
                ></el-option>
              </el-select>
              <el-select v-model="Page.type" placeholder="请选择"  size="mini">
                <el-option
                  v-for="(item,index) in attributetemplate.memberManagement"
                  :key="index"
                  :label="item.name"
                  :value="item.type"
                ></el-option>
              </el-select>
              <el-input
                placeholder="请输入内容"
                v-model="Page.key"
                class="input-with-select"
                size="mini"
              >
                <el-button slot="append" icon="el-icon-search" @click="onserch"></el-button>
              </el-input>
              <el-button type="danger" @click="onclears"  size="mini">清除搜索</el-button>
            </el-col>
            <el-col :span="4" style="text-align: right;">
              <el-button type="primary" @click="onaddClass"  size="mini">新建标签</el-button>
            </el-col>
          </el-row>
          <div class="height"></div>
      
            <el-row>
                <el-col>
                <el-select v-model="ruleForm.num" multiple placeholder="打标签"  size="mini">
                <el-option
                  v-for="(item,index) in labels"
                  :key="index"
                  :label="item.member_label"
                  :value="item.id"
                ></el-option>
              </el-select>
                <el-button type="primary" @click="onsubmit"  size="mini">确定</el-button>
                         <!-- <el-button-group>
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
                        <el-button size="mini" type="primary" icon="el-icon-circle-plus" @click="onaddgoods"   v-no-click>新增</el-button>
                        <el-button size="mini" type="primary" icon="el-icon-circle-check" @click="onaddgoods"   v-no-click>确定</el-button>
                    </el-button-group> -->
                </el-col>
            </el-row>
  <div class="height"></div>

                    <el-table border="" :data="tableData" style="width: 100%" stripe    @selection-change="handleSelectionChange">
                        <el-table-column type="selection" width="55"></el-table-column>
                        <el-table-column label="会员ID" prop="id"></el-table-column>
                        <el-table-column label="会员名" prop="member_name">
                            <template slot-scope="row">
                                <div>{{row.row.member_name}}</div>
                                <el-tag
                                    type="success"
                                    effect="dark"
                                    size="mini"
                                    v-for="(item,index) in row.row.label"
                                    :key="index"
                                >{{item.label}}</el-tag>
                            </template>
                            <!-- label -->
                        </el-table-column>
                        <el-table-column label="真实姓名" prop="name"></el-table-column>
                        <el-table-column label="手机号" prop="phone"></el-table-column>
                        <el-table-column label="会员卡情况" width="180">
                            <template slot-scope="row">
                                <div>卡：{{row.row.detail.number}}张 查看会员卡</div>
                                <div>累计消费：{{row.row.detail.sale_amount}}</div>
                                <div>累计储值：{{row.row.detail.income_amount}}</div>
                                <div>余额合计：{{row.row.detail.balance_amount}}</div>
                            </template>
                        </el-table-column>
                        <el-table-column label="等级" prop="grade"></el-table-column>
                        <el-table-column label="余额" prop="balance"></el-table-column>
                        <el-table-column label="积分" prop="score"></el-table-column>
                        <el-table-column label="是否关注" prop="score">
                            <template slot-scope="row">
                                <div v-if="row.row.attention_state==1">是</div>
                                <div v-else>否</div>
                            </template>
                        </el-table-column>
                        <!-- member_state -->
                         <el-table-column label="是否禁用" prop="score">
                            <template slot-scope="row">
                                  <el-switch
                                    v-model="row.row.member_state"
                                    active-color="#008080"
                                    inactive-color="#ff4949"
                                    :active-value="0"
                                    :inactive-value="1"
                                    active-text="是"
                                    inactive-text="否"
                                    @change="onswitchType(row)"
                                ></el-switch>
                            </template>
                        </el-table-column>
                        <el-table-column label="创建时间" prop="add_time"></el-table-column>
                        <el-table-column label="操作" width="180">
                            <template slot-scope="row">
                                <!-- <el-button size="small" type="primary" @click="onaddClass(row)">添加</el-button> -->
                                <el-button
                                    size="mini"
                                    type="info"
                                    @click="oneditone(row)"
                                    v-no-click
                                >编辑</el-button>
                                    <el-button
                                    size="mini"
                                    type="info"
                                    @click="oneaddress(row)"
                                    v-no-click
                                >会员地址</el-button>
                              
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
         <el-dialog title="新建标签" :visible="dialogVisible" width="50%" :show-close="false" :close-on-click-modal="false" :close-on-press-escape="false">

                  <el-form :model="ruleForm1" :rules="rule1" ref="ruleForms" label-width="130px">
                        <el-form-item label="会员标签" prop="member_label">
                            <el-input v-model="ruleForm1.member_label" placeholder="会员标签" ></el-input>
                        </el-form-item>
                  </el-form>
                    <!-- labelList -->
                    <el-tag v-for="(item,index) in labelList" :key="index">{{item.member_label}}</el-tag>
      <span slot="footer" class="dialog-footer">
        <el-button @click="oncancel" v-no-click>取 消</el-button>
        <el-button type="primary" @click="onconfirm" v-no-click>确 定</el-button>
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
    this.getwxmanage();
    this.getMemberupLabelSearchss()
  },
  // 页面加载完成
  mounted() {},
  data() {
    return {
        dialogVisible:false,
        attributetemplate,
      tableData: [],
      labels:[],
      Page: {
        pagenum: 1,
        pagesize: 10,
        count: 0,
        key:"",
        type:"",
        num:"",
        label:""
      },
      ruleForm1:{
          member_label:""
      },
      ruleForm:{
            label:"",
            num:"",
            id:""
      },
        rule1: {
          member_label:[
               { required: true, message: '请输入会员标签', trigger: 'blur' },
          ]
      },
      labelList:[]
    };
  },
  // 方法
  methods: {
      getMemberupLabelSearchss(){
        this.$api
        .getMemberupLabelSearchss()
        .then(res => {
          if (res.data.code == 200) {
        //    console.log(res.data.label);
           this.labels=res.data.label
          } else {
            this.$message.error(res.data.msg);
          }
        })
        .catch(res => {
          this.$message.error("网络错误");
          console.log(res);
        });
      },
    getwxmanage() {
      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.1)'
      })
      this.$api
        .getwxmanage(this.Page)
        .then(res => {
          if (res.data.code == 200) {
            // res.data.list.forEach(x=>{
            //         if(x.member_state==0){
            //             x.member_state=true
            //         }else{
            //             x.member_state=false
            //         }
                    
            // })
            // console.log(res);
            loading.close()
            this.tableData = res.data.list;
            this.Page.count = res.data.count;

            // console.log(res.data);
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
      this.getwxmanage();
    },
    // 分页
    handleSizeChange(e) {
      this.Page.pagesize = e;
      this.getwxmanage();
    },
    // 点击了编辑
    oneditone(row){
          this.$router.push({name:"addmember", params:{
            id:row.row.id
          }})
    },
    // 禁用启用切换状态
    onswitchType(row){
            // console.log(row.row.member_state);
            // let member_state=""
            // if(row.row.member_state==true){
            //         member_state=0
            // }else{
            //     member_state=1
            // }
            
        this.$api
        .getMemberupmemberDel({
            id:row.row.id,
            member_state:row.row.member_state
        })
        .then(res => {
          if (res.data.code == 200) {
                 this.$message.success(res.data.msg);
                 this.getwxmanage();
          } else {
            this.$message.error(res.data.msg);
          }
        })
        .catch(res => {
          this.$message.error("网络错误");
          console.log(res);
        });
    },
    // 点击了新建标签
    onaddClass(){
                this.dialogVisible=true
                
                  this.$api
        .getMemberupLabelSearch({})
        .then(res => {
          if (res.data.code == 200) {
                this.labelList=res.data.label
          } else {
            this.$message.error(res.data.msg);
          }
        })
        .catch(res => {
          this.$message.error("网络错误");
          console.log(res);
        });
    },
    // 点击了确定
    onconfirm(){
   this.$refs.ruleForms.validate((valid) => {
          if (!valid) return 
          
                     this.$api
        .getMemberupLabel(this.ruleForm1)
        .then(res => {
          if (res.data.code == 200) {
               this.$message.success(res.data.msg);
          } else {
            this.$message.error(res.data.msg);
          }
        })
        .catch(res => {
          this.$message.error("网络错误");
          console.log(res);
        });
   })
    },
    // 点击了取消
    oncancel(){
           this.$refs.ruleForms.resetFields();
  this.ruleForm1.member_label=""
               this.dialogVisible=false
    },
    // 点击了会员地址
    oneaddress(row){
         this.$router.push( {name:"addaddress", params:{
            id:row.row.id,
            user_id:row.row.user_id

          }})
        
    },
    onserch(){
                if(this.Page.num.length>0){
                    this.Page.label=this.Page.num.join(",")
                }
                    this.Page.pagenum = 1;
      this.Page.pagesize = 10;
                 this.getwxmanage();
    },
    // 点击了清楚搜索
    onclears(){
        this.Page.pagenum=1
        this.Page.pagesize=10
        this.Page.key=""
        this.Page.type=""
        this.Page.label=""
        this.Page.num=[]
      

         this.getwxmanage();
    },
    handleSelectionChange(e){
        this.ruleForm.id=e.map(x=>{
            return x.id
        })
     
    },
    onsubmit(){
        if(this.ruleForm.num.length>0){
                this.ruleForm.label=this.ruleForm.num.join(",")
        }else{
            this.$message.error("请至少选择一个标签");
              return
        }
           if(this.ruleForm.id.length>0){
            this.ruleForm.id=this.ruleForm.id.join(",")
        }else{
            this.$message.error("请至少选择一个会员"); 
            return

        }
                     this.$api
        .getMemberupLabelAdd(this.ruleForm)
        .then(res => {
          if (res.data.code == 200) {
              this.ruleForm.num=[]
              this.ruleForm.id=[]
               this.$message.success(res.data.msg);
                  this.getwxmanage();
          } else {
            this.$message.error(res.data.msg);
          }
        })
        .catch(res => {
          this.$message.error("网络错误");
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
.el-tag{
    margin: 0 5px 5px 0;
}
.input-with-select {
  width: 25%;
  margin: 0 10px;
  margin-left: 0;
}
.el-select{
    margin-right: 10px;
}
</style>