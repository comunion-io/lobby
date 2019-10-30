<template>
  <button class="btn" :class="[flat ? 'flat' : '', color]">{{ text }}</button>
</template>

<script>
export default {
  props: {
    text: String,
    flat: Boolean,
    color: String
  }
}
</script>

<style lang="scss">
@import '@/styles/variables.scss';
.btn {
  height: 40px;
  padding: 12px 36px;
  border-radius: 100px;
  border: none;
  font-size: 16px;
  font-weight: bold;
  line-height: 1;

  &:hover,
  &:focus {
    cursor: pointer;
    box-shadow: none;
    outline: none;
  }

  // default color
  color: #7b88ff;
  background: #f2f3ff;

  &:disabled {
    background: rgba(55, 64, 89, 0.05);
    color: rgba(55, 64, 89, 0.4);

    &:hover,
    &:focus {
      cursor: not-allowed;
    }
  }
}
</style>