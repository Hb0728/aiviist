<template>
  <div class="app-container">
    <!-- 对话框(添加 / 修改) -->
    <el-dialog
      :title="dialogTitle"
      :visible.sync="dialogVisible"
      width="45%"
      v-dialogDrag
      append-to-body
    >
      <el-form
        ref="formRef"
        :model="formData"
        :rules="formRules"
        v-loading="formLoading"
        label-width="100px"
      >
        <el-form-item label="店名" prop="name">
          <el-input v-model="formData.name" placeholder="请输入店名" />
        </el-form-item>
        <el-form-item label="区域" prop="area">
          <el-input v-model="formData.area" placeholder="请输入区域" />
        </el-form-item>
        <el-form-item label="许可证" prop="license">
          <el-input v-model="formData.license" placeholder="请输入许可证" />
        </el-form-item>
        <el-form-item label="详细地址" prop="address">
          <el-input v-model="formData.address" placeholder="请输入详细地址" />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="formData.remark" placeholder="请输入备注" />
        </el-form-item>
        <el-form-item label="客户类型" prop="custType">
          <el-select
            v-model="formData.custType"
            placeholder="请选择客户类型"
          >
            <el-option
              :label="item.label"
              :value="item.value"
              v-for="item in custType"
              :key="item.value"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm" :disabled="formLoading"
          >确 定</el-button
        >
        <el-button @click="dialogVisible = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import * as InfoApi from "@/api/cust/info";
export default {
  name: "InfoForm",
  components: {},
  data() {
    return {
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
      // 弹出层标题
      dialogTitle: "",
      // 是否显示弹出层
      dialogVisible: false,
      // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
      formLoading: false,
      // 表单参数
      formData: {
        id: undefined,
        name: undefined,
        area: undefined,
        license: undefined,
        address: undefined,
        remark: undefined,
        custType: undefined,
      },
      // 表单校验
      formRules: {
        license: [
          { required: true, message: "许可证不能为空", trigger: "blur" },
        ],
      },
    };
  },
  methods: {
    /** 打开弹窗 */
    async open(id) {
      this.dialogVisible = true;
      this.reset();
      // 修改时，设置数据
      if (id) {
        this.formLoading = true;
        try {
          const res = await InfoApi.getInfo(id);
          this.formData = res.data;
          this.title = "修改客户模块：客户信息";
        } finally {
          this.formLoading = false;
        }
      }
      this.title = "新增客户模块：客户信息";
    },
    /** 提交按钮 */
    async submitForm() {
      // 校验主表
      await this.$refs["formRef"].validate();
      this.formLoading = true;
      try {
        const data = this.formData;
        // 修改的提交
        if (data.id) {
          await InfoApi.updateInfo(data);
          this.$modal.msgSuccess("修改成功");
          this.dialogVisible = false;
          this.$emit("success");
          return;
        }
        // 添加的提交
        await InfoApi.createInfo(data);
        this.$modal.msgSuccess("新增成功");
        this.dialogVisible = false;
        this.$emit("success");
      } finally {
        this.formLoading = false;
      }
    },
    /** 表单重置 */
    reset() {
      this.formData = {
        id: undefined,
        name: undefined,
        area: undefined,
        license: undefined,
        address: undefined,
        remark: undefined,
        custType: undefined,
      };
      this.resetForm("formRef");
    },
  },
};
</script>
