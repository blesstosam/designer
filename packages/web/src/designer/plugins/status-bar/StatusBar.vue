<style scoped>
.status-bar {
  height: 100%;
  line-height: 30px;
  padding: 0 8px;
}
.status-bar .item {
  padding-right: 4px;
}
</style>

<template>
  <div class="status-bar">
    <span class="item" v-for="(path, index) in pathArr" :key="index">
      <span>{{ path }}</span>
      <span v-if="index !== pathArr.length - 1"> ></span>
    </span>
  </div>
</template>

<script>
export default {
  name: 'StatusBar',
  props: ['pathArr']
}
</script>
