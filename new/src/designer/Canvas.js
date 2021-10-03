import { setCurrentViewNodeModel } from './config'
import { lookupByClassName, lookdownByAttr, lookdownForAttr, getStyle, $ } from './lib/dom'
import { Selection } from './Selection'
import { componentTypes } from './Components'
import { Node } from './Node'
import { EVENT_TYPES } from './Event'
import { Hover } from './Hover'
import { changeProps } from './components/render-util'
import { arrayMoveMutable, throttle } from './lib/util'
import { InsertTypes, isPendType } from './InsertTypes'
import cloneDeep from 'lodash.clonedeep'

const {
  SELECTION_DEL_CLICK: S_D_C,
  SELECTION_COPY_CLICK: S_C_C,
  CANVAS_ACTIONS_APPEND: C_A_A,
  CANVAS_ACTIONS_PREPEND,
  CANVAS_ACTIONS_AFTER,
  CANVAS_ACTIONS_BEFORE,
  CANVAS_ACTIONS_DELETE: C_A_D,
  CANVAS_ACTIONS_CLEAR: C_A_C,
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

const getSlotName = el => el.getAttribute(SLOT_NAME_KEY)
const getFirstSlotElOfNode = node => lookdownByAttr(node.$el.children[0], SLOT_NAME_KEY)

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
          title: 'root',
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
      this.handleNodeboxSelect(this.model)
      this.__designer__.emit(CANVAS_INITED)
    })
  }

  initListener() {
    this.__designer__.on([S_D_C, S_C_C], payload => {
      const { type, data } = payload
      if (type === S_D_C) {
        this.remove(data)
      } else if (type === S_C_C) {
        const mount = (nodeArr, parent) => {
          for (const node of nodeArr) {
            const com = this.__components__.findComByName(node.name)
            const $targetEl =
              parent.$el === this.$canvasEl ? this.$canvasEl : getFirstSlotElOfNode(parent)
            const newNode = this[InsertTypes.APPEND](com, $targetEl, parent)
            if (node.children && node.children.length) {
              mount(node.children, newNode)
            }
          }
        }
        const com = this.__components__.findComByName(data.name)
        const newNode = this[InsertTypes.AFTER](com, data.$el, data)
        mount(data.children, newNode)
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

      // canvas容器只有两种情况 prepend&append
      const state = getData()
      if (state.isMove) {
        if (state.data.componentType !== LAYOUT) {
          // inner to wrap
          // 1. 包一层wrap
          const blockCom = this.__components__.findComByName('VBlock')
          const wrapNode = this[this.insertType](blockCom, this.$canvasEl, this.model)
          // 2. 移动dom到新容器
          wrapNode.$el.children[0].appendChild(state.data.$el)
          // 3. 操作model
          state.data.remove()
          wrapNode[InsertTypes.APPEND](state.data)
        } else {
          // B. wrap to wrap
          // 1. 移动dom
          $(this.$canvasEl)[this.insertType](state.data.$el)
          // 2. 操作model
          const fromIndex = this.model.children.findIndex(i => i.$el === state.data.$el)
          const toIndex = this.insertType === InsertTypes.APPEND ? this.model.children.length : 0
          arrayMoveMutable(this.model.children, fromIndex, toIndex)
          // 3. 更新selection位置
          this.selection && this.selection.update()
        }
      } else {
        if (state.data.componentType !== LAYOUT) {
          this.wrapBlockThenInsert({
            insertType: this.insertType,
            state,
            siblingOrParentDom: this.$canvasEl,
            parentNode: this.model
          })
        } else {
          const newNode = this[this.insertType](state.data, this.$canvasEl, this.model)
          this.showTip(newNode)
        }
      }

      this.resetInsertInfo()
      this.__designer__.emit(EVENT_TYPES.COMPONENTS_DROPED)
    })

    this.__dragDrop__.onDragOver(
      this.$canvasEl,
      throttle(({ $event: e }) => {
        console.log('wrapper over...')
        this.__designer__.__cursor__.setPosition({
          pageX: e.pageX,
          pageY: e.pageY,
          clientX: e.clientX,
          clientY: e.clientY,
          offsetX: e.offsetX,
          offsetY: e.offsetY
        })
        const { y, target } = e
        const style = { width: target.offsetWidth - DROP_EL_PADDING * 2 + 'px' }
        // https://github.com/Shopify/draggable/blob/6f5539b1f396a34b08fcbf0b52651ca1ee669665/examples/src/content/Draggable/DragEvents/index.js#L67
        // 上面说在拖动过程中使用getBoundingClientRect性能损耗大，后面验证一下
        const rectPos = this.$canvasEl.getBoundingClientRect()
        if (y < rectPos.y + DROP_EL_PADDING) {
          this.insertType = InsertTypes.PREPEND
          this.showMarker(style, e.target, InsertTypes.PREPEND)
        } else {
          const children = this.model.children
          if (children.length) {
            const lastChild = children[children.length - 1].$el
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

    this.$canvasEl.addEventListener('mouseleave', e => {
      this.handleNodeboxHoverRemove()
    })
  }

  resetInsertInfo() {
    this.insertType = ''
  }

  _getDefaultCanvasStyle() {
    const { config } = this
    return {
      position: 'relative',
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
      .style({ textAlign: 'center', pointerEvents: 'none' }).el
    if (node.isRoot) {
      if (!node.$tipEl) {
        const el = (node.$tipEl = $(span).style({ paddingTop: '200px' }).el)
        this.$canvasEl.appendChild(el)
      }
    } else {
      const $firstSlotEl = getFirstSlotElOfNode(node)
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
    this.__designer__.emit(C_A_C, { type: C_A_C, viewModel: [] })
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
        nodeArr[i] = this[InsertTypes.APPEND](node, targetEl, parent, true)
        if (node.children && node.children.length) {
          mount(node.children, nodeArr[i])
        }
      }
    }

    mount(viewModel.children, this.model)
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
   * @param {object} parentOrSibling 父级节点或兄弟节点
   * @param {InsertTypes} insertType 插入类型
   * @param {boolean} cancelDispatch 是否触发事件
   * @returns {object}
   */
  insertNode(com, container, parentOrSibling, insertType, cancelDispatch = false) {
    const wrap = this.insertDom(com, container, insertType)
    const { APPEND, PREPEND } = InsertTypes
    const parent =
      insertType === APPEND || insertType === PREPEND ? parentOrSibling : parentOrSibling.parent
    const newNode = new Node({ ...com, attrs: cloneDeep(com.attrs), $el: wrap }, parent)
    parentOrSibling[insertType](newNode)
    !cancelDispatch && this._dispathInsert(insertType, newNode)
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
    let wrapper = d.$el // 如果是上一步/下一步这种操作，可以复用dom结构
    if (!wrapper) {
      wrapper = this._createNodebox(isLayout, d.isBlock)
      const res = d.render()
      $(res).attr({ 'data-name': d.name })
      wrapper.appendChild(res)
    }

    // 当组件的slotname 为 default 时，直接插入到容器的末尾；不为 default 时，需要查找对应的容器
    const slotName = d.slotName || 'default'
    // TODO 这里的container可以去掉 由parentNode.$el 计算
    // 1. 当是append或prepend的时候，查找其 slot容器元素
    // 2. 当是after或before时候，直接使用siblingNode.$el
    let realContainer = container
    if (slotName !== 'default') {
      realContainer = lookdownByAttr(container, SLOT_NAME_KEY, d.slotName)
    } else {
      /* TODO 是否去掉该分支 明确要求布局组件要有c-slot-name属性 */
    }
    if (realContainer) $(realContainer)[type](wrapper)

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
    // wrapper.addEventListener('mouseleave', e => {
    //   this.handleNodeboxHoverRemove()
    // })

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

  toggleDisplay(node, isShow) {
    isShow ? $(node.$el).show() : $(node.$el).hide()
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

    const getComponentMetaData = targetEl => {
      const $nodeboxEl = lookupByClassName(targetEl, NODE_BOX_CLS)
      if (!$nodeboxEl) return []
      const targetComName = $($nodeboxEl).firstElement.getAttribute('data-name')
      return [this.__components__.findComByName(targetComName), $nodeboxEl]
    }

    this.__dragDrop__.onDrop(
      wrapper,
      ({ $event: e, getData }) => {
        console.log('inner drop...')
        this.dropToInnerSlot = false
        this.removeMarker()

        // nodebox有三种情况 append & before & after
        // 找到node-box节点的子节点
        const slotName = getSlotName(e.target) || 'default'
        const [componentMeta, $nodeboxEl] = getComponentMetaData(e.target)
        const dropedNode = this.model.findByEl($nodeboxEl)
        const state = getData()
        if (state.isMove) {
          if (isPendType(this.insertType)) {
            // 只能是append
            // 1. 移动dom 找到dropedNode的slot TODO 如果有多个slot怎么办??
            const $firstSlotEl = getFirstSlotElOfNode(dropedNode)
            $($firstSlotEl)[this.insertType](state.data.$el)
            if (state.data.getIsMyParent(dropedNode)) {
              // inner to inner(same container)
              // 2-1 操作model
              const fromIndex = dropedNode.children.findIndex(i => i.$el === state.data.$el)
              const toIndex = dropedNode.children.length
              arrayMoveMutable(dropedNode.children, fromIndex, toIndex)
            } else {
              // inner to inner(other container)
              // 2-2 操作model
              state.data.remove()
              dropedNode[this.insertType](state.data)
            }
            // 3. 更新selection
            this.selection && this.selection.update()
          } else {
            // 可能是after或before
            // 1. 移动dom
            $(dropedNode.$el)[this.insertType](state.data.$el)
            if (state.data.getIsMyParent(dropedNode.parent)) {
              // inner to inner(same container)
              // 2-1 操作model
              const fromIndex = dropedNode.parent.children.findIndex(i => i.$el === state.data.$el)
              const toIndex = dropedNode.index
              arrayMoveMutable(dropedNode.parent.children, fromIndex, toIndex)
            } else {
              // inner to inner(other container)
              // 2-2 操作model
              state.data.remove()
              dropedNode[this.insertType](state.data)
            }
            // 3. 更新selection
            this.selection && this.selection.update()
          }
        } else {
          if (isPendType(this.insertType)) {
            // if append or prepend
            if (dropedNode && componentMeta.accept.includes(state.data.name)) {
              this[this.insertType]({ ...state.data, slotName }, e.target, dropedNode)
            }
          } else {
            // if after or before
            if (dropedNode) {
              // 找到其父级node
              const [parentComponentMeta] = getComponentMetaData($nodeboxEl.parentNode)
              if (parentComponentMeta) {
                if (parentComponentMeta.accept.includes(state.data.name)) {
                  this[this.insertType](
                    { ...state.data },
                    lookupByClassName(e.target, NODE_BOX_CLS),
                    dropedNode
                  )
                }
              } else {
                // 如果没有父级nodebox，则父级为canvas-root
                if (state.data.componentType !== LAYOUT) {
                  this.wrapBlockThenInsert({
                    insertType: this.insertType,
                    state,
                    siblingOrParentDom: lookupByClassName(e.target, NODE_BOX_CLS),
                    parentNode: dropedNode
                  })
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
        }

        this.resetInsertInfo()
        this.__designer__.emit(EVENT_TYPES.COMPONENTS_DROPED)
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

        const [componentMeta] = getComponentMetaData(e.target)
        const state = getData()
        const canInsert = (componentMeta.accept || []).includes(state.data.name)
        const style = {
          width: state.data.isBlock ? e.target.offsetWidth - NODE_BOX_PADDING * 2 + 'px' : '100px'
        }
        !canInsert && (style.background = 'red')

        // 5px是精度，可以调整
        let realTarget
        if (y - rectPos.y <= 5) {
          this.insertType = InsertTypes.BEFORE
          realTarget = lookupByClassName(target, NODE_BOX_CLS)
        } else if (rectPos.y + rectPos.height - y <= 5) {
          this.insertType = InsertTypes.AFTER
          realTarget = lookupByClassName(target, NODE_BOX_CLS)
        } else {
          this.insertType = InsertTypes.APPEND
          realTarget = target
        }
        this.showMarker(style, realTarget, this.insertType)
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

  wrapBlockThenInsert({ insertType, state, siblingOrParentDom, parentNode }) {
    const blockCom = this.__components__.findComByName('VBlock')
    const wrapNode = this[insertType](blockCom, siblingOrParentDom, parentNode)
    const slotName = lookdownForAttr(wrapNode.$el, SLOT_NAME_KEY)
    this[InsertTypes.APPEND]({ ...state.data, slotName }, wrapNode.$el.children[0], wrapNode)
  }

  /**
   * 发送全局事件-添加节点
   */
  _dispathInsert(type, node) {
    const { APPEND, PREPEND, AFTER, BEFORE } = InsertTypes
    const map = {
      [APPEND]: C_A_A,
      [PREPEND]: CANVAS_ACTIONS_PREPEND,
      [AFTER]: CANVAS_ACTIONS_AFTER,
      [BEFORE]: CANVAS_ACTIONS_BEFORE
    }
    this.__designer__.emit(map[type], {
      type: map[type],
      data: node,
      viewModel: this.model
    })
  }

  /**
   * 发送全局事件-删除节点
   */
  _dispathDelete(movedNode) {
    this.__designer__.emit(C_A_D, {
      type: C_A_D,
      data: movedNode,
      viewModel: this.model
    })
  }
}
