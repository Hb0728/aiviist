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
      <el-form-item label="阅读状态" prop="isRead">
        <el-select
          v-model="queryParams.isRead"
          placeholder="请选择是否已读"
          clearable
          size="small"
        >
          <el-option label="否" value="0" />
          <el-option label="是" value="1" />
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
    <el-table-column label="消息类型" align="center" prop="userName">
        <template v-slot="scope">
            <div v-if="scope.row.msgType==1">拜访计划</div>
            <div v-if="scope.row.msgType==2">派发服务</div>
            <div v-if="scope.row.msgType==3">预警任务</div>
            <div v-if="scope.row.msgType==4">主动提报服务</div>
        </template>
      </el-table-column>
      <el-table-column label="消息内容" align="content" prop="content">
      </el-table-column>
      <el-table-column label="客户经理" align="center" prop="userName">
      </el-table-column>
      <el-table-column label="是否已读" align="center" prop="status">
        <template v-slot="scope">
          <el-tag v-if="scope.row.isRead == 1" type="success">是</el-tag>
          <el-tag v-else-if="scope.row.isRead == 0" type="warning">否</el-tag>
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
      @pagination="getList()"
    />
    <!-- 分页组件 -->
    <el-dialog :visible.sync="dialogVisibleApply" width="30%">
      <el-descriptions :column="1" title="请假信息">
        <el-descriptions-item label="标题">{{
          applyDetailForm.title
        }}</el-descriptions-item>
        <el-descriptions-item label="申请人">{{
          applyDetailForm.applyName
        }}</el-descriptions-item>
        <el-descriptions-item label="休息时间"
          ><el-tag
            size="small"
            v-for="item in applyDetailForm.restDays"
            :key="item.id"
            >{{ item.restTime }}</el-tag
          ></el-descriptions-item
        >
      </el-descriptions>
      <el-form
        v-if="!formIsread"
        ref="applyForm"
        :rules="applyFormRules"
        :model="applyFormdata"
        label-width="80px"
      >
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
        <el-button type="primary" size="small" @click="submitApply"
          >确 认</el-button
        >
        <el-button size="small" @click="dialogVisibleApply = false"
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
      <el-form
        ref="uploadFormRef"
        :model="formData"
        :rules="formRules"
        label-position="left"
      >
        <el-form-item label="服务项目" prop="projectIds">
          <el-select
            v-model="formData.projectIds"
            multiple
            @change="handleChange"
            filterable
            placeholder="请选择服务项目"
          >
            <el-option
              v-for="item in restaurants"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <el-upload
        ref="upload"
        :limit="1"
        accept=".xlsx, .xls"
        :headers="upload.headers"
        :action="upload.url + '?projectIds=' + this.formData.projectIds.join(',')"
        :disabled="upload.isUploading"
        :on-progress="handleFileUploadProgress"
        :on-success="handleFileSuccess"
        :on-error="handleFileError"
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
import * as AssignApi from "@/api/plan/assign";
import { getBaseHeader } from "@/utils/request";
export default {
  name: "RestDay",
  components: {},
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
        url: process.env.VUE_APP_BASE_API + "/customer/message/importProjectMsgData",
      },
      applyFormRules: {
        status: [
          { required: true, message: "审核结果不能为空", trigger: "blur" },
        ],
      },
      title: "",
      dialogVisibleApply: false,
      applyFormdata: {
        status: "",
        remark: "",
      },
      formData: {
        projectIds: [],
      },
      applyDetailForm: {},
      managerName: "",
      formIsread: false,
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
      formRules: {
        projectIds: [
          { required: true, message: "服务项目不能为空", trigger: "blur" },
        ],
      },
      // 查询参数
      queryParams: {
        isRead: "",
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
      AssignApi.getProjectMsgTemplate().then((response) => {
        this.$download.excel(response, "用户导入模板.xls");
      });
    },
    /** 处理文件上传中 */
    handleFileUploadProgress(event, file, fileList) {
      this.upload.isUploading = true; // 禁止修改
    },
    /** 发起文件上传 */
    submitFileForm() {
        if(this.formData.projectIds.length == 0){
            this.$modal.msgError("请选择服务项目");
            return
        }
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
    handleFileError(response,){
        this.$modal.msgError(response.msg);
    },
    /** 查询列表 */
    async getList() {
      try {
        this.loading = true;
        const res = await AssignApi.messagePage(this.queryParams);
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
    // /** 删除按钮操作 */
    // async handleDelete(row) {
    //   const id = row.id;
    //   await this.$modal.confirm(
    //     '是否确认删除标题为"' + row.title + '"的数据项?'
    //   );
    //   try {
    //     await RestDayApi.restDayApplyDelete(id);
    //     await this.getList();
    //     this.$modal.msgSuccess("删除成功");
    //   } catch {}
    // },
    getManaList() {
      AssignApi.getMechanismProjects().then((res) => {
        this.restaurants = res.data;
      });
    },
    openImportTable() {
      this.upload.open = true;
    },
    // apply(id,isread) {
    //   RestDayApi.restDayApplyDetail(id).then((res) => {
    //     this.applyDetailForm = res.data;
    //     if(isread){
    //         this.formIsread=isread;
    //     }
    //     this.dialogVisibleApply = true;
    //   });
    // },
    submitApply() {},
    handleChange(){
        console.log(this.formData)
    },
    handleSelect(item) {
      this.queryParams.managerId = item.id;
      this.handleQuery();
    },
  },
};
</script>
