<style>
/* 该样式只在画布里才有 */
.canvas-wrapper .v-block {
  border: dotted 1px #aaaaaa;
  height: 50px;
}
</style>

<template>
  <div class="v-block" style="width: 100%;">
    <!-- 布局组件为容器 需要加 slot name 和 对应的 class 如果不加为 default -->
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'VBlock'
}
</script>
