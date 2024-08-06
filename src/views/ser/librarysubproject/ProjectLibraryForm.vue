<template>
  <div class="app-container">
    <!-- 对话框(添加 / 修改) -->
    <el-dialog
      :title="dialogTitle"
      :visible.sync="dialogVisible"
      width="500px"
      v-dialogDrag
      append-to-body
    >
      <div class="pl30 pr30">
        <el-form
          ref="formRef"
          :model="formData"
          :rules="formRules"
          v-loading="formLoading"
          label-width="80px"
        >
          <el-form-item label="名称" prop="name">
            <el-input v-model="formData.name" placeholder="请输入项目库名称" />
          </el-form-item>
          <el-form-item label="套餐分类" prop="type">
            <el-radio-group :disabled="mod" v-model="formData.type">
              <el-radio :label="0">服务套餐</el-radio>
              <el-radio :label="1">草稿箱</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item
            v-if="formData.type === 1"
            label="替换套餐"
            prop="replaceId"
          >
            <el-select
              v-model="formData.replaceId"
              clearable
              placeholder="请选择替换原有服务套餐"
            >
              <el-option
                v-for="item in setOptions"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            v-if="formData.type == 0"
            label="启用状态"
            prop="status"
          >
            <el-radio-group v-model="formData.status">
              <el-radio :label="0">启用</el-radio>
              <el-radio :label="1">禁用</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item
            v-if="formData.status == 0 || formData.type == 1"
            label="生效时间"
            prop="enableTime"
          >
            <el-date-picker
              @change="printa"
              :picker-options="pickerOptions"
              value-format="yyyy-MM-dd"
              v-model="formData.enableTime"
              range-separator="至"
              start-placeholder="开始月份"
              end-placeholder="结束月份"
              type="monthrange"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item label="排序" prop="projectNumber">
            <el-input-number
              controls-position="right"
              v-model="formData.sort"
              el-form-itemition="right"
              :min="0"
            />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer tc">
          <el-button type="primary" @click="submitForm" :disabled="formLoading"
            >确 定</el-button
          >
          <el-button @click="dialogVisible = false">取 消</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import * as ProjectLibraryApi from "@/api/ser/projectlibrary";
import * as NextLibApi from "@/api/ser/librarysubproject/nextLib";

export default {
  name: "ProjectLibraryForm",
  components: {},
  watch:{
    'formData.enableTime'(val){
        if(val){
            this.formData.enableTimeStart = val[0]
            this.formData.enableTimeEnd = val[1]
        }
    }
  },
  data() {
    return {
      // 弹出层标题
      dialogTitle: "新增服务库",
      // 是否显示弹出层
      dialogVisible: false,
      // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
      formLoading: false,
      setOptions: [],
      // 表单参数
      formData: {
        id: undefined,
        name: undefined,
        noDeleted: undefined,
        enableTime: undefined,
        type: 0,
      },
      //   是否修改
      mod: false,
      pickerOptions: {
        disabledDate(time) {
          // 创建一个当前月份的第一天和最后一天的日期对象
          const currentMonthFirstDay = new Date(
            new Date().getFullYear(),
            new Date().getMonth(),
            1
          );
          const currentMonthLastDay = new Date(
            new Date().getFullYear(),
            new Date().getMonth() + 1,
            0
          );

          // 如果传入的日期在当前月份之前，就返回 true，表示这个日期是禁用的
          return time.getTime() < currentMonthFirstDay.getTime();
        },
      },
      // 表单校验
      formRules: {
        name: [
          { required: true, message: "请输入项目库名称", trigger: "blur" },
        ],
        status: [
          { required: true, message: "请选择启用状态", trigger: "blur" },
        ],
        replaceId: [
          { required: true, message: "请选择替换套餐", trigger: "blur" },
        ],
        enableTime: [
          { required: true, message: "请选择月份", trigger: "blur" },
        ],
        type: [{ required: true, message: "请选择套餐类型", trigger: "blur" }],
      },
    };
  },
  methods: {
    printa(v) {
    //   console.log(v);
    },
    /** 打开弹窗 */
    async open(id, list, parentId) {
      this.reset();
      this.dialogVisible = true;
      // 修改时，设置数据
      if (list) {
        this.setOptions = list;
      }
      if (id) {
        this.mod = true;
        this.formLoading = true;
        try {
          if (parentId == 0) {
            const res = await ProjectLibraryApi.getProjectLibrary(id);
            this.formData = res.data;
          } else {
            const res = await NextLibApi.getNextInfo(id);
            this.formData = res.data;
          }
          this.dialogTitle = "修改服务库";
          if (parentId || parentId == 0) {
            if (parentId == 0) {
              this.formData.type = 0;
            } else {
              this.formData.type = 1;
            }
          }
          this.formData.enableTime=[]
          this.formData.enableTime.push(this.formData.enableTimeStart)
          this.formData.enableTime.push(this.formData.enableTimeEnd)
        } finally {
          this.formLoading = false;
        }
      } else {
        this.mod = false;
        this.dialogTitle = "新增服务库";
      }
    },
    formatted(time) {
      if (time && time.getFullYear) {
        const year = time.getFullYear();
        const month = (time.getMonth() + 1).toString().padStart(2, "0");
        return `${year}-${month}`;
      }
      return time;
    },
    /** 提交按钮 */
    async submitForm() {
      // 校验主表
      await this.$refs["formRef"].validate();
      this.formLoading = true;
      console.log(this.formData.enableTime);
      try {
        const data = this.formData;
        // 草稿箱提交
        if (data.type == 1) {
          if (data.id) {
            await NextLibApi.updateNext(data);
            this.$modal.msgSuccess("修改成功");
            this.dialogVisible = false;
            this.$emit("success");
            return;
          }
          await NextLibApi.createNext(data).then((res) => {
            this.$modal.msgSuccess("新增成功");
          });
          // 套餐提交
        } else {
          // 修改的
          if (data.id) {
            await ProjectLibraryApi.updateProjectLibrary(data);
            this.$modal.msgSuccess("修改成功");
            this.dialogVisible = false;
            this.$emit("success");
            return;
          }
          // 添加的提交
          await ProjectLibraryApi.createProjectLibrary(data);
          this.$modal.msgSuccess("新增成功");
        }

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
        noDeleted: undefined,
      };
      this.resetForm("formRef");
    },
  },
};
</script>
