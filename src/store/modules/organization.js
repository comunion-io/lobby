// import { login, logout, getInfo } from '@/api/user'
import {
  newOrg,
  getOrgInfo,
  getOrgMembers,
  updateOrgInfo
} from '@/api/organization'

import {
  addTransation
} from '@/api/common'

const state = {
  _id: '',
  name: '',
  email: '',
  type: '',
  logo: '', // org logo url
  icon: '', // token icon url
  wallet: [],
  website: '',
  mission: '',
  vision: '',
  description: '',
  transactionHash: '',
  social: [],
  members: [],
  asset: null,
  status: 1,
  contract: '',
  finance: []
}

const mutations = {
  SET_ID: (state, _id) => {
    state._id = _id
  },
  SET_INFO: (state, data) => {
    state.name = data.name
    state.email = data.email
    state.type = data.type
    state.logo = data.logo
    state.wallet = data.wallet
    state.website = data.website
    state.mission = data.mission
    state.vision = data.vision
    state.description = data.description
    state.transactionHash = data.transactionHash
    state.social = data.social
    // state.members = data.members
    state.status = data.status
    state.icon = data.icon
    state.asset = data.asset
    state.contract = data.contract
    state.finance = data.finance
  },
  SET_MEMBERS: (state, data) => {
    state.members = data
  },
  SET_MEMBER: (state, members) => {
    state.members = members
  },
  SET_ASSET: (state, asset) => {
    state.asset = asset
  },
  SET_ICON: (state, icon) => {
    state.icon = icon
  },
  // ADD_MEMBER: (state, member) => {
  //   state.members.push(member)
  // },
  // DEL_MEMBER: (state, member) => {
  //   state.members.push(member)
  // }
  SET_FINANCE: (state, finance) => {
    state.finance = finance
  }
}

const actions = {
  newOrgInfo({
    commit,
    state
  }, data) {
    commit('SET_ID', data._id)
    commit('SET_INFO', data.data)
  },
  newAsset({
    commit,
    state
  }, asset, icon) {
    commit('SET_ASSET', asset)
    commit('SET_ICON', icon)
  },
  // 添加子账号
  subAccount({ commit, state }, data) {
    // commit('SET_FINANCE', finance)
    return new Promise((resolve, reject) => {
      addTransation(data)
        .then(response => {
          if (!response.err) {
            commit('SET_ID', response.entity._id)
            commit('SET_INFO', response.entity)
          } else {
            console.log('98988kkk')
            console.log(response.msg)
          }
        })
        .catch(error => {
          reject(error)
        })
    })
  },
  budget({ commit, state }, data) {
    commit('SET_ID', data._id)
    commit('SET_INFO', data.data)
  },
  newOrg({
    commit,
    state
  }, data) {
    return new Promise((resolve, reject) => {
      newOrg(data).then(response => {
        if (!response.err) {
          commit('SET_ID', response.entity._id)
          commit('SET_INFO', response.entity)
        } else {
          console.log(response.msg)
        }
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },
  addAsset({
    commit,
    state
  }, asset, icon, hash) {
    return new Promise((resolve, reject) => {
      updateOrgInfo(state._id, {
        asset: asset,
        icon: icon,
        transactionHash: hash
      }).then(response => {
        if (!response.err) {
          commit('SET_ASSET', asset)
          commit('SET_ICON', icon)
        } else {
          console.log(response.msg)
        }
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },
  // get user info
  getOrgInfo({
    commit,
    state
  }, _id) {
    return new Promise((resolve, reject) => {
      getOrgInfo(_id).then(response => {
        if (!response.err && response.entity) {
          commit('SET_ID', _id)
          commit('SET_INFO', response.entity)
          getOrgMembers(_id).then(res => {
            if (!res.err && res.entities) {
              commit('SET_MEMBERS', res.entities)
            } else {
              console.log(res.msg)
            }
          })
        } else {
          console.log(response.msg)
        }
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },
  addOrgMember({
    commit,
    state
  }, member) {
    // state.members.push(member)
    const members = state.members.concat((member))

    return new Promise((resolve, reject) => {
      updateOrgInfo(state._id, {
        members: members
      }).then(res => {
        if (res.entity) {
          commit('SET_MEMBER', members)

          resolve('success')
        } else {
          console.log('update memeber fail')
          resolve(res.msg)
        }
      }).catch(error => {
        reject(error)
      })
    })
  },
  deleteOrgMember({
    commit,
    state
  }, email) {
    const members = state.members
    const newMembers = members.filter(member => {
      return member.email !== email
    })
    return new Promise((resolve, reject) => {
      updateOrgInfo(state._id, {
        members: newMembers
      }).then(res => {
        if (res.entity) {
          commit('SET_MEMBER', newMembers)
          resolve('success')
        } else {
          console.log('update memeber fail')
          resolve(res.msg)
        }
      }).catch(error => {
        reject(error)
      })
    })
  }

}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
