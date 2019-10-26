<template>
  <div class="finance">
    <h1>finance</h1>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import MetaMaskInstall from '@/mixins/MetaMaskInstall';
import GetInfo from '@/mixins/GetInfo';
import { async } from 'q';

export default {
  mixins: [MetaMaskInstall, GetInfo],
  data() {
    return {
      showGuide: true,
      loading: false
    };
  },
  computed: {
    ...mapGetters([
      'coinbase',
      'orgForm'
    ])
  },
  created() {
    
  },
  methods: {
    closeGuide() {
      this.showGuide = false;
    },
    clickCheck() {
      const check = async () => {
        // this.loading = true;
        await this.checkIfInstallMataMask();
        // await this.handleMetaMaskLogin();
        // this.loading = false;
      }
      this.checkIfInstallMataMask();
      this.handleMetaMaskLogin();

      // check();
    }
  }
}
</script>

<style lang="scss">
  .finance {
    list-style: none;
  }

</style>
