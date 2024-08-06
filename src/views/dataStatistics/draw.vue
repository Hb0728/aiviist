<template>
  <el-drawer title="数据分析" size="86%" :visible.sync="drawer">
    <div class="pl15 pr15 h100 w100">
      <div class="bg-secreen">
        <div class="flex flex-wrap">
          <dv-border-box-10 class="box-inner">
            <TopLeft :tableData="formData"></TopLeft>
          </dv-border-box-10>
          <dv-border-box-10 class="box-inner">
            <div class="up">
              <div
                class="bg-color-black item"
                v-for="item in titleItem"
                :key="item.title"
              >
                <p class="ml-3 colorBlue fw-b fs-xl">{{ item.title }}</p>
                <div>
                  <dv-digital-flop
                    class="dv-dig-flop ml-1 mt-2 pl-3"
                    :config="item.number"
                  />
                </div>
              </div>
            </div>
            <div class="percent">
              <div class="item bg-color-black">
                <span class="colorBlue">拜访客户覆盖率（线上）</span>
                <CenterChart
                  class="flex row-center"
                  :id="rate[0].id"
                  :tips="rate[0].tips"
                  :colorObj="rate[0].colorData"
                />
              </div>
              <div class="item bg-color-black">
                <span class="colorBlue">拜访客户覆盖率（实地）</span>
                <CenterChart
                  class="flex row-center"
                  :id="rate[1].id"
                  :tips="rate[1].tips"
                  :colorObj="rate[1].colorData"
                />
              </div>
              <div class="water">
                <div class="colorBlue mb10 tc">拜访项目覆盖率</div>
                <dv-water-level-pond class="dv-wa-le-po" :config="water" />
              </div>
            </div>
          </dv-border-box-10>
          <dv-border-box-10 class="box-inner">
            <TopRight :cusId="formData.id"></TopRight>
          </dv-border-box-10>
          <div class="big-box">
            <dv-border-box-10 class="">
              <BottomLeftChart :dateTime="timeData"></BottomLeftChart>
            </dv-border-box-10>
          </div>
          <dv-border-box-10 class="box-inner">
            <BottomRight :cusId="formData.id"></BottomRight>
          </dv-border-box-10>
        </div>
      </div>
    </div>
  </el-drawer>
</template>

<script>
import CenterChart from "@/components/echart/center/centerChartRate";
import TopLeft from "./charts/top-left";
import TopRight from "./charts/top-right";
import BottomRight from "./charts/bottom-right";
import BottomLeftChart from "./charts/bottomLeftChart";

export default {
  components: { CenterChart, TopLeft, TopRight, BottomRight, BottomLeftChart },
  props:['timeData'],
  data() {
    return {
      drawer: false,
      formData: {
        id: 0,
        customerCount: 0,
      },
      titleItem: [
        {
          title: "客户总数",
          number: {
            number: [10],
            toFixed: 1,
            textAlign: "left",
            content: "{nt}",
            style: {
              fontSize: 26,
            },
          },
        },
        {
          title: "拜访项目数(线上)",
          number: {
            number: [20],
            toFixed: 1,
            textAlign: "left",
            content: "{nt}",
            style: {
              fontSize: 26,
            },
          },
        },
        {
          title: "拜访项目数(实地)",
          number: {
            number: [30],
            toFixed: 1,
            textAlign: "left",
            content: "{nt}",
            style: {
              fontSize: 26,
            },
          },
        },
        {
          title: "总拜访时长",
          number: {
            number: [40],
            toFixed: 1,
            textAlign: "left",
            content: "{nt}",
            style: {
              fontSize: 26,
            },
          },
        },
        {
          title: "户均拜访时长",
          number: {
            number: [50],
            toFixed: 1,
            textAlign: "left",
            content: "{nt}",
            style: {
              fontSize: 26,
            },
          },
        },
        {
          title: "拜访里程",
          number: {
            number: [1],
            toFixed: 1,
            textAlign: "left",
            content: "{nt}",
            style: {
              fontSize: 26,
            },
          },
        },
      ],
      rate: [
        {
          id: "centerRate1",
          tips: 2,
          colorData: {
            textStyle: "#3fc0fb",
            series: {
              color: ["#00bcd44a", "transparent"],
              dataColor: {
                normal: "#03a9f4",
                shadowColor: "#97e2f5",
              },
            },
          },
        },
        {
          id: "centerRate2",
          tips: 3,
          colorData: {
            textStyle: "#67e0e3",
            series: {
              color: ["#faf3a378", "transparent"],
              dataColor: {
                normal: "#ff9800",
                shadowColor: "#fcebad",
              },
            },
          },
        },
      ],
      water: {
        data: [40],
        shape: "roundRect",
        formatter: "{value}%",
        waveNum: 3,
      },
    };
  },
  filters: {},
  computed: {},
  created() {},
  mounted() {},
  beforeDestroy() {},
  methods: {
    async open(row) {
      this.formData = row;
      this.titleItem = [
        {
          title: "客户总数",
          number: {
            number: [this.formData.customerCount || 0],
            toFixed: 1,
            textAlign: "left",
            content: "{nt}",
            style: {
              fontSize: 26,
            },
          },
        },
        {
          title: "拜访项目数(线上)",
          number: {
            number: [this.formData.visitProjectOnlineCount || 0],
            toFixed: 1,
            textAlign: "left",
            content: "{nt}",
            style: {
              fontSize: 26,
            },
          },
        },
        {
          title: "拜访项目数(实地)",
          number: {
            number: [this.formData.visitProjectCount || 0],
            toFixed: 1,
            textAlign: "left",
            content: "{nt}",
            style: {
              fontSize: 26,
            },
          },
        },
        {
          title: "总拜访时长",
          number: {
            number: [this.formData.visitTime || 0],
            toFixed: 1,
            textAlign: "left",
            content: "{nt}",
            style: {
              fontSize: 26,
            },
          },
        },
        {
          title: "户均拜访时长",
          number: {
            number: [this.formData.avgVisitTime || 0],
            toFixed: 1,
            textAlign: "left",
            content: "{nt}",
            style: {
              fontSize: 26,
            },
          },
        },
        {
          title: "拜访里程",
          number: {
            number: [this.formData.visitDistance || 0],
            toFixed: 1,
            textAlign: "left",
            content: "{nt}",
            style: {
              fontSize: 26,
            },
          },
        },
      ];
      this.rate = [
        {
          id: "centerRate1",
          tips: this.formData.visitOnlineProportion,
          colorData: {
            textStyle: "#3fc0fb",
            series: {
              color: ["#00bcd44a", "transparent"],
              dataColor: {
                normal: "#03a9f4",
                shadowColor: "#97e2f5",
              },
            },
          },
        },
        {
          id: "centerRate2",
          tips: this.formData.visitProportion,
          colorData: {
            textStyle: "#67e0e3",
            series: {
              color: ["#faf3a378", "transparent"],
              dataColor: {
                normal: "#ff9800",
                shadowColor: "#fcebad",
              },
            },
          },
        },
      ];
      const newData = [row.visitProjectOnlineProportion];
      console.log(row.visitProjectOnlineProportion);
      this.water.data = newData;
      this.water = { ...this.water };
      //   this.$refs["waterItem"].updateRows(this.water.data);
      this.drawer = true;
    },
  },
};
</script>

<style scoped lang="scss">
.up {
  width: 100%;
  display: flex;
  padding: 15px;
  padding-bottom: 0;
  flex-wrap: wrap;
  justify-content: space-around;
  .item {
    border-radius: 6px;
    padding-top: 8px;
    margin-top: 8px;
    width: 32%;
    height: 65px;
    .dv-dig-flop {
      width: 100%;
      height: 30px;
      text-align: center;
    }
  }
}
.percent {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  .item {
    width: 50%;
    height: 120px;
    span {
      //   margin-top: 8px;
      font-size: 14px;
      display: flex;
      justify-content: center;
    }
  }
  .water {
    width: 73%;
    margin: 10px auto;
    margin-top: 0;
    .dv-wa-le-po {
      height: 120px;
    }
  }
}
.bg-secreen {
  width: 100%;
  min-height: 100%;
  padding: 20px;
  background: url(../../assets/pageBg.png);
}
.box-inner {
  width: 30%;
  height: 450px;
  margin: 20px 1.5%;
}
.big-box {
  width: 63%;
  height: 450px;
  margin: 20px 1.5%;
}

.colorBlue {
  color: #d3d6dd;
}
</style>
