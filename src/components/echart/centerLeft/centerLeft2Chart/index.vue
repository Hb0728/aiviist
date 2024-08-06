<template>
  <div>
    <Chart :cdata="cdata" ref="centreLeft2Chart" @changeChart="change" />
  </div>
</template>

<script>
import { getCustomerTypeCount } from "@/api/home";
import Chart from "./chart.vue";
export default {
  data() {
    return {
      level: "",
      cdata: [
        {
          // 名字需要与 “common/map/fujian.js” 地图数据文件里面定义的一一对应，不能是 “福州” 或者 “闽” 之类的缩写
          name: "绥中县",
          value: 0,
        },
        {
          name: "建昌县",
          value: 0,
        },
        {
          name: "兴城市",
          value: 0,
        },
        {
          name: "连山区",
          value: 0,
        },
        {
          name: "南票区",
          value: 0,
        },
        {
          name: "龙港区",
          value: 0,
        },
      ],
    };
  },
  components: {
    Chart,
  },
  mounted() {
    this.getData();
  },
  methods: {
    change(data){
        this.level=data;
        this.$emit("changeLevel",data)
    },
    getData() {
      this.cdata = [];
      getCustomerTypeCount().then((res) => {
        const keys = Object.keys(res.data);
        const values = Object.keys(res.data).map((key) => res.data[key]);
        keys.forEach((item) => {
          let cityVal = values[keys.indexOf(item)];
          let cityKeys = Object.keys(cityVal);
          let cityValues = Object.keys(cityVal).map((key) => cityVal[key]);
          let allCount = cityValues.reduce(
            (accumulator, currentValue) => accumulator + currentValue,
            0
          );
          this.cdata.push({
            name: item,
            value: allCount,
            detail: values[keys.indexOf(item)],
          });
        });
      });
    },
    backData() {
      let cityData = this.cdata;
      this.cdata = [];
      cityData.forEach((item) => {
        this.cdata.push({
          name: item.name,
          value: item.value,
          detail: item.detail,
        });
      });
    },
  },
};
</script>

<style lang="scss" scoped></style>
