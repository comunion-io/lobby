<template>
  <div id="finance">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>卡片名称</span>
      </div>
      <div v-for="o in 4" :key="o" class="text item">
        {{'列表内容 ' + o }}
      </div>
    </el-card>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import GetInfo from '@/mixins/GetInfo';
import { async } from 'q';

export default {
  mixins: [GetInfo],
  data() {
    return {
      showGuide: true,
      loading: false
    };
  },
  computed: {
    ...mapGetters([
      'coinbase',
      'orgForm'
    ])
  },
  created() {
    
  },
  methods: {
    closeGuide() {
      this.showGuide = false;
    },
    clickCheck() {
      const check = async () => {
        // this.loading = true;
        await this.checkIfInstallMataMask();
        // await this.handleMetaMaskLogin();
        // this.loading = false;
      }
      this.checkIfInstallMataMask();
      this.handleMetaMaskLogin();

      // check();
    }
  }
}
</script>

<style lang="scss">

  /* global style */
  .box-card {
    width: 100%;

    .el-card__header {
      padding: 22px 30px;
      font-family: Helvetica Neue;
      font-size: 20px;
      line-height: 24px;
      color: #45588C;
    }
  }

</style>
