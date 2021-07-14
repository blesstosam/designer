import { componentTypes } from './Components'
import { EVENT_TYPES } from './Event'
import { $ } from './lib/dom'

export class Hover {
  constructor(config = {}, designer) {
    this.__designer__ = designer

    // 当前hover的node
    this.node = null
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
    this._oldBorderColor = $(this.node.$el).getStyle('borderColor')
    this._showEffect()
    this.__designer__.emit(EVENT_TYPES.HOVER_ACTIVED)
  }

  update(node) {
    if (this.getIsLayout(node)) {
      this._hideEffect()
      this.node = node
      this._showEffect()
      this.__designer__.emit(EVENT_TYPES.HOVER_UPDATED)
    }
  }

  remove(node) {
    if (this.getIsLayout(node)) {
      this._hideEffect()
      this.__designer__.emit(EVENT_TYPES.HOVER_DEACTIVED)
    }
  }

  _showEffect() {
    // hover和selection是互斥的 如果selection被选上则不能触发hover事件
    if (!this.isTargetSelected) {
      const el = this.node.$el.children[0]
      $(el).style({ borderColor: '#409EFF' })
    }
  }

  _hideEffect() {
    const el = this.node.$el.children[0]
    $(el).style({ borderColor: this._oldBorderColor })
  }
}
