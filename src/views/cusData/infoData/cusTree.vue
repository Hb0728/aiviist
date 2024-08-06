<template>
  <el-drawer title="店铺画像" size="80%" :visible.sync="drawer">
        <div class="ml25 mr25">
          <div class="flex col-top info-box">
            <img
              class="mr50 flex-shrink-0 "
              style="width: 150px;"
              :src="cusData.storePhoto ? cusData.storePhoto: require('@/assets/images/user_header.png')"
            ></img>
            <div class="f14 flex-grow-1">
              <div class=" f18 mb15 flex w100">
                <i class="el-icon-s-home icon-color mr30"></i>
                <span class="font-bold mr40"> {{cusData.companyName}} </span> 
                <el-tag> {{cusData.customerTargetTypeName}} </el-tag>
              </div>
              <div class="mb15">
                <i class="el-icon-location font-18 icon-color mr30"></i>
                <span class="">{{ cusData.address }}</span>
              </div>
              <div class="mb15">
                <i class="el-icon-phone icon-color font-18 mr30"></i>
                <el-link class="mr40" type="primary">{{ cusData.mobile }}</el-link>
              </div>
              <div class="mb15 flex col-top">
                <i class="el-icon-info icon-color flex-shrink-0 font-18 mr30"></i>
                <el-row class="flex-grow-1">
                    <el-col class="mb10" :span="8">
                        <span class="info-keyName">店主姓名：</span>
                        <span>{{ cusName }}</span>
                    </el-col>
                    <el-col class="mb10" :span="8">
                        <span class="info-keyName">店铺档位：</span>
                        <span class="importText">{{ cusData.customerGrade }}</span>
                    </el-col>
                    <el-col class="mb10" :span="8">
                        <span class="info-keyName">负责经理：</span>
                        <span class="importText">{{ cusData.managerName }}</span>
                    </el-col>
                    <el-col class="mb10" :span="8">
                        <span class="info-keyName">许可证号：</span>
                        <span>{{ cusData.license }}</span>
                    </el-col>
                    <el-col class="mb10" :span="8">
                        <span class="info-keyName">终端类型：</span>
                        <span>{{ cusData.starTerminalType?cusData.starTerminalType:'暂无' }}</span>
                    </el-col>
                    <el-col class="mb10" :span="8">
                        <span class="info-keyName">市场类型：</span>
                        <span>{{ cusData.marketType }}</span>
                    </el-col>
                    <el-col class="mb10" :span="8">
                        <span class="info-keyName">是否是职业化零售客户：</span>
                        <span>{{ cusData.occupation==0?'否':'是' }}</span>
                    </el-col>
                    <el-col class="mb10" :span="8">
                        <span class="info-keyName">经营业态：</span>
                        <span>{{ cusData.businessType }}</span>
                    </el-col>
                    <el-col class="mb10" :span="8">
                        <span class="info-keyName">所属区域：</span>
                        <span>{{ cusData.administrativeDivision }}</span>
                    </el-col>
                    <el-col class="mb10" :span="8">
                        <span class="info-keyName">近一个月卷烟总订货量：</span>
                        <span>{{ cusData.lastMonthBuyCount }}（条）</span>
                    </el-col>
                    <el-col class="mb10" :span="8">
                        <span class="info-keyName">近一个月条均价：</span>
                        <span>{{ cusData.lastMonthAvgPrice }}（元）</span>
                    </el-col>
                    
                </el-row>
              </div>
            </div>
          </div>
          <div class="info-box">
            <div class="drawTitle">得分情况</div>
            <barChart  :nameList="scoreNameList" :scoreList="scoreList" />
          </div>
          <div class="info-box">
            <div class="drawTitle">订购总量</div>
            <lineChart :timeList="quantityTimeList" :buyCount="quantityList"></lineChart>
          </div>
          <div class="info-box">
            <div class="drawTitle">地产烟购进量</div>
            <lineChart :timeList="buyCountTimeList" :buyCount="buyCountList"></lineChart>
          </div>
          <div class="info-box">
            <div class="drawTitle">服务信息</div>
            <scrollC :serviceList="serviceList"></scrollC>
          </div>
          
        </div>
  </el-drawer>
</template>

<script>
// import echarts from "echarts";
import * as InfoApi from "@/api/cust/info";
import scrollC from "./components/scroll.vue"
import barChart from './components/charts/bar'
import lineChart from './components/charts/line'
export default {
  name: "cusTree",
  components: {scrollC,barChart,lineChart},
  data() {
    return {
      url: require("@/assets/images/message-icon.png"),
      squareUrl: "",
      cusName: "",
      cusData:{

      },
      scoreNameList:[],
      scoreList:[],
      drawer: false,
      tableData: [],
      score: 0,
      formLoading: false,
      serviceList: [],
    //   订购总量
      quantityTimeList:[],
      quantityList:[],
    //   地产烟购进量
      buyCountTimeList:[],
      buyCountList:[],
    };
  },
  computed: {},
  watch: {},
  methods: {
    async open(row) {
      this.drawer = true;
      // 修改时，设置数据
      if (row) {
        this.scoreNameList=[];
        this.scoreList=[];
        this.quantityList= []
        this.quantityTimeList=[]
        this.buyCountTimeList=[]
        this.buyCountList=[]
        await InfoApi.getInfo(row.id).then(res=>{
            this.cusData=res.data
        })
        this.cusName = row.name;
        this.formLoading = true;
        try {
          const res = await InfoApi.getScore({ customerId: row.id });
        //   获取进购总量
          await InfoApi.orderQuantity({ customerId: row.id }).then(res=>{
            let valueList= Object.values(res.data);
            let keyName=Object.keys(res.data);
            valueList.forEach((item,index)=>{
              this.quantityList.push(item)
              this.quantityTimeList.push(keyName[index])
            })
          });
        //   地产烟购进量
          await InfoApi.localBuyCount({ customerId: row.id }).then(res=>{
            let buyList= Object.values(res.data);
            let timeList=Object.keys(res.data);
            buyList.forEach((item,index)=>{
              this.buyCountList.push(item)
              this.buyCountTimeList.push(timeList[index])
            })
          });;
          //   获取服务信息
          await InfoApi.customerProjects({ customerId: row.id }).then(res=>{
            this.serviceList=res.data
          }).catch(e=>{
            
          });
          let treeArr = [];
          this.score = 0;
          res.data.forEach((item) => {
            this.scoreNameList.push(item.name)
            this.scoreList.push(item.customerScore)
          });
        } finally {
          this.formLoading = false;
        }
      }
    },
    reset() {},
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
<style lang="scss">
.flex-shrink-0 {
  flex-shrink: 0;
}
.drawTitle {
  font-size: 18px;
  font-weight: bold;
  position: relative;
  padding-left: 18px;
  margin-bottom: 20px;
  &::after {
    content: "";
    height: 80%;
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    left: 0;
    width: 6px;
    border-radius: 10px;
    background: #409eff;
  }
}
.tag {
  padding: 6px 15px;
  height: 36px;
  line-height: 22px;
}
.icon-color{
    color: #81B0EA;
}
.flex-grow-1{
    flex-grow: 1;
}
.el-drawer{
    background: #F1F2F7;
}
.info-box{
    background: #fff;
    padding: 15px 20px;
    border-radius: 8px;
    margin-bottom: 25px;
}
// .importText{
//     color: #1890ff;
// }
.info-keyName{
    color: #B0B0B0;
}
</style>
