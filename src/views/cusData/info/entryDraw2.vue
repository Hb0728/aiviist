<template>
  <el-drawer id="count" title="分值查看" size="80%" :visible.sync="drawer">
    <el-row>
      <el-col :span="5" :offset="1"
        ><div class="f18 font-bold mb40">{{ cusName }}</div></el-col
      >
      <el-col :span="18">
        <el-form
          :model="queryParams"
          ref="queryForm"
          size="small"
          :inline="true"
          label-width="68px"
        >
          <el-form-item label="统计时间" prop="createTime">
            <el-date-picker
              v-model="queryParams.scoreTime"
              style="width: 240px"
              value-format="yyyy-MM-dd"
              type="month"
              placeholder="选择月份"
              @change="handleQuery"
            />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" @click="handleQuery"
              >搜索</el-button
            >
            <el-button icon="el-icon-refresh" @click="resetQuery"
              >重置</el-button
            >
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="22" :offset="1">
        <el-table v-loading="formLoading" :data="tableData" border style="width: 100%">
          <el-table-column
            prop="name"
            align="center"
            show-overflow-tooltip
            label="指标名称"
            width="180"
          >
          </el-table-column>
          <el-table-column
            prop="remark"
            show-overflow-tooltip
            align="center"
            label="备注"
          >
          </el-table-column>
          <el-table-column
            width="80"
            label="取值方式"
            show-overflow-tooltip
            align="center"
            prop="valueMethod"
          >
            <template v-slot="scope">
              <span v-if="scope.row.valueMethod == 1">系统取值</span>
              <span v-if="scope.row.valueMethod == 2">手动录入</span>
            </template>
          </el-table-column>
          <el-table-column
            width="80"
            prop="score"
            show-overflow-tooltip
            align="center"
            label="满分得分"
          >
          </el-table-column>
          <el-table-column
            width="80"
            label="当前得分"
            align="center"
            prop="valueMethod"
          >
            <template v-slot="scope">
              <el-input
                v-model="scope.row.customerScore"
                :disabled="true"
                type="number"
                min="0"
                :max="scope.row.score"
                >{{ scope.row.customerScore }}</el-input
              >
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="4" :offset="11">
        <div class="drawaFooter mt30">
          <el-button type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </el-col>
    </el-row>
  </el-drawer>
</template>

<script>
import * as InfoApi from "@/api/cust/info";

export default {
  name: "entryDraw",
  components: {},
  data() {
    return {
      tableData: [],
      drawer: false,
      cusName: "",
      formLoading: false,
      queryParams: {
        customerId: undefined,
        scoreTime: undefined,
      },
    };
  },
  computed: {},
  watch: {},
  methods: {
    async open(id, name) {
      this.cusName = name;
      this.queryParams.customerId = id;
      this.drawer = true;
      this.reset();
      // 修改时，设置数据
      if (id) {
        this.formLoading = true;
        try {
          const res = await InfoApi.getScore(this.queryParams);
          this.tableData = res.data.filter((item) => item.level === 3);
        } finally {
          this.formLoading = false;
        }
      }
    },
    reset() {},
    handleQuery() {
      this.formLoading = true;
      InfoApi.getScore(this.queryParams).then((res) => {
        if (res.code == 0) {
          this.tableData = res.data.filter((item) => item.level === 3);
        }
        this.formLoading = false;
      });
    },
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    submitForm(){
        let comData=[]
        this.tableData.forEach(item=>{
            if(item.valueMethod==2){
                comData.push({targetId:item.id,score:item.customerScore,remark:item.scoreRemark})
            }
        })
        InfoApi.createTargetScore({
            customerId:this.queryParams.customerId,
            scores:comData
        }).then(res=>{
            if(res.code==0){
                this.$message.success('录入成功')
                this.drawer=false
            }else{
                this.$message.error(res.msg)
            }

        })
    },
    cancel(){
        this.drawer=false
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
#count .el-drawer{
    background: #fff;
}
.el-drawer__header {
  font-size: 20px;
  font-weight: bold;
}
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
}
input[type="number"] {
  -moz-appearance: textfield;
}
inpit {
  border: none;
}
</style>
