import { componentTypes } from './Components'
import { EVENT_TYPES } from './Event'
import { $ } from './lib/dom'

export class Hover {
  constructor(config = {}, designer) {
    this.__designer__ = designer

    // 当前hover的node
    this.node = null
    // this.$rectEl = null

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
    this._hideEffect()
    this.node = node
    this._showEffect()
    // const offset = this._getOffset()
    // this._updateEffect(offset)
    this.__designer__.emit(EVENT_TYPES.HOVER_UPDATED)
  }

  remove(node) {
    this._hideEffect()
    this.__designer__.emit(EVENT_TYPES.HOVER_DEACTIVED)
  }

  _showEffect(offset) {
    // hover和selection是互斥的 如果selection被选上则不能触发hover事件
    if (!this.isTargetSelected) {
      $(this.node.$el).style({ border: '1px dashed #409EFF' })

      // const { width, height } = offset
      // const div = (this.$rectEl = $('<div>')
      //   .style({
      //     width: width + 2 + 'px',
      //     height: height + 2 + 'px',
      //     top: '-1px',
      //     left: '-1px',
      //     position: 'absolute',
      //     border: '1px dashed #409EFF',
      //     zIndex: 0,
      //     boxSizing: 'border-box'
      //     // pointerEvents: 'none'
      //   })
      //   .addClass('hover').el)
      // this.node.$el.appendChild(div)
      // return div
    }
  }

  _updateEffect(offset) {
    // const { width, height } = offset
    // this.node.$el.appendChild(this.$rectEl)
    // $(this.$rectEl).style({
    //   width: width +2 + 'px',
    //   height: height +2+ 'px',
    //   top: '-1px',
    //   left: '-1px'
    // })
  }

  _hideEffect() {
    // this.$rectEl && this.$rectEl.remove()
    $(this.node.$el).style({ border: '1px solid transparent' })
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
