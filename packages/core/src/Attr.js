import { EVENT_TYPES } from './Event'

export class Attr {
  constructor(config, designer) {
    this.name = '__attr__'
    this.config = config || {}
    this.__designer__ = designer
  }

  init(renderUI) {
    this.uiInstance = renderUI()
    this.uiInstance.__designer__ = this.__designer__
    this.$wrapEl = this.uiInstance.$el.parentNode
    this.__designer__.emit(EVENT_TYPES.ATTRPANEL_INITED)
  }

  triggerUIInit() {
    this.__designer__.emit(EVENT_TYPES.ATTRPANEL_UI_INITED)
  }
}
 