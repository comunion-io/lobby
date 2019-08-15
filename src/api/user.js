import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/a/auth/login',
    method: 'post',
    data
  })
}

export function getInfo(_id) {
  return request({
    url: `/r/user/${_id}`,
    method: 'get'
  })
}

export function update(_id, data) {
  return request({
    url: `/r/user/${_id}`,
    method: 'put',
    data
  })
}

export function getUserInfoByEmail(email) {
  return request({
    url: `/r/user/email/${email}`,
    method: 'get'
  })
}

export function logout() {
  return request({
    url: '/user/logout',
    method: 'post'
  })
}

export function userRegister(data) {
  return request({
    url: '/a/auth/register',
    method: 'post',
    data
  })
}

export function checkUserEmail(email) {
  return request({
    url: `/r/user/email/${email}`,
    method: 'get'
  })
}

export function sendVeriCode(data) {
  return request({
    url: `/a/verifyCode`,
    method: 'post',
    data
  })
}

export function resetPwd(data) {
  return request({
    url: '/a/auth/resetPsd',
    method: 'post',
    data
  })
}
