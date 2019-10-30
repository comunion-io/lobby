<template>
  <div class="record">
    <el-card class="box-card full">
      <div slot="header" class="clearfix">
        <h3 class="title">Record</h3>
      </div>
      <h4 v-if="recordCount === 0" class="message">No Record</h4>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      records: []
    }
  },
  computed: {
    recordCount() {
      return this.records.length
    }
  }
}
</script>

<style lang="scss">
@import '@/styles/variables.scss';
.record {
  .message {
    display: block;
    margin: 75px auto;
    text-align: center;
    font-size: 18px;
    line-height: 21px;
    font-weight: 400;
    color: $emptyDataColor;
  }
}
</style>