import { InsertTypes } from './InsertTypes'
import { randomString } from './lib/util'

const nodeMap = new Map()

// TODO 关于树的增删改查 参考 fre conf 章总的ppt
// 维护一个拍平的栈，用来查引用，然后将引用修改反馈到树上

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
    if (node.isRoot) {
      this.isRoot = node.isRoot
      this.__version__ = '1.0.0'
    }

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

    // store to nodeMap
    nodeMap.set(node.$el, this)
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

  [InsertTypes.APPEND](node) {
    this.children.push(node)
    if (node.parent !== this) node.parent = this
  }

  [InsertTypes.PREPEND](node) {
    this.children.unshift(node)
    if (node.parent !== this) node.parent = this
  }

  [InsertTypes.BEFORE](node) {
    this.parent.children.splice(this.index, 0, node)
    if (node.parent !== this.parent) node.parent = this.parent
  }

  [InsertTypes.AFTER](node) {
    this.parent.children.splice(this.index + 1, 0, node)
    if (node.parent !== this.parent) node.parent = this.parent
  }

  // remove self
  remove() {
    if (this.parent) {
      const [removedNode] = this.parent.children.splice(this.index, 1)
      return removedNode
    }
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

  getIsSibling(node) {
    if (!this.parent) return false
    return this.parent === node.parent
  }

  getIsMyParent(node) {
    return this.parent === node
  }

  getRootNode() {
    if (this.isRoot) return this
    const n = this.parent.getRootNode()
    if (n) return n
  }
}
