import { login, getInfo, update } from '@/api/user'
import { getToken, setToken, removeToken, getUserId, setUserId, removeUserId } from '@/utils/auth'
// import { resetRouter } from '@/router'

const state = {
  // token: getToken(),
  _id: '',
  email: '',
  name: '',
  logo: '',

  wallet: [],
  social: [],
  skills: [],
  orgs: []
}

const mutations = {
  // SET_TOKEN: (state, token) => {
  //   state.token = token
  // },
  SET_ID: (state, id) => {
    state._id = id
  },
  SET_INFO: (state, userInfo) => {
    state._id = userInfo._id
    state.email = userInfo.email
    state.name = userInfo.name || ''
    state.logo = userInfo.logo

    state.wallet = userInfo.wallet || []
    state.social = userInfo.social || []
    state.skills = userInfo.skills || []
    state.orgs = userInfo.orgs || []
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    // const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      login(userInfo).then(response => {
        // commit('SET_TOKEN', data.token)
        // setToken(data.token)
        console.log('login', response)

        if (!response.err) {
          commit('SET_ID', response.user._id)
          setUserId(response.user._id)
          commit('SET_INFO', response.user)
        } else {
          console.log('login error', response.msg)
          commit('SET_ID', '')
          setUserId('')
          setToken('')
          commit('SET_INFO', {})
        }
        resolve(response)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  getInfo({ commit, state }) {
    console.log('userid', getUserId());
    if (!getUserId()) return;
    return new Promise((resolve, reject) => {
      getInfo(getUserId()).then(response => {
        if (!response.entity) {
          reject('Verification failed, please Login again.')
        }
        commit('SET_INFO', response.entity)
        resolve('success')
      }).catch(error => {
        reject(error)
      })
    })
  },
  // update user info
  update({ commit, state }, data) {
    return new Promise((resolve, reject) => {
      update(state.token, data).then(response => {
        if (!response.entity) {
          reject('error')
        }
        commit('SET_INFO', response.entity)
        resolve('success')
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      commit('SET_ID', '')
      setToken('')
      setUserId('')
      commit('SET_INFO', {})
      resolve()
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_ID', '')
      commit('SET_ROLES', [])
      removeToken()
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
