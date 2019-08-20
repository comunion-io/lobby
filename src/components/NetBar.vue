<template>
  <div class="netbar">
    <el-dropdown trigger="click" placement="top">
      <div class="net-text"><span class="dot yellow" />Ethereum Mainnet<i class="el-icon-caret-bottom" /></div>

      <el-dropdown-menu slot="dropdown" class="net-dropdown">
        <el-dropdown-item>
          Ropsten Test Net
        </el-dropdown-item>
        <el-dropdown-item>
          Kovan Test Net
        </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </div>
</template>

<script>

export default {
  data() {
    return {

    }
  },
  computed: {

  },
  created() {

  },
  methods: {

  }
}
</script>

<style lang="scss">
.netbar {
  width: 154px;
  height: 40px;
  line-height: 40px;
  padding-left: 8px;
  overflow: hidden;
  background: #fff;
  border-radius: 6px;
  box-shadow: 0 1px 4px rgba(0,21,41,.08);
  .net-text {
    cursor: pointer;
    .dot {
      position: relative;
      top: -1px;
      display: inline-block;
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #FDCB6E;
      margin-right: 4px;
    }
  }
}
.net-dropdown {
  width: 154px;
}
</style>
