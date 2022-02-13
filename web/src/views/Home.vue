<style lang="stylus" scoped>
.home {
  height: 100%;

  .header {
    border-bottom: 1px solid #eee;
    padding: 0 8px;
    display: flex;

    .toolbar-wrap {
      // line-height 64px
      width: 100%;
    }
  }

  .content {
    display: flex;
    flex-direction: row;

    .left {
      width: 270px;
      flex: none;
      border-right: 1px solid #eee;
      height: calc(100vh - 57px);

      .component-tepl {
        height: 100%;
      }
    }

    .center {
      flex: 1;

      .canvas-wrap {
        height: calc(100vh - 85px);
        overflow-y: auto;
        background: #ddd;
      }

      .status-bar-wrap {
        height: 30px;
        position: absolute;
        bottom: 0;
        background: #fff;
        width: calc(100% - 550px);
      }
    }

    .right {
      width: 300px;
      padding: 6px;
      border-left: 1px solid #eee;
      height: calc(100vh - 67px);
      overflow-y: auto;

      &::-webkit-scrollbar {
        width: 8px;
        height: 12px;
        background-color: transparent;
      }

      &::-webkit-scrollbar-thumb {
        background-color: #ddd;
        border-radius: 8px;
      }
    }
  }
}
</style>

<template>
  <div class="home">
    <div class="header">
      <div class="toolbar-wrap"></div>
    </div>

    <div class="content">
      <div class="left">
        <div class="component-tepl"></div>
      </div>

      <div class="center">
        <div class="canvas-wrap"></div>
        <div class="status-bar-wrap"></div>
      </div>

      <div class="right">
        <div id="attr"></div>
      </div>
    </div>
  </div>
</template>

<script>
import { createApp, h, nextTick } from 'vue'
import { Designer } from '../designer/index'
import { LoggerPlugin } from '../designer/plugins/logger/index'
import { StatusBar } from '../designer/plugins/status-bar/index'
import { EVENT_TYPES } from '../designer/Event'
import { PLUGIN_TYPES } from '../designer/Plugin'
import ElementPlus from 'element-plus'
import Components from '../designer/vue/Components.vue'
import ComponentTree from '../designer/vue/ComponentTree.vue'
import ToolBar from '../designer/vue/ToolBar.vue'
import AttrPanel from '../designer/vue/AttrPanel.vue'

export default {
  name: 'Home',
  mounted() {
    const renderComponents = () => {
      const app = createApp(Components)
      app.use(ElementPlus)
      return app.mount('.component-tepl')
    }
    const renderToolbar = () => {
      const app = createApp(ToolBar)
      return app.mount('.toolbar-wrap')
    }
    const renderAttr = () => {
      const app = createApp(AttrPanel)
      app.use(ElementPlus)
      return app.mount('#attr')
    }
    const renderComponentTree = ({ props, propsArr }) => {
      const app = createApp({
        props: propsArr,
        render: () => h(ComponentTree, props)
      })
      app.use(ElementPlus)
      return app.mount('.component-tree-wrap')
    }

    this.designer = new Designer({
      renderComponents,
      renderToolbar,
      renderAttr,
      renderComponentTree,
      canvasWrap: '.canvas-wrap',
      plugins: [LoggerPlugin, StatusBar]
    })
    this.designer.__vueApp__ = this
    // for debug
    window.designer = this.designer

    // 处理插件，为插件设置容器dom
    for (let plug of this.designer.__plug__.plugins.values()) {
      const { p: plugInstance, type, name } = plug
      if (name === 'StatusBar') {
        plugInstance.init('.status-bar-wrap')
      }
      if (type === PLUGIN_TYPES.MENU_BAR) {
        // 插件需要提供一个图标（svg文件路径）和一个init方法（参数为dom容器或选择器）
        this.designer.on(EVENT_TYPES.COMPONENTS_UI_INITED, () => {
          const wrapName = this.designer.__components__.uiInstance.addPlugin(plug)
          nextTick(() => {
            plugInstance.init(wrapName)
          })
        })
      }
    }
  }
}
</script>
