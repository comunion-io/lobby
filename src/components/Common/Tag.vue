<template>
  <label class="tag" :class="[color ? color : '']">{{ text }}</label>
</template>

<script>
export default {
  props: {
    text: String,
    color: String
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

  &.blue {
    color: #7b88ff;
    background: #f2f3ff;
  }
}
</style>