
<template>
    <div>
        <el-row>
            <el-col :span="24">
                <el-card shadow="always">
                    <el-tabs v-model="activeName" type="card">
                        <el-tab-pane label="快递" name="1">
                            <el-table border="" :data="tableData" style="width: 100%" stripe>
                                <el-table-column label="选择周天" prop="oid">
                                    <template slot-scope="row">
                                        <el-select v-model="row.row.day" placeholder="请选择">
                                            <el-option
                                                v-for="(item,index) in options"
                                                :key="index"
                                                :label="item.label"
                                                :value="item.value"
                                            ></el-option>
                                        </el-select>
                                    </template>
                                </el-table-column>
                                <el-table-column label="是否晚上">
                                    <template slot-scope="row">
                                        <el-switch
                                            v-model="row.row.night"
                                            active-color="#008080"
                                            inactive-color="#ff4949"
                                            active-text="是"
                                            inactive-text="否"
                                        ></el-switch>
                                    </template>
                                </el-table-column>
                                <el-table-column label="开始时间">
                                    <template slot-scope="row">
                                        <el-time-select
                                            v-model="row.row.start_time"
                                            :picker-options="{
                                                               start: '00:00',
                                                               step: '00:15',
                                                               end: '23:59'
                                                             }"
                                            placeholder="选择时间"
                                            :clearable="false"
                                        ></el-time-select>
                                    </template>
                                </el-table-column>
                                <el-table-column label="结束时间">
                                    <template slot-scope="row">
                                        <el-time-select
                                            v-model="row.row.end_time"
                                            :picker-options="{
                                                               start: '08:30',
                                                               step: '00:15',
                                                               end: '18:30'
                                                             }"
                                            placeholder="选择时间"
                                            :clearable="false"
                                        ></el-time-select>
                                    </template>
                                </el-table-column>
                                   <el-table-column label="是否停用">
                                    <template slot-scope="row">
                                        <el-switch
                                            v-model="row.row.del"
                                            active-color="#008080"
                                            inactive-color="#ff4949"
                                            active-text="是"
                                            inactive-text="否"
                                        ></el-switch>
                                    </template>
                                </el-table-column>
                                <el-table-column label="操作" width="180">
                                    <template slot-scope="row">
                                        <el-button
                                            size="mini"
                                            type="danger"
                                            @click="oneditone(row)"
                                            v-no-click
                                        >删除</el-button>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </el-tab-pane>
                        <el-tab-pane label="自提" name="2">
                                <el-table border="" :data="tablelist" style="width: 100%" stripe>
                                <el-table-column label="选择周天" prop="oid">
                                    <template slot-scope="row">
                                        <el-select v-model="row.row.day" placeholder="请选择">
                                            <el-option
                                                v-for="(item,index) in options"
                                                :key="index"
                                                :label="item.label"
                                                :value="item.value"
                                            ></el-option>
                                        </el-select>
                                    </template>
                                </el-table-column>
                                <el-table-column label="是否晚上">
                                    <template slot-scope="row">
                                        <el-switch
                                            v-model="row.row.night"
                                            active-color="#008080"
                                            inactive-color="#ff4949"
                                            active-text="是"
                                            inactive-text="否"
                                        ></el-switch>
                                    </template>
                                </el-table-column>
                                <el-table-column label="开始时间">
                                    <template slot-scope="row">
                                        <el-time-select
                                            v-model="row.row.start_time"
                                            :picker-options="{
                                                               start: '00:00',
                                                               step: '00:15',
                                                               end: '23:59'
                                                             }"
                                            placeholder="选择时间"
                                            :clearable="false"
                                        ></el-time-select>
                                    </template>
                                </el-table-column>
                                <el-table-column label="结束时间">
                                    <template slot-scope="row">
                                        <el-time-select
                                            v-model="row.row.end_time"
                                            :picker-options="{
                                                               start: '08:30',
                                                               step: '00:15',
                                                               end: '18:30'
                                                             }"
                                            placeholder="选择时间"
                                            :clearable="false"
                                        ></el-time-select>
                                    </template>
                                </el-table-column>
                                  <el-table-column label="是否停用">
                                    <template slot-scope="row">
                                        <el-switch
                                            v-model="row.row.del"
                                            active-color="#008080"
                                            inactive-color="#ff4949"
                                            active-text="是"
                                            inactive-text="否"
                                        ></el-switch>
                                    </template>
                                </el-table-column>
                                <el-table-column label="操作" width="180">
                                    <template slot-scope="row">
                                        <el-button
                                            size="mini"
                                            type="danger"
                                            @click="oneditone(row)"
                                            v-no-click
                                        >删除</el-button>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </el-tab-pane>
                    </el-tabs>
                    <div class="height"></div>
                        <el-row>
                            <el-col>
                                  <el-button type="primary" @click="onaddlist()" size="mini">新增</el-button>
                                  <el-button type="primary" @click="onaddmenu()" size="mini">提交</el-button>
                            </el-col>
                            </el-row>
                </el-card>
            </el-col>
        </el-row>
    </div>
</template>
<script>
import _ from 'lodash'
export default {
  // props:[],
  // 页面加载
  // 组件注册
  components: {},
  created() {
    this.gettimeLineshop();
  },
  // 页面加载完成
  mounted() {},
  data() {
    return {
      activeName: "1",
      tableData: [],
      tablelist:[],
      options: [
        {
          value: "不限",
          label: "不限"
        },
        {
          value: "周一",
          label: "周一"
        },
        {
          value: "周二",
          label: "周二"
        },
        {
          value: "周三",
          label: "周三"
        },
        {
          value: "周四",
          label: "周四"
        },
        {
          value: "周五",
          label: "周五"
        },
        {
          value: "周六",
          label: "周六"
        },
        {
          value: "周日",
          label: "周日"
        }
      ]
    };
  },
  // 方法
  methods: {
    gettimeLineshop() {
      this.$api
        .gettimeLineshop({})
        .then(res => {
          if (res.data.code == 200) {
              res.data.list_one.time.forEach(x=>{
                     if(x.del){
                x.del=true
            }else{
                 x.del=false
            }
             if(x.night){
                x.night=true
            }else{
                 x.night=false
            }
              })
                 res.data.list_tow.time.forEach(x=>{
                     if(x.del){
                x.del=true
            }else{
                 x.del=false
            }
             if(x.night){
                x.night=true
            }else{
                 x.night=false
            }
              })
            this.tableData = res.data.list_one.time;
            this.tablelist = res.data.list_tow.time;
          } else {
            this.$message.error(res.data.msg);
          }
        })
        .catch(res => {
          this.$message.error("网络错误");
          console.log(res);
        });
    },
    onaddlist(){
        if(this.activeName==1){
            this.tableData.push({
                day:"不限",
                night:true,
                start_time:"12:00",
                end_time:"18:00",
                del:false
            })
        }else{
            this.tablelist.push({
                day:"不限",
                night:true,
                start_time:"12:00",
                end_time:"18:00",
                del:false
            })
        }
            
    },
    oneditone(row) {
          if(this.activeName==1){
                    this.tableData.splice(row.$index,1)
        }else{
            this.tablelist.splice(row.$index,1)
        }
    },
    onaddmenu(){
        let time=""
             if(this.activeName==1){
                   time = _.cloneDeep(this.tableData);
        }else{
             time = _.cloneDeep(this.tablelist);
        }
        if(time.length==0){
                 this.$message.error("请添加快递/自提时间限制");
            return 
        }
        time.forEach(x=>{
            if(x.del){
                x.del=1
            }else{
                 x.del=0
            }
             if(x.night){
                x.night=1
            }else{
                 x.night=0
            }
        })
        console.log(time);
         this.$api
        .gettimeLineshops({
            type:this.activeName,
            time:JSON.stringify(time)
        })
        .then(res => {
          if (res.data.code == 200) {
                 this.$message.success(res.data.msg);
                 this.gettimeLineshop();
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
</style>