<template>
  <el-dialog
    class="reset-pwd-dialog"
    title="Reset Password"
    :visible.sync="show"
    width="500px"
    :close-on-click-modal="false"
  >
    <el-form ref="resetPwdForm" :model="resetPwdForm" :rules="resetRules">
      <el-form-item label="Email" prop="email">
        <el-input v-model="resetPwdForm.email" placeholder="Please input your email" />
      </el-form-item>
      <el-form-item label="Code" prop="_vCode" class="code">
        <el-input v-model="resetPwdForm._vCode" placeholder="Please input verification code" />
        <el-button v-if="countdown===0" type="primary btn-main" round @click="handleSendCode">Send Verification Code</el-button>
        <el-button v-else class="btn-main disable countdown-btn" round>{{ countdown }}s</el-button>
      </el-form-item>
      <el-form-item label="Password" prop="password">
        <el-input v-model="resetPwdForm.password" type="password" placeholder="Please input your password" />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary btn-main" round @click="handleResetPwd">Reset Password</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { sendVeriCode, resetPwd } from '@/api/user'

export default {
  name: 'ResetPwdDialog',
  data() {
    const checkPwd = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('please input password'))
      }
      setTimeout(() => {
        if (value.length < 6) {
          callback(new Error('password must have at least 6 charactors'))
        } else if (value.length > 24) {
          callback(new Error('password must not exceed 24 charactors'))
        } else {
          callback()
        }
      })
    }
    return {
      resetPwdForm: {
        _vCode: '',
        email: '',
        passward: ''
      },
      countdown: 0,
      show: false,
      resetRules: {
        email: [
          { required: true, message: 'please input email', trigger: 'blur' }
        ],
        _vCode: [
          { required: true, message: 'please input verification code', trigger: 'blur' }
        ],
        password: [
          { required: true, validator: checkPwd, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    init(show) {
      this.show = show
      this.resetPwdForm = {
        _vCode: '',
        email: '',
        passward: ''
      }
    },
    handleResetPwd() {
      this.$refs.resetPwdForm.validate(valid => {
        if (valid) {
          resetPwd(this.resetPwdForm).then(res => {
            if (!res.err) {
              this.$notify({
                message: 'reset password success!',
                type: 'success'
              })
              this.show = false
            } else {
              this.$notify({
                message: res.msg,
                type: 'warning'
              })
            }
          })
        }
      })
    },
    handleSendCode() {
      if (this.countdown === 0) {
        this.$refs.resetPwdForm.validateField('email', err => {
          if (!err) {
            sendVeriCode({ email: this.resetPwdForm.email }).then(res => {
              this.resetPwdForm._cCode = res.cCode
            })

            this.countdown = 60
            const countdownTimer = setInterval(() => {
              if (this.countdown > 0) {
                this.countdown--
              }

              if (this.countdown === 0) {
                clearInterval(countdownTimer)
              }
            }, 1000)
            this.$once('hook:beforeDestroy', () => {
              clearInterval(countdownTimer)
            })
          }
        })
      }
    }
  }

}
</script>

<style lang="scss">
.reset-pwd-dialog {
  .code {
    .el-form-item__label {
      float: none;
    }
    .el-input {
      width: 228px;
    }
  }
  .el-form-item {
    margin-bottom: 10px;
  }
  .countdown-btn {
    width: 150px;
    cursor: default;
  }
  .dialog-footer {
    height: 40px;
  }
}
</style>
