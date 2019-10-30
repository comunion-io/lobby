<template>
  <label class="tag" :class="[type ? type : '']">{{ text }}</label>
</template>

<script>
export default {
  props: {
    text: String,
    type: String
  }
}
</script>


<style lang="scss">
@import '@/styles/variables.scss';

.tag {
  padding: 3px 16px;
  border-radius: 100px;
  background: rgba(55, 64, 89, 0.05);
  color: rgba(55, 64, 89, 0.4);

  &.primary {
    color: #7b88ff;
    background: #f2f3ff;
  }
}
</style>