<template>
  <el-drawer
    title="提交关联"
    size="50%"
    :append-to-body="true"
    :before-close="handleClose"
    :visible.sync="innerDrawer"
  >
    <div class="drawTitle">二级指标</div>
    <div class="mb30 ml-20">
      <div class="mb15" v-for="item in corList" :key="item.id">
        <div class="flex" v-if="item.judgeType == 1">
          <span class="cred mr5">*</span>
          <span class="labelName">{{ item.name }}</span>
          <el-select
            class="wd110 mr15"
            v-model="item.compareSymbol"
            placeholder="请选择规则"
          >
            <el-option
              v-for="item in operatorList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
          <el-input
            class="wd150"
            v-model="item.compareValue"
            placeholder="请输入值"
          ></el-input>
        </div>
        <div class="flex" v-if="item.judgeType == 2">
          <span class="cred mr5">*</span>
          <span class="labelName">{{ item.name }}</span>
          <el-checkbox-group v-model="item.compareValues">
            <el-checkbox v-for="(it,ix) in item.featureLabelDtos" :key="ix" :label="it.value">{{ it.label }}</el-checkbox>
          </el-checkbox-group>
        </div>
      </div>
    </div>
    <div class="drawTitle" v-if="cusList.length != 0">客户类型</div>
    <div class="ml-15 mb30">
      <span class="mb15 mr20" v-for="(item, index) in cusList">
        <el-tag v-if="index % 5 == 0">{{ item.name }}</el-tag>
        <el-tag v-else-if="index % 4 == 0" type="success">{{
          item.name
        }}</el-tag>
        <el-tag v-else-if="index % 3 == 0" type="info">{{ item.name }}</el-tag>
        <el-tag v-else-if="index % 2 == 0" type="warning">{{
          item.name
        }}</el-tag>
        <el-tag v-else-if="index % 1 == 0" type="danger">{{
          item.name
        }}</el-tag>
      </span>
    </div>
    <div class="drawTitle" v-if="cusList.length != 0 && corList.length != 0">
      指标与客户类型关系
    </div>
    <div
      class="ml-15 mb-30 flex"
      v-if="cusList.length != 0 && corList.length != 0"
    >
      <span class="labelName">关系</span>
      <el-select
        class="wd150 mr15"
        v-model="formData.dataType"
        placeholder="请选择关系"
      >
        <el-option
          v-for="item in relationList"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        >
        </el-option>
      </el-select>
    </div>
    <div class="drawTitle">允许关联数量</div>
    <div class="ml-15 mb-30">
      <div class="flex">
        <span class="labelName">数量</span>
        <el-input
          class="wd150 mr10"
          type="number"
          v-model="formData.serviceCount"
          placeholder="请输入关联数量"
        ></el-input>
        <span>人</span>
      </div>
    </div>
    <div class="drawaFooter mt30">
      <el-button type="primary" @click="submit">确 定</el-button>
      <el-button @click="cancel">取 消</el-button>
    </div>
  </el-drawer>
</template>

<script>
import { operatorList } from "@/utils/myDicts";
import * as LibraryApi from "@/api/ser/librarysubproject";
import * as NextLibApi from "@/api/ser/librarysubproject/nextLib";

export default {
  name: "sumbit",
  components: {},
  data() {
    return {
      innerDrawer: false,
      corList: [],
      formData: {
        projectId: undefined,
        dataType: undefined,
        projectTargets: [],
        serviceCount: undefined,
      },
      relationList: [
        {
          label: "且",
          value: '1',
        },
        {
          label: "或",
          value: '2',
        },
      ],
      cusList: [],
      isNext: false,
      operatorList: operatorList,
    };
  },
  computed: {},
  watch: {},
  methods: {
    open(corList, cusList, projectId, dataType, serviceCount, isNext) {
      this.formData.projectId = projectId;
      corList.forEach((item) => {
        if (item.projectTarget == null) {
          let cor = {
            correlationId: item.id,
            correlationType: 1,
            compareValues: item.featureLabelDtos == null ? null:[],
            compareSymbol: null,
            judgeType: item.featureLabelDtos == null ? "1" : "2",
            featureLabelDtos: item.featureLabelDtos,
          };
          if(item.featureLabelDtos!=null&&item.featureLabelDtos.length!=0){
            item.featureLabelDtos.forEach(it=>{
                if(it.selected){
                    col.compareValues.push(it.value)
                }
            })
          }
          item.projectTarget = cor;
        }else{
            let checkList=item.projectTarget.compareValue?item.projectTarget.compareValue.split(','):[];
            this.$set(item.projectTarget,'compareValues',checkList)
            item.projectTarget.featureLabelDtos=item.featureLabelDtos
        }
        item.projectTarget.name = item.name;
        this.corList.push(item.projectTarget);
      });
      this.isNext = isNext;
      this.cusList = cusList;
      this.formData.dataType = dataType;
      this.formData.serviceCount = serviceCount;
      this.innerDrawer = true;
    },
    submit() {
      if (
        this.formData.dataType == null &&
        this.cusList != 0 &&
        this.corList != 0
      ) {
        this.$message.error("指标与客户类型关系不能为空");
        return;
      }
      this.corList.forEach(item=>{
        if(Array.isArray(item.compareValues)){
            item.compareValue=item.compareValues.join(',')
            delete item.compareValues
        }
      })
      this.formData.projectTargets = [];
      this.formData.projectTargets = [...this.corList];
      this.cusList.forEach((item) => {
        this.formData.projectTargets.push({
          correlationId: item.id,
          correlationType: 2,
        });
      });
      if (this.isNext) {
        NextLibApi.targetCreateNext(this.formData).then((res) => {
          if (res.code == 0) {
            this.corList = [];
            this.innerDrawer = false;
            this.$emit("refresh");
            this.$message.success("提交成功");
          }
        });
      } else {
        LibraryApi.projectCreate(this.formData).then((res) => {
          if (res.code == 0) {
            this.corList = [];
            this.innerDrawer = false;
            this.$emit("refresh");
            this.$message.success("提交成功");
          }
        });
      }
    },
    handleClose(done) {
      this.$confirm("还有未保存的工作哦确定关闭吗？")
        .then((_) => {
          done();
          this.innerDrawer = false;
          this.cusList = [];
          this.corList = [];
          this.formData = {
            projectId: undefined,
            dataType: undefined,
            projectTargets: [],
          };
        })
        .catch((_) => {});
    },
    cancel() {
      this.innerDrawer = false;
      this.cusList = [];
      this.corList = [];
      this.formData = {
        projectId: undefined,
        dataType: undefined,
        projectTargets: [],
        serviceCount:undefined,
      };
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
<style lang="scss" scoped>
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
.labelName {
  font-size: 14px;
  width: 100px;
}
.wd110 {
  width: 110px;
}
.wd150 {
  width: 150px;
}
.cred {
  color: #f56c6c;
}
</style>
