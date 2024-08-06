import request from '@/utils/request'

// 创建拜访计划：休息日期
export function createRestDay(data) {
  return request({
    url: '/plan/rest-day/create',
    method: 'post',
    data: data
  })
}

// 更新拜访计划：休息日期
export function updateRestDay(data) {
  return request({
    url: '/plan/rest-day/update',
    method: 'post',
    data: data
  })
}

// 删除拜访计划：休息日期
export function deleteRestDay(id) { 
  return request({
    url: '/plan/rest-day/delete?id=' + id,
    method: 'get'   
  })
}

// 获得拜访计划：休息日期
export function getRestDay(id) {
  return request({
    url: '/plan/rest-day/get?id=' + id,
    method: 'get'
  })
}

// 获得拜访计划：休息日期分页
export function getRestDayPage(data) {
  return request({
    url: "/plan/rest-day/page",
    method: "post",
    data: data,
  });
}
// 导出拜访计划：休息日期 Excel
export function exportRestDayExcel(params) {
  return request({
    url: '/plan/rest-day/export-excel',
    method: 'get',
    params,
    responseType: 'blob'
  })
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
