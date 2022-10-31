import { EVENT_TYPES } from './Event'

export class Attr {
  constructor(config, designer) {
    this.name = '__attr__'
    this.config = config || {}
    this.__designer__ = designer
    this.setters = []
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

  // TODO: 参考lowcode-engine增加SETTER的注册
  // SETTER会实现UI，并接收core对象，后续调用core api
  register(setter) {
    this.setters.push(setter)
    // 后续使用的时候调setter的render方法
  }
}
