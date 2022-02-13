import { Event, EVENT_TYPES } from './Event'
import { Canvas } from './Canvas'
import { Attr } from './Attr'
import { Components } from './Components'
import { ComponentTree } from './ComponentTree'
import { Toolbar } from './Toolbar'
import { KeyBoard } from './Keyboard'
import { Plugin } from './Plugin'
import { DragDrop } from './DragDrop'
import { Cursor } from './Cursor'

// 页面模型数据 应该是一个 json 或 json schema
// 参考 virtual dom 树型数据结构 =>
// { tag: 'div', { style: { width: '50%' } },  children: [ text : 'Hello'] }
// 然后把 tag 换成 componentName，把布局 css 换成特定的约定 比如 column span 等
let viewModel = null
try {
  viewModel = JSON.parse(localStorage.getItem('viewModel'))
} catch (e) {
  viewModel = null
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

    this.initComponentTree()

    this.initAttr()

    this.initToolbar()

    this.initKeyboard()

    this.initCursor()

    this.initPluginSystem()
  }

  initCanvas() {
    this.__canvas__ = new Canvas(this.config, this)
    this.__canvas__.init(viewModel)
  }

  initAttr() {
    this.__attr__ = new Attr(this.config, this)
    this.__attr__.init(this.config.renderAttr)
  }

  initComponents() {
    this.__dragDrop__ = new DragDrop({}, this)
    this.__components__ = new Components(this.config, this)
    this.__components__.init(this.config.renderComponents)
  }

  initToolbar() {
    this.__toolbar__ = new Toolbar(this.config, this)
    this.__toolbar__.init(this.config.renderToolbar)
  }

  initComponentTree() {
    // 组件树依赖
    // 1.components组件dom渲染完成
    // 2.canvas将组件渲染完成
    let index = 0
    this.on([EVENT_TYPES.CANVAS_LAYOUTED, EVENT_TYPES.COMPONENTS_UI_INITED], () => {
      index++
      if (index === 2) {
        this.__componentTree__ = new ComponentTree(this.config, this)
        this.__componentTree__.init(this.config.renderComponentTree)
      }
    })
  }

  initKeyboard() {
    this.__keyboard__ = new KeyBoard()
    this.__keyboard__.bind('keydown')
    this.__keyboard__.onUndo((e) => {
      console.log('keyboard.undo')
      this.emit(EVENT_TYPES.KEYBOARD_UNDO)
    })
    this.__keyboard__.onRedo((e) => {
      console.log('keyboard.redo')
      this.emit(EVENT_TYPES.KEYBOARD_REDO)
    })
  }

  initCursor() {
    this.__cursor__ = new Cursor(this.config, this)
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
