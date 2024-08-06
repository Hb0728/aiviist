import request from "@/utils/request";

// 查询菜单列表
export function managerPage(query) {
  return request({
    url: "/customer/customer-manager/managerPage",
    method: "get",
    params: query,
  });
}
export function managerList(query) {
  return request({
    url: "/customer/customer-manager/managerList",
    method: "get",
    params: query,
  });
}
