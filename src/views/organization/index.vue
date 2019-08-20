<template>
  <div class="dao-container">
    <div class="sidebar-right" />
    <div class="main-content">
      <main-header />
      <keep-alive>
        <router-view />
      </keep-alive>
    </div>
  </div>
</template>

<script>
import mainHeader from '@/components/MainHeader'

export default {
  name: 'Login',
  components: { mainHeader },
  data() {
    return {
      form: {
        name: ''
      }
    }
  },
  methods: {}
}
</script>
<style lang="scss">
@import './index.scss';
</style>

