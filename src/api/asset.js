import request from '@/utils/request'

export function getDeployData(params) {
  return request({
    url: '/r/org/token',
    method: 'post',
    params
  })
}
