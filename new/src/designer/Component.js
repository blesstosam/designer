import { componentList, state } from './config.js'
import { lookupByClassName, $ } from './lib/dom.js'
const COMPONENT_DOM_CLASS_NAME = 'component-item'

export const componentTypes = {
  LAYOUT: 'layout',
  BASIC: 'basic'
}

export class Component {
  constructor(config, designer) {
    this.name = '__component__'
    this.config = config || {}
    if (!this.config.componentWrap) {
      throw new Error('[designer] 请传入组件框容器元素 componentWrap')
    }
    this.__designer__ = designer
    // 保存已经注册过的组件
    this.hasRegistered = []
    this.$wrapEle = document.querySelector(this.config.componentWrap)

    this.init()
  }

  init() {
    const header = $('<div>').text('布局组件').style('marginBottom', '12px').el
    const header1 = $('<div>').text('基础组件').style('marginBottom', '12px').el
    this.$layoutWrapEle = $('<div>').style('marginBottom', '24px').el
    this.$basicWrapEle = $('<div>').style('marginBottom', '24px').el

    this.$wrapEle.appendChild(header)
    this.$wrapEle.appendChild(this.$layoutWrapEle)
    this.$wrapEle.appendChild(header1)
    this.$wrapEle.appendChild(this.$basicWrapEle)
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
      const $componentItem = lookupByClassName(e.target, COMPONENT_DOM_CLASS_NAME)
      const id = $componentItem.getAttribute('data-id')
      state.data = componentList.find(i => i.id === id) || {}
    })
    target.addEventListener('dragend', e => {
      // console.log(e, 'dragend')
      this.__designer__.emit('dragend')
    })
  }

  // 同步注册左侧组件
  registerComponent(com) {
    const img = $('<img>')
      .attr('src', com.icon.value)
      .attr('width', '20')
      .attr('height', '20')
      .attr('draggable', false)
      .el
    const div = $('<div>').text(com.title).style('marginTop', '6px').el

    const wrapper = document.createElement('div')
    wrapper.appendChild(img)
    wrapper.appendChild(div)
    $(wrapper)
      .attr('draggable', true)
      .attr('data-id', com.id)
      .style({
        borderRadius: '8px',
        display: 'inline-block',
        padding: '6px',
        width: '40px',
        marginRight: '18px',
        fontSize: '12px',
        textAlign: 'center',
        cursor: 'pointer'
      })
      .addClass(COMPONENT_DOM_CLASS_NAME)

    this.bindComponentEvent(wrapper)
    if (com.componentType === componentTypes.LAYOUT) {
      this.$layoutWrapEle.appendChild(wrapper)
    } else {
      this.$basicWrapEle.appendChild(wrapper)
    }
    this.hasRegistered.push(com)
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
      Promise.resolve(this.registerComponent(res))
    })
  }

  findComById(id) {
    return this.hasRegistered.find(c => c.id === id)
  }
}
