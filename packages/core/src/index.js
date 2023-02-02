import { Event, EVENT_TYPES } from './Event'
import { Canvas } from './Canvas'
import { Attr } from './Attr'
import { Components } from './Components'
import { ComponentTree } from './ComponentTree'
import { Toolbar } from './Toolbar'
import { KeyBoard } from './Keyboard'
import { Plugin } from './Plugin'
import { Dragon } from './Dragon'
import { Cursor } from './Cursor'

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
  }

  initComponents() {
    this.__dragon__ = new Dragon({}, this)
    this.__components__ = new Components(this.config, this)
  }

  initToolbar() {
    this.__toolbar__ = new Toolbar(this.config, this)
  }

  initComponentTree() {
    this.__componentTree__ = new ComponentTree(this.config, this)
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
      this.__plug__.register(p)
    }
  }
}

export { Designer }
