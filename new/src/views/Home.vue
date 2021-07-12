<style lang="stylus">
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
      width: 280px;
      border-right: 1px solid #eee;

      .component-tepl {
        height: 100%;
      }
    }

    .center {
      flex: 1;

      .canvas-wrapper {
        height: calc(100vh - 55px);
        overflow-y: auto;
        background: #ddd;

        // .dragenter-actived {
        //   border: 1px solid red
        // }
      }
    }

    .right {
      width: 300px;
      padding: 6px;
      border-left: 1px solid #eee;
      height: calc(100vh - 67px);
      overflow-y: auto;
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
        <div class="canvas-wrapper"></div>
      </div>

      <div class="right">
        <div id="attr"></div>
      </div>
    </div>
  </div>
</template>

<script>
import { Designer } from '../designer/index'
import { LoggerPlugin } from '../designer/plugins/LoggerPlugin'

export default {
  name: 'Home',
  mounted() {
    console.log('mounted...')
    this.designer = new Designer({
      componentsWrap: '.component-tepl',
      canvasWrap: '.canvas-wrapper',
      toolbarWrap: '.toolbar-wrap',
      attrWrap: '#attr',
      plugins: [LoggerPlugin]
    })
    this.designer.__vueApp__ = this
    // for debug
    window.designer = this.designer
  }
}
</script>
