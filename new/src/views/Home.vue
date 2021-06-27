<style lang="stylus">
.home
  height 100%;
  .header
    border-bottom : 1px solid #eee;
    padding: 0 8px;
    display: flex;
    .toolbar-wrap
      // line-height 64px
      width: 100%
  .content
    padding: 0 8px;
    display: flex;
    flex-direction: row;
    .left
      width: 220px;
      border-right: 1px solid #eee;
      .component-tepl {
        min-height 300px
      }
    .center
      flex: 1
      .canvas-wrapper
        height: calc(100vh - 55px)
        overflow-y: auto
        background #ddd
    .right
      width: 300px
      padding: 6px
      border-left: 1px solid #eee
      height: calc(100vh - 67px)
      overflow-y: auto
</style>

<template>
  <div class="home">
    <div class="header">
      <div class="toolbar-wrap"></div>
    </div>
    <div class="content">
      <div class="left">
        <div class="component-tepl">
          <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="组件库" name="component">
              <div class="component-wrap"></div>
            </el-tab-pane>
            <el-tab-pane label="模板" name="template">模板</el-tab-pane>
          </el-tabs>
        </div>
        <div class="component-tree-wrap"></div>
      </div>
      <div class="center">
        <div class="canvas-wrapper"></div>
      </div>
      <div class="right">
        <div id="attr"></div>
      </div>
    </div>
  </div>
</template>

<script>
import { onMounted, reactive, ref } from 'vue'
import { Designer, componentList } from '../designer/index'

export default {
  name: 'Home',
  mounted() {
    console.log('mounted...')
    this.designer = new Designer({
      componentWrap: '.component-wrap',
      canvasWrap: '.canvas-wrapper',
      toolbarWrap: '.toolbar-wrap',
      attrWrap: '#attr',
      componentTreeWrap: '.component-tree-wrap'
    })
    this.designer.__vueApp__ = this
    // for debug
    window.designer = this.designer
    for (const com of componentList) {
      this.designer.__component__.registerComponent(com)
    }
  },
  setup() {
    const activeName = ref('component')

    const handleClick = (tab, event) => {
      // console.log(tab, event, activeName.value)
    }

    return {
      activeName,
      handleClick
    }
  }
}
</script>
