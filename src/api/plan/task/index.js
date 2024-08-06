import request from "@/utils/request";

// 查询菜单列表
export function getTaskList(data) {
  return request({
    url: "/plan/task/list",
    method: "post",
    data: data,
  });
}
// 获取拜访计划
export function getPlan(data) {
  return request({
    url: "/plan/task/getPlan",
    method: "post",
    data: data,
  });
}

// 获取评价服务分页
export function recordPage(data) {
  return request({
    url: "/plan/visitProjectRecord/page",
    method: "post",
    data: data,
  });
}
// 获取客户提报分页
export function getCustomerApplyPage(data) {
  return request({
    url: "/ser/apply-project/getCustomerApplyPage",
    method: "post",
    data: data,
  });
}
// 删除客户提报
export function deleteReport(id) {
  return request({
    url: "/ser/apply-project/delete?ids=" + id,
    method: "get",
  });
}
// 修改拜访计划
export function updatePlan(data) {
  return request({
    url: "/plan/task/updatePlan",
    method: "post",
    data: data,
  });
}
// 创建拜访计划
export function createPlan(data) {
  return request({
    url: "/plan/task/createPlan",
    method: "post",
    data: data,
  });
}
// 删除拜访计划
export function removePlanInfo(id) {
  return request({
    url: "/plan/task/removePlanInfo?planId=" + id,
    method: "get",
  });
}
// 重新生成拜访计划
export function recreatePlan(id) {
  return request({
    url: "/plan/task/recreatePlan" + (id ? ('?managerId='+id) : ""),
    method: "get",
  });
}
// 获取可添加服务列表
export function getProjects(id) {
  return request({
    url: "/ser/service-project/getProjects?customerId=" + (id ? id : ""),
    method: "get",
  });
}
export function getPlanServices(id) {
  return request({
    url: "/plan/task/getPlanServices?planId=" + (id ? id : ""),
    method: "get",
  });
}
// 获取拜访照片
export function getVisitFiles(id) {
  return request({
    url: "/plan/visitProjectRecord/getVisitFiles" + (id ? "?planId=" + id : ""),
    method: "get",
  });
}
