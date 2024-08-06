import request from "@/utils/request"

// 获取9类客户的分布地区
export function getCustomerTypeCount(params) {
  return request({
    url: "/home/getCustomerTypeCount",
    method: "get",
    params: params,
  });
}

// 拜访客户总数、拜访总时长
export function getCustomerVisitData(data) {
  return request({
    url: "/home/getCustomerVisitData",
    method: "post",
    data: data,
  });
}
export function getCustomerAreaVisitData(data) {
  return request({
    url: "/home/getCustomerAreaVisitData",
    method: "post",
    data: data,
  });
}