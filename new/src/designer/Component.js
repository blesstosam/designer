import { componentList, state } from './config.js'
import { lookupByClassName } from './lib/dom.js'
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
    // 保存已经注册过的组件呢
    this.hasRegistered = []
    this.$wrapEle = document.querySelector(this.config.componentWrap)

    this.init()
  }

  init() {
    const header = document.createElement('div')
    header.textContent = '布局组件'
    header.style.marginBottom = '12px'
    const header1 = document.createElement('div')
    header1.textContent = '基础组件'
    header1.style.marginBottom = '12px'
    this.$layoutWrapEle = document.createElement('div')
    this.$layoutWrapEle.style.marginBottom = '24px'
    this.$basicWrapEle = document.createElement('div')
    this.$basicWrapEle.style.marginBottom = '24px'
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
    const wrapper = document.createElement('div')
    const img = document.createElement('img')
    img.src = com.icon.value
    img.width = '20'
    img.height = '20'
    img.setAttribute('draggable', false)
    const div = document.createElement('div')
    div.textContent = com.title
    div.style.marginTop = '6px'
    wrapper.appendChild(img)
    wrapper.appendChild(div)
    wrapper.setAttribute('draggable', true)
    wrapper.style.borderRadius = '8px'
    wrapper.style.display = 'inline-block'
    wrapper.style.padding = '6px'
    wrapper.style.width = '40px'
    wrapper.style.marginRight = '18px'
    wrapper.style.fontSize = '12px'
    wrapper.style.textAlign = 'center'
    wrapper.style.cursor = 'pointer'
    wrapper.classList.add(COMPONENT_DOM_CLASS_NAME)
    wrapper.setAttribute('data-id', com.id)
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
