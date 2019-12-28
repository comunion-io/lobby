<template>
  <div id="dao-finance">
    <router-view></router-view>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import GetInfo from '@/mixins/GetInfo'
import { async } from 'q'
import { getCurOrgId, setCurOrgId, getUserId } from '@/utils/auth'
import {getOrgRecords} from '@/api/organization'

export default {
  mixins: [GetInfo],
  data() {
    return {
      showGuide: true,
      loading: false,
      asset: '',
      orgId:'',
    }
  },
  computed: {
    ...mapGetters(['coinbase', 'orgForm'])
  },
  created() {
    this.orgInfo = this.orgForm
    this.orgId = getCurOrgId();

  },
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

<style lang="scss"></style>
