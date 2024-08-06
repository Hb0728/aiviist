<template>
  <div id="centerLeft1">
    <div class="bg-color-black">
      <div class="d-flex pt-2 pl-2">
        <span>
          <icon name="chart-pie" class="text-icon"></icon>
        </span>
        <div class="d-flex">
          <span class="fs-xl text mx-2">客户分布数量</span>
          <dv-decoration-1 class="dv-dec-1" />
        </div>
        <div class="back-btn" v-if="level==2" @click="back">
            返回上级
        </div>
      </div>
      <div class="d-flex jc-center">
        <CenterLeft2Chart ref="mapChart" @changeLevel="levelChange"/>
      </div>
    </div>
  </div>
</template>

<script>
import CenterLeft2Chart from "@/components/echart/centerLeft/centerLeft2Chart";
export default {
  components: {
    CenterLeft2Chart
  },
  data(){
    return {
        level:1,
    }
  },
  methods:{
    back(){
        this.$refs.mapChart.backData()
    },
    levelChange(data){
        this.level=data
    }
  }
};
</script>

<style lang="scss" scoped>
#centerLeft1 {
  $box-width: 300px;
  $box-height: 410px;
  padding: 16px;
  height: $box-height;
  position: relative;
  min-width: $box-width;
  border-radius: 5px;
  .bg-color-black {
    height: $box-height - 30px;
    border-radius: 10px;
  }
  .back-btn{
    position: absolute;
    right: 30px;
    top: 30px;
    cursor: pointer;
    padding: 5px;
    border: 1px solid #fff;
    border-radius: 6px; 
  }
  .text {
    color: #c3cbde;
  }
  .dv-dec-1 {
    position: relative;
    width: 100px;
    height: 20px;
    top: -3px;
  }
  .chart-box {
    margin-top: 16px;
    width: 170px;
    height: 170px;
    .active-ring-name {
      padding-top: 10px;
    }
  }
}
</style>