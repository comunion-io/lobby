import Cookies from 'js-cookie'

const TokenKey = 'comunion_token'

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
