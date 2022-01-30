import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import AttrPanel from './vue/AttrPanel.vue'
import { EVENT_TYPES } from './Event'

export class Attr {
  constructor(config, designer) {
    this.name = '__attr__'
    this.config = config || {}
    if (!this.config.attrWrap) {
      throw new Error('[designer] 请传入组件框容器元素 attrWrap')
    }
    this.__designer__ = designer
  }

  // 初始化属性面板
  init() {
    const app = createApp(AttrPanel)
    app.use(ElementPlus)
    this.vueInstance = app.mount(this.config.attrWrap)
    this.vueInstance.__attr__ = this
    this.__designer__.emit(EVENT_TYPES.ATTRPANEL_INITED)
  }
}
