<template>
  <el-dialog
    class="edit-user-dialog"
    title="Edit Memberships"
    :visible.sync="dialogVisible"
    width="600px"
  >
    <el-form ref="form" class="box-card">

      <el-form-item label="Profile Photo">
        <div class="user-avatar"><img src="~@/assets/avatar.png" alt=""></div>
      </el-form-item>
      <el-form-item label="Email">
        <div class="el-input fake">{{ user?user.email:'' }}</div>
      </el-form-item>
      <el-form-item label="Wallet Address">
        <div v-for="wallet in user.wallet" :key="wallet.name" class="el-input fake">
          {{ wallet.name?wallet.name.toUpperCase():'' }}  {{ wallet.address }}
        </div>
      </el-form-item>

      <el-form-item label="Social Media">
        <div class="socials el-input fake">
          <ul v-show="user&&user.social&&user.social.length>0">
            <li v-for="social in user.social" :key="social.name">
              <svg class="icon" aria-hidden="true">
                <use :xlink:href="'#icon-'+social.name" />
              </svg>
            </li>
          </ul>
        </div>
      </el-form-item>

      <el-form-item label="Role">
        <el-input v-model="user.role" placeholder="Role" />
      </el-form-item>
      <el-form-item label="Description">
        <el-input v-model="user.description" type="textarea" placeholder="Within 200 characters" />
      </el-form-item>

    </el-form>

    <span slot="footer" class="dialog-footer">
      <el-button class="btn-main" round @click="handleSaveUser">Save</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  props: {
    'visible': Boolean
  },
  data() {
    return {
      user: {
        name: '',
        email: '',
        wallet: '',
        socials: '',
        role: '',
        description: ''
      },
      dialogVisible: false
    }
  },
  methods: {
    init(user) {
      this.dialogVisible = this.visible
      this.user = user
    },
    handleSaveUser() {
      this.dialogVisible = false
      this.$emit('saveUser', this.user)
    }
  }

}
</script>

<style lang="scss">
.edit-user-dialog {
  .box-card {
    width: 100%;
    .user-avatar {
      margin-bottom: 20px;
    }
  }
  .el-dialog__footer {
    margin-top: -40px;
  }
}
</style>
