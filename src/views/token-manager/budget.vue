<template>
  <div class="info-container">
    <div class="container">
      <h2 class="form_title">Budget</h2>
      <el-form label-position="top" class="form_box">
        <el-form-item label="Amount">
          <el-input
            v-model="budgetAmount"
            class="amout_input"
            placeholder="Amount"
          />
        </el-form-item>
        <el-button class="add_button" round @click="budgetClicked" type="number"
          >Budget</el-button
        >
      </el-form>
    </div>
          <MetaMaskTrans
        v-if="showMM"
        actionName="budget"
        successText="success"
        actionType="ApprovalData"
        :getDeployData="getDeployData"
        :dbData="dbData"
        @transSuccess="handleSuccess"
      ></MetaMaskTrans>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import GetInfo from '@/mixins/GetInfo'
import MetaMaskInstall from '@/mixins/MetaMaskInstall'
import { getCurOrgId, setCurOrgId, getUserId } from '@/utils/auth'
import { EthUtils, Daos, Organization, OrgToken } from 'comunion-dao'
import MetaMaskTrans from '@/components/Common/MetaMaskTrans'

export default {
  mixins: [GetInfo, MetaMaskInstall,MetaMaskTrans],
  computed: {
    ...mapGetters(['coinbase', 'orgForm'])
  },
  name: 'Budget',
  data() {
    return {
      budgetAmount: '',
      decimal: 3,
      address: '0x17ab03A8e7a39346cF035cc72991670E18d4F561',
      showMM: false,
      dbData: {}
    }
  },
  methods: {
    
    async getDeployData() {
      try {
          console.log('hahah')
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
    async handleSuccess() {
      await this.$store.dispatch('organization/newAsset', this.asset, this.icon)
      this.hasToken = true
    },

    
    budgetClicked() {
      var amount = this.budgetAmount + 'e' + this.decimal
      var num = new Number(amount)
      var value = this.toNonExponential(num)
      console.log(value)
      this.dbData = {
        tokenAddress: this.address,
        budget: value
      }
      console.log(this.dbData)
      this.showMM = true
      //this.budgetToSubAccount(value)
    },
    //每次调用metamask时都需要检查MetaMask是否已经登录
    checkMetaMaskLogin() {
      if (!this.coinbase) {
        this.$notify({
          message: 'please log in first!',
          type: 'warning'
        })
        this.handleMetaMaskLogin()
      }
    },
    toNonExponential(num) {
      var m = num.toExponential().match(/\d(?:\.(\d*))?e([+-]\d+)/)
      return num.toFixed(Math.max(0, (m[1] || '').length - m[2]))
    },

    async budgetToSubAccount(value) {
      EthUtils.init(web3)
      let ethUtils = new EthUtils()
      let token = new OrgToken(ethUtils, this.orgForm.asset.contract)

      let spenders = [this.address]
      let values = [value]
      let approveData = await token.genApproveExtData(spenders, values)
      // 调起metamask
      var tx = {
        from: this.coinbase,
        value: '0',
        to: this.orgForm.asset.contract, // OrgToken合约地址
        data: approveData
      }
      web3.eth.sendTransaction(tx, (err, txhash) => {
        if (!err) {
          //
          console.log('approveExt hash:', txhash)
        } else {
          console.log(err)
        }
      })
    }
  }
}
</script>

<style lang="scss">
.container {
  border: 1px solid rgba(55, 64, 89, 0.05);
  box-sizing: border-box;
  box-shadow: 0px 5px 10px rgba(0, 0, 0, 0.02);
  border-radius: 6px;
  //   border-bottom: 1px solid rgba(55, 64, 89, 0.05);
  .form_title {
    margin-left: 30px;
    margin-bottom: 20px;
    font-family: Helvetica Neue;
    font-size: 20px;
    line-height: 24px;
    font-weight: 450;
    color: #45588c;
  }
  .form_box {
    margin-left: 30px;
  }
  .amout_input {
    width: 478px;
  }
}
</style>
