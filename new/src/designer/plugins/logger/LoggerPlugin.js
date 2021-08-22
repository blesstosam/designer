import { createApp, reactive, h } from 'vue'
import { EVENT_TYPES } from '../../Event'
import LoggerPluginVue from './LoggerPlugin.vue'
import { ElTooltip } from 'element-plus'

const {
  CANVAS_ACTIONS_APPEND: C_A_A,
  CANVAS_ACTIONS_DELETE: C_A_D,
  ATTRPANEL_SET_ATTR: A_S_A
} = EVENT_TYPES

export class LoggerPlugin {
  constructor(attr) {
    this.__attr__ = attr
  }

  get __designer__() {
    return this.__attr__.__designer__
  }

  init(wrap) {
    const props = reactive({
      logs: [],
      ref: 'loggerWrap'
    })
    const app = createApp({
      props: ['logs', 'ref'],
      render: () => h(LoggerPluginVue, props)
    }).component(ElTooltip.name, ElTooltip)

    this.vueInstance = app.mount(document.querySelector(wrap))
    this.vueInstance.__componentTree__ = this

    this.__designer__.on([C_A_A, C_A_D, A_S_A], d => {
      console.log('logger...', d)
      const { type, data } = d
      let title = ''
      if (type === C_A_A) {
        title = `插入${data.title}`
      } else if (type === C_A_D) {
        title = `删除${data.title}`
      } else {
        title = `设置${data.item.title || data.item.id}为${data.val}`
      }
      props.logs.push({
        title,
        timestamp: new Date()
          .toISOString()
          .split('.')
          .shift()
          .replace('T', ' ')
      })
    })
  }
}

LoggerPlugin.$inject = ['__attr__']
LoggerPlugin.$name = 'myLoggerPlugin'
LoggerPlugin.$type = 'menuBar'
