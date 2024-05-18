import request from '@/utils/request'

//查询查询用户列表
export function getAllModel(){
  return request({
    url: '/gomagic/chatConfig/getAllModel',
    method: 'get',
  })
}

export function saveOrUpdateList(data){
  return request({
    url: '/gomagic/chatConfig/saveOrUpdateList',
    method: 'post',
    data:data
  })
}

