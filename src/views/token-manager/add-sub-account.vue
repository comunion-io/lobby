<template>
  <div class="info-container">
    <!-- <h1 class="token_information_title">Token information</h1> -->
    <div class="add_sub_account" v-if="showAddSub">
      <h2 class="form_title">Add sub account</h2>
      <el-form label-position="top" class="form_box">
        <el-form-item label="Budge account">
          <el-select
            v-model="members"
            class="member_select"
            placeholder="choose member"
          >
            <el-option
              v-for="item in form.members"
              :key="item.uid"
              :label="item.name"
              :value="item.name"
            >
              <div class="member_item">
                <img :src="item.avater" />
                <div>
                  <p class="member_name">
                    {{ item.name }}
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
        <!-- <el-button class="add_button" round @click="putTxHashToServer"
          >MMLogin</el-button
        > -->
      </el-form>
    </div>
    <MetaMaskTrans
        v-if="showMM"
        actionName="add sub account"
        successText="add sub account success"
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
import DaoInstall from '@/mixins/DaoInstall'

export default {
  // props:['id'],  
  mixins: [GetInfo, MetaMaskInstall,DaoInstall],
  components: {
    MetaMaskTrans,
  },

  data() {
    return {
      members: '',
      usage: '',
      showMM: false,
      showAddSub: true,
      asset: '',
      dbData: {},
      orgInfo: {},
      address: '0x17ab03A8e7a39346cF035cc72991670E18d4F561',
      form: {
        members: [
          {
            name: 'member1',
            avater:
              'https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=320178652,790985626&fm=26&gp=0.jpg',
            job: 'UIABC',
            address: '0x17ab03a8e7a39346cf035cc72991670e18d4f561',
            uid: '1236'
          },
          {
            name: 'member2',
            avater:
              'https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=320178652,790985626&fm=26&gp=0.jpg',
            job: 'UIJOB',
            address: '0x17ab03a8e7a39346cf035cc72991670e18d4f561',
            uid: '1237'
          }
        ]
      }
    }
  },
  // watch:{
  //   'id':function(a,b){
  //     this.usage=a
  //   }
  // },

  computed: {
    ...mapGetters(['coinbase','orgForm'])
  },
  created() {
    this.asset = this.orgForm.asset
    this.orgInfo = this.orgForm
    console.log(this.orgInfo)
    if (this.orgForm.asset) {
      this.hasToken = true
    } else {
      this.showGuide = true
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
        console.log('mm error!')
        return Promise.reject(err)
      }
    },
    async handleSuccess() {
      console.log('mm success!')
      await this.$store.dispatch('organization/budget', this.asset)
      this.hasToken = true
    },

    addSubAccount(){
      this.showMM = true
      this.showAddSub = false
    },

    putTxHashToServer(txhash){
        var orgId = getCurOrgId()
        console.log(orgId)
        txhash = '0xa3ed4ac5528deaa28142cf869a24facd43d8b8b5d18a5021d631cd3261fe871c'
        this.$store.dispatch('organization/addSubAccount',orgId,this.usage,txhash).then(res=>{
            console.log('aaa')
            if (res === 'success') {
                console.log('success !!!')
            } else {
                console.log(res)
                this.$notify({
                    message: res,
                    type: 'warning'
                })
            }
        })
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
  height: 34px;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  cursor: pointer;
  height: 60px;
}
.member_item {
  width: 100%;
  display: flex;
  img {
    width: 28px;
    height: 28px;
    border-radius: 50%;
  }
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
