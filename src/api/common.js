import request from '@/utils/request'

function addTransation(params) {
  return request({
    url: '/r/tx',
    method: 'post',
    params
  })
}

function getTransation(txhash) {
  return request({
    url: `/r/tx/receipt/${txhash}`,
    method: 'get'
  })
}

export default {
  addTransation,
  getTransation
}
