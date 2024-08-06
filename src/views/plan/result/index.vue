<template>
  <div class="app-container">
    <Schedule :stepNum="7" />
    <!-- 搜索工作栏 -->
    <el-form
      :model="queryParams"
      ref="queryForm"
      size="small"
      :inline="true"
      v-show="showSearch"
      label-width="68px"
    >
      <el-form-item label="店铺名称" prop="companyName">
        <el-input
          v-model="queryParams.companyName"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="客户经理" prop="name">
        <el-autocomplete
          class="inline-input"
          v-model="managerName"
          :fetch-suggestions="querySearch"
          placeholder="请输入客户经理名"
          @select="handleSelect"
        >
        </el-autocomplete>
      </el-form-item>
      <el-form-item label="服务时间" prop="visitTimes">
        <el-date-picker
          v-model="queryParams.visitTimes"
          style="width: 240px"
          value-format="yyyy-MM-dd"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="handleQuery"
          >搜索</el-button
        >
        <el-button icon="el-icon-refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <!-- 操作工具栏 -->
    <el-row :gutter="10" class="mb8">
      <right-toolbar
        :showSearch.sync="showSearch"
        @queryTable="getList"
      ></right-toolbar>
    </el-row>

    <el-table
      v-loading="loading"
      :data="list"
      :stripe="true"
      :show-overflow-tooltip="true"
    >
      <el-table-column
        label="序号"
        type="index"
        width="50"
        align="center"
      ></el-table-column>
      <el-table-column label="店名" align="center" prop="companyName" />
      <el-table-column label="法人" align="center" prop="customerName" />
      <el-table-column label="客户经理" align="center" prop="managerName" />
      <el-table-column
        show-overflow-tooltip
        label="服务项目"
        align="center"
        prop="projectName"
      >
        <template v-slot="scope">
          <div v-for="item in scope.row.records" :key="item.id">
            {{ item.projectName }}
          </div>
        </template>
      </el-table-column>
      <el-table-column
        label="项目得分"
        align="center"
        prop="scoreTime"
        width="180"
      >
        <template v-slot="scope">
          <div v-for="item in scope.row.records" :key="item.id">
            <el-rate
              v-model="item.projectScore"
              disabled
              show-score
              allow-half
              text-color="#ff9900"
            >
            </el-rate>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="服务时间" align="center" prop="projectTime" />
      <el-table-column
        label="评分时间"
        align="center"
        prop="scoreTime"    
        width="180"
      >
        <template v-slot="scope">
          <div v-for="item in scope.row.records" :key="item.id">
            {{ parseTime(item.scoreTime) }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="备注" align="center" prop="feedback" >
        <template v-slot="scope">
          <div class="ellipsis" :title="item.remark" v-for="item in scope.row.records" :key="item.id">
            {{ item.remark }}
          </div>
        </template>
        </el-table-column>
      <el-table-column
        width="250"
        label="操作"
        align="center"
        class-name="small-padding fixed-width"
      >
        <template v-slot="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-view"
            @click="openForm(scope.row.planId)"
            >查看图片</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页组件 -->
    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="queryParams.pageNo"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />
    <el-dialog
      title="查看拜访图片"
      :visible.sync="dialogVisible"
      width="45%"
      append-to-body
    >
      <div class="mb-20" v-for="(item,index) in imgList" :key="index">
        <img class="w100" :src="item" alt="">
      </div>
      <el-empty v-if="imgList.length==0" description="暂无图片"></el-empty>
    </el-dialog>
  </div>
</template>

<script>
import { recordPage, getVisitFiles } from "@/api/plan/task";
import { managerList } from "@/api/system/cusManager";
import Schedule from "@/components/schedule";
export default {
  name: "result",
  components: { Schedule },
  data() {
    return {
      iconClasses: ["icon-rate-face-1", "icon-rate-face-2", "icon-rate-face-3"],
      managerName: "",
      // 遮罩层
      loading: true,
      // 导出遮罩层
      exportLoading: false,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 客户模块：客户信息列表
      list: [],
      // 是否展开，默认全部展开
      isExpandAll: true,
      // 重新渲染表格状态
      refreshTable: true,
      // 选中行
      currentRow: {},
      //搜索建议数组
      restaurants: [],
      // 查询参数
      queryParams: {
        pageNo: 1,
        pageSize: 10,
        managerId: "",
        companyName: "",
        visitTimes: [],
      },
      dialogVisible: false,
      imgList:[],
    };
  },
  created() {
    this.getList();
    this.getManaList();
  },
  methods: {
    /** 查询列表 */
    async getList() {
      try {
        this.loading = true;
        const res = await recordPage(this.queryParams);
        this.list = res.data.list;
        this.total = res.data.total;
      } finally {
        this.loading = false;
      }
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
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNo = 1;
      //   console.log(this.queryParams)
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.queryParams = {
        pageNo: 1,
        pageSize: 10,
        managerId: "",
        companyName: "",
        visitTimes: [],
      };
      this.handleQuery();
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
      return (restaurant) => {
        return (
          restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) ===
          0
        );
      };
    },
    handleSelect(item) {
      this.queryParams.managerId = item.id;
      this.handleQuery();
    },
    openForm(id) {
      getVisitFiles(id).then((res) => {
        this.imgList=res.data;
        this.dialogVisible=true
      });
    },
  },
};
</script>
