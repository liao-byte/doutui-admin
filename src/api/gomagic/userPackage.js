import request from '@/utils/request'

export function getPagePackage(query){
  return request({
    url: '/gomagic/package/getPagePackage',
    method: 'get',
    params: query
  })
}
export function deleteById(id){
  return request({
    url: '/gomagic/package/deleteById?id='+id,
    method: 'get',
  })
}

export function getById(id){
  return request({
    url: '/gomagic/package/getById?id='+id,
    method: 'get',
  })
}

export function addOrUpdate(from){
  return request({
    url: '/gomagic/package/addOrUpdate',
    method: 'post',
    data:from
  })
}
