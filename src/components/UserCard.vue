<template>
  <el-form>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <div v-show="editible" class="tools">
          <svg class="icon tool" aria-hidden="true" type="text" @click="$emit('clickEdit',user)">
            <use xlink:href="#icon-edit" />
          </svg>
          <svg class="icon tool" aria-hidden="true" type="text" @click="$emit('clickDelete',user.email)">
            <use xlink:href="#icon-delete" />
          </svg>
        </div>

        <div class="section-user-info">
          <div class="user-avatar">
            <img v-if="user&&user.logo" :src="user.logo" alt="">
            <img v-else src="~@/assets/avatar.png" alt="">
          </div>
          <div class="user-meta">
            <div class="user-name">{{ user&&user.name }}</div>
            <div class="user-title">{{ user&&user.role }}</div>
          </div>
        </div>

        <div v-show="user&&user.skills&&user.skills.length>0" class="tag-row">
          <el-tag v-for="skill in user.skills" :key="skill" type="success">{{ skill }}</el-tag>
        </div>
      </div>
      <div>
        <el-form-item label="E-Mail">
          <div class="el-input fake">{{ user&& user.email?user.email:'' }}</div>
        </el-form-item>
        <el-form-item label="Wallet Address">
          <div class="el-input fake">{{ user&&user.address?user.address:'' }}</div>
          <div v-for="(wallet,index) in user.wallet" :key="index" class="el-input fake">
            {{ wallet.name?wallet.name.toUpperCase():'' }}  {{ wallet.address }}
          </div>
        </el-form-item>
        <el-form-item label="Social">
          <div class="socials el-input fake">
            <ul v-show="user&&user.social">
              <li v-for="social in user.social" :key="social.name">
                <a :href="social.value" target="_blank">
                  <svg class="icon" aria-hidden="true">
                    <use :xlink:href="'#icon-'+social.name" />
                  </svg>
                </a>
              </li>
            </ul>
          </div>
        </el-form-item>
      </div>
    </el-card>
  </el-form>

</template>

<script>
export default {
  props: {
    user: Object,
    editible: Boolean
  }
}
</script>

<style lang="scss">

</style>
