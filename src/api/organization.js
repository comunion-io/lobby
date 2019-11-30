import request from '@/utils/request'

export function newOrg(data) {
  return request({
    url: '/r/org',
    method: 'post',
    data
  })
}

export function updateOrgInfo(_id, data) {
  return request({
    url: `/r/org/${_id}`,
    method: 'put',
    data
  })
}

export function updateOrgMember(data) {
  return request({
    url: `/a/update/org`,
    method: 'post',
    data
  })
}

export function getOrgList() {
  return request({
    url: '/r/org?max=200',
    method: 'get'
  })
}

// 0:正在注册；1:注册成功；-1:注册失败
export function getOrgStatus(_id) {
  return request({
    url: `/a/org/orgStatus/${_id}`,
    method: 'get'
  })
}

export function getOrgInfo(_id) {
  return request({
    url: `/r/org/_id/${_id}`,
    method: 'get'
  })
}

export function getOrgMembers(_id) {
  return request({
    url: `/r/org/info/members/${_id}`,
    method: 'get'
  })
}

export function checkOrgName(name) {
  return request({
    url: `/r/org/name/${name}`,
    method: 'get'
  })
}

export function checkOrgEmail(email) {
  return request({
    url: `/r/org/email/${email}`,
    method: 'get'
  })
}
