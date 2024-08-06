<template>
  <div class="app-container">
    <!-- 搜索工作栏 -->
    <Schedule :stepNum="2" />
    <el-form
      :model="queryParams"
      ref="queryForm"
      size="small"
      :inline="true"
      v-show="showSearch"
    >
      <el-form-item label="服务名称" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入服务名称"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <!-- <el-form-item label="项目编号" prop="projectNumber">
        <el-input
          v-model="queryParams.projectNumber"
          placeholder="请输入项目编号"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item> -->
      <el-form-item label="响应机制" prop="status">
        <el-select
          v-model="queryParams.respMechanism"
          placeholder="响应机制"
          clearable
        >
          <el-option
            v-for="dict in statusDictDatas"
            :key="parseInt(dict.value)"
            :label="dict.label"
            :value="parseInt(dict.value)"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="拜访频次" prop="status">
        <el-select
          v-model="queryParams.timeResource"
          placeholder="拜访频次"
          clearable
        >
          <el-option
            v-for="dict in timeResourceList"
            :key="parseInt(dict.value)"
            :label="dict.label"
            :value="parseInt(dict.value)"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="媒体资源配置" prop="mediaResource">
        <el-select
          v-model="queryParams.mediaResource"
          placeholder="媒体资源配置"
          clearable
        >
          <el-option
            v-for="dict in mediaResourceList"
            :key="parseInt(dict.value)"
            :label="dict.label"
            :value="parseInt(dict.value)"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="handleQuery"
          >搜索</el-button
        >
        <el-button icon="el-icon-refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['system:menu:create']"
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
      :data="menuList"
      :default-expand-all="isExpandAll"
      row-key="id"
      :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
    >
      <el-table-column
        prop="name"
        label="服务类型/服务模块/服务项目"
        :show-overflow-tooltip="true"
        width="250"
        >
        <template v-slot="scope">
            <span :class="scope.row.level==1? 'menu-name-level-1':scope.row.level==2? 'menu-name-level-2':scope.row.level==3? 'menu-name-level-3':''">
                {{ scope.row.name }}
            </span>
            </template
      ></el-table-column>
      <el-table-column
        prop="remark"
        label="服务内容描述"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        prop="respMechanism"
        label="响应机制"
        :show-overflow-tooltip="true"
      >
        <template v-slot="scope">
          <div
            v-if="
              scope.row &&
              scope.row.respMechanism &&
              scope.row.respMechanism[0] &&
              scope.row.respMechanism[0].mechanism == 1
            "
          >
            主动式定时
          </div>
          <div
            v-if="
              scope.row &&
              scope.row.respMechanism &&
              scope.row.respMechanism[0] &&
              scope.row.respMechanism[0].mechanism == 2
            "
          >
            交互式
          </div>
          <div
            v-if="
              scope.row &&
              scope.row.respMechanism &&
              scope.row.respMechanism[0] &&
              scope.row.respMechanism[0].mechanism == 3
            "
          >
            应急式
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="timeResource"
        label="拜访频次"
        :show-overflow-tooltip="true"
        width="250"
      >
        <template v-slot="scope">
          <div v-for="item in scope.row.respMechanism" :key="item.id">
            <div v-if="item.timeResource == 2">
              <span v-if="item.terminalType == 1">城网加盟</span>
              <span v-if="item.terminalType == 2">城网</span>
              <span v-if="item.terminalType == 3">农网加盟</span>
              <span v-if="item.terminalType == 4">农网</span>
              <span>{{
                item.customerTypeName ? item.customerTypeName : ""
              }}</span
              >一月两次
            </div>
            <div v-if="item.timeResource == 3">
              <span v-if="item.terminalType == 1">城网加盟</span>
              <span v-if="item.terminalType == 2">城网</span>
              <span v-if="item.terminalType == 3">农网加盟</span>
              <span v-if="item.terminalType == 4">农网</span>
              <span>{{
                item.customerTypeName ? item.customerTypeName : ""
              }}</span
              >一月一次
            </div>
            <div v-if="item.timeResource == 4">
              <span v-if="item.terminalType == 1">城网加盟</span>
              <span v-if="item.terminalType == 2">城网</span>
              <span v-if="item.terminalType == 3">农网加盟</span>
              <span v-if="item.terminalType == 4">农网</span>
              <span>{{
                item.customerTypeName ? item.customerTypeName : ""
              }}</span
              >一季度一次
            </div>
            <div v-if="item.timeResource == 0">
              <span>{{
                item.customerTypeName ? item.customerTypeName : ""
              }}</span
              >单次服务
            </div>
            <div v-if="item.timeResource == 7">
              <span>{{
                item.customerTypeName ? item.customerTypeName : ""
              }}</span
              >即时
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="mediaResource"
        label="媒介资源配置"
        :show-overflow-tooltip="true"
      >
        <template v-slot="scope">
          {{ scope.row.mediaResource.substring(0, 1) == 1 ? "远程服务" : "" }}
          {{ scope.row.mediaResource.substring(1, 2) == 1 ? "现场服务" : "" }}
          {{ scope.row.mediaResource.substring(2, 3) == 1 ? "自助服务" : "" }}
          {{ scope.row.mediaResource.substring(3, 4) == 1 ? "互助服务" : "" }}
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        class-name="small-padding fixed-width"
        width="150"
      >
        <template v-slot="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['system:menu:update']"
            >修改</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-plus"
            @click="handleAdd(scope.row)"
            v-hasPermi="['system:menu:create']"
            >新增</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:menu:delete']"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <!-- 添加或修改菜单对话框 -->
    <el-dialog
      :title="title"
      :visible.sync="open"
      width="900px"
      append-to-body
      @closed="getCusType"
    >
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="上级服务">
              <treeselect
                v-model="form.parentId"
                :options="menuOptions"
                :normalizer="normalizer"
                :show-count="true"
                placeholder="选择上级服务"
              />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="服务类型" prop="level">
              <el-radio-group v-model="form.level">
                <el-radio
                  v-for="(dict, inx) in menuTypeDictDatas"
                  :key="inx"
                  :label="dict.value"
                >
                  {{ dict.label }}</el-radio
                >
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="服务名称" prop="name">
              <el-input v-model="form.name" placeholder="请输入服务名称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="排序" prop="projectNumber">
              <el-input-number
                controls-position="right"
                v-model="form.sort"
                el-form-itemition="right"
                :min="0"
              />
            </el-form-item>
          </el-col>
          <el-col :span="24" v-if="form.level === 3">
            <el-form-item label="项目类型" prop="projectType">
              <el-radio-group v-model="form.projectType">
                <el-radio label="0">普通类型</el-radio>
                <el-radio label="1">预警类型</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item
              label="计算方式 "
              prop="calculateMethod"
              v-if="form.level == 3 && form.projectType == 1"
            >
              <el-select
                v-model="form.calculateMethod"
                placeholder="请选择计算方式 "
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
              v-if="form.level == 3 && form.projectType == 1"
              label="计算公式"
            >
              <div
                class="mb15"
                v-for="(item, index) in formulaList"
                :key="index"
              >
                <el-select
                  class="w200 mr10"
                  v-model="item.firstY"
                  placeholder="请选择计算因子"
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
                  class="w200 mr10"
                  v-if="form.calculateMethod == 1 && form.projectType == 1"
                  v-model="item.cusmethod"
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
                  v-if="form.calculateMethod == 1 && form.projectType == 1"
                  v-model="item.secY"
                  placeholder="请选择计算因子"
                >
                  <el-option
                    v-for="item in cMethodY"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
                <div class="flex mt-15">
                  <el-select
                    class="w200 mr10"
                    v-model="item.compareSymbol"
                    placeholder="请选择规则"
                  >
                    <el-option
                      v-for="item in operatorList"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    >
                    </el-option>
                  </el-select>
                  <el-input
                    class="w200"
                    v-model="item.compareValue"
                    placeholder="请输入值"
                  ></el-input>
                  <el-button
                    v-if="index > 0"
                    class="removeBtn"
                    @click="deleteRules(index)"
                    type="danger"
                    >删除</el-button
                  >
                </div>
              </div>
              <el-button class="addRule" @click="addOneRule" type="primary"
                >添加</el-button
              >
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item
              label="公式关系"
              prop="dataType"
              v-if="form.level == 3 && formulaList.length > 1"
            >
              <el-radio-group v-model="form.dataType">
                <el-radio label="1">且</el-radio>
                <el-radio label="2">或</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="24" v-if="form.projectType == 1">
            <el-form-item label="预警周期" prop="warnCycle">
              <el-radio-group v-model="form.warnCycle">
                <el-radio label="1">一周一次</el-radio>
                <el-radio label="3">一月一次</el-radio>
                <el-radio label="4">一季度一次</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item
              v-if="form.level == 3"
              label="服务内容描述"
              prop="remark"
            >
              <el-input
                type="textarea"
                :rows="2"
                v-model="form.remark"
                placeholder="请输入服务内容描述"
              />
            </el-form-item>
          </el-col>
          <div v-if="form.level === 3 && form.projectType == 0">
            <div class="border">
              <el-col
                :span="24"
                v-if="form.level == 3 && form.projectType == 0"
              >
                <el-form-item label="响应机制" prop="mechanism">
                  <el-radio-group v-model="form.mechanism">
                    <el-radio label="1">主动式</el-radio>
                    <el-radio label="2">交互式</el-radio>
                    <el-radio label="3">应急式</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
              <el-col :span="24" v-if="form.level === 3 && form.mechanism">
                <el-form-item v-if="form.mechanism == 2" label="拜访频次">
                  <el-checkbox-group v-model="form.timeResources">
                    <el-checkbox label="0">单次服务</el-checkbox>
                    <el-checkbox label="2">一月两次</el-checkbox>
                    <el-checkbox label="3">一月一次</el-checkbox>
                    <el-checkbox label="4">一季度一次</el-checkbox>
                  </el-checkbox-group>
                </el-form-item>
                <el-form-item
                  v-else-if="form.level === 3 && form.mechanism == 3"
                  label="拜访频次"
                >
                  <el-radio-group v-model="form.timeResource">
                    <el-radio v-if="form.mechanism == 3" label="7"
                      >即时</el-radio
                    >
                  </el-radio-group>
                </el-form-item>
                <el-form-item
                  label="拜访频次"
                  v-if="form.level === 3 && form.mechanism == 1"
                >
                  <el-radio-group v-model="form.relevanceType">
                    <el-radio v-if="form.mechanism == 1" label="2"
                      >按终端类型分配</el-radio
                    >
                    <el-radio v-if="form.mechanism == 1" label="1"
                      >按客户类型匹配</el-radio
                    >
                  </el-radio-group>
                </el-form-item>
              </el-col>
            </div>
          </div>
          <div
            v-if="
              form.relevanceType == 1 &&
              form.mechanism == 1 &&
              form.projectType == 0
            "
          >
            <el-col :span="12" v-for="it in cusType" :key="it.id">
              <el-form-item :label="it.name">
                <el-select v-model="it.timeResource" placeholder="请选择频次">
                  <el-option label="一月两次" value="2"> </el-option>
                  <el-option label="一月一次" value="3"> </el-option>
                  <el-option label="一季度一次" value="4"> </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </div>
          <div
            v-if="
              form.relevanceType == 2 &&
              form.mechanism == 1 &&
              form.projectType == 0
            "
          >
            <el-col :span="12" v-for="it in terminalType" :key="it.id">
              <el-form-item :label="it.name">
                <el-select v-model="it.timeResource" placeholder="请选择频次">
                  <el-option label="一月两次" value="2"> </el-option>
                  <el-option label="一月一次" value="3"> </el-option>
                  <el-option label="一季度一次" value="4"> </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </div>
          <el-col :span="24" v-if="form.level === 3 && form.projectType == 0">
            <el-form-item label="媒体资源配置">
              <el-checkbox v-model="checkedMedia1" @change="changeMedia"
                >远程服务</el-checkbox
              >
              <el-checkbox v-model="checkedMedia2" @change="changeMedia"
                >现场服务</el-checkbox
              >
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import * as viceProjectApi from "@/api/ser/serviceproject";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import IconSelect from "@/components/IconSelect";
import { dlistAllSimple } from "@/api/system/dict/type";
import { getomerTypePage } from "@/api/cust/customertype";
import Schedule from "@/components/schedule";

import { SystemMenuTypeEnum, CommonStatusEnum } from "@/utils/constants";
import { computedList, operatorList } from "@/utils/myDicts";
import { co } from "@fullcalendar/core/internal-common";

export default {
  name: "SystemMenu",
  components: { Treeselect, Schedule, IconSelect },
  data() {
    return {
      //响应机制
      //公式数组
      formulaList: [
        {
          firstY: "",
          cusmethod: "",
          secY: "",
          compareSymbol: "",
          compareValue: "",
        },
      ],
      //媒体资源配置
      checkedMedia1: false,
      checkedMedia2: false,
      checkedMedia3: false,
      checkedMedia4: false,
      computedList,
      operatorList,
      // 遮罩层
      loading: true,
      // 显示搜索条件
      showSearch: true,
      // 菜单表格树数据
      menuList: [],
      // 菜单树选项
      menuOptions: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 是否展开，默认全部折叠
      isExpandAll: false,
      // 重新渲染表格状态
      refreshTable: true,
      // 查询参数
      queryParams: {
        name: undefined,
        visible: undefined,
      },
      // 表单参数
      form: {
        projectType: 0,
        mediaResource: "0000",
        timeResources: [],
        relevanceType: undefined,
        mechanism: "",
        sort: "",
        calculateMethod: "",
      },
      // 表单校验
      rules: {
        level: [
          { required: true, message: "服务类型不能为空", trigger: "blur" },
        ],
        name: [
          { required: true, message: "菜单名称不能为空", trigger: "blur" },
        ],
        mechanism: [
          { required: true, message: "响应机制不能为空", trigger: "blur" },
        ],
        timeResource: [
          { required: true, message: "时间资源配置不能为空", trigger: "blur" },
        ],
        mediaResource: [
          { required: true, message: "媒体资源配置不能为空", trigger: "blur" },
        ],
        calculateMethod: [
          { required: true, message: "计算方式不能为空", trigger: "blur" },
        ],
        dataType: [
          { required: true, message: "公式关系不能为空", trigger: "blur" },
        ],
        warnCycle: [
          { required: true, message: "预警周期不能为空", trigger: "blur" },
        ],
        // projectNumber: [
        //   { required: true, message: "项目编号不能为空", trigger: "blur" },
        // ],
      },
      //   计算方式
      calculateMethodList: [
        {
          label: "公式",
          value: "1",
        },
        {
          label: "单值",
          value: "2",
        },
      ],
      // 枚举
      MenuTypeEnum: SystemMenuTypeEnum,
      CommonStatusEnum: CommonStatusEnum,
      //   人员类型
      manOptions: [
        {
          value: "ⅠⅡⅢⅣⅤⅥⅦⅧⅨ",
        },
      ],
      // 数据字典
      menuTypeDictDatas: [
        {
          label: "服务类型",
          value: 1,
        },
        {
          label: "服务模块",
          value: 2,
        },
        {
          label: "服务项目",
          value: 3,
        },
      ],
      //计算公式
      cMethodY: [],
      statusDictDatas: [
        { label: "主动式", value: "100" },
        { label: "交互式", value: "010" },
        { label: "应急式", value: "001" },
      ],
      cusType: [],
      terminalType: [
        { name: "城网加盟", id: "1", timeResource: undefined },
        { name: "城网", id: "2", timeResource: undefined },
        { name: "农网加盟", id: "3", timeResource: undefined },
        { name: "农网", id: "4", timeResource: undefined },
      ],

      timeResourceList: [
        { label: "一月两次", value: "01000" },
        { label: "一月一次", value: "00100" },
        { label: "一季度一次", value: "00010" },
      ],
      mediaResourceList: [
        { label: "远程服务", value: "1000" },
        { label: "现场服务", value: "0100" },
      ],
    };
  },
  created() {
    this.getList();
    this.getCusType();
  },
  watch: {
    "form.calculateMethod"(newvalue, oldvalue) {
      if (newvalue && oldvalue) {
        this.formulaList = [
          {
            firstY: "",
            cusmethod: "",
            secY: "",
            compareSymbol: "",
            compareValue: "",
          },
        ];
      }
    },
    "form.mechanism"(newvalue, oldvalue) {
      if (newvalue == 2 && oldvalue) {
        this.form.timeResources = [];
      } else if (newvalue) {
        // this.form.timeResources = "";
      }
    },
  },
  methods: {
    getCusType() {
      getomerTypePage().then((res) => {
        this.cusType = res.data;
      });
    },
    // 添加计算公式
    addOneRule() {
      this.formulaList.push({
        firstY: "",
        cusmethod: "",
        secY: "",
        compareSymbol: "",
        compareValue: "",
      });
    },
    // shh=洒点
    deleteRules(index) {
      this.formulaList.splice(index, 1);
    },
    /** 查询菜单列表 */
    getList() {
      this.loading = true;
      viceProjectApi.getviceProjectPage(this.queryParams).then((response) => {
        // 按sort属性排序
        response.data.sort(function (a, b) {
          return a.sort - b.sort;
        });
        this.menuList = this.handleTree(response.data, "id");
        this.loading = false;
      });
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
    /** 查询菜单下拉树结构 */
    getTreeselect() {
      viceProjectApi.getviceProjectPage().then((response) => {
        this.menuOptions = [];
        const menu = { id: 0, name: "服务类型", children: [] };
        menu.children = this.handleTree(response.data, "id");
        this.menuOptions.push(menu);
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    changeMedia() {
      this.form.mediaResource =
        (this.checkedMedia1 ? "1" : "0") +
        (this.checkedMedia2 ? "1" : "0") +
        (this.checkedMedia3 ? "1" : "0") +
        (this.checkedMedia4 ? "1" : "0");
    },
    getSip() {
      dlistAllSimple({ dictType: "ser_warn_calculate_factor" }).then((res) => {
        if (res.code === 0) {
          this.cMethodY = res.data;
        }
      });
    },
    // 表单重置
    reset() {
      (this.form = {
        projectType: "0",
        mediaResource: "0000",
        timeResources: [],
        mechanism: "",
        level: "",
        sort: "",
        relevanceType: undefined,
        calculateMethod: "",
      }),
        (this.checkedMedia1 = false);
      this.checkedMedia2 = false;
      this.checkedMedia3 = false;
      this.checkedMedia4 = false;
      this.formulaList = [
        {
          firstY: "",
          cusmethod: "",
          secY: "",
          compareSymbol: "",
          compareValue: "",
        },
      ];
      //   this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    /** 展开/折叠操作 */
    toggleExpandAll() {
      this.refreshTable = false;
      this.isExpandAll = !this.isExpandAll;
      this.$nextTick(() => {
        this.refreshTable = true;
      });
    },
    /** 新增按钮操作 */
    handleAdd(row) {
      this.reset();
      this.getTreeselect();
      if (row != null && row.id) {
        this.form.parentId = row.id;
        if (row.level < 3) {
          this.form.level = row.level + 1;
        } else {
          this.form.level = 3;
        }
      } else {
        this.form.parentId = 0;
      }
      this.getSip();
      this.open = true;
      this.title = "添加服务项目";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      this.getTreeselect();
      viceProjectApi.getviceProject(row.id).then((response) => {
        this.$nextTick(() => {
          response.data.timeResources = [];
          if (
            response.data.respMechanism != null &&
            response.data.respMechanism.length > 0
          ) {
            response.data.mechanism = response.data.respMechanism[0].mechanism;
            response.data.relevanceType =
              response.data.respMechanism[0].relevanceType;
            if (
              response.data.mechanism == 1 &&
              response.data.relevanceType == 1 &&
              response.data.respMechanism.length > 1
            ) {

              this.cusType.forEach((item, index) => {
                item.timeResource =
                  response.data.respMechanism[index].timeResource;
              });
            } else if (
              response.data.mechanism == 1 &&
              response.data.relevanceType == 2 &&
              response.data.respMechanism.length > 1
            ) {
              this.terminalType.forEach((item, index) => {
                item.timeResource =
                  response.data.respMechanism[index].timeResource;
              });
            } else if (
              response.data.mechanism == 1 ||
              response.data.mechanism == 3
            ) {
              response.data.timeResource =
                response.data.respMechanism[0].timeResource;
            } else {
              response.data.timeResources = [];
              response.data.respMechanism.forEach((item, index) => {
                response.data.timeResources.push(item.timeResource);
              });
            }
          }
          this.checkedMedia1 =
            response.data.mediaResource.substring(0, 1) == 1 ? true : false;
          this.checkedMedia2 =
            response.data.mediaResource.substring(1, 2) == 1 ? true : false;
          this.checkedMedia3 =
            response.data.mediaResource.substring(2, 3) == 1 ? true : false;
          this.checkedMedia4 =
            response.data.mediaResource.substring(3, 4) == 1 ? true : false;
          this.getSip();
          if (row != null && row.id) {
            // 计算第一个因子的正则
            let regex = /{([^{}]+)}/;
            // 计算字符的正则
            let regex2 = /}(.)/;
            // 计算第二个因子的正则
            let regex3 = /{[^{}]*}.*{([^{}]*)}/;
            if (
              response.data.warnMethods &&
              response.data.warnMethods.length != 0
            ) {
              response.data.warnMethods.forEach((item) => {
                let match = item.calculateRule.match(regex);
                let match2 = item.calculateRule.match(regex2) || "";
                let match3 = item.calculateRule.match(regex3) || "";
                // 数据响应式更新
                if(match&&match[0]!= undefined && match2[1] != "" && match2[1] != null){
                    this.$set(item, "firstY", match[0]);
                }
                if (match2[1] != undefined && match2[1] != "" && match2[1] != null) {
                  this.$set(item, "cusmethod", match2[1]);
                }
                if (match3[1] != undefined && match3[1] != "" && match3[1] != null) {
                    console.log(2)
                  this.$set(item, "secY", "{" + match3[1] + "}");
                  item.secY = "{" + match3[1] + "}";
                }
              });
              this.formulaList = response.data.warnMethods;
            }
            this.form = response.data;
          }
          this.open = true;
          if (row.level == 1) {
            this.title = "修改服务类型";
          } else if (row.level == 2) {
            this.title = "修改服务模块";
          } else {
            this.title = "修改服务项目";
          }
        });
      });
    },
    /** 提交按钮 */
    submitForm: function () {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (
            this.form.mediaResource == "0000" &&
            this.form.level == 3 &&
            this.form.projectType == 0
          ) {
            this.$message.error("请选择媒体资源");
            return;
          }
          // 按客户类型匹配
          if (this.form.mechanism == 1 && this.form.relevanceType == 1) {
            this.form.respMechanism = [];
            this.cusType.forEach((item) => {
              if (item.timeResource) {
                this.form.respMechanism.push({
                  mechanism: this.form.mechanism,
                  timeResource: item.timeResource,
                  customerType: item.id,
                  relevanceType: 1,
                });
              }
            });
            // 主动式或者应急式
          } else if (this.form.mechanism == 1 && this.form.relevanceType == 2) {
            this.form.respMechanism = [];
            this.terminalType.forEach((item) => {
              if (item.timeResource) {
                this.form.respMechanism.push({
                  mechanism: this.form.mechanism,
                  timeResource: item.timeResource,
                  terminalType: item.id,
                  relevanceType: 2,
                });
              }
            });
            // 主动式或者应急式
          } else if (this.form.mechanism == 3) {
            this.form.respMechanism = [
              {
                mechanism: this.form.mechanism,
                timeResource: this.form.timeResource,
              },
            ];
            // 交互式
          } else if (this.form.mechanism == 2) {
            this.form.respMechanism = [];
            this.form.timeResources.forEach((item) => {
              this.form.respMechanism.push({
                mechanism: this.form.mechanism,
                timeResource: item,
              });
            });
          }

          if (this.form.level == 3 && this.form.projectType == 1) {
            this.formulaList.forEach((item, index) => {
              item.calculateRule =
                item.firstY +
                (item.cusmethod == undefined ? "" : item.cusmethod) +
                (item.secY == undefined ? "" : item.secY);
              delete item.firstY;
              delete item.cusmethod;
              delete item.secY;
            });
            this.form.warnMethods = this.formulaList;
          }
          //   return
          // 提交
          if (this.form.id !== undefined) {
            viceProjectApi.updateviceProject(this.form).then((response) => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            viceProjectApi.createviceProject(this.form).then((response) => {
              this.$modal.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      this.$modal
        .confirm('是否确认删除名称为"' + row.name + '"的数据项?')
        .then(function () {
          return viceProjectApi.deleteviceProject(row.id);
        })
        .then(() => {
          this.getList();
          this.$modal.msgSuccess("删除成功");
        })
        .catch(() => {});
    },
  },
};
</script>
<style lang="scss" scoped>
.titleKey {
  color: #606266;
  font-weight: bold;
  padding-right: 12px;
}
// .border {
//   border: 1px solid #dedede;
//   padding: 20px 0;
//   float: left;
//   border-radius: 6px;
// }
.w200 {
  width: 200px;
}
.addRule {
  margin-left: 555px;
}
.removeBtn {
  margin-left: 145px;
}
.menu-name-level-1{
    // color: #409eff;
    font-weight: bold;
}
.menu-name-level-2{
    // color: #53A8FF;
}
.menu-name-level-3{
    color: #409eff;
}
</style>
<style>
.el-form-item__label {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
