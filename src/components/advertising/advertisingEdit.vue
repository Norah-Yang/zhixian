<template>
  <el-card>
    <el-row :gutter="5">
        <el-col :span="15">
            <el-form :model="ruleForm"  ref="ruleForm" label-width="150px" class="demo-ruleForm">
                <el-form-item  label="广告类型" prop="type">
                  <el-radio-group v-model="ruleForm.type">
                    <el-radio :label="1">文本</el-radio>
                    <el-radio :label="2">图片</el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item label="广告内容" style="width:40%" prop="intro" v-if='ruleForm.type == 1' >
                    <el-input type="textarea"  :rows="3" v-model="ruleForm.intro"></el-input>
                </el-form-item>
                <el-form-item label="图片上传" v-if='ruleForm.type == 2'>
                <el-upload
                    ref="upload"
                    :action="$uplaadUrl"
                    :file-list="files"
                    list-type="picture-card"
                    :limit="limit"
                    :headers="header"
                    :on-preview="handlePictureCardPreview"
                    :on-remove="handleRemove"
                    :on-success="handleAvatarSuccess"
                    :on-exceed="onexceed"
                    :before-upload="beforeUpload"
                    accept=".jpg, .png"
                >
                    <i class="el-icon-plus"></i>
                </el-upload>
                <div class="gray">大小建议(1366*768)</div>
                </el-form-item>
                <el-form-item label="管理店点" >
                    <el-checkbox  v-model="ruleForm.checkAll" @change="handleCheckAllChange">全选</el-checkbox>
                    <div style="margin: 15px 0;"></div>
                    <el-checkbox-group v-model="ruleForm.checkedCities" @change="handleCheckedCitiesChange">
                        <el-checkbox v-for="city in cities" :label="city" :key="city"   >{{city}}</el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
                <el-form-item label="管理收银机器" >
                    <el-checkbox   v-model="ruleForm.checkAll1" @change="handleCheckAllChange1">全选</el-checkbox>
                    <div style="margin: 15px 0;"></div>
                    <el-checkbox-group v-model="ruleForm.checkedCities1" @change="handleCheckedCitiesChange1">
                        <el-checkbox v-for="city in cities1" :label="city" :key="city">{{city}}</el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
                <el-form-item label="排序" prop="sort">
                    <el-input v-model="ruleForm.sort" type="number"></el-input>
                    <div class="gray">（默认排序从大到小）</div>
                </el-form-item>
                
                <el-form-item label="是否显示" prop="status">
                    <el-switch
                        v-model="ruleForm.status" 
                        active-color="#008080"  
                        active-text="是"
                        inactive-text="否" 
                        inactive-color="#ff4949"
                        :active-value="1"
                        :inactive-value="0"
                        >
                      </el-switch>
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
 const cityOptions1 = [];
export default {
    data(){
    return {
        id:"",
        cities: cityOptions,
        cities1: cityOptions1,
        arr:[],
        ruleForm: {
            checkedCities: [],
            checkedCities1: [],
            checkAll: false,
            checkAll1: false,
            type:1,
            shop_id:'',
            machine_id:'',
            intro:"",
            sort:0,
        },    
        files:[],
        limit:1,
        header: {
            Authorization: sessionStorage.getItem("token") || ""
        },
    }
   },
    created(){
      let id = this.$route.query.id
      this.id = id
      this.advertisingAddSetting()
      id ? ( this.advertisingUpdateSetting()) : id; 
    },
    methods:{//上传文件类型判断
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
      handleCheckAllChange(val) {
        this.ruleForm.checkedCities = val ? this.cities : [];
         if(val){
            this.ruleForm.checkedCities1 = this.cities1;
            this.ruleForm.checkAll1 = true
            
         }else{
            this.ruleForm.checkedCities1 = [];
            this.ruleForm.checkAll1 = false
         }
      },
      handleCheckedCitiesChange(value) {
        let checkedCount = value.length;
        let arr = []
        this.ruleForm.checkAll = checkedCount === this.cities.length;
        this.arr.forEach(ele=>{
           this.ruleForm.checkedCities.forEach(el=>{
             if(el == ele.title){
                 ele.machine.forEach(e=>{
                 e ? ( arr.push(e.machine)) :'';
               })
             }
           })
        })
        if(arr.length == this.cities1.length){
          this.ruleForm.checkAll1 = true
        }else{
          this.ruleForm.checkAll1 = false
        }
        this.ruleForm.checkedCities1 = arr
      },
      handleCheckAllChange1(val) {
        this.ruleForm.checkedCities1 = val ? this.cities1 : [];
        this.isIndeterminate1 = false;
      },
      handleCheckedCitiesChange1(value) {
        let checkedCount = value.length;
        this.ruleForm.checkAll1 = checkedCount === this.cities1.length;
        this.isIndeterminate1 = checkedCount > 0 && checkedCount < this.cities1.length;
      },
      // 修改查询
      advertisingUpdateSetting(){
          this.$api.advertisingUpdateSetting({
            params: {
              id:this.id
            }
          }).then(res=>{
              if(res.data.code == 200){
                let arr = [] ,arr1 = []
                res.data.arr.shop.forEach(ele=>{
                  arr.push(ele.title)
                  ele.machine.forEach(e=>{
                      arr1.push(e.machine)
                  })
                })
                this.arr = res.data.arr.shop
                this.cities = arr
                this.cities1 = arr1
                this.ruleForm.type = res.data.list.type
                this.ruleForm.intro = res.data.list.intro
                this.ruleForm.status = res.data.list.status
                this.ruleForm.sort = res.data.list.sort
                
                if(res.data.list.type == 1){
                   
                }else{
                  this.ruleForm.thumb = res.data.list.thumb
                }
                let a = res.data.list.machine_id.split(",")
                let c = [] , d = [];
                res.data.arr.shop.forEach((el)=>{
                  a.forEach((el_)=>{
                    if(el_ == el.id){
                      c.push(el.title)
                    }
                  })
                })
                this.ruleForm.checkedCities = c
                let b = res.data.list.shop_id.split(",")
                b.forEach((el)=>{
                  d.push(Number(el))
                })
                this.ruleForm.checkedCities1 = d
                 if(c.length  == arr.length){
                   this.ruleForm.checkAll = true
                 }else{
                    this.ruleForm.checkAll = false
                 }   
                 if(d.length  == arr1.length){
                   this.ruleForm.checkAll1 = true
                 }else{
                    this.ruleForm.checkAll1 = false
                 }  
                this.ruleForm.former_thumb=res.data.list.thumb
                if(res.data.list.thumb){
                  const obj = {
                  name: 'food2.jpeg',
                  url: res.data.list.thumb
                }
                this.files.push(obj)
               }
                
              }else{
              }
          })
          .catch(res=>{
          
          })
      },
      // 查询门店和机器
      advertisingAddSetting(){
          this.$api.advertisingAddSetting(this.id).then(res=>{
              if(res.data.code == 200){
                let arr = [] ,arr1 = []
                res.data.arr.shop.forEach(ele=>{
                  arr.push(ele.title)
                  ele.machine.forEach(e=>{
                      arr1.push(e.machine)
                  })
                })
                this.arr = res.data.arr.shop
                this.cities = arr
                this.cities1 = arr1
              }else{
              }
          })
          .catch(res=>{
          })
      },
      //   提交
      submitForm(formName) {
        this.ruleForm.shop_id = ''
        this.ruleForm.machine_id = ''
        this.ruleForm.checkedCities1 = Array.from(new Set(this.ruleForm.checkedCities1))
        this.ruleForm.checkedCities1.forEach((el,index)=>{
          if(this.ruleForm.shop_id != "0"){
            index == 0 ?(this.ruleForm.shop_id  += el):( el ? (this.ruleForm.shop_id  += (","+ el)):(""));
          }
        })
        this.ruleForm.machine_id = Array.from(new Set(this.ruleForm.machine_id))
        console.log(this.ruleForm.shop_id)
        this.ruleForm.checkedCities.forEach((el,index)=>{
           this.arr.forEach(e=>{
             if(this.ruleForm.machine_id){
               e.title == el ? (el ? (this.ruleForm.machine_id  += (","+ e.id)):("")):("");
             }else{
               e.title == el ? (
                index == 0 ?(this.ruleForm.machine_id  += e.id):( el ? (this.ruleForm.machine_id  += (","+ e.id)):(""))
              ):("");
             }
              
           })
        })
        this.ruleForm.machine_id = this.ruleForm.machine_id.substring(1)
        let obj = {
          intro: this.ruleForm.intro,
          machine_id: this.ruleForm.machine_id,
          shop_id: this.ruleForm.shop_id,
          sort: this.ruleForm.sort,
          status: this.ruleForm.status,
          type: this.ruleForm.type,
          thumb:this.ruleForm.thumb,
        }
        this.$refs[formName].validate((valid) => {
            if (valid) {
              let id = this.id
              if(id){
                Object.assign(obj,{id:id})
                  this.$api.advertisingUpdateSetting_(obj)
                  .then(res=>{
                      res.data.code == 200 ? ( this.$router.push("./advertising")):(this.$api.error(res.data.msg))
                  })
                  .catch(res => {
                  this.$api.error();
                  }); 
              }else{
                  this.$api.advertisingAddSettingAdd(obj)
                  .then(res=>{
                      res.data.code == 200 ? ( this.$router.push("./advertising")):(this.$api.error(res.data.msg))
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
        this.$refs['ruleForm'].resetFields()
      },
      //  轮播图上传
    onexceed(){
      this.$message.error("只能上传一张图片")
    },
    handleAvatarSuccess(e) {
      if (e.code == 200) {
       this.ruleForm.thumb = e.name
      }
    },
    handlePictureCardPreview(e) {
      this.imgVisible = true;
    },
    handleRemove(e) {
      this.ruleForm.thumb= ''
    },
  }
}
</script>
<style lang="less" scoped>
.gray{
  color:gray;
}
</style>