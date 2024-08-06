<template>
  <el-drawer title="客户列表" size="70%" :visible.sync="drawer">
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
        <div class="flex row-between">
          <div>
            <el-form-item label="店名" prop="companyName">
              <el-input
                v-model="queryParams.companyName"
                placeholder="请输入店名"
                clearable
                @keyup.enter.native="handleQuery"
              />
            </el-form-item>
            <el-form-item label="许可证" prop="license">
              <el-input
                v-model="queryParams.license"
                placeholder="请输入许可证"
                clearable
                @keyup.enter.native="handleQuery"
              />
            </el-form-item>
            <el-form-item>
              <el-button
                type="primary"
                icon="el-icon-search"
                @click="handleQuery"
                >搜索</el-button
              >
              <el-button icon="el-icon-refresh" @click="resetQuery"
                >重置</el-button
              >
            </el-form-item>
          </div>
          <div>
            <el-form-item>
              <el-button type="primary" @click="confirm">确认</el-button>
              <el-button @click="drawer = false">取消</el-button>
            </el-form-item>
          </div>
        </div>
      </el-form>

      <!-- 操作工具栏 -->
      <el-row :gutter="10" class="mb8">
        <right-toolbar
          :showSearch.sync="showSearch"
          @queryTable="getList"
        ></right-toolbar>
      </el-row>
      <el-table
        v-loading="loading"
        :data="list"
        :stripe="true"
        highlight-current-row
        @current-change="handleCurrentChange"
        :show-overflow-tooltip="true"
      >
        <el-table-column label="ID" align="center" prop="id" />
        <el-table-column label="店名" align="center" prop="companyName" />
        <el-table-column
          show-overflow-tooltip
          label="类型"
          align="center"
          prop="customerTargetTypeName"
        />
        <el-table-column label="区域" align="center" prop="administrativeDivision" />
        <el-table-column label="许可证" align="center" prop="license" />
        <el-table-column
          show-overflow-tooltip
          label="详细地址"
          align="center"
          prop="address"
        />
        <el-table-column label="备注" align="center" prop="remark" />
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
  </el-drawer>
</template>

<script>
import * as InfoApi from "@/api/cust/info";
import { managerList } from "@/api/system/cusManager";
export default {
  name: "Info",
  data() {
    return {
      managerName: "",
      // 遮罩层
      loading: true,
      drawer: false,
      // 导出遮罩层
      exportLoading: false,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 客户模块：客户信息列表
      list: [],
      custType: [
        {
          label: "手动",
          value: "1",
        },
        {
          label: "自动",
          value: "2",
        },
      ],
      // 是否展开，默认全部展开
      isExpandAll: true,
      // 重新渲染表格状态
      refreshTable: true,
      // 选中行
      currentRow: {},
      //搜索建议数组
      restaurants: [],
      cusInfo: undefined,
      // 查询参数
      queryParams: {
        pageNo: 1,
        pageSize: 10,
        managerId: "",
        companyName: null,
        area: null,
        license: null,
        address: null,
        remark: null,
        custType: null,
        createTime: [],
      },
    };
  },
  created() {
    this.getList();
    this.getManaList();
  },
  methods: {
    async open(id) {
      this.queryParams.managerId = id;
      this.drawer = true;
      // 修改时，设置数据
      if (id) {
        this.formLoading = true;
        await this.getList();
        await this.getManaList();
      }
    },
    /** 查询列表 */
    async getList() {
      try {
        this.loading = true;
        const res = await InfoApi.getInfoPage(this.queryParams);
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
    handleCurrentChange(val) {
      this.cusInfo = val;
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
    confirm() {
      this.$emit("check", this.cusInfo);
      this.drawer = false;
    },
  },
};
</script>
