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
        <el-form-item label="上级类型">
          <treeselect
            v-model="formData.parentId"
            :options="menuOptions"
            :normalizer="normalizer"
            :show-count="true"
            placeholder="选择上级类型"
          />
        </el-form-item>

        <el-form-item label="选择层级" prop="level">
          <el-radio-group v-model="formData.level">
            <el-radio
              v-for="dict in menuTypeDictDatas"
              :key="parseInt(dict.value)"
              :label="parseInt(dict.value)"
            >
              {{ dict.label }}</el-radio
            >
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if="formData.level==3" label="标签类型" prop="targetType">
          <el-radio-group v-model="formData.targetType" @input="changeTargetType">
            <el-radio label="0">指标</el-radio>
            <el-radio label="1">特征标签</el-radio>
          </el-radio-group> </el-form-item
        >
        <el-form-item
          v-if="formData.targetType == 1&&formData.level==3"
          label="标签编号"
          prop="targetNumber"
        >
          <el-input
            v-model="formData.targetNumber"
            placeholder="请输入标签编号"
          />
        </el-form-item>
        <el-form-item
          v-if="formData.targetType == 1 &&formData.level==3"
          label="标签类型"
          prop="targetAttribute "
        >
          <el-radio-group v-model="formData.targetAttribute">
            <el-radio label="1"> 定量标签</el-radio>
            <el-radio label="2"> 定性标签</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="标签名称" prop="name">
          <el-input v-model="formData.name" placeholder="请输入标签名称" />
        </el-form-item>
        <el-form-item label="取值方式" v-if="formData.level == 3">
          <el-select
            v-model="formData.valueMethod"
            placeholder="请选择取值方式"
          >
            <el-option
              v-for="item in typeList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if="formData.level == 3 && formData.targetType==='0'" label="分数" prop="score">
          <el-input v-model="formData.score" placeholder="请输入分数" />
        </el-form-item>
        <el-form-item
          label="计算方式 "
          prop="calculateMethod"
          v-if="
            formData.level == 3 &&
            formData.valueMethod == 1 &&
            formData.targetType=== '0'
          "
        >
          <el-select
            v-model="formData.calculateMethod"
            placeholder="请选择计算方式"
          >
            <el-option
              v-for="item in calculateMethodList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="计算方式 "
          prop="calculateMethod"
          v-else-if="
            formData.level == 3 &&
            formData.valueMethod == 1 &&
            formData.targetType=== '1'
          "
        >
          <el-select
            v-model="formData.calculateMethod"
            filterable
            placeholder="请选择计算方式"
          >
            <el-option
              v-for="item in calculateMethodList2"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          v-if="
            formData.level == 3 &&
            formData.valueMethod == 1 &&
            formData.calculateMethod == 1
          "
          label="计算公式"
        >
          <el-select
            class="w200 mr10"
            v-model="firstY"
            placeholder="请选择计算方式 "
          >
            <el-option
              v-for="item in cMethodY"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
          <el-select
            class="w55 mr10"
            v-if="formData.calculateMethod == 1"
            v-model="cusmethod"
            placeholder="请选择计算方法"
          >
            <el-option
              v-for="item in computedList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
          <el-select
            class="w200"
            v-if="formData.calculateMethod == 1"
            v-model="secY"
            placeholder="请选择统计类型 "
          >
            <el-option
              v-for="item in cMethodY"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item
          label="统计类型"
          prop="countType"
          v-if="formData.level == 3"
        >
          <el-select v-model="formData.countType" placeholder="请选择统计类型 ">
            <el-option
              v-for="item in countTypeList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="说明或计算规则"
          prop="remark"
          v-if="formData.level == 3"
        >
          <el-input
            v-model="formData.remark"
            type="textarea"
            :rows="2"
            placeholder="请输入说明或计算规则"
          />
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
import * as TargetApi from "@/api/cust/target";
import { dlistAllSimple } from "@/api/system/dict/type";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import {
  countTypeList,
  calculateMethodList,
  calculateMethodList2,
  computedList,
} from "@/utils/myDicts";
export default {
  name: "TargetForm",
  components: {},
  data() {
    return {
      // 弹出层标题
      dialogTitle: "",
      // 是否显示弹出层
      dialogVisible: false,
      // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
      formLoading: false,
      countTypeList,
      calculateMethodList,
      calculateMethodList2,
      computedList,
      firstY: "",
      cusmethod: "",
      secY: "",
      // 数据字典
      menuTypeDictDatas: [
        {
          label: "标签维度",
          value: 1,
        },
        {
          label: "一级指标",
          value: 2,
        },
        {
          label: "二级指标",
          value: 3,
        },
      ],
      // 表单参数
      formData: {
        id: undefined,
        name: undefined,
        score: undefined,
        remark: undefined,
        countType: undefined,
        level: undefined,
        parentId: undefined,
        parents: undefined,
        calculateMethod:undefined,
        calculateRule:undefined,
        valueMethod:undefined
      },
      cMethodY: [],
      // 表单校验
      typeList: [
        {
          label: "系统取值",
          value: "1",
        },
        {
          label: "手动录入",
          value: "2",
        },
      ],
      formRules: {
        level: [{ required: true, message: "层级不能为空", trigger: "blur" }],
        name: [
          { required: true, message: "标签名称不能为空", trigger: "blur" },
        ],
        score: [{ required: true, message: "分值不能为空", trigger: "blur" }],
        calculateMethod: [
          { required: true, message: "计算方式不能为空", trigger: "blur" },
        ],
        countType: [
          { required: true, message: "统计类型不能为空", trigger: "blur" },
        ],
      },
      menuOptions: [],
    };
  },
  watch: {
    firstY(val) {
      this.formData.calculateRule =
        val + this.cusmethod + this.secY + "*" + this.formData.score;
    },
    cusmethod(val) {
      this.formData.calculateRule =
        this.firstY + val + this.secY + "*" + this.formData.score;
    },
    secY(val) {
      this.formData.calculateRule =
        this.firstY + this.cusmethod + val + "*" + this.formData.score;
    },
  },
  components: { Treeselect },
  methods: {
    /** 打开弹窗 */
    async open(row) {
      this.dialogVisible = true;
      this.reset();
      this.getTreeselect();
      this.getSip();
      if (row != null && row.id) {
        console.log(row);
        // 计算第一个因子的正则
        const regex = /{([^{}]+)}/;
        // 计算字符的正则
        const regex2 = /}(.)/;
        // 计算第二个因子的正则
        const regex3 = /{[^{}]*}.*{([^{}]*)}/;
        if (row.calculateRule != "") {
          const match = row.calculateRule.match(regex);
          const match2 = row.calculateRule.match(regex2);
          const match3 = row.calculateRule.match(regex3);
          this.firstY = match[0];
          this.cusmethod = match2[1];
          this.secY = "{" + match3[1] + "}";
        }
        this.formData = row;
      } else if (row&&row.parentId) {
        this.formData = row;
        console.log(this.formData);
      } else {
        this.formData.parentId = 0;
      }
      this.dialogVisible = true;
      this.title = "添加标签名称";
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
          await TargetApi.updateTarget(data);
          this.$modal.msgSuccess("修改成功");
          this.dialogVisible = false;
          this.$emit("success");
          return;
        }
        // 添加的提交
        await TargetApi.createTarget(data);
        this.$modal.msgSuccess("新增成功");
        this.dialogVisible = false;
        this.$emit("success");
      } finally {
        this.formLoading = false;
      }
    },
    /** 查询菜单下拉树结构 */
    getTreeselect() {
      TargetApi.getTargetPage().then((response) => {
        this.menuOptions = [];
        const menu = { id: 0, name: "标签维度", children: [] };
        menu.children = this.handleTree(response.data, "id");
        this.menuOptions.push(menu);
      });
    },
    getSip() {
      dlistAllSimple({ dictType: "cust_target_calculate_factor" }).then(
        (res) => {
          if (res.code === 0) {
            this.cMethodY = res.data;
          }
        }
      );
    },
    /** 转换菜单数据结构 */
    normalizer(node) {
      if (node.children && !node.children.length) {
        delete node.children;
      }
      return {
        id: node.id,
        label: node.name,
        children: node.children,
      };
    },
    changeTargetType(){
        this.formData.calculateMethod=undefined
        this.formData.valueMethod=undefined
    },
    /** 表单重置 */
    reset() {
      this.formData = {
        id: undefined,
        name: undefined,
        score: undefined,
        remark: undefined,
        countType: undefined,
        level: undefined,
        parentId: undefined,
        parents: undefined,
        calculateMethod:undefined,
        calculateRule:undefined,
        valueMethod:undefined
      };
    //   this.resetForm("formRef");
    },
  },
};
</script>
<style>
.w200 {
  width: 200px;
}
.w55 {
  width: 55px;
}
</style>
