<template>
  <el-tabs type="border-card">
    <el-tab-pane
      v-for="(item, index) in tabOptions"
      :key="index"
      :label="item.label"
      :name="item.name"
    >
      <div class="content" :c-slot-name="`default${index}`">
        <slot :name="`default${index}`"></slot>
      </div>
    </el-tab-pane>
  </el-tabs>
</template>

<script>
import { ElTabs, ElTabPane } from 'element-plus'

export default {
  name: 'VTabs',
  props: {
    tabOptions: {
      type: Array,
      default: () => []
    },
    tabType: String
  },
  created() {
    // console.log(this.$slots.block)
  },
  components: {
    ElTabs,
    ElTabPane
  }
}
</script>
