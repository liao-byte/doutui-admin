import request from "@/utils/request";

export function initLoginLog (city) {
  const data = {
    city
  }
  return request({
    url: '/dyhelp/dymag/initLoginLog',
    method: 'post',
    data: data
  })
}
export function getQRCode(taskid){
  return request({
    url: '/dyhelp/dymag/getQRCode?taskId='+taskid,
    method: 'get'
  })
}
