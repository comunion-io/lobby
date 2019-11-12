<template></template>
<script>
import { mapGetters } from "vuex";
import Web3 from 'web3';
import { EthUtils, Daos, Organization, OrgToken } from 'comunion-dao';

export default {
  data() {
    return {
      isMetaMaskInstalled: false,
      daos: null,
      daosAddress: '0x7284C823ea3AD29bEDfd09Ede1107981E9519896'
    };
  },
  computed: {
    ...mapGetters(["coinbase"])
  },
  created() {
    this.daos = new Daos(EthUtils, this.daosAddress);
  },
  methods: {
    async getCoinBase() {
      const coinbase = (await web3.eth.getAccounts())[0]
      if (coinbase) {
        this.$store.commit('coinbase/SET_COINBASE', coinbase)
      }
    },

    // new
    checkIfInstallMataMask() {
      if (window.ethereum) {
        window.web3 = new Web3(ethereum);
        try {
          this.isMetaMaskInstalled = true;
          // await ethereum.enable();
        } catch (error) {
          // TODO:
        }
      } else if (window.web3) {
        window.web3 = new Web3(web3.currentProvider);
        this.isMetaMaskInstalled = true;
      } else {
        this.isMetaMaskInstalled = false;
      }
    },

    checkIfInstallMataMaskOld() {
      this.checkIfInstallMataMask();
      if (!this.isMetaMaskInstalled) {
        this.$notify({
          message: "No web3? You should consider trying MetaMask!",
          type: "warning",
          duration: 0
        });
      }
    },
    handleMetaMaskLogin() {
      this.checkIfInstallMataMask();
      if (!this.isMetaMaskInstalled) {
        this.dialogVisible = true;
        return;
      } 
      this.metaMaskLogin().then(res => {
        this.getCoinBase();
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