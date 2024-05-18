import request from "@/utils/request";

export function getAllMjDrawConfig (query) {
  return request({
    url: '/gomagic/mjDrawConfig/getAllMjDrawConfig',
    method: 'post'
  })
}

export function saveOrUpdateConfig(data){
  return request({
    url: '/gomagic/mjDrawConfig/saveOrUpdateConfig',
    method: 'post',
    data:data
  })
}
