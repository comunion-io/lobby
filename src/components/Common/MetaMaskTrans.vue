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
import { addTransation, getTransation } from '@/api/common'

export default {
  mixins: [MetaMaskInstall],
  data() {
    return {
      dialogVisible: false,
      showTrans: true,
      percentage: 0,
      isSyncDbSuccess: false,
      isTransactionSuccess: false,
      transactionHash: '',
      isTrans: false,
      progressTimer: null,
      checkOrgStatusTimer: null,
    }
  },
  props: {
    // what do you use trans to do
    actionName: {
      type: String,
      required: true
    },
    // what do you use trans to do
    actionType: {
      type: String,
      required: true
    },
    // use sdk to get the deployData
    getDeployData: {
      type: Function,
      required: true
    },
    // use to update the database
    dbData: {
      type: Object,
      required: true
    },
    defaultStatus: {
      type: Number,
      default: 2
    }
  },
  computed: {
    ...mapGetters(['coinbase', 'orgForm', 'userInfo'])
  },
  created() {},
  methods: {
    handleGetStart() {
      this.$emit('transSuccess')
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
    async handlePublish() {
      try {
        this.isTrans = true
        const deployData = await this.getDeployData()
        // this.transactionHash = await web3.eth.sendTransaction({
        //   from: this.coinbase,
        //   gas: '8000000',
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
        debugger
        await web3.eth
          .sendTransaction({
            from: this.coinbase,
            value: '0',
            gas: '8000000',
            data: deployData
          })
          .on('transactionHash', hash => {
            console.log('get transhash 1', hash)
            this.transactionHash = hash
            this.isTrans = false
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
        // common api: sync the data and hash to database
        await addTransation({
          txhash: this.transactionHash,
          userId: this.userInfo._id || '',
          type: this.actionType,
          data: this.dbData,
          status: this.defaultStatus
        })
        this.isSyncDbSuccess = true
        this.checkOrgStatusTimer = setInterval(async () => {
          this.getTransation(this.transactionHash).then(data => {
            if (data.status === 1) {
              this.isTransactionSuccess = true
              this.showTrans = false
              clearInterval(this.checkOrgStatusTimer)
            } else if (data.status === 3) {
              throw 'fail to add to chain'
            }
          })
        }, 5000)
      } catch (err) {
        // 统一处理错误，比较乱
        console.log('catch: ', err)
        this.$notify({
          message: err || 'publish failed',
          type: 'warning'
        })
        this.progressTimer && clearInterval(this.progressTimer)
        this.checkOrgStatusTimer && clearInterval(this.checkOrgStatusTimer)
        this.isSyncDbSuccess = false
        this.isTrans = false
      }
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
.success-txt {
  font-size: 20px;
  color: rgba(55, 64, 89, 0.85);
  margin: 30px auto;
}
.el-card.is-always-shadow {
  box-shadow: 0px 5px 10px rgba(0, 0, 0, 0.02);
  border-radius: 6px;
}
</style>
