// import { login, logout, getInfo } from '@/api/user'

const state = {
  coinbase: ''
}

const mutations = {
  SET_COINBASE: (state, coinbase) => {
    state.coinbase = coinbase
  }
}

const actions = {

}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
