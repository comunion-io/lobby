<template>
  <div class="main-header">
    <router-link to="/home" class="logo" />
    <div class="menu">
      <router-link to="/home" :class="curTab=='home'?'cur':''">Home</router-link>
      <router-link to="/list" :class="curTab=='list'?'cur':''">Organization</router-link>
    </div>
    <div class="right-menu">
      Ethiereum Mainnet
    </div>
  </div>
</template>

<script>
export default {
  name: 'MainHeader',
  computed: {
    curTab() {
      const tmp = this.$route.path.split('/')
      return tmp[tmp.length - 1]
    }
  }
}
</script>

<style lang="scss" scoped>
  .main-header {
    width: 100%;
    height: 86px;
    background: #f5f6fa;
    z-index: 999;
    padding: 30px;
    .logo {
      display: inline-block;
      width: 110px;
      height: 30px;
      background: url(~@/assets/logo.png);
      float: left;
    }
    .menu {
      display: inline-block;
      float: left;
      font-size: 20px;
      font-weight: 500;
      margin: 4px 0 0 80px;
      a {
        margin-right: 20px;
        color: rgba(55, 64, 89, 0.6);
        &.cur {
          color: #000;
        }
      }
    }
    .right-menu {
      float: right;
      font-size: 14px;
      color: rgba(55, 64, 89, 0.8);
      margin-top: 10px
    }
  }
</style>
