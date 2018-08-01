import * as types from './types'
// import storage from '../util/storage'
// 设置用户token
const mutations = {
  [types.SET_TOKEN] (state, token) {
    state.UserToken = token
  },
  [types.OPEN_SKU] (state, isopen) {
    state.opensku = isopen
  }
}
export default mutations
