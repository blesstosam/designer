import { setCurrentViewNodeModel } from './config'
import {
  lookupByClassName,
  lookdownByAttr,
  lookdownForAttr,
  getStyle,
  $,
  lookdownAllByAttr
} from './lib/dom'
import { Selection } from './Selection'
import { componentTypes } from './Components'
import { Node } from './Node'
import { EVENT_TYPES } from './Event'
import { Hover } from './Hover'
import { changeProps } from './components/render-util'
import { throttle } from './lib/util'

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
export const DROP_EL_PADDING = 8,
  NODE_BOX_PADDING = 0
const SLOT_NAME_KEY = 'c-slot-name'
const TIP_EL_CLS = 'canvas-tip'
const NODE_BOX_CLS = 'node-box'

function getSlotName(el) {
  return el.getAttribute(SLOT_NAME_KEY)
}

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
    this.$markerEl = null
    this.$tipEl = null
    this.dropToInnerSlot = false // 是否被拖入 nodebox 的 slot 容器
    this.model = null
    this.selection = null
    this.hover = null
  }

  get width() {
    return getStyle(this.$canvasEl, 'width')
  }
  get height() {
    return getStyle(this.$canvasEl, 'height')
  }
  get x() {
    return this.$canvasEl.getBoundingClientRect().x
  }
  get y() {
    return this.$canvasEl.getBoundingClientRect().y
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
  get __dragDrop__() {
    return this.__designer__.__dragDrop__
  }

  get viewModel() {
    return this.model
  }

  init(viewModel) {
    // canvas 的 init 依赖 components 插件
    // 防止多次触发使用once
    this.__designer__.once(COMPONENTS_INITED, () => {
      const canvasStyle = (viewModel && viewModel.props.style) || this._getDefaultCanvasStyle()
      const div = (this.$canvasEl = $('<div>')
        .addClass('drop')
        .style(canvasStyle).el)
      this.$canvasWrapEl.appendChild(div)
      if (viewModel != null) {
        this.model = new Node({ ...viewModel, $el: div })
      } else {
        this.showTip()
        this.model = new Node({
          name: 'canvas',
          $el: div,
          children: [],
          isRoot: true,
          props: { style: canvasStyle }
        })
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
        this.remove(data)
      } else if (type === F_C_C) {
        const mount = (nodeArr, parent) => {
          for (const node of nodeArr) {
            const com = this.__components__.findComByName(node.name)
            const targetEl = parent.$el === this.$canvasEl ? this.$canvasEl : parent.$el.children[0]
            const newNode = this.append(com, targetEl, parent)
            if (node.children && node.children.length) {
              mount(node.children, newNode)
            }
          }
        }
        mount([data], this.viewModel)
      }
    })

    // auto select appended node
    this.__designer__.on(
      C_A_A,
      throttle(({ data }) => {
        this.handleNodeboxSelect(data)
      }, 500)
    )
  }

  bindCanvasEvents() {
    // 父子元素事件触发顺序
    // 先拖入父容器，再到子容器 wrap enter => inner enter => wrap leave => inner leave => wrap leave
    // 只拖入子容器 inner enter => inner leave => wrap leave
    // 只拖入父容器 wrap enter => wrap leave
    // 嵌套div拖入 wrap enter => inner enter => wrap leave => inside enter => inner leave => ...
    this.__dragDrop__.bindDrop(this.$canvasEl, ({ getData }) => {
      console.log('drop...')
      this.removeMarker()

      const state = getData()
      if (state.data.componentType !== LAYOUT) {
        const blockCom = this.__components__.findComByName('VBlock')
        const wrapNode = this.insertBefore
          ? this.prepend(blockCom, this.$canvasEl, this.viewModel)
          : this.append(blockCom, this.$canvasEl, this.viewModel)

        const slotName = lookdownForAttr(wrapNode.$el, SLOT_NAME_KEY)
        this.append({ ...state.data, slotName }, wrapNode.$el.children[0], wrapNode)
      } else {
        const newNode = this.insertBefore
          ? this.prepend(state.data, this.$canvasEl, this.viewModel)
          : this.append(state.data, this.$canvasEl, this.viewModel)
        const $firstSlotEl = lookdownByAttr(newNode.$el.children[0], SLOT_NAME_KEY)
        $firstSlotEl && this.showTip($firstSlotEl)
        // const slotElArr = lookdownAllByAttr(newNode.$el.children[0], SLOT_NAME_KEY)
        // for (const el of slotElArr) {
        //   this.showTip(el)
        // }
      }
      // reset
      this.insertBefore = false
    })

    this.__dragDrop__.bindDragOver(
      this.$canvasEl,
      throttle(({ $event: e }) => {
        const { x, y, target } = e
        let pos = {}
        const rectPos = this.$canvasEl.getBoundingClientRect()
        if (y < rectPos.y + DROP_EL_PADDING) {
          pos = {
            width: target.offsetWidth - DROP_EL_PADDING * 2,
            top: rectPos.y + DROP_EL_PADDING,
            left: rectPos.left + DROP_EL_PADDING
          }
          this.insertBefore = true
          this.showMarker(pos, e.target, 'before')
        } else {
          const children = e.target.children
          if (children.length) {
            const lastChild = children[children.length - 1]
            const rectPos = lastChild.getBoundingClientRect()
            pos = {
              width: e.target.offsetWidth - DROP_EL_PADDING * 2,
              left: rectPos.left,
              top: rectPos.top + lastChild.offsetHeight + 2
            }
          } else {
            const rectPos = e.target.getBoundingClientRect()
            pos = {
              width: e.target.offsetWidth,
              left: rectPos.left,
              top: rectPos.top + 2
            }
          }
          this.showMarker(pos, e.target)
        }
      }, 200)
    )

    this.__dragDrop__.bindDragEnter(this.$canvasEl, ({ $event: e, addDragEnterCls }) => {
      addDragEnterCls(e)
      this.removeTip()
      console.log('wrapper enter...')
    })

    this.__dragDrop__.bindDragLeave(this.$canvasEl, ({ removeDragEnterCls }) => {
      console.log('wraper leave...')
      if (!this.dropToInnerSlot) {
        removeDragEnterCls()
        this.removeMarker()
        !this.viewModel && this.showTip()
      }
    })
  }

  _getDefaultCanvasStyle() {
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

  scrollToBottom() {
    this.$canvasEl.scrollTop = this.$canvasEl.scrollHeight
  }

  showTip(targetEl) {
    if (!targetEl) {
      if (!this.$tipEl) {
        const span = (this.$tipEl = $('<div>')
          .text('请将组件拖入这里')
          .addClass(TIP_EL_CLS)
          .style({
            textAlign: 'center',
            paddingTop: '200px'
          }).el)
        this.$canvasEl.appendChild(span)
      }
    } else {
      // TODO 如果需要保存el 则传入 const span = node.$tipEl = xxx
      const span = $('<div>')
        .text('请将组件拖入这里')
        .addClass(TIP_EL_CLS)
        .style({
          textAlign: 'center',
          paddingTop: '20px',
          color: '#666'
        }).el
      targetEl.appendChild(span)
    }
  }

  removeTip(targetEl) {
    if (!targetEl) {
      this.$tipEl && this.$tipEl.remove()
      this.$tipEl = null
    } else {
      const el = targetEl.children[0]
      el && el.classList.contains(TIP_EL_CLS) && targetEl.children[0].remove()
    }
  }

  // TODO 是否用mousemove/mouseup来计算marker位置？
  showMarker(pos, target, type = 'after') {
    const { width, left, top } = pos
    if (!this.$markerEl) {
      const marker = (this.$markerEl = $('<div>').style({
        borderTop: '3px solid #1989fa',
        background: '#eef1db',
        // position: 'absolute',
        // left: left + 'px',
        // top: top + 'px',
        width: width + 'px',
        height: '20px',
        marginBottom: '12px',
        // 当进入被拖入元素的子元素时，也会触发dragleave事件 所以给mark元素加上 `pointerEvents:none`
        pointerEvents: 'none'
      }).el)
      type === 'before' ? $(target).prepend(marker) : target.appendChild(marker)
    } else {
      $(this.$markerEl).style({
        width: width + 'px'
        // left: left + 'px',
        // top: top + 'px'
      })
      type === 'before' ? $(target).prepend(this.$markerEl) : target.appendChild(this.$markerEl)
    }
  }

  removeMarker() {
    this.$markerEl && this.$markerEl.remove()
    this.$markerEl = null
  }

  clear() {
    const canvasStyle =
      (this.viewModel && this.viewModel.props.style) || this._getDefaultCanvasStyle()
    this.model = new Node({
      name: 'canvas',
      $el: this.viewModel.$el,
      children: [],
      isRoot: true,
      props: { style: canvasStyle }
    })

    this.$canvasEl.innerHTML = ''
    this.clearSelection()
    this.showTip()
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
    if (!viewModel || !viewModel.children) {
      this.__designer__.emit(CANVAS_LAYOUTED)
      return
    }
    const mount = (nodeArr, parent) => {
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

        const targetEl = parent.$el === this.$canvasEl ? this.$canvasEl : parent.$el.children[0]
        nodeArr[i] = this.append(node, targetEl, parent, true)
        if (node.children && node.children.length) {
          mount(node.children, nodeArr[i])
        }
      }
    }

    mount(viewModel.children, this.viewModel)
    this.__designer__.emit(CANVAS_LAYOUTED)
  }

  append(com, container, parent, cancelDispatch = false) {
    const wrap = this.insertDom(com, container)
    const newNode = new Node({ ...com, $el: wrap }, parent)
    parent.append(newNode)
    !cancelDispatch && this._dispathAppend(newNode)
    return newNode
  }

  prepend(com, container, parent, cancelDispatch = false) {
    const wrap = this.insertDom(com, container, 'before')
    const newNode = new Node({ ...com, $el: wrap }, parent)
    parent.prepend(newNode)
    !cancelDispatch && this._dispathAppend(newNode)
    return newNode
  }

  /**
   * 将组件插入到画布渲染
   * @param {*} d 被拖入组件的元数据
   * @param {Element} container 被拖入的容器（组件或最外层的画布）
   * @param {enum} type: before|after 插入的位置
   */
  insertDom(d, container, type = 'after') {
    const isLayout = d.componentType === LAYOUT
    const wrapper = this._createNodebox(isLayout, d.isBlock)
    const res = d.$el || d.render() // 如果是点击下一步按钮，此时的$el已经生成了，可以复用
    $(res).attr({ 'data-name': d.name })
    wrapper.appendChild(res)

    // 当组件的slotname 为 default 时，直接插入到容器的末尾
    // 当组件的slotname 不为 default 时，需要查找对应的容器
    const slotName = d.slotName || 'default'
    let realContainer = container
    if (slotName !== 'default') {
      realContainer = lookdownByAttr(container, SLOT_NAME_KEY, d.slotName)
    } else {
      //  TODO 是否去掉该分支 明确要求布局组件要有c-slot-name属性
    }
    if (realContainer) {
      type === 'after' ? realContainer.appendChild(wrapper) : $(realContainer).prepend(wrapper)
    }

    this.scrollToBottom()

    wrapper.addEventListener(
      'click',
      e => {
        e.stopPropagation()
        // 查找 node-box 节点 更新当前节点 通知属性面板更新
        const $nodeboxEl = lookupByClassName(e.target, NODE_BOX_CLS)
        const node = this.model.findByEl($nodeboxEl)
        node && this.handleNodeboxSelect(node)
      }
      // true
    )
    wrapper.addEventListener('mouseover', e => {
      const $nodeBoxEl = lookupByClassName(e.target, NODE_BOX_CLS)
      const node = this.model.findByEl($nodeBoxEl)
      this.handleNodeboxHover(node)
    })
    wrapper.addEventListener('mouseleave', e => {
      // const $nodeBoxEl = lookupByClassName(e.target, NODE_BOX_CLS)
      this.handleNodeboxHoverRemove()
    })

    return wrapper
  }

  /**
   * 重新渲染某个组件
   * @param {*} el 所在组件渲染的dom节点
   * @param {*} item 属性对象
   * @param {*} val 属性值
   */
  patch(el, item, val) {
    const node = this.model.findByEl(el)
    // TODO 更新attrs 有没有遍历 json schema 的库？
    const configCates = node.attrs.properties.configs.items
    for (const cfgCate of configCates) {
      for (const cfg of cfgCate.properties.children.items) {
        if (cfg.properties.id.const === item.id) {
          cfg.properties.value.default = val
        }
      }
    }

    if (node && node.props) {
      changeProps({ [item.id]: val }, node.props)
      node.transformProps && node.transformProps(node.props)
    }
  }

  remove(node) {
    const movedNode = this.model.removeByKey('$el', node.$el)
    movedNode.$el.remove()
    this.clearSelection()
    setCurrentViewNodeModel(null)
    this._dispathDelete(movedNode)
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

  handleNodeboxHover(node) {
    if (this.hover) {
      this.hover.update(node)
    } else {
      this.hover = new Hover({}, this.__designer__)
      this.hover.create(node)
    }
  }

  handleNodeboxHoverRemove() {
    this.hover && this.hover.remove()
  }

  /**
   * 在节点外包一个div，监听 drop 事件
   */
  _createNodebox(isLayout, isBlock) {
    const wrapper = $('<div>')
      .addClass(NODE_BOX_CLS)
      .style({
        position: 'relative',
        boxSizing: 'border-box'
      }).el

    if (!isLayout) {
      if (!isBlock) {
        wrapper.style.display = 'inline-block'
      }
      return wrapper
    } else {
      wrapper.style.border = '1px solid #dedede'
    }

    $(wrapper).style({ padding: NODE_BOX_PADDING + 'px' })

    this.__dragDrop__.bindDrop(
      wrapper,
      ({ $event: e, getData }) => {
        this.dropToInnerSlot = false
        this.removeMarker()

        // 找到node-box节点的子节点
        const slotName = getSlotName(e.target) || 'default'
        const $nodeboxEl = lookupByClassName(e.target, NODE_BOX_CLS)
        const targetNodeboxName = $($nodeboxEl).firstElement.getAttribute('data-name')
        const component = this.__components__.findComByName(targetNodeboxName)

        const state = getData()
        if (component.accept.includes(state.data.name)) {
          const dropedNode = this.model.findByEl($nodeboxEl)
          if (dropedNode) {
            this.append({ ...state.data, slotName }, e.target, dropedNode)
          }
        }
      },
      { stop: true }
    )

    this.__dragDrop__.bindDragOver(wrapper, null, { stop: true })

    this.__dragDrop__.bindDragEnter(
      wrapper,
      ({ $event: e, addDragEnterCls, getData }) => {
        // 当被拖到 布局组件 slot 里才触发
        if (getSlotName(e.target) != null) {
          this.dropToInnerSlot = true
          addDragEnterCls(e)
          this.removeTip(e.target)
        }

        console.log('inner enter...')
        // TODO 增加insertbefore逻辑
        const state = getData()
        let pos = {}
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
        this.showMarker(pos, e.target)
      },
      { stop: true }
    )

    this.__dragDrop__.bindDragLeave(wrapper, ({ $event: e, removeDragEnterCls }) => {
      console.log('inner leave...')
      if (getSlotName(e.target) != null) {
        this.dropToInnerSlot = false
        removeDragEnterCls()
        this.removeMarker()
        // 确保容器没有子元素
        !e.target.children.length && this.showTip(e.target)
      }
    })

    return wrapper
  }

  /**
   * 发送全局事件-添加节点
   */
  _dispathAppend(node) {
    this.__designer__.emit(C_A_A, {
      type: C_A_A,
      data: node,
      viewModel: this.viewModel
    })
  }

  /**
   * 发送全局事件-删除节点
   */
  _dispathDelete(movedNode) {
    this.__designer__.emit(C_A_D, {
      type: C_A_D,
      data: movedNode,
      viewModel: this.viewModel
    })
  }
}
