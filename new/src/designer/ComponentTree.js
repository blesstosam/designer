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
    // Attr.js 里是直接使用 this.vueInstance 调用方法改变数据完成视图更新
    // 这里使用修改props
    const handleClick = d => {
      const node = this.__canvas__._findVmByUniqueKey(d.unique)
      if (node) {
        this.__canvas__.handleNodeboxSelect(node)
      }
    }
    const renderProps = reactive({ tree: data, handleClick, ref: 'componentTree' })
    const app = createApp({
      props: ['tree', 'handleClick', 'ref'],
      render: () => h(ComponentTreeVue, renderProps)
    })

    app.component(ElTree.name, ElTree)
    this.vueInstance = app.mount(this.config.componentTreeWrap)
    this.vueInstance.__componentTree__ = this
    this.__designer__.on('actions', payload => {
      const { type, viewModel } = payload
      const { APPEND, DELETE } = ActionTypes
      if (type === APPEND || type === DELETE) {
        // TODO 要使用浅拷贝一遍才会触发视图更新?
        renderProps.tree = [...viewModel]
      }
    })
  }

  setCurrentKey(key) {
    this.vueInstance && this.vueInstance.$refs.componentTree.setCurrentKey(key)
  }
}
