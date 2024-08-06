<template>
  <div>
    <Chart :cdata="cdata" ref="centreLeft1Chart" @changeChart="change" />
  </div>
</template>

<script>
import { getCustomerTypeCount } from "@/api/home";
import Chart from "./chart.vue";
export default {
  data() {
    return {
      level: "",
      cdata: {
        xData: [
          "Ⅰ型客户",
          "Ⅱ型客户",
          "Ⅲ型客户",
          "Ⅳ型客户",
          "Ⅴ型客户",
          "Ⅵ型客户",
          "VII型客户",
          "VIII型客户",
          "IX型客户",
        ],
        seriesData: [
          { value: 0, name: "Ⅰ型客户" },
          { value: 0, name: "Ⅱ型客户" },
          { value: 0, name: "Ⅲ型客户" },
          { value: 0, name: "Ⅳ型客户" },
          { value: 0, name: "Ⅴ型客户" },
          { value: 0, name: "Ⅵ型客户" },
          { value: 0, name: "VII型客户" },
          { value: 0, name: "VIII型客户" },
          { value: 0, name: "IX型客户" },
        ],
      },
    };
  },
  components: {
    Chart,
  },
  mounted() {
    this.getData();
  },
  methods: {
    getData() {
      //   this.cdata = [];
      getCustomerTypeCount().then((res) => {
        const keys = Object.keys(res.data);
        const values = Object.keys(res.data).map((key) => res.data[key]);
        const typeMap = {
          "1型（高成长高贡献客户）": "Ⅰ型客户",
          "II型（高成长中贡献客户）": "Ⅱ型客户",
          "III型（中成长高贡献客户）": "Ⅲ型客户",
          // ... 其他类型的映射
          "IV型（中成长中贡献客户）": "Ⅳ型客户",
          "V型（高成长低贡献客户）": "Ⅴ型客户",
          "VI型（低成长高贡献客户）": "Ⅵ型客户",
          "VII型（中成长低贡献客户）": "VII型客户",
          "VIII型（低成长中贡献客户）": "VIII型客户",
          "IX型（低成长低贡献客户）": "IX型客户",
        };
        let summedTypesWithDetails = {};
        values.forEach((obj, index) => {
          for (let key in obj) {
            if (!summedTypesWithDetails.hasOwnProperty(key)) {
              summedTypesWithDetails[key] = {
                value: 0,
                detail: [], // 使用数组来存储每个对象的值
              };
            }
            summedTypesWithDetails[key].value += obj[key];
            summedTypesWithDetails[key].detail.push(obj[key]);
          }
        });
        let result = [];
        for (let key in summedTypesWithDetails) {
          let newName = typeMap[key]; // 使用映射获取新的 name
          //   let detailString = summedTypesWithDetails[key].detail.join(", "); // 将细节数组转换为逗号分隔的字符串
          result.push({
            value: summedTypesWithDetails[key].value,
            name: newName,
            detail: summedTypesWithDetails[key].detail,
          });
        }
        console.log(result);
        this.cdata.seriesData = result;
      });
    },
    change(data) {
      this.level = data;
      this.$emit("changeLevel", data);
    },
    backData() {
      let cityData = this.cdata;
      this.cdata = {};
      this.cdata = JSON.parse(JSON.stringify(cityData));
    },
  },
};
</script>

<style lang="scss" scoped></style>
