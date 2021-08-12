const DEFAULT_PRIORITY = 1000

export class Event {
  constructor(name) {
    this.name = name
    this.subs = new Map()
  }

  on(type, priority, cb) {
    if (typeof priority === 'function') {
      cb = priority
      priority = DEFAULT_PRIORITY
    }

    if (typeof priority !== 'number') {
      throw new Error(`Event.on: priority must be a number`)
    }

    const types = typeof type === 'string' ? [type] : type
    for (const t of types) {
      this._onOne(t, priority, cb)
    }
  }

  _onOne(type, priority, cb) {
    const origin = this.subs.get(type)
    if (origin) {
      let index = 0
      for (const item of origin) {
        if (item.priority >= priority) {
          index++
        } else {
          break
        }
      }
      cb.priority = priority
      origin.splice(index, 0, cb)
      this.subs.set(type, origin)
    } else {
      cb.priority = priority
      this.subs.set(type, [cb])
    }
  }

  once(type, priority, cb) {
    if (typeof priority === 'function') {
      cb = priority
      priority = DEFAULT_PRIORITY
    }

    const wrappedCb = (...args) => {
      // 先调用off是因为cb有可能执行报错 导致后面代码不能执行
      this.off(type, wrappedCb)
      const res = cb(...args)
      return res
    }
    this.on(type, priority, wrappedCb)
  }

  off(type, cb) {
    const types = typeof type === 'string' ? [type] : type
    for (const t of types) {
      this._offOne(t, cb)
    }
  }

  _offOne(type, cb) {
    const origin = this.subs.get(type)
    if (cb != undefined) {
      const index = origin.findIndex(i => i === cb)
      if (index > -1) {
        origin.splice(index, 1)
      }
    } else {
      this.subs.set(type, null)
    }
  }

  emit(type, ...args) {
    let res
    const origin = this.subs.get(type)
    if (origin && origin.length) {
      // important: 必须copy一份 因为once的回调会在调用之后off掉，导致原始数组在变短
      const originCopy = origin.slice()
      for (const fn of originCopy) {
        res = fn(...args)
      }
    }
    return res
  }

  // clear all listeners
  _destory() {
    this.subs = new Map()
  }
}

// 定义好各个插件要分发的事件
export const EVENT_TYPES = {
  COMPONENTS_INITED: 'components.inited',
  COMPONENTS_DESTROYED: 'components.destroyed',
  COMPONENTS_DRAG_START: 'components.dragstart',
  COMPONENTS_DROPED: 'components.droped',

  COMPONENT_TREE_INITED: 'componentTree.inited',
  COMPONENT_TREE_DESTROYED: 'componentTree.destroyed',

  CANVAS_INITED: 'canvas.inited',
  CANVAS_LAYOUTED: 'canvas.layouted',
  CANVAS_DESTROYED: 'canvas.destroyed',
  CANVAS_ACTIONS_APPEND: 'canvas.actions.append',
  CANVAS_ACTIONS_DELETE: 'canvas.actions.delete',

  // element 为画布中元素节点
  ELEMENT_CLICK: 'element.click',
  ELEMENT_HOVER: 'element.hover',

  ATTRPANEL_INITED: 'attrpanel.inited',
  ATTRPANEL_DESTROYED: 'attrpanel.destroyed',
  ATTRPANEL_SET_ATTR: 'attrpanel.setAttr',

  TOOLBAR_INITED: 'toolbar.inited',
  TOOLBAR_DESTROYED: 'toolbar.destroyed',

  SELECTION_ACTIVED: 'selection.actived',
  SELECTION_UPDATED: 'selection.updated',
  SELECTION_DEACTIVED: 'selection.deactived',
  SELECTION_DEL_CLICK: 'selection.delClick',
  SELECTION_COPY_CLICK: 'selection.copyClick',
  SELECTION_RESIZE: 'selection.resize',

  HOVER_ACTIVED: 'hover.actived',
  HOVER_UPDATED: 'hover.updated',
  HOVER_DEACTIVED: 'hover.deactived',

  KEYBOARD_UNDO: 'keyboard.undo',
  KEYBOARD_REDO: 'keyboard.redo',
  KEYBOARD_SAVE: 'keyboard.save',

  DRAG_START: 'drag.start',
  DRAG_END: 'drag.end',
  DRAG_DRAG: 'drag.drag',
  DRAG_OVER: 'drag.over',
  DRAG_ENTER: 'drag.enter',
  DRAG_LEAVE: 'drag.leave',
  DRAG_DROPED: 'drag.droped',

  PLUG_INITED: 'plug.inited',
  PLUG_ADDED: 'plug.added',
  PLUG_DESTROYED: 'plug.destroyed',
}
