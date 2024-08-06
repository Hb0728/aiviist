<template>
  <div class="app-container">
    <!-- 搜索工作栏 -->
    <el-form
      :model="queryParams"
      ref="queryForm"
      size="small"
      :inline="true"
      v-show="showSearch"
      label-width="68px"
    >
      <el-form-item label="客户名称" prop="name">
        <el-input
          v-model="queryParams.customerName"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
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
      <el-form-item label="服务时间" prop="applyTimes">
        <el-date-picker
          v-model="queryParams.applyTimes"
          style="width: 240px"
          value-format="yyyy-MM-dd"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="handleQuery"
          >搜索</el-button
        >
        <el-button icon="el-icon-refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <!-- 操作工具栏 -->
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          @click="handleDelete"
          >删除</el-button
        >
      </el-col>
      <right-toolbar
        :showSearch.sync="showSearch"
        @queryTable="getList"
      ></right-toolbar>
    </el-row>

    <el-table
      v-loading="loading"
      :data="list"
      :stripe="true"
      :show-overflow-tooltip="true"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" />
      <el-table-column
        label="序号"
        type="index"
        width="50"
        align="center"
      ></el-table-column>
      <el-table-column label="店名" align="center" prop="companyName" />
      <el-table-column label="客户经理" align="center" prop="managerName" />
      <el-table-column
        show-overflow-tooltip
        label="服务项目"
        align="center"
        prop="projectName"
      />
      <el-table-column
        label="提报时间"
        align="center"
        prop="scoreTime"
        width="180"
      >
        <template v-slot="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="紧急程度"
        align="center"
        prop="urgencyLevel"
        width="180"
      >
        <template v-slot="scope">
          <el-rate
            v-model="scope.row.urgencyLevel"
            disabled
            allow-half
            text-color="#ff9900"
          >
          </el-rate>
        </template>
      </el-table-column>
      <el-table-column label="备注" align="center" prop="remark" />
      <el-table-column width="250" label="服务周期" align="center">
        <template v-slot="scope">
          <div v-if="scope.row.serviceCycle == 1">一周一次</div>
          <div v-if="scope.row.serviceCycle == 2">一月两次</div>
          <div v-if="scope.row.serviceCycle == 3">一月一次</div>
          <div v-if="scope.row.serviceCycle == 4">一季度一次</div>
          <div v-if="scope.row.serviceCycle == 5">一年一次</div>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        class-name="small-padding fixed-width"
      >
        <template v-slot="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页组件 -->
    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="queryParams.pageNo"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />
  </div>
</template>

<script>
import { getCustomerApplyPage, deleteReport } from "@/api/plan/task";
import { managerList } from "@/api/system/cusManager";
export default {
  name: "result",
  components: {},
  data() {
    return {
      iconClasses: ["icon-rate-face-1", "icon-rate-face-2", "icon-rate-face-3"],
      managerName: "",
      // 遮罩层
      loading: true,
      // 导出遮罩层
      exportLoading: false,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 客户模块：客户信息列表
      list: [],
      // 是否展开，默认全部展开
      isExpandAll: true,
      // 重新渲染表格状态
      refreshTable: true,
      // 选中行
      currentRow: {},
      //搜索建议数组
      restaurants: [],
      multipleSelection: "",
      // 查询参数
      queryParams: {
        pageNo: 1,
        pageSize: 10,
        managerId: "",
        customerName: "",
        applyTimes: [],
      },
    };
  },
  created() {
    this.getList();
    this.getManaList();
  },
  methods: {
    /** 查询列表 */
    async getList() {
      try {
        this.loading = true;
        const res = await getCustomerApplyPage(this.queryParams);
        this.list = res.data.list;
        this.total = res.data.total;
      } finally {
        this.loading = false;
      }
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
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNo = 1;
      //   console.log(this.queryParams)
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.queryParams={
        pageNo: 1,
        pageSize: 10,
        managerId: "",
        customerName: "",
        applyTimes: [],
      };
      this.handleQuery();
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
    handleSelectionChange(val) {
      let ids = [];
      if (val.length != 0) {
        val.forEach((item) => {
          ids.push(item.id);
        });
      }
      this.multipleSelection = ids.join(",");
    },
    handleDelete(row) {
      const ids = row.id || this.multipleSelection;
      this.$modal
        .confirm("是否确认删除")
        .then(function () {
          return deleteReport(ids);
        })
        .then(() => {
          this.getList();
          this.$modal.msgSuccess("删除成功");
        })
        .catch(() => {});
    },
  },
};
</script>
