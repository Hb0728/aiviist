<template>
  <div class="app-container">
    <!-- 搜索工作栏 -->
    <!-- <el-form
      :model="queryParams"
      ref="queryForm"
      size="small"
      :inline="true"
      v-show="showSearch"
      label-width="100px"
    >
      <el-form-item label="客户分类类型" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入客户分类类型"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <span class="lhmid">-</span>
      <el-form-item prop="potentialEnd">
        <el-input
        class="w70"
          v-model="queryParams.potentialEnd"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="创建时间" prop="createTime">
        <el-date-picker
          v-model="queryParams.createTime"
          style="width: 240px"
          value-format="yyyy-MM-dd HH:mm:ss"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :default-time="['00:00:00', '23:59:59']"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="handleQuery"
          >搜索</el-button
        >
        <el-button icon="el-icon-refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form> -->

    <!-- 操作工具栏 -->
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="openForm(undefined)"
          v-hasPermi="['cust:omer-type:create']"
          >新增</el-button
        >
      </el-col>
      <!-- <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          :loading="exportLoading"
          v-hasPermi="['cust:omer-type:export']"
          >导出</el-button
        >
      </el-col> -->
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
    <el-table-column
      type="index" align="center" label="序号"/>
      <el-table-column label="客户分类类型" align="center" prop="name" />
      <el-table-column v-for="(item,index) in customerTypes" :key="item.id" :label="item.name" align="center">
        <template v-slot="scope">
          <span>{{ scope.row.customerTypes[index].rankStart }}</span>
          -
          <span>{{ scope.row.customerTypes[index].rankEnd }}</span>
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
        class-name="small-padding fixed-width"
      >
        <template v-slot="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="openForm(scope.row.id)"
            v-hasPermi="['cust:omer-type:update']"
            >修改</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['cust:omer-type:delete']"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页组件 -->
    <!-- <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNo" :limit.sync="queryParams.pageSize"
                @pagination="getList"/> -->
    <!-- 对话框(添加 / 修改) -->
    <omerTypeForm ref="formRef" @success="getList" />
  </div>
</template>

<script>
import * as omerTypeApi from "@/api/cust/customertype";
import omerTypeForm from "./omerTypeForm.vue";
export default {
  name: "omerType",
  components: {
    omerTypeForm,
  },
  data() {
    return {
      // 遮罩层
      loading: true,
      // 导出遮罩层
      exportLoading: false,
      // 显示搜索条件
      showSearch: true,
      // 客户模块：分层分类客户类型列表
      list: [],
      // 是否展开，默认全部展开
      isExpandAll: true,
      // 重新渲染表格状态
      refreshTable: true,
      // 选中行
      currentRow: {},
      customerTypes:[],
      // 查询参数
      queryParams: {
        pageNo: 1,
        pageSize: 10,
        name: null,
        devoteStart: null,
        devoteEnd: null,
        potentialStart: null,
        potentialEnd: null,
        createTime: [],
      },
    };
  },
  created() {
    this.getList();
    this.getLevelList();
  },
  methods: {
    getLevelList() {
      omerTypeApi.getFirstLevelList().then((res) => {
        this.customerTypes = [];
        if (res.code == 0) {
          res.data.forEach((item) => {
            this.customerTypes.push({
              name: item.name,
              targetId: item.id,
            });
          });
        }
      });
    },
    /** 查询列表 */
    async getList() {
      try {
        this.loading = true;
        const res = await omerTypeApi.getomerTypePage(this.queryParams);
        this.list = res.data;
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
      this.$refs["formRef"].open(id);
    },
    /** 删除按钮操作 */
    async handleDelete(row) {
      const id = row.id;
      await this.$modal.confirm(
        '是否确认删除客户模块：分层分类客户类型编号为"' + id + '"的数据项?'
      );
      try {
        await omerTypeApi.deleteomerType(id);
        await this.getList();
        this.$modal.msgSuccess("删除成功");
      } catch {}
    },
    /** 导出按钮操作 */
    async handleExport() {
      await this.$modal.confirm(
        "是否确认导出所有客户模块：分层分类客户类型数据项?"
      );
      try {
        this.exportLoading = true;
        const res = await omerTypeApi.exportomerTypeExcel(this.queryParams);
        this.$download.excel(res, "客户模块：分层分类客户类型.xls");
      } catch {
      } finally {
        this.exportLoading = false;
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.w70 {
  width: 50px;
}
.lhmid {
  line-height: 32px;
  margin-right: 10px;
}
</style>
