<template>
  <div class="navbar">
    <hamburger :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" />

    <div class="logo">
      <img src="~@/assets/logo.png" alt="">
    </div>
    <breadcrumb class="breadcrumb-container" />

    <div class="right-menu">
      <el-dropdown class="avatar-container" trigger="click">
        <div class="avatar-wrapper">
          <!--          <img :src="avatar+'?imageView2/1/w/80/h/80'" class="user-avatar">-->
          <!-- <img v-if="token" src="~@/assets/avatar.png?imageView2/1/w/80/h/80" class="user-avatar"> -->
          <img v-if="userInfo._id&&userInfo.logo" :src="userInfo.logo?userInfo.logo:'~@/assets/avatar.png'" class="user-avatar">
          <img v-if="userInfo._id&&!userInfo.logo" src="~@/assets/avatar.png" class="user-avatar">
          <img v-if="!(userInfo._id)" src="~@/assets/avatar.png" class="user-avatar">
          <i class="el-icon-caret-bottom" />
        </div>
        <el-dropdown-menu slot="dropdown" class="user-dropdown">
          <template v-if="!(userInfo._id)">
            <el-dropdown-item @click.native="isDialogVisible=true;curType='login'">
              Please Log in First
            </el-dropdown-item>
            <el-dropdown-item @click.native="isDialogVisible=true;curType='register'">
              Register
            </el-dropdown-item>
          </template>
          <template v-else>
            <router-link to="/dao/profile">
              <el-dropdown-item>
                Profile
              </el-dropdown-item>
            </router-link>

            <el-dropdown-item divided>
              <span style="display:block;" @click="logout">Log Out</span>
            </el-dropdown-item>
          </template>
        </el-dropdown-menu>
      </el-dropdown>
    </div>

    <router-link to="/home">
      <el-button class="btn-main new-dao-btn" round>
        New Dao
      </el-button>
    </router-link>

    <el-dialog
      :title="type[curType]"
      :visible.sync="isDialogVisible"
      width="500px"
    >
      <el-form v-show="curType==='login'" ref="loginForm" :model="loginForm">
        <el-form-item label="Email">
          <el-input v-model="loginForm.email" placeholder="Please input your email" />
        </el-form-item>
        <el-form-item label="Password">
          <el-input v-model="loginForm.password" type="password" placeholder="Please input your password" />
        </el-form-item>
      </el-form>

      <el-form v-show="curType==='register'||curType==='reset'" ref="registerForm" :model="registerForm">
        <el-form-item label="Email">
          <el-input v-model="registerForm.email" placeholder="Please input your email" />
        </el-form-item>
        <el-form-item label="Code" class="code">

          <el-input v-model="registerForm._vCode" placeholder="Please input verification code" />
          <el-button type="primary btn-main" round @click="handleSendCode">Send Verificatiob Code</el-button>

        </el-form-item>
        <el-form-item label="Password">
          <el-input v-model="registerForm.password" type="password" placeholder="Please input your password" />
        </el-form-item>
      </el-form>

      <div v-show="curType==='login'" slot="footer" class="dialog-footer">
        <span class="forget" @click="curType='reset'">forget password</span>
        <el-button type="primary btn-main" round @click="handleLogin">Log in</el-button>
      </div>
      <div v-show="curType==='register'" slot="footer" class="dialog-footer">
        <el-button type="primary btn-main" round @click="handleRegister">Register</el-button>
      </div>
      <div v-show="curType==='reset'" slot="footer" class="dialog-footer">
        <el-button type="primary btn-main" round @click="handleResetPwd">Reset Password</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import { userRegister, sendVeriCode, resetPwd } from '@/api/user'
import { getOrgStatus } from '@/api/organization'

export default {
  components: {
    Breadcrumb,
    Hamburger
  },
  data() {
    return {
      loginForm: {
        email: '',
        password: ''
      },
      registerForm: {
        email: '',
        password: '',
        _cCode: '',
        _vCode: '',
        username: ''
      },
      isDialogVisible: false,
      type: {
        login: 'Please Login',
        register: 'Please Register',
        reset: 'Reset Password'
      },
      curType: 'login'
    }
  },
  computed: {
    ...mapGetters([
      'token',
      'sidebar',
      'userInfo'
    ])
  },
  created() {
    if (this.token && !this.userInfo._id) {
      this.$store.dispatch('user/getInfo')
    }
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    async logout() {
      await this.$store.dispatch('user/logout')
      // this.$router.push(`/login?redirect=${this.$route.fullPath}`)
    },
    handleLogin() {
      this.$store.dispatch('user/login', this.loginForm).then(data => {
        if (!data.err) {
          this.isDialogVisible = false

          const theOrg = this.userInfo.orgs.filter(org => {
            return org.role === 'owner'
          })

          console.log('current user\'s organization:', theOrg)
          theOrg.length > 0 && getOrgStatus(theOrg[0]._id).then(res => {
            if (res.err) {
              this.$notify({
                message: res.msg,
                type: 'warning'
              })
            } else if (res.status) {
              if (res.status === 0) {
                this.$notify({
                  message: 'Your organization creation hasn\'t success yet.',
                  type: 'warning'
                })
              } else if (res.status === -1) {
                this.$notify({
                  message: 'Your previous organization creation failed.',
                  type: 'warning'
                })
              } else if (res.status === 1) {
                this.$notify({
                  message: 'You have successfully created an organization previously!',
                  type: 'warning'
                })
              }
            }
          })

          this.$router.push('/dao/profile')
        } else {
          this.$notify({
            message: data.msg,
            type: 'warning'
          })
        }
      })
    },
    handleRegister() {
      const index = this.registerForm.email.indexOf('@')
      if (index !== -1) {
        this.registerForm.username = this.registerForm.email.substr(0, index)
      } else {
        this.$notify({
          message: 'Please input corrent email!',
          type: 'warning'
        })
      }

      userRegister(this.registerForm).then(res => {
        if (!res.err) {
          // this.orgList = res.entities
          this.$notify({
            message: 'register success',
            type: 'success'
          })
          this.isDialogVisible = false
        } else {
          this.$notify({
            message: res.msg,
            type: 'warning'
          })
        }
      })
    },
    handleResetPwd() {
      resetPwd(this.registerForm).then(res => {
        if (!res.err) {
          this.$notify({
            message: 'reset password success!',
            type: 'success'
          })
          this.isDialogVisible = false
        } else {
          this.$notify({
            message: res.msg,
            type: 'warning'
          })
        }
      })
    },
    handleSendCode() {
      sendVeriCode({ email: this.registerForm.email }).then(res => {
        this.registerForm._cCode = res.cCode
      })
    }
  }
}
</script>

<style lang="scss">
.navbar {
  height: 80px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0,21,41,.08);
  padding-top: 20px;

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background .3s;
    -webkit-tap-highlight-color:transparent;

    &:hover {
      background: rgba(0, 0, 0, .025)
    }
  }
  .logo {
    float: left;
    position: relative;
    top: 10px;
    margin: 0 20px;
  }
  .breadcrumb-container {
    float: left;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background .3s;

        &:hover {
          background: rgba(0, 0, 0, .025)
        }
      }
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        margin-top: 5px;
        position: relative;

        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
  .new-dao-btn {
    float: right;
    margin: 4px 20px 0 0;
  }
  .dialog-footer {
    height: 40px;
    .forget {
      position: relative;
      top: 3px;
      font-size: 14px;
      color:#7B88FF;
      cursor: pointer
    }
  }
  .el-form-item {
    margin-bottom: 0;
  }
  .code {
    .el-form-item__label {
      float: none;
    }
    .el-input {
      width: 228px;
    }
  }
}
</style>
