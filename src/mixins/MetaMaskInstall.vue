<template>
</template>
<script>
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      isMetaMaskInstalled: false
    };
  },
  computed: {
    ...mapGetters(["coinbase"])
  },
  created() {
  },
  methods: {
    getCoinBase() {
      const coinbase = web3.eth.accounts[0];
      if (coinbase) {
        this.$store.commit('coinbase/SET_COINBASE', coinbase)
      }
    },
    checkIfInstallMataMask() {
      if (window.web3 || window.ethereum) {
        // Use the browser's ethereum provider
        this.isMetaMaskInstalled = true;
        web3 = new Web3(web3.currentProvider);
        /* To see if the injected provider is from MetaMask */
        if (web3.currentProvider.isMetaMask) {
          console.log("The injected provider is from MetaMask！");
          this.getCoinBase();
        }
      } else {
        this.isMetaMaskInstalled = false;
        // this.$notify({
        //   message: "No web3? You should consider trying MetaMask!",
        //   type: "warning",
        //   duration: 0
        // });
      }
    },
    handleMetaMaskLogin() {
      this.checkIfInstallMataMask();
      if (!this.isMetaMaskInstalled) {
        this.dialogVisible = true;
        return;
      } 
      this.metaMaskLogin().then(res => {
        const coinbase = web3.eth.accounts[0];
        if (coinbase) {
          this.$store.commit('coinbase/SET_COINBASE', coinbase)
        }
      });
    },
    async metaMaskLogin () {
      try {
        // Request account access if needed
        await window.ethereum.enable();

        // We don't know window.web3 version, so we use our own instance of Web3
        // with the injected provider given by MetaMask
        // web3 = new Web3(window.ethereum)
      } catch (error) {
        console.log("metamask login error", error);

        this.$notify({
          title: "Metamask Warning",
          message: error && error.message || "You need to allow MetaMask!",
          type: "warning"
        });
      }
    }
  }
};
</script>