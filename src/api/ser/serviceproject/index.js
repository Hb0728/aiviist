import request from '@/utils/request'

// 创建服务项目：客户服务项目
export function createviceProject(data) {
  return request({
    url: '/ser/service-project/create',
    method: 'post',
    data: data
  })
}

// 更新服务项目：客户服务项目
export function updateviceProject(data) {
  return    request({
    url: '/ser/service-project/update',
    method: 'post',
    data: data
  })
}

// 删除服务项目：客户服务项目
export function deleteviceProject(id) {
  return request({
    url: '/ser/service-project/delete?id=' + id,
    method: 'get'
  })
}

// 获得服务项目：客户服务项目
export function getviceProject(id) {
  return request({
    url: '/ser/service-project/get?id=' + id,
    method: 'get'
  })
}

// 获得服务项目：客户服务项目分页
export function getviceProjectPage(params) {
  return request({
    url: '/ser/service-project/list',
    method: 'get',
    params
  })
}
// 导出服务项目：客户服务项目 Excel
export function exportviceProjectExcel(params) {
  return request({
    url: '/ser/service-project/export-excel',
    method: 'get',
    params,
    responseType: 'blob'
  })
}
// 获得服务类型及模块列表
export function getModuleList(params) {
  return request({
    url: "/ser/service-project/moduleList",
    method: "get",
    params,
  });
}
export function getLibraryModuleList(params) {
  return request({
    url: "/ser/service-project/getLibraryModuleList",
    method: "get",
    params,
  });
}
