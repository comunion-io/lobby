const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  asset: state => state.asset,
  userInfo: state => state.user,
  orgForm: state => state.organization,
  coinbase: state => state.coinbase.coinbase
}
export default getters
