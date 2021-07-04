// 封装消息总线 发布订阅模式
export class Event {
  constructor(name) {
    this.name = name
    this.subs = new Map()
  }

  // type can be a array
  on(type, cb) {
    if (typeof type === 'string') {
      this.onSingle(type, cb)
    } else if (Array.isArray(type)) {
      for (const t of type) {
        this.onSingle(t, cb)
      }
    } else {
      console.error(`Event.on: ${type} invalid, please pass a string or a array`)
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

  off(type, cb) {
    const origin = this.subs.get(type)
    if (cb) {
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
        fn.call(this, ...args)
      }
    }
  }
}

// 定义好各个插件要分发的事件
export const EVENT_TYPES = {
  COMPONENTS_INITED: 'components.inited',
  COMPONENTS_DESTROYED: 'components.destroyed',

  COMPONENT_TREE_INITED: 'componentTree.inited',
  COMPONENT_TREE_DESTROYED: 'componentTree.destroyed',

  CANVAS_INITED: 'canvas.inited',
  CANVAS_DESTROYED: 'canvas.destroyed',
  CANVAS_ACTIONS_APPEND: 'canvas.actions.append',
  CANVAS_ACTIONS_DELETE: 'canvas.actions:.elete',

  ATTRPANEL_INITED: 'attrpanel.inited',
  ATTRPANEL_DESTROYED: 'attrpanel.destroyed',
  ATTRPANEL_SET_ATTR: 'attrpanel.setAttr',

  TOOLBAR_INITED: 'toolbar.inited',
  TOOLBAR_DESTROYED: 'toolbar.destroyed',

  FOCUS_INITED: 'focus.inited',
  FOCUS_UPDATED: 'focus.updated',
  FOCUS_DESTROYED: 'focus.destroyed',
  FOCUS_DEL_CLICK: 'focus.delClick',
  FOCUS_COPY_CLICK: 'focus.copyClick',
}
