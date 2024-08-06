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
        console.log(newData,222);
        this.options = {
          tooltip: {
            trigger: "axis",
            backgroundColor: "rgba(255,255,255,0.1)",
            axisPointer: {
              type: "shadow",
              label: {
                show: true,
                backgroundColor: "#000",
                textStyle: {
                  color: "#B4B4B4",
                },
              },
            },
            textStyle: {
              // 新增：设置 tooltip 的全局文本样式
              color: "#956FD4", // 字体颜色为黑色
            },
          },
          legend: {
            data: ["店铺得分"],
            textStyle: {
              color: "#B4B4B4",
            },
            top: "0%",
          },
          grid: {
            x: "6%",
            width: "90%",
            y: "4%",
          },
          xAxis: {
            data: newData.category,
            axisLine: {
              lineStyle: {
                color: "#B4B4B4",
              },
            },
            axisLabel: {
              formatter: function (value) {
                if (value.length > 6) {
                  // 如果文本长度超过4个字符
                  return value.slice(0, 3) + "..."; // 截断并添加省略号
                }
                return value; // 如果文本长度不超过4个字符，直接返回原值
              },
            rotate: 45,
              // ... 其他配置 ...
              textStyle: {
                // 新增：设置 x 轴刻度标签的字体颜色
                color: "#000", // 字体颜色为黑色
                fontSize: 10,
              },
            },
            axisTick: {
              show: false,
            },
          },
          yAxis: [
            {
              splitLine: { show: false },
              axisLine: {
                lineStyle: {
                  color: "#B4B4B4",
                },
              },

              axisLabel: {
                textStyle: {
                  // 新增：设置 y 轴刻度标签的字体颜色
                  color: "#000", // 字体颜色为黑色
                },
                formatter: "{value} ",
              },
            },
            {
              splitLine: { show: false },
              axisLine: {
                lineStyle: {
                  color: "#B4B4B4",
                },
              },
              axisLabel: {
                formatter: "{value} ",
              },
            },
          ],
          series: [
            {
              //   name: "店铺得分",
              type: "bar",
              barWidth: 10,
              itemStyle: {
                normal: {
                  barBorderRadius: 5,
                  color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    { offset: 0, color: "#956FD4" },
                    { offset: 1, color: "#3EACE5" },
                  ]),
                },
              },
              data: newData.barData,
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
