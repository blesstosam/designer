import {
  getCurrentViewNodeModel,
  setCurrentViewNodeModel,
  state,
  resetState,
  componentList
} from './config.js'
import { FocusRect } from './FocusRect.js'
import { ActionTypes } from './Toolbar.js'
import { componentTypes } from './Component'
import { makeLogger } from './lib/util'
const logger = makeLogger('canvas: ')

export class Canvas {
  constructor(config, designer) {
    this.name = '__canvas__'
    this.config = config || {}
    if (!this.config.canvasWrap) {
      throw new Error('[designer] 请传入画布容器元素 canvasWrap')
    }
    this.__designer__ = designer
    this.focusRect = null
    this.$canvasWrapEle = document.querySelector(this.config.canvasWrap)
    this.$canvasWrapEle.style.height = '100%'
  }

  get width() {
    return this.config.width
  }
  get height() {
    return this.config.height
  }

  get __component__() {
    return this.__designer__.__component__
  }
  get __attr__() {
    return this.__designer__.__attr__
  }

  init(viewModel) {
    const { config } = this
    this.viewModel = viewModel || []
    const div = document.createElement('div')
    div.classList.add('drop')
    div.style.width = config.width || window.innerWidth - 550 + 'px' // 550为左右的宽度加边距
    div.style.minWidth = '100%'
    div.style.height = config.height || '100%'
    this.$canvasWrapEle.appendChild(div)
    this.$canvasEle = div
    this.bindCanvasEvents()
    this.layout()
  }

  bindCanvasEvents() {
    // 最外面的画布监听 drop 事件
    this.$canvasEle.addEventListener('drop', e => {
      logger(e, 'drop')
      e.preventDefault()
      const dom = this.append(state.data, this.$canvasEle)
      this.viewModel.push({
        ...state.data,
        $el: dom // 记录下该data渲染出来的dom元素
      })
      // 发送全局事件
      this._dispathAppend()
      resetState()
    })

    this.$canvasEle.addEventListener('dragover', e => {
      e.preventDefault()
    })
  }

  /**
   * 根据 viewModel 来渲染页面
   * @returns {*} void
   */
  layout() {
    const { viewModel } = this
    if (!viewModel || !viewModel.length) return
    // 遍历 viewModel 递归调用插入dom
    const mount = (nodeArr, container) => {
      for (const node of nodeArr) {
        // 在序列化数据的时候 =>
        // 将 render 函数丢失了 所以要从 config 里找回
        // 将 $el 丢失了 需要重新赋值
        const com = componentList.find(i => i.name === node.name)
        node.render = com.render
        const wrapper = this.append(node, container)
        node.$el = wrapper
        if (node.children && node.children.length) {
          mount(node.children, wrapper.childNodes[0])
        }
      }
    }

    mount(viewModel, this.$canvasEle)
  }

  /**
   * 将组件插入到画布渲染
   * @param {*} d 被拖入组件的元数据
   * @param {Element} container 被拖入的容器（组件或最外层的画布）
   */
  append(d, container) {
    const isLayout = d.componentType === componentTypes.LAYOUT
    const wrapper = this.createNodebox(isLayout)
    const res = d.render()
    res.setAttribute('data-id', d.id)
    res.setAttribute('data-name', d.name)
    wrapper.appendChild(res)
    container.appendChild(wrapper)
    wrapper.addEventListener(
      'click',
      _e => {
        logger(_e.target)
        _e.stopPropagation()
        const id = _e.target.getAttribute('data-id')

        const node = this._findViewModel(_e.target.parentNode, this.viewModel)
        if (node) {
          // TODO ??? 为什么是 parentNode
          setCurrentViewNodeModel(node)
          this.__attr__.vueInstance.setData(node)
        }

        const pos = {
          width: _e.target.offsetWidth,
          height: _e.target.offsetHeight,
          top: _e.target.offsetTop,
          left: _e.target.offsetLeft
        }
        // TODO 将 focusRect 放到 Node 类里， Node 为组件渲染的节点
        if (this.focusRect) {
          this.focusRect.update(pos)
        } else {
          this.focusRect = new FocusRect()
          this.focusRect.create(pos)
        }
      },
      true
    )
    return wrapper
  }

  /**
   * 重新渲染某个组件
   * @param {*} el 所在组件渲染的dom节点
   * @param {*} item 属性对象
   * @param {*} val 属性值
   */
  patch(el, item, val) {
    // debugger
    const vm = this._findViewModel(el)
    // 更新attrs
    // TODO 有没有遍历 json schema 的库？
    const configCates = vm.attrs.properties.configs.items
    for (const cfgCate of configCates) {
      for (const cfg of cfgCate.properties.children.items) {
        cfg.properties.value.default = val
      }
    }

    if (vm && vm.render) {
      vm.render({ [item.id]: val })
    }
  }

  /**
   * 在节点外包一个div 在一个drop监听
   */
  createNodebox(isLayout) {
    const wrapper = document.createElement('div')
    wrapper.classList.add('node-box')
    !isLayout && (wrapper.style.display = 'inline-block')
    wrapper.addEventListener('dropover', e => {
      e.preventDefault()
      e.stopPropagation() // 阻止冒泡到外面的画布
    })
    wrapper.addEventListener('drop', e => {
      console.log('nodebox drop')
      e.stopPropagation() // 阻止冒泡到外面的画布
      const targetNodeboxId = e.target.getAttribute('data-id')
      const component = this.__component__.findComById(targetNodeboxId)
      const { accept = [] } = component
      console.log(component, 1, state.data, e.target)
      // 1. 被drop的地方有组件，要判断是否可以被拖入（涉及布局组件和accept的逻辑）
      // 2. 被drop的地方没有组件，直接append
      if (accept.includes(state.data.name)) {
        this.append(state.data, e.target)
        // why is e.target.parentNode?
        const dropedContainer = this._findViewModel(e.target.parentNode, this.viewModel)
        if (dropedContainer) {
          if (dropedContainer.children) {
            dropedContainer.children.push({ ...state.data, $el: wrapper })
          } else {
            dropedContainer.children = [{ ...state.data, $el: wrapper }]
          }
        }

        this._dispathAppend()
        resetState()
      }
    })
    return wrapper
  }

  /**
   * 根据el 递归遍历 viewModel 找到节点
   * @param {HTMLElement} el
   * @param {Array} arr
   * @returns {*}
   */
  _findViewModel(el, arr) {
    if (!arr) arr = this.viewModel
    for (const vm of arr) {
      if (vm.$el === el) return vm
      if (vm.children && vm.children.length) {
        const _vm = this._findViewModel(el, vm.children)
        // important: 这里一定要加if判断 否则递归会断掉
        if (_vm) return _vm
      }
    }
  }

  /**
   * 发送全局事件
   */
  _dispathAppend() {
    this.__designer__.emit('actions', {
      type: ActionTypes.APPEND,
      data: state.data
    })
  }
}
