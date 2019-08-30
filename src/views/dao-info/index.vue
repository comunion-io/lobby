<template>
  <div class="dao-info-container">
    <!--    <div class="dashboard-text">name: {{ name }}</div>-->
    <el-form ref="orgForm" :model="orgForm">

      <div class="section-card">
        <div class="card-title">Organization Info</div>
        <div class="card-content">
          <el-form-item label="Name">
            <div class="el-input fake">{{ orgForm.name }}</div>
          </el-form-item>
          <el-form-item label="Type">
            <div class="el-input fake">{{ orgForm.type }}</div>
          </el-form-item>
          <el-form-item label="Net">
            <div class="el-input fake">Ethereum Mainnet</div>
          </el-form-item>
          <!-- <el-form-item label="Contract">
            <div class="el-input fake">
              <el-button class="btn-link" plain round>
                <svg class="icon" aria-hidden="true" style="width:1em;height:1em">
                  <use xlink:href="#icon-link" />
                </svg>
                {{ orgForm.wallet?(orgForm.wallet[0]?orgForm.wallet[0].value:''):'' }}
              </el-button>
            </div>
          </el-form-item> -->
        </div>
      </div>

      <div class="section-card">
        <div class="card-tool">
          <svg v-if="!isAboutInEdit" class="icon" aria-hidden="true" @click="handleClickEdit('isAboutInEdit')">
            <use xlink:href="#icon-edit" />
          </svg>
          <svg v-else class="icon" aria-hidden="true" @click="handleUpdate('about')">
            <use xlink:href="#icon-check" />
          </svg>
        </div>
        <div class="card-title">About</div>
        <div class="card-content">
          <el-form-item label="Mission">
            <div v-if="!isAboutInEdit" class="el-input fake">{{ orgForm.mission }}</div>
            <el-input v-else v-model="orgForm.mission" />
          </el-form-item>
          <el-form-item label="Vision">
            <div v-if="!isAboutInEdit" class="el-input fake">{{ orgForm.vision }}</div>
            <el-input v-else v-model="orgForm.vision" />
          </el-form-item>
          <el-form-item label="Desccription">
            <div v-if="!isAboutInEdit" class="el-input fake textarea">{{ orgForm.description }}</div>
            <el-input v-else v-model="orgForm.description" type="textarea" maxlength="200" />
          </el-form-item>
        </div>
      </div>

      <div class="section-card">
        <div class="card-tool">
          <svg v-if="!isContactInEdit" class="icon" aria-hidden="true" @click="handleClickEdit('isContactInEdit')">
            <use xlink:href="#icon-edit" />
          </svg>
          <svg v-else class="icon" aria-hidden="true" @click="handleUpdate('contact')">
            <use xlink:href="#icon-check" />
          </svg>
        </div>
        <div class="card-title">Contact</div>
        <div class="card-content">
          <el-form-item label="Office Website">
            <div v-if="!isContactInEdit" class="el-input fake">
              <a :href="'http://'+orgForm.website" target="_blank">
                <el-button class="btn-link" plain round>
                  <svg class="icon" aria-hidden="true" style="width:1em;height:1em">
                    <use xlink:href="#icon-link" />
                  </svg>
                  {{ orgForm.website }}
                </el-button>
              </a>
            </div>
            <el-input v-else v-model="orgForm.website" />
          </el-form-item>
          <el-form-item label="Social Media">
            <!-- <div class="socials el-input fake">
              <ul>
                <li v-for="(social,index) in orgForm.social" :key="social.name">
                  <a :href="social.value" target="_blank">
                    <svg class="icon" aria-hidden="true">
                      <use :xlink:href="'#icon-'+social.name" />
                    </svg>
                    <svg v-show="isContactInEdit" class="icon remove" aria-hidden="true" @click="removeSocial(index)">
                      <use xlink:href="#icon-remove" />
                    </svg>
                  </a>
                </li>
                <li v-show="isContactInEdit">
                  <svg class="icon" aria-hidden="true">
                    <use xlink:href="#icon-add" />
                  </svg>
                </li>
              </ul>
            </div> -->
            <div v-if="!isContactInEdit" class="socials el-input fake">
              <ul>
                <li v-for="social in orgForm.social" :key="social.name">
                  <a :href="social.value" target="_blank">
                    <svg class="icon" aria-hidden="true">
                      <use :xlink:href="'#icon-'+social.name" />
                    </svg>
                  </a>
                </li>
              </ul>
            </div>
            <div v-else>
              <el-input v-for="(social,index) in orgForm.social" :key="social.name" v-model="social.value" placeholder="input address" class="input-with-select">
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
    </el-form>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { updateOrgInfo } from '@/api/organization'
import { getCurOrgId, setCurOrgId } from '@/utils/auth'

export default {
  name: 'Dashboard',
  data() {
    return {
      isOwner: false,
      isAboutInEdit: false,
      isContactInEdit: false,
      socialList: ['twitter', 'facebook', 'instagram', 'youtube'],
      newSocial: {
        name: '',
        value: ''
      }
    }
  },
  computed: {
    ...mapGetters([
      'orgForm',
      'token',
      'userInfo'
    ])
  },
  created() {
    this.getOrgInfo()
    // console.log(0, this.token, this.userInfo.orgs)
    // if (this.token && this.userInfo) {
    //   if (this.userInfo.orgs[0] && this.userInfo.orgs[0]._id === getCurOrgId()) {
    //     this.isOwner = true
    //   }
    // }
  },
  methods: {
    handleClickEdit(section) {
      if (this.isOwner) {
        this[section] = true
      } else {
        this.$notify({
          message: 'Please log in to edit the organization!',
          type: 'warning'
        })
      }
    },
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
            if (this.userInfo._id) {
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
    removeSocial(index) {
      this.orgForm.social.splice(index, 1)
    },
    handleAddSocial() {
      this.orgForm.social.push({
        name: '',
        value: ''
      })
    },
    handleUpdate(type) {
      if (type === 'about') {
        this.isAboutInEdit = false
      } else {
        this.isContactInEdit = false
      }
      updateOrgInfo(this.orgForm._id, this.orgForm).then(res => {
        if (!res.err) {
          console.log('update success')
        } else {
          alert(res.msg)
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .dashboard {
    &-container {
      margin: 30px;
    }
    &-text {
      font-size: 30px;
      line-height: 46px;
    }
  }

</style>
