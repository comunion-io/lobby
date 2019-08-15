<template>
  <div class="organization">
    <!--    <div class="back">-->
    <!--      <el-button class="btn-grey" round>&lt; Back</el-button>-->
    <!--    </div>-->

    <el-form v-if="!isTransactionSuccess" ref="orgForm" :model="orgForm" label-width="190px" :rules="orgRules">

      <el-tabs v-model="curStep" @tab-click="handleTabClick">
        <el-tab-pane label="Claim organization name" name="step1">
          <div class="inner-content">
            <div class="section-card">
              <div class="card-title">Claim organization name</div>
              <div class="card-content">
                <el-form-item label="" prop="name" label-width="0">
                  <el-input v-model="orgForm.name" placeholder="Organization name" class="org-name-input" />
                </el-form-item>
                <div class="org-name-check">
                  <span v-show="isOrgNameInCheck" class="check" />
                  <svg v-show="orgForm.name && !isOrgNameInCheck && isOrgNameValid" class="icon" aria-hidden="true">
                    <use xlink:href="#icon-check" />
                  </svg>
                  <!-- <svg v-show="orgForm.name && !isOrgNameInCheck && !isOrgNameValid" class="icon" aria-hidden="true">
                    <use xlink:href="#icon-minus" />
                  </svg> -->
                </div>
                <div v-if="!orgForm.name || !orgForm.name.replace(/(^\s*)|(\s*$)/g, '')" class="tip">Please input your organization name</div>
                <div v-else>
                  <div v-show="!isOrgNameInCheck && isOrgNameValid" class="tip">Organization name does not exist</div>
                  <div v-show="!isOrgNameInCheck && !isOrgNameValid" class="tip error">Organization name already exists</div>
                </div>
                <el-button :class="['btn-main', 'btn-wide', isOrgNameValid ? '' : 'disable']" round @click="isOrgNameValid?curStep='step2':''">Next</el-button>
              </div>
            </div>
          </div>
        </el-tab-pane>

        <el-tab-pane label="Fill in information" name="step2">
          <div v-show="curInfo==='info1'">
            <div class="inner-content">
              <div class="section-card">
                <div class="card-title">Fill in information</div>
                <div class="card-content">
                  <el-form-item label="Operation net">
                    <div class="el-input fake">Ethereum Mainnet</div>
                  </el-form-item>
                  <el-form-item label="Organization type" prop="type">
                    <el-select v-model="orgForm.type" placeholder="select...">
                      <el-option
                        v-for="item in orgTypeList"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      />
                    </el-select>
                  </el-form-item>
                  <el-form-item label="Organization Logo" prop="logo">
                    <el-upload
                      action="/comunion-api/a/upload"
                      name="upload"
                      list-type="picture-card"
                      :on-change="handleFileChange"
                      :multiple="false"
                      :on-remove="handleFileRemove"
                      :on-success="handleUploadSuccess"
                    >
                      <i class="el-icon-plus" />
                    </el-upload>
                    <div class="tip upload-tip">Upload 100x100 png/jpeg</div>
                  </el-form-item>
                  <el-button :class="['btn-main', 'btn-wide', isInfo1Valid ? '' : 'disable']" round @click="checkInfo1">Next</el-button>
                </div>
              </div>
            </div>
          </div>

          <div v-show="curInfo==='info2'">
            <div class="inner-content">
              <div class="section-card">
                <!--          <div class="card-title">Fill in information</div>-->
                <div class="card-content">
                  <el-form-item label="Office website" prop="website">
                    <el-input v-model="orgForm.website" placeholder="Office website" />
                  </el-form-item>
                  <el-form-item label="Organization mission" prop="mission">
                    <el-input v-model="orgForm.mission" placeholder="Organization mission " type="textarea" />
                  </el-form-item>
                  <el-form-item label="Organization Vision" prop="vision">
                    <el-input v-model="orgForm.vision" placeholder="Organization vision " type="textarea" />
                  </el-form-item>
                  <el-form-item label="Organization Description" prop="description">
                    <el-input v-model="orgForm.description" placeholder="Organization description " type="textarea" />
                  </el-form-item>
                  <el-form-item label="Social Media">
                    <el-input v-for="(social,index) in orgForm.social" :key="index" v-model="social.value" placeholder="input address" class="input-with-select">
                      <el-select slot="prepend" v-model="social.name" placeholder="select">
                        <el-option v-for="item in socialList" :key="item" :label="item" :value="item" />
                      </el-select>
                      <el-button slot="append" icon="el-icon-delete" @click="removeSocial(index)" />
                    </el-input>
                    <span class="add-media" @click="addSocial">+ add</span>
                  </el-form-item>
                  <!--                  <el-button class="btn-grey btn-wide" round @click="curInfo='info1'">上一步</el-button>-->
                  <el-button :class="['btn-main', 'btn-wide', isInfo2Valid ? '' : 'disable']" round @click="checkInfo2Click">Next</el-button>
                </div>
              </div>
            </div>
          </div>

          <div v-show="curInfo==='info3'">
            <div class="inner-content">
              <div class="section-card">
                <div class="card-title">Your information</div>
                <div class="card-content">

                  <el-form-item label="Your Email" prop="email">
                    <el-input v-model="orgForm.email" placeholder="" />
                  </el-form-item>

                  <div class="tip">-The initial password will be sent to your email. You can use this email to login your account.<br>
                    -You can continute to complete your profile affter completing the creation.</div>
                  <!--                  <el-button class="btn-grey" round @click="curInfo='info2'">上一步</el-button>-->
                  <el-button :class="['btn-main', 'btn-wide', isEmailValid ? '' : 'disable']" round @click="checkEmailClick">Next</el-button>
                </div>
              </div>
            </div>
          </div>
        </el-tab-pane>

        <el-tab-pane label="Sign the transaction" name="step3">
          <div class="inner-content">
            <div class="section-card">
              <div class="card-title">Sign the transaction </div>
              <div class="tip nomargin left">At last, you should sign the transaction to register your organization.</div>
              <div v-if="!orgForm.transactionHash" class="card-content">
                <div class="tip">Open your web wallet</div>

                <div class="wallet-logo">
                  <svg class="icon" aria-hidden="true">
                    <use :xlink:href="'#icon-metamask'+(isMetaMaskInstalled?1:'')" />
                  </svg>
                </div>
                <el-button :class="['btn-wide', isMetaMaskInstalled?'btn-main':'btn-grey']" round @click="submitForm('orgForm')">Open MetaMask</el-button>
                <div v-if="!coinbase" class="tip" @click="handleMetaMaskLogin">Please <a>log in</a> first</div>
                <div v-else class="tip black">Address: {{ coinbase }}</div>

                <div class="wallet-logo">
                  <svg class="icon" aria-hidden="true">
                    <use :xlink:href="'#icon-myether'+(false?1:'')" />
                  </svg>
                </div>
                <el-button class="btn-grey" round>Open MyEtherWallet</el-button>
                <div class="tip">Please <a>log in</a> first</div>
                <!--                <el-button :class="['btn-main', 'btn-wide', coinbase ? '' : 'disable']" round @click="submitForm('orgForm')">Create</el-button>-->
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
        </el-tab-pane>
      </el-tabs>
    </el-form>

    <div v-else class="inner-content">
      <div class="success"><img src="~@/assets/success.png" alt=""></div>
      <div class="success-txt">Congratulations!</div>
      <div class="success-txt">You have created a decentralized organization.</div>
      <el-button class="btn-main btn-wide" round @click="handleGetStart">Get Start</el-button>
    </div>
  </div>
</template>

<script>
import { checkOrgName } from '@/api/organization'
import _ from 'lodash'
import { mapGetters } from 'vuex'
import { setInterval, clearInterval } from 'timers'

export default {
  data() {
    const checkEmail = (rule, value, callback) => {
      const pattern = /^[_a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,})$/

      if (!value) {
        return callback(new Error('please input email'))
      }
      setTimeout(() => {
        if (!pattern.test(value)) {
          callback(new Error('please input valid email'))
        } else {
          callback()
        }
      }, 1000)
    }
    return {
      orgForm: {
        name: '',
        type: '', // 没有该字段
        logo: '',
        email: '',
        wallet: [],
        website: '',
        mission: '',
        vision: '',
        description: '',
        social: [],
        members: [],
        transactionHash: '',
        afterSave: 'afterSaveOrg'
      },
      orgRules: {
        name: [
          { required: true, message: 'please input organization name', trigger: 'change' }
        ],
        type: [
          { required: true, message: 'please select organization type', trigger: 'change' }
        ],
        email: [
          { validator: checkEmail, trigger: 'change' }
        ],
        website: [
          { required: true, message: 'please input organization website', trigger: 'blur' }
        ],
        mission: [
          { required: true, message: 'please input organization mission', trigger: 'blur' }
        ],
        vision: [
          { required: true, message: 'please input organization vision', trigger: 'blur' }
        ],
        description: [
          { required: true, message: 'please input organization description', trigger: 'blur' }
        ],
        wallet: [
          { type: 'array', required: true, message: '请至少选择一个钱包', trigger: 'change' }
        ],
        social: [
          { type: 'array', required: true, message: '请至少选择一个social', trigger: 'change' }
        ]
      },
      orgTypeList: [{
        value: 'Business',
        label: 'Business'
      }, {
        value: 'School',
        label: 'School'
      }, {
        value: 'Personal',
        label: 'Personal'
      }],
      socialList: ['twitter', 'facebook', 'instagram', 'youtube'],
      curStep: 'step1',
      curInfo: 'info1',
      isOrgNameInCheck: false,
      isOrgNameValid: false,
      isInfo1Valid: false,
      isInfo2Valid: false,
      isEmailValid: false,
      isMetaMaskInstalled: false,
      isMetaMaskInMainNet: false,
      isCreateSuccess: false,
      isTransactionSuccess: false,
      percentage: 0
    }
  },
  // computed: {
  //   // coinbase: {
  //   // get() {
  //   //   console.log(55, this.$store.getters.coinbase)
  //   //   return this.$store.getters.coinbase
  //   // },
  //   // set(val) {
  //   //   this.$store.commit('coinbase/SET_COINBASE', val)
  //   // }
  //   // }
  // },
  computed: {
    ...mapGetters([
      'coinbase'
    ])
  },
  watch: {
    'orgForm.name': function(newVal, oldVal) {
      const name = newVal.replace(/(^\s*)|(\s*$)/g, '')

      if (name.length === 0) {
        this.isOrgNameInCheck = false
        this.isOrgNameValid = false
      }
      if (name.length > 0 && name !== oldVal.replace(/(^\s*)|(\s*$)/g, '')) {
        this.isOrgNameInCheck = true
        this.debouncedCheckOrgName()
      }
    },
    'orgForm.type': function(newVal, oldVal) {
      if (newVal) {
        this.isInfo1Valid = true
      }
    },
    'orgForm.email': function(newVal, oldVal) {
      if (newVal) { this.checkEmail() }
    },
    'orgForm.description': function(newVal, oldVal) {
      if (newVal) { this.checkInfo2() }
    }
  },
  created() {
    this.checkMetaMaskInstall()
    this.debouncedCheckOrgName = _.debounce(this.checkOrgName, 500)
  },
  methods: {
    checkOrgName() {
      const name = this.orgForm.name.replace(/(^\s*)|(\s*$)/g, '')
      if (name.length > 0) {
        console.log('check')
        this.isOrgNameInCheck = true
        checkOrgName(name).then(res => {
          if (res.entity) {
            console.log('组织名称已存在')
            this.isOrgNameValid = false
          } else {
            console.log('组织名称可用')
            this.isOrgNameValid = true
          }
          this.isOrgNameInCheck = false
        })
      } else {
        this.isOrgNameValid = false
        this.isOrgNameInCheck = false
      }
    },
    checkInfo1() {
      if (!this.isInfo1Valid) {
        this.$refs.orgForm.validateField('type', (err) => {
          console.log('err msg ', err)
          if (!err) {
            this.isInfo1Valid = true
            this.curInfo = 'info2'
          }
        })
      } else {
        this.curInfo = 'info2'
      }
    },
    checkInfo2() {
      this.$refs.orgForm.validateField('website', (errWebsite) => {
        if (!errWebsite) {
          this.$refs.orgForm.validateField('mission', (errMission) => {
            if (!errMission) {
              this.$refs.orgForm.validateField('vision', (errVision) => {
                if (!errVision) {
                  this.$refs.orgForm.validateField('description', (errDes) => {
                    if (!errDes) {
                      this.isInfo2Valid = true
                      console.log('valid info 2')
                    }
                  })
                }
              })
            }
          })
        }
      })
    },
    checkInfo2Click() {
      this.$refs.orgForm.validateField('website', (errWebsite) => {
        if (!errWebsite) {
          this.$refs.orgForm.validateField('mission', (errMission) => {
            if (!errMission) {
              this.$refs.orgForm.validateField('vision', (errVision) => {
                if (!errVision) {
                  this.$refs.orgForm.validateField('description', (errDes) => {
                    if (!errDes) {
                      this.isInfo2Valid = true
                      console.log('valid info 2')
                      this.curInfo = 'info3'
                    }
                  })
                }
              })
            }
          })
        }
      })
    },
    checkEmail() {
      this.$refs.orgForm.validateField('email', (err) => {
        console.log('err msg ', err)
        if (!err) {
          this.isEmailValid = true
        }
      })
    },
    checkEmailClick() {
      this.$refs.orgForm.validateField('email', (err) => {
        console.log('err msg ', err)
        if (!err) {
          this.isEmailValid = true
          this.curStep = 'step3'
        }
      })
    },
    submitForm(formName) {
      if (this.coinbase) {
        this.orgForm.wallet.push({
          name: 'eth',
          value: this.coinbase
        })
        console.log(this.orgForm)

        this.$refs[formName].validate((valid) => {
          console.log('valid value:', valid)
          if (valid) {
            console.log(web3.eth)
            web3.eth.sendTransaction({
              from: this.coinbase,
              to: '0x0e9a89bb07b7c4E4628E042A1dfC2554d1d8b7ca',
              value: '80000000'
            }, (err, data) => {
              if (data) {
                this.orgForm.transactionHash = data

                console.log('transaction hash', data)
                const _this = this
                const timer = setInterval(function() {
                  if (_this.percentage < 90) {
                    _this.percentage++
                  } else {
                    clearInterval(timer)
                  }
                }, 2000)
                this.$store.dispatch('organization/newOrg', this.orgForm).then((res) => {
                  if (res === 'success') {
                    this.isCreateSuccess = true
                  }
                })
              } else {
                this.isCreateSuccess = false
                this.$notify({
                  message: err,
                  type: 'warning'
                })
              }
            })
          } else {
            this.$notify({
              message: 'Please complete organization info to create!',
              type: 'warning'
            })
            return false
          }
        })
      } else {
        this.$notify({
          message: 'please log in first!',
          type: 'warning'
        })
      }
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    handleFileChange(file, fileList) {
      console.log(file, fileList)
      if (fileList.length === 1) {
        console.log(1, document.querySelector('.el-upload--picture-card'))
        document.querySelector('.el-upload--picture-card').style.visibility = 'hidden'
      }
    },
    handleFileRemove(file) {
      console.log('remove')
      document.querySelector('.el-upload--picture-card').style.visibility = 'visible'
    },
    handleUploadSuccess(response, file, fileList) {
      this.orgForm.logo = response.url
    },
    addSocial() {
      this.orgForm.social.push({
        name: '',
        value: ''
      })
    },
    removeSocial(index) {
      console.log(this.orgForm.social)
      this.orgForm.social.splice(index, 1)
      console.log(this.orgForm.social)
    },
    handleTabClick(tab, e) {
      e.preventDefault()
      console.log(e)
    },

    checkMetaMaskInstall() {
      if (window.web3 || window.ethereum) {
        // Use the browser's ethereum provider
        this.isMetaMaskInstalled = true
        web3 = new Web3(web3.currentProvider)
        /* To see if the injected provider is from MetaMask */
        if (web3.currentProvider.isMetaMask) {
          console.log('The injected provider is from MetaMask！')
        }
      } else {
        this.isMetaMaskInstalled = false
        this.$notify({
          message: 'No web3? You should consider trying MetaMask!',
          type: 'warning'
        })
      }
    },
    metaMaskLogin: async() => {
      try {
        // Request account access if needed
        await window.ethereum.enable()

        // We don't know window.web3 version, so we use our own instance of Web3
        // with the injected provider given by MetaMask
        // web3 = new Web3(window.ethereum)
      } catch (error) {
        console.log('metamask login error', error)

        this.$notify({
          message: 'You need to allow MetaMask!',
          type: 'warning'
        })
      }
    },
    handleMetaMaskLogin() {
      this.metaMaskLogin().then(res => {
        console.log('login res', res)
        // web3.eth.getAccounts((err, account) => {
        //   console.log('web3 eth account', account)
        // })
        // web3.eth.getCoinbase((err, coinbase) => {
        //   console.log('coninbase', coinbase, err)
        // })
        // console.log('account', web3.eth.accounts[0])

        const coinbase = web3.eth.accounts[0]
        this.$store.commit('coinbase/SET_COINBASE', coinbase)
      })
    },

    handleContract() {
      var address = '0xf77976c9a552f2934d3694c38fbd057ae803ef45'
      var abi = [{ 'constant': true, 'inputs': [], 'name': 'say', 'outputs': [{ 'name': '', 'type': 'string' }], 'payable': false, 'stateMutability': 'view', 'type': 'function' }, { 'inputs': [], 'payable': false, 'stateMutability': 'nonpayable', 'type': 'constructor' }]

      var hello = web3.eth.contract(abi).at(address)

      console.log(hello)
      console.log('Calling the smart contract')
      // var result = greeter2.greet();
      // console.log(result);
      hello.say(err => {
        console.log(err)
      })
      hello.say().call(err => {
        console.log(err)
      })
    },
    handleGetStart() {
      this.$router.push(`/dao/info/${this.orgId}`)
    }
  }
}
</script>

<style lang="scss" >

</style>
