<template>
  <!-- el-mian是个人右侧容器的设置组件 -->
  <el-main>
    <div>
      <!-- 日历头部div -->
      <div class="fc-toolbar" style="display: flex; margin-bottom: 2px">
        <!-- 日历头部左侧显示区域 -->
        <div class="fc-left" style="flex: 1; justify-content: flex-start">
          <div style="vertical-align: middle">
            <el-input
              placeholder="请输入查询内容"
              v-model="search_input"
              clearable
              class="input"
              size="medium"
              @keyup.enter.native="onSearch"
              @clear="getToday()"
            >
              <i slot="suffix" class="el-icon-search" @click="onSearch"></i>
            </el-input>
          </div>
        </div>
        <!-- 日历头部中间显示区域 -->
        <div
          class="fc-center"
          style="display: flex; flex: 3; justify-content: center"
        >
          <el-button-group>
            <el-button
              icon="el-icon-d-arrow-left"
              @click="getPrevYear"
              class="fc_btns"
            ></el-button>
            <el-button
              icon="el-icon-arrow-left"
              @click="getPrev"
              class="fc_btns"
            ></el-button>
          </el-button-group>
          <h2 class="title">
            {{ title }}
          </h2>
          <el-button-group>
            <el-button
              icon="el-icon-arrow-right"
              @click="getNext"
              class="fc_btns"
            ></el-button>
            <el-button
              icon="el-icon-d-arrow-right"
              @click="getNextYear"
              class="fc_btns"
            ></el-button>
          </el-button-group>
        </div>
        <!-- 显示图标注释栏 -->
        <!-- <div class="tips" style="display: flex">
          <div
            style="
              height: 14px;
              width: 14px;
              background: green;
              text-align: center;
              position: relative;
              top: 27%;
            "
          ></div>
          <span class="tip-content">已完成</span>
          <div
            style="
              height: 14px;
              width: 14px;
              background: #fe9b02;
              text-align: center;
              position: relative;
              top: 27%;
            "
          ></div>
          <span class="tip-content">未开始</span>
        </div> -->
        <!-- 日历头部右侧显示区域 -->
        <div class="fc-right">
          <el-button-group>
            <el-button
              @click="today"
              type="success"
              plain
              size="medium"
              class="fc_btns"
              >今天</el-button
            >
            <el-button
              @click="month"
              type="primary"
              plain
              size="medium"
              class="fc_btns"
              >月</el-button
            >
            <el-button
              @click="week"
              type="primary"
              plain
              size="medium"
              class="fc_btns"
              >周</el-button
            >
            <el-button
              @click="day"
              type="primary"
              plain
              size="medium"
              class="fc_btns"
              >日</el-button
            >
            <el-button
              @click="list"
              type="primary"
              plain
              size="medium"
              class="fc_btns"
              >列表</el-button
            >
          </el-button-group>
        </div>
      </div>
    </div>
    <!-- 日历本体 -->
    <el-row>
      <el-col :md="24" :xs="24">
        <div style="margin-top: 0px">
          <FullCalendar
            class="calendar"
            ref="fullCalendar"
            :options="calendarOptions"
            ><template v-slot:eventContent="arg">
              <el-popover
                :append-to-body="true"
                ref="popover1"
                placement="top-start"
                width="220"
                :visible-arrow="true"
                trigger="hover"
                :teleported="false"
                popper-class="popover"
                :open-delay="100"
                @show="showPic(arg)"
                @hide="popoverPicReset(arg)"
              >
                <el-row class="popover_title">
                  <el-col
                    :span="12"
                    :style="{
                      color:
                        arg.event.extendedProps.isDone == false
                          ? 'red'
                          : 'green',
                    }"
                  >
                    <span
                      style="padding-right: 2px"
                      :style="{
                        'border-left':
                          arg.event.extendedProps.isDone == false
                            ? '5px solid red'
                            : '5px solid green',
                      }"
                    ></span
                    >{{
                      arg.event.extendedProps.isDone == false
                        ? "未开始"
                        : "已完成"
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
                      arg.event.allDay == true
                        ? "全天"
                        : formatTimer(arg.event.start)
                    }}</el-col
                  >
                </el-row>
                <el-row>
                  <el-col :span="24" style="text-align: center">
                    <el-image
                      v-if="popoverimg.length != 0"
                      :src="popoverimg[0]"
                      @click="PreviewPic(popoverimg)"
                      fit="fill"
                      class="popoverShowImg"
                      ><div slot="placeholder" class="image-slot">
                        加载中<span class="dot">...</span>
                      </div></el-image
                    >
                    <div class="block"></div>
                  </el-col>
                </el-row>
                <el-row class="popover_content">
                  <el-col :span="24" style="max-height: 150px; overflow: auto">
                    <span class="click">{{ arg.event.title }}</span>
                  </el-col>
                  <el-col :span="24">
                    <el-link
                      v-if="
                        arg.event.extendedProps.address != null &&
                        arg.event.extendedProps.address != ''
                      "
                      :href="undefined"
                      :underline="false"
                      @click="fileDownload(arg.event.extendedProps.address)"
                      class="link"
                      >{{
                        arg.event.extendedProps.address == null
                          ? ""
                          : arg.event.extendedProps.address.replace(
                              "D:\\flask\\upload\\",
                              ""
                            )
                      }}</el-link
                    ></el-col
                  >
                </el-row>

                <el-row style="margin-top: 5px"
                  ><el-col style="width: 15%"
                    ><div>
                      <el-button
                        class="hvr-icon-pulse-grow"
                        :popperAppendToBody="false"
                        size="mini"
                        icon="el-icon-edit hvr-icon"
                        type="primary"
                        circle
                        @click="handleEventClick(arg)"
                      >
                      </el-button>
                    </div>
                  </el-col>
                  <el-col style="width: 15%"
                    ><el-button
                      class="hvr-icon-bounce"
                      size="mini"
                      type="success"
                      icon="el-icon-document-checked hvr-icon"
                      circle
                      @click="onCheckBtnClicked(arg)"
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
                        type="danger"
                        icon="el-icon-delete hvr-icon"
                        circle
                      >
                      </el-button
                    ></el-popconfirm> </el-col
                ></el-row>
                <div slot="reference">
                  <span class="tree_span_text">{{ arg.timeText }}</span>
                  <span>{{ arg.event.title }}</span>
                </div>
              </el-popover>
            </template>
          </FullCalendar>
        </div>
        <!-- 事件添加或修改对话框 -->
        <el-dialog
          :visible.sync="dialogVisible"
          :popperAppendToBody="false"
          @close="cancel"
          :close-on-click-modal="false"
          class="calendar_matters"
        >
          <div slot="title" class="header-title" :style="{ color: 'black' }">
            <i class="el-icon-edit"></i><span> &nbsp;事件</span>
          </div>
          <el-form ref="form" :model="form" label-width="80px">
            <el-row>
              <el-col :span="12" :xs="24">
                <el-form-item label="事件时间">
                  <div class="dateRange">
                    <el-date-picker
                      v-model="dateRange"
                      type="datetimerange"
                      range-separator="至"
                      start-placeholder="开始日期"
                      end-placeholder="结束日期"
                    >
                    </el-date-picker>
                  </div>
                </el-form-item>
              </el-col>
              <el-col :span="12"> </el-col>
            </el-row>
            <el-row>
              <el-col :span="24"
                ><el-form-item label="具体事项">
                  <el-input
                    v-model="form.remark"
                    type="textarea"
                    class="calendar_details"
                  ></el-input> </el-form-item
              ></el-col>
            </el-row>
            <el-row>
              <el-col :span="12" :xs="24"
                ><el-form-item label="提醒类别" prop="deptId">
                  <treeselect
                    v-model="form.category"
                    :options="Options"
                    :props="defaultProps"
                    :show-count="true"
                    placeholder="请选择类型"
                    @select="categorySelected"
                  /> </el-form-item
              ></el-col>
              <el-col :span="12" :xs="24"
                ><el-form-item
                  v-if="form.userId == undefined"
                  label="记录人"
                  prop="userName"
                >
                  <el-input
                    v-model="form.userName"
                    maxlength="30"
                    disabled
                    class="userName"
                  /> </el-form-item
              ></el-col>
            </el-row>

            <el-row>
              <el-col :span="12"> </el-col>
              <el-col :span="12" :xs="24">
                <el-form-item label="状态">
                  <el-radio-group v-model="form.isDone">
                    <el-radio label="0">已完成</el-radio>
                    <el-radio label="1">未确认</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="18" :xs="24">
                <el-form-item label="附件" class="attachment" prop="address">
                  <el-upload
                    action="#"
                    :show-file-list="false"
                    :auto-upload="false"
                    :on-change="address_beforeupload"
                  >
                    <div>
                      <el-button
                        type="primary"
                        icon="el-icon-folder-opened"
                      ></el-button>
                    </div>
                  </el-upload>
                  <el-input
                    v-model="form.address"
                    clearable
                  ></el-input></el-form-item
              ></el-col>
            </el-row>
            <el-row>
              <el-col :span="24" :xs="24">
                <el-form-item label="相关图片" prop="address">
                  <el-upload
                    ref="uploadFile"
                    class="upload-demo"
                    action="#"
                    :auto-upload="false"
                    :show-file-list="true"
                    :on-change="beforeupload"
                    list-type="picture-card"
                    :file-list="filelist"
                    multiple
                  >
                    <i slot="default" class="el-icon-plus"></i>
                    <div slot="file" slot-scope="{ file }">
                      <img
                        class="el-upload-list__item-thumbnail"
                        :src="file.url"
                        alt=""
                      />
                      <span class="el-upload-list__item-actions">
                        <span
                          class="el-upload-list__item-preview"
                          @click="handlePictureCardPreview(file)"
                        >
                          <i class="el-icon-zoom-in"></i>
                        </span>
                        <span
                          v-if="!disabled"
                          class="el-upload-list__item-delete"
                          @click="handleDownload(file)"
                        >
                          <i class="el-icon-download"></i>
                        </span>
                        <span
                          v-if="!disabled"
                          class="el-upload-list__item-delete"
                          @click="handleRemove(file)"
                        >
                          <i class="el-icon-delete"></i>
                        </span>
                      </span>
                    </div>
                  </el-upload>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="submitForm">确 定</el-button>
            <el-button @click="cancel">取 消</el-button>
          </div>
        </el-dialog>
        <!-- 图片预览对话框 -->
        <el-image-viewer
          v-if="img_dialogVisible"
          :initial-index="0"
          :on-close="onClose"
          :url-list="dialogImageUrl"
          style="z-index: 3000"
        ></el-image-viewer>
      </el-col>
    </el-row>
  </el-main>
</template>

<script>
// import { getCalendarList } from "@/api/calendar.js";
import FullCalendar from "@fullcalendar/vue";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
// import tippy from "tippy.js";
// import "../../assets/tippy.css";
// import calendar from "../../utils/calendar.js";
// import { INITIAL_EVENTS, createEventId } from "./event-utils";
import { auto } from "@popperjs/core";
// import "../../directives.js"; // v-dialogDrag: 弹窗可拖拽属性
import Treeselect from "@riophae/vue-treeselect"; // Treeselect插件
import "@riophae/vue-treeselect/dist/vue-treeselect.css"; // 若依css设置

import { managerList } from "@/api/system/cusManager";
import { getPlan } from "@/api/plan/task";
export default {
  // 注册局部组件
  components: {
    FullCalendar,
    Treeselect,
    "el-image-viewer": () =>
      import("element-ui/packages/image/src/image-viewer"),
  },
  data() {
    return {
      // 搜索框输入的文本
      search_input: "",

      // treeselect插件默认配置
      defaultProps: {
        children: "children",
        label: "label",
      },
      // 提醒类别设置
      Options: [
        {
          id: "工作类别",
          pid: 0,
          label: "工作类别",
          children: [],
        },
        {
          id: "生活类别",
          pid: 0,
          label: "生活类别",
          children: [],
        },
        {
          id: "其他类别",
          pid: 0,
          label: "其他类别",
          children: [],
        },
        {
          id: "",
          pid: 0,
          label: "无",
          children: [],
        },
      ],

      // 表单是否显示
      dialogVisible: false,
      // 表单标题栏
      title: "事件",
      // 表单当前编辑模式设置，add或amend
      form_edited_state: "",
      // 表单内容设置项
      form: {
        remark: undefined,
        isDone: undefined,
        img: "",
        address: "",
      },
      // 表单日期设置
      dateRange: [],
      // 图片预览的操作按钮是否展示
      disabled: false,
      // 图片是否显示
      img_dialogVisible: false,
      // 预览图片地址
      dialogImageUrl: "",
      // el-popover弹出框标题内容
      popover_title: "事项",
      // el-popover图片地址存放
      popoverimg: [],
      // 附件地址存放
      filelist: [],

      // ------------------
      // Fullcalendar版本@5.11.3日历控件设置项，官网文档地址：https://fullcalendar.io/
      calendarOptions: {
        // visibleRange: { start: "2021-09-01", end: "2022-10-01" }, // 可视化区间
        // validRange: { start: "2021-09-01", end: "2021-09-01" }, // 可展示区间
        // 引入的插件，比如fullcalendar/daygrid，fullcalendar/timegrid引入后才可显示月，周，日
        plugins: [dayGridPlugin, interactionPlugin, timeGridPlugin, listPlugin],
        initialView: "dayGridMonth", // 默认为那个视图（月：dayGridMonth，周：timeGridWeek，日：timeGridDay）
        firstDay: 1, // 设置一周中显示的第一天是哪天，周日是0，周一是1，类推
        locale: "zh-cn", // 切换语言，当前为中文
        allDaySlot: true, // 不显示all-day
        businessHours: true, //
        handleWindowResize: true, // 是否随浏览器窗口大小变化而自动变化。
        allDayText: "全天", // 设置all-Day显示的文字，不设置的话默认显示"all-Day"
        themeSystem: "bootstrap", // 主题色(本地测试未能生效)
        // loading: this.loadingEvent, // 视图数据加载中、加载完成触发（用于配合显示/隐藏加载指示器。）
        // selectAllow: this.selectAllow, //编程控制用户可以选择的地方，返回true则表示可选择，false表示不可选择
        // eventMouseEnter: this.eventMouseEnter, // 鼠标滑过
        allowContextMenu: false,
        editable: true, // 是否可以进行（拖动、缩放）修改
        eventStartEditable: true, // Event日程开始时间可以改变，默认true，如果是false其实就是指日程块不能随意拖动，只能上下拉伸改变他的endTime
        eventDurationEditable: true, // Event日程的开始结束时间距离是否可以改变，默认true，如果是false则表示开始结束时间范围不能拉伸，只能拖拽
        selectable: true, // 是否可以选中日历格
        selectMirror: true,
        selectMinDistance: 0, // 选中日历格的最小距离
        // eventLimit: true, //数据条数太多时，限制各自里显示的数据条数（多余的以“+2more”格式显示），默认false不限制,支持输入数字设定固定的显示条数
        moreLinkContent: "+ 更多", //当一块区域内容太多以"+2 more"格式显示时，这个more的名称自定义
        // dayPopoverFormat: "YYYY-M-d",
        dayMaxEventRows: true, // 日历显示事件最大条数，for all non-TimeGrid views
        weekends: true, //
        navLinks: true, // 天链接
        selectHelper: false,
        slotEventOverlap: false, // 相同时间段的多个日程视觉上是否允许重叠，默认true允许
        aspectRatio: 1.35, //设置日历单元格宽度与高度的比例。
        expandRows: true,
        height: auto,
        contentHeight: 100,
        nowIndicator: true, //周/日视图中显示今天当前时间点（以红线标记），默认false不显示
        weekMode: "fixed", //在月视图里显示周的模式，因为每月周数可能不同，所以月视图高度不一定。fixed：固定显示6周高，日历高度保持不变liquid：不固定周数，高度随周数变化variable：不固定周数，但高度固定
        weekNumbers: true, //是否在日历中显示周次(一年中的第几周)，如果设置为true，则会在月视图的左侧、周视图和日视图的左上角显示周数。
        weekText: "周",
        customButtons: {
          //自定义按钮
          getToday: {
            text: "今天",
            click: this.getToday,
          },
          getNext: {
            text: ">",
            click: this.getNext,
          },
          getPrev: {
            text: "<",
            click: this.getPrev,
          },
          getPrevYear: {
            text: "<<",
            click: this.getPrevYear,
          },
          getNextYear: {
            text: ">>",
            click: this.getNextYear,
          },
          customButton: {
            text: "今日标记全部已完成",
            click: this.customButton,
          },
          customButton1: {
            text: "显示未完成",
            click: this.customButton,
          },
        },
        // 日历头部按钮，即Fullcalendar表头显示区域
        // headerToolbar: {
        //   left: "getPrevYear,getPrev,getToday,getNext,getNextYear", //"getPrevYear,getPrev,getToday,getNext,getNextYear customButton,customButton1",
        //   center: "title",
        //   right:
        //     "customButton customButton1 dayGridMonth,timeGridWeek,timeGridDay,listMonth", //dayGridWeek,listMonth
        // },
        headerToolbar: false, // Fullcalendar表头显示区域不显示，显示自己自定义的html头部
        // 使用内置按钮的显示文本
        buttonText: {
          today: "今天",
          month: "月",
          week: "周",
          day: "日",
          list: "日程",
        },
        // 设置日历显示事件时间头
        slotLabelFormat: {
          hour: "2-digit",
          minute: "2-digit",
          meridiem: false,
          hour12: false, // 设置时间为24小时
        },
        // 视图的一些基本设置
        views: {
          // 月视图阳历转农历
          dayGridMonth: {
            height: 500,
            displayEventTime: true, //是否显示时间
            dayMaxEventRows: 4, // adjust to 6 only for timeGridWeek/timeGridDay
            // titleFormat: { year: "numeric", month: "2-digit", day: "2-digit" }, //控制日历显示的标题
            // moreLinkContent: "+ 更多", //可放在这里单独对每个视图控制显示更多的文字
            moreLinkClick: "popover",
            eventTimeFormat: {
              hour: "numeric",
              minute: "2-digit",
              meridiem: false,
            },
            dayPopoverFormat: {
              month: "long",
              day: "numeric",
              year: "numeric",
            },
            // 显示农历
            // dayCellContent(item) {
            //   let _date = new Date(item.date).toLocaleDateString().split("/");
            //   let _dateF = calendar.solarToLunar(_date[0], _date[1], _date[2]);
            //   // 以二十四节气覆盖农历日期
            //   if (calendar.getLunar24Days(_date[0], _date[1], _date[2])) {
            //     _dateF.dayStr = calendar.getLunar24Days(
            //       _date[0],
            //       _date[1],
            //       _date[2]
            //     );
            //   }
            //   return { html: `<p>${item.dayNumberText}(${_dateF.dayStr})</p>` };
            // },
          },
          timeGridWeek: {},
          timeGridDay: {},
          listMonth: {},
        },
        // 设置过往时间无法点击
        // selectAllow: function (clickInfo) {
        //   if (clickInfo.end < new Date()) {
        //     return false;
        //   }
        //   return true;
        // },
        weekends: true, //是否显示周末，设为false则不显示周六和周日
        selectable: true, //是否可以选中日历格
        editable: false, //是否可以进行（拖动、缩放）修改
        navLinks: true, //天链接
        select: this.selectDate, //选中日历格事件
        eventClick: this.handleEventClick, //选中备忘录事件
        eventsSet: this.handleEvents,
        events: this.getCalendarList, //获取数据源
        eventMouseEnter: this.eventMouseEnter, //鼠标悬浮事件
        slotEventOverlap: true, //相同时间段的多个日程视觉上是否允许重叠，默认true允许
        eventResize: this.onEventResize, // 事件时间区间调整
        eventDrop: this.onEventResize, // 事件Drag-Drop事件
        eventMouseLeave: this.eventMouseLeave, // 鼠标移出事件发生的事件
      },
    };
  },
  mounted() {
    this.calendarApi = this.$refs.fullCalendar.getApi();
    this.title = this.calendarApi.view.title;
  },
  watch: {
    search_input: {
      handler: function (newData, oldData) {
        if (newData == "") {
          this.month();
          this.getToday();
        }
      },
      deep: true,
    },
  },
  methods: {
    // 将当前时间移至今日事件
    today() {
      this.getToday();
    },
    // 月视图
    month() {
      this.calendarApi.changeView("dayGridMonth");
      this.title = this.calendarApi.view.title;
    },
    // 周视图
    week() {
      this.calendarApi.changeView("timeGridWeek");
      this.title = this.calendarApi.view.title;
    },
    // 日视图
    day() {
      this.calendarApi.changeView("timeGridDay");
      this.handleTime(this.calendarApi.currentData.dateProfile.activeRange);
      this.title = this.calendarApi.view.title;
    },
    // 列表视图
    list() {
      this.calendarApi.changeView("listMonth");
      this.title = this.calendarApi.view.title;
    },
    // 鼠标划过，使用tippy插件显示tooltip
    eventMouseEnter(info) {
      // 非周列表的情况下显示悬浮提示;
      // if (info.view.type != "listWeek") {
      //   tippy(info.el, {
      //     content: info.event.title,
      //     placement: "top-start",
      //   });
      // }
    },
    // 鼠标离开
    eventMouseLeave(arg) {
      // console.log("mouseleave");
      // arg.jsEvent.preventDefault();
    },
    // 事项调整时间区间事件
    onEventResize(arg) {
      let newTimeStart = this.dateFormat(
        "YYYY-mm-dd HH:MM:SS",
        arg.event.startStr
      );
      let newTimeEnd = this.dateFormat("YYYY-mm-dd HH:MM:SS", arg.event.endStr);
      this.get("/calendar/updateTime", {
        id: arg.event.id,
        Start: newTimeStart,
        End: newTimeEnd,
      }).then((res) => {
        this.$message.success(res.data.info);
      });
      // 必须加这句，不然切换视图会有显示事件数目的bug
      let calendarApi = arg.view.calendar;
      calendarApi.today();
    },
    // el-popover图片点击预览放大事件
    PreviewPic(arg) {
      this.dialogImageUrl = arg;
      this.img_dialogVisible = true;
      this.stopMove();
    },
    // el-popover图片点击预览后关闭事件
    onClose() {
      this.img_dialogVisible = false;
      this.move();
    },
    // el-popover隐藏时触发，将图片地址修改为空
    async popoverPicReset(arg) {
      this.popoverimg = await [];
      let calendarApi = arg.view.calendar;
      //   calendarApi.show_pic(arg);
    },
    // el-popover显示图片功能
    async showPic(arg) {
      let calendarApi = arg.view.calendar;
      this.popoverimg = [];

      await this.post("/get_img_url", arg.event.extendedProps.img, "blob").then(
        (res) => {
          // console.log(res.data.imgs);
          res.data.imgs.forEach((item, index) => {
            const img = "data:image/png;base64," + item;
            this.file = this.base64ImgtoFile(img); // 得到File对象
            const url =
              window.webkitURL.createObjectURL(this.file) ||
              window.URL.createObjectURL(this.file);
            this.popoverimg.push(url);
          });
        }
      );
      //   calendarApi.show_pic(arg);
    },
    // 提醒类别选择
    categorySelected(node) {
      this.form.categoryName = node.label;
    },
    // 自定义按钮
    customButton() {
      console.log("点击了自定义按钮");
    },
    // 今天
    getToday() {
      let calendarApi = this.$refs.fullCalendar.getApi();
      calendarApi.today();
      this.handleTime(calendarApi.currentData.dateProfile.activeRange);
      this.title = this.calendarApi.view.title;
      this.search_input = "";
    },
    // 上一年
    getPrevYear() {
      let calendarApi = this.$refs.fullCalendar.getApi();
      calendarApi.prevYear();
      // this.handleTime(calendarApi.currentData.dateProfile.activeRange);
      this.title = this.calendarApi.view.title;
    },
    // 下一年
    getNextYear() {
      let calendarApi = this.$refs.fullCalendar.getApi();
      calendarApi.nextYear();
      // this.handleTime(calendarApi.currentData.dateProfile.activeRange);
      this.title = this.calendarApi.view.title;
    },
    // 上一月
    getPrev() {
      let calendarApi = this.$refs.fullCalendar.getApi();
      calendarApi.prev();
      // this.handleTime(calendarApi.currentData.dateProfile.activeRange);
      this.title = this.calendarApi.view.title;
    },
    // 下一月
    getNext() {
      let calendarApi = this.$refs.fullCalendar.getApi();
      calendarApi.next();
      // this.handleTime(calendarApi.currentData.dateProfile.activeRange);
      this.title = this.calendarApi.view.title;
    },
    // 处理时间格式
    handleTime(activeRange) {
      let result = {
        startStr: activeRange.start,
        endStr: activeRange.end,
      };
      this.getCalendarList();
    },

    // 获取列表信息
    getCalendarList(result) {
      // 以当前时间插入数据
      let _this = this;
      // 注意，请求的数据是数据库所有数据即可，不用考虑当前显示的时间范围，Fullcalendar会自动只显示当前日期范围的事件
      getPlan({
        managerId: 137,
        visitTimes: ["2024-05-01", "2024-06-01"],
      })
        .then((res) => {
          _this.calendarOptions.events = [];
          res.data.forEach((item) => {
            let des = "";
            item.serviceProjects.forEach((v, i) => {
              if (i != 0) {
                des = "" + des + v.name;
              } else {
                des = des + v.name;
              }
            });
            var data = {
              id: item.id,
              title: item.customerName,
              start: item.visitTime,
              //   end: item[3],
              //   allDay: item[4],
              //   className: item[5] == true ? "borderGreen" : "borderOrange",
              // 非标准字段:除上述字段外，您还可以在每个事件对象中包含自己的非标准字段。FullCalendar不会修改或删除这些字段。例如，开发人员通常包括描述在回调中使用的字段，如事件呈现挂钩. 任何非标准属性都将移动到extendedProps哈希期间事件解析.
              extendedProps: {
                description: des,
                // isDone: item[5],
                // img: item[6],
                // address: item[7],
                // type: item[8],
              },
              others: "该字段值会被自动归类到extendedProps里面",
              //   backgroundColor:
              //     (item[4] == true ? "all_Day" : "other") != "all_Day"
              //       ? item[5] == true
              //         ? "#c2fccd"
              //         : "#FFECDC"
              //       : "#66b1ff",
              editable: false, // 是否可以进行（拖动、缩放）修改
            };
            _this.calendarOptions.events.push(data);
          });
        })
        .catch((error) => {
          this.$message.error(error);
        });
    },

    // 选择日期，填写事件
    selectDate: function (arg) {
      let startTime = this.dateFormat("YYYY-mm-dd HH:MM", arg.start);
      let endTime = this.dateFormat("YYYY-mm-dd HH:MM", arg.end);
      this.dialogVisible = true;
      this.form_edited_state = "add";
      this.dateRange = [startTime, endTime]; // 设置当前记录事件的选择的时间段
      let info = JSON.parse(localStorage.getItem("userInfo")); // 获取当前记录人信息
      this.form.userName = info.username; // 设置记录人
      this.form.isDone = "1"; // 默认设置为事件未完成状态
      this.form.isAllDay = arg.allDay;
      let calendarApi = arg.view.calendar;
      calendarApi.unselect(); // 清除当前日期选择
    },
    // 表单确定按钮，提交事件
    submitForm() {
      let calendarApi = this.$refs.fullCalendar.getApi();
      var startTime = this.dateFormat("YYYY-mm-dd HH:MM:SS", this.dateRange[0]);
      var endTime = this.dateFormat("YYYY-mm-dd HH:MM:SS", this.dateRange[1]);
      if (this.form_edited_state == "add") {
        // 添加事件的后端数据请求
        this.get(
          "/calendar/eventRecord",
          {
            isAllDay: this.form.isAllDay,
            dateRange: JSON.stringify([startTime, endTime]),
            remark: this.form.remark,
            type: this.form.type == undefined ? "" : this.form.type,
            isDone: this.form.isDone == "1" ? false : true,
            userName: this.form.userName,
            address: this.form.address == undefined ? "" : this.form.address,
            img: this.form.img == null ? "" : this.form.img,
          },
          ""
        ).then((res) => {
          this.$message.success("事件添加成功！");
          this.handleTime(calendarApi.currentData.dateProfile.activeRange);
        });
      } else if (this.form_edited_state == "amend") {
        // 修改事件的后端数据请求
        this.get(
          "/calendar/submit",
          {
            id: this.form.id,
            dateRange: JSON.stringify([startTime, endTime]),
            remark: this.form.remark,
            type: this.form.type == undefined ? "" : this.form.type,
            isDone: this.form.isDone == "1" ? false : true,
            userName: this.form.userName,
            address: this.form.address == undefined ? "" : this.form.address,
            img: this.form.img == null ? "" : this.form.img,
            // type: this.form.category,
          },
          ""
        ).then((res) => {
          this.$message.success("修改事项成功！");
          if (this.search_input == "") {
            this.handleTime(calendarApi.currentData.dateProfile.activeRange);
          }
        });
      }
      this.dialogVisible = false;
    },
    // 表单取消按钮
    cancel() {
      this.form = {
        id: "",
        dateRange: "",
        remark: "",
        type: "",
        isDone: false,
        userName: "",
        address: "",
        img: "",
      };
      this.filelist = [];
      this.dialogVisible = false;
      this.form_edited_state = "";
    },
    // 点击事项事件
    handleEventClick(clickInfo) {
      this.dialogVisible = true;
      this.form_edited_state = "amend"; //修改状态
      var startTime = this.dateFormat(
        "YYYY-mm-dd HH:MM:SS",
        clickInfo.event.startStr
      );
      var endTime = this.dateFormat(
        "YYYY-mm-dd HH:MM:SS",
        clickInfo.event.endStr
      );
      // 设置打开对话框各部分的显示值
      this.form.id = clickInfo.event.id;
      this.dateRange = [clickInfo.event.start, clickInfo.event.end];
      this.form.remark = clickInfo.event.title;
      // 获取当前登录用户的名字
      let info = JSON.parse(localStorage.getItem("userInfo"));
      this.form.userName = info.username;
      this.form.isDone =
        clickInfo.event.extendedProps.isDone == true ? "0" : "1";
      this.form.img = clickInfo.event.extendedProps.img;
      this.form.address = clickInfo.event.extendedProps.address;
      this.form.category =
        clickInfo.event.extendedProps.type == undefined
          ? ""
          : clickInfo.event.extendedProps.type;
      // 请求后端图片URL方法
      this.post("/get_img_url", clickInfo.event.extendedProps.img).then(
        (res) => {
          res.data.imgs.forEach((item, index) => {
            const img = "data:image/png;base64," + item;
            this.file = this.base64ImgtoFile(img); // 得到File对象
            const url =
              window.webkitURL.createObjectURL(this.file) ||
              window.URL.createObjectURL(this.file);
            this.filelist.push({
              name: res.data.origin_url[index],
              url: url,
            });
          });
        }
      );
    },
    // 事项标记已完成或改为未完成的事件
    onCheckBtnClicked(arg) {
      this.get(
        "/calendar/checked",
        { id: arg.event.id, status: arg.event.extendedProps.isDone },
        ""
      ).then((res) => {
        this.calendarOptions.events.filter((item) => {
          if (item.id == arg.event.id) {
            item.extendedProps.isDone = !arg.event.extendedProps.isDone;
            arg.event.extendedProps.isDone == true
              ? (item.className = "borderOrange")
              : (item.className = "borderGreen");
            item.backgroundColor =
              (arg.event.allDay == true ? "all_Day" : "other") != "all_Day"
                ? arg.event.extendedProps.isDone == true
                  ? "#FFECDC"
                  : "#c2fccd"
                : "#66b1ff";
          }
          return item;
        });
        this.$message.success("事件状态修改成功！");
      });
    },
    // 事项删除事件
    onRemoveBtnClicked(arg) {
      this.get("/calendar/remove", arg.event.id).then((res) => {
        this.calendarOptions.events = this.calendarOptions.events.filter(
          (item) => {
            return item.id != arg.event.id;
          }
        );
      });
    },
    // 当前事件绑定，此段代码可删掉
    handleEvents(events) {
      this.currentEvents = events;
    },
    // 提交上传文件
    submitFileForm() {
      /* 这里为啥会先发一个Option请求再发Post请求：这是浏览器处理跨域做的逻辑。
      CORS跨域请求会先发option请求，如果server返回access-control-allow-origin头为*或者和当前域名一致的话，
      才会进入第二段的真正请求。不然就会报 cross origin request is forbidden错误。*/
      this.$refs.upload.submit();
    },
    // 对话框图片预览放大
    handlePictureCardPreview(file) {
      this.dialogImageUrl = [file.url];
      this.img_dialogVisible = true;
    },
    // 预览图片下载到本地
    handleDownload(file) {
      // console.log(file, "@@@@");
      this.get("/bbx_img_download", file.name, "blob").then((res) => {
        var blob = new Blob([res.data], {
          type: "application/octet-stream;chartset=UTF-8",
        });
        var url = window.URL.createObjectURL(blob);
        var a = document.createElement("a");
        a.href = url;
        //文件名
        let name = res.config.params.replace("F:\\flask\\upload\\", "");
        a.download = name;
        a.click();
        window.URL.revokeObjectURL(url); // 释放掉blob对象
      });
    },
    // 下载文件
    fileDownload(file) {
      // console.log(this.urlToLink(file));
      // 判断是否为网页
      let bool = this.urlToLink(file);
      if (bool) {
        var b = document.createElement("a");
        b.setAttribute("href", file);
        b.setAttribute("target", "_blank");
        document.body.appendChild(b);
        b.click();
      } else {
        if (file != null || file != "") {
          this.get("/get_file_download", file, "blob").then((res) => {
            var blob = new Blob([res.data], {
              type: "application/octet-stream;chartset=UTF-8",
            });
            var url = window.URL.createObjectURL(blob);
            var a = document.createElement("a");
            a.href = url;
            //文件名
            let name = res.config.params.replace("F:\\flask\\upload\\", "");
            a.download = name;
            a.click();
            window.URL.revokeObjectURL(url); // 释放掉blob对象
          });
        } else {
        }
      }
    },
    // 移除对话框预览图片
    handleRemove(file) {
      let address = this.form.img.split(",");
      address = address.filter((item) => {
        return item != file.name;
      });
      address = address.join(",");
      this.form.img = address;
      const newArray = this.filelist.filter((item, index) => {
        return item.uid != file.uid;
      });
      this.filelist = newArray;
    },
    // 判断字符串是否为网页
    urlToLink(str) {
      var reg = /(http:\/\/|https:\/\/)((\w|=|\?|\.|\/|&|-)+)/g;
      if (reg.test(str)) {
        return true;
      } else {
        return false;
      }
    },
    // 停止页面滚动
    stopMove() {
      const m = (e) => {
        e.preventDefault();
      };
      document.body.style.overflow = "hidden";
      document.addEventListener("touchmove", m, false); // 禁止页面滑动
    },
    // 开启页面滚动
    move() {
      const m = (e) => {
        e.preventDefault();
      };
      document.body.style.overflow = "auto";
      document.removeEventListener("touchmove", m, true);
    },
    // 查询功能
    onSearch() {
      let search_text = this.search_input;
      let curr_Events = this.calendarOptions.events;
      if (search_text != "") {
        this.calendarApi.changeView("list");
        let result = this.searchStr(search_text, curr_Events);
        this.calendarOptions.events = result;
        this.title = "查询结果";
      } else {
        // this.today();
      }
    },
    // 数组中匹配单个字符串的方法，传入数组支持格式[{},{}],
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
    // 格式化时间 fmt是所需格式化的格式，如"YYYY-mm-dd HH:MM:SS",date是所需格式化的日期
    dateFormat(fmt, date) {
      let ret = "";
      date = new Date(date);
      const opt = {
        "Y+": date.getFullYear().toString(), // 年
        "m+": (date.getMonth() + 1).toString(), // 月
        "d+": date.getDate().toString(), // 日
        "H+": date.getHours().toString(), // 时
        "M+": date.getMinutes().toString(), // 分
        "S+": date.getSeconds().toString(), // 秒
      };
      for (let k in opt) {
        ret = new RegExp("(" + k + ")").exec(fmt);
        if (ret) {
          fmt = fmt.replace(
            ret[1],
            ret[1].length == 1 ? opt[k] : opt[k].padStart(ret[1].length, "0")
          );
        }
      }
      return fmt;
    },
    //日期格式转换
    formatTimer: function (value) {
      let date = new Date(value);
      let y = date.getFullYear();
      let MM = date.getMonth() + 1;
      MM = MM < 10 ? "0" + MM : MM;
      let d = date.getDate();
      d = d < 10 ? "0" + d : d;
      let h = date.getHours();
      h = h < 10 ? "0" + h : h;
      let m = date.getMinutes();
      m = m < 10 ? "0" + m : m;
      let s = date.getSeconds();
      s = s < 10 ? "0" + s : s;
      return h + ":" + m;
    },
    // 获取当前时间戳
    getCurrentTime() {
      let date = new Date();
      let year = date.getFullYear();
      let month = date.getMonth() + 1;
      let day = date.getDate();
      let hour = date.getHours();
      let minute = date.getMinutes();
      let second = date.getSeconds();
      month = month < 10 ? "0" + month : month; // 可注释掉
      day = day < 10 ? "0" + day : day;
      hour = hour < 10 ? "0" + hour : hour; // 可注释掉
      minute = minute < 10 ? "0" + minute : minute;
      second = second < 10 ? "0" + second : second;
      return `${year}/${month}/${day} ${hour}:${minute}:${second}`;
    },
    // 地址上传地址
    address_beforeupload(file, filelist) {
      let formData = new FormData();
      formData.append("file", file.raw);
      this.upload("/get_file_url", formData, "").then((res) => {
        this.form.address = res.data.path;
      });
    },
    /** 图片上传功能 */
    beforeupload(file, filelist) {
      this.filelist = filelist;
      let formData = new FormData();
      formData.append("file", file.raw);
      // 请求数据
      this.upload("/get_file_url", formData, "").then((res) => {
        if (this.form.img == null) {
          this.form.img = res.data.path;
        } else {
          this.form.img = this.form.img + "," + res.data.path;
        }
      });
    },
    // base64字段变成blob二进制数据，关于图片的
    base64ImgtoFile(dataurl, filename = "file") {
      const arr = dataurl.split(",");
      const mime = arr[0].match(/:(.*?);/)[1];
      const suffix = mime.split("/")[1];
      const bstr = atob(arr[1]);
      let n = bstr.length;
      const u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      return new File([u8arr], `${filename}.${suffix}`, {
        type: mime,
      });
    },
  },
};
</script>

<!-- 样式1，本地样式 -->
<style lang="scss" scoped>
.calendar_matters >>> .el-dialog__body {
  height: 450px;
  overflow: auto;
}
.calendar_details >>> .el-textarea__inner {
  font-weight: bold;
  font-family: Arial, Helvetica, sans-serif;
  color: #000;
  height: 120px;
}
.calendar_matters >>> .el-dialog__header {
  border-radius: 5px;
  background-color: #cae1f7;
  align-content: center;
  padding: 15px;
  font-weight: bold;
  border-bottom-style: solid;
  border-bottom-width: 1px;
  border-bottom-color: aliceblue;
}
.fc-daygrid-day-top p {
  font-size: 13px;
  color: #606266;
  margin-right: 10px;
}
.fc .fc-toolbar.fc-header-toolbar {
  margin-bottom: 10px;
}
.el-main {
  padding: 8px 10px 8px 10px;
}
.userName >>> .el-input__inner {
  font-weight: bold;
  color: #000000ab;
}
.attachment >>> .el-form-item__content {
  display: flex;
}
.upload-demo >>> .el-upload-list--picture-card .el-upload-list__item {
  height: 120px;
  width: 120px;
}
.upload-demo >>> .el-upload--picture-card {
  height: 120px;
  width: 120px;
  line-height: 120px;
}
.dateRange >>> .el-range-input {
  font-weight: bold;
  color: #080808;
}
.calendar >>> .fc-header-toolbar {
  margin-bottom: 5px;
}
.calendar >>> .borderGreen {
  border-left: 5px solid #44bb08 !important;
  border-radius: 0;
  border: none;
  white-space: normal;
  overflow: hidden;
  text-overflow: ellipsis;
  span {
    color: #000;
    font-weight: bold;
  }
}
.calendar >>> .borderOrange {
  border-left: 5px solid #fe9b02 !important;
  border-radius: 0;
  border: none;
  white-space: normal;
  overflow: hidden;
  span {
    color: #000;
    font-weight: bold;
  }
}
.calendar >>> .borderOrigin {
  border-radius: 0;
  border: none;
  white-space: normal;
  overflow: hidden;
  text-overflow: ellipsis;
  max-height: 150px;
  span {
    color: #000;
    font-weight: bold;
  }
}
.calendar >>> .fc-event-title {
  font-weight: bold;
  color: #000;
  overflow: hidden;
}
.calendar >>> .fc-event-time {
  font-weight: bold;
  color: #000;
}
.calendar >>> .fc-daygrid-event-dot {
  border: none;
}
.popover {
  .el-popover {
    max-height: 350px;
  }
}
.popover_title {
  font-weight: bold;
  margin-bottom: 3px;
}
.popover_content {
  color: #000;
  font-size: 13px;
}
.popoverShowImg {
  width: auto;
  cursor: pointer;
  >>> .el-image__inner {
    max-height: 200px;
  }
}
.link {
  color: #000;
  font-size: 12px;
  font-weight: bold;
  margin-top: 2px;
  & :hove {
    color: #66b1ff;
  }
}
.fc_btns {
  padding: 10px 12px;
}
.el-icon-search {
  line-height: 2.5;
  margin-right: 8px;
}
.fc-right {
  display: flex;
  flex: 1.5;
  justify-content: flex-end;
}
.tip-content {
  line-height: 2.2;
  margin-right: 4px;
  font-weight: 600;
}
.title {
  margin: 0px 5px;
  line-height: 1.6;
}
.calendar_matters {
  width: 100%;
}
.calendar >>> .el-popover__reference {
  display: grid;
  max-height: 150px;
  overflow: auto;
}
</style>
<!-- 样式2 -->
<style>
.el-popover__reference::-webkit-scrollbar {
  /*滚动条整体样式*/
  width: 8px; /*高宽分别对应横竖滚动条的尺寸*/
  height: 1px;
}
.el-popover__reference::-webkit-scrollbar-thumb {
  /*滚动条里面小方块*/
  border-radius: 10px;
  -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  background: #535353;
}
.el-popover__reference::-webkit-scrollbar-track {
  /*滚动条里面轨道*/
  -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  border-radius: 2px;
  background: #ededed;
}
.popover .el-popover__title {
  font-weight: bold;
  margin-bottom: 5px;
  border-bottom: solid 1px;
  padding: 2px;
}
@media only screen and (max-width: 767px) {
  .fc-toolbar {
    flex-direction: column;
  }
  .fc-left {
    flex: 1 !important;
  }
  .tips {
    flex: 1 !important;
    justify-content: center;
    margin-bottom: 5px;
  }
  .fc-center {
    flex: 1 !important;
    margin: 5px 0px;
  }
  .fc-right {
    flex: 1;
    justify-content: center !important;
    margin-bottom: 5px;
  }
  .tip-content {
    line-height: 1 !important;
    margin-right: 4px;
    font-weight: 600;
  }
  .title {
    font-size: 20px;
    font-weight: 700;
    line-height: 1.9 !important;
  }
  .fc-list-table {
    word-break: break-all;
    overflow: auto;
  }
  .fc-list-event-title {
    overflow: auto;
  }
  .el-dialog {
    width: 90%;
  }
  .dateRange {
    overflow: auto;
  }
}
</style>
