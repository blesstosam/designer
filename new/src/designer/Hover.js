import { EVENT_TYPES } from './Event'
import { $ } from './lib/dom'

export class Hover {
  constructor(config = {}, designer) {
    this.__designer__ = designer

    // 当前hover的node
    this.node = null
    this.$rectEl = null

    // 当先hover，然后select时，为避免hover和selection同时触发，及时隐藏hover
    this.__designer__.on([EVENT_TYPES.SELECTION_ACTIVED, EVENT_TYPES.SELECTION_UPDATED], node => {
      if (node === this.node) {
        this._hideEffect()
      }
    })
  }

  get selection() {
    return this.__designer__.__canvas__.selection
  }
  get isTargetSelected() {
    return this.selection && this.selection.node.$el === this.node.$el
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
    if (this.$rectEl) {
      if (!this.isTargetSelected) {
        this._hideEffect()
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
    const offset = this._getOffset()
    const { width, height } = offset
    const div = (this.$rectEl = $('<div>')
      .style({
        ...this._getPos(width, height),
        position: 'absolute',
        border: '1px dashed #409EFF',
        zIndex: 0,
        boxSizing: 'border-box',
        pointerEvents: 'none'
      })
      .addClass('hover').el)
    this.node.$el.appendChild(div)
    return div
  }

  _updateEffect() {
    const offset = this._getOffset()
    const { width, height } = offset
    this.node.$el.appendChild(this.$rectEl)
    $(this.$rectEl).style(this._getPos(width, height))
  }

  _hideEffect() {
    this.$rectEl && this.$rectEl.remove()
  }

  _getPos(width, height) {
    return {
      width: width + 'px',
      height: height - 1 + 'px',
      top: 0,
      left: 0
    }
  }

  _getOffset() {
    const { $el } = this.node
    const domRect = $el.getBoundingClientRect()
    return {
      width: domRect.width,
      height: domRect.height,
      top: domRect.top,
      left: domRect.left
    }
  }
}
