<template>
  <div class="top-left">
    <div class="mb30">月拜访完成度</div>
    <!-- <div class="top-left-chart" id="topLeftChart"></div> -->
    <dv-active-ring-chart :config="config" style="width: 100%; height: 220px" />
    <el-table
      :data="formData"
      :row-style="{ background: '#03050C', color: '#fff' }"
      :header-cell-style="{ background: '#03050C', color: '#fff' }"
      border
      style="width: 90%; margin: 10px auto"
    >
      <el-table-column prop="visitOnlineCustomer" label="未拜访(线上)">
        <template v-slot="scope">
          {{ scope.row.visitOnlineCustomer - scope.row.finishVisitOnlineCount }}
        </template>
      </el-table-column>
      <el-table-column prop="finishVisitOnlineCount" label="已拜访(线上)">
      </el-table-column>
      <el-table-column prop="visitCustomer" label="未拜访(实地)">
        <template v-slot="scope">
          {{ scope.row.visitCustomer - scope.row.finishVisitCount }}
        </template>
      </el-table-column>
      <el-table-column prop="finishVisitCount" label="已拜访(实地)">
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import echarts from "echarts";

export default {
  name: "top-left",
  components: {},
  props: ["tableData"],

  data() {
    return {
      chart: null,
      config: {
        radius: "60%",
        activeRadius: "65%",
        lineWidth: 40,
        data: [
          {
            name: "应拜访(线上)",
            value: 55,
          },
          {
            name: "已拜访(线上)",
            value: 120,
          },
          {
            name: "应拜访(实地)",
            value: 78,
          },
          {
            name: "已拜访(实地)",
            value: 66,
          },
        ],
        digitalFlopStyle: {
          fontSize: 16,
        },
        showOriginValue: false,
      },
    };
  },
  computed: {
    formData() {
      let formList = [];
      formList.push(this.tableData);
      this.config.data = [];
      this.config.data.push({
        name: "未拜访(线上)",
        value:
          this.tableData.visitOnlineCustomer -
          this.tableData.finishVisitOnlineCount,
      });
      this.config.data.push({
        name: "已拜访(线上)",
        value: this.tableData.finishVisitOnlineCount,
      });
      this.config.data.push({
        name: "未拜访(实地)",
        value: this.tableData.visitCustomer - this.tableData.finishVisitCount,
      });
      this.config.data.push({
        name: "已拜访(实地)",
        value: this.tableData.finishVisitCount,
      });
      return formList;
    },
  },
  watch: {},
  methods: {
    initChart() {
      this.chart = echarts.init(document.getElementById("topLeftChart"));
      this.chart.setOption({
        tooltip: {
          trigger: "item",
        },
        legend: {
          top: "5%",
          left: "center",
        },
        series: [
          {
            name: "Access From",
            type: "pie",
            radius: ["40%", "70%"],
            avoidLabelOverlap: false,
            itemStyle: {
              borderRadius: 10,
              borderColor: "#fff",
              borderWidth: 2,
            },
            label: {
              show: false,
              position: "center",
            },
            emphasis: {
              label: {
                show: true,
                fontSize: 40,
                fontWeight: "bold",
              },
            },
            labelLine: {
              show: false,
            },
            data: [
              { value: 1048, name: "拜访" },
              { value: 735, name: "Direct" },
              { value: 580, name: "Email" },
              { value: 484, name: "Union Ads" },
              { value: 300, name: "Video Ads" },
            ],
          },
        ],
      });
    },
  },
  //生命周期 - 创建完成（可以访问当前this实例）
  created() {},
  //生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {
    this.$nextTick(() => {
      //   this.initChart();
    });
  },
  beforeCreate() {}, //生命周期 - 创建之前
  beforeMount() {}, //生命周期 - 挂载之前
  beforeUpdate() {}, //生命周期 - 更新之前
  updated() {}, //生命周期 - 更新之后
  beforeDestroy() {
    if (!this.chart) {
      return;
    }
    this.chart.dispose();
    this.chart = null;
  }, //生命周期 - 销毁之前
  destroyed() {}, //生命周期 - 销毁完成
  activated() {}, //如果页面有keep-alive缓存功能，这个函数会触发
};
</script>
<style>
.top-left {
  width: 100%;
  padding: 15px;
  color: #d3d6dd;
  height: 450px;
}
.top-left-chart {
  width: 100%;
  height: 300px;
}
.el-table--enable-row-hover .el-table__body tr:hover > td.el-table__cell {
  color: #03050c;
}

</style>
