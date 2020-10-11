# 京鱼鲜生

#### 介绍
{**以下是码云平台说明，您可以替换此简介**
码云是 OSCHINA 推出的基于 Git 的代码托管平台（同时支持 SVN）。专为开发者提供稳定、高效、安全的云端软件开发协作平台
无论是个人、团队、或是企业，都能够用码云实现代码托管、项目管理、协作开发。企业项目请看 [https://gitee.com/enterprises](https://gitee.com/enterprises)}

#### 软件架构
软件架构说明


#### 安装教程

1.  xxxx
2.  xxxx
3.  xxxx

#### 使用说明

1.  xxxx
2.  xxxx
3.  xxxx

#### 参与贡献

1.  Fork 本仓库
2.  新建 Feat_xxx 分支
3.  提交代码
4.  新建 Pull Request


#### 码云特技

1.  使用 Readme\_XXX.md 来支持不同的语言，例如 Readme\_en.md, Readme\_zh.md
2.  码云官方博客 [blog.gitee.com](https://blog.gitee.com)
3.  你可以 [https://gitee.com/explore](https://gitee.com/explore) 这个地址来了解码云上的优秀开源项目
4.  [GVP](https://gitee.com/gvp) 全称是码云最有价值开源项目，是码云综合评定出的优秀开源项目
5.  码云官方提供的使用手册 [https://gitee.com/help](https://gitee.com/help)
6.  码云封面人物是一档用来展示码云会员风采的栏目 [https://gitee.com/gitee-stars/](https://gitee.com/gitee-stars/)


http://983040.yunguos.cn/manager/index/index  密码123456

#### 
this.$message.error(res.msg)
this.$message.success('登陆成功')
<template>
    <div>121</div>
</template>
<script>
export default {
    // props:[],
    // 页面加载
    created(){


    },
    // 页面加载完成
    mounted(){
    
    },
    //实例销毁之前
      beforeDestroy(){
  },
    //实例销毁后
         destroyed(){
            }
    data(){
        return{
    
        }
    },
    // 方法
    methods:{
    
    },
    // 监听属性
    watch:{
    
    },
    // 组件
    component:{
    
    },
    // 计算属性
    computed: {
        
    },

}
</script>

<style lang="less" scoped>


</style>


#### 软件架构

js函数变量声明规则  get开头函数 是调取后端数据 on开头函数是事件监听函数 
变量声明规则 is开头变量是个布尔值  data开头或者结尾是一个对象  list开头或者结尾是一个数组
css声明 .list 是左边的div或者盒子 .right是右边的盒子 wapper是最外层的div
api接口封装在 API/http.js文件夹中  js/mainmodel.js是拆分main.js代码   js/dev.js是判断开发模式还是线上模式
// 完全空白的项目初 始化
// #git初始化
// git init
// #设置remote地址
// git remote add 地址
// #将全部文件加入git版本管理 .的意思是将当前文件夹下的全部文件放到版本管理中
// git add .
// #提交文件 使用-m 编写注释
// git commit -m "注释"
// #推送到远程分支
// git push



// 已有线上仓库的初始化
// #git初始化
// git init
// #设置remote地址
// git remote add  origin 地址
// #获取远程仓库master分支上的内容
// git pull origin master
// #将当前分支设置为远程仓库的master分支
// git branch --set-upstream-to=origin/master master
// #将全部文件加入git版本管理 .的意思是将当前文件夹下的全部文件放到版本管理中
// git add .
// #提交文件 使用-m 编写注释
// git commit -m "注释"
// #推送到远程分支
// git push

// 4、把远程分支拉到本地

// git fetch origin dev（dev为远程仓库的分支名）可以把远程的分支拉取到本地

// 下图红色勾选的为可使用的分支名
// 5、在本地创建分支dev并切换到该分支

// git checkout -b dev(本地分支名称) origin/dev(远程分支名称)


// 6、把某个分支上的内容都拉取到本地

// git pull origin dev(远程分支名称)




页面开发规范  page:{}包含后端要的页数和条数 数据总数
    saelect:{}包含页面要的下拉菜单数组
    tabledata:[]数组包含摆个要的数据
    roluefrom是表单的数据




<!-- 模板 -->

<template>
  <div>
    <el-row>
      <el-col :span="24">
        <el-card shadow="always">
          <el-table border="" :data="tableData" style="width: 100%" stripe>
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column label="订单ID" prop="oid"></el-table-column>
            <el-table-column label="订单号" prop="order_no" width="180"></el-table-column>
            <el-table-column label="订单类型" prop="type">
              <template slot-scope="row">
                <div v-if="row.row.type==0">
                  <el-tag effect="dark">会员充值</el-tag>
                </div>
                <div v-else-if="row.row.type==1">
                  <el-tag type="success" effect="dark">普通商品</el-tag>
                </div>
                <div v-else-if="row.row.type==2">
                  <el-tag type="info" effect="dark">秒杀商品</el-tag>
                </div>
                <div v-else-if="row.row.type==3">
                  <el-tag type="warning" effect="dark">团购商品</el-tag>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="订单状态" prop="pay_state">
              <template slot-scope="row">
                <div v-if="row.row.pay_state==0">未支付</div>
                <div v-else>已支付</div>
              </template>
            </el-table-column>
            <el-table-column label="支付方式" prop="pay_type">
              <template slot-scope="row">
                <div v-if="row.row.pay_state==1">微信支付</div>
                <div v-else>余额</div>
              </template>
            </el-table-column>
            <el-table-column label="发货方式" prop="send_type">
              <!-- <template slot-scope="row">
                <el-switch
                  v-model="row.row.value"
                  active-color="#008080"
                  inactive-color="#ff4949"
                  active-text="是"
                  inactive-text="否"
                  @change="onswitchType(row)"
                ></el-switch>
              </template>-->
            </el-table-column>
            <el-table-column label="下单时间" prop="add_time" width="180">
              <template slot-scope="row">
                {{row.row.add_time}}
                <!-- <div>{{1589872226|datefmt("YYYY-MM-DD HH:mm:ss")}}</div> -->
              </template>
            </el-table-column>
            <el-table-column label="买家姓名" prop="user_name"></el-table-column>
            <el-table-column label="买家手机" prop="phone"></el-table-column>
            <el-table-column label="实收金额" prop="money"></el-table-column>
            <el-table-column label="来源渠道" prop="sources"></el-table-column>
            <el-table-column label="操作" width="180">
              <template slot-scope="row">
                <!-- <el-button size="small" type="primary" @click="onaddClass(row)">添加</el-button> -->
                <el-button size="small" type="info" @click="oneditone(row)" v-no-click>编辑</el-button>
                <el-button size="small" type="danger" @click="ondelGoods(row)" v-no-click>删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <div class="height"></div>
          <div class="pagination">
            <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :page-sizes="[7, 12, 15, 20]"
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
export default {
  // props:[],
  // 页面加载
   components: {},
  created() {
    this.getweiOrder();
  },
  // 页面加载完成
  mounted() {},
  data() {
    return {
      tableData: [],
      Page: {
        pagenum: 1,
        pagesize: 10,
        count: 0
      }
    };
  },
  // 方法
  methods: {
    getweiOrder() {
      this.$api
        .getweiOrder(this.Page)
        .then(res => {
          if (res.data.code == 200) {
            this.$message.success(res.data.msg);
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
      this.getweiOrder();
    },
    // 分页
    handleSizeChange(e) {
      this.Page.pagesize = e;
      this.getweiOrder();
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
<!-- -----------------------------------------对话框------------------------------------------------------------ -->
 <el-dialog title="商品列表" :visible="dialogVisible" width="50%" :show-close="false" :close-on-click-modal="false" :close-on-press-escape="false">
      <span slot="footer" class="dialog-footer">
        <el-button @click="oncancel" v-no-click>取 消</el-button>
        <el-button type="primary" @click="onconfirm" v-no-click>确 定</el-button>
      </span>
    </el-dialog>