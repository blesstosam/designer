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
export default {
  name: 'ComponentTree',
  props: {
    tree: Array
  },
  data() {
    return {
      defaultProps: {
        children: 'children',
        label: 'title'
      }
    }
  },
  computed: {
    treeData() {
      const tree = this.tree || []
      const treeData = []
      for (const t of tree) {
        const item = { name: t.name, title: t.title, children: [] }
        treeData.push(item)
        if (t.children) {
          const _d = []
          for (const _t of t.children) {
            _d.push({ name: _t.name, title: _t.title, children: _t.children })
          }
          item.children = _d
        }
      }
      return treeData
    }
  }
}
</script>
