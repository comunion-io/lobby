<template>
  <div v-loading="loading" class="organization-list">
    <div class="card-wrapper main-content">
      <el-card v-for="org in orgList" :key="org.id" class="box-card">
        <div slot="header" class="clearfix">
          <div class="section-org-info">
            <router-link :to="'/dao/info?id='+org._id">
              <div class="org-avatar" @click="handleClick(org._id)">
                <img v-if="org.logo" :src="org.logo?org.logo:'~@/assets/avatar.png'" alt="">
                <img v-else src="~@/assets/avatar.png" alt="">
              </div>
              <div class="org-name">{{ org.name }}</div>
            </router-link>
          </div>
        </div>
        <div class="org-desc">{{ org.description }}</div>
      </el-card>
      <el-card class="box-card fake" />
      <el-card class="box-card fake" />
      <el-card class="box-card fake" />
    </div>
  </div>
</template>

<script>
import { getOrgList } from '@/api/organization'
import { setCurOrgId } from '@/utils/auth'
export default {
  data() {
    return {
      orgList: [],
      query: '',
      isInEdit: false,
      isDialogAddVisible: false,
      searchEmail: '',
      loading: false
    }
  },
  created() {
    this.getOrgList()
  },
  methods: {
    getOrgList() {
      this.loading = true
      getOrgList().then(res => {
        if (!res.err && res.entities) {
          this.orgList = res.entities
        }
        this.loading = false
      })
    },
    handleClick(_id) {
      setCurOrgId(_id)
    }
  }
}
</script>

<style lang="scss" scoped>
  .organization-list {
    .main-content {
      padding: 0 40px;
    }
    .card-wrapper {
      padding-top: 80px;
      display: flex;
      flex-wrap: wrap;
      justify-content: space-around;
      .box-card {
        color: #374059;
        width: 364px;
        margin: 0 10px 30px 0;
        &.fake {
          visibility: hidden;
        }

        .section-org-info {
          text-align: center;
        }
        .org-avatar{
          width: 58px;
          height: 58px;
          margin: 0 auto;
          margin-bottom: 10px;
          img {
            width: 58px;
            height: 58px;
            border-radius: 50%;
          }
        }
        .org-desc {
          color: rgba(55, 64, 89, 0.7);
        }
      }
    }
  }

</style>
