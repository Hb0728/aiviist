<template>
  <div>
    <Chart :cdata="cdata" />
  </div>
</template>

<script>
import Chart from './chart.vue'
export default {
  data () {
    return {
      cdata: {
        category: [
        ],
        lineData: [
          180,
          200,
          240,
          283,
          328,
          367,
          398,
          447,
          484,
          504,
          560,
          626,
          595,
          675,
          182,
          207,
          240,
          283,
          328,
          360,
          398,
          447,
          484,
          504,
          367,
          398,
          447,
          484,
          504,
          500,
        ],
        barData: [
          46,
          50,
          55,
          65,
          75,
          85,
          99,
          12,
          14,
          21,
          23,
          24,
          25,
          33,
          46,
          50,
          55,
          65,
          75,
          85,
          99,
          22,
          14,
          21,
          85,
          99,
          12,
          14,
          21,
          23,
        ],
        rateData: []
      }
    };
  },
  components: {
    Chart,
  },
  mounted () {
    this.setData();
  },
  created() {
    // 解析日期字符串并获取当月的每一天
    this.getDaysOfMonth();
  },
  methods: {
    // 根据自己的业务情况修改
    setData () {
      for (let i = 0; i < this.cdata.barData.length -1; i++) {
        let rate = this.cdata.barData[i] / this.cdata.lineData[i];
        this.cdata.rateData.push(rate.toFixed(2));
      }
    },
    getDaysOfMonth(dateString = "") {
      if (!dateString) {
        const now = new Date();
        dateString = `${now.getFullYear()}-${("0" + (now.getMonth() + 1)).slice(
          -2
        )}-${("0" + now.getDate()).slice(-2)}`;
      }
      // 解析日期字符串
      const dateParts = dateString.split("-");
      const year = parseInt(dateParts[0], 10);
      const month = parseInt(dateParts[1], 10) - 1; // 月份从0开始
      const day = parseInt(dateParts[2], 10); // 实际上我们不需要这个day，因为我们想要整个月的每一天

      // 创建当月的第一天
      const firstDayOfMonth = new Date(year, month, 1);
      // 获取当月的天数
      const daysInMonth = new Date(year, month + 1, 0).getDate();

      // 使用 map 填充数组
      this.cdata.category = Array.from({ length: daysInMonth }, (_, index) => {
        // 创建该月的每一天的日期对象
        const dayOfMonth = new Date(year, month, index + 1);
        // 返回日期的字符串形式，这里返回 "YYYY-MM-DD" 格式
        return dayOfMonth.toISOString().split("T")[0];
      });
    },
  }
};
</script>

<style lang="scss" scoped>
</style>