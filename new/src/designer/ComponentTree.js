import { createApp, reactive, h } from 'vue'
import { ElTree } from 'element-plus'
import ComponentTreeVue from './vue/ComponentTree.vue'
import { ActionTypes } from './Toolbar'

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
    const renderProps = reactive({ tree: data })
    const app = createApp({
      props: Object.keys(renderProps),
      render: () => h(ComponentTreeVue, renderProps)
    })

    app.component(ElTree.name, ElTree)
    this.vueInstance = app.mount(this.config.componentTreeWrap)
    this.__designer__.on('actions', payload => {
      if (payload.type === ActionTypes.APPEND) {
        // todo 要使用...前拷贝一遍才会触发视图更新
        renderProps.tree = [...payload.viewModel]
      }
    })
  }
}
