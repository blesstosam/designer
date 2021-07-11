<style scoped>
.component-tree {
  border-top: 1px solid #eee;
  padding: 8px 0;
}
.component-tree .header {
  border-bottom: 1px solid #dedede;
  padding: 0 8px 6px;
  margin-bottom: 12px;
}
.component-tree .header span {
  margin-left: 6px;
  vertical-align: top;
}
</style>

<template>
  <div class="component-tree">
    <div class="header">
      <svg
        t="1624966999151"
        class="icon"
        viewBox="0 0 1024 1024"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        p-id="3296"
        xmlns:xlink="http://www.w3.org/1999/xlink"
        fill="#333"
        width="18"
        height="18"
      >
        <path
          d="M848 766.4c44.182 0 80 35.818 80 80s-35.818 80-80 80H592c-44.182 0-80-35.818-80-80s35.818-80 80-80h256z m0 48H592c-17.674 0-32 14.326-32 32s14.326 32 32 32h256c17.674 0 32-14.326 32-32s-14.326-32-32-32zM176 96c44.182 0 80 35.818 80 80 0 35.82-23.542 66.144-56 76.336V512h200c13.254 0 24 10.746 24 24s-10.746 24-24 24H200v246.4c0 8.688 6.923 15.757 15.552 15.994l0.448 0.006h232c13.254 0 24 10.746 24 24 0 13.088-10.475 23.728-23.498 23.995l-0.502 0.005H216c-34.992 0-63.426-28.083-63.992-62.942L152 806.4V252.338C119.544 242.146 96 211.82 96 176c0-44.182 35.818-80 80-80z m672 360c44.182 0 80 35.818 80 80s-35.818 80-80 80H592c-44.182 0-80-35.818-80-80s35.818-80 80-80h256z m0 48H592c-17.674 0-32 14.326-32 32s14.326 32 32 32h256c17.674 0 32-14.326 32-32s-14.326-32-32-32z m0-408c44.182 0 80 35.818 80 80s-35.818 80-80 80H400c-44.182 0-80-35.818-80-80s35.818-80 80-80h448z m-672 48c-17.674 0-32 14.326-32 32s14.326 32 32 32 32-14.326 32-32-14.326-32-32-32z m672 0H400c-17.674 0-32 14.326-32 32s14.326 32 32 32h448c17.674 0 32-14.326 32-32s-14.326-32-32-32z"
          p-id="3297"
        ></path>
      </svg>
      <span>组件树</span>
    </div>
    
    <el-tree
      ref="tree"
      empty-text="暂无组件"
      :data="treeData"
      node-key="unique"
      :props="defaultProps"
      :highlight-current="true"
      :expand-on-click-node="false"
      :current-node-key="currentNodeKey"
      @node-click="handleNodeClick"
    >
      <template #default="{ data }">
        <span class="custom-tree-node">
          <img
            :src="data.icon && data.icon.value"
            style="width: 14px; margin-right: 6px; vertical-align: middle"
          />
          <span style="color: #333">{{ data.title }}</span>
          <!-- <span> {{ data }} </span> -->
        </span>
      </template>
    </el-tree>
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
        const item = { name: t.name, title: t.title, unique: t.unique, icon: t.icon, children: [] }
        treeData.push(item)
        if (t.children) {
          const _d = []
          for (const _t of t.children) {
            _d.push({
              name: _t.name,
              title: _t.title,
              unique: _t.unique,
              icon: _t.icon,
              children: _t.children
            })
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
