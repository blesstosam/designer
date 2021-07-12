import { setCurrentViewNodeModel, state, resetState } from './config'
import { makeLogger } from './lib/util'
import { lookupByClassName, lookdownByAttr, lookdownForAttr, getStyle, $ } from './lib/dom'
import { Selection } from './Selection'
import { componentTypes } from './Components'
import { Node } from './Node'
import { ViewModel } from './ViewModel'
import { EVENT_TYPES } from './Event'

const {
  SELECTION_DEL_CLICK: F_D_C,
  SELECTION_COPY_CLICK: F_C_C,
  CANVAS_ACTIONS_APPEND: C_A_A,
  CANVAS_ACTIONS_DELETE: C_A_D,
  COMPONENTS_INITED,
  CANVAS_INITED,
  CANVAS_LAYOUTED
} = EVENT_TYPES

const { LAYOUT } = componentTypes
const DROP_EL_PADDING = 12,
  NODE_BOX_PADDING = 8
const SLOT_NAME_KEY = 'c-slot-name'
const DRAG_ENTER_CONTAINER_CLS = 'dragenter-actived'

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
    this.$canvasWrapEl = document.querySelector(this.config.canvasWrap)
    this.$canvasEl = null
    this.$markEl = null
    this.selection = null
    this.dropToInnerSlot = false // 是否被拖入 node-box 的 slot 容器
    this.model = null
  }

  get width() {
    return getStyle(this.$canvasEl, 'width')
  }
  get height() {
    return getStyle(this.$canvasEl, 'heighht')
  }

  // TODO 没有使用di的时候 只能一层层的找依赖
  get __components__() {
    return this.__designer__.__components__
  }
  get __attr__() {
    return this.__designer__.__attr__
  }
  get __componentTree__() {
    return this.__designer__.__componentTree__
  }

  get viewModel() {
    return this.model.data
  }

  init(viewModel) {
    const getDefaultCanvasStyle = () => {
      const { config } = this
      return {
        width: config.width || window.innerWidth - 550 + 'px', // 550为左右的宽度加边距
        height: config.height || '100%',
        minWidth: '100%',
        padding: DROP_EL_PADDING + 'px',
        paddingBottom: '24px',
        boxSizing: 'border-box',
        backgroundColor: '#ddd',
        overflowY: 'auto'
      }
    }
    // canvas 的 init 依赖 components 插件
    // 防止多次触发使用once
    this.__designer__.once(COMPONENTS_INITED, () => {
      const canvasStyle = (viewModel && viewModel.props.style) || getDefaultCanvasStyle()
      const div = (this.$canvasEl = $('<div>')
        .addClass('drop')
        .style(canvasStyle).el)
      this.$canvasWrapEl.appendChild(div)
      if (viewModel != null) {
        this.model = new ViewModel(new Node({ ...viewModel, $el: div }))
      } else {
        this.model = new ViewModel(
          new Node({
            name: 'canvas',
            $el: div,
            children: [],
            isRoot: true,
            props: { style: canvasStyle }
          })
        )
      }
      // ------- for debug -----------
      window.model = this.model
      this.bindCanvasEvents()
      this.layout(viewModel)
      this.initListener()
      this.__designer__.emit(CANVAS_INITED)
    })
  }

  initListener() {
    this.__designer__.on([F_D_C, F_C_C], payload => {
      const { type, data } = payload
      if (type === F_D_C) {
        const movedVm = this.model.removeVmByKey('$el', data.$el)
        movedVm && movedVm.$el.remove()
        this.clearSelection()
        setCurrentViewNodeModel(null)
        this._dispathDelete(movedVm)
      } else if (type === F_C_C) {
        const mount = (nodeArr, container, parent) => {
          for (const node of nodeArr) {
            const com = this.__components__.findComByName(node.name)
            const wrapper = this.append(com, container)
            const _node = new Node({ ...com, $el: wrapper }, parent)
            parent.children.push(_node)
            if (node.children && node.children.length) {
              mount(node.children, wrapper.children[0], _node)
            }
          }
        }
        mount([data], this.$canvasEl, this.viewModel)
        this._dispathAppend()
      }
    })
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
    this.$canvasEl.addEventListener('drop', e => {
      state.dropEnterTarget && state.dropEnterTarget.classList.remove(DRAG_ENTER_CONTAINER_CLS)
      this.removeMark()

      if (state.data.componentType !== LAYOUT) {
        const blockCom = this.__components__.findComByName('VBlock')
        const wrap = this.append(blockCom, this.$canvasEl)
        this.model.appendTo(new Node({ ...blockCom, $el: wrap }))

        const dom = this.append(state.data, wrap.children[0])
        const lastNode = this.model.getLastNode()
        const slotName = lookdownForAttr(wrap, SLOT_NAME_KEY)
        this.model.appendTo(new Node({ ...state.data, $el: dom, slotName }, lastNode), lastNode)
      } else {
        const dom = this.append(state.data, this.$canvasEl)
        this.model.appendTo(new Node({ ...state.data, $el: dom }))
      }

      this._dispathAppend()
      resetState()
    })

    this.$canvasEl.addEventListener('dragover', e => {
      e.preventDefault()
    })

    this.$canvasEl.addEventListener('dragenter', e => {
      state.dropEnterTarget = e.target
      // 用户可以使用该类写拖入效果
      e.target.classList.add(DRAG_ENTER_CONTAINER_CLS)
      const pos = {}
      const children = e.target.children
      console.log('wrapper enter...')
      if (children.length) {
        const lastChild = children[children.length - 1]
        const rectPos = lastChild.getBoundingClientRect()
        pos.width = e.target.offsetWidth - DROP_EL_PADDING * 2
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

    this.$canvasEl.addEventListener('dragleave', e => {
      console.log('wraper leave...')
      if (!this.dropToInnerSlot) {
        state.dropEnterTarget && state.dropEnterTarget.classList.remove(DRAG_ENTER_CONTAINER_CLS)
        this.removeMark()
      }
    })
  }

  scrollToBottom() {
    this.$canvasEl.scrollTop = this.$canvasEl.scrollHeight
  }

  showMark(pos) {
    const { width, left, top } = pos
    if (!this.$markEl) {
      const mark = (this.$markEl = $('<div>').style({
        borderTop: '3px solid #1989fa',
        background: '#eef1db',
        position: 'absolute',
        left: left + 'px',
        top: top + 'px',
        width: width + 'px',
        height: '20px',
        // 当进入被拖入元素的子元素时，也会触发dragleave事件 所以给mark元素加上 `pointerEvents:none`
        pointerEvents: 'none'
      }).el)
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
    this.model.clear()
    this.$canvasEl.innerHTML = ''
    this.clearSelection()
    localStorage.clear('viewModel')
    this.__designer__.emit(C_A_D, {
      type: C_A_D,
      viewModel: []
    })
  }

  clearSelection() {
    if (this.selection) {
      this.selection.remove()
      this.selection = null
      this.__attr__.vueInstance.resetData()
    }
  }

  /**
   * 根据 viewModel 来渲染页面
   * @returns {*} void
   */
  layout(viewModel) {
    if (!viewModel || !viewModel.children) return
    const mount = (nodeArr, container, parent) => {
      for (let i = 0; i < nodeArr.length; i++) {
        const node = nodeArr[i]
        // 在序列化数据的时候 =>
        // 将函数类型的属性丢失了 所以要从 config 里找回 有 render，transformProps
        // 将 $el 丢失了 需要重新赋值
        const com = this.__components__.findComByName(node.name)
        node.accept = com.accept
        node.icon = com.icon
        node.render = com.render
        com.transformProps && (node.transformProps = com.transformProps)
        const wrapper = (node.$el = this.append(node, container))
        nodeArr[i] = new Node(node, parent)
        parent.children.push(nodeArr[i])
        if (node.children && node.children.length) {
          mount(node.children, wrapper.children[0], nodeArr[i])
        }
      }
    }

    mount(viewModel.children, this.$canvasEl, this.viewModel)
    this.__designer__.emit(CANVAS_LAYOUTED)
  }

  /**
   * 将组件插入到画布渲染
   * @param {*} d 被拖入组件的元数据
   * @param {Element} container 被拖入的容器（组件或最外层的画布）
   */
  append(d, container) {
    const isLayout = d.componentType === LAYOUT
    const wrapper = this.createNodebox(isLayout, d.isBlock)
    const res = d.render()
    $(res).attr({ 'data-name': d.name })
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

    this.scrollToBottom()

    wrapper.addEventListener(
      'click',
      _e => {
        logger(_e.target)
        _e.stopPropagation()

        // 查找 node-box 节点 更新当前节点 通知属性面板更新
        const $nodeboxEl = lookupByClassName(_e.target, 'node-box')
        const node = this.model.findVmByKey('$el', $nodeboxEl)
        if (node) {
          this.handleNodeboxSelect(node)
        }
      }
      // true
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
    const vm = this.model.findVmByKey('$el', el)
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

    if (this.selection) {
      this.selection.update(node)
    } else {
      this.selection = new Selection(this.__designer__)
      this.selection.create(node)
    }

    this.__componentTree__ && this.__componentTree__.setCurrentKey(node.unique)
  }

  /**
   * 在节点外包一个div，监听 drop 事件
   */
  createNodebox(isLayout, isBlock) {
    const wrapper = $('<div>')
      .addClass('node-box')
      .style({
        position: 'relative',
        boxSizing: 'border-box'
      }).el

    if (!isLayout) {
      if (!isBlock) {
        wrapper.style.display = 'inline-block'
      }
      return wrapper
    }

    $(wrapper).style({ padding: NODE_BOX_PADDING + 'px', backgroundColor: '#fff' })

    wrapper.addEventListener('drop', e => {
      e.stopPropagation() // 阻止冒泡到外面的画布

      state.dropEnterTarget && state.dropEnterTarget.classList.remove(DRAG_ENTER_CONTAINER_CLS)
      this.dropToInnerSlot = false
      this.removeMark()

      // 找到node-box节点的子节点
      const slotName = getSlotName(e.target) || 'default'
      const $nodeboxEl = lookupByClassName(e.target, 'node-box')
      const targetNodeboxName = $nodeboxEl.firstChild.getAttribute('data-name')
      const component = this.__components__.findComByName(targetNodeboxName)

      // 1. 被drop的地方有组件，要判断是否可以被拖入
      // 2. 被drop的地方没有组件，直接append
      if (component.accept.includes(state.data.name)) {
        const dom = this.append(state.data, e.target)
        const dropedVm = this.model.findVmByKey('$el', $nodeboxEl)
        if (dropedVm) {
          this.model.appendTo(new Node({ ...state.data, $el: dom, slotName }, dropedVm), dropedVm)
        }

        this._dispathAppend()
        resetState()
      }
    })
    wrapper.addEventListener('dropover', e => {
      e.preventDefault()
      e.stopPropagation() // 阻止冒泡到外面的画布
    })
    wrapper.addEventListener('dragenter', e => {
      e.stopPropagation()

      // 当被拖到 布局组件 slot 里才触发
      if (getSlotName(e.target) != null) {
        this.dropToInnerSlot = true
        state.dropEnterTarget = e.target
        e.target.classList.add(DRAG_ENTER_CONTAINER_CLS)
      }

      console.log('inner enter...')
      const pos = {}
      const children = e.target.children
      if (children.length) {
        const lastChild = children[children.length - 1]
        const rectPos = lastChild.getBoundingClientRect()
        if (state.data.isBlock) {
          const wrapPos = e.target.getBoundingClientRect()
          pos.width = e.target.offsetWidth - NODE_BOX_PADDING * 2
          pos.left = wrapPos.left
          pos.top = rectPos.top + lastChild.offsetHeight + 2
        } else {
          pos.width = 100
          if (getStyle(lastChild, 'display') === 'block') {
            pos.left = rectPos.left
            pos.top = rectPos.top + lastChild.offsetHeight + 2
          } else {
            pos.left = rectPos.left + rectPos.width
            pos.top = rectPos.top
          }
        }
      } else {
        const rectPos = e.target.getBoundingClientRect()
        if (state.data.isBlock) {
          pos.width = e.target.offsetWidth - NODE_BOX_PADDING * 2
          pos.left = rectPos.left
          pos.top = rectPos.top + 2
        } else {
          pos.width = 100
          pos.left = rectPos.left
          pos.top = rectPos.top + 2
        }
      }

      this.showMark(pos)
    })
    wrapper.addEventListener('dragleave', e => {
      console.log('inner leave...')
      if (getSlotName(e.target) != null) {
        this.dropToInnerSlot = false
        state.dropEnterTarget && state.dropEnterTarget.classList.remove(DRAG_ENTER_CONTAINER_CLS)
        this.removeMark()
      }
    })

    return wrapper
  }

  /**
   * 发送全局事件-添加节点
   */
  _dispathAppend() {
    this.__designer__.emit(C_A_A, {
      type: C_A_A,
      data: state.data,
      viewModel: this.viewModel
    })
  }

  /**
   * 发送全局事件-删除节点
   */
  _dispathDelete(movedVm) {
    this.__designer__.emit(C_A_D, {
      type: C_A_D,
      data: movedVm,
      viewModel: this.viewModel
    })
  }
}
