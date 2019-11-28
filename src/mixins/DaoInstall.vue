<script>
import Web3 from 'web3'
import { EthUtils, Daos, Organization, OrgToken } from 'comunion-dao'

export default {
  data() {
    return {
      daos: null,
      ethUtils: null,
      daosAddress: '0x7284C823ea3AD29bEDfd09Ede1107981E9519896'
    }
  },
  created() {
    this.init()
  },
  methods: {
    async init() {
      if (window.ethereum) {
        window.web3 = new Web3(ethereum);
        try {
          await ethereum.enable();
        } catch (error) {
          // TODO:
        }
      } else if (window.web3) {
        window.web3 = new Web3(web3.currentProvider);
      }
      EthUtils.init(web3)
      this.ethUtils = new EthUtils()
      this.daos = new Daos(this.ethUtils, this.daosAddress)
    }
  }
}
</script>