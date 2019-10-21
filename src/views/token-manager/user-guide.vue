<template>
  <div class="user-guide">
    <el-card class="user-guide-card" :body-style="{ padding: '30px' }">
      <div slot="header" class="clearfix">
        <div class="user-guide-header">How to Publish Token</div>
      </div>
      <div class="user-guide-content">
        <div>Adding a Token takes only a few steps!</div>
        <ol class="list">
          <li>
            Make sure you have installed Metamask.
            <el-button type="text">Click here</el-button>to check.
          </li>
          <li>Adding Token will need a deployment transaction with amount of 0. However, it consumes gas fee. Make sure you have some ETH in your address.</li>
          <li>Fill up info about your token. You will need a logo, a name, an abbreviation and amount of token.</li>
          <li>Wait for confirmation.</li>
          <li>Done.</li>
        </ol>
        <div class="yes-btn">
          <el-button round class="btn-main">I understand</el-button>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "TokenUserGuide",
  data() {
    return {};
  },
  methods: {}
};
</script>

<style lang="scss" scoped>
.user-guide {
  width: 90%;
  .el-card.is-always-shadow {
    box-shadow: 0px 5px 10px rgba(0, 0, 0, 0.02);
    border-radius: 6px;
  }
  &-card {
    color: #45588c;
  }
  &-header {
    font-weight: bold;
    font-size: 20px;
    line-height: 27px;
    margin-left: 10px;
  }
  &-content {
    ol.list {
      font-size: 16px;
      line-height: 30px;
      padding-inline-start: 18px;
    }
    .yes-btn {
      text-align: center;
    }
  }
}
</style>
