<template>
  <el-tag v-bind="$attrs">{{ content }}</el-tag>
</template>
<script>
import { ElTag } from 'element-plus'
export default {
  name: 'VTag',
  components: {
    ElTag
  },
  props: {
    content: String,
  }
}
</script>
