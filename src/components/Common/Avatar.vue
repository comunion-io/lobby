<template>
  <div class="avatar">
    <img :src="path ? path : defaultAvatar" :alt="username" />
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
      defaultAvatar
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
  }
}
</style>