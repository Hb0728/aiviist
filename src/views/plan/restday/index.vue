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
      <el-form-item label="时间范围" prop="restTime">
        <el-date-picker
          @change="changeTime"
          v-model="restTime"
          style="width: 240px"
          value-format="yyyy-MM"
          type="monthrange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        />
      </el-form-item>
      <!-- <el-form-item label="休息日类型" prop="restType">
        <el-select v-model="queryParams.restType" placeholder="请选择休息日类型" clearable size="small">
          <el-option label="公共" value="1" />
          <el-option label="个人" value="2" />
        </el-select>
      </el-form-item> -->
      <el-form-item label="客户经理">
        <el-autocomplete
          class="inline-input"
          :clearable="true"
          v-model="managerName"
          :fetch-suggestions="querySearch"
          placeholder="请输入客户经理名"
          @select="handleSelect"
        >
        </el-autocomplete>
      </el-form-item>
      <!-- <el-form-item label="创建时间" prop="createTime">
        <el-date-picker v-model="queryParams.createTime" style="width: 240px" value-format="yyyy-MM-dd HH:mm:ss" type="daterange"
                        range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" :default-time="['00:00:00', '23:59:59']" />
      </el-form-item> -->
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
          v-hasPermi="['plan:rest-day:create']"
          >新增</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="info"
          plain
          icon="el-icon-upload"
          size="mini"
          @click="openImportTable"
          >导入</el-button
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
      <el-table-column label="ID" align="center" prop="id" />
      <el-table-column label="休息日" align="center" prop="restTime">
      </el-table-column>
      <el-table-column label="休息日类型" align="center" prop="restType">
        <template v-slot="scope">
          <span class="" v-if="scope.row.restType == 1">公共</span>
          <span class="" v-if="scope.row.restType == 2">个人</span>
        </template>
      </el-table-column>
      <el-table-column label="客户经理" align="center" prop="managerId" />
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
            v-hasPermi="['plan:rest-day:update']"
            >修改</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['plan:rest-day:delete']"
            >删除</el-button
          >
        </template>
      </el-table-column>
      <pagination
          v-show="total > 0"
          :total="total"
          :page.sync="queryParams.pageNo"
          :limit.sync="queryParams.pageSize"
          @pagination="getList()"
        />
    </el-table>
    <!-- 分页组件 -->
    <!-- 对话框(添加 / 修改) -->
    <RestDayForm ref="formRef" @success="getList" />
    <!-- 用户导入对话框 -->
    <el-dialog
      :title="upload.title"
      :visible.sync="upload.open"
      width="400px"
      append-to-body
    >
      <el-form ref="uploadFormRef">
        <el-form-item label="客户经理">
          <el-autocomplete
            class="inline-input"
            v-model="managerName"
            :fetch-suggestions="querySearch"
            placeholder="请输入客户经理名"
            @select="handleSelect"
          >
          </el-autocomplete>
        </el-form-item>
      </el-form>
      <el-upload
        ref="upload"
        :limit="1"
        accept=".xlsx, .xls"
        :headers="upload.headers"
        :action="upload.url + '?managerId=' + queryParams.managerId"
        :disabled="upload.isUploading"
        :on-progress="handleFileUploadProgress"
        :on-success="handleFileSuccess"
        :auto-upload="false"
        drag
      >
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <div class="el-upload__tip text-center" slot="tip">
          <span>仅允许导入xls、xlsx格式文件。</span>
          <el-link
            type="primary"
            :underline="false"
            style="font-size: 12px; vertical-align: baseline"
            @click="importTemplate"
            >下载模板</el-link
          >
        </div>
      </el-upload>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitFileForm">确 定</el-button>
        <el-button @click="upload.open = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { managerList } from "@/api/system/cusManager";
import * as RestDayApi from "@/api/plan/restday";
import { getBaseHeader } from "@/utils/request";
import RestDayForm from "./RestDayForm.vue";
export default {
  name: "RestDay",
  components: {
    RestDayForm,
  },
  data() {
    return {
      // 用户导入参数
      upload: {
        // 是否显示弹出层（用户导入）
        open: false,
        // 弹出层标题（用户导入）
        title: "",
        // 是否禁用上传
        isUploading: false,
        // 是否更新已经存在的用户数据
        updateSupport: 0,
        // 设置上传的请求头部
        headers: getBaseHeader(),
        // 上传的地址
        url: process.env.VUE_APP_BASE_API + "/plan/rest-day/importData",
      },
      managerName: "",
      restaurants: [],
      restTime: [],
      // 遮罩层
      loading: true,
      // 导出遮罩层
      exportLoading: false,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 拜访计划：休息日期列表
      list: [],
      // 是否展开，默认全部展开
      isExpandAll: true,
      // 重新渲染表格状态
      refreshTable: true,
      // 选中行
      currentRow: {},
      // 查询参数
      queryParams: {
        restTimes: [],
        managerId: '',
        pageSize:10,
        pageNum:1,
      },
    };
  },
  created() {
    this.getList();
    this.getManaList();
  },
  methods: {
    /** 下载模板操作 */
    importTemplate() {
      RestDayApi.getTemplate().then((response) => {
        this.$download.excel(response, "用户导入模板.xls");
      });
    },
    /** 处理文件上传中 */
    handleFileUploadProgress(event, file, fileList) {
      this.upload.isUploading = true; // 禁止修改
    },
    /** 发起文件上传 */
    submitFileForm() {
        this.$refs.upload.submit();
    },
    /** 文件上传成功处理 */
    handleFileSuccess(response, file, fileList) {
      // 清理
      this.upload.open = false;
      this.upload.isUploading = false;
      this.$refs.upload.clearFiles();
      // 提示成功，并刷新
      this.$modal.msgSuccess("上传成功");
      this.getList();
    },
    /** 查询列表 */
    async getList() {
      try {
        this.loading = true;
        const res = await RestDayApi.getRestDayPage(this.queryParams);
        this.list = res.data.list;
        this.total = res.data.total;
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
        '是否确认删除拜访计划：休息日期编号为"' + id + '"的数据项?'
      );
      try {
        await RestDayApi.deleteRestDay(id);
        await this.getList();
        this.$modal.msgSuccess("删除成功");
      } catch {}
    },
    /** 导出按钮操作 */
    async handleExport() {
      await this.$modal.confirm("是否确认导出所有拜访计划：休息日期数据项?");
      try {
        this.exportLoading = true;
        const res = await RestDayApi.exportRestDayExcel();
        this.$download.excel(res, "拜访计划：休息日期.xls");
      } catch {
      } finally {
        this.exportLoading = false;
      }
    },
    changeTime(i) {
      this.queryParams.restTimes = [i[0] + "-01", i[1] + "-01"];
      console.log(this.queryParams.restTimes);
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
    openImportTable() {
      this.upload.open = true;
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
      console.log(queryString);
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
