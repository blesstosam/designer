import { EVENT_TYPES } from './Event'
import { $ } from './lib/dom'
import { BORDER_COLOR } from './Selection'

export class Hover {
  constructor(config = {}, designer) {
    this.__designer__ = designer

    // 当前hover的node
    this.node = null
    this.hoverEl = null

    // 当先hover，然后select时，为避免hover和selection同时触发，及时隐藏hover
    this.__designer__.on([EVENT_TYPES.SELECTION_ACTIVED, EVENT_TYPES.SELECTION_UPDATED], (node) => {
      if (node === this.node) {
        this._hideEffect()
      }
    })
  }

  get __canvas__() {
    return this.__designer__.__canvas__
  }
  get selection() {
    return this.__canvas__.selection
  }
  get model() {
    return this.__canvas__.model
  }
  get isTargetSelected() {
    return this.selection && this.selection.node.$el === this.node.$el
  }
  get rootNode() {
    if (this.node) return this.node.getRootNode()
    return null
  }

  create(node) {
    this.node = node
    // hover和selection是互斥的 如果selection被选上则不能触发hover事件
    if (!this.isTargetSelected) {
      this._showEffect()
      this.__designer__.emit(EVENT_TYPES.HOVER_ACTIVED)
    }
  }

  update(node) {
    this.node = node
    if (this.hoverEl) {
      if (!this.isTargetSelected) {
        this._updateEffect()
        this.__designer__.emit(EVENT_TYPES.HOVER_UPDATED)
      }
    } else {
      this.create(node)
    }
  }

  remove() {
    this._hideEffect()
    this.__designer__.emit(EVENT_TYPES.HOVER_DEACTIVED)
  }

  _showEffect() {
    const offset = this._getOffset(this.node.$el)
    if (!this.hoverEl) {
      this.hoverEl = $('<div>')
        .style({
          ...this._getStyle(offset),
          position: 'absolute',
          border: `1px dashed ${BORDER_COLOR}`,
          zIndex: 0,
          boxSizing: 'border-box',
          pointerEvents: 'none',
          transition: 'all .1s'
        })
        .addClass('hover').el
    }
    this.rootNode.$el.appendChild(this.hoverEl)
    return this.hoverEl
  }

  _updateEffect() {
    const offset = this._getOffset(this.node.$el)
    $(this.hoverEl).style(this._getStyle(offset))
  }

  _hideEffect() {
    this.hoverEl && this.hoverEl.remove()
    this.hoverEl = null
  }

  _getStyle({ width, height, top, left }) {
    const { top: rootElTop, left: rootElLeft } = this._getOffset(this.model.$el)
    return {
      width: width + 'px',
      height: height + 'px',
      top: 0,
      left: 0,
      transform: `translate(${left - rootElLeft}px, ${top - rootElTop}px)`
    }
  }

  _getOffset(el) {
    const domRect = el.getBoundingClientRect()
    return {
      width: domRect.width,
      height: domRect.height,
      top: domRect.top,
      left: domRect.left
    }
  }
}
