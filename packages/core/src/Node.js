import { InsertTypes } from './Util'
import { randomString } from './lib/util'

const nodeMap = new Map()

export const VERSION_NO = '1.0.0'

// TODO https://github.com/07akioni/treemate
// 维护一个拍平的栈，用来查引用，然后将引用修改反馈到树上

export class Node {
  constructor(node, parent) {
    this.componentName = node.componentName
    this.title = node.title
    this.unique = node.unique || randomString()
    this.icon = node.icon
    node.framework && (this.framework = node.framework)
    node.componentType && (this.componentType = node.componentType)
    this.props = node.props
    this.attrs = node.attrs
    this.$el = node.$el
    if (node.isRoot) {
      this.isRoot = node.isRoot
      this.__version__ = VERSION_NO
    }

    this.children = []
    parent && (this.parent = parent)

    node.slotName && (this.slotName = node.slotName)
    node.vm && (this.vm = node.vm)

    // 是否是自定义组件
    this.isCustom = !!node.isCustom
    node.customData && (this.customData = node.customData)

    // 物料组件分类，从组件颗粒度来划分 Component|Block|Template
    node.category && (this.category = node.category)

    // function
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

  // 是否是其父级节点的第一个节点
  get isFirstChild() {
    if (!this.parent) return false
    return this.parent.children[0] === this
  }

    // 是否是其父级节点的最后一个节点
  get isLastChild() {
    if (!this.parent) return false
    const children = this.parent.children
    return children[children.length - 1] === this
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

  export() {
    const traverse = (_arr, _origin) => {
      for (let i = 0; i < _arr.length; i++) {
        const item = _arr[i]
        if (item.props.nativeEvent) {
          item.props.events = {}
          const eventArr = JSON.parse(item.props.nativeEvent)
          for (const event of eventArr) {
            item.props.events[event.name] = event.code
          }
          delete item.props.nativeEvent
        }
        _origin.push({
          attrs: item.attrs,
          children: [],
          componentType: item.componentType,
          icon: item.icon,
          isCustom: item.isCustom,
          componentName: item.componentName,
          framework: item.framework,
          props: item.props,
          title: item.title,
          unique: item.unique,
          slotName: item.slotName
        })
        if (item.children && item.children.length) {
          traverse(item.children, _origin[i].children)
        }
      }
    }

    const origin = []
    traverse(this.children, origin)
    return origin
  }
}
