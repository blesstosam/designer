import { createApp, reactive, h } from 'vue'
import { ElTree } from 'element-plus'
import ComponentTreeVue from './vue/ComponentTree.vue'
import { EVENT_TYPES } from './Event'

const { CANVAS_ACTIONS_DELETE: C_A_D, CANVAS_ACTIONS_APPEND: C_A_A } = EVENT_TYPES

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
      const node = this.__canvas__.model.findByKey('unique', d.unique)
      if (node) {
        this.__canvas__.handleNodeboxSelect(node)
      }
    }
    const handleMouseEnter = d => {
      const node = this.__canvas__.model.findByKey('unique', d.unique)
      if (node) {
        this.__canvas__.handleNodeboxHover(node)
      }
    }
    const handleMouseLeave = () => {
      this.__canvas__.handleNodeboxHoverRemove()
    }
    const props = reactive({
      tree: (data && data.children) || [],
      handleClick,
      handleMouseEnter,
      handleMouseLeave,
      ref: 'componentTree'
    })
    const app = createApp({
      props: ['tree', 'handleClick', 'handleMouseEnter', 'handleMouseLeave', 'ref'],
      render: () => h(ComponentTreeVue, props)
    })

    app.component(ElTree.name, ElTree)
    this.vueInstance = app.mount(this.config.componentTreeWrap)
    this.vueInstance.__componentTree__ = this
    this.__designer__.on([C_A_D, C_A_A], payload => {
      const { type, viewModel: { children = [] } } = payload
      // TODO 要使用浅拷贝一遍才会触发视图更新?
      props.tree = [...children]
    })
  }

  setCurrentKey(key) {
    this.vueInstance && this.vueInstance.$refs.componentTree.setCurrentKey(key)
  }
}
