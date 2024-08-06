<template>
  <div class="index mb20">
    <el-steps :active="stepNum" simple>
      <el-step @click.native="jumpPart(item.route)" v-for="(item, index) in scheduleList" :key="index" :title="item.name" :icon="item.icon"></el-step>
    </el-steps>
  </div>
</template>

<script>
//import

export default {
  name: "Schedule",
  components: {},
  props: ['stepNum'],
  data() {
    return {
      scheduleList: [
        {
          name: "客户标签",
          route: "/cout/target",
          icon:'el-icon-c-scale-to-original',
        },
        {
          name: "分值录入",
          route: "/cout/info",
          icon:'el-icon-edit-outline',
        },
        {
          name: "服务项目",
          route: "/test/ser",
          icon:'el-icon-s-flag',
        },
        {
          name: "服务策略",
          route: "/test/library",
          icon:'el-icon-paperclip',
        },
        {
          name: "拜访任务",
          route: "/plan/list",
          icon:'el-icon-notebook-1',
        },
        {
          name: "拜访计划",
          route: "/plan/visit",
          icon:'el-icon-notebook-2',
        },
        {
          name: "拜访实施",
          route: "",
          icon:'el-icon-s-promotion',
        },
        {
          name: "拜访评价",
          route: "/plan/result",
          icon:'el-icon-chat-dot-square',
        },
        {
          name: "统计分析",
          route: "/planData/resultStatisitics",
          icon:'el-icon-edit-outline',
        },
      ],
    };
  },
  computed: {},
  watch: {},
  methods: {
    jumpPart(val){
        console.log(val)
        this.$router.push({path:val})
    }
  },
  //生命周期 - 创建完成（可以访问当前this实例）
  created() {},
  //生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {},
  beforeCreate() {}, //生命周期 - 创建之前
  beforeMount() {}, //生命周期 - 挂载之前
  beforeUpdate() {}, //生命周期 - 更新之前
  updated() {}, //生命周期 - 更新之后
  beforeDestroy() {}, //生命周期 - 销毁之前
  destroyed() {}, //生命周期 - 销毁完成
  activated() {}, //如果页面有keep-alive缓存功能，这个函数会触发
};
</script>
<style>
.el-step.is-simple .el-step__title{
    font-size: 14px!important;
}
.el-steps--simple{
    padding: 13px 4%;
}
.el-step{
    cursor: pointer;
}
@media (max-width: 1440px) {
  .el-step.is-simple .el-step__title {
    font-size: 12px!important;
  }
}

</style>
