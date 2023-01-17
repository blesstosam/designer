
<template>
  <div>
    <!-- <label>{{label}}222</label> -->
    <el-input readonly v-bind="$attrs" />
  </div>
</template>

<script>
import { ElInput } from 'element-plus'
export default {
  name: 'VInput',
  props: {
    label: String
  },
  components: {
    ElInput
  }
}
</script>
