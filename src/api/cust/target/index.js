import request from "@/utils/request";

// 创建客户价值分类：指标
export function createTarget(data) {
  return request({
    url: "/customer/target/create",
    method: "post",
    data: data,
  });
}

// 更新客户价值分类：指标
export function updateTarget(data) {
  return request({
    url: "/customer/target/update",
    method: "post",
    data: data,
  });
}

// 删除客户价值分类：指标
export function deleteTarget(id) {
  return request({
    url: "/customer/target/delete?id=" + id,
    method: "get",
  });
}

// 获得客户价值分类：指标
export function getTarget(id) {
  return request({
    url: "/customer/target/get?id=" + id,
    method: "get",
  });
}

// 获得客户价值分类：指标分页
export function getTargetPage(params) {
  return request({
    url: "/customer/target/list",
    method: "get",
    params,
  });
}
// 获得客户价值分类：指标分页11
export function getthirdLevelList(params) {
  return request({
    url: "/customer/target/thirdLevelList",
    method: "get",
    params,
  });
}
// 导出客户价值分类：指标 Excel
export function exportTargetExcel(params) {
  return request({
    url: "/customer/target/export-excel",
    method: "get",
    params,
    responseType: "blob",
  });
}
