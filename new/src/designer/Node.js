import { randomString } from './lib/util'

const nodeMap = new Map()

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
    node.vm && (this.vm = node.vm)

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

  get firstChild() {
    return this.children[0]
  }
  
  get lastChild() {
    return this.children[this.children.length - 1]
  }

  append(node) {
    this.children.push(node)
    nodeMap.set(node.$el, node)
  }

  prepend(node) {
    this.children.unshift(node)
    nodeMap.set(node.$el, node)
  }

  insertBefore(node) {
    this.parent.children.splice(index, 0, node)
    nodeMap.set(node.$el, node)
  }

  insertAfter(node) {
    this.parent.children.splice(index+1, 0, node)
    nodeMap.set(node.$el, node)
  }

  removeByKey(key, val, arr) {
    const rootNode = this.getRootNode()
    if (!arr) arr = rootNode.children
    for (let i = 0; i < arr.length; i++) {
      const node = arr[i]
      if (node[key] === val) {
        const movedArr = arr.splice(i, 1)
        return movedArr[0]
      }
      if (node.children.length) {
        const moved = this.removeByKey(key, val, node.children)
        if (moved) return moved
      }
    }
  }

  findByKey(key, val, arr) {
    const rootNode = this.getRootNode()
    if (!arr) {
      if (rootNode[key] === val) return rootNode
      arr = rootNode.children
    }
    for (const node of arr) {
      if (node[key] === val) return node
      if (node.children.length) {
        const _node = this.findByKey(key, val, node.children)
        if (_node) return _node
      }
    }
  }

  findByEl(el) {
    return nodeMap.get(el)
  }

  getRootNode() {
    if (this.isRoot) return this
    const n = this.parent.getRootNode()
    if (n) return n
  }
}
