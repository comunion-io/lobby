import request from '@/utils/request'

function addTransation(data) {
  return request({
    url: '/r/tx',
    method: 'post',
    data
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
