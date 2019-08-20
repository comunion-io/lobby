<template>
  <div class="main-header">
    <router-link to="/home" class="logo" />
    <div class="menu">
      <router-link to="/home" :class="curTab=='home'?'cur':''">Home</router-link>
      <router-link to="/list" :class="curTab=='list'?'cur':''">Organization</router-link>
    </div>
    <net-bar />
  </div>
</template>

<script>
import NetBar from '@/components/NetBar'
export default {
  name: 'MainHeader',
  components: {
    NetBar
  },
  computed: {
    curTab() {
      const tmp = this.$route.path.split('/')
      return tmp[tmp.length - 1]
    }
  }
}
</script>

<style lang="scss">
  .main-header {
    width: 100%;
    height: 86px;
    background: #f5f6fa;
    z-index: 999;
    padding: 30px;
    .logo {
      width: 110px;
      height: 30px;
      background: url(~@/assets/logo.png);
      float: left;
    }
    .menu {
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
    .netbar {
      float: right;
    }
  }
</style>
