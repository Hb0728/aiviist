// 屏幕适配 mixin 函数

// * 默认缩放值
const scale = {
  width: '1',
  height: '1',
}

// * 设计稿尺寸（px）
const baseWidth = 1920
const baseHeight = 1080

// * 需保持的比例（默认1.77778）
const baseProportion = parseFloat((baseWidth / baseHeight).toFixed(5))






export default {
  data() {
    return {
      // * 定时函数
      drawTiming: null
    }
  },
  mounted () {
    this.calcRate()
    window.addEventListener('resize', this.resize)
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.resize)
  },
  methods: {
    calcRate () {
      const appRef = this.$refs["appRef"]

      if (!appRef) return
      const appMainElement = document.querySelector(".app-main");
      const appMainWidth = appMainElement.offsetWidth;
      const appMainHeight = appMainElement.offsetHeight; 
      console.log(appMainWidth);
      console.log(appMainHeight);
      // 当前宽高比
      const currentRate = parseFloat((appMainWidth / appMainHeight).toFixed(5));
      if (appRef) {
        if (currentRate > baseProportion) {
          // 表示更宽
          scale.width = ((appMainHeight * baseProportion) / baseWidth).toFixed(
            5
          );
          scale.height = (appMainHeight / baseHeight).toFixed(5);
          appRef.style.transform = `scale(${scale.width}, ${scale.height}) translate(-50%, -50%)`
        } else {
          // 表示更高
          scale.height = (appMainWidth / baseProportion / baseHeight).toFixed(
            5
          );
          scale.width = (appMainWidth / baseWidth).toFixed(5);
          appRef.style.transform = `scale(${scale.width}, ${scale.height}) translate(-50%, -50%)`
        }
      }
    },
    resize () {
      clearTimeout(this.drawTiming)
      this.drawTiming = setTimeout(() => {
        this.calcRate()
      }, 200)
    }
  },
}