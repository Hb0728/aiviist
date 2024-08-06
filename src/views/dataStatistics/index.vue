<template>
  <div class="app-container">
    <Schedule :stepNum="8" />
    <!-- 搜索工作栏 -->
    <el-form
      :model="queryParams"
      ref="queryForm"
      size="small"
      :inline="true"
      v-show="showSearch"
      label-width="68px"
    >
      <el-form-item label="客户经理" prop="name">
        <el-input
          v-model="queryParams.nickname"
          placeholder="请输入客户经理名字"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="区域" prop="administrativeDivision">
        <el-select
          @change="handleQuery"
          v-model="queryParams.administrativeDivision"
          placeholder="请选择区域"
        >
          <el-option label="请选择" value=""> </el-option>
          <el-option label="连山区" value="连山区"> </el-option>
          <el-option label="龙港区" value="龙港区"> </el-option>
          <el-option label="南票区" value="南票区"> </el-option>
          <el-option label="兴城市" value="兴城市"> </el-option>
          <el-option label="绥中县" value="绥中县"> </el-option>
          <el-option label="建昌县" value="建昌县"> </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="月份" prop="month">
        <el-date-picker
          value-format="yyyy-MM-dd"
          v-model="queryParams.month"
          type="month"
          placeholder="选择月"
        >
        </el-date-picker>
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
      <el-col :span="1.5">
        <el-button type="warning" icon="el-icon-download" size="mini" @click="handleExport" :loading="exportLoading"
                   >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
      <right-toolbar
        :showSearch.sync="showSearch"
        @queryTable="getList"
        :columns="columns"
      ></right-toolbar>
    </el-row>

    <el-table
      v-loading="loading"
      :data="list"
      :stripe="true" 
      @sort-change="handleSortChange"
      :show-overflow-tooltip="true"
    >
      <el-table-column
        v-if="columns[0].visible"
        label="客户经理"
        width="80"
        align="center"
        prop="nickname"
      />
      <el-table-column
        v-if="columns[1].visible"
        sortable="custom"
        width="120"
        label="客户总数(人)"
        align="center"
        prop="customerCount"
      />
      <el-table-column
        v-if="columns[2].visible"
        sortable="custom"
        width="150"
        label="应拜访客户数(人)"
        align="center"
        prop="visitCustomerCount"
      />
      <el-table-column
        v-if="columns[3].visible"
        width="170"
        sortable="custom"
        label="应拜访客户次数(次)"
        align="center"
        prop="visitTimes"
      />
      <el-table-column
        v-if="columns[4].visible"
        sortable="custom"
        width="180"
        label="已拜访客户数（线上）"
        align="center"
        prop="finishVisitOnlineCount"
      />
      <el-table-column
        v-if="columns[5].visible"
        sortable="custom"
        width="190"
        label="已经拜访客户数（实地）"
        align="center"
        prop="finishVisitCount"
      />
      <el-table-column
        v-if="columns[6].visible"
        sortable="custom"
        label="拜访覆盖率（线上）"
        width="170"
        align="center"
        prop="visitOnlineProportion"
      />
      <el-table-column
        v-if="columns[7].visible"
        width="200"
        sortable="custom"
        label="拜访客户覆盖率（实地）"
        align="center"
        prop="visitProportion"
      />
      <el-table-column
        v-if="columns[8].visible"
        width="170"
        sortable="custom"
        label="拜访项目数（线上）"
        align="center"
        prop="visitProjectOnlineCount"
      />
      <el-table-column
        v-if="columns[9].visible"
        width="170"
        sortable="custom"
        label="拜访项目数（实地）"
        align="center"
        prop="visitProjectCount"
      />
      <el-table-column
        v-if="columns[10].visible"
        width="180"
        sortable="custom"
        label="拜访项目次数（线上）"
        align="center"
        prop="visitProjectOnlineTime"
      />
      <el-table-column
        v-if="columns[11].visible"
        width="180"
        sortable="custom"
        label="拜访项目次数（实地）"
        align="center"
        prop="visitProjectTime"
      />
      <el-table-column
        v-if="columns[12].visible"
        width="190"
        sortable="custom"
        label="拜访项目覆盖率（线上）"
        align="center"
        prop="visitProjectOnlineProportion"
      />
      <el-table-column
      width="190"
        v-if="columns[13].visible"
        sortable="custom"
        label="拜访项目覆盖率（实地）"
        align="center"
        prop="visitProjectProportion"
      />
      <el-table-column
        v-if="columns[14].visible"
        width="140"
        sortable="custom"
        label="总拜访时长(h)"
        align="center"
        prop="visitTime"
      />
      <el-table-column
        v-if="columns[15].visible"
        width="150"
        sortable="custom"
        label="户均拜访时长(h)"
        align="center"
        prop="avgVisitTime"
      />
      <el-table-column
        v-if="columns[16].visible"
        width="150"
        sortable="custom"
        label="总拜访里程(km)"
        align="center"
        prop="visitDistance"
      />
      <el-table-column
        v-if="columns[17].visible"
        sortable="custom"
        width="100"
        label="评分数量"
        align="center"
        prop="scoreCount"
      />
      <el-table-column
        v-if="columns[18].visible"
        width="100"
        sortable="custom"
        label="低分数量"
        align="center"
        prop="lowScoreCount"
      />
      <el-table-column
        v-if="columns[19].visible"
        sortable="custom"
        width="100"
        label="低分占比"
        align="center"
        prop="lowScoreProportion"
      />
      <el-table-column
        width="100"
        label="操作"
        align="center"
        class-name="small-padding fixed-width"
      >
        <template v-slot="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-tickets"
            @click="openDraw(scope.row)"
            >查看大屏</el-button
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
    <draw ref="formDraw" :timeData="this.queryParams.month" />
  </div>
</template>

<script>
import * as InfoApi from "@/api/cust/info";
import draw from "./draw.vue";
import { managerList } from "@/api/system/cusManager";
import { statisticsPage,visitPageExcel} from "@/api/statisitics/";
import Schedule from "@/components/schedule";
import { formatTime } from '@/utils/time.js'

export default {
  name: "Info",
  components: { draw, Schedule },
  data() {
    return {
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
      custType: [
        {
          label: "手动",
          value: "1",
        },
        {
          label: "自动",
          value: "2",
        },
      ],
      // 列信息
      columns: [
        { key: 0, label: "客户经理", visible: true },
        { key: 1, label: "客户总数", visible: true },
        { key: 2, label: "应拜访客户数", visible: true },
        { key: 3, label: "应拜访客户次数", visible: true },
        { key: 4, label: "已拜访客户数（线上）", visible: true },
        { key: 5, label: "已拜访客户数（实地）", visible: true },
        { key: 6, label: "拜访覆盖率（线上）", visible: true },
        { key: 7, label: "拜访覆盖率（实地）", visible: true },
        { key: 8, label: "拜访项目数（线上）", visible: true },
        { key: 9, label: "拜访项目数（实地）", visible: true },
        { key: 10, label: "拜访项目次数（线上）", visible: true },
        { key: 11, label: "拜访项目次数（实地）", visible: true },
        { key: 12, label: "拜访项目覆盖率（线上）", visible: true },
        { key: 13, label: "拜访项目覆盖率（实地）", visible: true },
        { key: 14, label: "总拜访时长", visible: true },
        { key: 15, label: "拜访时长", visible: true },
        { key: 16, label: "总拜访里程", visible: true },
        { key: 17, label: "评分数量", visible: true },
        { key: 18, label: "低分数量", visible: true },
        { key: 19, label: "低分占比", visible: true },
      ],
      // 是否展开，默认全部展开
      isExpandAll: true,
      // 重新渲染表格状态
      refreshTable: true,
      // 选中行
      currentRow: {},
      //搜索建议数组
      restaurants: [],
      month: "",
      // 查询参数
      queryParams: {
        pageNo: 1,
        pageSize: 10,
        administrativeDivision: "",
        nickname: null,
        month: "",
        sortType:'',
        sortColumn:'',
      },
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
        const res = await statisticsPage(this.queryParams);
        this.list = res.data.list;
        this.total = res.data.total;
      } finally {
        this.loading = false;
      }
    },
    openDraw(row) {
      this.$refs["formDraw"].open(row);
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
    // 排序切换
    handleSortChange(column){
        this.queryParams.sortColumn = column.prop;
        if(column.order == 'ascending'){
            this.queryParams.sortType = 'asc';
        }else if(column.order == 'descending'){
            this.queryParams.sortType = 'desc';
        }else{
            this.queryParams.sortType = '';
        }
        this.getList();
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNo = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.queryParams = {
        pageNo: 1,
        pageSize: 10,
        administrativeDivision: "",
        nickname: null,
        month: "",
      };
      this.handleQuery();
    },
     /** 导出按钮操作 */
    handleExport() {
      this.$modal.confirm('是否确认导出数据统计?').then(() => {
          this.exportLoading = true;
          return visitPageExcel({month: this.queryParams.month});
        }).then(response => {
          let dateYear = formatTime(new Date(), 'yyyy-MM-dd')
          console.log(dateYear)
          this.$download.excel(response, '数据统计'+dateYear+'.xlsx');
          this.exportLoading = false;
      }).catch(() => {});
    }
  },
};
</script>
