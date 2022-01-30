<template>
  <el-image v-bind="$attrs"></el-image>
</template>
<script>
import { ElImage } from 'element-plus'

export default {
  name: 'VImage',
  components: {
    ElImage
  },
  props: {
    // content: String,
  }
}
</script>
