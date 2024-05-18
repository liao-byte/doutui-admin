import request from '@/utils/request'

//查询查询用户列表
export function listPageTask(query){
  return request({
    url: '/gomagic/userTask/listPageTask',
    method: 'get',
    params: query
  })
}
export function deleteById(id) {
  return request({
    url: `/gomagic/userTask/deleteById/${id}`,
    method: 'delete'
  })
}
export function updateAuditStatus(param){
  return request({
    url: `/gomagic/userTask/updateAuditStatus`,
    method: 'post',
    data:param
  })
}

export function getImageAllNumAndNewAdd(day){
    return request({
        url: `/gomagic/userTask/getImageAllNumAndNewAdd?day=${day}`,
        method: 'get',
    })
}


export function getVideoAllNumAndNewAdd(day){
    return request({
        url: `/gomagic/userTask/getVideoAllNumAndNewAdd?day=${day}`,
        method: 'get',
    })
}


