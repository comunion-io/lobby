<template>
  <div class="finance">
    <h1>finance</h1>
  </div>
</template>

<script>
import { getUserInfoByEmail } from '@/api/user'
import { mapGetters } from 'vuex'
import UserCard from '@/components/UserCard'
import { getCurOrgId, setCurOrgId } from '@/utils/auth'
import { updateOrgMember } from '@/api/organization'
export default {
  components: { UserCard },
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
  .finance {
    list-style: none;
  }

</style>
