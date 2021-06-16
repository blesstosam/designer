
<template>
  <el-input v-model="a"></el-input>  
</template>

<script>
import { ElInput } from 'element-plus'
export default {
  name: 'VInput',
  data() {
    return {a: 1}
  },
  components: {
    ElInput
  }
}
</script>
