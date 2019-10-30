<template>
  <div id="dao-finance">
    <total-balance />
    <assets />
    <record />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import GetInfo from '@/mixins/GetInfo'
import { async } from 'q'
import { TotalBalance, Record, Assets } from '@/components/Finance'

export default {
  mixins: [GetInfo],
  components: {
    TotalBalance,
    Record,
    Assets
  },
  data() {
    return {
      showGuide: true,
      loading: false
    }
  },
  computed: {
    ...mapGetters(['coinbase', 'orgForm'])
  },
  created() {},
  methods: {
    closeGuide() {
      this.showGuide = false
    },
    clickCheck() {
      const check = async () => {
        // this.loading = true;
        await this.checkIfInstallMataMask()
        // await this.handleMetaMaskLogin();
        // this.loading = false;
      }
      this.checkIfInstallMataMask()
      this.handleMetaMaskLogin()

      // check();
    }
  }
}
</script>

<style lang="scss">
</style>
