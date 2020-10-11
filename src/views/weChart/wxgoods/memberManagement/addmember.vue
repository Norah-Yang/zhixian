<template>
    <div>
        <el-row>
            <el-col :span="24">
                <el-card shadow="always">
                    <el-form :model="ruleForm" :rules="rules" ref="ruleForms" label-width="130px">
                        <el-form-item label="会员昵称">
                            <el-input v-model="ruleForm.member_name" placeholder="会员昵称" disabled></el-input>
                        </el-form-item>
                        <el-form-item label="手机号" prop="phone">
                            <el-input v-model="ruleForm.phone" placeholder="手机号" disabled></el-input>
                        </el-form-item>
                        <el-form-item label="会员等级" prop="grade">
                            <el-input v-model="ruleForm.grade" placeholder="会员等级" type="number"></el-input>
                        </el-form-item>
                        <el-form-item label="会员积分">
                            <el-input v-model="ruleForm.score" placeholder="会员积分" disabled></el-input>
                        </el-form-item>
                        <el-form-item label="性别">
                            <el-radio v-model="ruleForm.gender" label="0">男</el-radio>
                            <el-radio v-model="ruleForm.gender" label="1">女</el-radio>
                            <el-radio v-model="ruleForm.gender" label="2">未知</el-radio>
                        </el-form-item>
                        <el-form-item label="真实姓名">
                            <el-input v-model="ruleForm.name" placeholder="真实姓名" ></el-input>
                        </el-form-item>
                        <el-form-item label="生日">
                            <el-date-picker
                                v-model="ruleForm.birthday"
                                align="right"
                                type="date"
                                placeholder="选择日期"
                                format="yyyy 年 MM 月 dd 日"
                                value-format="timestamp"
                            ></el-date-picker>
                        </el-form-item>
                        <el-form-item label="备注">
                            <el-input
                                type="textarea"
                                :rows="3"
                                placeholder="请输入备注"
                                v-model="ruleForm.remark"
                            ></el-input>
                        </el-form-item>
                           <el-form-item >
                                 <el-button type="primary" @click="onsubmit">提交</el-button>
                        </el-form-item>
                    </el-form>
                </el-card>
            </el-col>
        </el-row>
    </div>
</template>
<script>
import {isnumber }from "@/utils/validtel.js"
// export let validtel=(rule, value, callback) => {

export default {
  // props:[],
  // 页面加载
  created() {
    // 判断是添加还是删除 根据传过来的id判断
    if (this.$route.params.id) {
      sessionStorage.setItem("addmembers_id", this.$route.params.id);
    }
    if (this.$route.params.id || sessionStorage.getItem("addmembers_id")) {
      this.isedit = true;
      this.ruleForm.id =
        this.$route.params.id || sessionStorage.getItem("addmembers_id");
      this.getMemberupdetailSearch();
    }
  },
  // 页面加载完成
  mounted() {},
  data() {
    return {
      isedit: false,
      ruleForm: {
        name: "",
        id: "",
        phone: "",
        score: "",
        grade: "",
        gender: "1",
        remark: "",
        birthday: ""
      },
      rules: {
          grade:[
               { validator: isnumber, trigger: 'blur' },
               { required: true, message: '请输入会员等级', trigger: 'blur' },
          ]
      }
    };
  },
  // 方法
  methods: {
    getMemberupdetailSearch() {
      this.$api
        .getMemberupdetailSearch({
          id: this.ruleForm.id
        })
        .then(res => {
          if (res.data.code == 200) {
            // this.tableData = res.data.list;
            // this.Page.count = res.data.count;
            this.ruleForm.name=res.data.member.name
            this.ruleForm.phone=res.data.member.phone
            this.ruleForm.score=res.data.member.score
            this.ruleForm.grade=res.data.member.grade
            if(res.data.member.gender){
            this.ruleForm.gender=res.data.member.gender+""
            }
           this.ruleForm.remark=res.data.member.remark
           if(res.data.member.birthday){
                this.ruleForm.birthday=res.data.member.birthday*1000
           }
          } else {
            this.$message.error(res.data.msg);
          }
        })
        .catch(res => {
          this.$message.error("网络错误");
          console.log(res);
        });
    },
    onsubmit(){
      this.$refs.ruleForms.validate((valid) => {
          if (!valid) return 
      this.$api
        .getMemberupdetailUpdate(this.ruleForm)
        .then(res => {
          if (res.data.code == 200) {
           this.$message.success(res.data.msg);
           this.$router.push("/memberManagement")
          } else {
            this.$message.error(res.data.msg);
          }
        })
        .catch(res => {
          this.$message.error("网络错误");
          console.log(res);
        });

    }
      )}
  },
  // 监听属性
  watch: {},
  // 组件
  component: {},
  // 计算属性
  computed: {},
   beforeDestroy(){
    sessionStorage.removeItem("addmembers_id")
  }
};
</script>

<style lang="less" scoped>
</style>