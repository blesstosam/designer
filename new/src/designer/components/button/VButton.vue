<template>
  <el-button v-bind="$attrs">{{ content }}
    <!-- for test -->
    <!-- <slot name="block"></slot> -->
  </el-button>
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
  created() {
    // console.log(this.$slots.block)
  },
  components: {
    ElButton
  }
}
</script>
