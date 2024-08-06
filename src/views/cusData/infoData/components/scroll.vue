<template>
  <div class="news">
    <div :class="{ anim: animate }" @mouseenter="stop()" @mouseleave="up()">
      <div
        @click="handleClick(item)"
        class="news_name"
        v-for="item in serviceList"
        :key="item.id"
      >
        <el-image
          class="mr15"
          style="width: 18px; height: 11px"
          :src="url"
        ></el-image>
        <span :title="item.remark">{{ item.name }} <span class="c999"> ({{ item.remark }})</span></span>
      </div>
    </div>
  </div>
</template>
<script>
export default {
    props:['serviceList'],
  data() {
    return {
      url: require("@/assets/images/message-icon.png"),
      timer: null,
      animate: false,
    };
  },
  mounted() {
    this.scrollUp(); // 开启滚动效果
  },
  methods: {
    // 查看详情
    handleClick(item) {
      console.log(item);
    },
    // 滚动
    scrollUp() {
      this.timer = setInterval(() => {
        this.animate = true; // 向上滚动的时候需要添加动画
        setTimeout(() => {
          this.serviceList.push(this.serviceList[0]); // 将数组的第一个元素添加到数组最后一个
          this.serviceList.shift(); // 删除数组的第一个元素
          this.animate = false;
        }, 500);
      }, 4000);
    },
    //鼠标移上去停止
    stop() {
      clearInterval(this.timer);
    },
    //鼠标离开继续
    up() {
      this.scrollUp();
    },
  },
  beforeDestroy() {
    this.stop();
  },
};
</script>
<style scoped>
.news {
  width: 100%;
  height: 90px;
  background-color: #fff;
  /* margin-top: 50px; */
  overflow: hidden;
}
.news_name {
  line-height: 30px;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  transition: top 0.5s;
}
.anim {
  transition: all 0.5s;
  margin-top: -30px;
}
</style>
