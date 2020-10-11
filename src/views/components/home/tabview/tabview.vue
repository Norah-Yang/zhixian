<template>
    <!-- 右侧header头部组件 -->
    <div class="tab_wapper">
        <!-- <happy-scroll  color="rgba(0,0,0,0.5)" size="5" resize> -->
        <!-- <div style=" display: flex;"> -->
        <div class="tab_wapper_ul">
            <div class="tab_wapper_item" v-for=" (item,i) in tabview[index]" :key="i">
                <router-link :to="item.path" >
                    <span @click="openmenu(item.path)">
                    <i :class="['iconfont',item.icon,'icon_font']"></i>
                    {{item.title}}
                    <i
                        class="iconfont icon-guanbiXhao close"
                        @click.stop.prevent="onclose(i)"
                    ></i>
                    </span>
                </router-link>
            </div>
            <div class="tab_wapper_item" v-show="tabview[index].length==0">
                <span @click="onhome">
                    <i class="iconfont icon-shouye icon_font"></i>
                    首页
                </span>
            </div>
            <!-- <li class="tab_wapper_item">
                <router-link to="/"> <i class="iconfont icon-jiaose"></i>首页  <i class="iconfont icon-jiaose"></i></router-link>
            </li>-->
            <!-- </div> -->
        </div>
        <!-- </happy-scroll> -->
    </div>
</template>
<script>
import { mapState } from "vuex";
import { log } from 'util';
export default {
  props: {
  
  },
  // 页面加载
  created() {},
  // 页面加载完成
  mounted() {
  },
  data() {
    return {};
  },
  // 方法
  methods: {
    onclose(i) {
      this.tabview[this.index].splice(i, 1);
    },
    openmenu(path){
         this.$emit("onclose",path)
    },
    onhome(){

      this.$emit("onhome")
    }
  },
  // 监听属性
  watch: {},
  // 组件
  component: {},
  // 计算属性
  computed: {
    ...mapState(["tabview","index"])
  }
};
</script>
<style lang="less" scoped>
.tab_wapper {
  background-color: #fff;
  padding: 7px;
  margin-bottom: 10px;
  .tab_wapper_ul {
    width: 100%;
    display: flex;
    flex-wrap: nowrap;
    overflow: hidden;
    .tab_wapper_item {
      padding:2px 5px;
      border-radius: 3px;
      margin-right: 10px;
      background-color: #008080;
      width: auto;
      flex: none;
      span {
        color: #fff;
        font-size: 13px;
        cursor: pointer;
       
      span i{
            margin: 0;
            font-size: 13px;
        }
      }
      .close {
        //   color: #000;
        //   transition: all .4s;
        transition: all 0.4s;
        &:hover {
          border-radius: 50%;
          // color: #fff;
          background-color: rgba(0, 0, 0, 0.5);
          // transform: rotate(40deg);
          // transform:scale(2);
          // transform: translateY(30px);
        }
      }
      .icon_font{
    font-size: 13px;
      }
    }
  }
}
</style>