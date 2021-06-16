// 组件树
import { createApp } from 'vue'
import { ElTree } from 'element-plus'
import ComponentTreeVue from './vue/ComponentTree.vue'

export class ComponentTree {
  constructor(config, designer) {
    this.name = '__componentTree__'
    this.config = config || {}
    this.__designer__ = designer
    if (!this.config.componentTreeWrap) {
      throw new Error('[designer] 请传入组件树的容器元素')
    }
    this.$componentTreeWrapEle = document.querySelector(this.config.componentTreeWrap)
  }

  init(data) {
    const app = createApp(ComponentTreeVue, {
      tree: data
    })
    app.component(ElTree.name, ElTree)
    this.vueInstance = app.mount(this.config.componentTreeWrap)
  }
}
