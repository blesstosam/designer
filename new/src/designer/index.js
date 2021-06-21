import { Event } from './Event.js'
import { componentList } from './config.js'
import { Canvas } from './Canvas.js'
import { Attr } from './Attr.js'
import { Component } from './Component.js'
import { ComponentTree } from './ComponentTree.js'
import { Toolbar } from './Toolbar.js'

// 页面模型数据 应该是一个 json 或 json schema
// 参考 virtual dom 树型数据结构 =>
// { tag: 'div', { style: { width: '50%' } },  children: [ text : 'Hello'] }
// 然后把 tag 换成 componentName，把布局 css 换成特定的约定 比如 column span 等
let viewModel = null
try {
  viewModel = JSON.parse(localStorage.getItem('viewModel'))
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
    this.__canvas__ = new Canvas(this.config, this)
    this.__canvas__.init(viewModel)
    this.__attr__ = new Attr(this.config, this)
    this.__attr__.init()
    this.__component__ = new Component(this.config, this)
    this.__toolbar__ = new Toolbar(this.config, this)
    this.__toolbar__.init()
    this.__componentTree__ = new ComponentTree(this.config, this)
    this.__componentTree__.init(viewModel)
    this.on('drop', (ctx, params) => {
      console.log(ctx, params)
    })
  }
}

export { Designer, componentList }
