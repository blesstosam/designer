<template>
  <el-button v-bind="$attrs">{{ content }}</el-button>
</template>

<script>
import { ElButton } from 'element-plus'
export default {
  name: 'VButton',
  // 暂时支持这些设置 $attrs 会透传到el-button 所以不用声明
  props: {
    content: String,
    // icon: String,
    // size: String,
    // type: String,
    // plain: Boolean,
    // round: Boolean,
    // circle: Boolean,
    // disabled: Boolean
  },
  components: {
    ElButton
  }
}
</script>
