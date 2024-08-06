import request from '@/utils/request'

// 创建服务项目：客户服务项目分类
export function createProjectLibrary(data) {
  return request({
    url: '/ser/project-library/create',
    method: 'post',
    data: data
  })
}

// 更新服务项目：客户服务项目分类
export function updateProjectLibrary(data) {
  return request({
    url: '/ser/project-library/update',
    method: 'post',
    data: data
  })
}

// 删除服务项目：客户服务项目分类
export function deleteProjectLibrary(id) {
  return request({
    url: '/ser/project-library/delete?id=' + id,
    method: 'get'
  })
}

// 获得服务项目：客户服务项目分类
export function getProjectLibrary(id) {
  return request({
    url: '/ser/project-library/get?id=' + id,
    method: 'get'
  })
}

// 获得服务项目：客户服务项目分类分页
export function getProjectLibraryPage(params) {
  return request({
    url: '/ser/project-library/page',
    method: 'get',
    params
  })
}
// 获得服务项目：客户服务项目分类
export function getProjectLibraryList(params) {
  return request({
    url: '/ser/project-library/list',
    method: 'get',
    params
  })
}
// 导出服务项目：客户服务项目分类 Excel
export function exportProjectLibraryExcel(params) {
  return request({
    url: '/ser/project-library/export-excel',
    method: 'get',
    params,
    responseType: 'blob'
  })
}
