import { $, lookdownAllByAttr } from './lib/dom'
import { SLOT_NAME_KEY } from './Canvas'

export const CONTAINER_PLACOHOLDER_CLS = 'container-placeholder'

export class Placeholder {
  constructor(designer) {
    window.placeholder = this
    this.__designer__ = designer

    this.map = new WeakMap() // { el: node } 方便removeByEl查找对应node
    this.placeholderElsMap = new WeakMap()
  }

  getPlaceholderEls(node) {
    return this.placeholderElsMap.get(node)
  }

  create(node) {
    if (node.isRoot) {
      if (!this.getPlaceholderEls(node)?.length && !node.children.length) {
        const el = $(this._createEl()).style({ paddingTop: '200px' }).el
        node.$el.appendChild(el)
        this.map.set(el, node)
        this.placeholderElsMap.set(node, [el])
      }
    } else {
      const slotElArr = lookdownAllByAttr(node.$el.children[0], SLOT_NAME_KEY)
      const arr = this.getPlaceholderEls(node) || []
      for (const slotEl of slotElArr) {
        if (!slotEl.children.length) {
          const el = $(this._createEl()).style({
            height: '70px',
            lineHeight: '70px',
            textAlign: 'center',
            backgroundColor: '#ddd',
            color: '#666',
            border: '1px dotted',
            overflow: 'hidden'
          }).el
          arr.push(el)
          slotEl.appendChild(el)
          this.map.set(el, node)
        }
      }
      if (arr.length) {
        this.placeholderElsMap.set(node, arr)
      }
    }
  }

  remove(node, index) {
    const placeholderEls = this.getPlaceholderEls(node)
    if (placeholderEls) {
      if (index) {
        if (placeholderEls[index]) {
          const el = placeholderEls[index]
          this.map.delete(el)
          el.remove()
          placeholderEls.splice(index, 1)
        }
      } else {
        for (const el of placeholderEls) {
          this.map.delete(el)
          el.remove()
        }
        this.placeholderElsMap.delete(node)
      }
    }
  }

  removeByEl(el) {
    const node = this.map.get(el)
    const placeholderEls = this.placeholderElsMap.get(node)
    if (placeholderEls?.length) {
      for (let i = 0; i < placeholderEls.length; i++) {
        if (el === placeholderEls[i]) {
          el.remove()
          this.map.delete(el)
          placeholderEls.splice(i, 1)
          break
        }
      }
    }
  }

  _createEl() {
    const span = $('<div>')
      .text('请将组件拖入这里')
      .addClass(CONTAINER_PLACOHOLDER_CLS)
      .style({ textAlign: 'center', pointerEvents: 'none' }).el
    return span
  }
}
