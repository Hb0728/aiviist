<template>
  <div>
    <!-- 年度开工率 -->
    <Echart
      :options="options"
      id="bottomLeftChart"
      height="480px"
      width="100%"
    ></Echart>
  </div>
</template>

<script>
import Echart from "@/common/echart";
export default {
  data() {
    return {
      options: {},
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
        console.log(newData, 1111);
        this.options = {
          tooltip: {
            trigger: "axis",
          },
          legend: {
            data: ["订购总量"],
            textStyle: {
              color: "#000", // 设置订购总量的颜色为红色
              fontSize: 14,
            },
          },
          grid: {
            left: "3%",
            right: "4%",
            bottom: "3%",
            containLabel: true,
          },
          xAxis: {
            type: "category",
            data: newData.category,
            axisLabel: {
              // ... 其他配置 ...
              textStyle: {
                // 新增：设置 x 轴刻度标签的字体颜色
                color: "#000", // 字体颜色为黑色
                fontSize: 14,
              },
            },
          },
          yAxis: {
            type: "value",
            axisLabel: {
              textStyle: {
                // 新增：设置 y 轴刻度标签的字体颜色
                color: "#000", // 字体颜色为黑色
              },
              formatter: "{value} ",
            },
          },
          series: [
            {
              name: "订购总量",
              type: "line",
              data: newData.rateData,
            },
          ],
        };
      },
      immediate: true,
      deep: true,
    },
  },
};
</script>
