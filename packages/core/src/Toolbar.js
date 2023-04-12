import { EVENT_TYPES } from './Event'
import { Command } from './Command'

const { CANVAS_ACTIONS_APPEND, CANVAS_ACTIONS_DELETE, ATTRPANEL_SET_ATTR } = EVENT_TYPES

export class Toolbar {
  constructor(config, designer) {
    this.name = '__toolbar__'
    this.config = config || {}
    this.__designer__ = designer
    this.commander = new Command(
      {
        CommandTypes: [CANVAS_ACTIONS_APPEND, CANVAS_ACTIONS_DELETE, ATTRPANEL_SET_ATTR]
      },
      this.__designer__
    )
  }

  get __canvas__() {
    return this.__designer__.__canvas__
  }

  triggerUIInit() {
    this.__designer__.on(EVENT_TYPES.KEYBOARD_REDO, this.redo.bind(this))
    this.__designer__.on(EVENT_TYPES.KEYBOARD_UNDO, this.undo.bind(this))
    this.__designer__.emit(EVENT_TYPES.TOOLBAR_INITED)
  }

  undo(cb) {
    this.commander.undo(cb)
  }

  redo(cb) {
    this.commander.redo(cb)
  }

  transform() {
    return this.__canvas__.model.export()
  }
}
