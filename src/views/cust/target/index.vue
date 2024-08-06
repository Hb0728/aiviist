<template>
  <div class="app-container">
    <Schedule :stepNum="0"/>
    <!-- 搜索工作栏 -->
    <el-form
      :model="queryParams"
      ref="queryForm"
      size="small"
      :inline="true"
      v-show="showSearch"
      label-width="68px"
    >
      <el-form-item label="名称" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入名称"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="统计类型 " prop="countType">
        <el-select
          v-model="queryParams.countType"
          placeholder="请选择统计类型 "
          clearable
          size="small"
        >
          <el-option
            v-for="item in countTypeList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
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
          v-hasPermi="['cust:target:create']"
          >新增</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="info"
          plain
          icon="el-icon-sort"
          size="mini"
          @click="toggleExpandAll"
          >展开/折叠</el-button
        >
      </el-col>
      <right-toolbar
        :showSearch.sync="showSearch"
        @queryTable="getList"
      ></right-toolbar>
    </el-row>

    <el-table
      v-if="refreshTable"
      v-loading="loading"
      border
      :data="list"
      :show-overflow-tooltip="true"
      row-key="id"
      :default-expand-all="isExpandAll"
      :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
    >
    <el-table-column label="标签维度/一级指标/二级指标" align="center" prop="name" />
      <el-table-column label="ID" width="60" align="center" prop="id" />
      <el-table-column label="分数" width="60" align="center" prop="score" />
      <el-table-column
        label="说明或计算规则"
        :show-overflow-tooltip="true"
        align="center"
        prop="remark"
      >
        <template v-slot="scope">
            <div>{{ scope.row.level==3?scope.row.remark:'/' }}</div>
        </template>
      </el-table-column>
      <el-table-column label="统计类型" width="80" align="center" prop="countType" >
        <template v-slot="scope">
          <span v-if="scope.row.countType==1&&scope.row.level==3">季度</span>
          <span v-if="scope.row.countType==2&&scope.row.level==3">月</span>
          <span v-if="scope.row.countType==3&&scope.row.level==3">实时</span>
          <span v-if="scope.row.level!=3">/</span>
        </template>
      </el-table-column>
      <el-table-column label="取值方式" width="80" align="center" prop="valueMethod" >
        <template v-slot="scope">
          <span v-if="scope.row.valueMethod==1&&scope.row.level==3">系统取值</span>
          <span v-if="scope.row.valueMethod==2&&scope.row.level==3">手动录入</span>
          <span v-if="scope.row.level!=3">/</span>
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
      <el-table-column
        label="操作"
        align="center"
        class-name="small-padding"
      >
        <template v-slot="scope">
            <el-button
            size="mini"
            type="text"
            icon="el-icon-plus"
            @click="openForm({parentId:scope.row.id,level:scope.row.level==3?scope.row.level:scope.row.level+1})"
            v-hasPermi="['cust:target:create']"
            >新增</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="openForm(scope.row)"
            v-hasPermi="['cust:target:update']"
            >修改</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['cust:target:delete']"
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
    <!-- 对话框(添加 / 修改) -->
    <TargetForm ref="formRefs" @success="getList" />
  </div>
</template>

<script>
import * as TargetApi from "@/api/cust/target";
import TargetForm from "./TargetForm.vue";
import { countTypeList } from "@/utils/myDicts";
import Schedule from "@/components/schedule";

export default {
  name: "Target",
  components: {
    TargetForm,
    Schedule,
  },
  data() {
    return {
      // 遮罩层
      loading: true,
      // 导出遮罩层
      exportLoading: false,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 客户价值分类：指标列表
      list: [],
      countTypeList,
      // 是否展开，默认全部展开
      isExpandAll: false,
      // 重新渲染表格状态
      refreshTable: true,
      // 选中行
      currentRow: {},
      // 查询参数
      queryParams: {
        pageNo: 1,
        pageSize: 10,
        name: null,
        score: null,
        remark: null,
        countType: null,
        level: null,
        parentId: null,
        parents: null,
        createTime: [],
        groupedData: [],
      },
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询列表 */
    async getList() {
      try {
        this.loading = true;
        const res = await TargetApi.getTargetPage(this.queryParams);
        this.list = this.handleTree(res.data, "id");
        // this.total = res.data.total;
      } finally {
        this.loading = false;
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
    /** 添加/修改操作 */
    openForm(id) {
      this.$refs["formRefs"].open(id);
    },
    /** 删除按钮操作 */
    async handleDelete(row) {
      const id = row.id;
      await this.$modal.confirm(
        '是否确认删除客户价值分类：指标编号为"' + id + '"的数据项?'
      );
      try {
        await TargetApi.deleteTarget(id);
        await this.getList();
        this.$modal.msgSuccess("删除成功");
      } catch {}
    },
    /** 导出按钮操作 */
    async handleExport() {
      await this.$modal.confirm("是否确认导出所有客户价值分类：指标数据项?");
      try {
        this.exportLoading = true;
        const res = await TargetApi.exportTargetExcel(this.queryParams);
        this.$download.excel(res, "客户价值分类：指标.xls");
      } catch {
      } finally {
        this.exportLoading = false;
      }
    },
    /** 展开/折叠操作 */
    toggleExpandAll() {
      this.refreshTable = false;
      this.isExpandAll = !this.isExpandAll;
      this.$nextTick(() => {
        this.refreshTable = true;
      });
    },
  },
};
</script>
