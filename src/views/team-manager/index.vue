<template>
  <div class="team-manager">
    <div class="search-row">
      <el-button v-if="isOwner" class="btn-main" round @click="handleClickAdd">Add Member</el-button>
    </div>

    <el-form v-if="orgForm.members.length > 0" ref="form">
      <div class="card-wrapper">
        <user-card
          v-for="user in orgForm.members"
          :key="user.userId"
          :user="user"
          :editible="isOwner"
          @clickEdit="handleClickEdit"
          @clickDelete="handleClickDelete"
        />
        <el-card class="box-card fake" />
        <el-card class="box-card fake" />
      </div>
    </el-form>
    <div
      v-else
      class="no-member"
    >{{isOwner ? 'Click Add Member to add members' : 'Do you want to be the first member?'}}</div>

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
          @input="isUserExist=true"
        />
        <el-button type="primary btn-main" round @click="handleSearchUser">Search</el-button>
      </div>
      <div v-show="!isUserExist" class="no-tip">Can't find user {{ searchEmail }}</div>
      <div v-if="searchUser" class="search-result">
        <user-card :user="searchUser" :editible="false" />
        <el-button type="primary btn-main btn-wide" round @click="handleAddMember">Add</el-button>
      </div>
    </el-dialog>

    <add-update-dialog
      ref="editDialog"
      :user="curUser"
      :visible="isDialogEditVisible"
      @saveUser="handleUpdateMember"
      @saveUserToChain="handleEditMember"
    />

    <!-- add member -->
    <el-dialog ref="addDialogMM" title="Add Member" :visible.sync="showMMAddMember" width="666px">
      <MetaMaskTrans
        actionName="add the member"
        successText="You have added the member"
        actionType="SetMemberData"
        :getDeployData="getDeployDataAddMember"
        :dbData="dbDataAddMember"
        @transSuccess="handleSuccessAddMember"
        :transTo="orgForm.contract"
      ></MetaMaskTrans>
    </el-dialog>

    <!-- edit member  -->
    <el-dialog
      ref="editDialogMM"
      title="Edit Member"
      :visible.sync="showMMRemoveMember"
      width="666px"
    >
      <MetaMaskTrans
        actionName="edit the member"
        successText="You have edited the member"
        actionType="SetMemberData"
        :getDeployData="getDeployDataEditMember"
        :dbData="dbDataEditMember"
        @transSuccess="handleSuccessEditMember"
        :transTo="orgForm.contract"
      ></MetaMaskTrans>
    </el-dialog>

    <!-- remove member -->
    <el-dialog
      ref="removeDialogMM"
      title="Remove Member"
      :visible.sync="showMMRemoveMember"
      width="666px"
    >
      <MetaMaskTrans
        actionName="remove the member"
        successText="You have removed the member"
        actionType="RemoveMemberData"
        :getDeployData="getDeployDataRemoveMember"
        :dbData="dbDataRemoveMember"
        @transSuccess="handleSuccessRemoveMember"
        :transTo="orgForm.contract"
      ></MetaMaskTrans>
    </el-dialog>
  </div>
</template>

<script>
import { getUserInfoByEmail } from '@/api/user'
import { mapGetters } from 'vuex'
import AddUpdateDialog from './dialog-update'
import UserCard from '@/components/UserCard'
import { getCurOrgId, setCurOrgId } from '@/utils/auth'
import { updateOrgMember } from '@/api/organization'
import GetInfo from '@/mixins/GetInfo'
import DaoInstall from '@/mixins/DaoInstall'
import MetaMaskTrans from '@/components/Common/MetaMaskTrans'
import { Organization } from 'comunion-dao'

export default {
  components: { AddUpdateDialog, UserCard, MetaMaskTrans },
  mixins: [GetInfo, DaoInstall],
  data() {
    return {
      isUserExist: true,
      searchEmail: 'heyiqing6@sina.com',
      searchUser: null,
      isDialogEditVisible: false,
      isDialogAddVisible: false,
      curUser: null,

      // add
      dbDataAddMember: {},
      showMMAddMember: false,

      // edit
      dbDataEditMember: {},
      showMMEditMember: false,

      // remove
      dbDataRemoveMember: {},
      showMMRemoveMember: false,

      // common
      daos: null,
      daosAddress: '0x7284C823ea3AD29bEDfd09Ede1107981E9519896',
      org: null
    }
  },
  computed: {
    ...mapGetters(['userInfo', 'orgForm'])
  },
  created() {},
  watch: {
    'orgForm.contract': {
      handler: function(val) {
        if (val && this.ethUtils) {
          this.org = new Organization(this.ethUtils, val)
        }
      }
    }
  },
  methods: {
    getUserAddr(user) {
      return user.wallet[0].address.toLowerCase()
    },
    // add member
    handleClickAdd() {
      if (this.isOwner) {
        this.isDialogAddVisible = true
      } else {
        this.$notify({
          message:
            'Make sure you are the creator of this organization and have logged in!',
          type: 'warning'
        })
      }
    },
    handleClose() {
      this.isDialogAddVisible = false
      this.searchEmail = ''
      this.searchUser = null
      this.isUserExist = true
    },
    handleSearchUser() {
      getUserInfoByEmail(this.searchEmail).then(res => {
        if (res.entity) {
          this.searchEmail = ''
          this.searchUser = res.entity
          this.isUserExist = true
        } else {
          this.searchUser = null
          this.isUserExist = false
        }
      })
    },
    handleAddMember() {
      this.dbDataAddMember = {
        userId: this.searchUser._id,
        email: this.searchUser.email
      }
      this.showMMAddMember = true
    },
    handleSuccessAddMember() {
      this.isDialogAddVisible = false
      this.showMMAddMember = false
    },
    async getDeployDataAddMember() {
      let defaultRole = 'member'
      try {
        if (!this.org) {
          this.org = new Organization(this.ethUtils, this.orgForm.contract)
        }
        // role 字符串长度不能超过32字节
        let roleTrans = this.ethUtils.web3.utils.fromUtf8(defaultRole)
        // members 与 roles 按顺序一一对应
        let members = [this.getUserAddr(this.searchUser)]
        let roles = [roleTrans]
        let deployData = await this.org.genAddOrUpdateMembersData(
          members,
          roles
        )
        return Promise.resolve(deployData)
      } catch (err) {
        return Promise.reject(err)
      }
    },

    // edit member
    handleClickEdit(user) {
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
    handleEditMember(user) {
      this.dbDataEditMember = {
        userId: user.userId,
        email: user.email,
        description: user.description,
        role: user.role, // temporary save
        address: user.address // temporary save
      }
      this.showMMEditMember = true
    },
    handleSuccessEditMember() {
      this.isDialogEditVisible = false
      this.showMMEditMember = false
    },
    async getDeployDataEditMember() {
      try {
        if (!this.org) {
          this.org = new Organization(this.ethUtils, this.orgForm.contract)
        }
        // role 字符串长度不能超过32字节
        let roleTrans = this.ethUtils.web3.utils.fromUtf8(
          this.dbDataEditMember.role
        )
        // members 与 roles 按顺序一一对应
        let members = [this.dbDataEditMember.address]
        let roles = [roleTrans]
        let deployData = await this.org.genAddOrUpdateMembersData(
          members,
          roles
        )
        // delete useless attr
        delete this.dbDataEditMember.address
        delete this.dbDataEditMember.role

        return Promise.resolve(deployData)
      } catch (err) {
        console.log('deploy err', err)
        return Promise.reject(err)
      }
    },

    // remove member
    handleSuccessRemoveMember() {
      this.showMMRemoveMember = false
    },
    async getDeployDataRemoveMember() {
      try {
        if (!this.org) {
          this.org = new Organization(this.ethUtils, this.orgForm.contract)
        }
        const members = [this.dbDataRemoveMember.address]
        const removeMembersData = await this.org.genRemoveMembersData(members)
        // delete useless attr
        delete this.dbDataRemoveMember.address
        return Promise.resolve(removeMembersData)
      } catch (err) {
        console.log('deploy err', err)
        return Promise.reject(err)
      }
    },
    handleClickDelete(user) {
      this.dbDataRemoveMember = {
        userId: user.userId,
        email: user.email,
        role: user.role,
        address: user.address // temporary save
      }
      this.showMMRemoveMember = true
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
    color: #45588c;
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
