<template>
    <div>
      <!-- 面包屑导航区域 -->
      <!-- <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>您当前所在位置</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>会员卡管理</el-breadcrumb-item>
        <el-breadcrumb-item>积分明细</el-breadcrumb-item>
      </el-breadcrumb> -->
      <el-card>
        <el-row>
            <el-select v-model="queryInfo.type" clearable placeholder="选择类型" @change="this.getCardInfo" size="mini">
                <el-option
                  v-for="item in TypeOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
             </el-select>
             <el-date-picker
              v-model="seletTime"
              type="daterange"
              align="right"
              unlink-panels
              size="mini"
              :default-time="['00:00:00', '23:59:59']"
              value-format="timestamp"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :picker-options="pickerOptions"
              @change="timeChange">
            </el-date-picker>
             <el-select v-model="queryInfo.member_type" clearable placeholder="请选择" size="mini" >
                <el-option
                  v-for="item in memOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
             </el-select>
             <el-input placeholder="请输入内容" v-model="queryInfo.keyword" clearable size="mini">
                <el-button slot="append" @click="onsearch"  icon="el-icon-search"></el-button>
              </el-input>
        </el-row>
        <el-table :data="tableData"  border  style="width: 100%">
            <el-table-column label="操作类型">
              <template slot-scope="scope">
                <span v-if="scope.row.type == 1">购买积分</span>
                <span v-if="scope.row.type == 2">积分抵现</span>
                <span v-if="scope.row.type == 3">退款返积分</span>
                <span v-if="scope.row.type == 4">退款退积分</span>
                <span v-if="scope.row.type == 5">管理调整</span>
                <span v-if="scope.row.type == 6">积分消费</span>
              </template>
            </el-table-column>
            <el-table-column prop="card_number" label="会员卡号" ></el-table-column>
            <el-table-column prop="phone" label="会员手机号" ></el-table-column>
            <el-table-column prop="order_no" label="关联单号" ></el-table-column>
            <el-table-column prop="front_score" label="操作前积分" ></el-table-column>
            <el-table-column prop="score" label="积分变动" ></el-table-column>
            <el-table-column prop="rear_score" label="操作后积分" ></el-table-column>
            <el-table-column prop="note" label="备注" ></el-table-column>
            <el-table-column prop="OAddTime" label="操作时间" ></el-table-column>
        </el-table>
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="queryInfo.page"
          :page-sizes="[10, 20, 50, 100,]"
          :page-size="queryInfo.pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
        </el-pagination>
      </el-card>
    </div>
</template>

<script>
import { selectDate, seletTime, startTime, endTime } from '@/common/selectDate.js'
export default {
  data () {
    return {
      seletTime: seletTime, // 时间数组
      queryInfo: {
        type: '', // 选择类型
        // eslint-disable-next-line camelcase
        start_time: parseInt(startTime/1000),
        // eslint-disable-next-line camelcase
        end_time: parseInt(endTime/1000),
        // eslint-disable-next-line camelcase
        member_type: '', // 搜索条件
        keyword: '',
        page: 1,
        pagesize: 10
      },
      memOptions: [ // 会员卡号
        {
          value: 1,
          label: '会员卡号'
        },
        {
          value: 2,
          label: '会员手机号'
        }
      ],
      TypeOptions: [
        {
          value: 1,
          label: '购买送积分'
        },
        {
          value: 2,
          label: '积分抵现'
        },
        {
          value: 3,
          label: '退款返积分'
        },
        {
          value: 4,
          label: '退款退积分'
        },
        {
          value: 5,
          label: '管理调整'
        },
        {
          value: 6,
          label: '积分消费'
        }
      ],
      pickerOptions: {
        shortcuts:selectDate
      },
      total: 0, // 总条数
      tableData: [] // 积分记录列表
    }
  },
  created () {
    if (sessionStorage.getItem('mCardNum')) {
      // eslint-disable-next-line camelcase
      this.queryInfo.member_type = 1
      this.queryInfo.keyword = sessionStorage.getItem('mCardNum')
    }
    this.getCardInfo()
  },
  methods: {
    async getCardInfo () {
       const loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.1)'
      })
      // eslint-disable-next-line camelcase
      const { data: res } = await this.$http.post('mapi/memberScoreList', this.queryInfo)
      // console.log(res)
      if (res.code !== 200) return this.$message.error('查询积分失败！')
      // this.$message.success('查询积分成功！')
      loading.close()
      this.tableData = res.list.data
      this.queryInfo.page = res.list.current_page
      this.queryInfo.pagesize = res.list.per_page
      this.total = res.list.total
    },
    onsearch () {
      this.getCardInfo()
    },
    timeChange () {
        // eslint-disable-next-line camelcase
        this.queryInfo.start_time = parseInt(this.seletTime[0]/ 1000)
        // eslint-disable-next-line camelcase
        this.queryInfo.end_time =  parseInt(this.seletTime[1]/1000)
    },

    // 分页 一页显示多少条
    handleSizeChange (newSize) {
      this.queryInfo.pagesize = newSize
      this.getCardInfo()
    },
    // 分页 跳转到多少页
    handleCurrentChange (newPage) {
      this.queryInfo.page = newPage
      this.getCardInfo()
    }
  },
  destroyed () {
    console.log('页面destroyed')
    sessionStorage.removeItem('mCardNum')
  }
}
</script>

<style scoped lang="less">
.el-select{
  width:120px;
  margin-right: 10px;
  margin-bottom:10px;
}
.el-input{
  width:220px;
  margin-bottom:10px;
}
.el-date-editor{
  width: 230px;
  margin-right: 10px;
  margin-bottom:10px;
}
</style>
