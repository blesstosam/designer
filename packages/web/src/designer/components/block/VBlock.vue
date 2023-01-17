<style scoped>
/* 该样式只在画布里才有 */
.canvas-wrap .v-block {
  /* border: 1px dashed #aaa; */
  background-color: #fff;
  box-sizing: border-box;
  /* padding: 12px 0 !important; */
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
  name: 'VBlock',
}
</script>
