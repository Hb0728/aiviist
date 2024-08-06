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
        <el-form-item label="标题" prop="title">
          <el-input
            style="width: 350px"
            v-model="formData.title"
            placeholder="请输入标题"
          ></el-input>
        </el-form-item>
        <el-form-item label="休息日" prop="applyDays">
          <el-date-picker
            clearable
            v-model="formData.applyDays"
            type="daterange"
            value-format="yyyy-MM-dd"
            placeholder="选择休息日"
          />
        </el-form-item>

        <el-form-item v-if="formData.restType == 2" label="客户经理">
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
      <div slot="footer" class="dialog-footer tc">
        <el-button type="primary" @click="submitForm" :disabled="formLoading"
          >确 定</el-button
        >
        <el-button @click="dialogVisible = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import * as RestDayApi from "@/api/plan/restday/apply";
import { managerList } from "@/api/system/cusManager";
export default {
  name: "RestDayForm",
  components: {},
  data() {
    return {
      // 弹出层标题
      dialogTitle: "",
      // 是否显示弹出层
      dialogVisible: false,
      // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
      formLoading: false,
      managerName: "",
      restaurants: [],
      // 表单参数
      formData: {
        title: "",
        applyDays: [],
      },
      // 表单校验
      formRules: {
        applyDays: [
          { required: true, message: "休息日不能为空", trigger: "blur" },
        ],
        title: [
          {
            required: true,
            message: "标题不能为空",
            trigger: "change",
          },
        ],
      },
    };
  },
  created() {
    this.getManaList();
  },
  methods: {
    /** 打开弹窗 */
    async open(id) {
      this.dialogVisible = true;
      this.reset();
      // 修改时，设置数据
      //   if (id) {
      //     this.formLoading = true;
      //     try {
      //       const res = await RestDayApi.getRestDay(id);
      //       this.formData = res.data;
      //       this.title = "修改拜访计划：休息日期";
      //     } finally {
      //       this.formLoading = false;
      //     }
      //   }
      this.title = "休息日申请";
    },
    /** 提交按钮 */
    async submitForm() {
      // 校验主表
      await this.$refs["formRef"].validate((valid) => {
        if (valid) {
            RestDayApi.restDayApplyCreateSelect(this.formData).then((res) => {
                this.$modal.msgSuccess("新增成功")
                this.dialogVisible = false;
                this.$emit("success");
            });
        }
      });
      
      //   this.formData.restTimes.push(this.formData.restTime)
      //   this.formLoading = true;
      //   try {
      //     const data = this.formData;
      //     // 修改的提交
      //     if (data.id) {
      //       await RestDayApi.updateRestDay(data);
      //       this.$modal.msgSuccess("修改成功");
      //       this.dialogVisible = false;
      //       this.$emit("success");
      //       return;
      //     }
      //     // 添加的提交
      //     await RestDayApi.createRestDay(data);
      //     this.$modal.msgSuccess("新增成功");
      //     this.dialogVisible = false;
      //     this.$emit("success");
      //   } finally {
      //     this.formLoading = false;
      //   }
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
      this.formData.managerId = item.id;
    },
    /** 表单重置 */
    reset() {
      this.formData = {
        restTimes: [],
        title: "",
      };
      this.resetForm("formRef");
    },
  },
};
</script>
