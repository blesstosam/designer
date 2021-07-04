import { Event, EVENT_TYPES } from './Event.js'
import { componentList } from './config.js'
import { Canvas } from './Canvas.js'
import { Attr } from './Attr.js'
import { Components } from './Components.js'
import { ComponentTree } from './ComponentTree.js'
import { Toolbar } from './Toolbar.js'

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

    // TODO 处理 plugins

    this.on('drop', (ctx, params) => {
      console.log(ctx, params)
    })
  }

  initCanvas() {
    // 画布里的组件依赖左侧组件的注册，有先后关系
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
    this.config.componentTreeWrap = wrap
    this.__componentTree__ = new ComponentTree(this.config, this)
    this.__componentTree__.init(viewModel)
  }
}

export { Designer, componentList }
