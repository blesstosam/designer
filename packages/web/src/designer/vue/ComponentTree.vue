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
.component-tree .custom-tree-node .right {
  display: flex;
}
.component-tree .custom-tree-node .right svg {
  background: #1989fa;
  padding: 3px;
  margin-right: 4px;
  color: #fff;
}
.component-tree .custom-tree-node .right svg:hover {
  transform: scale(1.1);
}
</style>

<template>
  <div class="component-tree">
    <div class="header">
      <tree-icon fill="#333" :width="18" />
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
            <svg-icon
              :icon-class="data.display ? 'eye' : 'eye-close'"
              @click.stop="handleNodeDisplay(data, $event)"
            ></svg-icon>
            <svg-icon icon-class="line-trash" @click.stop="handleNodeDel(data, $event)"></svg-icon>
          </div>
        </div>
      </template>
    </el-tree>
  </div>
</template>

<script>
import TreeIcon from './icons/TreeIcon.vue'
export default {
  name: 'ComponentTree',
  components: { TreeIcon },
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
    handleNodeDel(d) {
      this.handleDel && this.handleDel(d)
    },
    handleNodeDisplay(d) {
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
