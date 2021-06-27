<style scoped>
.component-tree {
  border-top: 1px solid #eee;
  padding: 8px 0;
}
</style>

<template>
  <div class="component-tree">
    <div>组件树</div>
    <el-tree
      ref='tree'
      empty-text="暂无组件"
      :data="treeData"
      node-key="unique"
      :props="defaultProps"
      :highlight-current="true"
      :expand-on-click-node="false"
      :current-node-key="currentNodeKey"
      @node-click="handleNodeClick"
    ></el-tree>
  </div>
</template>

<script>
export default {
  name: 'ComponentTree',
  props: {
    tree: Array,
    // vue 实例通过回调函数实现 emit
    handleClick: Function
  },
  data() {
    return {
      defaultProps: {
        children: 'children',
        label: 'title'
      },
      currentNodeKey: ''
    }
  },
  computed: {
    treeData() {
      const tree = this.tree || []
      const treeData = []
      for (const t of tree) {
        const item = { name: t.name, title: t.title, unique: t.unique, children: [] }
        treeData.push(item)
        if (t.children) {
          const _d = []
          for (const _t of t.children) {
            _d.push({ name: _t.name, title: _t.title, unique: _t.unique, children: _t.children })
          }
          item.children = _d
        }
      }
      return treeData
    }
  },
  methods: {
    handleNodeClick(d) {
      this.handleClick && this.handleClick(d)
    },
    setCurrentKey(key) {
      this.$refs.tree.setCurrentKey(key)
    }
  }
}
</script>
