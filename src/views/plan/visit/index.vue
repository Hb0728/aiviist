<template>
  <div v-loading="rebornPlanLoading" element-loading-text="重新生成计划中">
    <div class="p20">
      <Schedule :stepNum="5" />
    </div>
    <div class="fc-toolbar">
      <div class="fc-left flex">
        <el-input
          placeholder="请输入查询店铺"
          v-model="search_input"
          clearable
          class="input mr20"
          size="medium"
          @keyup.enter.native="onSearch"
          @clear="getDtata()"
        >
          <i slot="suffix" class="el-icon-search" @click="onSearch"></i>
        </el-input>
        <el-dropdown class="flex-shrink-0" @command="handleCommand">
          <span class="el-dropdown-link">
            {{ typeName }}<i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="month">月</el-dropdown-item>
            <el-dropdown-item command="listView">周</el-dropdown-item>
            <el-dropdown-item command="today">今天</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <!-- <el-button-group>
          <el-button :class="activebtn == 1 ? 'activeBtn' : ''" >
            月
          </el-button>
          <el-button :class="activebtn == 2 ? 'activeBtn' : ''" @click="week">
            周
          </el-button>
          <el-button :class="activebtn == 3 ? 'activeBtn' : ''" >
            今天
          </el-button>
          <el-button
            :class="activebtn == 4 ? 'activeBtn' : ''"
            @click="listView"
          >
            列表
          </el-button>
        </el-button-group> -->
      </div>
      <div class="fc-center">
        <el-button icon="el-icon-arrow-left" circle @click="prev" />
        <p class="title">
          {{ title }}
        </p>
        <el-button icon="el-icon-arrow-right" circle @click="next" />
      </div>
      <div>
        <el-autocomplete
          class="inline-input mr20"
          clearable
          v-model="managerName"
          @clear="clearMan"
          :fetch-suggestions="querySearch"
          placeholder="请输入客户经理名"
          @select="handleSelect"
        >
        </el-autocomplete>
        <el-button class="search" type="primary" @click="getDtata">
          查询
        </el-button>
        <el-button
          v-hasPermi="['plan:remark']"
          class="search"
          plain
          type="primary"
          @click="rebornPlan"
        >
          重新生成计划
        </el-button>
      </div>
    </div>
    <div class="fc-toolbar row-left">
      <div class="flex mr-20">
        <span class="blue-color-box"></span> 蓝色代表未完成
      </div>
      <div class="flex mr-20">
        <span class="green-color-box"></span> 绿色代表已完成
      </div>
      <div class="flex mr-20">
        <span class="red-color-box"></span> 红色代表逾期
      </div>
    </div>
    <el-dialog title="添加日程" :visible.sync="dialogFormVisible" width="600px">
      <el-form
        :model="form"
        :rules="formRules"
        ref="formData"
        label-position="left"
        label-width="100px"
      >
        <el-form-item label="选择客户" prop="content">
          <div class="flex">
            <el-input
              class="mr20"
              v-model="form.content"
              autocomplete="off"
              disabled
              placeholder="选择客户"
            ></el-input>
            <el-button v-if="changeCus" type="primary" @click="openDraw"
              >选择客户</el-button
            >
          </div>
        </el-form-item>
        <el-form-item label="拜访时间" prop="visitTime">
          <el-input
            v-model="form.visitTime"
            disabled
            placeholder="拜访时间"
          ></el-input>
        </el-form-item>
        <el-form-item label="拜访任务" v-if="form.content" prop="projectIds">
          <el-select v-model="form.projectIds" multiple placeholder="请选择">
            <el-option
              v-for="item in taskList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="navConfirm">确 定</el-button>
        <el-button @click="dialogFormVisible = false">取 消</el-button>
      </div>
    </el-dialog>
    <!-- <div v-if="showFullcalendar">加载数据中......</div> -->
    <FullCalendar
      v-loading="loading"
      id="calendar"
      ref="fullCalendar"
      class="demo-app-calendar"
      :options="calendarOptions"
    >
      <template v-slot:eventContent="arg">
        <!-- <el-popover
          placement="top-start"
          title="拜访任务"
          width="200"
          :visible-arrow="false"
          trigger="click"
          @show="handleShow(arg)"
        >
          <el-row class="popover_title">
            <el-col
              :span="12"
              :style="{
                color:
                  arg.event.extendedProps.visitStatus == 0 ? 'red' : 'green',
              }"
            >
              <span
                style="padding-right: 2px"
                :style="{
                  'border-left':
                    arg.event.extendedProps.visitStatus == 0
                      ? '5px solid red'
                      : '5px solid green',
                }"
              ></span
              >{{
                arg.event.extendedProps.visitStatus == 0 ? "未开始" : "已完成"
              }}</el-col
            >
            <el-col
              :span="12"
              style="
                display: flex;
                flex-direction: row-reverse;
                font-size: 14;
                color: #000;
              "
              >{{
                arg.event.allDay == true ? "全天" : formatTimer(arg.event.start)
              }}</el-col
            >
          </el-row>
          <el-row v-loading="planTaskListLoading">
            <div v-for="(item, index) in planTaskList">
              {{ index + 1 + "." + item }}
            </div>
          </el-row>
          <el-row style="margin-top: 10px">
            <el-col :offset="15" style="width: 15%; margin-right: 5px"
              ><el-button
                class="hvr-icon-bounce"
                size="mini"
                type="success"
                icon="el-icon-plus hvr-icon"
                circle
                @click.prevent="addEvent(arg)"
              >
              </el-button>
            </el-col>
            <el-col style="width: 15%"
              ><el-popconfirm
                confirm-button-text="好"
                cancel-button-text="否"
                icon="el-icon-info"
                icon-color="red"
                title="确定删除这个事项吗？"
                @confirm="onRemoveBtnClicked(arg)"
                ><el-button
                  class="hvr-icon-buzz-out"
                  slot="reference"
                  size="mini"
                  :disabled="arg.event.extendedProps.visitStatus == 1"
                  type="danger"
                  icon="el-icon-delete hvr-icon"
                  circle
                >
                </el-button
              ></el-popconfirm>
            </el-col>
          </el-row> -->
        <!-- <el-button @click="more(arg.event)"> 更多 </el-button> -->
        <div slot="reference" class="popper-content" @click="more(arg)">
          <span>{{ arg.timeText }}</span>
          <i>{{ arg.event.title }}</i>
        </div>

        <!-- </el-popover> -->
      </template>

      <template v-slot:dayCellContent="arg">
        {{ arg.dayNumberText }}
      </template>
      <template v-slot:resourceLabelContent="arg">
        {{ arg.resource.id }}
      </template>
    </FullCalendar>
    <el-dialog
      title="拜访计划"
      :visible.sync="dialogVisible"
      width="30%"
      :before-close="handleClose"
    >
      <el-row class="mb5" v-if="argData&&argData.event">
        <el-col :span="5">拜访客户：</el-col>
        <el-col :span="19">{{ argData.event.title }}</el-col>
      </el-row>
      <el-row class="popover_title mb5" v-if="argData && argData.event">
        <el-col :span="5">状态：</el-col>
        <el-col :span="19">
          <span
            :style="{
              color:
                argData.event.extendedProps.finishStatus == 0 ? '#05A6FF' : (argData.event.extendedProps.finishStatus == 1? '#00C29F': '#FF3F42')
            }"
            >{{
              argData.event.extendedProps.finishStatus == 0 ? "未开始" : (argData.event.extendedProps.finishStatus == 1? "已完成": "逾期")
            }}</span
          >
        </el-col>
      </el-row>

      <el-row class="mb5">
        <el-col :span="24">拜访任务项：</el-col>
      </el-row>
      <el-row v-loading="planTaskListLoading" v-if="argData && argData.event">
        <el-col :offset="5" :span="18" v-for="(item, index) in planTaskList" :key="index">
          <div class="mb5">{{ index + 1 + "." + item }}</div>
        </el-col>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <div class="flex row-between">
          <div>
            <el-button
              class="hvr-icon-bounce mr10"
              size="mini"
              icon="el-icon-plus hvr-icon"
              :disabled="argData.event&&argData.event.extendedProps.visitStatus == 1"
              circle
              @click.prevent="addEvent(argData)"
            >
            </el-button>
            <el-popconfirm
              confirm-button-text="好"
              cancel-button-text="否"
              icon="el-icon-info"
              icon-color="red"
              title="确定删除这个事项吗？"
              @confirm="onRemoveBtnClicked(argData)"
              ><el-button
                class="hvr-icon-buzz-out"
                slot="reference"
                size="mini"
                :disabled="argData.event&&argData.event.extendedProps.visitStatus == 1"
                icon="el-icon-delete hvr-icon"
                circle
              >
              </el-button
            ></el-popconfirm>
          </div>
          <div>
            <el-button type="primary" @click="dialogVisible = false"
              >确 定</el-button
            >
            <el-button @click="dialogVisible = false">取 消</el-button>
          </div>
        </div>
      </span>
    </el-dialog>
    <info ref="info" @check="check"></info>
    <div class="p30"></div>
  </div>
</template>
<script>
import FullCalendar from "@fullcalendar/vue";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";
import interactionPlugin from "@fullcalendar/interaction";
import info from "./components/info.vue";
import { managerList } from "@/api/system/cusManager";
import { getInfoPage } from "@/api/cust/info";
import Schedule from "@/components/schedule";
import {
  getPlan,
  getProjects,
  updatePlan,
  removePlanInfo,
  recreatePlan,
  createPlan,
  getPlanServices,
} from "@/api/plan/task";

// import resourceTimelinePlugin from "@fullcalendar/resource-timeline";

let clickCount = 0;
let prev = ""; // 上一次点击的dom节点
export default {
  components: {
    FullCalendar, // make the <FullCalendar> tag available
    info,
    Schedule,
  },
  data() {
    return {
      argData: {},
      dialogVisible: false,
      search_input: "",
      queryParams: {
        managerId: undefined,
      },
      loading: false,
      managerName: "",
      showFullcalendar: true,
      title: "",
      currentView: {},
      options: [
        { value: "timeline", label: "resource-timeline" },
        { value: "dategrid", label: "agenda" },
      ],
      activebtn: 1,
      typeName: "月",
      //搜索建议数组
      restaurants: [],
      type: "dategrid",
      calendarOptions: {
        locale: "zh",
        timeZone: "UTC",
        plugins: [
          dayGridPlugin,
          timeGridPlugin,
          listPlugin,
          // resourceTimelinePlugin,
          interactionPlugin,
        ],
        buttonText: {
          // 设置按钮
          today: "今天",
          month: "月",
          week: "周",
          dayGrid: "天",
          listMonth: "列表",
        },
        initialView: "dayGridMonth", // 设置默认显示月，可选周、日
        resourceAreaWidth: 200,
        contentHeight: 600,
        slotMinWidth: 70,
        resourceOrder: "number",
        editable: true,
        dayMaxEvents: true, // allow "more" link when too many events
        eventDurationEditable: true, // 可以调整事件的时间
        weekends: true, //是否显示周末，设为false则不显示周六和周日
        selectable: true, // 日历格子可选择
        nowIndicator: true, // 现在的时间线显示
        eventDisplay: "block", // 争对全天的情况下，以块状显示
        headerToolbar: false, // 隐藏头部的导航栏
        weekNumbers: true, //是否在日历中显示周次(一年中的第几周)，如果设置为true，则会在月视图的左侧、周视图和日视图的左上角显示周数。
        weekText: "周",
        selectMirror: false,
        displayEventEnd: true, // like 08:00 - 13:00
        eventTimeFormat: {
          // like '14:30:00'
          hour: "2-digit",
          minute: "2-digit",
          meridiem: false,
          hour12: false, // 设置时间为24小时
        },
        events: [],
        // eventColor: "#378006",
        allDayText: "全天",
        dateClick: this.handleDateClick, //点击日程事件
        //eventClick: this.handleEventClick, //点击日历中的某一日程
        // select: this.handleDateSelect, // 监听用户选择的时间段，
        eventDrop: this.handleEventDrop, //监听事件被拖动的操作
        // eventResize: this.handleEventResize, //监听事件调整大小的操作
        resourceAreaHeaderContent: "Rooms",
        resources: [
          {
            id: "111",
            title: "asas",
            number: 1,
          },
        ],
        schedulerLicenseKey: "GPL-My-Project-Is-Open-Source",
        resourceLabelContent(arg) {
          return {
            html: `<div>id: ${arg.resource.id}</div><div>title: ${arg.resource.title}</div>`,
          };
        },
        views: {
          customTimeLineWeek: {
            type: "resourceTimeline",
            duration: { weeks: 1 },
            slotDuration: { days: 1 },
            buttonText: "Custom Week",
            slotLabelFormat: {
              weekday: "long",
              // month: 'numeric',
              // day: 'numeric',
              omitCommas: true,
            },
          },
          customTimeLineMonth: {
            type: "resourceTimeline",
            duration: { month: 1 },
            slotLabelFormat: {
              // month: 'numeric',
              day: "numeric",
              // omitCommas: true,
            },
          },
          customGridWeek: {
            type: "timeGridWeek",
            dayHeaderFormat: {
              weekday: "long",
            },
            slotLabelFormat: {
              // 左侧时间格式
              hour: "2-digit",
              minute: "2-digit",
              meridiem: "lowercase",
              hour12: false, // false设置时间为24小时
            },
          },
        },
        // 切换视图调用的方法
        datesSet() {},
      },
      taskList: [],
      planTaskList: [],
      planTaskListLoading: false,
      rebornPlanLoading: false,
      calendarApi: null,
      monthEvent: [
        {
          id: "3",
          resourceId: "number_3",
          title: "待办",
          start: "20240422",
          end: "20240428",
          color: "blue",
          extendedProps: {
            description: "测试测试测试测试",
          },
        },
        {
          id: 4,
          title: "待办",
          start: "2024-04-30",
          extendedProps: {
            description: "test test test test test",
          },
        },
      ],
      weekEvent: [
        {
          id: "4",
          resourceId: "4",
          title: "周待办",
          start: "2024-04-21",
          color: "red",
          editable: false,
        },
        {
          id: "5",
          resourceId: "5",
          title: "日待办",
          start: "  ",
          end: "2024-04-23 12:00",
          color: "blue",
          editable: false,
        },
        {
          id: "6",
          resourceId: "6",
          title: "待办1",
          start: "2024-04-25 10:00",
          end: "2024-04-25 18:00",
          color: "orange",
          editable: false,
        },
      ],
      dayDate: "",
      dialogFormVisible: false,
      form: {
        content: "",
      },
      formRules: {
        content: [{ required: true, message: "客户不能为空", trigger: "blur" }],
        visitTime: [
          { required: true, message: "拜访时间不能为空", trigger: "blur" },
        ],
        projectIds: [
          { required: true, message: "拜访项目不能为空", trigger: "blur" },
        ],
        // projectNumber: [
        //   { required: true, message: "项目编号不能为空", trigger: "blur" },
        // ],
      },
      selectInfo: {},
      changeCus: false,
    };
  },
  mounted() {
    this.getManaList();
    this.openTips();
    setTimeout(() => {
      this.showFullcalendar = false;
      this.$nextTick(() => {
        this.calendarApi = this.$refs.fullCalendar.getApi();
        this.title = this.calendarApi.view.title;
        this.getDtata();
      });
    }, 1000);
  },
  watch: {
    // 切换视图显示不同的事件
    "calendarApi.view.type"(newVal) {
      this.getDtata();
    },
    search_input: {
      handler: function (newData, oldData) {
        if (newData == "") {
          this.month();
          //   this.getDtata();
        }
      },
      deep: true,
    },
  },
  methods: {
    // 监听用户选择的时间段，当用户选择了一段时间后会触发该回调，可以在这里处理创建新的日程。
    handleDateSelect(selectInfo) {
      //   console.log("selectInfo: ", selectInfo);
      this.selectInfo = selectInfo;
      this.form.content = "";
      // 用户选择了一个日期范围时触发
      this.dialogFormVisible = true;
    },
    openDraw() {
      this.$refs["info"].open(this.queryParams.managerId);
    },
    openTips() {
      this.$notify({
        title: "提示",
        dangerouslyUseHTMLString: true,
        message:
          '<span class="cblue">拖动店铺</span>即可修改拜访日期，<span class="cblue">点击店铺名称</span>可查看计划详情',
        duration: 5000,
      });
    },
    getTime(dateString) {
      const date = new Date(dateString);
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, "0");
      const day = date.getDate().toString().padStart(2, "0");
      return `${year}-${month}-${day}`;
    },
    // 用户拖动移动事件时触发
    handleEventDrop(dropInfo) {
      const updatedEvent = { ...dropInfo.event };
      console.log(updatedEvent);

      if (updatedEvent._def.extendedProps.visitStatus == 1) {
        this.$message({
          type: "error",
          message: "已完成计划禁止修改",
        });
        dropInfo.revert();
        return;
      }
      updatedEvent.start = dropInfo.revertDuration
        ? dropInfo.oldEvent.start
        : dropInfo.event.start;
      updatedEvent.end = dropInfo.event.end;
      // 更新服务器上的事件或者重新排序你的事件数组
      let visitTime = this.getTime(updatedEvent.start);
      updatePlan({
        planId: updatedEvent._def.publicId,
        visitTime,
      })
        .then((res) => {
          this.$message({
            type: "success",
            message: "修改计划成功",
          });
          this.getDtata();
        })
        .catch(() => {
          if (dropInfo.revert) {
            // 调用revertFunc将事件移回其原始位置
            dropInfo.revert();
          }
          // 您可以添加额外的错误处理逻辑
        });
      // 示例：this.updateEventOnServer(updatedEvent);

      // 如果是在内存中维护事件，则更新本地数据
      const index = this.events.findIndex((e) => e.id === updatedEvent.id);
      if (index !== -1) {
        this.events.splice(index, 1, updatedEvent);
      }
    },
    handleClose() {
      this.dialogVisible = false;
    },
    handleShow(arg) {
      this.planTaskListLoading = true;
      const updatedEvent = { ...arg.event };
      this.planTaskList = [];
      getPlanServices(updatedEvent._def.publicId).then((res) => {
        res.data.forEach((item) => {
          this.planTaskList.push(item.name);
        });
        this.planTaskListLoading = false;
      });
    },
    // 删除计划
    onRemoveBtnClicked(arg) {
      const updatedEvent = { ...arg.event };
      removePlanInfo(updatedEvent._def.publicId)
        .then((res) => {
          this.$message({
            type: "success",
            message: "删除计划成功",
          });
          this.getDtata();
        })
        .catch((error) => {});
    },
    // 用户调整事件长度时触发
    handleEventResize(resizeInfo) {
      console.log("resizeInfo: ", resizeInfo);
      const updatedEvent = { ...resizeInfo.event };
      updatedEvent.end = resizeInfo.event.end;

      // 同样更新服务器或本地数据
      // 示例：this.updateEventOnServer(updatedEvent);

      const index = this.events.findIndex((e) => e.id === updatedEvent.id);
      if (index !== -1) {
        this.events.splice(index, 1, updatedEvent);
      }
    },
    // 点击下拉框
    handleCommand(command) {
      if (command == "month") {
        this.month();
        this.typeName = "月";
      } else if (command == "week") {
        this.week();
        this.typeName = "周";
      } else if (command == "today") {
        this.today();
        this.typeName = "今天";
      } else if (command == "listView") {
        this.listView();
        this.typeName = "列表";
      }
    },
    getDtata() {
      let startTime = this.getTime(this.calendarApi.view.currentStart);
      let endTime = this.getTime(this.calendarApi.view.currentEnd);
      this.loading = true;
      getPlan({
        managerId: this.queryParams.managerId,
        visitTimes: [startTime, endTime],
      })
        .then((res) => {
          if (res.code == 0) {
            let eveList = [];
            res.data.forEach((item) => {
              let des = [];
              item.serviceProjects.forEach((v, i) => {
                des.push(v.name);
              });
              eveList.push({
                id: item.id,
                title: item.companyName,
                start: item.visitTime,
                color:
                  item.finishStatus == 0
                    ? "#05A6FF"
                    : item.finishStatus == 2
                    ? "#FF3F42"
                    : "#00C29F",
                customerId: item.customerId,
                visitStatus: item.visitStatus,
                finishStatus: item.finishStatus,
                editable: true,
                extendedProps: {
                  description: des,
                },
              });
            });
            this.calendarOptions.events = eveList;
            this.search_input = "";
            this.loading = false;
          }
        })
        .catch((err) => {
          this.loading = false;
        });
      //   setTimeout(() => {
      //     this.calendarOptions.events = this.weekEvent;
      //   }, 200);
    },
    //重新生成计划
    rebornPlan() {
      this.rebornPlanLoading = true;
      recreatePlan(this.queryParams.managerId).then((res) => {
        this.rebornPlanLoading = false;
        this.$message({
          type: "success",
          message: "重新生成计划成功",
        });
        this.getDtata();
      });
    },
    // 点击更多
    more(arg) {
      this.planTaskListLoading = true;
      const updatedEvent = { ...arg.event };
      this.planTaskList = [];
      getPlanServices(updatedEvent._def.publicId).then((res) => {
        res.data.forEach((item) => {
          this.planTaskList.push(item.name);
        });
        this.planTaskListLoading = false;
      });
      this.argData = arg;
      this.dialogVisible = true;
      console.log("more ", arg);
    },
    //确认弹框按钮
    navConfirm() {
      this.$refs.formData.validate((valid) => {
        if (valid) {
          createPlan(this.form)
            .then((res) => {
              this.$message({
                type: "success",
                message: "创建计划成功",
              });
              this.form = {
                content: "",
              };
              this.dialogFormVisible = false;
              this.dialogVisible=false;
              this.getDtata();
            })
            .catch((err) => {
              this.$message({
                type: "error",
                message: err.msg,
              });
              this.form = {
                content: "",
              };
              this.dialogFormVisible = false;
              this.dialogVisible=false;
            });
        } else {
          return false;
        }
      });
    },
    // 增加事件
    addEvent(arg) {
      console.log(arg);
      // this.form.projectIds=undefined;
      if (arg) {
        // console.log(arg);
        this.changeCus = false;
        this.form.planId = arg.event.id;
        this.form.content = arg.event.title;
        this.form.customerId = arg.event._def.extendedProps.customerId;
        this.form.visitTime = arg.event.startStr;
        getProjects(this.form.customerId).then((res) => {
          this.taskList = res.data;
        });
      } else {
        this.changeCus = true;
        this.form.content = "";
      }
      this.dialogFormVisible = true;
      // this.monthEvent
    },
    //点击日历中的某一日程
    handleEventClick(clickInfo) {
      // 用户点击事件时触发，用于编辑或删除事件
      const event = clickInfo.event;
      console.log("Clicked on:", event.title);
      // 这里可以弹出模态框进行编辑或调用删除函数等操作
    },
    // 单击事件(日历中的某一天)
    handleDateClick(e) {
      this.dayDate = e.dateStr;
      this.form.visitTime = e.dateStr;
      if (e.dateStr !== prev) {
        clickCount = 0;
      }
      clickCount += 1;
      prev = e.dateStr;
      setTimeout(() => {
        if (clickCount === 2) {
          this.addEvent();
          //   console.log("db click", this.dayDate);
        } else if (clickCount === 1) {
          //   console.log("one click", this.dayDate);
          this.addEvent();
        }
        clickCount = 0;
      }, 300);
    },
    // 切换
    prev() {
      this.calendarApi.prev();
      this.title = this.calendarApi.view.title;
      this.getDtata();
    },
    next() {
      this.calendarApi.next();
      this.title = this.calendarApi.view.title;
      this.getDtata();
    },
    // 今天
    today(date, jsEvent, view) {
      // if (this.type === "timeline") {
      //   this.calendarApi.changeView("customTimeLineWeek");
      // } else {
      //   this.calendarApi.changeView("customGridWeek");
      // }
      this.activebtn = 3;
      this.calendarApi.today();
      this.title = this.calendarApi.view.title;

      this.calendarApi.changeView("timeGridDay");
      // this.calendarApi.today();
      // this.title = this.calendarApi.view.title;
    },
    // 月
    month() {
      if (this.type === "timeline") {
        this.calendarApi.changeView("customTimeLineMonth");
      } else {
        this.calendarApi.changeView("dayGridMonth");
      }
      this.activebtn = 1;
      this.calendarApi.today();
      this.title = this.calendarApi.view.title;
    },
    // 周
    week() {
      if (this.type === "timeline") {
        this.calendarApi.changeView("customTimeLineWeek");
      } else {
        this.calendarApi.changeView("customGridWeek");
      }
      this.activebtn = 2;
      this.calendarApi.today();
      this.title = this.calendarApi.view.title;
    },
    // 天
    day() {
      this.calendarApi.today();
      this.title = this.calendarApi.view.title;
    },
    listView() {
      this.activebtn = 4;
      this.calendarApi.changeView("listWeek"); // 切换到列表周视图
      // 或者使用其他列表视图，如 "listDay" 代表列表日视图
      // this.calendarApi.changeView("listDay");

      this.title = this.calendarApi.view.title;
    },
    // 查询
    search() {
      this.calendarApi.changeView("dayGrid", {
        start: "2022-07-07",
        end: "2022-07-09",
      });
    },
    // 查询功能
    onSearch() {
      let search_text = this.search_input;
      let curr_Events = this.calendarOptions.events;
      if (search_text != "") {
        // this.calendarApi.changeView("list");
        let result = this.searchStr(search_text, curr_Events);
        this.calendarOptions.events = result;
        this.title = "查询结果";
      } else {
        // this.today();
      }
    },
    searchStr(str, arr) {
      let newList = [];
      // 要匹配字符串的首个字符
      let startChar = str.charAt(0);
      // 要匹配字符串的字符长度
      let strLength = str.length;
      for (let i = 0; i < arr.length; i++) {
        // 默认数组arr中对象arr[i]不存在str
        let isExist = false;
        let obj = arr[i];
        for (let key in obj) {
          if (typeof obj[key] === "function") {
            obj[key]();
          } else {
            let keyValue = "";
            // 获取arr[i][key]的值
            if (obj[key] !== null && typeof obj[key] === "string") {
              keyValue = obj[key];
            } else if (obj[key] !== null && typeof obj[key] !== "string") {
              keyValue = JSON.stringify(obj[key]);
            }
            // arr[i][key]中的各个位置的字符与str的0位置字符startChar对比如果相等，
            // 在arr[i][key]中从j位置截取与str长度相同的字符，对比是否相等
            for (let j = 0; j < keyValue.length; j++) {
              // 把原有数据转化为小写，输入数据也转化为纯小写，实现模糊匹配,如区分大小写，可删除toLowerCase()
              if (
                keyValue.charAt(j).toLowerCase() === startChar.toLowerCase()
              ) {
                if (
                  keyValue
                    .substring(j)
                    .substring(0, strLength)
                    .toLowerCase() === str.toLowerCase()
                ) {
                  // 模糊匹配到的字符存在表示arr[i]中存在str
                  isExist = true;
                  break;
                }
              }
            }
          }
        }
        // 当arr[i]中存在str时，把arr[i]放入一个新数组
        if (isExist === true) {
          newList.push(obj);
        }
      }
      // 最后返回这个新数组
      return newList;
    },
    // 选择时间线、日程
    handleType() {
      if (this.type === "timeline") {
        this.calendarApi.changeView("customTimeLineMonth");
        this.calendarOptions.slotLabelFormat = null;
      } else {
        this.calendarApi.changeView("dayGridMonth");
      }
    },
    async getManaList() {
      await managerList({ nickname: "" }).then((res) => {
        res.data.forEach((item) => {
          this.restaurants.push({
            value: item.nickname,
            id: item.id,
          });
        });
      });
      this.queryParams.managerId = this.restaurants[2].id;
      this.managerName = this.restaurants[2].value;
    },
    // 客户经理搜索建议
    querySearch(queryString, cb) {
      var restaurants = this.restaurants;
      var results = queryString
        ? restaurants.filter(this.createFilter(queryString))
        : restaurants;
      // 调用 callback 返回建议列表的数据
      cb(results);
    },
    createFilter(queryString) {
      return (restaurant) => {
        return (
          restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) ===
          0
        );
      };
    },
    clearMan() {
      this.queryParams.managerId = "";
    },
    handleSelect(item) {
      this.queryParams.managerId = item.id;
    },
    check(row) {
      this.form.content = row.companyName;
      this.form.customerId = row.id;
      // console.log(row)
      getProjects(this.form.customerId).then((res) => {
        this.taskList = res.data;
      });
    },
  },
};
</script>
<style scoped>
.flex-shrink-0 {
  flex-shrink: 0;
}
.demo-app {
  display: flex;
  min-height: 100%;
  font-family: Arial, Helvetica Neue, Helvetica, sans-serif;
  font-size: 14px;
}
.demo-app-sidebar {
  width: 300px;
  line-height: 1.5;
  background: #eaf9ff;
  border-right: 1px solid #d3e2e8;
}
.demo-app-sidebar-section {
  padding: 2em;
}
.demo-app-main {
  flex-grow: 1;
  padding: 3em;
}
.fc {
  /* the calendar root */
  max-width: 1100px;
  margin: 0 auto;
}
.fc-left {
  line-height: 36px;
}
.fc-toolbar {
  width: 100%;
  max-width: 1100px;
  margin: 30px auto;
  display: flex;
  flex: 1;
  justify-content: space-between;
  align-content: center;
}
.fc-center {
  /* height: 40px; */
  display: flex;
  align-content: center;
}
.fc-center .title {
  font-size: 16px;
  padding: 0 15px;
  font-weight: 700;
  height: 36px;
  line-height: 36px;
}
.popover_title {
  font-weight: bold;
  margin-bottom: 3px;
}
.activeBtn {
  background: #409eff;
  color: #fff;
}
.row-left {
  -webkit-box-pack: start !important;
  -ms-flex-pack: start !important;
  justify-content: flex-start !important;
}
.blue-color-box {
  background: #05A6FF;
  width: 15px;
  height: 15px;
  border-radius: 3px;
  margin-right: 5px;
}
.green-color-box {
  background: #00C29F;
  width: 15px;
  height: 15px;
  border-radius: 3px;
  margin-right: 5px;
}
.red-color-box {
  background: #FF3F42;
  width: 15px;
  height: 15px;
  border-radius: 3px;
  margin-right: 5px;
}

</style>
<style>
.el-dialog {
  border-radius: 8px;
}
.cblue {
  color: #409eff;
}
.cblue:hover {
  text-decoration: underline;
}
.fc .fc-popover {
  z-index: 999;
  max-height: 200px;
  overflow-y: scroll;
}
.el-popover {
  margin-bottom: 0 !important;
}
.el-dialog__body{
    padding: 15px 20px;
}
.fc-day.fc-day-sat {  
    background-color: #f0f0f0; /* 浅灰色作为示例 */  
}  
  
/* 为周日设置不同的背景色 */  
 .fc-day.fc-day-sun {  
    background-color: #f0f0f0; /* 另一种浅灰色作为示例 */  
}
</style>
