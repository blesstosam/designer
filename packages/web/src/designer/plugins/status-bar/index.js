import { createApp, reactive, h } from 'vue'
import { ElTooltip } from 'element-plus'
import StatusBarVue from './StatusBar.vue'
import { EVENT_TYPES } from '@davincid/core/src/Event'
import { PLUGIN_TYPES } from '@davincid/core/src/Plugin'

const {
  SELECTION_ACTIVED,
  SELECTION_UPDATED,
  SELECTION_DEACTIVED
} = EVENT_TYPES

export class StatusBar {
  constructor(canvas) {
    this.__canvas__ = canvas
  }

  get __designer__() {
    return this.__canvas__.__designer__
  }
  get selection() {
    return this.__canvas__.selection
  }

  init(wrap) {
    const props = reactive({
      pathArr: [],
    })
    const app = createApp({
      props: ['pathArr'],
      render: () => h(StatusBarVue, props)
    }).component(ElTooltip.name, ElTooltip)

    this.uiInstance = app.mount(document.querySelector(wrap))

    const getParentTitle= (node, arr) => {
      node.title && arr.unshift(node.title)
      if (node.parent) {
        getParentTitle(node.parent, arr)
      }
    }

    this.__designer__.on([SELECTION_ACTIVED, SELECTION_UPDATED], (node) => {
      if (node) {
        const pathArr = []
        getParentTitle(node, pathArr)
        props.pathArr = [...pathArr]
      }
    })
  }
}

StatusBar.$inject = ['__canvas__']
StatusBar.$name = 'StatusBar'
StatusBar.$type = PLUGIN_TYPES.UI
StatusBar.$deps = [] // 依赖的事件
