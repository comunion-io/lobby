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
    handleSuccess() {
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
    },
    publishToken1() {
      this.trans = true
      this.getDeployData(this.asset, this.orgForm.contract)
        .then(deployData => {
          try {
            web3.eth.sendTransaction(
              {
                from: this.coinbase,
                value: '0',
                gas: '8000000',
                data: deployData
              },
              (err, data) => {
                if (data) {
                  this.transactionHash = data
                  this.trans = false
                  this.showForm = false
                  this.showTrans = true
                  console.log('transaction hash', data)
                  const _this = this
                  const progressTimer = setInterval(() => {
                    if (_this.percentage < 90) {
                      _this.percentage++
                    } else {
                      clearInterval(progressTimer)
                    }
                  }, 2000)
                  this.$once('hook:beforeDestroy', () => {
                    console.log('before destroy')
                    clearInterval(progressTimer)
                  })

                  this.$store
                    .dispatch(
                      'organization/addAsset',
                      this.asset,
                      this.icon,
                      this.transactionHash
                    )
                    .then(res => {
                      console.log('res', res)

                      this.isCreateSuccess = true
                      const checkOrgStatusTimer = setInterval(() => {
                        this.$store
                          .dispatch('organization/getOrgInfo', this.orgForm._id)
                          .then(() => {
                            console.log(this.orgForm, this.orgForm)
                            if (
                              this.orgForm.asset &&
                              this.orgForm.asset.contract
                            ) {
                              // has written in the chain
                              this.isTransactionSuccess = true
                              this.showTrans = false
                              // this.hasToken = true

                              clearInterval(checkOrgStatusTimer)
                            }
                          })
                      }, 5000)
                      this.$once('hook:beforeDestroy', () => {
                        console.log('before destroy')
                        clearInterval(checkOrgStatusTimer)
                      })
                    })
                    .catch(err => {
                      this.$notify({
                        message: err.msg || 'update database failed',
                        type: 'warning'
                      })
                      progressTimer && clearInterval(progressTimer)
                      checkOrgStatusTimer && clearInterval(checkOrgStatusTimer)
                    })
                  this.isTrans = false
                } else {
                  this.isCreateSuccess = false
                  this.isTrans = false
                  this.$notify({
                    message: err,
                    type: 'warning'
                  })
                }
              }
            )
          } catch (error) {
            this.isTrans = false
            console.log(error)
          }
        })
        .catch(error => {
          this.isTrans = false
          console.log(error, 'failed to get deployData')
        })
    },
    async publishToken() {
      try {
        this.isTrans = true
        const deployData = await this.getDeployData(
          this.asset,
          this.orgForm.contract
        )
        // this.transactionHash = await web3.eth.sendTransaction({
        //   from: this.coinbase,
        //   value: '0',
        //   data: deployData
        // }, (err, data) => {
        //   if (err) {
        //     console.log('err', err)
        //     Promise.reject(err)
        //   } else if (data) {
        //     console.log('trans', this.transactionHash)
        //     Promise.resolve(data);
        //   }
        // });
        await web3.eth
          .sendTransaction({
            from: this.coinbase,
            value: '0',
            gas: '8000000',
            data: deployData
          })
          .on('transactionHash', hash => {
            console.log('get transhash 1')
            this.transactionHash = hash
            this.isTrans = false
          })
          .on('receipt', receipt => {
            console.log('receipt', receipt)
          })
          .on('confirmation', (confirmationNumber, receipt) => {
            console.log('confirmation', confirmationNumber)
          })
          .on('error', err => {
            console.log('error1', err)
            this.isTrans = false
            Promise.reject(err)
          })
        console.log('trans2', this.transactionHash)
        this.isTrans = false
        this.showForm = false
        this.showTrans = true
        debugger
        this.progressTimer = setInterval(() => {
          if (this.percentage < 90) {
            this.percentage++
          } else {
            clearInterval(this.progressTimer)
          }
        }, 2000)
        this.$once('hook:beforeDestroy', () => {
          clearInterval(this.progressTimer)
        })
        await this.$store.dispatch(
          'organization/addAsset',
          this.asset,
          this.icon,
          this.transactionHash
        )
        this.isCreateSuccess = true
        this.checkOrgStatusTimer = setInterval(async () => {
          await this.$store.dispatch(
            'organization/getOrgInfo',
            this.orgForm._id
          )
          if (this.orgForm.asset && this.orgForm.asset.contract) {
            // has written in the chain
            this.isTransactionSuccess = true
            this.showTrans = false
            clearInterval(this.checkOrgStatusTimer)
          }
        }, 5000)
      } catch (err) {
        // 统一处理错误，比较乱
        console.log('catch', err)
        this.$notify({
          message: err || 'publish failed',
          type: 'warning'
        })
        this.progressTimer && clearInterval(this.progressTimer)
        this.checkOrgStatusTimer && clearInterval(this.checkOrgStatusTimer)
        this.isCreateSuccess = false
        this.isTrans = false
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
