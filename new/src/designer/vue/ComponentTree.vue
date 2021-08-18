<style scoped>
.component-tree {
  border-top: 1px solid #eee;
}
.component-tree .header {
  border-bottom: 1px solid #dedede;
  padding: 10px 8px;
  margin-bottom: 12px;
}
.component-tree .header span {
  margin-left: 6px;
  vertical-align: top;
}
.component-tree .custom-tree-node {
  width: 100%;
  display: flex;
  justify-content: space-between;
}
.component-tree .custom-tree-node .left img {
  width: 14px;
  margin-right: 6px;
  vertical-align: middle;
}
.component-tree .custom-tree-node .right img {
  width: 16px;
  background: #1989fa;
  padding: 2px;
  margin-right: 4px;
}
.component-tree .custom-tree-node .right img:hover {
  transform: scale(1.1);
}
</style>

<template>
  <div class="component-tree">
    <div class="header">
      <svg
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
        <div
          class="custom-tree-node"
          @mouseenter="handleNodeMouseEnter(data, $event)"
          @mouseleave="handleNodeMouseLeave(data, $event)"
        >
          <div class="left">
            <img :src="data.icon && data.icon.value" />
            <span style="color: #333">{{ data.title }}</span>
          </div>
          <!-- actionShowRow === data.$treeNodeId -->
          <div
            class="right"
            :style="{ visibility: actionShowRow === data.$treeNodeId ? 'visible' : 'hidden' }"
          >
            <img
              :src="data.display ? '/eye.png' : 'eye-close.png'"
              alt="display"
              @click.stop="handleDisplay(data, $event)"
            />
            <img src="/delete.png" alt="del" @click.stop="handleDel(data, $event)" />
          </div>
        </div>
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
    handleDel: Function,
    handleDisplay: Function,
    handleClick: Function,
    handleMouseEnter: Function,
    handleMouseLeave: Function
  },
  data() {
    return {
      actionShowRow: -1,
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
        const item = {
          name: t.name,
          title: t.title,
          unique: t.unique,
          icon: t.icon,
          children: [],
          display: true
        }
        treeData.push(item)
        if (t.children) {
          const _d = []
          for (const _t of t.children) {
            _d.push({
              name: _t.name,
              title: _t.title,
              unique: _t.unique,
              icon: _t.icon,
              children: _t.children,
              display: true
            })
          }
          item.children = _d
        }
      }
      return treeData
    }
  },
  methods: {
    handleDel(d) {
      this.handleDel && this.handleDel(d)
    },
    handleDisplay(d) {
      d.display = !d.display
      this.handleDisplay && this.handleDisplay(d, d.display)
    },
    handleNodeMouseEnter(d) {
      this.actionShowRow = d.$treeNodeId
      this.handleMouseEnter && this.handleMouseEnter(d)
    },
    handleNodeMouseLeave(d) {
      this.actionShowRow = -1
      this.handleMouseLeave && this.handleMouseLeave()
    },
    handleNodeClick(d) {
      this.handleClick && this.handleClick(d)
    },
    setCurrentKey(key) {
      this.$refs.tree.setCurrentKey(key)
    }
  }
}
</script>
