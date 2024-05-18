import request from '@/utils/request'

//查询查询用户列表
export function listUser(query){
  return request({
    url: '/gomagic/user/getPageUserInfo',
    method: 'get',
    params: query
  })
}

export function updateBanStatus(id){
  return request({
    url: `/gomagic/user/updateBanStatus?id=${id}`,
    method: 'get'
  })
}
export function getAllNumAndNewAdd(day){
  return request({
    url: `/gomagic/user/getAllNumAndNewAdd?day=${day}`,
    method: 'get',
  })
}
