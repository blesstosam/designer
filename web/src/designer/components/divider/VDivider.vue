<template>
  <el-divider v-bind="$attrs">{{ content }}</el-divider>
</template>
<script>
import { ElDivider } from 'element-plus'
export default {
  name: 'VDivider',
  components: {
    ElDivider
  },
  props: {
    content: String,
  }
}
</script>
