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
        bottom 0;
        background #fff;
        width: calc(100% - 550px)
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
import { Designer } from '../designer/index'
import { LoggerPlugin } from '../designer/plugins/logger/index'
import { StatusBar } from '../designer/plugins/status-bar/index.js'

export default {
  name: 'Home',
  mounted() {
    this.designer = new Designer({
      componentsWrap: '.component-tepl',
      canvasWrap: '.canvas-wrap',
      toolbarWrap: '.toolbar-wrap',
      attrWrap: '#attr',
      plugins: [LoggerPlugin, StatusBar]
    })
    this.designer.__vueApp__ = this
    // for debug
    window.designer = this.designer
    
    // handle plugins
    for (let plug of designer.__plug__.plugins.values()) {
       const { p: plugInstance, name } = plug
       if (name === 'StatusBar') {
         plugInstance.init('.status-bar-wrap')
       }
    }
  }
}
</script>
