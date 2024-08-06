import request from '@/utils/request'

// 创建服务项目：客户服务项目库关联项目
export function createLibrarySubProject(data) {
  return request({
    url: '/ser/library-sub-project/create',
    method: 'post',
    data: data
  })
}

// 更新服务项目：客户服务项目库关联项目
export function updateLibrarySubProject(data) {
  return request({
    url: '/ser/library-sub-project/update',
    method: 'post',
    data: data
  })
}

// 删除服务项目：客户服务项目库关联项目
export function deleteLibrarySubProject(id) {
  return request({
    url: '/ser/library-sub-project/delete?ids=' + id,
    method: 'get'
  })
}

// 获得服务项目：客户服务项目库关联项目
export function getLibrarySubProject(id) {
  return request({
    url: '/ser/library-sub-project/get?id=' + id,
    method: 'get'
  })
}

// 获得服务项目：客户服务项目库关联项目分页
export function getLibrarySubProjectPage(params) {
  return request({
    url: '/ser/library-sub-project/page',
    method: 'get',
    params
  })
}
// 未关联项目列表
export function subProjectPage(params) {
  return request({
    url: "/ser/library-sub-project/projectPage",
    method: "get",
    params,
  });
}
// 关联指标列表
export function getTargetsPage(params) {
  return request({
    url: "/ser/project-target/getTargets",
    method: "get",
    params,
  });
}
// 获取客户类型列表
export function getCustomerTypes(params) {
  return request({
    url: "/ser/project-target/getCustomerTypes",
    method: "get",
    params,
  });
}

// 创建关联关系
export function projectCreate(data) {
  return request({
    url: "/ser/project-target/create",
    method: "post",
    data: data,
  });
}

// 获取满足服务的客户类型列表
export function getCustomers(params) {
  return request({
    url: "/ser/project-target/getCustomers",
    method: "get",
    params,
  });
}

