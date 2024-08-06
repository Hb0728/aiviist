import request from "@/utils/request";

// 未来项目库分页列表
export function libraryfPage(params) {
  return request({
    url: "/ser/project-library-next/page",
    method: "get",
    params,
  });
}
// 获取未来项目库list
export function libraryfList(params) {
  return request({
    url: "/ser/project-library-next/list",
    method: "get",
    params,
  });
}
// 获取未来项目库list
export function getNextInfo(id) {
  return request({
    url: "/ser/project-library-next/get?id="+ id,
    method: "get",
    // params,
  });
}
// 创建未来项目库

export function createNext(data) {
  return request({
    url: "/ser/project-library-next/create",
    method: "post",
    data: data,
  });
}
// 更新未来项目库
export function updateNext(data) {
  return request({
    url: "/ser/project-library-next/update",
    method: "post",
    data: data,
  });
}
// 删除未来项目库
export function deleteNext(id) {
  return request({
    url: "/ser/project-library-next/delete?id=" + id,
    method: "get",
    // params,
  });
}
// 关联项目分页列表
export function pageNext(params) {
  return request({
    url: "/ser/library-sub-project-next/page",
    method: "get",
    params,
  });
}
// 未关联项目分页列表
export function projectPage(params) {
  return request({
    url: "/ser/library-sub-project-next/projectPage",
    method: "get",
    params,
  });
}
// 创建未来项目库关联项目
export function projectCreateNext(data) {
  return request({
    url: "/ser/library-sub-project-next/create",
    method: "post",
    data: data,
  });
}
// 删除关联项目
export function projectDelete(id) {
  return request({
    url: "/ser/library-sub-project-next/delete?ids=" + id,
    method: "get",
  });
}
// 创建未来项目库关联关系
export function targetCreateNext(data) {
  return request({
    url: "/ser/project-target-next/create",
    method: "post",
    data: data,
  });
}
// 获取指标分页列表
export function targetGetTargets(params) {
  return request({
    url: "/ser/project-target-next/getTargets",
    method: "get",
    params,
  });
}
// 获取客户类型列表
export function targetGetCustomerTypes(params) {
  return request({
    url: "/ser/project-target-next/getCustomerTypes",
    method: "get",
    params,
  });
}
// 获取客户类型列表
export function getCustomers(params) {
  return request({
    url: "/ser/project-target-next/getCustomers",
    method: "get",
    params,
  });
}