<style scoped>
.component-tree {
  border-top: 1px solid #eee;
}
.component-tree .header {
  border-bottom: 1px solid #dedede;
  padding: 6px 0;
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
      default-expand-all
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
            v-if="data.componentName!=='Page'"
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
export default {
  name: 'ComponentTree',
  props: {
    tree: Array
  },
  created() {
    this.innerTree = this.tree
  },
  data() {
    return {
      innerTree: [],
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
      const tree = this.innerTree || []
      const treeData = [
        {
          componentName: 'Page',
          title: '页面',
          unique: 'Page',
          children: [],
          display: true
        }
      ]
      for (const t of tree) {
        const item = {
          name: t.componentName,
          title: t.title,
          unique: t.unique,
          icon: t.icon,
          children: [],
          display: true
        }
        treeData[0].children.push(item)
        if (t.children) {
          const _d = []
          for (const _t of t.children) {
            _d.push({
              name: _t.componentName,
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
    },
    // tree() {
    //   const data = this.__canvas__?.model
    //   return data?.children||[]
    // },
    __componentTree__() {
      return this.__designer__.__componentTree__
    },
    __canvas__() {
      return this.__designer__?.__canvas__
    }
  },
  methods: {
    // 必须实现的api
    setCurrentKey(key) {
      this.$refs.tree.setCurrentKey(key)
    },
    setData(d) {
      this.innerTree = d
    },

    handleNodeClick(d) {
      if (d.componentName === 'Page') {
        this.__componentTree__.selectPage()
      } else {
        this.__componentTree__.selectNode(d)
      }
    },
    handleNodeDel(d) {
      this.__componentTree__.delNode(d)
    },
    handleNodeDisplay(d) {
      d.display = !d.display
      this.__componentTree__.toggleNodeDisplay(d, d.display)
    },
    handleNodeMouseEnter(d) {
      this.actionShowRow = d.$treeNodeId
      this.__componentTree__.hoverNode(d)
    },
    handleNodeMouseLeave(d) {
      this.actionShowRow = -1
      this.__componentTree__.removeNodeHover()
    }
  }
}
</script>
