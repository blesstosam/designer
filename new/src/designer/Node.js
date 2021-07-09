import { randomString } from "./lib/util"

export class Node {
  constructor(node, parent) {
    this.name = node.name
    this.title = node.title
    this.unique = node.unique || randomString()
    this.icon = node.icon
    node.componentType && (this.componentType = node.componentType)
    this.props = node.props
    this.attrs = node.attrs
    this.$el = node.$el
    this.children = []
    parent && (this.parent = parent)
    // this.root =

    this.accept = node.accept
    this.isBlock = !!node.isBlock
    node.slotName && (this.slotName = node.slotName)
    this.vm = node.vm

    // 是否是自定义组件
    this.isCustom = !!node.isCustom
    node.customData && (this.customData = node.customData)

    // function
    this.render = node.render
    node.transformProps && (this.transformProps = node.transformProps)
  }
}
