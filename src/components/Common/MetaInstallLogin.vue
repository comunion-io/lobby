<template>
  <div class="meta-install-login">
    <el-card class="tip" v-if="showTrans">
      <div class="deploy-trans">
        <div class="inner-content">
          <div class="section-card">
            <div class="card-title">Deploy Transaction</div>
            <div class="tip nomargin left">
              This is the last step : ) &nbsp; You will need to sign the transaction to {{actionName}}.
              <br />Continue with your web wallet.
            </div>
            <div v-if="!transactionHash" class="card-content">
              <div class="tip">Open your web wallet</div>

              <div class="wallet-logo">
                <svg class="icon" aria-hidden="true">
                  <use :xlink:href="'#icon-metamask'+(isMetaMaskInstalled?1:'')" />
                </svg>
              </div>
              <el-button
                :class="['btn-wide', isMetaMaskInstalled?'btn-main':'btn-grey']"
                round
                @click="tryPublish"
                :loading="isTrans"
              >MetaMask</el-button>
              <div v-if="!coinbase" class="tip" @click="handleMetaMaskLogin">
                click
                <a>log in</a> to wake up your MetaMask
              </div>
              <div v-else class="tip black">Address: {{ coinbase }}</div>
            </div>
            <div v-else>
              <div class="success">
                <el-progress type="circle" color="#7B88FF" :percentage="percentage" />
              </div>
              <div class="tip">It takes a few minutes to confirm on the chain.</div>
              <div class="tip">Do not close this page...</div>
            </div>
          </div>
        </div>
      </div>
    </el-card>
    <div v-if="!showTrans && isTransactionSuccess" class="inner-content">
      <div class="success">
        <img src="~@/assets/success.png" alt />
      </div>
      <div class="success-txt">Congratulations!</div>
      <div class="success-txt">You have created a token.</div>
      <el-button class="btn-main btn-wide" round @click="handleGetStart">Get Start</el-button>
    </div>
    <el-dialog title :visible.sync="dialogVisible" width="30%">
      <div>
        <div class="message">You have not installed MetaMask Yet!</div>
        <span slot="footer" class="dialog-footer">
          <el-button class="btn-main btn-wide" round>
            <a
              href="https://wiki.comunion.io/guide/metamask-guide"
              target="_blank"
            >View installation tutorial</a>
          </el-button>
        </span>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import MetaMaskInstall from '@/mixins/MetaMaskInstall'
import { async } from 'q'
import { Organization, OrgToken } from 'comunion-dao'
import { stringify } from 'querystring'

export default {
  mixins: [MetaMaskInstall],
  data() {
    return {
      dialogVisible: false
    }
  },
  props: {
    // what do you use trans to do
    actionName: {
      type: String,
      default: 'add the member'
    },
    // after installing the metamask and login and bundling and get the coinbase,
    // to do the data things
    handlePublish: {
      type: Function
    },
    // web3 transation hash
    transactionHash: {
      type: String,
      default: ''
    },
    // progress bar
    percentage: {
      type: Number,
      default: 0
    },
    // finish putting data to database
    isCreateSuccess: {
      type: Boolean,
      default: false
    },
    // success to add data to the chain
    isTransactionSuccess: {
      type: Boolean,
      default: false
    },
    // begin trans
    showTrans: {
      type: Boolean,
      default: true
    },
    isTrans: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    ...mapGetters(['coinbase', 'orgForm'])
  },
  created() {},
  methods: {
    handleGetStart() {
      this.$store.dispatch('organization/getOrgInfo', this.orgForm._id)
      this.$emit('handleGetStart')
    },
    clickCheck() {
      this.checkIfInstallMataMask()
      if (this.isMetaMaskInstalled) {
        this.$message.success('You have installed MetaMask Yet!')
      } else {
        this.dialogVisible = true
      }
    },
    tryPublish() {
      if (!this.coinbase) {
        this.$notify({
          message: 'please log in first!',
          type: 'warning'
        })
        return
      }
      this.handlePublish()
    },
    publishToken() {
      if (!this.coinbase) {
        this.$notify({
          message: 'please log in first!',
          type: 'warning'
        })
        return
      }
      this.getDeployData()
        .then(deployData => {
          try {
            web3.eth.sendTransaction(deployData, (err, data) => {
              if (data) {
                this.transactionHash = data
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
                      message: statusRes.msg,
                      type: 'warning'
                    })
                    clearInterval(progressTimer)
                    clearInterval(checkOrgStatusTimer)
                  })
              } else {
                this.isCreateSuccess = false
                this.$notify({
                  message: err,
                  type: 'warning'
                })
              }
            })
          } catch (error) {
            console.log(error)
          }
        })
        .catch(error => {
          console.log(error, 'failed to get deployData')
        })
    }
  }
}
</script>

<style lang="scss">
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
