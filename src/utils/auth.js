import Cookies from 'js-cookie'

const TokenKey = 'token'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

export function getCurOrgId() {
  return Cookies.get('cur_org_id')
}

export function setCurOrgId(id) {
  return Cookies.set('cur_org_id', id)
}

export function removeCurOrgId() {
  return Cookies.remove('cur_org_id')
}

export function getUserId() {
  return Cookies.get('user_id')
}

export function setUserId(id) {
  return Cookies.set('user_id', id)
}

export function removeUserId() {
  return Cookies.remove('user_id')
}
