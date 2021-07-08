import { Event, EVENT_TYPES } from './Event.js'
import { Canvas } from './Canvas.js'
import { Attr } from './Attr.js'
import { Components } from './Components.js'
import { ComponentTree } from './ComponentTree.js'
import { Toolbar } from './Toolbar.js'
import { KeyBoard } from './Keyboard'
import { Plugin } from './Plugin.js'

// 页面模型数据 应该是一个 json 或 json schema
// 参考 virtual dom 树型数据结构 =>
// { tag: 'div', { style: { width: '50%' } },  children: [ text : 'Hello'] }
// 然后把 tag 换成 componentName，把布局 css 换成特定的约定 比如 column span 等
let viewModel = null
try {
  viewModel = JSON.parse(localStorage.getItem('viewModel')) || []
} catch (e) {
  viewModel = []
}

class Designer extends Event {
  constructor(config) {
    super()
    this.config = config
    this.init()
  }

  init() {
    this.initComponents()

    this.initCanvas()

    this.initAttr()

    this.initToolbar()

    this.initKeyboard()

    this.initPluginSystem()

    this.on('drop', (ctx, params) => {
      console.log(ctx, params)
    })
  }

  initCanvas() {
    this.__canvas__ = new Canvas(this.config, this)
    this.__canvas__.init(viewModel)
  }

  initAttr() {
    this.__attr__ = new Attr(this.config, this)
    this.__attr__.init()
  }

  initComponents() {
    this.__components__ = new Components(this.config, this)
    this.__components__.init()
  }

  initToolbar() {
    this.__toolbar__ = new Toolbar(this.config, this)
    this.__toolbar__.init()
  }

  initComponentTree(wrap) {
    // 组件树依赖1.components组件dom渲染完成 2.canvas将组件渲染完成
    this.config.componentTreeWrap = wrap
    this.on(EVENT_TYPES.CANVAS_LAYOUTED, () => {
      const viewModel = this.__canvas__.model.data
      this.__componentTree__ = new ComponentTree(this.config, this)
      this.__componentTree__.init(viewModel)
    })
  }

  initKeyboard() {
    this.__keyboard__ = new KeyBoard()
    this.__keyboard__.bind('keydown')
    this.__keyboard__.add(EVENT_TYPES.KEYBOARD_UNDO, e => {
      console.log('keyboard.undo')
      this.emit(EVENT_TYPES.KEYBOARD_REDO)
    })
    this.__keyboard__.add(EVENT_TYPES.KEYBOARD_REDO, e => {
      console.log('keyboard.redo')
      this.emit(EVENT_TYPES.KEYBOARD_REDO)
    })
  }

  initPluginSystem() {
    this.__plug__ = new Plugin(this.config, this)
    const plugs = this.config.plugins || []
    for (const p of plugs) {
      this.__plug__.add(p)
    }
  }
}

export { Designer }
