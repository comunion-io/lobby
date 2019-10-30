<template>
  <div class="assets">
    <el-card class="box-card full">
      <h4 v-if="assetsCount === 0" class="message">
        Adding assets by
        <router-link :to="{ name: 'token-manager' }" class="link">publishing token.</router-link>
      </h4>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      assets: [
        // {
        //   symbol: 'eth',
        //   address: '0x123',
        //   isHost: true,
        //   balance: 0,
        //   tags: ['Salary Wallet']
        // }
      ]
    }
  },
  computed: {
    assetsCount() {
      return this.assets.length
    }
  }
}
</script>

<style lang="scss">
@import '@/styles/variables.scss';

.assets {
  .message {
    display: block;
    margin: 125px auto;
    text-align: center;
    font-size: 20px;
    line-height: 29px;
    font-weight: 400;

    .link {
      color: $menuActiveText;
      &:hover {
        text-decoration: underline;
      }
    }
  }
}
</style>
