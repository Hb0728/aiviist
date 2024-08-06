<template>
  <el-drawer
    :title="title"
    :visible.sync="dialogVisible"
    size="80%"
    class=""
    @open="getList"
    @close="cancel"
    append-to-body
  >
    <el-form
      :model="queryParams"
      ref="queryForm"
      size="small"
      :inline="true"
      label-width="68px"
    >
      <!-- <el-form-item label="名称" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入名称"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item> -->
      <el-form-item label="客户经理" prop="name">
        <el-autocomplete
          class="inline-input"
          v-model="managerName"
          :fetch-suggestions="querySearch"
          placeholder="请输入客户经理名"
          @select="handleSelect"
        >
        </el-autocomplete>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="handleQuery"
          >搜索</el-button
        >
        <el-button icon="el-icon-refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row class="mb8">
      <right-toolbar @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="postList">
      <el-table-column label="ID" align="center" prop="id" />
      <el-table-column label="店名" align="center" prop="name" />
      <el-table-column label="客户经理" align="center" prop="managerName" />
      <el-table-column
        label="类型"
        align="center"
        prop="customerTargetTypeName"
      />
      <el-table-column label="区域" align="center" prop="area" />
      <el-table-column label="许可证" align="center" prop="license" />
      <el-table-column label="详细地址" align="center" prop="address" />
      <el-table-column label="备注" align="center" prop="remark" />
      <el-table-column label="客户类型" align="center" prop="custType">
        <template v-slot="scope">
          <span v-if="scope.row.custType == 1">自动</span>
          <span v-else>手动</span>
        </template>
      </el-table-column>
      <el-table-column
        label="创建时间"
        align="center"
        prop="createTime"
        width="180"
      >
        <template v-slot="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="queryParams.pageNo"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />
  </el-drawer>
</template>

<script>
import * as LibraryApi from "@/api/ser/librarysubproject";
import { managerList } from "@/api/system/cusManager";
import * as NextLibApi from "@/api/ser/librarysubproject/nextLib";

export default {
  name: "associatedCustomers",
  components: {},
  data() {
    return {
      managerName: "",
      total: 0,
      restaurants: [],
      queryParams: {
        pageNo: 1,
        pageSize: 10,
        name: undefined,
        projectId: undefined,
      },
      postList: [],
      loading: false,
      dialogVisible: false,
      isNext: false,
      title: "查看关联客户",
    };
  },
  computed: {},
  watch: {},
  methods: {
    /** 打开弹窗 */
    async open(id, isNext) {
      this.isNext = isNext;
      this.queryParams.projectId = id;
      this.dialogVisible = true;
      this.resetForm("queryForm");
    },
    /** 查询岗位列表 */
    getList() {
      this.loading = true;
      if (this.isNext) {
        NextLibApi.getCustomers(this.queryParams).then((response) => {
          this.postList = response.data.list;
          this.total = response.data.total;
          this.loading = false;
        });
      } else {
        LibraryApi.getCustomers(this.queryParams).then((response) => {
          this.postList = response.data.list;
          this.total = response.data.total;
          this.loading = false;
        });
      }
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNo = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    cancel() {
      this.dialogVisible = false;
      this.resetForm("queryForm");
    },
    getManaList() {
      managerList({ nickname: "" }).then((res) =>
        res.data.forEach((item) => {
          this.restaurants.push({
            value: item.nickname,
            id: item.id,
          });
        })
      );
    },
    // 客户经理搜索建议
    querySearch(queryString, cb) {
      var restaurants = this.restaurants;
      var results = queryString
        ? restaurants.filter(this.createFilter(queryString))
        : restaurants;
      // 调用 callback 返回建议列表的数据
      cb(results);
    },
    createFilter(queryString) {
      return (restaurant) => {
        return (
          restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) ===
          0
        );
      };
    },
    handleSelect(item) {
      this.queryParams.managerId = item.id;
      this.handleQuery();
    },
  },
  //生命周期 - 创建完成（可以访问当前this实例）
  created() {
    this.getManaList();
  },
  //生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {},
  beforeCreate() {}, //生命周期 - 创建之前
  beforeMount() {}, //生命周期 - 挂载之前
  beforeUpdate() {}, //生命周期 - 更新之前
  updated() {}, //生命周期 - 更新之后
  beforeDestroy() {}, //生命周期 - 销毁之前
  destroyed() {}, //生命周期 - 销毁完成
  activated() {}, //如果页面有keep-alive缓存功能，这个函数会触发
};
</script>
<style scoped></style>
