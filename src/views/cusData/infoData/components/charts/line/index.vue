<template>
  <div>
    <Chart :cdata="cdata" />
  </div>
</template>

<script>
import Chart from './chart.vue'
export default {
    props:['timeList','buyCount'],
  data () {
    return {
      cdata: {
        category:this.timeList,    
        rateData: this.buyCount
      }
    };
  },
  components: {
    Chart,
  },
  mounted () {
    // this.setData();
  },
  methods: {
  }
};
</script>

<style lang="scss" scoped>
</style>