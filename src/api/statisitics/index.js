import request from "@/utils/request";

// 获得拜访计划：休息日期分页
export function statisticsPage(data) {
  return request({
    url: "/plan/statistics/visitPage",
    method: "post",
    data: data,
  });
}
// 导出统计
export function visitPageExcel(data) {
  return request({
    url: "/plan/statistics/visitPageExcel",
    method: "post",
    responseType: "blob",
    data:data,
  });
}

