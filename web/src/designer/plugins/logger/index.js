import { createApp, reactive, h } from 'vue'
import { EVENT_TYPES } from '../../Event'
import LoggerPluginVue from './LoggerPlugin.vue'
import { ElTooltip } from 'element-plus'
import { PLUGIN_TYPES } from '../../Plugin'

const {
  CANVAS_ACTIONS_APPEND: C_A_A,
  CANVAS_ACTIONS_PREPEND: C_A_P,
  CANVAS_ACTIONS_AFTER: C_A_AFTER,
  CANVAS_ACTIONS_BEFORE: C_A_BEFORE,
  CANVAS_ACTIONS_DELETE: C_A_D,
  CANVAS_ACTIONS_CLEAR: C_A_C,
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

    this.uiInstance = app.mount(document.querySelector(wrap))

    this.__designer__.on([C_A_A, C_A_P, C_A_AFTER, C_A_BEFORE, C_A_D, A_S_A, C_A_C], d => {
      console.log('logger...', d)
      const { type, data } = d
      let title = ''
      if ([C_A_A, C_A_P, C_A_AFTER, C_A_BEFORE, C_A_D].includes(type)) {
        const map = {
          [C_A_A]: 'APPEND',
          [C_A_P]: 'PREPEND',
          [C_A_AFTER]: 'AFTER',
          [C_A_BEFORE]: 'BEFORE',
          [C_A_D]: '删除'
        }
        const actionName = map[type]
        title = `${actionName}${data.title}`
      } else if (type === C_A_C) {
        title = '清空画布'
      } else {
        title = `设置${data.item.title || data.item.id}为${data.val}`
      }
      props.logs.unshift({
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
LoggerPlugin.$name = 'MyLoggerPlugin'
LoggerPlugin.$type = PLUGIN_TYPES.MENU_BAR
LoggerPlugin.$deps = [EVENT_TYPES.COMPONENTS_UI_INITED] // 依赖的事件
