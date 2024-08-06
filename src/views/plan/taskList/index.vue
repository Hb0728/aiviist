<template>
  <div
    class="app-container"
    :class="rebornPlanLoading ? 'loading-overbox' : ''"
    v-loading="rebornPlanLoading"
    element-loading-text="重新生成计划中"
  >
    <Schedule :stepNum="4" />
    <!-- 搜索工作栏 -->
    <el-row>
      <!--部门数据-->
      <el-col :span="4" :xs="24">
        <div class="head-container">
          <el-input
            v-model="deptName"
            placeholder="请输入客户经理名称"
            clearable
            size="small"
            prefix-icon="el-icon-search"
            style="margin-bottom: 20px"
          />
        </div>
        <div class="head-container mb-10">
          <el-select
            @change="getTreeselect"
            v-model="administrativeDivision"
            placeholder="所在区域"
          >
            <el-option label="全部区域" value=""> </el-option>
            <el-option label="连山区" value="连山区"> </el-option>
            <el-option label="龙港区" value="龙港区"> </el-option>
            <el-option label="南票区" value="南票区"> </el-option>
            <el-option label="兴城市" value="兴城市"> </el-option>
            <el-option label="绥中县" value="绥中县"> </el-option>
            <el-option label="建昌县" value="建昌县"> </el-option>
          </el-select>
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
            node-key="id"
            :default-checked-keys="[1]"
            @node-click="handleNodeClick"
          />
        </div>
      </el-col>
      <!--用户数据-->
      <el-col :span="19" :xs="24">
        <el-form
          :model="queryParams"
          ref="queryForm"
          size="small"
          :inline="true"
          v-show="showSearch"
          label-width="68px"
        >
          <el-form-item label="项目名称" prop="username">
            <el-input
              v-model="queryParams.name"
              placeholder="请输入项目名称"
              clearable
              style="width: 240px"
              @keyup.enter="handleQuery"
            />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" @click="handleQuery"
              >搜索</el-button
            >
            <el-button icon="el-icon-refresh" @click="resetQuery"
              >重置</el-button
            >
          </el-form-item>
        </el-form>

        <el-row :gutter="10" class="mb8">
          <el-button
            v-hasPermi="['plan:remark']"
            class="search"
            plain
            type="primary"
            @click="rebornPlan"
          >
            重新生成计划
          </el-button>
          <span class="c999 ml-15"><i class="el-icon-warning-outline"></i> 点击人名查看客户经理本月计划</span>
          <right-toolbar
            :showSearch.sync="showSearch"
            @queryTable="getList"
            :columns="columns"
          ></right-toolbar>
        </el-row>

        <el-table v-loading="loading" :data="userList">
          <el-table-column
            label="任务名称"
            align="center"
            key="name"
            prop="name"
            v-if="columns[0].visible"
            :show-overflow-tooltip="true"
            width="180"
          />
          <el-table-column
            label="涉及人数"
            align="center"
            key="customerCount"
            prop="customerCount"
            v-if="columns[1].visible"
            width="80"
            :show-overflow-tooltip="true"
          />
          <el-table-column
            label="任务生效时间"
            align="center"
            key="visitTimeStart"
            prop="visitTimeStart"
            width="200"
            v-if="columns[2].visible"
            :show-overflow-tooltip="true"
          >
            <template v-slot="scope">
              <span v-if="scope.row.visitTimeStart">{{
                scope.row.visitTimeStart + "~" + scope.row.visitTimeEnd
              }}</span></template
            >
          </el-table-column>
          <el-table-column
            label="未完成商户"
            align="center"
            key="customers"
            prop="customers"
            v-if="columns[3].visible"
            :show-overflow-tooltip="true"
          >
            <template v-slot="scope">
              <span v-for="(item, index) in scope.row.customers" :key="item.id">
                <template v-if="item.finish == 0"
                  ><span v-if="index != 0">,</span> {{ item.name }}</template
                >
              </span>
            </template>
          </el-table-column>
          <el-table-column
            label="已完成商户"
            align="center"
            key="usedCustomers"
            prop="customers"
            v-if="columns[4].visible"
            :show-overflow-tooltip="true"
          >
            <template v-slot="scope">
              <span
                v-for="(item, index) in scope.row.customers"
                :key="item.license"
              >
                <template v-if="item.finish == 1"
                  ><span v-if="index != 0">,</span>{{ item.name }}</template
                >
              </span>
            </template>
          </el-table-column>
          <el-table-column
            label="备注"
            align="center"
            prop="remark"
            v-if="columns[5].visible"
            width="160"
            :show-overflow-tooltip="true"
          />
        </el-table>

        <!-- <pagination
          v-show="total > 0"
          :total="total"
          :page.sync="queryParams.pageNo"
          :limit.sync="queryParams.pageSize"
          @pagination="getList"
        /> -->
      </el-col>
    </el-row>
  </div>
</template>

<script>
import * as LibraryApi from "@/api/ser/librarysubproject";
import { getTaskList } from "@/api/plan/task";
import { getProjectLibraryList } from "@/api/ser/projectlibrary";
import { managerList } from "@/api/system/cusManager";
import Treeselect from "@riophae/vue-treeselect";
import { recreatePlan } from "@/api/plan/task";
import Schedule from "@/components/schedule";

import "@riophae/vue-treeselect/dist/vue-treeselect.css";

export default {
  name: "SystemUser",
  components: { Treeselect, Schedule },
  data() {
    return {
      // 遮罩层
      loading: false,
      // 导出遮罩层
      exportLoading: false,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      administrativeDivision:"",
      rebornPlanLoading: false,
      // 弹出层标题
      // 弹出层
      open: false,
      // 用户表格数据
      userList: [],
      // 部门树选项
      deptOptions: undefined,
      // 部门名称
      deptName: undefined,
      // 表单参数
      form: {},
      defaultProps: {
        children: "children",
        label: "name",
      },
      // 用户导入参数
      // 查询参数
      queryParams: {
        managerId: undefined,
      },
      // 列信息
      columns: [
        { key: 0, label: `任务名称`, visible: true },
        { key: 1, label: `涉及人数`, visible: true },
        { key: 2, label: `任务生效时间`, visible: true },
        { key: 3, label: `未完成商户`, visible: true },
        { key: 4, label: `已完成商户`, visible: true },
        { key: 5, label: `备注`, visible: true },
      ],
    };
  },
  watch: {
    // 根据名称筛选部门树
    deptName(val) {
      this.$refs.tree.filter(val);
    },
  },
  created() {
    this.getList();
    this.getTreeselect();
  },
  methods: {
    /** 查询用户列表 */
    getList() {
      this.loading = true;
      getTaskList(this.queryParams).then((response) => {
        this.userList = response.data;
        this.loading = false;
      });
    },
    /** 查询下拉树结构 + 下拉 */
    getTreeselect() {
      managerList({ nickname: "",administrativeDivision:this.administrativeDivision }).then((response) => {
        // 处理 deptOptions 参数
        this.deptOptions = [];
        response.data.forEach((item) => {
          item.children = [];
          item.label = item.nickname;
          item.name = item.nickname;
        });
        this.deptOptions = response.data;
      });
    },
    // 筛选节点
    filterNode(value, data) {
      if (!value) return true;
      return data.name.indexOf(value) !== -1;
    },
    // 节点单击事件
    handleNodeClick(data) {
      this.queryParams.managerId = data.id;
      this.getList();
    },

    // 表单重置
    reset() {
      this.form = {
        projectName: undefined,
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      //   this.queryParams.pageNo = 1;
      //   this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },

    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      const names = row.projectName;
      this.$modal
        .confirm('是否确认删除项目名为"' + names + '"的数据项?')
        .then(function () {
          return LibraryApi.deleteLibrarySubProject(ids);
        })
        .then(() => {
          this.getList();
          this.$modal.msgSuccess("删除成功");
        })
        .catch(() => {});
    },
    // 弹窗取消
    cancel() {
      this.open = false;
    },
    //重新生成计划
    rebornPlan() {
      this.rebornPlanLoading = true;
      recreatePlan().then((res) => {
        this.rebornPlanLoading = false;
        this.$message({
          type: "success",
          message: "重新生成计划成功",
        });
      });
    },
    // 提交弹窗
    submitForm(projectIds) {
      LibraryApi.createLibrarySubProject({
        libraryId: this.queryParams.libraryId,
        projectIds,
      }).then((res) => {
        if (res.code == 0) {
          this.$message({
            message: "关联成功",
            type: "success",
          });
          this.getList();
          this.open = false;
        }
      });
    },
  },
};
</script>
<style lang="scss">
.drawaFooter {
  margin-top: 30px;
}
.el-drawer {
  padding: 30px;
}
.el-drawer__header {
  font-size: 20px;
  font-weight: bold;
}
.loading-overbox {
  height: 720px;
  overflow: hidden;
}
</style>
