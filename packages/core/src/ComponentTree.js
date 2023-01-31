import { EVENT_TYPES } from './Event'
const { CANVAS_ACTIONS_DELETE, CANVAS_ACTIONS_APPEND } = EVENT_TYPES

export class ComponentTree {
  constructor(config, designer) {
    this.name = '__componentTree__'
    this.config = config || {}
    this.__designer__ = designer
    this.$componentTreeWrapEle = document.querySelector(this.config.componentTreeWrap)
  }

  get __canvas__() {
    return this.__designer__.__canvas__
  }

  init(renderUI) {
    const data = this.__canvas__.model
    // 初始化UI的时候可以传递参数
    this.uiInstance = renderUI({
      props: { tree: (data && data.children) || [] }
    })

    this.uiInstance.__designer__ = this.__designer__
    this.$wrapEl = this.uiInstance.$el.parentNode
    this.__designer__.on([CANVAS_ACTIONS_DELETE, CANVAS_ACTIONS_APPEND], (payload) => {
      const {
        type,
        viewModel: { children = [] }
      } = payload
      this.setData([...children])
    })
  }

  // ui 可以调用 core 的方法，core 也可以调用 ui 的方法(即ui必须实现该方法，如果没有实现就报错)
  // core => init UI(listen core data change & provide some method) => mount UI => call core method
  // core => update data => update ui
  // core => call ui method

  selectPage() {
    this.__canvas__.handleNodeboxSelect(this.__canvas__.model)
  }
  selectNode(d) {
    const node = this.__canvas__.model.findByKey('unique', d.unique)
    if (node) this.__canvas__.handleNodeboxSelect(node)
  }
  delNode(d) {
    const node = this.__canvas__.model.findByKey('unique', d.unique)
    if (node) this.__canvas__.remove(node)
  }
  toggleNodeDisplay(d, isShow) {
    const node = this.__canvas__.model.findByKey('unique', d.unique)
    if (node) this.__canvas__.toggleDisplay(node, isShow)
  }
  hoverNode(d) {
    const node = this.__canvas__.model.findByKey('unique', d.unique)
    if (node) this.__canvas__.handleNodeboxHover(node)
  }
  removeNodeHover() {
    this.__canvas__.hover?.remove()
  }
  setCurrentKey(key) {
    if (this.uiInstance && this.uiInstance.setCurrentKey) {
      this.uiInstance.setCurrentKey(key)
    } else {
      throw new Error('componentTree UI need to implement setCurrentKey method')
    }
  }
  setData(d) {
    if (this.uiInstance && this.uiInstance.setData) {
      this.uiInstance.setData(d)
    } else {
      throw new Error('componentTree UI need to implement setData method')
    }
  }
}
