<template>
  <div class="app-container">
    <Schedule :stepNum="3"/>

    <!-- 搜索工作栏 -->
    <el-row>
      <!--部门数据-->
      <el-col :span="5" :xs="24">
        <div class="head-container">
          <el-input
            v-model="deptName"
            placeholder="请输入服务库名称"
            clearable
            size="small"
            prefix-icon="el-icon-search"
            style="margin-bottom: 20px"
          />
        </div>
        <div class="mb10">
          <el-button
            type="primary"
            plain
            icon="el-icon-plus"
            size="mini"
            @click="openForm(undefined)"
            >新增</el-button
          >
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
            :render-content="renderContent"
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
              placeholder="请输入用项目名称"
              clearable
              style="width: 240px"
              @keyup.enter.native="handleQuery"
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
          <el-col :span="1.5">
            <el-button
              v-if="
                this.queryParams.libraryId && this.queryParams.libraryId != 0
              "
              type="primary"
              plain
              icon="el-icon-plus"
              size="mini"
              @click="handleAdd"
              v-hasPermi="['system:user:create']"
              >新增项目</el-button
            >
            <el-button
              v-if="
                this.queryParams.libraryId && this.queryParams.libraryId != 0
              "
              type="danger"
              plain
              icon="el-icon-delete"
              size="mini"
              @click="handleDelete"
              >删除</el-button
            >
            <!-- <el-button
              v-if="
                this.queryParams.libraryId && this.queryParams.libraryId != 0
              "
              class="search"
              plain
              type="primary"
              size="mini"
              @click="rebornPlan"
            >
              更新关联客户
            </el-button> -->
          </el-col>
          <right-toolbar
            :showSearch.sync="showSearch"
            @queryTable="getList(isNext)"
            :columns="columns"
          ></right-toolbar>
        </el-row>

        <el-table
          ref="multipleTable"
          v-loading="loading"
          :data="userList"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="55" />
          <el-table-column
            label="序号"
            align="center"
            key="id"
            prop="id"
            v-if="columns[0].visible"
          />
          <el-table-column
            label="服务套餐"
            align="center"
            key="libraryName"
            prop="libraryName"
            v-if="columns[1].visible"
            :show-overflow-tooltip="true"
          />
          <el-table-column
            label="项目名称"
            align="center"
            key="projectName"
            prop="projectName"
            v-if="columns[2].visible"
            :show-overflow-tooltip="true"
          />
          <el-table-column
            label="关联人数"
            align="center"
            key="serviceCount"
            prop="serviceCount"
            v-if="columns[3].visible"
            :show-overflow-tooltip="true"
          >
            <template v-slot="scope">
              <span v-if="scope.row.serviceCount != 0">{{
                scope.row.serviceCount
              }}</span>
              <span v-else>未设置</span>
            </template>
          </el-table-column>
          <el-table-column
            label="创建时间"
            align="center"
            prop="createTime"
            v-if="columns[4].visible"
            width="160"
          >
            <template v-slot="scope">
              <span>{{ parseTime(scope.row.createTime) }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            align="center"
            class-name="small-padding fixed-width"
            width="300"
          >
            <template v-slot="scope">
              <el-button
                size="mini"
                type="text"
                icon="el-icon-connection"
                @click="openCon(scope.row)"
                >关联指标
              </el-button>
              <el-button
                size="mini"
                type="text"
                icon="el-icon-user"
                @click="openCus(scope.row.projectId)"
                >查看关联客户</el-button
              >
              <el-button
                size="mini"
                type="text"
                icon="el-icon-delete"
                @click="handleDelete(scope.row)"
                v-hasPermi="['ser:library-sub-project:delete']"
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
          @pagination="getList(isNext)"
        />
      </el-col>
    </el-row>

    <libraryList
      :open="open"
      :isNext="isNext"
      :libraryId="queryParams.libraryId"
      :replaceId="replaceId"
      @close="cancel"
      @submit="submitForm"
    ></libraryList>
    <ProjectLibraryForm ref="formRef" @success="getTreeselect" />

    <correlation @close="getList(isNext)" ref="correlation"></correlation>
    <customers ref="customers"></customers>
  </div>
</template>

<script>
import * as LibraryApi from "@/api/ser/librarysubproject";
import * as NextLibApi from "@/api/ser/librarysubproject/nextLib";
import * as ProjectLibraryApi from "@/api/ser/projectlibrary";
// import { getProjectLibraryList } from "@/api/ser/projectlibrary";
import { recreatePlan } from "@/api/plan/task";
import ProjectLibraryForm from "./ProjectLibraryForm.vue";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import libraryList from "./libraryList.vue";
import correlation from "./correlation.vue";
import customers from "./associatedCustomers.vue";
import Schedule from "@/components/schedule";


export default {
  name: "SystemUser",
  components: {
    Treeselect,
    libraryList,
    correlation,
    customers,
    ProjectLibraryForm,
    Schedule
  },
  data() {
    return {
      // 遮罩层
      loading: true,
      // 导出遮罩层
      exportLoading: false,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      //   服务库列表
      libData: "",
      // 弹出层
      open: false,
      // 用户表格数据
      userList: null,
      // 部门树选项
      deptOptions: undefined,
      // 部门名称
      deptName: undefined,
      replaceId:undefined,
      // 表单参数
      form: {},
      defaultProps: {
        children: "children",
        label: "name",
      },
      isNext: false,
      //   选中行
      multipleSelection: [],
      // 用户导入参数
      // 查询参数
      queryParams: {
        pageNo: 1,
        pageSize: 10,
        libraryId: undefined,
        name: undefined,
        createTime: [],
      },
      // 列信息
      columns: [
        { key: 0, label: `序号`, visible: true },
        { key: 1, label: `项目所属库`, visible: true },
        { key: 2, label: `关联人数`, visible: true },
        { key: 3, label: `项目名称`, visible: true },
        { key: 4, label: `创建时间`, visible: true },
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
    this.getList(this.isNext);
    this.getTreeselect();
  },
  methods: {
    /** 查询用户列表 */
    getList(isNext) {
        console.log(isNext)
      this.loading = true;
      if (isNext) {
        NextLibApi.pageNext(this.queryParams).then((response) => {
          this.userList = response.data.list;
          this.total = response.data.total;
          this.loading = false;
        });
      } else {
        LibraryApi.getLibrarySubProjectPage(this.queryParams).then(
          (response) => {
            this.userList = response.data.list;
            this.total = response.data.total;
            this.loading = false;
          }
        );
      }
    },
    /** 查询下拉树结构 + 下拉 */
    getTreeselect() {
      ProjectLibraryApi.getProjectLibraryList().then((response) => {
        // 处理 deptOptions 参数
        this.deptOptions = [];
        this.libData = response.data;
        let list1=[]
        let list2=[]
        response.data.forEach((item) => {
            if(item.libraryType==1){
                item.children = [];
                item.parentId = 0;
                list1.push(item)
            }else{
                item.children = [];
                item.parentId = -2;
                list2.push(item)
            }
          
        });
        const menu = { id: "0", name: "服务策略", children: [] };
        menu.children = this.handleTree(list1, "id");
        this.deptOptions.push(menu);
        // 获取未来套餐列表
        NextLibApi.libraryfList().then((res) => {
          res.data.forEach((item) => {
            item.children = [];
            item.parentId = -1;
          });
          const menuNext = { id: "-1", name: "草稿箱", children: [] };
          menuNext.children = this.handleTree(res.data, "id");
          this.deptOptions.push(menuNext);
        });
      });
    },
    // 筛选节点
    filterNode(value, data) {
      if (!value) return true;
      return data.name.indexOf(value) !== -1;
    },
    // 节点单击事件
    handleNodeClick(data) {
      this.queryParams.libraryId = data.id;
      if(data.replaceId){
        this.replaceId=data.replaceId
      }else{
        this.replaceId=undefined
      }
      console.log(this.replaceId)
      if (data.parentId == -1) {
        this.isNext = true;
        this.getList(true);
      } else {
        this.isNext = false;
        this.getList(this.isNext);
      }
    },
    /** 添加/修改库操作 */
    openForm(id, parentId) {
      this.$refs["formRef"].open(id, this.libData, parentId);
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
      this.queryParams.pageNo = 1;
      this.getList(this.isNext);
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    renderContent(h, { node, data, store }) {
      if (node.data.id == 0 || node.data.id == -1 || node.data.id == -2 || node.data.id == 20) {
        return (
          <span class="custom-tree-node">
            <span>{node.label}</span>
          </span>
        );
      } else if(node.data.noDeleted==1){
        return (
        <span class="custom-tree-node">
            <div class="flex">
              <span class="tree-label ellipsis">{node.label}</span>
              <span class="ml10">
                <i
                  class="el-icon-edit-outline c999"
                  on-click={(event) => {
                    event.stopPropagation();
                    this.openForm(node.data.id, node.data.parentId);
                  }}
                ></i>
              </span>
            </div>
          </span>
        );
      } else {
        return (
          <span class="custom-tree-node">
            <div class="flex">
              <span class="tree-label ellipsis">{node.label}</span>
              <span class="ml10">
                <i
                  class="el-icon-edit-outline c999"
                  on-click={(event) => {
                    event.stopPropagation();
                    this.openForm(node.data.id, node.data.parentId);
                  }}
                ></i>
                <i
                  class="el-icon-delete c999"
                  on-click={(event) => {
                    event.stopPropagation();
                    this.handleDeletes(node.data, node.data.parentId);
                  }}
                ></i>
              </span>
            </div>
          </span>
        );
      }
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      // 打开表单，并设置初始化
      this.open = true;
    },

    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.multipleSelection;
      let _this = this;
      this.$modal
        .confirm("是否确认删除")
        .then(function () {
          if (_this.isNext) {
            return NextLibApi.projectDelete(ids);
          } else {
            return LibraryApi.deleteLibrarySubProject(ids);
          }
        })
        .then(() => {
          this.getList(this.isNext);
          this.$modal.msgSuccess("删除成功");
        })
        .catch(() => {});
    },
    // 弹窗取消
    cancel() {
      this.open = false;
    },
    // 表单选中触发
    handleSelectionChange(val) {
      let ids = [];
      if (val.length != 0) {
        val.forEach((item) => {
          ids.push(item.id);
        });
      }
      this.multipleSelection = ids.join(",");
    },
    // 提交弹窗
    submitForm(projectIds) {
      if (this.isNext) {
        NextLibApi.projectCreateNext({
          libraryId: this.queryParams.libraryId,
          projectIds,
        }).then((res) => {
          if (res.code == 0) {
            this.$message({
              message: "关联成功",
              type: "success",
            });
            this.getList(true);
            this.open = false;
          }
        });
      } else {
        LibraryApi.createLibrarySubProject({
          libraryId: this.queryParams.libraryId,
          projectIds,
        }).then((res) => {
          if (res.code == 0) {
            this.$message({
              message: "关联成功",
              type: "success",
            });
            this.getList(this.isNext);
            this.open = false;
          }
        });
      }
    },
    // 删除项目
    async handleDeletes(row, parentId) {
      const id = row.id;
      const name = row.name;
      await this.$modal.confirm("是否确认删除：" + name + '"的数据项?');
      try {
        if (parentId == 0) {
          await ProjectLibraryApi.deleteProjectLibrary(id);
        } else {
          await NextLibApi.deleteNext(id);
        }
        await this.getTreeselect();
        this.$modal.msgSuccess("删除成功");
      } catch {}
    },
    // 打开关联指标弹窗
    openCon(row) {
      this.$refs["correlation"].open(row,this.isNext);
    },
    openCus(id) {
      this.$refs["customers"].open(id,this.isNext);
    },
    //重新生成计划
    rebornPlan() {
      this.loading = true;
      recreatePlan().then((res) => {
        this.$message({
          type: "success",
          message: "重新生成计划成功",
        });
        this.getList(this.isNext);
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
.tree-label {
  max-width: 65%;
}
</style>
