import request from '@/utils/request'

//查询查询用户列表
export function listPageWithdrawalApply(query){
  return request({
    url: '/gomagic/withdrawalApply/listPageWithdrawalApply',
    method: 'get',
    params: query
  })
}

export function updateStatus(query){
  return request({
    url: `/gomagic/withdrawalApply/updateStatus`,
    method: 'post',
    data:query
  })
}
