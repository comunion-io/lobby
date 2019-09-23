<template>
  <div class="profile">
    <div class="tab-row">
      <span class="title">Profile</span>
      <el-button :class="['btn-tag',curTab==='account'?'':'disable']" plain round @click="curTab='account'">
        Account
      </el-button>
      <el-button :class="['btn-tag',curTab==='wallet'?'':'disable']" plain round @click="curTab='wallet'">
        Wallet
      </el-button>
    </div>
    <el-form ref="form" :model="userInfo">
      <div v-show="curTab==='account'" class="section-card">
        <div class="card-title">Personal Information
          <div class="card-tool">
            <svg v-if="!isInEdit" class="icon" aria-hidden="true" @click="isInEdit=true">
              <use xlink:href="#icon-edit" />
            </svg>
            <svg v-else class="icon" aria-hidden="true" @click="handleSave">
              <use xlink:href="#icon-check" />
            </svg>
          </div>
        </div>
        <div class="card-content">
          <el-form-item label="Profile Photo">
            <div v-show="isShowLogo" class="user-avatar">
              <img v-if="userInfo.logo" :src="userInfo.logo" alt="">
              <img v-else src="~@/assets/avatar.png" alt="">
              <div v-if="isInEdit" class="mask-delete" @click="handleDeleteLogo">
                <i class="el-icon-delete" />
              </div>
            </div>
            <div v-show="isInEdit&&!isShowLogo">
              <el-upload
                action="http://178.128.221.42:8080/a/upload"
                name="upload"
                list-type="picture-card"
                :multiple="false"
                :on-change="handleFileChange"
                :on-remove="handleFileRemove"
                :on-success="handleUploadSuccess"
              >
                <i class="el-icon-plus" />
              </el-upload>
              <div class="tip upload-tip">Upload 100x100 png/jpeg</div>
            </div>

          </el-form-item>
          <el-form-item label="User Name">
            <div v-if="!isInEdit" class="el-input fake">{{ userInfo.name }}</div>
            <el-input v-else v-model="userInfo.name" />
          </el-form-item>
          <el-form-item label="Email">
            <div class="el-input fake">{{ userInfo.email }}</div>
          </el-form-item>
          <el-form-item label="Password">
            <span class="forget" @click="showChangePwdDialog">Change password</span>
          </el-form-item>
          <el-form-item label="Skill">
            <div v-if="isInEdit" class="skill-add">
              <el-input v-model="newSkill" />
              <svg v-show="isInEdit" class="icon" aria-hidden="true" @click="handleAddSkill">
                <use xlink:href="#icon-add" />
              </svg>
            </div>

            <div class="el-input fake tag-row">
              <el-tag v-for="skill in userInfo.skills" :key="skill" type="success">{{ skill }}
                <svg v-if="isInEdit" class="icon" aria-hidden="true" @click="handleRemoveSkill(skill)">
                  <use xlink:href="#icon-close" />
                </svg>
              </el-tag>
            </div>
          </el-form-item>
          <el-form-item label="Social Media">
            <div v-if="!isInEdit" class="socials el-input fake">
              <ul>
                <li v-for="social in userInfo.social" :key="social.name">
                  <a :href="social.value" target="_blank">
                    <svg class="icon" aria-hidden="true">
                      <use :xlink:href="'#icon-'+social.name" />
                    </svg>
                  </a>
                </li>
              </ul>
            </div>
            <!-- <el-input v-for="(social,index) in userInfo.social" :key="social" v-model="social.value" placeholder="input address" class="input-with-select">
              <el-select slot="prepend" v-model="social.name" placeholder="select">
                <el-option v-for="item in socialList" :key="item" :label="item" :value="item" />
              </el-select>
              <el-button slot="append" icon="el-icon-delete" @click="handleRemoveSocial(index)" />
            </el-input>
            <span class="add-media" @click="handleAddSocial">+ add</span> -->
            <div v-else>
              <el-input v-for="(social,index) in userInfo.social" :key="social.name" v-model="social.value" placeholder="input address" class="input-with-select">
                <el-select slot="prepend" v-model="social.name" placeholder="select">
                  <el-option v-for="item in socialList" :key="item" :label="item" :value="item" />
                </el-select>
                <el-button slot="append" icon="el-icon-delete" @click="handleRemoveSocial(index)" />
              </el-input>
              <span class="add-media" @click="handleAddSocial">+ add</span>
            </div>
          </el-form-item>
        </div>
      </div>

      <div v-show="curTab==='wallet'" class="section-card">
        <div class="card-title">Total Balance</div>
        <div class="card-content">
          <div class="wallet-title">
            <div class="ratio">0.00 BTC = $ 0.00</div>
            <el-button class="btn-main" round @click="handleAddAddress">
              Add Address
            </el-button>
          </div>

          <div v-if="userInfo.wallet">
            <div v-for="wallet in userInfo.wallet" :key="wallet.key" class="wallet-card">
              <div class="card-tool">
                <svg class="icon icon-edit" aria-hidden="true" @click="handleEditAddress(wallet)">
                  <use xlink:href="#icon-edit" />
                </svg>
                <svg class="icon icon-delete" aria-hidden="true" @click="handleRemoveAddress(wallet)">
                  <use xlink:href="#icon-delete" />
                </svg>
              </div>

              <div class="wallet-img">
                <svg class="icon wallet" aria-hidden="true">
                  <use :xlink:href="'#icon-'+wallet.name" />
                </svg>
              </div>
              <div class="wallet-meta">
                <div class="wallet-name">
                  {{ getBalance(wallet.address) }}
                  {{ wallet.name.toUpperCase() }}
                  <span class="usage">{{ wallet.usage }}</span>
                </div>
                <div class="wallet-address">{{ wallet.address }}
                  <a :href="'https://etherscan.io/address/'+wallet.address" target="_blanck"><el-button class="btn-tag" plain round>view</el-button></a>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </el-form>

    <dialog-add-address ref="dialogWallet" @saveWallet="handleSaveWallet" />

    <reset-pwd-dialog ref="resetPwdDialog"></reset-pwd-dialog> 
  </div>
</template>

<script>
import DialogAddAddress from './dialog-add-update-address'
import ResetPwdDialog from './reset-passward-dialog'
import { mapGetters } from 'vuex'

export default {
  name: 'Profile',
  components: {
    DialogAddAddress,
    ResetPwdDialog
  },
  data() {
    return {
      socialList: ['twitter', 'facebook', 'instagram', 'youtube'],
      curTab: 'account',
      isInEdit: false,
      newSkill: '',
      isShowLogo: true
    }
  },
  computed: {
    ...mapGetters([
      'userInfo'
    ])
  },
  created() {
    if (!this.userInfo._id) {
      debugger
      this.$store.dispatch('user/getInfo').then(res => {
        console.log(res)
      })
    }
  },
  methods: {
    showChangePwdDialog() {
      this.$refs.resetPwdDialog.init(true);
    },
    getBalance(address) {
      return web3.eth.getBalance(address, (err, res) => {
        console.log(err, res)
      })
    },
    handleDeleteLogo() {
      this.isShowLogo = false
    },
    handleFileChange(file, fileList) {
      if (fileList.length === 1) {
        document.querySelector('.el-upload--picture-card').style.visibility = 'hidden'
      }
    },
    handleFileRemove(file) {
      console.log('remove')
      document.querySelector('.el-upload--picture-card').style.visibility = 'visible'
    },
    handleUploadSuccess(response, file, fileList) {
      this.userInfo.logo = response.url
    },
    handleAddSkill() {
      this.newSkill = this.newSkill.replace('/s', '')
      if (this.newSkill) {
        this.userInfo.skills.push(this.newSkill)
        this.newSkill = ''
      }
    },
    handleRemoveSkill(skill) {
      this.userInfo.skills.splice(this.userInfo.skills.indexOf(skill), 1)
    },
    handleAddSocial() {
      this.userInfo.social.push({
        name: '',
        value: ''
      })
    },
    handleRemoveSocial(index) {
      this.userInfo.social.splice(index, 1)
    },
    handleSave() {
      this.$store.dispatch('user/update', this.userInfo)
      this.isInEdit = false
      this.isShowLogo = true
    },
    handleAddAddress() {
      // show, isNew
      this.$refs.dialogWallet.init(true, true, null)
    },
    handleEditAddress(wallet) {
      this.$refs.dialogWallet.init(true, false, wallet)
    },
    handleRemoveAddress(wallet) {
      const newWallet = this.userInfo.wallet.filter(item => {
        return !(item.address === wallet.address && item.name === wallet.name && item.usage === wallet.usage)
      })

      this.userInfo.wallet = newWallet
      this.$store.dispatch('user/update', this.userInfo)
    },
    handleSaveWallet(wallet, isNew) {
      if (isNew) {
        let newWallet = []
        if (this.userInfo.wallet) {
          newWallet = [...this.userInfo.wallet, wallet]
        } else {
          newWallet = [wallet]
        }
        this.$store.dispatch('user/update', { wallet: newWallet })
      } else {
        const newWallet = this.userInfo.wallet.map(item => {
          if (item._id === wallet._id) {
            return wallet
          } else {
            return item
          }
        })
        this.$store.dispatch('user/update', { wallet: newWallet })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .profile {
    padding: 30px;
    .tab-row {
      margin-bottom: 20px;
      .title {
        display: inline-block;
        font-size: 24px;
        font-weight: 500;
        position: relative;
        top: 6px;
        margin-right: 30px;
      }
    }
    .forget {
      position: relative;
      top: 3px;
      font-size: 14px;
      color:#7B88FF;
      cursor: pointer
    }
    .add-media {
      cursor: pointer;
    }
    .wallet-title {
      display: flex;
      justify-content: space-between;
      margin-bottom: 30px;
      .ratio {
        font-size: 24px;
        font-weight: 500;
      }
    }
    .wallet-card {
      position: relative;
      display: flex;
      padding: 30px 0;
      border-top: 1px solid rgba(55, 64, 89, 0.1);
      .wallet-img {
        position: relative;
        margin-bottom: 20px;
        .icon.wallet {
          width: 4em;
          height: 4em;
        }
      }
      .wallet-meta {
        margin: 10px 0 0 20px;
        .wallet-name {
          font-weight: 500;
          font-size: 20px;
          margin-bottom: 10px;
          .usage {
            position: relative;
            left: 8px;
            top: -2px;
            font-size: 16px;
            color: rgba(55, 64, 89, 0.5);
          }
        }
        .wallet-address {
          font-size: 15px;
          color: rgba(55, 64, 89, 0.5);
          .btn-tag {
            position: relative;
            top: -8px;
            left: 6px;
          }
        }
      }
    }
  }
</style>
