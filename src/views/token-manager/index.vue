<template>
  <div class="token-manager">
    <div class="title">Publish Token</div>
    <div class="token-manager-user-guide" v-if="showGuide">
      <UserGuide
        @clickDone="closeGuide"
        @clickCheck="clickCheck"
        v-loading.fullscreen.lock="loading"
      />
    </div>
    <div class="token-manage-form" v-else>
      <PublishTokenForm />
    </div>
    <el-dialog title :visible.sync="dialogVisible" width="30%">
      <div>
        <div class="message">You have not installed MetaMask Yet!</div>
        <span slot="footer" class="dialog-footer">
          <el-button class="btn-main btn-wide" round>
            <a
              href="https://docs.comunion.io/guide/untitled"
              target="_blank"
            >View installation tutorial</a>
          </el-button>
        </span>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import UserGuide from "./user-guide";
import PublishTokenForm from "./publish-token-form";
import { mapGetters } from "vuex";
import MetaMaskInstall from "@/mixins/MetaMaskInstall";
import GetInfo from "@/mixins/GetInfo";
import { async } from "q";

export default {
  components: { UserGuide, PublishTokenForm },
  mixins: [GetInfo, MetaMaskInstall],
  data() {
    return {
      showGuide: true,
      loading: false,
      dialogVisible: false
    };
  },
  computed: {
    ...mapGetters(["coinbase", "orgForm"])
  },
  created() {},
  methods: {
    closeGuide() {
      this.showGuide = false;
    },
    clickCheck() {
      this.checkIfInstallMataMask();
      if (this.isMetaMaskInstalled) {
        this.$message.success('You have installed MetaMask Yet!');
      } else {
        this.dialogVisible = true;
      }
      // console.log('installed?', this.isMetaMaskInstalled);
      // this.handleMetaMaskLogin();
    }
  }
};
</script>

<style lang="scss">
.token-manager {
  margin: 0;
  font-family: Noto Sans SC;
  color: #45588c;
  .title {
    margin: 0 0 50px 17px;
    font-family: Helvetica Neue;
    font-size: 24px;
    line-height: 27px;
    font-weight: bold;
    color: #45588c;
  }
  .token-manage-form {
    margin-left: 17px;
  }

}
.message {
  margin-bottom: 20px;
}
</style>
