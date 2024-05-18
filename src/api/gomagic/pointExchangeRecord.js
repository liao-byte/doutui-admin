import request from '@/utils/request'


export function listPagePointExchange(query){
  return request({
    url: '/gomagic/pointExchange/listPagePointExchange',
    method: 'get',
    params: query
  })
}

export function addPointExchange(from){
  return request({
    url: '/gomagic/pointExchange/addPointExchange',
    method: 'post',
    data:from
  })
}

export function deletePointExchange(id){
  return request({
    url: `/gomagic/pointExchange/deletePointExchange/${id}`,
    method: 'delete'
  })
}



