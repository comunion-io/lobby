<template>
  <div class="team-manager">
    <div class="search-row">
      <el-button class="btn-main" round @click="handleClickAdd">
        Add Member
      </el-button>
      <!-- <el-input v-model="query" placeholder="Enter a member's email address or wallet address to search for members" class="input-with-select">
        <el-button slot="prepend" icon="el-icon-search" />
      </el-input> -->
    </div>

    <el-form v-if="orgForm.members.length > 0" ref="form">
      <div class="card-wrapper">
        <user-card v-for="user in orgForm.members" :key="user._id" :user="user" :editible="true" @clickEdit="handleClickEdiit" @clickDelete="handleClickDelete" />
        <el-card class="box-card fake" />
        <el-card class="box-card fake" />
      </div>
    </el-form>
    <div v-else class="no-member">
      Click Add Member to add members
    </div>

    <el-dialog
      ref="addDialog"
      title="Add Members"
      :visible.sync="isDialogAddVisible"
      width="520px"
      :before-close="handleClose"
    >
      <div>
        <el-input
          v-model="searchEmail"
          class="search-email-input"
          placeholder="Enter a member's email address"
          prefix-icon="el-icon-search"
        />
        <el-button type="primary btn-main" round @click="handleSearchUser">Search</el-button>
      </div>
      <div v-show="!isUserExist" class="no-tip">Can't find user {{ searchEmail }}</div>
      <div v-if="searchUser" class="search-result">
        <user-card :user="searchUser" :editible="false" />
        <el-button type="primary btn-main btn-wide" round @click="handleAddMember">Add</el-button>
      </div>
    </el-dialog>

    <add-update-dialog ref="editDialog" :user="curUser" :visible="isDialogEditVisible" @saveUser="handleUpdateMember" />
  </div>
</template>

<script>
import { getUserInfoByEmail } from '@/api/user'
import { mapGetters } from 'vuex'
import AddUpdateDialog from './dialog-update'
import UserCard from '@/components/UserCard'
import { getCurOrgId, setCurOrgId } from '@/utils/auth'
import { updateOrgMember } from '@/api/organization'
export default {
  components: { AddUpdateDialog, UserCard },
  data() {
    return {
      isOwner: false,
      isUserExist: true,
      searchEmail: '',
      searchUser: null,
      isDialogEditVisible: false,
      isDialogAddVisible: false,

      curUser: null
    }
  },
  computed: {
    ...mapGetters([
      'token',
      'userInfo',
      'orgForm'
    ])
  },
  created() {
    this.getOrgInfo()
  },
  methods: {
    getOrgInfo() {
      let id = ''
      if (this.$route.query.id) {
        id = this.$route.query.id
        setCurOrgId(id)
      } else {
        id = getCurOrgId()
      }
      if (id) {
        this.$store.dispatch('organization/getOrgInfo', id).then(res => {
          if (this.token) {
            if (this.userInfo) {
              if (this.userInfo.orgs[0] && this.userInfo.orgs[0]._id === getCurOrgId()) {
                this.isOwner = true
              }
            } else {
              this.$store.dispatch('user/getInfo').then(res => {
                if (this.userInfo.orgs[0] && this.userInfo.orgs[0]._id === getCurOrgId()) {
                  this.isOwner = true
                }
              })
            }
          }
        })
      } else {
        this.$notify({
          message: 'Please select an organization to continue!',
          type: 'warning'
        })
      }
    },
    handleSearchUser() {
      // this.isDialogAddVisible = false
      getUserInfoByEmail(this.searchEmail).then(res => {
        if (res.entity) {
          this.searchEmail = ''
          this.searchUser = res.entity
          this.isUserExist = true
        } else {
          this.isUserExist = false
        }
      })
    },
    handleAddMember() {
      const member = {
        _id: this.searchUser._id,
        email: this.searchUser.email
      }
      this.$store.dispatch('organization/addOrgMember', member).then(res => {
        if (res === 'success') {
          this.isDialogAddVisible = false
          this.searchUser = null
          this.$store.dispatch('organization/getOrgInfo', this.orgForm._id)
        } else {
          this.$notify({
            message: res,
            type: 'warning'
          })
        }
      })
    },
    handleClickEdiit(user) {
      if (this.isOwner) {
        this.isDialogEditVisible = true
        this.$refs.editDialog.init(user)
      } else {
        this.$notify({
          message: 'Please log in to edit member!',
          type: 'warning'
        })
      }
    },
    handleClickDelete(email) {
      if (this.isOwner) {
        this.$store.dispatch('organization/deleteOrgMember', email).then(res => {
        // if (res === 'success') {
        //   this.isDialogAddVisible = false
        // } else {
        //   this.$notify({
        //     message: res,
        //     type: 'warning'
        //   })
        // }
        })
      } else {
        this.$notify({
          message: 'Please log in to delete member!',
          type: 'warning'
        })
      }
    },

    handleUpdateMember(user) {
      const data = {
        q: {
          _id: this.orgForm._id,
          'members.email': user.email
        },
        op: {
          'members.$.role': user.role,
          'members.$.description': user.description
        }
      }
      updateOrgMember(data).then(res => {
        this.$store.dispatch('organization/getOrgInfo', this.orgForm._id)
      })
    },
    handleClickAdd() {
      // this.$router.push('/team-manager/profile')
      if (this.isOwner) {
        this.isDialogAddVisible = true
      } else {
        this.$notify({
          message: 'Make sure you are the creator of this organization and have logged in!',
          type: 'warning'
        })
      }
    },
    handleClose() {
      this.isDialogAddVisible = false
      this.searchEmail = ''
      this.searchUser = null
      this.isUserExist = true
    }
  }
}
</script>

<style lang="scss">
  .team-manager {
    padding: 30px;
    .search-row {
      display: flex;
      justify-content: space-between;
      margin-bottom: 30px;
      .input-with-select {
        width: 40%;
      }
    }
    .card-wrapper {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-around;
      .box-card.fake {
        visibility: hidden;
      }
    }

    .search-email-input {
      width: 74%;
      margin-right: 20px;
    }

    .no-member {
      text-align: center;
      color: #45588C;
      margin-top: calc(20%);
    }
    .no-tip {
      margin-top: 20px;
    }
    .search-result {
      margin-top: 20px;
      /deep/ .box-card {
        margin: 30px auto 10px auto;
      }
      .btn-main {
        position: relative;
        left: calc(50% - 170px);
        margin-top: 20px;
      }
    }
  }

</style>
