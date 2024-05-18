import request from "@/utils/request";

export function getPageUserInfo (query) {
  return request({
    url: '/taskmag/account/getPageUserInfo',
    method: 'get',
    params: query
  })
}
export function addToken(from){
  return request({
    url: '/taskmag/account/addToken',
    method: 'post',
    data: from
  })
}
