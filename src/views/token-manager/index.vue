<template>
  <div class="token-manager">
    <div class="token-details" v-if="hasToken">{{ tokenInfo }}</div>
    <div class="center-tip" v-else-if="!isOwner">Sorry, there is no token.</div>
    <div v-else>
      <div class="title">Publish Token</div>
      <div class="token-manager-user-guide" v-if="showGuide">
        <UserGuide
          @clickDone="closeGuide"
          @clickCheck="clickCheck"
          v-loading.fullscreen.lock="loading"
        />
      </div>
      <div class="token-manage-form" v-if="showForm">
        <PublishTokenForm @clickPublish="handlePublish" />
      </div>
      <el-card class="tip" v-if="showTrans">
        <div class="deploy-trans">
          <div class="inner-content">
            <div class="section-card">
              <div class="card-title">Deploy Transaction</div>
              <div class="tip nomargin left">
                This is the last step : ) &nbsp; You will need to sign the transaction to publish the token.
                <br />Continue with your web wallet.
              </div>
              <div v-if="!transactionHash" class="card-content">
                <div class="tip">Open your web wallet</div>

                <div class="wallet-logo">
                  <svg class="icon" aria-hidden="true">
                    <use :xlink:href="'#icon-metamask'+(isMetaMaskInstalled?1:'')" />
                  </svg>
                </div>
                <el-button
                  :class="['btn-wide', isMetaMaskInstalled?'btn-main':'btn-grey']"
                  round
                  @click="publishToken"
                >MetaMask</el-button>
                <div v-if="!coinbase" class="tip" @click="handleMetaMaskLogin">
                  click
                  <a>log in</a> to wake up your MetaMask
                </div>
                <div v-else class="tip black">Address: {{ coinbase }}</div>
              </div>
              <div v-else>
                <div class="success">
                  <el-progress type="circle" color="#7B88FF" :percentage="percentage" />
                </div>
                <div class="tip">It takes a few minutes to confirm on the chain.</div>
                <div class="tip">Do not close this page...</div>
              </div>
            </div>
          </div>
        </div>
      </el-card>
    </div>
    <el-dialog title :visible.sync="dialogVisible" width="30%">
      <div>
        <div class="message">You have not installed MetaMask Yet!</div>
        <span slot="footer" class="dialog-footer">
          <el-button class="btn-main btn-wide" round>
            <a
              href="https://wiki.comunion.io/guide/metamask-guide"
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
import { getDeployData } from "@/api/token";

export default {
  components: { UserGuide, PublishTokenForm },
  mixins: [GetInfo, MetaMaskInstall],
  data() {
    return {
      showGuide: false,
      loading: false,
      dialogVisible: false,
      showTrans: false,
      showForm: false,
      percentage: 0,
      transactionHash: "",
      hasToken: false,
      tokenInfo: null,
      icon: "",
      isCreateSuccess: false,
      isTransactionSuccess: false
    };
  },
  computed: {
    ...mapGetters(["coinbase", "orgForm"])
  },
  created() {
    if (this.orgForm.tokenInfo) {
      this.hasToken = true;
    } else {
      this.showGuide = true;
    }
  },
  methods: {
    closeGuide() {
      this.showGuide = false;
      this.showForm = true;
    },
    clickCheck() {
      this.checkIfInstallMataMask();
      if (this.isMetaMaskInstalled) {
        this.$message.success("You have installed MetaMask Yet!");
      } else {
        this.dialogVisible = true;
      }
    },
    handlePublish(formParams) {
      this.showForm = false;
      this.showTrans = true;
      this.tokenInfo = {
        name: formParams.name,
        symbol: formParams.symbol,
        supply: formParams.supply
      };
      this.icon = formParams.icon;
    },
    publishToken() {
      if (!this.coinbase) {
        this.$notify({
          message: "please log in first!",
          type: "warning"
        });
        return;
      }
      getDeployData(this.tokenInfo).then(data => {
        try {
          web3.eth.sendTransaction(
            {
              from: this.coinbase,
              to: "0x0e9a89bb07b7c4E4628E042A1dfC2554d1d8b7ca",
              value: "80000000",
              data: data.deployData
            },
            (err, data) => {
              if (data) {
                this.transactionHash = data;

                console.log("transaction hash", data);
                const _this = this;
                const progressTimer = setInterval(() => {
                  if (_this.percentage < 90) {
                    _this.percentage++;
                  } else {
                    clearInterval(progressTimer);
                  }
                }, 2000);
                this.$once("hook:beforeDestroy", () => {
                  console.log("before destroy");
                  clearInterval(progressTimer);
                });

                this.$store
                  .dispatch(
                    "organization/addToken",
                    this.tokenInfo,
                    this.icon,
                    this.transactionHash
                  )
                  .then(res => {
                    console.log("res", res);

                    this.isCreateSuccess = true;
                    const checkOrgStatusTimer = setInterval(() => {
                      getOrgStatus(this.orgForm._id).then(statusRes => {
                        console.log(44, statusRes);
                        if (statusRes.err) {
                          this.$notify({
                            message: statusRes.msg,
                            type: "warning"
                          });
                          clearInterval(progressTimer);
                          clearInterval(checkOrgStatusTimer);
                        } else if (statusRes.status === 1) {
                          // has written in the chain
                          this.isTransactionSuccess = true;
                          this.showTrans = false;
                          this.hasToken = true;

                          clearInterval(checkOrgStatusTimer);
                        } else if (statusRes.status === -1) {
                          // clearInterval(progressTimer)
                          clearInterval(this.checkOrgStatusTimer);
                        }
                      });
                    }, 5000);
                    this.$once("hook:beforeDestroy", () => {
                      console.log("before destroy");
                      clearInterval(checkOrgStatusTimer);
                    });
                  });
              } else {
                this.isCreateSuccess = false;
                this.$notify({
                  message: err,
                  type: "warning"
                });
              }
            }
          );
        } catch (error) {
          console.log(error);
        }
      });
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
.tip {
  margin-left: 17px;
  width: 90%;
  text-align: center;
  .el-card.is-always-shadow {
    box-shadow: 0px 5px 10px rgba(0, 0, 0, 0.02);
    border-radius: 6px;
  }
}
.deploy-trans {
  .wallet-logo {
    margin-bottom: 20px;
    .icon {
      font-size: 30px;
    }
  }
}
.message {
  margin-bottom: 20px;
}
.el-card.is-always-shadow {
  box-shadow: 0px 5px 10px rgba(0, 0, 0, 0.02);
  border-radius: 6px;
}
</style>
