<template>
    <div>
    
        <el-row>
            <el-col :span="24">
                <el-card shadow="always">
                      <el-row>
        <el-col :span="24">
          <el-select v-model="Page.type" placeholder="操作类型">
            <el-option v-for="item in memberBalanceRecord.types" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select> 
            <el-date-picker
         :disabled="Page.create_time!=10"
         :clearable="false"
      v-model="Page.times"
      type="daterange"
       value-format="timestamp"
      start-placeholder="开始日期"
      end-placeholder="结束日期"
     >
    </el-date-picker>
             <el-select v-model="Page.create_time" placeholder="时间选择">
            <el-option
              v-for="item in memberBalanceRecord.dateList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
    
            <el-input placeholder="请输入内容" v-model="Page.keyword" class="input-with-select">
            <el-button slot="append"   @click="onserch"   v-no-click>搜索</el-button>
          </el-input>
           <el-button type="danger" @click="onclear"   v-no-click>清除</el-button>
        </el-col>
      </el-row>
      <div class="height"></div>
 
                    <el-table border="" :data="tableData" style="width: 100%" stripe>
                        <el-table-column label="操作类型" prop="type">
                                <template slot-scope="row">
                                <div v-if="row.row.type==1">
                                    购买送积分
                                </div>
                                <div v-else-if="row.row.type==2">
                                    积分抵现
                                </div>
                                 <div v-else-if="row.row.type==3">
                                    退款返积分
                                </div>

                                 <div v-else-if="row.row.type==4">
                                    退款退积分
                                </div>
                                 <div v-else-if="row.row.type==5">
                                   管理调整
                                </div>
                                 <div v-else-if="row.row.type==6">
                                   积分消费
                                </div>
                            
                            </template>
                        </el-table-column>
                        <el-table-column label="会员id" prop="id"></el-table-column>
                        <el-table-column label="关联单号" prop="order_no"></el-table-column>
                        <!-- <el-table-column label="操作类型" prop="type">
                            <template slot-scope="row">
                                <div v-if="row.row.type==1">
                                    <el-tag effect="dark">充值</el-tag>
                                </div>
                                <div v-else-if="row.row.type==2">
                                    <el-tag type="success" effect="dark">消费</el-tag>
                                </div>
                            </template>
                        </el-table-column> -->
                        <el-table-column label="
操作前积分" prop="front_score"></el-table-column>
                        <el-table-column label="积分变动" prop="score"></el-table-column>
                        <el-table-column label="操作后积分" prop="rear_score" ></el-table-column>
                        <el-table-column label="操作时间" prop="OAddTime" ></el-table-column>
                        <el-table-column label="备注" prop="note" ></el-table-column>
                        
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
    </div>
</template>
<script>
import { memberBalanceRecord } from "@/common/select.js";
export default {
  // props:[],
  // 页面加载
  created() {
    this.getMemberupMoneyList();
  },
  // 页面加载完成
  mounted() {},
  data() {
    return {
        memberBalanceRecord,
      tableData: [],
      Page: {
        pagenum: 1,
        pagesize: 10,
        count: 0,
        type:'',
        create_time:"",
            times:"",
            keyword:"",
             start_time:"",
            end_time:""
      },
    };
  },
  // 方法
  methods: {
    getMemberupMoneyList() {
      this.$api
        .getMemberupScoreList(this.Page)
        .then(res => {
          if (res.data.code == 200) {
            this.tableData = res.data.list;
            this.Page.count = res.data.count;
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
      this.getMemberupMoneyList();
    },
    // 分页
    handleSizeChange(e) {
      this.Page.pagesize = e;
      this.getMemberupMoneyList();
    },
    // 点击了搜索
    onserch(){
      if (this.Page.times.length > 0 && this.Page.create_time == 10) {
        this.Page.start_time = this.Page.times[0] / 1000
        this.Page.end_time = this.Page.times[1] / 1000
      }
      if (this.Page.create_time == 10 && this.Page.times.length == 0) {
        this.$message.error('请选择自定义时间段')
        return
      }
          this.Page.pagenum = 1;
      this.Page.pagesize = 10;
        this.getMemberupMoneyList();

    },
    // 点击了清楚搜索
    onclear(){
      this.Page.pagenum=1
      this.Page.pagesize=10
      this.Page.type=""
      this.Page.create_time=""
      this.Page.times=""
      this.Page.keyword=""
      this.Page.start_time=""
      this.Page.end_time=""
         this.getMemberupMoneyList();
    
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
.el-select{
    margin-right: 10px;
}
.el-date-editor{
    margin-right: 10px;
}
.input-with-select{
    width:20%;
    margin-right: 10px;
}
</style>