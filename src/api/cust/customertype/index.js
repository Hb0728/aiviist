import request from '@/utils/request'

// 创建客户模块：分层分类客户类型
export function createomerType(data) {
  return request({
    url: "/customer/customer-type/create",
    method: "post",
    data: data,
  });
}

// 更新客户模块：分层分类客户类型
export function updateomerType(data) {
  return request({
    url: "/customer/customer-type/update",
    method: "post",
    data: data,
  });
}

// 删除客户模块：分层分类客户类型
export function deleteomerType(id) {
  return request({
    url: "/customer/customer-type/delete?id=" + id,
    method: "get",
  });
}

// 获得客户模块：分层分类客户类型
export function getomerType(id) {
  return request({
    url: "/customer/customer-type/get?id=" + id,
    method: "get",
  });
}
// 客户标签维度列表
export function getFirstLevelList() {
  return request({
    url: "/customer/target/firstLevelList",
    method: "get",
  });
}

// 获得客户模块：分层分类客户类型分页
export function getomerTypePage(params) {
  return request({
    url: "/customer/customer-type/list",
    method: "get",
    params,
  });
}
// 导出客户模块：分层分类客户类型 Excel
export function exportomerTypeExcel(params) {
  return request({
    url: "/customer/customer-type/export-excel",
    method: "get",
    params,
    responseType: "blob",
  });
}
