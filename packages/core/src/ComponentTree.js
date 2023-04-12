import { EVENT_TYPES } from './Event'
const { CANVAS_ACTIONS_DELETE, CANVAS_ACTIONS_APPEND } = EVENT_TYPES

export class ComponentTree {
  constructor(config, designer) {
    this.name = '__componentTree__'
    this.config = config || {}
    this.__designer__ = designer
    this.componentTreeWrapEle = document.querySelector(this.config.componentTreeWrap)

    this.__designer__.on([CANVAS_ACTIONS_DELETE, CANVAS_ACTIONS_APPEND], (payload) => {
      const {
        type,
        viewModel: { children = [] }
      } = payload
      this.setData([...children])
    })
  }

  get __canvas__() {
    return this.__designer__.__canvas__
  }

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
    this.ui?.setCurrentKey(key)
  }
  setData(d) {
    this.ui?.setData(d)
  }
}
