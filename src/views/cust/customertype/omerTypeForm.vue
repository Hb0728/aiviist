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
        label-width="110px"
      >
        <el-form-item label="客户分类类型" prop="name">
          <el-input v-model="formData.name" placeholder="请输入客户分类类型" />
        </el-form-item>
        <el-row :gutter="20" v-for="item in customerTypes" :key="item.targetId">
          <el-col :span="9">
            <el-form-item :label="item.name">
              <el-input
                v-model="item.rankStart"
                :placeholder="`最小${item.name}`"
              />
            </el-form-item>
          </el-col>
          <el-col :span="1"><span class="lhmid">-</span></el-col>
          <el-col :span="5">
            <el-form-item label-width="0">
              <el-input
                v-model="item.rankEnd"
                :placeholder="`最大${item.name}`"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="顺序" prop="sort">
            <el-input-number v-model="formData.sort" controls-position="right" :min="1" :max="100"></el-input-number>
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
import * as omerTypeApi from "@/api/cust/customertype";
export default {
  name: "omerTypeForm",
  components: {},
  data() {
    return {
      customerTypes: [],
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
        customerTypes: [],
      },
      // 表单校验
      formRules: {
        name: [
          { required: true, message: "客户分类类型不能为空", trigger: "blur" },
        ],
      },
    };
  },
  mounted() {},
  methods: {
    /** 打开弹窗 */
    async open(id) {
      this.dialogVisible = true;
      await this.reset();
      // 修改时，设置数据
      if (id) {
        this.formLoading = true;
        try {
          const res = await omerTypeApi.getomerType(id);
          this.formData.name = res.data.name;
          this.formData.id = res.data.id;
          this.formData.sort = res.data.sort;
          this.customerTypes = [];
          res.data.customerTypes.forEach((item) => {
            this.customerTypes.push({
              rankStart: item.rankStart,
              rankEnd: item.rankEnd,
              name: item.targetName,
              targetId: item.targetId,
            });
          });
          this.dialogTitle = "修改客户分类类型";
          console.log(this.customerTypes)
        } finally {
          this.formLoading = false;
        }
      }else{
        this.dialogTitle = "新增客户分类类型";
      }
      
    },
    /** 提交按钮 */
    async submitForm() {
      // 校验主表
      await this.$refs["formRef"].validate();
      let flag = false;
      let name = "";
      console.log(this.customerTypes);
      this.customerTypes.forEach((item) => {
        if (item.rankStart === "" || item.rankEnd === "") {
          flag = true;
          name = item.name;
        }
      });

      if (flag) {
        this.$message.error(name + "不能为空");
        return;
      }
      this.formLoading = true;

      try {
        const data = this.formData;
        data.customerTypes = this.customerTypes;
        // 修改的提交
        if (data.id) {
          await omerTypeApi.updateomerType(data);
          this.$modal.msgSuccess("修改成功");
          this.dialogVisible = false;
          this.$emit("success");
          return;
        }
        // 添加的提交
        await omerTypeApi.createomerType(data);
        this.$modal.msgSuccess("新增成功");
        this.dialogVisible = false;
        this.$emit("success");
      } finally {
        this.formLoading = false;
      }
    },
    /** 表单重置 */
    async reset() {
      await omerTypeApi.getFirstLevelList().then((res) => {
        this.customerTypes = [];
        if (res.code == 0) {
          res.data.forEach((item) => {
            this.customerTypes.push({
              name: item.name,
              targetId: item.id,
              rankStart: "",
              rankEnd: "",
            });
          });
        }
      });
      this.formData = {
        id: undefined,
        customerTypes: [],
        name: undefined,
      };
      this.resetForm("formRef");
    },
  },
};
</script>
<style>
.lhmid {
  line-height: 36px;
}
</style>
