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
      flex-shrink: 0;
      border-right: 1px solid #eee;
      height: calc(100vh - 62px);
      box-sizing: border-box;

      .component-tepl {
        height: 100%;
      }
    }

    .center {
      flex: 1;

      .canvas-wrap {
        height: calc(100vh - 64px);
        overflow-y: auto;
        background: #ddd;
        padding: 8px 8px;
        box-sizing: border-box;
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
      width: 320px;
      padding: 6px 0;
      border-left: 1px solid #eee;
      height: calc(100vh - 62px);
      overflow-y: auto;
      flex-shrink: 0;
      box-sizing: border-box;

      .status-bar-wrap {
        //border-bottom: 1px solid #dedede;
        font-size: 13px;
        margin-top: -6px;
      }

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
      <div class="toolbar-wrap">
        <ToolBar :mounted="mounted" />
      </div>
    </div>

    <div class="content">
      <div class="left">
        <div class="component-tepl">
          <Components :mounted="mounted" />
        </div>
      </div>

      <div class="center">
        <div class="canvas-wrap"></div>
      </div>

      <div class="right">
        <div class="status-bar-wrap"></div>
        <div id="attr">
          <AttrPanel :mounted="mounted" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { nextTick, onMounted, ref } from 'vue'
import { LoggerPlugin } from '../designer/plugins/logger/index'
import { StatusBar } from '../designer/plugins/status-bar/index'
import Components from '../designer/vue/Components.vue'
import ComponentTree from '../designer/vue/ComponentTree.vue'
import ToolBar from '../designer/vue/ToolBar.vue'
import AttrPanel from '../designer/vue/AttrPanel.vue'
import { registerGlobalFn } from '../main'
import { Designer } from '@davincid/core/src/index'
import { PLUGIN_TYPES } from '@davincid/core/src/Plugin'

export default {
  name: 'Home',
  components: {
    ToolBar,
    Components,
    ComponentTree,
    AttrPanel
  },
  setup() {
    const mounted = ref(false)

    let designer = null
    onMounted(() => {
      designer = new Designer({
        canvasWrap: '.canvas-wrap',
        plugins: [LoggerPlugin, StatusBar]
      })
      // for debug
      window.designer = designer

      // 处理插件，为插件设置容器dom
      for (let plug of designer.__plug__.plugins.values()) {
        const { p: plugInstance, type, name, deps } = plug
        if (name === 'StatusBar') {
          plugInstance.init('.status-bar-wrap')
        }
        if (type === PLUGIN_TYPES.MENU_BAR) {
          // 插件需要提供一个图标（svg文件路径）和一个init方法（参数为dom容器或选择器）
          designer.on(deps, () => {
            const wrapName = designer.__components__.addPlugin(plug)
            nextTick(() => {
              plugInstance.init(wrapName)
            })
          })
        }
      }

      registerGlobalFn('__designer__', designer)

      mounted.value = true
    })

    return {
      mounted
    }
  }
}
</script>
