import {
  lookupByClassName,
  lookdownByAttr,
  lookupByAttr,
  lookdownForAttr,
  getStyle,
  $
} from './lib/dom'
import { Selection } from './Selection'
import { Marker } from './Marker'
import { ComponentTypes } from './Components'
import { Node } from './Node'
import { EVENT_TYPES } from './Event'
import { Hover } from './Hover'
import { InsertTypes, isPendType, setCurrentViewNodeModel } from './Util'
import { arrayMoveMutable, throttle } from './lib/util'
import { changeProps, renderVueComponent } from './lib/render-util' // TODO how to drop changeProps
import cloneDeep from 'lodash.clonedeep'
import { Placeholder, CONTAINER_PLACOHOLDER_CLS } from './Placeholder'

const {
  SELECTION_DEL_CLICK,
  SELECTION_COPY_CLICK,
  CANVAS_INITED,
  CANVAS_LAYOUTED,
  CANVAS_ACTIONS_APPEND,
  CANVAS_ACTIONS_PREPEND,
  CANVAS_ACTIONS_AFTER,
  CANVAS_ACTIONS_BEFORE,
  CANVAS_ACTIONS_DELETE,
  CANVAS_ACTIONS_CLEAR,
  COMPONENTS_REGISTER_END
} = EVENT_TYPES

const { LAYOUT } = ComponentTypes
export const NODE_BOX_SPACING = 12
export const SLOT_NAME_KEY = 'c-slot-name'
const NODE_BOX_CLS = 'node-box'
export const CANVAS_ROOT_CLS = 'canvas-root'

const getSlotName = (el) => el.getAttribute(SLOT_NAME_KEY)
const getFirstSlotElOfNode = (node) => lookdownByAttr(node.$el.children[0], SLOT_NAME_KEY)
const getSlotElOfNode = (node, slotName) =>
  lookdownByAttr(node.$el.children[0], SLOT_NAME_KEY, slotName)

export const isRootContainer = (el) => {
  return el.classList.contains(CANVAS_ROOT_CLS)
}

// 向下查找slot容器
export const getSlotContainer = (container) => {
  if (isRootContainer(container)) return container
  const c = lookdownByAttr(container, SLOT_NAME_KEY)
  if (c) return c
  return container
}

// 向上查找第一个slot容器
export const getSlotContainerUp = (container) => {
  if (isRootContainer(container)) return container
  const c = lookupByAttr(container, SLOT_NAME_KEY)
  if (c) return c
  return container
}

export class Canvas {
  constructor(config, designer) {
    window._canvas = this
    this.name = '__canvas__'
    this.config = config || {}
    if (!this.config.canvasWrap) {
      throw new Error('[designer] 请传入画布容器元素 canvasWrap')
    }
    this.__designer__ = designer
    this.canvasEl = null
    this.dropToInnerSlot = false // 是否被拖入 nodebox 的 slot 容器

    this.resetInsertInfo()

    this.model = null
    this.selection = null
    this.marker = null
    this.placeholder = null
    this.hover = null
  }

  get width() {
    return getStyle(this.canvasEl, 'width')
  }
  get height() {
    return getStyle(this.canvasEl, 'height')
  }
  get x() {
    return this.canvasEl.getBoundingClientRect().x
  }
  get y() {
    return this.canvasEl.getBoundingClientRect().y
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
  get __dragon__() {
    return this.__designer__.__dragon__
  }

  init(viewModel) {
    // canvas依赖components插件，防止多次触发使用once
    this.__designer__.once(COMPONENTS_REGISTER_END, () => {
      const canvasStyle = (viewModel && viewModel.props.style) || this._genDefaultCanvasStyle()
      const div = (this.canvasEl = $('<div>')
        .addClass('drop')
        .addClass(CANVAS_ROOT_CLS)
        .style(canvasStyle).el)
      document.querySelector(this.config.canvasWrap).appendChild(div)

      if (viewModel != null) {
        this.model = new Node({ ...viewModel, $el: div })
      } else {
        this.model = new Node({
          componentName: 'canvas',
          title: '页面',
          $el: div,
          children: [],
          isRoot: true,
          props: { style: canvasStyle, nodeboxSpacing: NODE_BOX_SPACING }
        })
        this.showPlaceholder(this.model)
      }
      this.bindCanvasEvents()
      this.layout(viewModel)
      this.initListener()
      this.handleNodeboxSelect(this.model)
      this.__designer__.emit(CANVAS_INITED)
    })
  }

  initListener() {
    this.__designer__.on([SELECTION_DEL_CLICK, SELECTION_COPY_CLICK], (payload) => {
      const { type, data } = payload
      if (type === SELECTION_DEL_CLICK) {
        this.remove(data)
      } else if (type === SELECTION_COPY_CLICK) {
        const mount = (nodeArr, parent) => {
          for (const node of nodeArr) {
            const com = this.__components__.findComByName(node.componentName)
            const targetEl =
              parent.$el === this.canvasEl ? this.canvasEl : getSlotElOfNode(parent, node.slotName)
            const newNode = this[InsertTypes.APPEND]({ ...com, slotName: node.slotName }, targetEl)
            if (node.children && node.children.length) {
              mount(node.children, newNode)
            }
          }
        }
        const com = this.__components__.findComByName(data.componentName)
        const newNode = this[InsertTypes.AFTER]({ ...com, slotName: data.slotName }, data.$el)
        mount(data.children, newNode)
      }
    })

    this.__designer__.on(
      [CANVAS_ACTIONS_APPEND, CANVAS_ACTIONS_AFTER],
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
    this.__dragon__.onDrop(this.canvasEl, ({ getData }) => {
      console.log('wrapper drop...')
      this.marker?.remove()

      // canvas容器只有两种情况 prepend&append
      const state = getData()
      if (state.isMove) {
        if (state.data.componentType !== LAYOUT) {
          // inner to wrap
          // 1. 包一层wrap
          const wrapNode = this[this.insertType](
            this.__components__.findComByName('VBlock'),
            this.canvasEl
          )
          // 2. 移动dom到新容器
          wrapNode.$el.children[0].appendChild(state.data.$el)
          // 3. 操作model
          state.data.remove()
          wrapNode[InsertTypes.APPEND](state.data)
        } else {
          // B. wrap to wrap
          // 1. 移动dom
          $(this.canvasEl)[this.insertType](state.data.$el)
          // 2. 操作model
          const fromIndex = this.model.children.findIndex((i) => i.$el === state.data.$el)
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
            siblingOrParentDom: this.canvasEl,
            parentNode: this.model
          })
        } else {
          this[this.insertType](state.data, this.canvasEl)
        }
      }

      this.resetInsertInfo()
      this.__designer__.emit(EVENT_TYPES.COMPONENTS_DROPED)
    })

    this.__dragon__.onDragOver(
      this.canvasEl,
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
        // https://github.com/Shopify/draggable/blob/6f5539b1f396a34b08fcbf0b52651ca1ee669665/examples/src/content/Draggable/DragEvents/index.js#L67
        // 上面说在拖动过程中使用getBoundingClientRect性能损耗大，后面验证一下
        const rectPos = this.canvasEl.getBoundingClientRect()
        if (y <= rectPos.y) {
          this.insertType = InsertTypes.PREPEND
          this.showMarker(target, InsertTypes.PREPEND)
        } else {
          const children = this.model.children
          if (children.length) {
            const lastChild = children[children.length - 1].$el
            const rectPos = lastChild.getBoundingClientRect()
            if (rectPos.height + rectPos.y < y) {
              // 有子元素但是在后面
              this.insertType = InsertTypes.APPEND
              this.showMarker(target, InsertTypes.APPEND)
            }
          } else {
            // 没有子元素
            this.insertType = InsertTypes.APPEND
            this.showMarker(target, InsertTypes.APPEND)
          }
        }
      }, 200)
    )

    // enter 比 over 先触发
    this.__dragon__.onDragEnter(this.canvasEl, ({ $event: e, addDragEnterCls }) => {
      addDragEnterCls(e)
      this.placeholder && this.placeholder.remove(this.model)
      console.log('wrapper enter...')
    })

    this.__dragon__.onDragLeave(this.canvasEl, ({ removeDragEnterCls }) => {
      console.log('wrapper leave...')
      if (!this.dropToInnerSlot) {
        removeDragEnterCls()
        this.marker?.remove()
        !this.model.children.length && this.showPlaceholder(this.model)
        this.resetInsertInfo()
      }
    })

    this.canvasEl.addEventListener(
      'click',
      (e) => {
        this.handleNodeboxSelect(this.model)
      }
      // true
    )
    this.canvasEl.addEventListener('mouseover', (e) => {
      this.handleNodeboxHover(this.model)
    })
    this.canvasEl.addEventListener('mouseleave', (e) => {
      this.hover?.remove()
    })
  }

  resetInsertInfo() {
    this.insertType = ''
  }

  _genDefaultCanvasStyle() {
    const { config } = this
    return {
      position: 'relative',
      width: config.width || '100%', // 550为左右的宽度加边距
      height: config.height || '100%',
      minWidth: '100%',
      boxShadow: '0px 0px 4px 1px rgb(0 0 0 / 12%)',
      boxSizing: 'border-box',
      backgroundColor: '#efefef',
      overflowY: 'auto'
    }
  }

  scrollToBottom() {
    this.canvasEl.scrollTop = this.canvasEl.scrollHeight
  }

  showPlaceholder(node) {
    if (!this.placeholder) {
      this.placeholder = new Placeholder(this.__designer__)
    }
    this.placeholder.create(node)
  }

  showMarker(target, type) {
    if (!this.marker) {
      this.marker = new Marker(this.__designer__)
    }
    this.marker.show(target, type)
  }

  clear() {
    this.model.children = []
    this.canvasEl.innerHTML = ''
    this.clearSelection()
    this.showPlaceholder(this.model)
    localStorage.clear('viewModel')
    this.__designer__.emit(CANVAS_ACTIONS_CLEAR, { type: CANVAS_ACTIONS_CLEAR, viewModel: [] })
  }

  clearSelection() {
    if (this.selection) {
      this.selection.remove()
      this.selection = null
      this.__attr__.uiInstance.resetData()
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
        const com = this.__components__.findComByName(node.componentName)
        node.icon = com.icon
        node.component = com.component
        com.transformProps && (node.transformProps = com.transformProps)

        const targetEl = parent.$el === this.canvasEl ? this.canvasEl : parent.$el.children[0]
        nodeArr[i] = this[InsertTypes.APPEND](node, targetEl, true)
        if (node.children && node.children.length) {
          mount(node.children, nodeArr[i])
        }
      }
    }
    mount(viewModel.children, this.model)
    this.__designer__.emit(CANVAS_LAYOUTED)
  }

  [InsertTypes.APPEND](com, container, cancelDispatch = false) {
    // 通过container找到parent node
    const el = isRootContainer(container) ? container : lookupByClassName(container, NODE_BOX_CLS)
    const parentNode = this.model.findByEl(el)
    return this.insertNode(com, container, parentNode, InsertTypes.APPEND, cancelDispatch)
  }

  [InsertTypes.PREPEND](com, container, cancelDispatch = false) {
    const el = isRootContainer(container) ? container : lookupByClassName(container, NODE_BOX_CLS)
    const parentNode = this.model.findByEl(el)
    return this.insertNode(com, container, parentNode, InsertTypes.PREPEND, cancelDispatch)
  }

  [InsertTypes.AFTER](com, siblingContainer, cancelDispatch = false) {
    const el = isRootContainer(siblingContainer)
      ? siblingContainer
      : lookupByClassName(siblingContainer, NODE_BOX_CLS)
    const siblingNode = this.model.findByEl(el)
    return this.insertNode(com, siblingContainer, siblingNode, InsertTypes.AFTER, cancelDispatch)
  }

  [InsertTypes.BEFORE](com, siblingContainer, cancelDispatch = false) {
    const el = isRootContainer(siblingContainer)
      ? siblingContainer
      : lookupByClassName(siblingContainer, NODE_BOX_CLS)
    const siblingNode = this.model.findByEl(el)
    return this.insertNode(com, siblingContainer, siblingNode, InsertTypes.BEFORE, cancelDispatch)
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
    !cancelDispatch &&
      this._dispathInsert({
        insertType,
        node: newNode,
        component: com,
        container
      })
    this.showPlaceholder(newNode)
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
    let wrapper = d.$el
    if (!wrapper) {
      wrapper = this._createNodebox(isLayout)
      // Vue3渲染
      if (d.framework === 'Vue') {
        const { el, props } = renderVueComponent(d.component, d.attrs)
        d.props = props
        $(el).attr({ 'data-name': d.componentName })
        wrapper.appendChild(el)
      } else if (d.framework === 'Vue2') {
      } else if (d.framework === 'React') {
      }
    }

    if (type === InsertTypes.APPEND || type === InsertTypes.PREPEND) {
      // 当组件的slotname 为 default 时，直接插入到容器的末尾；不为 default 时，需要查找对应的容器
      const slotName = d.slotName || 'default'
      let realContainer = container
      if (slotName !== 'default') {
        realContainer = lookdownByAttr(container, SLOT_NAME_KEY, d.slotName)
      }
      if (realContainer) {
        if (
          realContainer.children[0] &&
          realContainer.children[0].classList.contains(CONTAINER_PLACOHOLDER_CLS)
        ) {
          this.placeholder.removeByEl(realContainer.children[0])
        }
        $(realContainer)[type](wrapper)
      }
    } else {
      $(container)[type](wrapper)
    }

    this.scrollToBottom()

    wrapper.addEventListener(
      'click',
      (e) => {
        e.stopPropagation()
        const nodeboxEl = lookupByClassName(e.target, NODE_BOX_CLS)
        const node = this.model.findByEl(nodeboxEl)
        node && this.handleNodeboxSelect(node)
      }
      // true
    )
    wrapper.addEventListener('mouseover', (e) => {
      e.stopPropagation()
      const nodeBoxEl = lookupByClassName(e.target, NODE_BOX_CLS)
      const node = this.model.findByEl(nodeBoxEl)
      this.handleNodeboxHover(node)
    })
    // wrapper.addEventListener('mouseleave', (e) => {
    //   this.hover?.remove()
    // })

    return wrapper
  }

  /**
   * 重新渲染某个组件
   * @param {*} node
   * @param {*} item 属性对象
   * @param {*} val 属性值
   */
  patch(node, item, val) {
    // console.log(el, item, val)
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
    setCurrentViewNodeModel(null) // TODO 选中前一个
    this._dispathRemove(movedNode)
  }

  toggleDisplay(node, isShow) {
    isShow ? $(node.$el).show() : $(node.$el).hide()
  }

  handleNodeboxSelect(node) {
    setCurrentViewNodeModel(node)
    this.__attr__.uiInstance.setData(node)
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

  getComponentMetaData(targetEl) {
    const nodeboxEl = lookupByClassName(targetEl, NODE_BOX_CLS)
    if (!nodeboxEl) return []
    const targetComName = $(nodeboxEl).firstElement.getAttribute('data-name')
    return [this.__components__.findComByName(targetComName), nodeboxEl]
  }

  /**
   * 在节点外包一个div，监听 drop 等事件
   */
  _createNodebox(isLayout) {
    const wrapper = $('<div>').addClass(NODE_BOX_CLS).style({
      position: 'relative',
      boxSizing: 'border-box'
    }).el
    if (isLayout) {
      $(wrapper).style({ marginBottom: NODE_BOX_SPACING + 'px' })
    }

    // 非布局组件直接返回
    if (!isLayout) {
      return wrapper
    }

    this.__dragon__.onDrop(
      wrapper,
      ({ $event: e, getData }) => {
        this.dropToInnerSlot = false
        this.marker?.remove()

        // nodebox有三种情况 append & before & after
        // 找到node-box节点的子节点
        const [componentMeta, nodeboxEl] = this.getComponentMetaData(e.target)
        const dropedNode = this.model.findByEl(nodeboxEl)
        const state = getData()
        if (state.isMove) {
          if (isPendType(this.insertType)) {
            // 只能是append
            // 1. 移动dom 找到dropedNode的slot TODO 如果有多个slot怎么办??
            const firstSlotEl = getFirstSlotElOfNode(dropedNode)
            $(firstSlotEl)[this.insertType](state.data.$el)
            if (state.data.getIsMyParent(dropedNode)) {
              // inner to inner(same container)
              // 2-1 操作model
              const fromIndex = dropedNode.children.findIndex((i) => i.$el === state.data.$el)
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
              const fromIndex = dropedNode.parent.children.findIndex(
                (i) => i.$el === state.data.$el
              )
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
            const slotContainer = getSlotContainer(e.target)
            const slotName = getSlotName(slotContainer) || 'default'
            if (dropedNode && componentMeta.componentType === ComponentTypes.LAYOUT) {
              this[this.insertType]({ ...state.data, slotName }, slotContainer)
            }
          } else {
            // if after or before
            if (dropedNode) {
              const slotName = getSlotName(nodeboxEl.parentNode) || 'default'
              const [parentComponentMeta] = this.getComponentMetaData(nodeboxEl.parentNode)
              if (parentComponentMeta) {
                if (parentComponentMeta.componentType === ComponentTypes.LAYOUT) {
                  this[this.insertType](
                    { ...state.data, slotName },
                    lookupByClassName(e.target, NODE_BOX_CLS)
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
                  this[this.insertType](
                    { ...state.data },
                    lookupByClassName(e.target, NODE_BOX_CLS)
                  )
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

    // dragover => 生成marker
    this.__dragon__.onDragOver(
      wrapper,
      throttle(({ $event: e, getData }) => {
        console.log('inner over...')
        const { y, target } = e
        const rectPos = target.getBoundingClientRect()

        // 5px是精度，可以调整
        let realTarget
        if (y - rectPos.y <= 5) {
          this.insertType = InsertTypes.BEFORE
          realTarget = lookupByClassName(target, NODE_BOX_CLS)
        } else if (rectPos.y + rectPos.height - y <= 5) {
          this.insertType = InsertTypes.AFTER
          realTarget = lookupByClassName(target, NODE_BOX_CLS)
        } else {
          const [componentMeta] = this.getComponentMetaData(e.target)
          const canInsert = componentMeta.componentType === ComponentTypes.LAYOUT
          // !canInsert && (style.background = 'red')
          if (!canInsert) return
          this.insertType = InsertTypes.APPEND
          realTarget = target
        }
        this.showMarker(realTarget, this.insertType)
      }, 200),
      { stop: true }
    )

    this.__dragon__.onDragEnter(
      wrapper,
      ({ $event: e, addDragEnterCls }) => {
        // 当被拖到 布局组件 slot 里才触发
        if (getSlotName(e.target) != null) {
          this.dropToInnerSlot = true
          addDragEnterCls(e)
        }
        console.log('inner enter...')
      },
      { stop: true }
    )

    // dragleave => 删除marker，如果容器元素为空，重新生成placeholder
    this.__dragon__.onDragLeave(wrapper, ({ $event: e, removeDragEnterCls }) => {
      console.log('inner leave...')
      if (getSlotName(e.target) != null) {
        this.dropToInnerSlot = false
        removeDragEnterCls()
        this.marker?.remove()
        const $nodeBoxEl = lookupByClassName(e.target, NODE_BOX_CLS)
        const targetNode = this.model.findByEl($nodeBoxEl)
        !e.target.children.length && this.showPlaceholder(targetNode)
        this.resetInsertInfo()
      }
    })

    return wrapper
  }

  wrapBlockThenInsert({ insertType, state, siblingOrParentDom, parentNode }) {
    const blockCom = this.__components__.findComByName('VBlock')
    const wrapNode = this[insertType](blockCom, siblingOrParentDom, parentNode)
    const slotName = lookdownForAttr(wrapNode.$el, SLOT_NAME_KEY)
    this[InsertTypes.APPEND]({ ...state.data, slotName }, wrapNode.$el.children[0])
  }

  /**
   * 发送全局事件-添加节点
   */
  _dispathInsert({ insertType, node, container, component }) {
    const { APPEND, PREPEND, AFTER, BEFORE } = InsertTypes
    const map = {
      [APPEND]: CANVAS_ACTIONS_APPEND,
      [PREPEND]: CANVAS_ACTIONS_PREPEND,
      [AFTER]: CANVAS_ACTIONS_AFTER,
      [BEFORE]: CANVAS_ACTIONS_BEFORE
    }
    this.__designer__.emit(map[insertType], {
      type: map[insertType],
      data: node,
      container,
      component,
      viewModel: this.model
    })
  }

  /**
   * 发送全局事件-删除节点
   */
  _dispathRemove(movedNode) {
    this.__designer__.emit(CANVAS_ACTIONS_DELETE, {
      type: CANVAS_ACTIONS_DELETE,
      data: movedNode,
      viewModel: this.model
    })
  }
}
