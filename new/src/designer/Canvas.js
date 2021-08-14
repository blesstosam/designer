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

// -----------------------------------------------------------
// | insertType      | append | prepend | after    | before  |
// -----------------------------------------------------------
const InsertTypes = {
  // value 要和 $及Node 的方法对应上
  APPEND: 'append',
  PREPEND: 'prepend',
  AFTER: 'after',
  BEFORE: 'before'
}
// 是否是 APPEND|PREPEND 类型操作
function isPendType(type) {
  return type === InsertTypes.APPEND || type === InsertTypes.PREPEND
}

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
    this.$canvasEl = null
    this.$markerEl = null
    this.dropToInnerSlot = false // 是否被拖入 nodebox 的 slot 容器

    this.resetInsertInfo()

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
    // canvas 的 init 依赖 components 插件，防止多次触发使用once
    this.__designer__.once(COMPONENTS_INITED, () => {
      const canvasStyle = (viewModel && viewModel.props.style) || this._getDefaultCanvasStyle()
      const div = (this.$canvasEl = $('<div>')
        .addClass('drop')
        .addClass('canvas-root')
        .style(canvasStyle).el)
      document.querySelector(this.config.canvasWrap).appendChild(div)

      if (viewModel != null) {
        this.model = new Node({ ...viewModel, $el: div })
      } else {
        this.model = new Node({
          name: 'canvas',
          $el: div,
          children: [],
          isRoot: true,
          props: { style: canvasStyle }
        })
        this.showTip(this.model)
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
    this.__dragDrop__.onDrop(this.$canvasEl, ({ getData }) => {
      console.log('wrapper drop...')
      this.removeMarker()

      const state = getData()
      if (state.data.componentType !== LAYOUT) {
        const blockCom = this.__components__.findComByName('VBlock')
        const wrapNode = this[this.insertType](blockCom, this.$canvasEl, this.viewModel)
        const slotName = lookdownForAttr(wrapNode.$el, SLOT_NAME_KEY)
        this.append({ ...state.data, slotName }, wrapNode.$el.children[0], wrapNode)
      } else {
        const newNode = this[this.insertType](state.data, this.$canvasEl, this.viewModel)
        this.showTip(newNode)
      }
      this.resetInsertInfo()
    })

    this.__dragDrop__.onDragOver(
      this.$canvasEl,
      throttle(({ $event: e }) => {
        console.log('wrapper over...')
        const { y, target } = e
        const style = { width: target.offsetWidth - DROP_EL_PADDING * 2 + 'px' }
        // https://github.com/Shopify/draggable/blob/6f5539b1f396a34b08fcbf0b52651ca1ee669665/examples/src/content/Draggable/DragEvents/index.js#L67
        // 上面说在拖动过程中使用getBoundingClientRect性能损耗大，后面验证一下
        const rectPos = this.$canvasEl.getBoundingClientRect()
        if (y < rectPos.y + DROP_EL_PADDING) {
          this.insertType = InsertTypes.PREPEND
          this.showMarker(style, e.target, InsertTypes.PREPEND)
        } else {
          const children = e.target.children
          if (children.length) {
            const lastChild = children[children.length - 1]
            const rectPos = lastChild.getBoundingClientRect()
            if (rectPos.height + rectPos.y < y) {
              // 有子元素但是在后面
              this.insertType = InsertTypes.APPEND
              this.showMarker(style, e.target, InsertTypes.APPEND)
            } else {
              /* 在中间插入，在nodebox里已经处理过marker了 这里不需要再处理 */
            }
          } else {
            // 没有子元素
            this.insertType = InsertTypes.APPEND
            this.showMarker(style, e.target, InsertTypes.APPEND)
          }
        }
      }, 200)
    )

    // enter 比 over 先触发
    this.__dragDrop__.onDragEnter(this.$canvasEl, ({ $event: e, addDragEnterCls }) => {
      addDragEnterCls(e)
      this.removeTip(this.model)
      console.log('wrapper enter...')
    })

    this.__dragDrop__.onDragLeave(this.$canvasEl, ({ removeDragEnterCls }) => {
      console.log('wrapper leave...')
      if (!this.dropToInnerSlot) {
        removeDragEnterCls()
        this.removeMarker()
        !this.model.children.length && this.showTip(this.model)
        this.resetInsertInfo()
      }
    })
  }

  resetInsertInfo() {
    this.insertType = ''
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

  showTip(node) {
    const span = $('<div>')
      .text('请将组件拖入这里')
      .addClass(TIP_EL_CLS)
      .style({ textAlign: 'center' }).el
    if (node.isRoot) {
      if (!node.$tipEl) {
        const el = (node.$tipEl = $(span).style({ paddingTop: '200px' }).el)
        this.$canvasEl.appendChild(el)
      }
    } else {
      const $firstSlotEl = lookdownByAttr(node.$el.children[0], SLOT_NAME_KEY)
      if ($firstSlotEl) {
        const el = (node.$tipEl = $(span).style({ paddingTop: '20px', color: '#666' }).el)
        $firstSlotEl.appendChild(el)
      }
      // const slotElArr = lookdownAllByAttr(newNode.$el.children[0], SLOT_NAME_KEY)
      // for (const slotEl of slotElArr) {
      //   slotEl.appendChild(el)
      // }
    }
  }

  removeTip(node) {
    node.$tipEl && node.$tipEl.remove()
    node.$tipEl = null
  }

  // TODO 是否用mousemove/mouseup来计算marker位置？
  showMarker(style, target, type) {
    if (!isPendType(type)) {
      if (this.$markerEl) {
        this.$markerEl.remove()
        this.$markerEl = null
      }
      const borderDir = type === InsertTypes.BEFORE ? 'border-top' : 'border-bottom'
      if (this.previous) {
        $(this.previous).style(this.previousBorder)
      }
      this.previous = target
      this.previousBorder = { [borderDir]: $(target).getStyle('border-bottom') }
      $(target).style({ [borderDir]: '3px solid #1989fa' })
    } else {
      if (this.previous) {
        $(this.previous).style(this.previousBorder)
        this.previous = null
        this.previousBorder = null
      }
      if (!this.$markerEl) {
        this.$markerEl = $('<div>').style({
          display: 'flex',
          background: '#1989fa',
          height: '3px',
          pointerEvents: 'auto', // 当进入被拖入元素的子元素时，也会触发dragleave事件 所以给marker元素加上 `pointerEvents:none`
          ...style
        }).el
      } else {
        $(this.$markerEl).style(style)
      }
      $(target)[type](this.$markerEl)
    }
  }

  removeMarker() {
    if (this.$markerEl) {
      this.$markerEl.remove()
      this.$markerEl = null
    }
    if (this.previous) {
      $(this.previous).style(this.previousBorder)
      this.previous = null
      this.previousBorder = null
    }
  }

  clear() {
    this.model.children = []
    this.$canvasEl.innerHTML = ''
    this.clearSelection()
    this.showTip(this.model)
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

  [InsertTypes.APPEND](com, container, parent, cancelDispatch = false) {
    return this.insertNode(com, container, parent, InsertTypes.APPEND, cancelDispatch)
  }

  [InsertTypes.PREPEND](com, container, parent, cancelDispatch = false) {
    return this.insertNode(com, container, parent, InsertTypes.PREPEND, cancelDispatch)
  }

  [InsertTypes.AFTER](com, siblingContainer, sibling, cancelDispatch = false) {
    return this.insertNode(com, siblingContainer, sibling, InsertTypes.AFTER, cancelDispatch)
  }

  [InsertTypes.BEFORE](com, siblingContainer, sibling, cancelDispatch = false) {
    return this.insertNode(com, siblingContainer, sibling, InsertTypes.BEFORE, cancelDispatch)
  }

  /**
   * @param {object} com 组件元数据
   * @param {HTMLElement} container dom容器
   * @param {object} parent 父级节点
   * @param {InsertTypes} insertType 插入类型
   * @param {boolean} cancelDispatch 是否触发事件
   * @returns {object}
   */
  insertNode(com, container, parentOrSibling, insertType, cancelDispatch = false) {
    const wrap = this.insertDom(com, container, insertType)
    const { APPEND, PREPEND } = InsertTypes
    const parent =
      insertType === APPEND || insertType === PREPEND ? parentOrSibling : parentOrSibling.parent
    const newNode = new Node({ ...com, $el: wrap }, parent)
    parentOrSibling[insertType](newNode)
    !cancelDispatch && this._dispathAppend(newNode)
    return newNode
  }

  /**
   * 将组件插入到画布渲染
   * @param {*} d 被拖入组件的元数据
   * @param {Element} container 被拖入的容器,也可以是兄弟元素
   * @param {InsertTypes} type 插入的位置
   */
  insertDom(d, container, type) {
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
      $(realContainer)[type](wrapper)
    }

    let $parentContainer = realContainer
    if (!isPendType(type)) $parentContainer = realContainer.parentNode
    if (!container.classList.contains('canvas-root')) {
      this._reCalculateContainerHeight($parentContainer, wrapper)
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
      this.handleNodeboxHoverRemove()
    })

    return wrapper
  }

  // 确保容器底部有一定距离方便拖放
  _reCalculateContainerHeight(container, lastChild) {
    const { y, height } = container.getBoundingClientRect()
    const { y: cY, height: cHeight } = lastChild.getBoundingClientRect()
    if (y + height - (cY + cHeight) < 20) {
      container.style.minHeight = height + 20 + 'px'
    }
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
   * 在节点外包一个div，监听 drop 等事件
   */
  _createNodebox(isLayout, isBlock) {
    const wrapper = $('<div>')
      .addClass(NODE_BOX_CLS)
      .style({
        position: 'relative',
        boxSizing: 'border-box'
      }).el

    // 非布局组件直接返回
    if (!isLayout) {
      if (!isBlock) wrapper.style.display = 'inline-block'
      return wrapper
    }

    $(wrapper).style({ padding: NODE_BOX_PADDING + 'px', border: '1px solid #dedede' })

    this.__dragDrop__.onDrop(
      wrapper,
      ({ $event: e, getData }) => {
        console.log('inner drop...')
        this.dropToInnerSlot = false
        this.removeMarker()

        // 找到node-box节点的子节点
        const slotName = getSlotName(e.target) || 'default'
        const $nodeboxEl = lookupByClassName(e.target, NODE_BOX_CLS)
        // console.log($nodeboxEl, '=========$nodeboxEl=======')
        const targetComName = $($nodeboxEl).firstElement.getAttribute('data-name')
        const component = this.__components__.findComByName(targetComName)

        const state = getData()
        if (isPendType(this.insertType)) {
          if (component.accept.includes(state.data.name)) {
            const dropedNode = this.model.findByEl($nodeboxEl)
            // console.log(this.insertType, '==========>')
            if (dropedNode) {
              this[this.insertType]({ ...state.data, slotName }, e.target, dropedNode)
            }
          }
        } else {
          const dropedNode = this.model.findByEl($nodeboxEl)
          // console.log(this.insertType, '==========>2')
          if (dropedNode) {
            // 找到其父级node
            const $parentNodeboxEl = lookupByClassName($nodeboxEl.parentNode, NODE_BOX_CLS)
            if ($parentNodeboxEl) {
              const targetParentComName = $($parentNodeboxEl).firstElement.getAttribute('data-name')
              const parentComponent = this.__components__.findComByName(targetParentComName)
              if (parentComponent.accept.includes(state.data.name)) {
                this[this.insertType](
                  { ...state.data },
                  lookupByClassName(e.target, NODE_BOX_CLS),
                  dropedNode
                )
              }
            } else {
              // 如果没有父级nodebox，则父级为 canvas-root
              if (state.data.componentType !== LAYOUT) {
                const blockCom = this.__components__.findComByName('VBlock')
                const wrapNode = this[this.insertType](
                  blockCom,
                  lookupByClassName(e.target, NODE_BOX_CLS),
                  dropedNode
                )
                const slotName = lookdownForAttr(wrapNode.$el, SLOT_NAME_KEY)
                this.append({ ...state.data, slotName }, wrapNode.$el.children[0], wrapNode)
              } else {
                const newNode = this[this.insertType](
                  { ...state.data },
                  lookupByClassName(e.target, NODE_BOX_CLS),
                  dropedNode
                )
                this.showTip(newNode)
              }
            }
          }
        }
        this.resetInsertInfo()
      },
      { stop: true }
    )

    this.__dragDrop__.onDragOver(
      wrapper,
      throttle(({ $event: e, getData }) => {
        console.log('inner over...')
        const { y, target } = e
        const rectPos = target.getBoundingClientRect()
        // console.log(rectPos.y, rectPos.height, y)

        const state = getData()
        const style = {
          width: state.data.isBlock ? e.target.offsetWidth - NODE_BOX_PADDING * 2 + 'px' : '100px'
        }

        // 5px是精度，可以调整
        if (y - rectPos.y <= 5) {
          this.insertType = InsertTypes.BEFORE
          this.showMarker(style, lookupByClassName(target, NODE_BOX_CLS), this.insertType)
        } else if (rectPos.y + rectPos.height - y <= 5) {
          this.insertType = InsertTypes.AFTER
          this.showMarker(style, lookupByClassName(target, NODE_BOX_CLS), this.insertType)
        } else {
          this.insertType = InsertTypes.APPEND
          this.showMarker(style, target, this.insertType)
        }
        // console.log(this.insertType, 'insertPos')
      }, 200),
      { stop: true }
    )

    this.__dragDrop__.onDragEnter(
      wrapper,
      ({ $event: e, addDragEnterCls }) => {
        // 当被拖到 布局组件 slot 里才触发
        if (getSlotName(e.target) != null) {
          this.dropToInnerSlot = true
          addDragEnterCls(e)
          const $nodeBoxEl = lookupByClassName(e.target, NODE_BOX_CLS)
          const targetNode = this.model.findByEl($nodeBoxEl)
          this.removeTip(targetNode)
        }
        console.log('inner enter...')
      },
      { stop: true }
    )

    this.__dragDrop__.onDragLeave(wrapper, ({ $event: e, removeDragEnterCls }) => {
      console.log('inner leave...')
      if (getSlotName(e.target) != null) {
        this.dropToInnerSlot = false
        removeDragEnterCls()
        this.removeMarker()
        const $nodeBoxEl = lookupByClassName(e.target, NODE_BOX_CLS)
        const targetNode = this.model.findByEl($nodeBoxEl)
        !e.target.children.length && this.showTip(targetNode)
        this.resetInsertInfo()
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
