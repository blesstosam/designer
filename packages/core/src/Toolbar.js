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

  init(renderUI) {
    this.uiInstance = renderUI()
    this.uiInstance.__designer__ = this.__designer__

    this.commander.listen(({ actions, idx }) => {
      if (actions.length === 1) {
        this.uiInstance.activePrev()
      }
    })

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
    const arr = this.__canvas__.model.children
    const origin = []
    const traverse = (_arr, _origin) => {
      for (let i = 0; i < _arr.length; i++) {
        const item = _arr[i]
        if (item.props.nativeEvent) {
          item.props.events = {}
          const eventArr = JSON.parse(item.props.nativeEvent)
          for (const event of eventArr) {
            item.props.events[event.name] = event.code
          }
          delete item.props.nativeEvent
        }
        _origin.push({
          attrs: item.attrs,
          children: [],
          componentType: item.componentType,
          icon: item.icon,
          isCustom: item.isCustom,
          componentName: item.componentName,
          framework: item.framework,
          props: item.props,
          title: item.title,
          unique: item.unique,
          slotName: item.slotName
        })
        if (item.children && item.children.length) {
          traverse(item.children, _origin[i].children)
        }
      }
    }

    traverse(arr, origin)
    return origin
  }
}
