<template>
  <div id="centerLeft1">
    <div class="bg-color-black">
      <div class="d-flex pt-2 pl-2">
        <span>
          <icon name="chart-bar" class="text-icon"></icon>
        </span>
        <div class="d-flex">
          <span class="fs-xl text mx-2">客户分类数量及任务完成情况</span>
          <dv-decoration-3 class="dv-dec-3" />
        </div>
        <div class="back-btn" v-if="level==2" @click="back">
            返回上级
        </div>
      </div>
      <div class="d-flex jc-center">
        <CenterLeft1Chart  ref="centerChart" @changeLevel="levelChange"/>
      </div>
      <!-- 4个主要的数据 -->
      <!-- <div class="bottom-data">
        <div
          class="item-box mt-2"
          v-for="(item, index) in numberData"
          :key="index"
        >
          <div class="d-flex">
            <span class="coin">￥</span>
            <dv-digital-flop class="dv-digital-flop" :config="item.number" />
          </div>
          <p class="text" style="text-align: center;">
            {{ item.text }}
            <span class="colorYellow">(件)</span>
          </p>
        </div>
      </div> -->
    </div>
  </div>
</template>

<script>
import CenterLeft1Chart from '@/components/echart/centerLeft/centerLeft1Chart'
export default {
  data() {
    return {
        level:1,
      numberData: [
        {
          number: {
            number: [15],
            toFixed: 1,
            textAlign: 'left',
            content: '{nt}',
            style: {
              fontSize: 24
            }
          },
          text: '今日完成计划'
        },
        {
          number: {
            number: [1144],
            toFixed: 1,
            textAlign: 'left',
            content: '{nt}',
            style: {
              fontSize: 24
            }
          },
          text: '总共完成计划'
        },
      ]
    }
  },
  components: {
    CenterLeft1Chart
  },
  mounted() {
    this.changeTiming()
  },
  methods: {
    changeTiming() {
      setInterval(() => {
        this.changeNumber()
      }, 3000)
    },
    levelChange(data){
        this.level=data
    },
    back(){
        this.$refs.centerChart.backData()
    },
    changeNumber() {
      this.numberData.forEach((item, index) => {
        item.number.number[0] += ++index
        item.number = { ...item.number }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
$box-width: 300px;
$box-height: 410px;

#centerLeft1 {
  padding: 16px;
  height: $box-height;
  position: relative;
  width: $box-width;
  border-radius: 10px;
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
  .dv-dec-3 {
    position: relative;
    width: 100px;
    height: 20px;
    top: -3px;
  }

  .bottom-data {
    .item-box {
      & > div {
        padding-right: 5px;
      }
      font-size: 14px;
      float: right;
      position: relative;
      width: 50%;
      color: #d3d6dd;
      .dv-digital-flop {
        width: 120px;
        height: 30px;
      }
      // 金币
      .coin {
        position: relative;
        top: 6px;
        font-size: 20px;
        color: #ffc107;
      }
      .colorYellow {
        color: yellowgreen;
      }
      p {
        text-align: center;
      }
    }
  }
}
</style>
