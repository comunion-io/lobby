<template>
  <div class="token-manager">
    <div v-if="isOwner">You r owner</div>
    <div class="title">Publish Token</div>
    <div class="token-manager-user-guide" v-if="showGuide">
      <UserGuide
        @clickDone="closeGuide"
        @clickCheck="clickCheck"
        v-loading.fullscreen.lock="loading"
        />
    </div>
    <div class="token-manage-form" v-else>
      <PublishTokenForm />
    </div>
  </div>
</template>

<script>
import UserGuide from "./user-guide";
import PublishTokenForm from "./publish-token-form";
import { mapGetters } from 'vuex';
import MetaMaskInstall from '@/mixins/MetaMaskInstall';
import GetInfo from '@/mixins/GetInfo';
import { async } from 'q';


export default {
  components: { UserGuide, PublishTokenForm },
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
.token-manager {
  margin: 0;
  font-family: Noto Sans SC;
  color: #45588c;
  .title {
    margin: 0 0 50px 17px;
    font-family: Helvetica Neue;
    font-size: 24px;
    line-height: 27px;
    font-weight: bold;
    color: #45588c;
  }
}
</style>
