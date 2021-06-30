import { componentList, state } from './config.js'
import { lookupByClassName, $ } from './lib/dom.js'
import ComponentsVue from './vue/Components.vue'
import { ElTabs, ElTabPane } from 'element-plus'
import { createApp } from 'vue'

const COMPONENT_EL_CLASS_NAME = 'component-item'

export const componentTypes = {
  LAYOUT: 'layout',
  BASIC: 'basic'
}

/**
 * 组件提供了注册，绑定事件等方法
 * 视图根据用户自己的选择定制通过重写 init 方法
 */
export class Components {
  constructor(config, designer) {
    this.name = '__components__'
    this.config = config || {}
    if (!this.config.componentsWrap) {
      throw new Error('[designer] 请传入组件框容器元素 componentsWrap')
    }
    this.__designer__ = designer
    this._hasRegistered = []
    this.$wrapEl = document.querySelector(this.config.componentsWrap)
  }

  get __componentTree__() {
    return this.__designer__.__componentTree__
  }

  init(com) {
    const app = createApp(com || ComponentsVue)
    app.component(ElTabs.name, ElTabs)
    app.component(ElTabPane.name, ElTabPane)
    this.vueInstance = app.mount(this.$wrapEl)
    this.vueInstance.__components__ = this
  }

  // 给组件绑定数据和事件
  bindComponentEvent(target) {
    target.addEventListener('dragstart', e => {
      // console.log(e, 'dragstart')
      // console.log(e.dataTransfer, 'event.dataTransfer')
      e.dataTransfer.effectAllowed = 'move'
      this.__designer__.emit('dragstart')
      state.dragging = true
      state.target = e.target
      const $componentItem = lookupByClassName(e.target, COMPONENT_EL_CLASS_NAME)
      const id = $componentItem.getAttribute('data-id')
      state.data = componentList.find(i => i.id === id) || {}
    })
    target.addEventListener('dragend', e => {
      // console.log(e, 'dragend')
      this.__designer__.emit('dragend')
    })
  }

  /**
   * 同步注册左侧组件
   * 主要是给组件dom绑定一些属性和事件
   * @param {*} comEl
   * @param {*} com
   * @returns
   */
  registerComponent(comEl, com) {
    $(comEl)
      .attr('draggable', true)
      .attr('data-id', com.id)
      .attr('is-block', !!com.isBlock)
      .attr('component-type', com.componentType)
      .addClass(COMPONENT_EL_CLASS_NAME)

    this.bindComponentEvent(comEl)
    this._hasRegistered.push(com)
    return com
  }

  /**
   * 异步注册组件
   * @param {Promise} p
   * @param {Promise}
   */
  registerAsyncComponent(p) {
    if (Object.prototype.toString.call(p) !== '[object Promise]') {
      const err = new Error('[registerAsyncComponent] param must be promise!')
      Promise.reject(err)
    }
    p.then(res => {
      // TODO 需求修改
      Promise.resolve(this.registerComponent(res))
    })
  }

  findComByName(name) {
    return this._hasRegistered.find(c => c.name === name)
  }
}
