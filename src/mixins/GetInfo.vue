<script>
import { mapGetters } from "vuex";
import { updateOrgInfo } from "@/api/organization";
import { getCurOrgId, setCurOrgId } from "@/utils/auth";

export default {
  data() {
    return {
      isOwner: false
    };
  },
  computed: {
    ...mapGetters(["orgForm", "token", "userInfo"])
  },
  created() {
    this.getOrgInfo();
  },
  methods: {
    getOrgInfo() {
      let id = "";
      if (this.$route.query.id) {
        id = this.$route.query.id;
        setCurOrgId(id);
      } else {
        id = getCurOrgId();
      }
      if (id) {
        this.$store.dispatch("organization/getOrgInfo", id).then(res => {
          if (this.token) {
            if (this.userInfo._id) {
              if (
                  this.userInfo.orgs.map(item => item._id).includes(getCurOrgId())
              ) {
                this.isOwner = true;
              }
            } else {
              this.$store.dispatch("user/getInfo").then(res => {
                if (
                  this.userInfo.orgs.map(item => item._id).includes(getCurOrgId())
                ) {
                  this.isOwner = true;
                }
              });
            }
          }
        });
      } else {
        this.$notify({
          message: "Please select an organization to continue!",
          type: "warning"
        });
      }
    }
  }
};
</script>