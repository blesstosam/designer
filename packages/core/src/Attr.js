import { EVENT_TYPES } from './Event'

export class Attr {
  constructor(config, designer) {
    this.name = '__attr__'
    this.config = config || {}
    this.__designer__ = designer
    this.setters = []
    this.__designer__.emit(EVENT_TYPES.ATTRPANEL_INITED)
  }

  triggerUIInit() {
    this.__designer__.emit(EVENT_TYPES.ATTRPANEL_UI_INITED)
  }

  setData(node) {
    this.ui?.setData(node)
  }
  resetData() {
    this.ui?.resetData()
  }

  // TODO: 参考lowcode-engine增加SETTER的注册
  // SETTER会实现UI，并接收core对象，后续调用core api
  register(setter) {
    this.setters.push(setter)
    // 后续使用的时候调setter的render方法
  }
}
