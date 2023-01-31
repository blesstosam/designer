<style>
.v-tabs .el-tabs__content {
  padding: 0px;
}
.v-tabs .content {
  margin: 20px;
  position: relative;
}
</style>

<template>
  <el-tabs type="border-card" class="v-tabs" v-model="activeName">
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
import { ref } from 'vue'
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
  },
  setup(props) {
    const activeName = ref(props.tabOptions[0].name)
    return {
      activeName
    }
  }
}
</script>
