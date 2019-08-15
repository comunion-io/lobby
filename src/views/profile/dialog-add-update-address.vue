<template>
  <el-dialog
    :title="isNew?'Add Address':'Edit Address'"
    :visible.sync="show"
    width="40%"
    :before-close="handleClose"
  >
    <el-form ref="walletForm" :model="form">
      <el-form-item label="Select Currency">
        <div class="el-input fake">
          <div :class="['currency',form.name==='btc'? 'cur':'']" @click="form.name='btc'">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-btc" />
            </svg>
            <span>BTC</span>
          </div>
          <div :class="['currency',form.name==='eth'? 'cur':'']" @click="form.name='eth'">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-eth" />
            </svg>
            <span>ETH</span>
          </div>
        </div>

      </el-form-item>
      <el-form-item label="Wallet Address">
        <el-input v-model="form.address" placeholder="Wallet Address" />
      </el-form-item>
      <el-form-item label="Usage">
        <el-input v-model="form.usage" placeholder="Usage" />
      </el-form-item>
    </el-form>

    <span slot="footer" class="dialog-footer">
      <el-button class="btn-main" round @click="handleSave">Save</el-button>
    </span>
  </el-dialog>
</template>

<script>

export default {
  data() {
    return {
      form: {
        _id: '',
        name: '',
        address: '',
        usage: ''
      },
      show: false,
      isNew: false
    }
  },
  methods: {
    init(show, isNew, wallet) {
      this.show = show
      this.isNew = isNew
      if (wallet) {
        this.form._id = wallet._id
        this.form.name = wallet.name
        this.form.address = wallet.address
        this.form.usage = wallet.usage
      } else {
        // this.$refs.walletForm.resetFields()
        this.form._id = ''
        this.form.name = ''
        this.form.address = ''
        this.form.usage = ''
      }
    },
    handleClose() {
      this.show = false
    },
    handleSave() {
      const addressReg = /^(0x)(\d|\w){40}/i
      if (!addressReg.test(this.form.address)) {
        this.$notify({
          message: 'Please input valid wallet address',
          type: 'warning'
        })
      } else {
        if (this.isNew) {
          this.form._id = Date.now().toString(36)
        }
        this.$emit('saveWallet', this.form, this.isNew)
        this.show = false
      }
    }
  }

}
</script>

<style lang="scss" scoped>
.currency {
  display: inline-block;
  padding: 2px 10px;
  border: 1px solid rgba(55, 64, 89, 0.2);
  border-radius: 8px;
  margin-right: 10px;
  cursor: pointer;
  &.cur {
    border: 1px solid #45588C;
  }
  .icon {
    position: relative;
    top:6px;
    margin-right: 6px
  }
}
</style>
