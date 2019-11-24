<script>
import Web3 from 'web3'
import { EthUtils, Daos, Organization, OrgToken } from 'comunion-dao'

export default {
  data() {
    return {
      daos: null,
      daosAddress: '0x7284C823ea3AD29bEDfd09Ede1107981E9519896'
    }
  },
  created() {
    this.daos = new Daos(EthUtils, this.daosAddress)
  }
}
</script>