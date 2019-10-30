<template>
  <button class="btn" :class="[type ? type : '']">{{ text }}</button>
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
.btn {
  height: 40px;
  padding: 12px 36px;
  border-radius: 100px;
  border: none;
  font-size: 16px;
  font-weight: bold;
  line-height: 1;
  // default color
  color: #7b88ff;
  background: #f2f3ff;

  &:hover,
  &:focus {
    cursor: pointer;
    box-shadow: none;
    outline: none;
  }

  &.primary {
    padding: 12px 46px;
    color: #fff;
    background: linear-gradient(270deg, #7b87ff 0%, #606fff 100%);
    box-shadow: 0px 2px 10px rgba(123, 136, 255, 0.5);
    &:hover,
    &:active,
    &:focus {
      color: #fff;
      background: linear-gradient(270deg, #6977ff 0%, #5364ff 100%);
    }
    &.disable {
      background: rgb(182, 189, 248);
      &:hover,
      &:active,
      &:focus {
        color: #fff;
        background: rgb(180, 180, 240);
      }
    }
  }

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