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
      <el-form-item label="申请姓名">
        <el-input
          v-model="queryParams.applyName"
          placeholder="请输入申请人姓名"
        ></el-input>
      </el-form-item>
      <el-form-item label="申请标题">
        <el-input
          v-model="queryParams.title"
          placeholder="请输入申请标题"
        ></el-input>
      </el-form-item>
      <el-form-item label="申请状态" prop="restType">
        <el-select
          v-model="queryParams.status"
          placeholder="请选择申请状态"
          clearable
          size="small"
        >
          <el-option label="申请中" value="0" />
          <el-option label="通过" value="1" />
          <el-option label="未通过" value="2" />
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
          v-hasPermi="['plan:apply-rest-day:create']"
          @click="openForm(undefined)"
          >新建</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="info"
          plain
          icon="el-icon-upload"
          size="mini"
          v-hasPermi="['plan:apply-rest-day:import']"
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
      <el-table-column label="标题" align="center" prop="title">
      </el-table-column>

      <el-table-column label="客户经理" align="center" prop="applyName" />
      <el-table-column label="状态" align="center" prop="status">
        <template v-slot="scope">
          <el-tag v-if="scope.row.status == 1" type="success">已通过</el-tag>
          <el-tag v-else-if="scope.row.status == 0" type="warning"
            >审核中</el-tag
          >
          <el-tag v-else type="danger">未通过</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="备注" align="center" prop="remark" />
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
            v-if="scope.row.status == 0"
            icon="el-icon-finished"
            @click="apply(scope.row.id)"
            v-hasPermi="['plan:apply-rest-day:apply']"
            >审核</el-button
          >
          <el-button
            size="mini"
            type="text"
            v-else
            icon="el-icon-info"
            @click="apply(scope.row.id,true)"
            >查看详情</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            v-if="scope.row.status == 0"
            @click="handleDelete(scope.row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="queryParams.pageNo"
      :limit.sync="queryParams.pageSize"
      @pagination="getList()"
    />
    <!-- 分页组件 -->
    <!-- 对话框(添加 / 修改) -->
    <RestDayForm ref="formRef" @success="getList" />
    <el-dialog
      :visible.sync="dialogVisibleApply"
      width="30%"
    >
      <el-descriptions :column="1" title="请假信息">
        <el-descriptions-item label="标题">{{
          applyDetailForm.title
        }}</el-descriptions-item>
        <el-descriptions-item label="申请人">{{
          applyDetailForm.applyName
        }}</el-descriptions-item>
        <el-descriptions-item label="休息时间"
          ><el-tag
            class="mr10 mb10"
            size="small"
            v-for="item in applyDetailForm.restDays"
            :key="item.id"
            >{{ item.restTime }}</el-tag
          ></el-descriptions-item
        >
      </el-descriptions>
      <el-form v-if="!formIsread" ref="applyForm" :rules="applyFormRules" :model="applyFormdata" label-width="80px">
        <el-form-item label="审核结果" prop="status">
          <el-radio-group v-model="applyFormdata.status">
            <el-radio :label="1">通过</el-radio>
            <el-radio :label="2">拒绝</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="备注">
          <el-input type="textarea" v-model="applyFormdata.remark"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" v-if="!formIsread" class="dialog-footer tc">
        <el-button type="primary" size="small" @click="submitApply">确 认</el-button>
        <el-button size="small"  @click="dialogVisibleApply = false"
          >取 消</el-button
        >
      </div>
    </el-dialog>

    <!-- 用户导入对话框 -->
    <el-dialog
      :title="upload.title"
      :visible.sync="upload.open"
      width="400px"
      append-to-body
    >
      <el-form ref="uploadFormRef" label-position="left">
        <el-form-item class="flex" label="标题" required>
          <el-input v-model="title" placeholder="请输入标题内容"></el-input>
        </el-form-item>
      </el-form>
      <el-upload
        ref="upload"
        :limit="1"
        accept=".xlsx, .xls"
        :headers="upload.headers"
        :action="upload.url + '?title=' + title"
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
import * as RestDayApi from "@/api/plan/restday/apply";
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
      applyFormRules:{
        status:[
          { required: true, message: "审核结果不能为空", trigger: "blur" },
        ],
      },
      title:'',
      dialogVisibleApply: false,
      applyFormdata:{
        status: '',
        remark: "",
      },
      applyDetailForm: {},
      managerName: "",
      formIsread:false,
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
        applyTimes: [],
        status: "",
        applyName: "",
        title: "",
        pageSize: 10,
        pageNo: 1,
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
        const res = await RestDayApi.restDayApplyPage(this.queryParams);
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
        '是否确认删除标题为"' + row.title + '"的数据项?'
      );
      try {
        await RestDayApi.restDayApplyDelete(id);
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
      this.queryParams.applyTimes = [i[0] + "-01", i[1] + "-01"];
      console.log(this.queryParams.applyTimes);
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
    apply(id,isread) {
      RestDayApi.restDayApplyDetail(id).then((res) => {
        this.applyDetailForm = res.data;
        if(isread){
            this.formIsread=isread;
        }
        this.dialogVisibleApply = true;
      });
    },
    submitApply(){
        if(this.applyFormdata.status==''){
            this.$modal.msgError("请选择审核结果");
            return;
        }
        RestDayApi.restDayApplyExamine({...this.applyFormdata,id:this.applyDetailForm.id}).then((res) => {
            this.$modal.msgSuccess("操作成功");
            this.dialogVisibleApply = false;
            this.getList();
        });
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
