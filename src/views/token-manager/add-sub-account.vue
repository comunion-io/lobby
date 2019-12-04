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
                <!-- <img :src="avater" /> -->
                <div>
                  <p class="member_name">
                    {{ item.userName }}
                    <span class="member_job">{{ item.job }}</span>
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

export default {
  mixins: [GetInfo, MetaMaskInstall,DaoInstall],
  components: {
    MetaMaskTrans,
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
.info-container {
  .el-form--label-top .el-form-item__label {
    padding: 0;
    font-size: 14px;
    font-weight: 400;
  }

  .el-form-item {
    margin-bottom: 5px;
  }
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
    .el-input__inner {
      font-size: 16px;
      font-weight: 500;
      color: #45588c;
      line-height: 30px;
    }
  }
  .account_input {
    width: 478px;
  }
}
.el-select-dropdown__item {
  font-size: 14px;
  padding: 10px 20px;
  position: relative;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: #606266;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  cursor: pointer;
  height: auto;
}
.member_item {
  width: 100%;
  display: flex;
  // img {
  //   width: 28px;
  //   height: 28px;
  //   border-radius: 50%;
  // }
  .member_name {
    font-size: 16px;
    height: 30px;
    font-weight: 500;
    color: #45588c;
    .member_job {
      font-size: 11px;
      font-weight: 500;
      color: #7b88ff;
      background: #f2f3ff;
      border-radius: 12px;
      display: inline-block;
      line-height: 0;
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
