import { EVENT_TYPES } from './Event'

export class Hover {
  constructor(config = {}, designer) {
    this.__designer__ = designer
    
    // 当前hover的dom
    this.$targetEl = null
  }
  
  get selection() {
    return this.__designer__.__canvas__.selection
  }
  get isTargetSelected() {
    return this.selection && this.selection.node.$el === this.targetEl
  }
  
  showEffect() {
    // hover和selection是互斥的 如果selection被选上则不能触发hover事件
    if (this.isTargetSelected) {
      // 
    }
  }

  // 使用 mouseenter/mouseleave mouseover
}
