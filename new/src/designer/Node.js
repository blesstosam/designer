export class Node {
  constructor(node, parent) {
    this.name = node.name
    this.title = node.title
    this.unique = node.unique
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
    this.customData = node.customData

    // function
    this.render = node.render
    node.transformProps && (this.transformProps = node.transformProps)
  }
}
