<template>
  <div class="token-manager">
    <div class="token-details" v-if="hasToken">token{{ asset }}</div>
    <div class="center-tip" v-else-if="!isOwner">Sorry, there is no token.</div>
    <div v-else>
      <div class="title">Publish Token</div>
      <div class="token-manager-user-guide" v-if="showGuide">
        <UserGuide
          @clickDone="closeGuide"
          @clickCheck="clickCheck"
          v-loading.fullscreen.lock="loading"
        />
      </div>
      <div class="token-manage-form" v-if="showForm">
        <PublishTokenForm @clickPublish="handlePublish" />
      </div>
      <MetaMaskTrans
        v-if="showMM"
        actionName="add the token"
        successText="You have added the token"
        actionType="SetTokenData"
        :getDeployData="getDeployData"
        :dbData="dbData"
        @transSuccess="handleSuccess"
      ></MetaMaskTrans>
    </div>
  </div>
</template>

<script>
import UserGuide from './user-guide'
import PublishTokenForm from './publish-token-form'
import { mapGetters } from 'vuex'
import MetaMaskInstall from '@/mixins/MetaMaskInstall'
import DaoInstall from '@/mixins/DaoInstall'
import MetaMaskTrans from '@/components/Common/MetaMaskTrans'
import GetInfo from '@/mixins/GetInfo'
import { async } from 'q'
import { Organization, OrgToken } from 'comunion-dao'

export default {
  components: {
    UserGuide,
    PublishTokenForm,
    MetaMaskTrans
  },
  mixins: [GetInfo, MetaMaskInstall, DaoInstall],
  data() {
    return {
      loading: false,
      showForm: false,
      hasToken: false,
      asset: null,
      icon: '',
      isCreateSuccess: false,
      isTransactionSuccess: false,
      progressTimer: null,
      checkOrgStatusTimer: null,
      dbData: null,
      showMM: false
    }
  },
  computed: {
    ...mapGetters(['coinbase', 'orgForm'])
  },
  created() {
    if (this.orgForm.asset) {
      this.hasToken = true
    } else {
      this.showGuide = true
    }
  },
  watch: {
    'orgForm.asset': {
      handler: function(val) {
        if (val) {
          this.hasToken = true
        } else {
          this.hasToken = false
        }
      }
    }
  },
  beforeDestroy() {
    this.progressTimer && clearInterval(this.progressTimer)
    this.checkOrgStatusTimer && clearInterval(this.checkOrgStatusTimer)
  },
  methods: {
    async handleSuccess() {
      await this.$store.dispatch('organization/newAsset', this.asset, this.icon)
      this.hasToken = true
    },
    closeGuide() {
      this.showGuide = false
      this.showForm = true
    },
    clickCheck() {
      this.checkIfInstallMataMask()
      if (this.isMetaMaskInstalled) {
        this.$message.success('You have installed MetaMask Yet!')
      } else {
        this.dialogVisible = true
      }
    },
    handlePublish(formParams) {
      this.asset = {
        name: formParams.name,
        symbol: formParams.symbol,
        supply: formParams.supply
      }
      this.icon = formParams.icon
      this.dbData = {
        asset: this.asset,
        icon: this.icon
      }
      this.showForm = false
      this.showMM = true
    },
    async getDeployData() {
      try {
        let deployData = await OrgToken.genDeployData(
          this.orgForm.contract,
          this.asset.name,
          this.asset.symbol,
          this.asset.supply
        )
        return Promise.resolve(deployData)
      } catch (err) {
        return Promise.reject(err)
      }
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
  .token-manage-form {
    margin-left: 17px;
  }
}
.tip {
  margin-left: 17px;
  width: 90%;
  text-align: center;
  .el-card.is-always-shadow {
    box-shadow: 0px 5px 10px rgba(0, 0, 0, 0.02);
    border-radius: 6px;
  }
}
.deploy-trans {
  .wallet-logo {
    margin-bottom: 20px;
    .icon {
      font-size: 30px;
    }
  }
}
.message {
  margin-bottom: 20px;
}
.el-card.is-always-shadow {
  box-shadow: 0px 5px 10px rgba(0, 0, 0, 0.02);
  border-radius: 6px;
}
</style>
