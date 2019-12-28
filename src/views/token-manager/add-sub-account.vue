<template>
  <div class="info-container">
    <!-- <h1 class="token_information_title">Token information</h1> -->
    <div class="add_sub_account" v-if="showAddSub">
      <h2 class="form_title">Add sub account</h2>
      <el-form label-position="top" class="form_box">
        <el-form-item label="Budge account">
          <el-select
            v-model="selected_address"
            class="member_select"
            placeholder="choose member"
          >
            <el-option
              v-for="item in members"
              :key="item.address"
              :label="item.userName"
              :value="item.address"
            >
              <div class="member_item">
                <div style='line-height:60px;'>
                <avater></avater>
                </div>
                <div class='info'>
                  <p class="member_name">
                    {{ item.userName }}
                    <span class="member_job">UI</span>
                  </p>
                  <p class="member_address">{{ item.address }}</p>
                </div>
              </div>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="Account name">
          <el-input
            v-model="usage"
            class="account_input"
            placeholder="Please input Account name"
          />
        </el-form-item>
        <el-button class="add_button" round @click="addSubAccount"
          >Add</el-button
        >
      </el-form>
    </div>
    <MetaMaskTrans
        v-if="showMM"
        actionName="add sub account"
        successText="add sub account success"
        actionType="ApprovalData"
        :transTo="contract"
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
import DaoInstall from '@/mixins/DaoInstall'
import avater from '@/components/Common/Avatar'

export default {
  mixins: [GetInfo, MetaMaskInstall,DaoInstall],
  components: {
    MetaMaskTrans,
    avater
  },

  data() {
    return {
      members: '',
      selected_address:'',
      usage: '',
      showMM: false,
      showAddSub: true,
      asset: '',
      contract: '',
      dbData: {},
      orgInfo: {},
      avater: 'https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=320178652,790985626&fm=26&gp=0.jpg',
    }
  },

  computed: {
    ...mapGetters(['coinbase','orgForm'])
  },
  watch: {
    'orgForm.asset': {
      handler: function(val) {
         this.asset = this.orgForm.asset
      }
    }
  },
  created() {
    this.asset = this.orgForm.asset
    this.orgInfo = this.orgForm
    this.contract = this.orgForm.asset.contract
    this.members = this.orgForm.members
    if (this.orgForm.asset) {
      this.hasToken = true
    } else {
      this.showGuide = true
    }
  },

  methods: {

    async getDeployData() {

      try {
        EthUtils.init(web3)
        let ethUtils = new EthUtils()
        let token = new OrgToken(ethUtils, this.orgForm.asset.contract)
        let spenders = [this.selected_address]

        let values = ['1']
        let deployData = await token.genApproveExtData(spenders, values)

        return Promise.resolve(deployData)
      } catch (err) {
        console.log('mm error!')
        return Promise.reject(err)
      }
    },
    async handleSuccess() {
      console.log('mm success!')
      this.$emit('addSubsuccess')
    },

    async getContract() {
      return this.contract
    },

    addSubAccount(){
      this.showMM = true
      this.showAddSub = false
      this.dbData = {'tokenAddress':this.selected_address,'budget':'1'}
    },
  }
}
</script>

<style lang="scss">
.el-select-dropdown__item{
  height:auto;
}
.info-container {
  
  .token_information_title {
    font-family: Helvetica Neue;
    font-size: 24px;
    display: flex;
    align-items: center;

    color: #45588c;
    margin-bottom: 46px;
  }
  .add_sub_account {
    border: 1px solid rgba(55, 64, 89, 0.05);
    box-sizing: border-box;
    box-shadow: 0px 5px 10px rgba(0, 0, 0, 0.02);
    border-radius: 6px;
    .form_title {
      margin-left: 30px;
      font-family: Helvetica Neue;
      font-size: 20px;
      line-height: 24px;
      font-weight: 450;
      color: #45588c;
    }
    .form_box {
      margin-left: 30px;
    }
  }

  .add_button {
    margin-top: 24px;
    margin-bottom: 30px;
    background: linear-gradient(270deg, #7b87ff 0%, #606fff 100%);
    box-shadow: 0px 2px 10px rgba(123, 136, 255, 0.5) !important;
    border-radius: 100px;
    color: white;
  }
  .assign_form {
    height: 559px;
    margin-left: 30px;
  }

  .member_select {
    width: 478px;
   
  }
  .account_input {
    width: 478px;
  }
}

.member_item {
  width: 100%;
  display: flex;

  // img {
  //   width: 28px;
  //   height: 28px;
  //   border-radius: 50%;
  // }
  .info{
    flex:1;
    padding-left:15px;
    p{
      padding:0;
      margin:0;
      line-height: 28px;
    }
  }
  .member_name {
    font-size: 16px;
    font-weight: 500;
    color: #45588c;
    .member_job {
      font-size: 12px;
      font-weight: 500;
      color: #7b88ff;
      background: #f2f3ff;
      border-radius: 12px;
      margin-left:10px;
      padding:2px 10px;

    }
  }
  .member_address {
    //padding-top: 5px;
    font-size: 11px;
    // line-height: 15px;
    color: #45588c;
  }
}
</style>
