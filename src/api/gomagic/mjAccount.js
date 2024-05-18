import request from "@/utils/request";

export function listPageMjAccount (query) {
  return request({
    url: '/gomagic/mjAccount/listPageMjAccount',
    method: 'get',
    params: query
  })
}
export function addMjAccount(from){
  return request({
    url: '/gomagic/mjAccount/addMjAccount',
    method: 'post',
    data: from
  })
}
export function synchronizeAccount(id){
  return request({
    url:`/gomagic/mjAccount/synchronizeAccount/${id}`,
    method:'get'
  })
}
export function deleteAccount(id){
  return request({
    url:`/gomagic/mjAccount/deleteAccount/${id}`,
    method:'get'
  })
}

export function createContainer(form){
  return request({
    url:`/gomagic/mjAccount/createContainer`,
    method:'post',
    data:form
  })
}
export function startMjService(id){
  return request({
    url:`/gomagic/mjAccount/startMjService/${id}`,
    method:'get',
  })
}
export function restartMjService(id){
  return request({
    url:`/gomagic/mjAccount/restartMjService/${id}`,
    method:'get',
  })
}
