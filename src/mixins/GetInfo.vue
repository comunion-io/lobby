<script>
import { mapGetters } from 'vuex'
import { updateOrgInfo } from '@/api/organization'
import { getCurOrgId, setCurOrgId, getUserId } from '@/utils/auth'

export default {
  data() {
    return {
      isOwner: false
    }
  },
  computed: {
    ...mapGetters(['orgForm', 'token', 'userInfo'])
  },
  created() {
    this.getOrgInfo()
  },
  watch: {
    'userInfo.orgs': {
      handler(val) {
        if (this.userInfo.orgs.map(item => item._id).includes(getCurOrgId())) {
          this.isOwner = true
        } else {
          this.isOwner = false
        }
      },
      deep: true
    },
    'orgForm.members': {
      handler(val) {
        if (this.orgForm.members.filter(item => item.role === 'owner' && item.userId === getUserId()).length > 0 ){
          this.isOwner = true
        } else {
          this.isOwner = false
        }
      },
      deep: true
    },
  },
  methods: {
    checkIfOwner() {
      if (this.userInfo.orgs.map(item => item._id).includes(getCurOrgId())) {
        this.isOwner = true
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
        // debugger
        if (this.orgForm._id === id ) {
          this.checkIfOwner();
          return;
        };
        this.$store.dispatch('organization/getOrgInfo', id).then(res => {
          if (getUserId()) {
            if (this.userInfo._id) {
              this.checkIfOwner()
            } else {
              this.$store.dispatch('user/getInfo').then(res => {
                this.checkIfOwner()
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
    }
  }
}
</script>