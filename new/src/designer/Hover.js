import { componentTypes } from './Components'
import { EVENT_TYPES } from './Event'
import { $ } from './lib/dom'

export class Hover {
  constructor(config = {}, designer) {
    this.__designer__ = designer

    // 当前hover的node
    this.node = null
    this.$rectEl = null 
  }

  get selection() {
    return this.__designer__.__canvas__.selection
  }
  get isTargetSelected() {
    return this.selection && this.selection.node.$el === this.node.$el
  }

  getIsLayout(node) {
    return node.componentType === componentTypes.LAYOUT
  }

  create(node) {
    this.node = node
    const offset = this._getOffset()
    this._showEffect(offset)
    this.__designer__.emit(EVENT_TYPES.HOVER_ACTIVED)
  }

  update(node) {
    if (this.getIsLayout(node)) {
      this.node = node
      const offset = this._getOffset()
      this._updateEffect(offset)
      this.__designer__.emit(EVENT_TYPES.HOVER_UPDATED)
    }
  }

  remove(node) {
    if (this.getIsLayout(node)) {
      this._hideEffect()
      this.__designer__.emit(EVENT_TYPES.HOVER_DEACTIVED)
    }
  }

  _showEffect(offset) {
    // hover和selection是互斥的 如果selection被选上则不能触发hover事件
    if (!this.isTargetSelected) {
      // const el = this.node.$el.children[0]
      // $(el).style({ borderColor: '#409EFF' })

      const { width, height } = offset
      const div = (this.$rectEl = $('<div>')
        .style({
          width: width + 'px',
          height: height + 'px',
          top: 0,
          left: 0,
          position: 'absolute',
          border: '1px dashed #409EFF',
          zIndex: 100,
          boxSizing: 'border-box'
          // pointerEvents: 'none'
        })
        .addClass('selection').el)
      this.node.$el.appendChild(div)
      return div
    }
  }

  _updateEffect(offset) {
    const { width, height } = offset
    this.node.$el.appendChild(this.$rectEl)
    $(this.$rectEl).style({
      width: width + 'px',
      height: height + 'px',
      top: 0,
      left: 0
    })
  }

  _hideEffect() {
    this.$rectEl && this.$rectEl.remove()
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
