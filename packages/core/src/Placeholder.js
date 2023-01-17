import { $, lookdownAllByAttr } from './lib/dom'
import { SLOT_NAME_KEY } from './Canvas'

export const CONTAINER_PLACOHOLDER_CLS = 'container-placeholder'

export class Placeholder {
  constructor(designer) {
    window.placeholder = this
    this.__designer__ = designer

    this.map = new Map() // { el: node } 方便removeByEl查找对应node
  }

  create(node) {
    this._createPlaceholder(node)
  }

  remove(node, index) {
    if (node.placeholderEls) {
      if (index) {
        if (node.placeholderEls[index]) {
          const el = node.placeholderEls[index]
          this.map.delete(el)
          el.remove()
          node.placeholderEls.splice(index, 1)
        }
      } else {
        for (const el of node.placeholderEls) {
          this.map.delete(el)
          el.remove()
        }
        node.placeholderEls = []
      }
    }
  }

  removeByEl(el) {
    const node = this.map.get(el)
    if (node && node.placeholderEls) {
      for (let i = 0; i < node.placeholderEls.length; i++) {
        if (el === node.placeholderEls[i]) {
          el.remove()
          this.map.delete(el)
          node.placeholderEls.splice(i, 1)
          break
        }
      }
    }
  }

  _createPlaceholder(node) {
    if (node.isRoot) {
      if (!node.placeholderEls) {
        node.placeholderEls = []
        const el = $(this._createEl()).style({ paddingTop: '200px' }).el
        node.placeholderEls.push(el)
        node.$el.appendChild(el)
        this.map.set(el, node)
      }
    } else {
      const slotElArr = lookdownAllByAttr(node.$el.children[0], SLOT_NAME_KEY)
      for (const slotEl of slotElArr) {
        if (!slotEl.children.length) {
          const el = $(this._createEl()).style({
            height: '70px',
            lineHeight: '70px',
            width: '100%',
            textAlign: 'center',
            backgroundColor: 'rgba(0,0,0,0.1)',
            color: '#666'
          }).el
          node.placeholderEls = (node.placeholderEls || []).concat([el])
          slotEl.appendChild(el)
          this.map.set(el, node)
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
