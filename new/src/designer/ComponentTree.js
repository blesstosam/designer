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

  get __canvas__() {
    return this.__designer__.__canvas__
  }

  init(data) {
    const handleClick = d => {
      const node = this.__canvas__._findVmByUniqueKey(d.unique)
      if (node) {
        this.__canvas__.handleNodeboxSelect(node)
      }
    }
    const renderProps = reactive({ tree: data, handleClick })
    const app = createApp({
      props: Object.keys(renderProps),
      render: () => h(ComponentTreeVue, renderProps)
    })

    app.component(ElTree.name, ElTree)
    this.vueInstance = app.mount(this.config.componentTreeWrap)
    this.__designer__.on('actions', payload => {
      const { type, viewModel } = payload
      const { APPEND, DELETE } = ActionTypes
      if (type === APPEND || type === DELETE) {
        // TODO 要使用...前拷贝一遍才会触发视图更新?
        renderProps.tree = [...viewModel]
      }
    })
  }
}
