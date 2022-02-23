import { reactive } from '@vue/reactivity'
import { EVENT_TYPES } from './Event'

const { CANVAS_ACTIONS_DELETE: C_A_D, CANVAS_ACTIONS_APPEND: C_A_A } = EVENT_TYPES

export class ComponentTree {
  constructor(config, designer) {
    this.name = '__componentTree__'
    this.config = config || {}
    this.__designer__ = designer
    this.$componentTreeWrapEle = document.querySelector(this.config.componentTreeWrap)
  }

  get __canvas__() {
    return this.__designer__.__canvas__
  }

  init(renderUI) {
    const data = this.__canvas__.model
    // Attr.js 里是使用 this.uiInstance 调用方法改变数据完成视图更新;这里使用修改props
    const handleClick = (d) => {
      const node = this.__canvas__.model.findByKey('unique', d.unique)
      if (node) this.__canvas__.handleNodeboxSelect(node)
    }
    const handleDel = (d) => {
      const node = this.__canvas__.model.findByKey('unique', d.unique)
      if (node) this.__canvas__.remove(node)
    }
    const handleDisplay = (d, isShow) => {
      const node = this.__canvas__.model.findByKey('unique', d.unique)
      if (node) this.__canvas__.toggleDisplay(node, isShow)
    }
    const handleMouseEnter = (d) => {
      const node = this.__canvas__.model.findByKey('unique', d.unique)
      if (node) this.__canvas__.handleNodeboxHover(node)
    }
    const handleMouseLeave = () => {
      this.__canvas__.handleNodeboxHoverRemove()
    }
    const props = reactive({
      tree: (data && data.children) || [],
      handleDel,
      handleDisplay,
      handleClick,
      handleMouseEnter,
      handleMouseLeave,
      ref: 'componentTree'
    })

    this.uiInstance = renderUI({
      props,
      propsArr: [
        'tree',
        'handleDel',
        'handleDisplay',
        'handleClick',
        'handleMouseEnter',
        'handleMouseLeave',
        'ref'
      ]
    })
    this.uiInstance.__componentTree__ = this
    this.$wrapEl = this.uiInstance.$el.parentNode
    this.__designer__.on([C_A_D, C_A_A], (payload) => {
      const {
        type,
        viewModel: { children = [] }
      } = payload
      props.tree = [...children]
    })
  }

  setCurrentKey(key) {
    this.uiInstance && this.uiInstance.$refs.componentTree.setCurrentKey(key)
  }
}
