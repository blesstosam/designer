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
    this.commander = new Command(
      {
        OptTypes: [C_A_A, C_A_D, A_S_A],
        onChange: ({ canRedo, canUndo }) => {
          if (canRedo) {
            this.uiInstance.activeNext()
          } else {
            this.uiInstance.deactiveNext()
          }
          if (canUndo) {
            this.uiInstance.activePrev()
          } else {
            this.uiInstance.deactivePrev()
          }
        }
      },
      this.__designer__
    )
  }

  init(renderUI) {
    this.uiInstance = renderUI()
    this.uiInstance.__designer__ = this.__designer__
    this.$wrapEl = this.uiInstance.$el.parentNode

    this.commander.listen(({ actions, idx }) => {
      if (actions.length === 1) {
        this.uiInstance.activePrev()
      }
    })

    this.__designer__.on(EVENT_TYPES.KEYBOARD_REDO, this.redo.bind(this))
    this.__designer__.on(EVENT_TYPES.KEYBOARD_UNDO, this.undo.bind(this))

    this.__designer__.emit(EVENT_TYPES.TOOLBAR_INITED)
  }

  undo() {
    this.commander.undo((idx) => {
      if (idx === -1) {
        this.uiInstance.deactivePrev()
      } else if (idx < this.commander.size - 1) {
        this.uiInstance.activeNext()
      }
    })
  }

  redo() {
    this.commander.redo((idx) => {
      if (idx === this.commander.size - 1) {
        this.uiInstance.deactiveNext()
      }
    })
  }
}
