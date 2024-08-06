<template>
  <!-- 添加或修改参数配置对话框 -->
  <el-drawer
    :title="title"
    :visible.sync="dialogVisible"
    size="80%"
    class=""
    @open="getTreeselect"
    @close="cancel"
    append-to-body
  >
    <el-tabs v-model="activeName" @tab-click="">
      <el-tab-pane label="指标维度" name="corrType">
        <el-row :gutter="20">
          <!--部门数据-->
          <el-col :span="5" :xs="24">
            <div class="head-container">
              <el-input
                v-model="deptName"
                placeholder="请输入指标维度名称"
                clearable
                size="small"
                prefix-icon="el-icon-search"
                style="margin-bottom: 20px"
              />
            </div>
            <div class="head-container">
              <el-tree
                :data="deptOptions"
                :props="defaultProps"
                :expand-on-click-node="false"
                :filter-node-method="filterNode"
                ref="tree"
                default-expand-all
                highlight-current
                @node-click="handleNodeClick"
              />
            </div>
          </el-col>
          <el-col :span="19" :xs="24">
            <el-form
              :model="queryParams"
              ref="queryForm"
              size="small"
              :inline="true"
              v-show="showSearch"
            >
              <el-form-item label="项目名称" prop="name">
                <el-input
                  v-model="queryParams.name"
                  placeholder="请输入项目名称"
                  clearable
                  @keyup.enter.native="handleQuery"
                />
              </el-form-item>
              <el-form-item>
                <el-button
                  type="primary"
                  icon="el-icon-search"
                  @click="handleQuery"
                  >搜索</el-button
                >
                <el-button icon="el-icon-refresh" @click="resetQuery"
                  >重置</el-button
                >
              </el-form-item>
            </el-form>
            <el-row :gutter="10" class="mb8">
              <right-toolbar
                :showSearch.sync="showSearch"
                @queryTable="getList(isNext)"
              ></right-toolbar>
            </el-row>
            <el-table
              v-loading="loading"
              :data="menuList"
              ref="multipleTable"
              :row-key="(row) => row.id"
              @selection-change="handleSelectionChange"
            >
              <el-table-column
                :reserve-selection="remember"
                type="selection"
                width="55"
              >
              </el-table-column>
              <el-table-column
                prop="id"
                label="项目编号"
                align="center"
                width="80"
              ></el-table-column>
              <el-table-column
                align="center"
                prop="name"
                label="二级指标名称"
                :show-overflow-tooltip="true"
              ></el-table-column>
              <el-table-column
                align="center"
                prop="score"
                label="分数"
                sortable
                :show-overflow-tooltip="true"
              />
              <el-table-column
                align="center"
                prop="remark"
                label="说明或计算规则"
                :show-overflow-tooltip="true"
              />
              <el-table-column
                label="统计类型"
                width="80"
                align="center"
                prop="countType"
              >
                <template v-slot="scope">
                  <span v-if="scope.row.countType == 1 && scope.row.level == 3"
                    >季度</span
                  >
                  <span v-if="scope.row.countType == 2 && scope.row.level == 3"
                    >月</span
                  >
                  <span v-if="scope.row.countType == 3 && scope.row.level == 3"
                    >实时</span
                  >
                  <span v-if="scope.row.level != 3">/</span>
                </template>
              </el-table-column>
              <el-table-column
                label="取值方式"
                width="80"
                align="center"
                prop="valueMethod"
              >
                <template v-slot="scope">
                  <span
                    v-if="scope.row.valueMethod == 1 && scope.row.level == 3"
                    >系统取值</span
                  >
                  <span
                    v-if="scope.row.valueMethod == 2 && scope.row.level == 3"
                    >手动录入</span
                  >
                  <span v-if="scope.row.level != 3">/</span>
                </template>
              </el-table-column>
            </el-table>
            <pagination
              v-show="total > 0"
              :total="total"
              :page.sync="queryParams.pageNo"
              :limit.sync="queryParams.pageSize"
              @pagination="getList(isNext)"
            />
            <div class="drawaFooter mt30">
              <el-button type="primary" @click="submitForm">确 定</el-button>
              <el-button @click="cancel">取 消</el-button>
            </div>
          </el-col>
        </el-row>
      </el-tab-pane>
      <el-tab-pane label="客户类型" name="cusType">
        <el-row :gutter="20">
          <!--部门数据-->
          <el-col :span="5" :xs="24">
            <div class="head-container">
              <el-tree
                :data="cusOptions"
                :props="defaultProps"
                :expand-on-click-node="false"
                :filter-node-method="filterNode"
                ref="tree2"
                default-expand-all
                highlight-current
                @node-click="handleCusNodeClick"
              />
            </div>
          </el-col>
          <el-col :span="19" :xs="24">
            <el-table
              v-loading="loading"
              :data="cusList"
              ref="multipleCusTable"
              :row-key="(row) => row.id"
              @selection-change="handleCusSelectionChange"
            >
              <el-table-column
                :reserve-selection="remember"
                type="selection"
                width="55"
              >
              </el-table-column>
              <el-table-column
                prop="id"
                label="ID"
                align="center"
                width="80"
              ></el-table-column>
              <el-table-column
                align="center"
                prop="name"
                label="客户类型"
                :show-overflow-tooltip="true"
              ></el-table-column>
              <el-table-column
                v-for="(item, index) in customerTypes"
                :key="item.id"
                :label="item.name"
                align="center"
              >
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
            </el-table>
            <div class="drawaFooter mt30">
              <el-button type="primary" @click="submitForm">确 定</el-button>
              <el-button @click="cancel">取 消</el-button>
            </div>
          </el-col>
        </el-row>
      </el-tab-pane>
    </el-tabs>
    <submitDraw ref="submitDraw" @refresh="cancel"></submitDraw>
  </el-drawer>
</template>

<script>
import * as LibraryApi from "@/api/ser/librarysubproject";
import * as omerTypeApi from "@/api/cust/customertype";
import * as NextLibApi from "@/api/ser/librarysubproject/nextLib";
// import { getModuleList } from "@/api/ser/serviceproject";
import * as TargetApi from "@/api/cust/target";
import submitDraw from "./sumbit.vue";

export default {
  name: "libraryList",
  components: { submitDraw },
  data() {
    return {
      dialogVisible: false,
      deptName: "",
      isNext:false,
      //  指标维度
      deptOptions: [],
      cusOptions: [{ id: "", name: "客户类型", children: [] }],
      defaultProps: {
        children: "children",
        label: "name",
      },
      formData: {},
      //   切换的挡墙tab
      activeName: "corrType",
      queryParams: {
        pageSize: 10,
        pageNo: 1,
        name: undefined,
        visible: undefined,
        projectId: undefined,
      },
      cusQueryParams: {
        projectId: undefined,
      },
      remember: false,
      // 显示搜索条件
      showSearch: true,
      // 弹出层标题
      title: "关联客户",
      // 是否显示弹出层
      total: 0,
      menuList: [],
      //   客户类型列表
      cusList: [],
      loading: false,
      //   选中指标列表
      multipleSelection: [],
      //   选中客户类型列表
      multipleCusSelection: [],
      //  客户维度
      customerTypes: [],
    };
  },
  computed: {},
  watch: {
    // 根据名称筛选部门树
    deptName(val) {
      this.$refs.tree.filter(val);
    },
  },
  created() {
    this.getLevelList();
  },
  methods: {
    // 获取维度
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
    /** 打开弹窗 */
    async open(row, isNext) {
      this.dialogVisible = true;
      this.reset();
      this.isNext=isNext
      this.remember = true;
      // 修改时，设置数据
      this.formData = row;
      this.queryParams.projectId = row.projectId;
      this.cusQueryParams.projectId = row.projectId;
      if (row.projectId) {
        this.getList(isNext);
        this.getCusList(isNext);
      }
    },
    getList(isNext) {
      this.loading = true;
      if (isNext) {
        NextLibApi.targetGetTargets(this.queryParams).then((response) => {
          this.menuList = response.data.list;
          this.total = response.data.total;
          this.loading = false;
          this.toggleSelection(this.menuList, "multipleTable");
        });
      } else {
        LibraryApi.getTargetsPage(this.queryParams).then((response) => {
          this.menuList = response.data.list;
          this.total = response.data.total;
          this.loading = false;
          this.toggleSelection(this.menuList, "multipleTable");
        });
      }
    },
    getCusList(isNext) {
      this.loading = true;
      if (isNext) {
        NextLibApi.targetGetCustomerTypes(this.cusQueryParams).then((response) => {
          this.cusList = response.data;
          this.loading = false;
          this.toggleSelection(this.cusList, "multipleCusTable");
        });
      } else {
        LibraryApi.getCustomerTypes(this.cusQueryParams).then((response) => {
          this.cusList = response.data;
          this.loading = false;
          this.toggleSelection(this.cusList, "multipleCusTable");
        });
      }
    },
    handleQuery() {
      this.getList(this.isNext);
    },
    reset() {},
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    handleSelectionChange(val) {
      this.multipleSelection = Array.from(new Set(val.map((a) => a.id))).map(
        (id) => {
          return val.find((a) => a.id === id);
        }
      );
    },
    handleCusSelectionChange(val) {
      this.multipleCusSelection = Array.from(new Set(val.map((a) => a.id))).map(
        (id) => {
          return val.find((a) => a.id === id);
        }
      );
    },
    toggleSelection(rows, str) {
      if (rows) {
        rows.forEach((row) => {
          if (row.selected) {
            this.$refs[str].toggleRowSelection(row);
          }
        });
      } else {
        this.$refs[str].clearSelection();
      }
    },
    // 取消按钮
    cancel() {
      this.dialogVisible = false;
      this.$emit("close");
      this.queryParams={
        pageSize: 10,
        pageNo: 1,
        name: undefined,
        visible: undefined,
        projectId: undefined,
      };
      this.$nextTick(() => {
        this.$refs.multipleTable.clearSelection(); // 清除表格的选中状态
        this.$refs.multipleCusTable.clearSelection(); // 清除表格的选中状态
      });
    },
    /** 提交按钮 */
    submitForm: function () {
      if (
        this.multipleSelection.length == 0 &&
        this.multipleCusSelection.length == 0
      ) {
        this.$message.error("请选择一项指标关联");
        return;
      }
    //   console.log(this.formData)
      this.$refs["submitDraw"].open(
        this.multipleSelection,
        this.multipleCusSelection,
        this.queryParams.projectId,
        this.formData.dataType,
        this.formData.serviceCount,
        this.isNext,
      );
    },
    /** 查询下拉树结构 + 下拉 */
    getTreeselect() {
      TargetApi.getTargetPage({ levels: "1,2" }).then((response) => {
        // 处理 deptOptions 参数
        const menu = { id: "", name: "指标维度", children: [] };
        menu.children = this.handleTree(response.data, "id");
        this.deptOptions = [];
        this.deptOptions.push(menu);
        // this.deptOptions.push(...this.handleTree(depList, "id"));
      });
    },
    // 筛选节点
    filterNode(value, data) {
      if (!value) return true;
      return data.name.indexOf(value) !== -1;
    },
    // 节点单击事件
    handleNodeClick(data) {
      this.queryParams.parentId = data.id;
      this.getList(this.isNext);
    },
    handleCusNodeClick(data) {
      this.getCusList();
    },
  },
  //生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {},
  beforeCreate() {}, //生命周期 - 创建之前
  beforeMount() {}, //生命周期 - 挂载之前
  beforeUpdate() {}, //生命周期 - 更新之前
  updated() {}, //生命周期 - 更新之后
  beforeDestroy() {}, //生命周期 - 销毁之前
  destroyed() {}, //生命周期 - 销毁完成
  activated() {}, //如果页面有keep-alive缓存功能，这个函数会触发
};
</script>
<style scoped></style>
