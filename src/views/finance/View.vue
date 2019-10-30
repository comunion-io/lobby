<template>
  <div class="view">
    <total-balance />
    <assets />
    <record />
  </div>
</template>

<script>
import { TotalBalance, Record, Assets } from '@/components/Finance'
export default {
  components: {
    TotalBalance,
    Record,
    Assets
  }
}
</script>

<style>
</style>