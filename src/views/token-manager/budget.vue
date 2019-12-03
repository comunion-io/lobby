<template>
  <div class="info-container">
    <div class="container" v-if="showBudget">
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
  props:['tokenAddress'],
  mixins: [GetInfo, MetaMaskInstall],
  computed: {
    ...mapGetters(['coinbase', 'orgForm'])
  },
  components: {
    MetaMaskTrans
  },
  created() {
    this.asset = this.orgForm.asset
    this.orgInfo = this.orgForm
    console.log(this.asset)
  },
  watch:{
    'tokenAddress':function(addr,b){
      this.address = a
      console.log(this.address)
    }
  },
  name: 'Budget',
  data() {
    return {
      budgetAmount: '',
      decimal: 3,
      address: '',
      showMM: false,
      showBudget: true,
      asset: {},
      orgInfo: {},
      dbData: {}
    }
  },
  methods: {
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
    async handleSuccess() {
      console.log('hahah111')
      await this.$store.dispatch('organization/budget', this.asset, this.icon)
      this.hasToken = true
    },

    budgetClicked() {
      var amount = this.budgetAmount + 'e' + this.decimal
      var num = new Number(amount)
      var value = this.toNonExponential(num)
      this.dbData = {
        tokenAddress: this.address,
        budget: value
      }
      console.log(this.dbData)
      this.showMM = true
      this.showBudget = false
    },

    toNonExponential(num) {
      var m = num.toExponential().match(/\d(?:\.(\d*))?e([+-]\d+)/)
      return num.toFixed(Math.max(0, (m[1] || '').length - m[2]))
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
