<template>
  <div>
    <Echart
      id="centreLeft2Chart"
      ref="centreLeft2ChartRef"
      :options="options"
      height="360px"
      width="330px"
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
      type: Array,
      default: () => [],
    },
  },
  watch: {
    cdata: {
      handler(newData) {
        this.level = 1;
        this.$emit("changeChart", this.level);
        // 设置点的位置(经纬度)
        const geoCoordMap = {};
        let seriesData = [
          {
            name: "兴城市",
          },
          {
            name: "南票区",
          },
          {
            name: "建昌县",
          },
          {
            name: "绥中县",
          },
          {
            name: "葫芦岛市",
          },
          {
            name: "连山区",
          },
          {
            name: "龙港区",
          },
        ];
        let convertData = function (data) {
          let scatterData = [];
          for (var i = 0; i < data.length; i++) {
            var geoCoord = geoCoordMap[data[i].name];
            if (geoCoord) {
              scatterData.push({
                name: data[i].name,
                value: geoCoord.concat(data[i].value),
              });
            }
          }
          return scatterData;
        };
        this.options = {
          showLegendSymbol: true,
          tooltip: {
            trigger: "item",
            textStyle: {
              fontSize: 14,
              lineHeight: 22,
            },
            position: (point) => {
              // 固定在顶部
              return [point[0] + 50, point[1] - 20];
            },
            // 如果需要自定义 tooltip样式，需要使用formatter
            /*
              formatter: params => {
                return `<div style=""> ... </div>`
              }
            */
          },
          visualMap: {
            min: 0,
            show: false,
            seriesIndex: 0,
            // 颜色
            inRange: {
              color: ["rgba(41,166,206, .5)", "rgba(69,117,245, .9)"],
            },
          },
          // 底部背景
          geo: {
            show: true,
            aspectScale: 0.85, //长宽比
            zoom: 1.2,
            top: "20%",
            left: "10%",
            map: "葫芦岛市",
            roam: false,
            itemStyle: {
              normal: {
                areaColor: "rgba(0,0,0,0)",
                shadowColor: "rgba(7,114,204, .8)",
                shadowOffsetX: 5,
                shadowOffsetY: 5,
              },
              emphasis: {
                areaColor: "#00aeef",
              },
            },
          },
          series: [
            {
              name: "客户数量",
              type: "map",
              aspectScale: 0.85, //长宽比
              zoom: 1.2,
              mapType: "葫芦岛市", // 自定义扩展图表类型
              top: "20%",
              left: "10%",
              itemStyle: {
                normal: {
                  color: "red",
                  areaColor: "rgba(19,54,162, .5)",
                  borderColor: "rgba(0,242,252,.3)",
                  borderWidth: 1,
                  shadowBlur: 7,
                  shadowColor: "#00f2fc",
                },
                emphasis: {
                  areaColor: "#4f7fff",
                  borderColor: "rgba(0,242,252,.6)",
                  borderWidth: 2,
                  shadowBlur: 10,
                  shadowColor: "#00f2fc",
                },
              },
              label: {
                formatter: (params) => `${params.name}`,
                show: true,
                position: "insideRight",
                textStyle: {
                  fontSize: 14,
                  color: "#efefef",
                },
                emphasis: {
                  textStyle: {
                    color: "#fff",
                  },
                },
              },
              data: newData,
            },
            {
              type: "effectScatter",
              coordinateSystem: "geo",
              symbolSize: 7,
              effectType: "ripple",
              legendHoverLink: false,
              showEffectOn: "render",
              rippleEffect: {
                period: 4,
                scale: 2.5,
                brushType: "stroke",
              },
              zlevel: 1,
              itemStyle: {
                normal: {
                  color: "#99FBFE",
                  shadowBlur: 5,
                  shadowColor: "#fff",
                },
              },
              data: convertData(seriesData),
            },
          ],
        };
        // 重新选择区域
        this.mapclick();
        // this.handleMapRandomSelect();
      },
      immediate: true,
      deep: true,
    },
  },
  methods: {
    // 开启定时器
    startInterval() {
      const _self = this;
      // 应通过接口获取配置时间，暂时写死5s
      const time = 2000;
      if (this.intervalId !== null) {
        clearInterval(this.intervalId);
      }
      this.intervalId = setInterval(() => {
        _self.reSelectMapRandomArea();
      }, time);
    },
    // 重新随机选中地图区域
    reSelectMapRandomArea() {
      const length = 9;
      this.$nextTick(() => {
        try {
          const map = this.$refs.centreLeft2ChartRef.chart;
          let index = Math.floor(Math.random() * length);
          while (index === this.preSelectMapIndex || index >= length) {
            index = Math.floor(Math.random() * length);
          }
          map.dispatchAction({
            type: "mapUnSelect",
            seriesIndex: 0,
            dataIndex: this.preSelectMapIndex,
          });
          map.dispatchAction({
            type: "showTip",
            seriesIndex: 0,
            dataIndex: index,
          });
          map.dispatchAction({
            type: "mapSelect",
            seriesIndex: 0,
            dataIndex: index,
          });
          this.preSelectMapIndex = index;
        } catch (error) {
          console.log(error);
        }
      });
    },
    handleMapRandomSelect() {
      this.$nextTick(() => {
        try {
          const map = this.$refs.centreLeft2ChartRef.chart;
          const _self = this;
          setTimeout(() => {
            _self.reSelectMapRandomArea();
          }, 0);
          // 移入区域，清除定时器、取消之前选中并选中当前
          map.on("mouseover", function (params) {
            clearInterval(_self.intervalId);
            map.dispatchAction({
              type: "mapUnSelect",
              seriesIndex: 0,
              dataIndex: _self.preSelectMapIndex,
            });
            map.dispatchAction({
              type: "mapSelect",
              seriesIndex: 0,
              dataIndex: params.dataIndex,
            });
            _self.preSelectMapIndex = params.dataIndex;
          });
          // 移出区域重新随机选中地图区域，并开启定时器
          map.on("globalout", function () {
            _self.reSelectMapRandomArea();
            _self.startInterval();
          });
          this.startInterval();
        } catch (error) {
          console.log(error);
        }
      });
    },
    mapclick() {
      //   if (this.echartBindClick) return;
      this.$nextTick(() => {
        //单击切换到级地图，当mapCode有值,说明可以切换到下级地图
        this.$refs.centreLeft2ChartRef.chart.on("click", (params) => {
          this.level = 2;
          this.changeChart(params.data.detail, params.data.name);
          // let xzqData = xzqCode[params.name];
          // if (xzqData) {
          //   this.getData(xzqData.adcode);
          // } else {
          //   this.message("暂无下级地市!");
          // }
          //   this.echartBindClick = true;
        });
      });
    },
    changeChart(params, name) {
      let cusTypeArr = [];
      let keys = Object.keys(params).map((key) => {
        if (key.length > 3) {
          // 假设我们想要当标签超过3个字符时截取
          let name = key.substr(0, 3);
          if (name.includes("型")) {
            return name+'客户';
          } else {
            return name + "型客户";
          }
        }
        return key;
      });
      let values = Object.values(params);
      keys.forEach((item) => {
        cusTypeArr.push({
          name: item,
          value: values[keys.indexOf(item)],
        });
      });
      this.level = 2;
      this.$emit("changeChart", this.level);
      this.options = {
        tooltip: {
          trigger: "item",
        },
        legend: {
          bottom: "20%",
        },
        series: [
          {
            name: name,
            type: "pie",
            center: ["50%", "30%"],
            radius: "40%",
            data: cusTypeArr,
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)",
              },
            },
          },
        ],
      };
    },
  },
};
</script>
