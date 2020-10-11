<template>
    <el-card id="el_card">
        <el-row>
            <el-collapse class="mb10">
                <el-collapse-item title="操作提示" name="1">
                    <div>· 注意！收银前端点击【更多】--【数据同步】--然后退出重新登陆即可看到您添加的美图哦！！</div>
                </el-collapse-item>
            </el-collapse>
        </el-row>
        <el-row :gutter="15" style="margin-bottom:10px">
            <el-col :span="1">
                <el-button type="primary" @click="add" size="mini">新增轮播图</el-button>
            </el-col>
        </el-row>
        <el-row>
            <el-col>
                <el-table :data="tableData" border="" style="width: 100%">
                    <el-table-column prop="id" label="ID" width="100"></el-table-column>
                    <el-table-column prop="name" label="轮播图名称" width="200"></el-table-column>
                    <el-table-column prop="sort" label="排序" width="250"></el-table-column>
                    <el-table-column prop="add_time" label="时间" width="300"></el-table-column>
                    <el-table-column label="启用状态" prop="status">
                        <template slot-scope="row">
                            <el-switch
                                v-model="row.row.status"
                                active-color="#008080"
                                inactive-color="#ff4949"
                                active-text="是"
                                inactive-text="否"
                                :active-value="1"
                                :inactive-value="0"
                                @change="onswitchType(row)"
                            ></el-switch>
                        </template>
                    </el-table-column>
                    <el-table-column label="轮播图片">
                        <template slot-scope="row">
                            <div v-if="row.row.thumb">
                                <el-image
                                    style="width: 300px; height: 100px"
                                    :src="row.row.thumb"
                                    fit="contain"
                                ></el-image>
                            </div>
                            <div v-else>暂无图片</div>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作">
                        <template slot-scope="scope">
                            <el-button
                                type="primary"
                                size="mini"
                                icon="el-icon-edit"
                                @click="edit(scope.$index, scope.row)"
                            >编辑</el-button>
                            <el-button
                                type="danger"
                                size="mini"
                                icon="el-icon-delete"
                                @click="del(scope.$index, scope.row)"
                            >删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-col>
        </el-row>
        <el-row style="margin-top:50px">
            <el-col>
                <div class="pagination">
                    <el-pagination
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                        :page-sizes="[7, 12, 15, 20]"
                        layout="total, sizes, prev, pager, next, jumper"
                        :total="Page.count"
                    ></el-pagination>
                </div>
            </el-col>
        </el-row>
    </el-card>
</template>

<script>
export default {
  created() {
    this.getCarousel();
  },
  data() {
    return {
      input: "",
      value: "",
      tableData: [],
      Page: {
        pagenum: 1,
        pagesize: 10,
        count: 0,
        id: "",
        shop_id: "",
        machine: ""
      }
    };
  },
  methods: {
    async getCarousel() {
      const loading = this.$loading({
        lock: true,
        text: "Loading",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.1)"
      });
      this.$api
        .getCarouselList(this.Page)
        .then(res => {
          if (res.data.code == 200) {
            // this.$message.success("查询成功");
            loading.close();
            this.tableData = res.data.list.data;
            this.Page.count = res.data.list.total;
            this.Page.pagenum = res.data.list.current_page;
          } else {
            this.$api.error(res.data.msg);
          }
        })
        .catch(res => {
          this.$api.error();
        });
    },
    // 修改状态
    onswitchType(row, e) {
      let type = null;
      if (row.row.status) {
        type = "1";
      } else {
        type = "0";
      }
      this.$api
        .getCarouselStatus({
          params: {
            id: row.row.id,
            status: type
          }
        })
        .then(res => {
          console.log(res.data);
          if (res.data.code == 200) {
            this.$message.success(res.data.msg);
            this.getCarousel();
          }
        })
        .catch(res => {
          console.log(res);
        });
    },
    add() {
      this.$router.push("./carouselEdit");
    },
    edit(i, el) {
      this.$router.push({ path: "./carouselEdit", query: { id: el.id } });
    },
    del(i, el) {
      this.$api
        .getCarouselDel({
          params: {
            id: el.id
          }
        })
        .then(res => {
          console.log(res);
          if (res.data.code == 200) {
            this.$message.success(res.data.msg);
            this.getCarousel();
          }
        })
        .catch(res => {
          console.log(res);
        });
    },
    // 分页
    handleCurrentChange(e) {
      this.Page.pagenum = e;
      this.getCarousel(this.Page);
    },
    // 分页
    handleSizeChange(e) {
      this.Page.pagesize = e;
      this.getCarousel(this.Page);
    }
  }
};
</script>
<style lang="less">
</style>