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
          <el-form-item label="项目编号" prop="projectNumber">
            <el-input
              v-model="queryParams.projectNumber"
              placeholder="请输入项目编号"
              clearable
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
          <right-toolbar
            :showSearch.sync="showSearch"
            @queryTable="getList"
          ></right-toolbar>
        </el-row>
        <el-table
          v-loading="loading"
          :data="menuList"
          row-key="id"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="55"> </el-table-column>
          <el-table-column
            prop="id"
            label="项目编号"
            align="center"
            width="80"
          ></el-table-column>
          <el-table-column
            align="center"
            prop="name"
            label="服务项目"
            :show-overflow-tooltip="true"
          ></el-table-column>
          <el-table-column
            align="center"
            prop="parents"
            label="所属层级"
            sortable
            :show-overflow-tooltip="true"
          />
          <el-table-column
            align="center"
            prop="remark"
            label="服务内容描述"
            :show-overflow-tooltip="true"
          />
          <el-table-column
            align="center"
            prop="mediaResource"
            label="媒介资源配置"
            :show-overflow-tooltip="true"
          >
            <template v-slot="scope">
              {{
                scope.row.mediaResource.substring(0, 1) == 1 ? "远程服务" : ""
              }}
              {{
                scope.row.mediaResource.substring(1, 2) == 1 ? "现场服务" : ""
              }}
              {{
                scope.row.mediaResource.substring(2, 3) == 1 ? "自助服务" : ""
              }}
              {{
                scope.row.mediaResource.substring(3, 4) == 1 ? "互助服务" : ""
              }}
            </template>
          </el-table-column>
        </el-table>
        <pagination
          v-show="total > 0"
          :total="total"
          :page.sync="queryParams.pageNo"
          :limit.sync="queryParams.pageSize"
          @pagination="getList"
        />
        <div class="drawaFooter mt30">
          <el-button type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </el-col>
    </el-row>
  </el-drawer>
</template>

<script>
import * as LibraryApi from "@/api/ser/librarysubproject";
// import { getModuleList } from "@/api/ser/serviceproject";
import * as TargetApi from "@/api/cust/target";

export default {
  name: "libraryList",
  components: {},
  data() {
    return {
      dialogVisible:false,
      deptName:'',
      deptOptions:[],
      defaultProps: {
        children: "children",
        label: "name",
      },
      queryParams: {
        pageSize: 10,
        pageNo: 1,
        name: undefined,
        visible: undefined,
      },
      // 显示搜索条件
      showSearch: true,
      // 弹出层标题
      title: "关联指标",
      // 是否显示弹出层
      total: 0,
      menuList: [],
      loading: false,
      multipleSelection: [],
    };
  },
  computed: {},
  watch: {
    // 根据名称筛选部门树
    deptName(val) {
      this.$refs.tree.filter(val);
    },
  },
  methods: {
    /** 打开弹窗 */
    async open(row) {
      this.dialogVisible = true;
      this.reset();
      // 修改时，设置数据
      if (row.id) {
        this.getList()
      }
    },
    getList() {
      this.loading = true;
      LibraryApi.subProjectPage(this.queryParams).then((response) => {
        this.menuList = response.data.list;
        this.total = response.data.total;
        this.loading = false;
      });
    },
    handleQuery() {
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    // 取消按钮
    cancel() {
      this.dialogVisible=false
    },
    /** 提交按钮 */
    submitForm: function () {
      let projectIds = [];
      this.multipleSelection.forEach((item) => {
        projectIds.push(item.id);
      });
      this.$emit("submit", projectIds);
    },
    /** 查询下拉树结构 + 下拉 */
    getTreeselect() {
      TargetApi.getTargetPage({levels:'1,2'}).then((response) => {
        // 处理 deptOptions 参数
        const menu = { id: 0, name: "指标维度", children: [] };
        menu.children = this.handleTree(response.data, "id");
        this.deptOptions=[]
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
      this.getList();
    },
  },
  //生命周期 - 创建完成（可以访问当前this实例）
  created() {},
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
