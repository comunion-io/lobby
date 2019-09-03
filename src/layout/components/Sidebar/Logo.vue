<template>
  <div class="sidebar-logo-container" :class="{'collapse':collapse}">
    <transition name="sidebarLogoFade">
      <router-link v-if="collapse" key="collapse" class="sidebar-logo-link" to="/">
        <img v-if="logo" :src="orgForm.logo" class="sidebar-logo">
        <h1 v-else class="sidebar-title">{{ orgForm.name }} </h1>
      </router-link>
      <router-link v-else key="expand" class="sidebar-logo-link" to="/">
        <img v-if="logo" :src="orgForm.logo" class="sidebar-logo">
        <h1 class="sidebar-title">{{ orgForm.name }} </h1>
      </router-link>
    </transition>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'SidebarLogo',
  props: {
    collapse: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      title: 'Comunion',
      logo: '~@/assets/logo-admin.png'
    }
  },
  computed: {
    ...mapGetters([
      'orgForm'
    ])
  }
}
</script>

<style lang="scss" scoped>
.sidebarLogoFade-enter-active {
  transition: opacity 1.5s;
}

.sidebarLogoFade-enter,
.sidebarLogoFade-leave-to {
  opacity: 0;
}

.sidebar-logo-container {
  position: relative;
  width: 100%;
  height: 100px;
  line-height: 50px;
  /*background: #2b2f3a;*/
  background: #fff;
  /*text-align: center;*/
  overflow: hidden;

  & .sidebar-logo-link {
    height: 100%;
    width: 100%;
    position: relative;
    top: 20px;
    left: 10px;

    & .sidebar-logo {
      width: 54px;
      height: 54px;
      vertical-align: middle;
      margin-right: 12px;
    }

    & .sidebar-title {
      display: inline-block;
      margin: 0;
      color: #374059;
      font-weight: 600;
      line-height: 50px;
      font-size: 14px;
      font-family: Avenir, Helvetica Neue, Arial, Helvetica, sans-serif;
      vertical-align: middle;
    }
  }

  &.collapse {
    .sidebar-logo {
      margin-right: 0px;
    }
  }
}
</style>
