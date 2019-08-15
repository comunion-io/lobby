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
        <user-card v-for="user in orgForm.members" :key="user._id" :user="user" :editible="true" @editUser="handleEditMember" @deleteUser="handleDeleteMember" />
        <el-card class="box-card fake" />
        <el-card class="box-card fake" />
      </div>
    </el-form>
    <div v-else class="no-member">
      Click Add Menber to add members
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

    <add-update-dialog ref="editDialog" :user="curUser" :visible="isDialogEditVisible" @saveUser="handleSaveMember" />
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
      console.log(123, this.orgForm._id)

      console.log('!')
      let id = ''
      if (this.$route.query.id) {
        id = this.$route.query.id
        setCurOrgId(id)
      } else {
        id = getCurOrgId()
      }
      console.log('id', id)
      if (id) {
        this.$store.dispatch('organization/getOrgInfo', id).then(res => {
          console.log(0, this.token, this.userInfo.orgs)

          if (this.token) {
            console.log(111)
            if (this.userInfo) {
              console.log(222)
              if (this.userInfo.orgs[0] && this.userInfo.orgs[0]._id === getCurOrgId()) {
                this.isOwner = true
              }
            } else {
              console.log(333)
              this.$store.dispatch('user/getInfo').then(res => {
                if (this.userInfo.orgs[0] && this.userInfo.orgs[0]._id === getCurOrgId()) {
                  this.isOwner = true
                }
              })
            }
          }
          console.log('isowner', this.isOwner)
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
        console.log(res)
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
        console.log(res)
        if (res === 'success') {
          this.isDialogAddVisible = false

          this.searchUser = null
        } else {
          this.$notify({
            message: res,
            type: 'warning'
          })
        }
      })
    },
    handleEditMember(user) {
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
    handleDeleteMember(email) {
      if (this.isOwner) {
        this.$store.dispatch('organization/deleteOrgMember', email).then(res => {
          console.log(res)
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

    handleSaveMember(user) {
      const data = {
        q: {
          _id: this.orgForm._id,
          'members.email': user.email
        },
        op: {
          role: user.role,
          description: user.description
        }
      }
      updateOrgMember(data).then(res => {
        console.log(123, data, res)

        this.$store.dispatch('organization/getOrgInfo', this.orgForm._id)
      })
    },
    handleClickAdd() {
      // this.$router.push('/team-manager/profile')
      if (this.isOwner) {
        this.isDialogAddVisible = true
      } else {
        this.$notify({
          message: 'Please log in to add member!',
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
