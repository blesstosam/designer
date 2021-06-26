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
import { makeLogger, randomString } from './lib/util'
import { lookupByClassName, lookdownByAttr, $, lookdownForAttr } from './lib/dom'

const { LAYOUT } = componentTypes
const DROP_EL_PADDING = 12, NODE_BOX_PADDING = 8
const SLOT_NAME_KEY = 'c-slot-name'

function getSlotName(el) {
  return el.getAttribute(SLOT_NAME_KEY)
}

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
    this.$markEl = null
    this.dropToInnerSlot = false  // 是否被拖入 node-box 的 slot 容器
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
    // ------- for debug -----------
    window.viewModel = this.viewModel
    const div = this.$canvasEle = $('<div>')
      .addClass('drop')
      .style({
        width: config.width || window.innerWidth - 550 + 'px', // 550为左右的宽度加边距
        height: config.height || '100%',
        minWidth: '100%',
        padding: DROP_EL_PADDING + 'px',
        boxSizing: 'border-box',
        backgroundColor: '#ddd',
      }).el
    this.$canvasWrapEle.appendChild(div)
    this.bindCanvasEvents()
    this.layout()
  }

  /**
   * 最外面的画布监听 drop 事件
   */
  bindCanvasEvents() {
    // 父子元素事件触发顺序
    // 先拖入父容器，再到子容器 wrap enter => inner enter => wrap leave => inner leave => wrap leave
    // 只拖入子容器 inner enter => inner leave => wrap leave
    // 只拖入父容器 wrap enter => wrap leave
    // 嵌套div拖入 wrap enter => inner enter => wrap leave => inside enter => inner leave => ...
    this.$canvasEle.addEventListener('drop', e => {
      this.removeMark()
      
      if (state.data.componentType !== LAYOUT) {
        const blockCom = componentList.find(i => i.name === 'VBlock')
        const wrap = this.append(blockCom, this.$canvasEle)
        this.viewModel.push({ ...blockCom, $el: wrap, unique: randomString() })

        const dom = this.append(state.data, wrap.children[0])
        const lastNode = this.viewModel[this.viewModel.length - 1]
        const slotName = lookdownForAttr(wrap, SLOT_NAME_KEY)
        lastNode.children = [{ ...state.data, $el: dom, slotName, unique: randomString() }]
      } else {
        const dom = this.append(state.data, this.$canvasEle)
        this.viewModel.push({ ...state.data, $el: dom, unique: randomString() })
      }

      this._dispathAppend()
      resetState()
    })

    this.$canvasEle.addEventListener('dragover', e => {
      e.preventDefault()
    })

    this.$canvasEle.addEventListener('dragenter', e => {
      const pos = {}
      const children = e.target.children
      console.log('wrapper enter...')
      if (children.length) {
        const lastChild = children[children.length - 1]
        const rectPos = lastChild.getBoundingClientRect()
        pos.width = e.target.offsetWidth
        pos.left = rectPos.left
        pos.top = rectPos.top + lastChild.offsetHeight + 2
      } else {
        const rectPos = e.target.getBoundingClientRect()
        pos.width = e.target.offsetWidth
        pos.left = rectPos.left
        pos.top = rectPos.top + 2
      }

      this.showMark(pos)
    })

    this.$canvasEle.addEventListener('dragleave', e => {
      // 当进入被拖入元素的子元素时，也会触发dragleave事件 所以给mark元素加上 `pointerEvents:none`
      console.log('wraper leave...')
      if (!this.dropToInnerSlot) {
        this.removeMark()
      }
    })
  }

  showMark(pos) {
    const { width, left, top } = pos
    if (!this.$markEl) {
      const mark = this.$markEl = $('<div>')
        .style({
          width: width - DROP_EL_PADDING * 2 + 'px',
          height: '20px',
          borderTop: '3px solid #1989fa',
          background: '#eef1db',
          position: 'absolute',
          left: left + 'px',
          top: top + 'px',
          pointerEvents: 'none'
        }).el
      document.body.appendChild(mark)
    } else {
      $(this.$markEl).style({
        width: width + 'px',
        left: left + 'px',
        top: top + 'px'
      })
    }
  }

  removeMark() {
    this.$markEl && this.$markEl.remove()
    this.$markEl = null
  }

  clear() {
    this.viewModel = []
    this.$canvasEle.innerHTML = ''
    this.clearFocusRect()
    localStorage.clear('viewModel')
    this.__designer__.emit('actions', {
      type: ActionTypes.DELETE,
      viewModel: []
    })
  }

  clearFocusRect() {
    if (this.focusRect) {
      this.focusRect.remove()
      this.focusRect = null
    }
  }

  /**
   * 根据 viewModel 来渲染页面
   * @returns {*} void
   */
  layout() {
    const { viewModel } = this
    if (!viewModel || !viewModel.length) return
    const mount = (nodeArr, container) => {
      for (const node of nodeArr) {
        // 在序列化数据的时候 =>
        // 将函数类型的属性丢失了 所以要从 config 里找回 有 render，transformProps
        // 将 $el 丢失了 需要重新赋值
        const com = componentList.find(i => i.name === node.name)
        node.render = com.render
        com.transformProps && (node.transformProps = com.transformProps)
        const wrapper = node.$el = this.append(node, container)
        if (node.children && node.children.length) {
          mount(node.children, wrapper.children[0])
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
    const isLayout = d.componentType === LAYOUT
    const wrapper = this.createNodebox(isLayout)
    const res = d.render()
    $(res).attr({
      'data-id': d.id,
      'data-name': d.name
    })
    wrapper.appendChild(res)

    // 当组件的slotname 为 default 时，直接插入到容器的末尾
    // 当组件的slotname 不为 default 时，需要查找对应的容器
    const slotName = d.slotName || 'default'
    if (slotName !== 'default') {
      const _container = lookdownByAttr(container, SLOT_NAME_KEY, d.slotName)
      if (_container) _container.appendChild(wrapper)
    } else {
      //  TODO 是否去掉该分支 明确要求布局组件要有c-slot-name属性
      container.appendChild(wrapper)
    }

    wrapper.addEventListener(
      'click',
      _e => {
        logger(_e.target)
        _e.stopPropagation()

        // 查找 node-box 节点 更新当前节点 通知属性面板更新
        const $nodeboxEl = lookupByClassName(_e.target, 'node-box')
        const node = this._findVmByEl($nodeboxEl, this.viewModel)
        if (node) {
          this.handleNodeboxSelect(node)
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
    const vm = this._findVmByEl(el)
    // 更新attrs
    // TODO 有没有遍历 json schema 的库？
    const configCates = vm.attrs.properties.configs.items
    for (const cfgCate of configCates) {
      for (const cfg of cfgCate.properties.children.items) {
        if (cfg.properties.id.const === item.id) {
          cfg.properties.value.default = val
        }
      }
    }

    if (vm && vm.render) {
      vm.render({ [item.id]: val })
    }
  }

  handleNodeboxSelect(node) {
    setCurrentViewNodeModel(node)
    this.__attr__.vueInstance.setData(node)

    // TODO 将 focusRect 放到 Node 类里， Node 为组件渲染的节点
    if (this.focusRect) {
      this.focusRect.update(node)
    } else {
      this.focusRect = new FocusRect(this.__designer__)
      this.focusRect.create(node)
    }
    this.__designer__.on('actions', payload => {
      const { type, data } = payload
      if (type === ActionTypes.FOCUS_BTN_DEL) {
        const movedVm = this._removeVmByEl(data.$el)
        // TODO 有时候 movedVm 为 undefined ？
        // console.log(movedVm, 'movedVm')
        movedVm && movedVm.$el.remove()
        this.clearFocusRect()
        this._dispathDelete(movedVm)
      } else if (type === ActionTypes.FOCUS_BTN_COPY) {
        // 插入到同级的下一个节点
        // TODO 是否在节点上加上 $parentEl 节省掉遍历的时间
        // const com = componentList.find(i => i.name === data.name)
        // this.append(com)
      }
    })
  }

  /**
   * 在节点外包一个div 在一个drop监听
   */
  createNodebox(isLayout) {
    const wrapper = $('<div>').addClass('node-box')
      .style({
        padding: NODE_BOX_PADDING + 'px',
        boxSizing: 'border-box',
        backgroundColor: '#fff'
      }).el

    if (!isLayout) {
      wrapper.style.display = 'inline-block'
      return wrapper
    }

    wrapper.addEventListener('dropover', e => {
      e.preventDefault()
      e.stopPropagation() // 阻止冒泡到外面的画布
    })
    wrapper.addEventListener('drop', e => {
      e.stopPropagation() // 阻止冒泡到外面的画布
      this.dropToInnerSlot = false
      this.removeMark()

      // 找到node-box节点的子节点
      const slotName = getSlotName(e.target) || 'default'
      const $nodeboxEl = lookupByClassName(e.target, 'node-box')
      const targetNodeboxId = $nodeboxEl.firstChild.getAttribute('data-id')
      const component = this.__component__.findComById(targetNodeboxId)
      const { accept = [] } = component

      // 1. 被drop的地方有组件，要判断是否可以被拖入（涉及布局组件和accept的逻辑）
      // 2. 被drop的地方没有组件，直接append
      if (accept.includes(state.data.name)) {
        const dom = this.append(state.data, e.target)
        const dropedVm = this._findVmByEl($nodeboxEl, this.viewModel)
        if (dropedVm) {
          const _node = { ...state.data, $el: dom, slotName, unique: randomString() }
          if (dropedVm.children) {
            dropedVm.children.push(_node)
          } else {
            dropedVm.children = [_node]
          }
        }

        this._dispathAppend()
        resetState()
      }
    })
    wrapper.addEventListener('dragenter', e => {
      e.stopPropagation()
      // 当被拖到 布局组件 slot 里才触发
      if (getSlotName(e.target) != null) {
        this.dropToInnerSlot = true
      }

      const pos = {}
      const children = e.target.children
      console.log('inner enter...')

      if (children.length) {
        const lastChild = children[children.length - 1]
        const rectPos = lastChild.getBoundingClientRect()
        pos.width = e.target.offsetWidth
        pos.left = rectPos.left
        pos.top = rectPos.top + lastChild.offsetHeight + 2
      } else {
        const rectPos = e.target.getBoundingClientRect()
        pos.width = e.target.offsetWidth
        pos.left = rectPos.left
        pos.top = rectPos.top + 2
      }

      this.showMark(pos)
    })
    wrapper.addEventListener('dragleave', (e) => {
      console.log('inner leave...')
      if (getSlotName(e.target) != null) {
        this.dropToInnerSlot = false
        this.removeMark()
      }
    })

    return wrapper
  }

  /**
   * 根据el 递归遍历找到节点
   * @param {HTMLElement} el
   * @param {Array} arr
   * @returns {*}
   */
  _findVmByEl(el, arr) {
    if (!arr) arr = this.viewModel
    for (const vm of arr) {
      if (vm.$el === el) return vm
      if (vm.children && vm.children.length) {
        const _vm = this._findVmByEl(el, vm.children)
        // important: 这里一定要加if判断 否则递归会断掉
        if (_vm) return _vm
      }
    }
  }

  _removeVmByEl(el, arr) {
    if (!arr) arr = this.viewModel
    for (let i = 0; i < arr.length; i++) {
      const vm = arr[i]
      if (vm.$el === el) {
        const movedArr = arr.splice(i, 1)
        return movedArr[0]
      }
      if (vm.children && vm.children.length) {
        const moved = this._removeVmByEl(el, vm.children)
        if (moved) return moved
      }
    }
  }

  _findVmByUniqueKey(key, arr) {
    if (!arr) arr = this.viewModel
    for (const vm of arr) {
      if (vm.unique === key) return vm
      if (vm.children && vm.children.length) {
        const _vm = this._findVmByUniqueKey(key, vm.children)
        if (_vm) return _vm
      }
    }
  }

  /**
   * 发送全局事件-添加节点
   */
  _dispathAppend() {
    this.__designer__.emit('actions', {
      type: ActionTypes.APPEND,
      data: state.data,
      viewModel: this.viewModel
    })
  }

  /**
   * 发送全局事件-删除节点
   */
  _dispathDelete(movedVm) {
    this.__designer__.emit('actions', {
      type: ActionTypes.DELETE,
      data: movedVm,
      viewModel: this.viewModel
    })
  }
}
