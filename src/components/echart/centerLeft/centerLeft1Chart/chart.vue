<template>
  <div>
    <Echart
      :options="options"
      id="centreLeft1Chart"
      ref="centreLeft1Chart"
      height="300px"
      width="260px"
    ></Echart>
  </div>
</template>

<script>
import Echart from "@/common/echart";
export default {
  data() {
    return {
      options: {},
      level: 1,
    };
  },
  components: {
    Echart,
  },
  props: {
    cdata: {
      type: Object,
      default: () => ({}),
    },
  },
  watch: {
    cdata: {
      handler(newData) {
        this.level = 1;
        this.$emit("changeChart", this.level);
        this.options = {
          color: [
            "#37a2da",
            "#32c5e9",
            "#9fe6b8",
            "#ffdb5c",
            "#ff9f7f",
            "#fb7293",
            "#e7bcf3",
            "#8378ea",
          ],
          tooltip: {
            trigger: "item",
            formatter: "{a} <br/>{b} : {c} ({d}%)",
          },
          toolbox: {
            show: true,
          },
          calculable: true,
          legend: {
            orient: "horizontal",
            icon: "circle",
            bottom: 0,
            x: "center",
            data: newData.xData,
            textStyle: {
              color: "#fff",
            },
          },
          series: [
            {
              name: "客户类型统计",
              type: "pie",
              radius: [10, 50],
              roseType: "area",
              center: ["50%", "40%"],
              data: newData.seriesData,
            },
          ],
        };
        this.mapclick();
      },
      immediate: true,
      deep: true,
    },
  },
  methods: {
    mapclick() {
      //   if (this.echartBindClick) return;

      this.$nextTick(() => {
        //单击切换到级地图，当mapCode有值,说明可以切换到下级地图
        this.$refs.centreLeft1Chart.chart.on("click", (params) => {
          this.level = 2;
          this.changeChart(params);
        });
      });
    },
    changeChart(params) {
        console.log(params)
      this.level = 2;
      this.$emit("changeChart", this.level);
      this.options = {
        grid: {
          left: "5%", // 增加左侧内边距，使图表向右移动 // 你还可以根据需要调整 top, right, bottom 等属性 // top: '5%', // right: '5%', // bottom: '5%',
          containLabel: true, // 确保标签完全在网格内
        },
        title: {
          text: params.name,
        },
        xAxis: {
          type: "category",
          data: [
            "211401",
            "兴城市",
            "南票区",
            "建昌县",
            "绥中县",
            "葫芦岛市",
            "连山区",
            "龙港区",
          ],
          axisLabel: {
            // rotate: 45,
            // ... 其他配置 ...
            textStyle: {
              // 新增：设置 x 轴刻度标签的字体颜色
              color: "#fff", // 字体颜色为白色色
              fontSize: 13,
            },
          },
        },
        yAxis: {
          type: "value",
        },
        tooltip: {
          trigger: "axis", // 触发类型，默认数据项触发，可选为：'item' | 'axis'
          axisPointer: {
            type: "shadow", // 默认为直线，可选为：'line' | 'shadow'
          },
        },
        series: [
          {
            data: params.data.detail,
            type: "bar",
          },
        ],
      };
    },
  },
};
</script>

<style lang="scss" scoped></style>
