import request from "@/utils/request";

// 客户消息分页
export function messagePage(params) {
  return request({
    url: "/customer/message/page",
    method: "get",
    params: params,
  });
}
// 服务消息推送模版
export function getProjectMsgTemplate(params) {
  return request({
    url: "/customer/message/getProjectMsgTemplate",
    method: "get",
    params: params,
    responseType: "blob",
  });
}
// 导入服务消息-客户许可证
export function importProjectMsgData(data) {
  return request({
    url: "/customer/message/importProjectMsgData",
    method: "post",
    data: data,
  });
}
// 获取服务分页列表应急式
export function getProjectPage(params) {
  return request({
    url: "/ser/service-project/getProjectPage",
    method: "get",
    params: params,
  });
}
// 获取服务列表应急式
export function getMechanismProjects(params) {
  return request({
    url: "/ser/service-project/getMechanismProjects",
    method: "get",
    params: params,
  });
}