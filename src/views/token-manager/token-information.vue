<template>
  <div>
    <h1>Token information</h1>
    <div class="container" v-if="showInfo">
      <div class="token-info-container">
        <div class="notice-box">
          <p class="notice">
            Your Token has been added to "Finance" list. Go check and start
            distribution!
          </p>
        </div>
        <div class="token-address-box">
          <img class="eth-icon" :src="orgInfo.logo" />
          <h2 class="token-address">{{ asset.contract }}</h2>
          <span class="token-label">Host</span>
          <h2 class="total-box">300000000 ABC</h2>
        </div>
        <div class="token-info-box">
          <span class="token-name"
            >Token: {{ asset.name }}({{ asset.symbol }})</span
          >
          <span class="total-supply">Total Supply: {{ asset.supply }}</span>
        </div>
      </div>
      <div class="sub-account-box">
        <div class="add-sub-account">
          <img
            class="add-ico"
            src="@/assets/add-sub-account.png"
            @click="addSubAccountAction"
          />
          <h2 class="add-sub-action">Add Sub account</h2>
        </div>

        <div class="wallet-box"
              v-for="item in orgInfo.finance"
              :key="item.txhash"
              >
          <div class="top-box">
            <div class="wallet-title">Salary Wallet</div>
            <div class="budget" @click="budgetClicked(item.tokenAddress)">Budget</div>
          </div>
          <div class="mid-box">
            <img class="bit-ico" src="@/assets/btc.png" />
            <h2 class="address">{{item.tokenAddress}}</h2>
          </div>
          <div class="bottom-box">
            <h2>{{item.budget}}</h2>
          </div>
        </div>

      </div>
    </div>
    <div v-if="showAddSub">
      <AddSubAccount @addSubsuccess='addSubsuccess'></AddSubAccount>
    </div>
    <div v-if="showBudget">
      <Budget @budgetSuccess='budgetSuccess' :key='newChild' :token-address="budgetTokenAddress"></Budget>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import AddSubAccount from './add-sub-account'
import Budget from './budget'
export default {
  components: { AddSubAccount, Budget },
  name: 'token-information',
  data() {
    return {
      asset: '',
      orgInfo: '',
      showAddSub: false,
      showBudget: false,
      showInfo: true,
      budgetTokenAddress: '22223',
      newChild:1
    }
  },
  computed: {
    ...mapGetters(['coinbase', 'orgForm'])
  },
  created() {
    this.asset = this.orgForm.asset
    this.orgInfo = this.orgForm
    console.log(this.orgInfo)
  },
  methods: {
    addSubAccountAction() {
      this.showInfo = false
      this.showBudget = false
      this.showAddSub = true
    },
    budgetClicked(tokenAddress) {
      this.budgetTokenAddress = tokenAddress
      this.newChild++
      this.showInfo = false
      this.showBudget = true
      this.showAddSub = false
    },
    addSubsuccess(){
      this.showInfo = true
      this.showBudget = false
      this.showAddSub = false
    },
    budgetSuccess(){
      this.showInfo = true
      this.showBudget = false
      this.showAddSub = false
    }
  }
}
</script>
<style lang="scss">
.token-info-container {
  border: 1px solid rgba(55, 64, 89, 0.05);
  box-sizing: border-box;
  box-shadow: 0px 5px 10px rgba(0, 0, 0, 0.02);
  border-radius: 6px;
  height: 335px;
  .notice-box {
    border-bottom: 1px solid rgba(55, 64, 89, 0.05);
    .notice {
      padding-left: 30px;
      font-weight: 500;
      font-size: 20px;
      line-height: 29px;
    }
  }
  .token-address-box {
    display: flex;
    padding-left: 30px;
    padding-top: 40px;
    .eth-icon {
      width: 64px;
      height: 64px;
    }
    .token-address {
      margin-left: 20px;
      font-size: 20px;
      line-height: 24px;
    }
    .token-label {
      font-size: 16px;
      margin-top: 15px;
      margin-left: 15px;
      height: 26px;
      line-height: 20px;
      letter-spacing: 1px;
      color: rgba(55, 64, 89, 0.4);
      padding: 3px 15px 3px 15px;
      background: rgba(55, 64, 89, 0.05);
      border-radius: 100px;
    }
    .total-box {
      margin-left: 20px;
      font-size: 20px;
      line-height: 24px;
    }
  }
  .token-info-box {
    display: flex;
    background: rgba(55, 64, 89, 0.05);
    border-radius: 85px;
    height: 60px;
    padding: 20px;
    margin: 28px 30px 28px 30px;
    .token-name {
      font-size: 16px;
      line-height: 20px;
      color: #45588c;
    }
    .total-supply {
      padding-left: 30px;
      font-size: 16px;
      line-height: 20px;
      color: #45588c;
    }
  }
}
.sub-account-box {
  width: 100%;
  overflow-y: scroll;
  display: flex;
  margin-top: 24px;
}
.add-sub-account {
  height: 198px;
  width: 535px;
  border: 1px solid rgba(55, 64, 89, 0.05);
  box-sizing: border-box;
  box-shadow: 0px 5px 10px rgba(0, 0, 0, 0.02);
  border-radius: 6px;
  .add-ico {
    width: 40px;
    height: 40px;
    margin: 60px 247px 0px;
  }
  .add-sub-action {
    font-family: Helvetica Neue;
    font-size: 20px;
    line-height: 24px;
    color: #45588c;
    margin-top: 22px;
    text-align: center;
  }
}
.wallet-box {
  margin-left: 30px;
  width: 535px;
  height: 198px;
  border: 1px solid rgba(55, 64, 89, 0.05);
  box-sizing: border-box;
  box-shadow: 0px 5px 10px rgba(0, 0, 0, 0.02);
  border-radius: 6px;

  .top-box {
    display: flex;
    padding: 23px 27px 10px 23px;
    .wallet-title {
      font-family: Helvetica Neue;
      font-size: 16px;
      width: 100px;
      line-height: 20px;
      color: #45588c;
    }
    .budget {
      background: #f2f3ff;
      border-radius: 100px;
      height: 26px;
      margin-left: 250px;
      padding: 3px 15px 5px 15px;
      // padding-top: 7px;
      font-weight: 500;
      font-size: 16px;
      letter-spacing: 1px;
      color: #7b88ff;
    }
  }
  .mid-box {
    display: flex;
    .bit-ico {
      margin-left: 27px;
      width: 36px;
      height: 36px;
    }
    .address {
      margin: 5px 0px 5px 10px;
      font-family: Helvetica Neue;
      font-size: 14px;
      line-height: 24px;
      color: #45588c;
    }
  }
  .bottom-box {
    margin-left: 27px;
    margin-top: 30px;
    font-family: Helvetica Neue;
    font-size: 20px;
    line-height: 24px;
    color: #45588c;
  }
}
</style>
