<template>
  <div class="top-right">
    <div class="mb30">客户近期提报</div>
    <dv-scroll-board
      ref="scrollBoard"
      class="dv-scr-board"
      :config="configRight"
    />
  </div>
</template>

<script>
import { getCustomerApplyPage } from "@/api/plan/task";
export default {
  name: "top-right",
  components: {},
  props: ["cusId"],
  data() {
    return {
      configRight: {
        header: ["提报项目", "紧急程度", "申报人"],
        data: [],
        rowNum: 7, //表格行数
        headerHeight: 35,
        headerBGC: "#0f1325", //表头
        oddRowBGC: "#0f1325", //奇数行
        evenRowBGC: "#171c33", //偶数行
        index: false,
        columnWidth: [210, 180, 100],
        align: ["center"],
      },
    };
  },
  computed: {},
  watch: {
    cusId: {
      handler(newVal, oldVal) {
        this.getList();
      },
      immediate: true,
      deep: true,
    },
  },
  methods: {
    getList() {
      getCustomerApplyPage({
        pageNo: 1,
        pageSize: 10,
        managerId: this.cusId,
        customerName: "",
        projectTimes: [],
      }).then((res) => {
        this.configRight.data = [];
        res.data.list.forEach((item) => {
          let arrString = "";
          let star = "";
          for (let i = 0; i < item.urgencyLevel; i++) {
            star += "⭐";
          }
          arrString += `<span title='${item.urgencyLevel}'>
                ${star}      
                </span>`;
          this.configRight.data.push([
            item.projectName,
            arrString,
            item.customerName,
          ]);
        });
        this.$refs["scrollBoard"].updateRows(this.configRight.data);
      });
    },
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
<style scoped lang="scss">
.top-right {
  padding: 15px;
  color: #d3d6dd;
  .dv-scr-board {
    width: 100%;
    height: 340px;
  }
}
</style>
