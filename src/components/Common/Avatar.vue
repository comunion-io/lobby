<template>
  <div class="avatar">
    <img :src="paths ? paths : defaultAvatar" :alt="username" />
  </div>
</template>

<script>
import defaultAvatar from '@/assets/avatar.png'
export default {
  props: {
    path: String,
    username: String
  },
  data() {
    return {
      defaultAvatar:defaultAvatar,
      paths:this.path
    }
  }
}
</script>

<style lang="scss">
.avatar {
  img {
    width: 28px;
    height: 28px;
    border-radius: 100px;
    vertical-align: middle;
  }
}
</style>