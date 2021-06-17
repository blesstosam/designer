<template>
  <div class="v-block" style="width: 100%; border: dotted 1px #aaaaaa; height: 50px">
    <!-- 布局组件为容器 需要加 slot name 为 default -->
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'VBlock',
}
</script>
