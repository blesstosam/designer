export class Event {
  constructor(name) {
    this.name = name
    this.subs = new Map()
  }

  // TODO 目前监听是按照监听的先后来插入数组的，可以通过权重参数来实现插队，即权重大的监听先执行
  on(type, cb) {
    if (typeof type === 'string') {
      this.onSingle(type, cb)
    } else if (Array.isArray(type)) {
      for (const t of type) {
        this.onSingle(t, cb)
      }
    } else {
      throw new Error(`Event.on: ${type} invalid, please pass a string or a array`)
    }
  }

  onSingle(type, cb) {
    const origin = this.subs.get(type)
    if (origin) {
      this.subs.set(type, [...origin, cb])
    } else {
      this.subs.set(type, [cb])
    }
  }

  once(type, cb) {
    const wrappedCb = (...args) => {
      // 先调用off是因为cb有可能执行报错 导致后面代码不能执行
      this.off(type, wrappedCb)
      const res = cb(...args)
      return res
    }
    this.on(type, wrappedCb)
  }

  off(type, cb) {
    if (typeof type === 'string') {
      this.offSingle(type, cb)
    } else if (Array.isArray(type)) {
      for (const t of type) {
        this.offSingle(t, cb)
      }
    } else {
      throw new Error(`Event.off: ${type} invalid, please pass a string or a array`)
    }
  }

  offSingle(type, cb) {
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
    const origin = this.subs.get(type)
    if (origin && origin.length) {
      for (const fn of origin) {
        fn(...args)
      }
    }
  }
}

// 定义好各个插件要分发的事件
export const EVENT_TYPES = {
  COMPONENTS_INITED: 'components.inited',
  COMPONENTS_DRAG: 'components.drag',
  COMPONENTS_DROPED: 'components.droped',
  COMPONENTS_DESTROYED: 'components.destroyed',

  COMPONENT_TREE_INITED: 'componentTree.inited',
  COMPONENT_TREE_DESTROYED: 'componentTree.destroyed',

  CANVAS_INITED: 'canvas.inited',
  CANVAS_LAYOUTED: 'canvas.layouted',
  CANVAS_DESTROYED: 'canvas.destroyed',
  CANVAS_ACTIONS_APPEND: 'canvas.actions.append',
  CANVAS_ACTIONS_DELETE: 'canvas.actions.delete',

  ATTRPANEL_INITED: 'attrpanel.inited',
  ATTRPANEL_DESTROYED: 'attrpanel.destroyed',
  ATTRPANEL_SET_ATTR: 'attrpanel.setAttr',

  TOOLBAR_INITED: 'toolbar.inited',
  TOOLBAR_DESTROYED: 'toolbar.destroyed',

  SELECTION_INITED: 'selection.inited',
  SELECTION_UPDATED: 'selection.updated',
  SELECTION_DESTROYED: 'selection.destroyed',
  SELECTION_DEL_CLICK: 'selection.delClick',
  SELECTION_COPY_CLICK: 'selection.copyClick',

  KEYBOARD_UNDO: 'keyboard.undo',
  KEYBOARD_REDO: 'keyboard.redo',
  KEYBOARD_SAVE: 'keyboard.save',

  DRAG_START: 'drag.start',
  DRAG_END: 'drag.end',
  DRAG_OVER: 'drag.over',
  DRAG_ENTER: 'drag.enter',
  DRAG_LEAVE: 'drag.leave',
  DRAG_DROPED: 'drag.droped'
}
