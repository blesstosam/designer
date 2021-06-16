<style>
.children {
  /* margin-left: 12px; */
}
</style>
<template>
  <el-col
    :span="item.span || 6"
    :offset="item.offset || 0"
    style="position: relative;"
    :style="{ background: item.bg }"
  >
    <span><slot></slot></span>
    <span class="children" style="" v-if="item.children && item.children.length">
      <TreeItem v-for="_item in item.children" :item="_item" :key="_item.value">{{
        _item.value
      }}</TreeItem>
    </span>
  </el-col>
</template>

<script>
export default {
  name: 'TreeItem',
  props: {
    item: {
      // {
      //   value: '',
      //   span: 12,
      //   offset: 0,
      //   children: []
      // }
      type: Object,
    },
  },
};
</script>
