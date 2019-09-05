<template>
  <div class="organization">
    <div class="inner-content">
      <div class="welcome" />
      <div class="intro">Comunion is a decentralized autonomous organization collaboation network, helps companies, organization and individuals all around the world to create, manage and operate their own decentralized autonomous organization (The DAO).
        <a href="https://comunion.io/" target="_blank" class="blue learn-more">Learn more about Comunion</a>
      </div>
      <div class="tip" />
      <!-- You can create a new decentralized organization. -->
      <router-link to="/create">
        <el-button class="btn-main btn-wide" round>Create a  new  decentralized organization</el-button>
      </router-link>
      <div class="tip"><a href="https://bbs.comunion.io/" target="_blank">How to create</a></div>

      <div class="tip bold">Retrieve an existing organization</div>

      <div class="section-card">
        <div class="card-content">
          <el-form ref="form" :model="orgForm">
            <el-form-item label="" prop="name" label-width="0">
              <el-input v-model="orgForm.name" placeholder="Organization name" class="org-name-input" />
            </el-form-item>
            <div class="org-name-check">
              <span v-if="isOrgNameInCheck" class="check" />
              <span v-else>
                <!-- <svg v-show="orgForm.name && !isOrgNameInCheck && !isOrgNameExist" class="icon" aria-hidden="true" @click="handleDelOrgName">
                  <use xlink:href="#icon-minus" />
                </svg> -->
                <svg v-show="orgForm.name && !isOrgNameInCheck && isOrgNameExist" class="icon" aria-hidden="true">
                  <use xlink:href="#icon-check" />
                </svg>
              </span>
            </div>

            <div v-if="orgForm.name && orgForm.name.replace(/(^\s*)|(\s*$)/g, '')">
              <div v-show="!isOrgNameInCheck && isOrgNameExist" class="tip">Organization name exists. You can open it</div>
              <div v-show="!isOrgNameInCheck && !isOrgNameExist" class="tip error">Organization name doesn't exist. You can create a new decentralized organization.</div>
            </div>
            <el-button :class="['btn-main', 'btn-wide', isOrgNameExist ? '' : 'disable']" round @click="openOrg">Open</el-button>
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { checkOrgName } from '@/api/organization'
import _ from 'lodash'
export default {
  name: 'HowTo',
  data() {
    return {
      orgForm: {
        _id: '',
        name: ''
      },
      isOrgNameInCheck: false,
      isOrgNameExist: false
    }
  },
  watch: {
    'orgForm.name': function(newVal, oldVal) {
      const name = newVal.replace(/(^\s*)|(\s*$)/g, '')

      if (name.length === 0) {
        this.isOrgNameInCheck = false
        this.isOrgNameExist = false
      }
      if (name.length > 0 && name !== oldVal.replace(/(^\s*)|(\s*$)/g, '')) {
        this.isOrgNameInCheck = true
        this.debouncedCheckOrgName()
      }
    }
  },
  created() {
    this.debouncedCheckOrgName = _.debounce(this.checkOrgName, 500)
  },
  methods: {
    checkOrgName() {
      const name = this.orgForm.name.replace(/(^\s*)|(\s*$)/g, '')
      if (name.length > 0) {
        this.isOrgNameInCheck = true
        checkOrgName(name).then(res => {
          if (res.entity) {
            this.isOrgNameExist = true
            this.orgForm._id = res.entity._id
          } else {
            this.isOrgNameExist = false
          }
          this.isOrgNameInCheck = false
        })
      } else {
        this.isOrgNameExist = false
        this.isOrgNameInCheck = false
      }
    },
    openOrg() {
      if (this.isOrgNameExist) {
        this.$router.push(`/dao/info?id=${this.orgForm._id}`)
      }
    }
    // handleDelOrgName() {
    //   this.isOrgNameInCheck = false
    //   this.orgForm.name = ''
    // }
  }
}
</script>

<style lang="scss" scoped>
.inner-content {
  .welcome {
    width: 100%;
    height: 160px;
    background-image: url(~@/assets/welcome.png);
    background-size: cover;
  }
  .section-card {
    margin-top: -30px;
  }
  .learn-more {
    text-decoration: underline;
  }
  .intro {
    margin-top: 38px;
    text-align: left;
  }
  .blue {
    color: #7B88FF;
  }
  .tip.bold {
    color: rgba(55, 64, 89, 0.85);
    font-size: 14px;
    font-weight: 500;
  }
}
</style>
