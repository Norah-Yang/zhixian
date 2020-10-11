<template>
  <el-card>
    <el-row :gutter="5">
        <el-col :span="15">
            <el-form :model="ruleForm"  ref="ruleForm" label-width="150px" class="demo-ruleForm">
                <el-form-item label="退款原因" prop="intro">
                    <el-input v-model="ruleForm.intro"></el-input>
                </el-form-item>
                <el-form-item label="管理站点" >
                    <el-checkbox :indeterminate="isIndeterminate" v-model="ruleForm.checkAll" @change="handleCheckAllChange">店铺全选</el-checkbox>
                    <div style="margin: 15px 0;"></div>
                    <el-checkbox-group v-model="ruleForm.checkedCities" @change="handleCheckedCitiesChange">
                        <el-checkbox v-for="city in cities" :label="city" :key="city">{{city}}</el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="submitForm('ruleForm')" size="mini">保存</el-button>
                    <el-button @click="resetForm('ruleForm')" size="mini">重置</el-button>
                </el-form-item>
            </el-form>

        </el-col>
    </el-row>
  </el-card>

  
</template>

<script>
 const cityOptions = [];
export default {
    data(){
    return {
        cities: cityOptions,
        isIndeterminate: true,
        id:"",
        ruleForm: {
            checkedCities: [],
            checkAll: false,
            intro:'',
        },    
    }
   },
    created(){
      let id = this.$route.query.id;
      this.id = id
      this.advertisingAddSetting()
      id ? ( this.refundUpdateSetting()) : id;
          
    },
    methods:{
      async  advertisingAddSetting(){
        this.$api.advertisingAddSetting()
          .then(res=>{
            let n = []
            this.shop = res.data.arr.shop
            res.data.arr.shop.forEach((el)=>{
              n.push(el.title)
            })
            this.cities = n
          })
          .catch(res => {
        }); 
      },
      handleCheckAllChange(val) {
        this.ruleForm.checkedCities = val ? this.cities : [];
        this.isIndeterminate = false;
      },
      handleCheckedCitiesChange(value) {
        let checkedCount = value.length;
        this.ruleForm.checkAll = checkedCount === this.cities.length;
        this.isIndeterminate = checkedCount > 0 && checkedCount < this.cities.length;
      },
      //   查询
      async refundUpdateSetting(){
          this.$api.refundUpdateSetting({
           params: {
            id: this.id,
          }
          }).then(res=>{
            if(res.data.code == 200){
              this.ruleForm.intro = res.data.list.intro
              let n = res.data.list.shop_id.split(',');
              let m = [];
              // console.log(this.shop)
              // console.log(n)
              this.shop.forEach(el=>{
                n.forEach(el_=>{
                  if(el_ == el.id){
                    m.push(el.title)
                  }
                })
              })
              // console.log(m)
              this.ruleForm.checkedCities = m
            }else{
              this.$api.error(res.data.msg)
            }
          })
          .catch(res=>{
              
          })
      },
      //   提交
      submitForm(formName) {
        let m = [] , M = '';
        this.shop.forEach((el)=>{
           this.ruleForm.checkedCities.forEach((el_)=>{
             if(el_ == el.title){
               m.push(el.id)
             }
           })
        })
        m.forEach((ele,index)=>{
          if(index == 0){
            M +=ele
          }else{
            M +=(","+ele)
          }
        })
        let n = {
          intro:this.ruleForm.intro,
          shop_id:M
        }
          this.$refs[formName].validate((valid) => {
            if (valid) {
              let id = this.id
              if(id){
                   n.id = id
                  this.$api.refundUpdateSetting_(n)
                  .then(res=>{
                      res.data.code == 200 ? ( this.$router.push("./refund")):(this.$api.error(res.data.msg))
                  })
                  .catch(res => {
                  this.$api.error();
                  }); 
              }else{
                  this.$api.refundAddSetting(n)
                  .then(res=>{
                      res.data.code == 200 ? ( this.$router.push("./refund")):(this.$api.error(res.data.msg))
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
      // 重置
      resetForm(formName) {
        this.ruleForm.checkedCities = []
        this.ruleForm.checkAll = false
        this.isIndeterminate = true,
        this.$refs['ruleForm'].resetFields()
      },
  }
}
</script>
<style lang="less" scoped>

</style>