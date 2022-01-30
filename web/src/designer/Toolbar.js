import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import ToolBarVue from './vue/ToolBar.vue'
import { EVENT_TYPES } from './Event'
import { Command } from './Command'

const {
  CANVAS_ACTIONS_APPEND: C_A_A,
  CANVAS_ACTIONS_DELETE: C_A_D,
  ATTRPANEL_SET_ATTR: A_S_A
} = EVENT_TYPES

export class Toolbar {
  constructor(config, designer) {
    this.name = '__toolbar__'
    this.config = config || {}
    this.__designer__ = designer
    if (!this.config.toolbarWrap) {
      throw new Error('[designer] 请传入工具栏的容器元素')
    }
    this.$toolbarWrapEle = document.querySelector(this.config.toolbarWrap)
    this.commander = new Command(
      {
        OptTypes: [C_A_A, C_A_D, A_S_A],
        onChange: ({ canRedo, canUndo }) => {
          if (canRedo) {
            this.vueInstance.activeNext()
          } else {
            this.vueInstance.deactiveNext()
          }
          if (canUndo) {
            this.vueInstance.activePrev()
          } else {
            this.vueInstance.deactivePrev()
          }
        }
      },
      this.__designer__
    )
  }

  init() {
    const app = createApp(ToolBarVue)
    app.use(ElementPlus)
    this.vueInstance = app.mount(this.config.toolbarWrap)
    this.vueInstance.__toolbar__ = this

    this.commander.listen(({ actions, idx }) => {
      if (actions.length === 1) {
        this.vueInstance.activePrev()
      }
    })

    this.__designer__.on(EVENT_TYPES.KEYBOARD_REDO, this.redo.bind(this))
    this.__designer__.on(EVENT_TYPES.KEYBOARD_UNDO, this.undo.bind(this))

    this.__designer__.emit(EVENT_TYPES.TOOLBAR_INITED)
  }

  undo() {
    this.commander.undo(idx => {
      if (idx === -1) {
        this.vueInstance.deactivePrev()
      } else if (idx < this.commander.size - 1) {
        this.vueInstance.activeNext()
      }
    })
  }

  redo() {
    this.commander.redo(idx => {
      if (idx === this.commander.size - 1) {
        this.vueInstance.deactiveNext()
      }
    })
  }
}
