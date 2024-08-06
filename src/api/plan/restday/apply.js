import request from "@/utils/request";
// 休息日期申请分页
export function restDayApplyPage(data) {
  return request({
    url: "/plan/rest-day-apply/page",
    method: "post",
    data: data,
  });
}
// 节假日申请
export function restDayApplyCreateSelect(data) {
  return request({
    url: "/plan/rest-day-apply/createSelect",
    method: "post",
    data: data,
  });
}
// 申请删除
export function restDayApplyDelete(id) {
  return request({
    url: "/plan/rest-day-apply/delete?id=" + id,
    method: "get",
  });
}
// 详情
export function restDayApplyDetail(id) {
  return request({
    url: "/plan/rest-day-apply/get?id=" + id,
    method: "get",
  });
}
// 管理员审核
export function restDayApplyExamine(params) {
  return request({
    url: "/plan/rest-day-apply/examine",
    method: "get",
    params,
  });
}
// 下载拜访计划：休息日期 Excel
export function getTemplate(params) {
  return request({
    url: "/plan/rest-day/getTemplate",
    method: "get",
    params,
    responseType: "blob",
  });
}
