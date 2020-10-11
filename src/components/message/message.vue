<template>
  <el-card>
    <el-row :gutter="5" style="width:100%" v-if="recharge == 1">
        <el-col >
             <el-table
                    :data="ruleForm"
                    border
                    style="width: 100%">
                    <el-table-column
                    prop="name"
                    label="短信类型"
                    width="200">
                    </el-table-column>
                    <el-table-column
                    prop="num"
                    label="短信数量"
                    width="200">
                    </el-table-column>
                    <el-table-column label="查看" width="800">
                    <template slot-scope="scope">
                        <el-button
                        type="primary"
                        size="mini"
                        @click="recharge_(scope.$index, scope.row)" >充值</el-button>
                        <el-button
                        type="primary"
                        size="mini"
                        @click="rechargeRecord(scope.$index, scope.row)" >充值记录</el-button>
                        <el-button
                        type="primary"
                        size="mini"
                        @click="sentRecord(scope.$index, scope.row)" >发送记录</el-button>
                    </template>
                    </el-table-column>
                </el-table>
        </el-col>
    </el-row>
    <el-row v-if='recharge == 2'>
        <el-col>
            <el-form :model="ruleForm_list"  ref="ruleForm_list" label-width="100px" class="demo-ruleForm" v-if=' i== 0'>
                <el-page-header @back="goBack" content="普通短信"></el-page-header>
                <el-form-item  label="短信套餐">
                  <el-radio-group v-model="ruleForm_list.recharge_sel">
                    <el-radio :label="1">套餐一：短信优惠包 6000条 0.080元/条 ¥480</el-radio>
                    <el-radio :label="2">套餐二：短信特惠包 20000条 0.060元/条 ¥1200</el-radio>
                    <el-radio :label="3">套餐三：短信超值包 50000条 0.050元/条 ¥2500</el-radio>
                    <el-radio :label="4"> 套餐四：短信钻石包 100000条 0.048元/条 ¥4800</el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item  label="支付方式">
                  <el-radio-group v-model="ruleForm_list.recharge_pay">
                    <el-radio :label="1">微信</el-radio>
                    <el-radio :label="2">支付宝</el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="yes('ruleForm')">确认充值</el-button>
                    <el-button @click="no('ruleForm')">取消</el-button>
                </el-form-item>
            </el-form>
            <el-form :model="ruleForm_list"  ref="ruleForm_list" label-width="100px" class="demo-ruleForm" v-if='i==1'>
                <el-page-header @back="goBack" content="营销短信"></el-page-header>
                <el-form-item  label="短信套餐">
                  <el-radio-group v-model="ruleForm_list.recharge_sel">
                    <el-radio :label="1">套餐一：营销优惠包 5000条 0.096元/条 ¥480</el-radio>
                    <el-radio :label="2">套餐二：营销特惠包 16000条 0.075元/条 ¥1200</el-radio>
                    <el-radio :label="3">套餐三：营销超值包 42000条 0.0595元/条 ¥2500</el-radio>
                    <el-radio :label="4"> 套餐五：营销钻石包 88000条 0.054元/条 ¥4800</el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item  label="支付方式">
                  <el-radio-group v-model="ruleForm_list.recharge_pay">
                    <el-radio :label="1">微信</el-radio>
                    <el-radio :label="2">支付宝</el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="yes('ruleForm')">确认充值</el-button>
                    <el-button @click="no('ruleForm')">取消</el-button>
                </el-form-item>
            </el-form>
        </el-col>
    </el-row>

    <el-dialog  :visible="dialogVisible" width="25%" :show-close="false">
      <el-image :src="src" ></el-image>
      <span slot="footer" class="dialog-footer">
        <!-- <el-button @click="oncancel"   v-no-click>确 定</el-button> -->
        <el-button type="primary" @click="onconfirm"   v-no-click>确 定</el-button>
      </span>
    </el-dialog>
  </el-card>
</template>



<script>
export default {
     data(){
        return {
           ruleForm:[{"name":"普通短信",num:999},{"name":"营销短信",num:100}],
           ruleForm_list:{recharge_sel:1,recharge_pay:1},
           recharge:1,
           dialogVisible:false,
           src:"",
           i:"",
        }
    },
    created() {
    return
    this.getMesaage();
    },
    methods:{
         getMesaage(){
            this.$api
            .getMesaage(this.Page)
            .then(res => {
            if (res.data.code == 200) {
                this.$message.success("查询成功");
                this.ruleForm = res.data.ruleForm;
            } else {
                this.$api.error(res.data.msg);
            }
            })
            .catch(res => {
            console.log(res);
            this.$api.error();
            });
         },
        //  选套餐充值
         recharge_(i,el){
           this.recharge = 2; 
           this.i = i
         },
         rechargeRecord(i,el){
            this.$router.push({path:"./messageList",query:{ms_type:i,send_type:0}})
         },
         sentRecord(i,el){
            this.$router.push({path:"./messageList",query:{ms_type:i,send_type:1}})
         },
        // 充值
        yes(){
           this.dialogVisible = true
           this.src = "https://img.zhichiwangluo.com/15395985665bc468e663f8a.jpg"
        },
        no(){
           this.recharge = 1; 
           this.dialogVisible = false
        },
        goBack(){
           this.recharge = 1; 
           this.dialogVisible = false
        },
        oncancel(){
            this.dialogVisible = false
        },
        onconfirm(){
            this.dialogVisible = false
        },
    }
}
</script>

<style lang="less" scoped>
.el-radio{
    margin:12px 0 20px 0;
    display: block;
}
.el-page-header{
    margin-bottom: 50px;
}
</style>