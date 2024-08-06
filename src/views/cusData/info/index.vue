<template>
  <div class="app-container">
    <Schedule :stepNum="1" />
    <!-- 搜索工作栏 -->
    <el-form
      :model="queryParams"
      ref="queryForm"
      size="small"
      :inline="true"
      v-show="showSearch"
      label-width="68px"
    >
      <el-form-item label="店名" prop="companyName">
        <el-input
          v-model="queryParams.companyName"
          placeholder="请输入店名"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="客户经理" prop="managerName">
        <el-autocomplete
          class="inline-input"
          v-model="managerName"
          :fetch-suggestions="querySearch"
          placeholder="请输入客户经理名"
          @select="handleSelect"
        >
        </el-autocomplete>
      </el-form-item>
      <el-form-item label="区域" prop="administrativeDivision">
        <el-select @change="handleQuery" v-model="queryParams.administrativeDivision" placeholder="请选择区域">
            <el-option
            label="请选择"
            value=""
          >
          </el-option>
          <el-option
            label="连山区"
            value="连山区"
          >
          </el-option>
          <el-option
            label="龙港区"
            value="龙港区"
          >
          </el-option>
          <el-option
            label="南票区"
            value="南票区"
          >
          </el-option>
          <el-option
            label="兴城市"
            value="兴城市"
          >
          </el-option>
          <el-option
            label="绥中县"
            value="绥中县"
          >
          </el-option>
          <el-option
            label="建昌县"
            value="建昌县"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="许可证号" prop="license">
        <el-input
          v-model="queryParams.license"
          placeholder="请输入许可证号"
          clearable
          @keyup.enter.native="handleQuery"
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
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="openForm(undefined)"
          v-hasPermi="['cust:info:create']"
          >新增</el-button
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
    >
      <el-table-column label="店铺名称" align="center" prop="companyName" />
      <el-table-column label="客户姓名" align="center" prop="name" />
      <el-table-column label="客户经理" align="center" prop="managerName" />
      <el-table-column
        label="区域"
        align="center"
        prop="administrativeDivision"
      />
      <el-table-column label="许可证" align="center" prop="license" />
      <el-table-column
        :show-overflow-tooltip="true"
        label="详细地址"
        align="center"
        prop="address"
      />
      <el-table-column
        width="200"
        label="操作"
        align="center"
        class-name="small-padding fixed-width"
      >
        <template v-slot="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-reading"
            @click="openDraw2(scope.row.id, scope.row.name)"
            >查看分值</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="openForm(scope.row.id)"
            v-hasPermi="['cust:info:update']"
            >修改</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-tickets"
            @click="openDraw(scope.row.id, scope.row.name)"
            >分值录入</el-button
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
    <!-- 对话框(添加 / 修改) -->
    <InfoForm ref="formRef" @success="getList" />
    <entryDraw ref="formDraw" />
    <entryDraw2 ref="formDraw2" />
  </div>
</template>

<script>
import * as InfoApi from "@/api/cust/info";
import { managerList } from "@/api/system/cusManager";
import InfoForm from "./InfoForm.vue";
import entryDraw from "./entryDraw.vue";
import entryDraw2 from "./entryDraw2.vue";
import Schedule from "@/components/schedule";

export default {
  name: "Info",
  components: {
    InfoForm,
    entryDraw,
    Schedule,
    entryDraw2,
  },
  data() {
    return {
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
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNo = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.queryParams = {
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
      };
      this.handleQuery();
    },
    /** 添加/修改操作 */
    openForm(id) {
      this.$refs["formRef"].open(id);
    },
    openDraw(id, name) {
      this.$refs["formDraw"].open(id, name);
    },
    openDraw2(id, name) {
      this.$refs["formDraw2"].open(id, name);
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
};
</script>
