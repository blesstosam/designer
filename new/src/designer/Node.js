import { randomString } from './lib/util'

export class Node {
  constructor(node, parent) {
    this.__version__ = '1.0.0'
    this.name = node.name
    this.title = node.title
    this.unique = node.unique || randomString()
    this.icon = node.icon
    node.componentType && (this.componentType = node.componentType)
    this.props = node.props
    this.attrs = node.attrs
    this.$el = node.$el
    node.isRoot && (this.isRoot = node.isRoot)

    this.children = []
    parent && (this.parent = parent)

    this.accept = node.accept
    this.isBlock = !!node.isBlock
    node.slotName && (this.slotName = node.slotName)
    this.vm = node.vm

    // 是否是自定义组件
    this.isCustom = !!node.isCustom
    node.customData && (this.customData = node.customData)

    // 物料组件分类，从组件颗粒度来划分 Component|Block|Template
    node.category && (this.category = node.category)

    // function
    this.render = node.render
    node.transformProps && (this.transformProps = node.transformProps)
  }

  get index() {
    if (this.parent) {
      return this.parent.children.indexOf(this)
    }
    return 0
  }

  get previous() {
    if (this.parent) return this.parent.children[this.index - 1]
    return null
  }

  get next() {
    if (this.parent) return this.parent.children[this.index + 1]
    return null
  }
}
