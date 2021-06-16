<style scoped>
.component-tree {
  border-top: 1px solid #eee;
  padding: 8px 0;
}
</style>

<template>
  <div class="component-tree">
    <div>组件树</div>
    <el-tree :data="treeData" node-key="" :props="defaultProps"></el-tree>
  </div>
</template>

<script>
import { computed, reactive, ref } from 'vue'

export default {
  name: 'ComponentTree',
  props: {
    tree: Array
  },
  setup(props) {
    const tree = props.tree || []
    const treeData = []
    for (const t of tree) {
      const item = { name: t.name, title: t.title, children: [] }
      treeData.push(item)
      if (t.children) {
        const __d = []
        for (const _t of t.children) {
          __d.push({name: _t.name, title: _t.title, children: _t.children})
        }
        item.children = __d
      }
    }

    const data = reactive([
      {
        label: '一级 1',
        children: [
          {
            label: '二级 1-1',
            children: [
              {
                label: '三级 1-1-1'
              }
            ]
          }
        ]
      }
    ])

    const defaultProps = {
      children: 'children',
      label: 'title'
    }

    const setData = d => {
      data = d
    }
    return {
      data,
      defaultProps,
      setData,
      treeData
    }
  }
}
</script>
