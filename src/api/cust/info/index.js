import request from '@/utils/request'

// 创建客户模块：客户信息
export function createInfo(data) {
  return request({
    url: "/customer/info/create",
    method: "post",
    data: data,
  });
}

// 更新客户模块：客户信息
export function updateInfo(data) {
  return request({
    url: "/customer/info/update",
    method: "post",
    data: data,
  });
}

// 删除客户模块：客户信息
export function deleteInfo(id) {
  return request({
    url: "/customer/info/delete?id=" + id,
    method: "get",
  });
}

// 获得客户模块：客户信息
export function getInfo(id) {
  return request({
    url: "/customer/info/get?id=" + id,
    method: "get",
  });
}
// 获得客户指标得分
export function getScore(params) {
  return request({
    url: "/customer/target-score/getScore",
    method: "get",
    params,
  });
}
// 手动录入评分
export function createTargetScore(data) {
  return request({
    url: "/customer/target-score/create",
    method: "post",
    data: data,
  });
}

// 获得客户模块：客户信息分页
export function getInfoPage(params) {
  return request({
    url: "/customer/info/page",
    method: "get",
    params,
  });
}
// 获得客户模块：客户分类信息分页
export function customerTypePage(params) {
  return request({
    url: "/customer/customer-type-result/page",
    method: "get",
    params,
  });
}
// 客户订购总量
export function orderQuantity(params) {
  return request({
    url: "/customer/data/orderQuantity",
    method: "get",
    params,
  });
}
// 客户地产烟进购量
export function localBuyCount(params) {
  return request({
    url: "/customer/data/localBuyCount",
    method: "get",
    params,
  });
}
// 客户服务列表
export function customerProjects(params) {
  return request({
    url: "/plan/visitTask/customerProjects",
    method: "get",
    params,
  });
}
// 导出客户模块：客户信息 Excel
export function exportInfoExcel(params) {
  return request({
    url: "/customer/info/export-excel",
    method: "get",
    params,
    responseType: "blob",
  });
}
