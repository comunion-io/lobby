<template>
  <div class="info-container">
    <div class="assign-token" v-if="showAssign">
      <h1 class="title">Finance</h1>

      <el-card class="box-card full">
        <div slot="header" class="clearfix">
          <h3 class="title">Assign token - ABC</h3>
        </div>

        <el-form ref="form" :model="form" label-position="top">
          <el-form-item label="Recipient">
            <el-select v-model="form.recipient">
              <el-option label="Team member" value="1"></el-option>
              <el-option label="Not Team member" value="0"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item v-if="form.recipient === '1'" label="Choose member">
            <el-select
              class="select-user"
              v-model="selected_address"
              placeholder="Please choose member"
            >
              <el-option
                v-for="member in members"
                :key="member.userId"
                :label="member.userName"
                :value="member.address"
              >
                <!-- <avatar
                  style="float: left; margin: 3px 6px 0 0;"
                  :path="member.avatar"
                  :username="member.username"
                /> -->
                 <div class="member_item">
                    <div style='line-height:60px;'>
                    <avater></avater>
                    </div>
                    <div class='info'>
                      <p class="member_name">
                        {{ member.userName }}
                        <span class="member_job">UI</span>
                      </p>
                      <p class="member_address">{{ member.address }}</p>
                    </div>
                </div>
                
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item v-if="form.recipient === '0'" label="ETH Address">
            <el-input v-model="form.eth_address"></el-input>
          </el-form-item>

          <!-- <el-form-item label="Tags">
            <el-select
              v-model="form.tags"
              multiple
              filterable
              allow-create
              default-first-option
              placeholder="Please choose tags"
            >
              <el-option
                v-for="item in tags"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item> -->

          <el-form-item label="Amount">
            <el-input v-model="form.amount" @input="AmountChange"></el-input>
          </el-form-item>

          <el-form-item label="Remark">
            <el-input v-model="form.remark" ></el-input>
          </el-form-item>

          <!-- <el-form-item>
            <cu-button type="primary" round text="Assign" @click="assignClicked"></cu-button>
          </el-form-item> -->
          <el-button class="assign_token" round @click="assignClicked"
            >Assign</el-button
          >
        </el-form>
      </el-card>
    </div>
    <MetaMaskTrans
      v-if="showMM"
      actionName="AssignToken"
      successText="success"
      actionType="TransferData"
      :transTo="contract"
      :getDeployData="getDeployData"
      :dbData="dbData"
      @transSuccess="handleSuccess"
    ></MetaMaskTrans>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { Tag, Button as CuButton } from '@/components/Common'
import MetaMaskTrans from '@/components/Common/MetaMaskTrans'
import MetaMaskInstall from '@/mixins/MetaMaskInstall'
import { EthUtils, Daos, Organization, OrgToken } from 'comunion-dao'
import avater from '@/components/Common/Avatar'
export default {
  computed: {
    ...mapGetters(['coinbase', 'orgForm'])
   
  },
  components: {
    MetaMaskTrans,
    avater,
    Tag,
    CuButton
  },
  created() {
    console.log(this.orgForm.members)
    this.members = this.orgForm.members
    console.log(this.members)
    this.contract = this.orgForm.asset.contract
    this.asset = this.orgForm.asset
    console.log('asset : ' + JSON.stringify(this.orgForm))
    console.log('orgForm : ' + this.orgForm.asset.contract)
    // console.log(this.contract)
  },
  data() {
    return {
      showMM: false,
      showAssign: true,
      contract: '',
      form: {
        recipient: '1',
        member: '',
        eth_address: '',
        amount: '',
        remark: '',
        tags: []
      },
      dbData: {},
      decimal: 3,

      // mock data
      tags: [
        {
          value: 'HTML',
          label: 'HTML'
        },
        {
          value: 'CSS',
          label: 'CSS'
        },
        {
          value: 'JavaScript',
          label: 'JavaScript'
        }
      ],
      members: [],
      selected_address: ''
    }
  },
  methods: {
    AmountChange(e){
     this.form.amount=e.replace(/[^\d]/g,'');
    },
    async getDeployData() {
      try {
        console.log(this.selected_address)
        var amount = this.form.amount + 'e' + this.decimal
        var num = new Number(amount)
        var res = this.toNonExponential(num)
        var assignValue = res.toString()

        this.dbData = {
          tokenAddress: this.contract,
          value: assignValue,
          remark: this.form.remark
        }
        console.log(this.dbData)
        // dd(this.dbData)

        EthUtils.init(web3)
        let ethUtils = new EthUtils()
        let token = new OrgToken(ethUtils, this.asset.contract)
        let spenders = [this.selected_address]

        let values = [assignValue]

        console.log(spenders,values)

        let deployData = await token.genTransferExtData(spenders, values)

        return Promise.resolve(deployData)
      } catch (err) {
        return Promise.reject(err)
      }
    },
    async handleSuccess() {
      console.log('hahah111')
      //await this.$store.dispatch('organization/budget', this.asset, this.icon)
      this.hasToken = true
      // this.$emit('assignTokenSuccess')

      this.$router.push({ name: 'assets' })
    },
    async getBanlanceOf(){
      EthUtils.init(web3)
      let ethUtils = new EthUtils()
      let token = new OrgToken(ethUtils, this.asset.contract)
      let result = await token.balanceOf(userAddress)
    },
    toNonExponential(num) {
      var m = num.toExponential().match(/\d(?:\.(\d*))?e([+-]\d+)/)
      return num.toFixed(Math.max(0, (m[1] || '').length - m[2]))
    },
    assignClicked() {
      console.log('@@@@@')
      this.showMM = true
      this.showAssign = false
    }
  }
}
</script>

<style lang="scss">
@import '@/styles/variables.scss';
.el-select-dropdown__item{
  height:auto;
}
.assign-token {
  .title {
    color: $menuActiveText;
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
.assign_token {
  margin-top: 24px;
  margin-bottom: 30px;
  background: linear-gradient(270deg, #7b87ff 0%, #606fff 100%);
  box-shadow: 0px 2px 10px rgba(123, 136, 255, 0.5) !important;
  border-radius: 100px;
  color: white;
}
</style>
