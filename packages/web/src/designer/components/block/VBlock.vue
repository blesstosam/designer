<style scoped>
.v-block {
  box-sizing: border-box;
}
</style>

<template>
  <div class="v-block" style="width: 100%" c-slot-name="default">
    <!-- 布局组件为容器 需要加 c-slot-name 和 对应的 class -->
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'VBlock'
}
</script>
