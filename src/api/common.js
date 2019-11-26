import request from '@/utils/request'

export function addTransation(params) {
  return request({
    url: '/r/tx',
    method: 'post',
    params
  })
}

export function getTransation(txhash) {
  return request({
    url: `/r/tx/receipt/${txhash}`,
    method: 'get'
  })
}
