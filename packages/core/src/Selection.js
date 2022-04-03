import { ResizeObserver } from '@juggle/resize-observer'
import { ComponentTypes } from './Components'
import { DROP_EL_PADDING } from './Canvas'
import { EVENT_TYPES } from './Event'
import { $ } from './lib/dom'

const {
  COMPONENTS_DRAG_START: C_D_S,
  COMPONENTS_DROPED: C_D,
  DRAG_END: D_E,
  SELECTION_UPDATED,
  SELECTION_DEL_CLICK,
  SELECTION_COPY_CLICK,
  SELECTION_MOVE_START,
  SELECTION_ACTIVED,
  SELECTION_DEACTIVED
} = EVENT_TYPES

const BTNS_WIDTH = 100
const SELECTION_BORDER_STYLE = '1px solid rgb(70, 128, 255)'

const BTN_TYPES = {
  DEL: 'delete',
  COPY: 'copy',
  MOVE: 'move',
  TITLE: 'title'
}

// TODO 支持自定义，提供几个核心方法：del, copy, move，有其他需求的操作可以自定义
// 图片从外部传入
export class Selection {
  constructor(config, desginer) {
    this.__designer__ = desginer
    this.config = config || {}
    this.DISTANCE_TO_TOP = this.__canvas__.y + DROP_EL_PADDING + 25 // 距离顶部距离,25为按钮的高度
    this.DISTANCE_TO_LEFT = this.__canvas__.x + DROP_EL_PADDING // 距离左边距离
    this.node = null

    this.$recEl = null
    this.$btnWrap = null
    this.$recTitle = null
    this.$recDelBtn = null
    this.$recCopyBtn = null
    this.$recMoveBtn = null
    this.$coverEl = null

    this.btnPos = { v: 'top', h: 'right' } // 'bottom' | 'left'

    this.initListener()

    // 还有一种hack方法 使用iframe的resize https://www.npmjs.com/package/simple-element-resize-detector
    this.observer = new ResizeObserver((entries, observer) => {
      if (this.initedOb) {
        this.update()
      } else {
        this.initedOb = true
      }
    })
  }

  get __canvas__() {
    return this.__designer__.__canvas__
  }

  get __dragon__() {
    return this.__designer__.__dragon__
  }

  get isLayout() {
    return this.node.componentType === ComponentTypes.LAYOUT
  }

  get offset() {
    const { $el } = this.node
    const domRect = $el.getBoundingClientRect()
    return {
      width: domRect.width,
      height: domRect.height,
      top: domRect.top,
      left: domRect.left
    }
  }

  get delBtnHPosVal() {
    return this._getBtnHPosVal(BTN_TYPES.DEL)
  }

  get copyBtnHPosVal() {
    return this._getBtnHPosVal(BTN_TYPES.COPY)
  }

  get moveBtnHPosVal() {
    return this._getBtnHPosVal(BTN_TYPES.MOVE)
  }

  get titleBtnHPosVal() {
    return this._getBtnHPosVal(BTN_TYPES.TITLE)
  }

  initListener() {
    this._cb = () => {
      if (this.$recEl && this.node) this.update()
    }
    window.addEventListener('resize', this._cb)

    this.__designer__.on(C_D_S, () => {
      this.$recEl.style.zIndex = -1
    })
    this.__designer__.on([C_D, D_E], () => {
      this.$recEl.style.zIndex = 2
    })
  }

  observe() {
    const { $el } = this.node
    this.observer.observe($el.children[0])
  }
  disconnect() {
    this.observer.disconnect()
  }

  _getBtnPos(top, right) {
    this.btnPos.v = top < this.DISTANCE_TO_TOP ? 'bottom' : 'top'
    this.btnPos.h = right < this.DISTANCE_TO_LEFT + BTNS_WIDTH ? 'left' : 'right'
  }

  create(node) {
    this.node = node
    const offset = this.offset
    this._getBtnPos(offset.top, offset.width + offset.left)
    this._createSelection()
    if (!node.isRoot) {
      this._createBtnWrap()
      this._createTitle()
      this._createBtn('delete')
      this._createBtn('move')
      this._createBtn('copy')
    }
    this.observe()
    this.__designer__.emit(SELECTION_ACTIVED, node)
  }

  update(node) {
    // 如果有node说明点击了不同的元素 需要重新监听
    if (node) {
      this.node = node
      this.disconnect()
      this.observe()
    }

    const offset = this.offset
    this._getBtnPos(offset.top, offset.width + offset.left)
    this._updateSelection()

    if (this.$btnWrap) {
      this._updateBtnWrap()
      this._updateTitle()
      this._updateBtn('delete', offset)
      this._updateBtn('move', offset)
      this._updateBtn('copy', offset)
    } else {
      this._createBtnWrap()
      this._createTitle()
      this._createBtn('delete')
      this._createBtn('move')
      this._createBtn('copy')
    }

    this.__designer__.emit(SELECTION_UPDATED, node)
  }

  remove() {
    this.$recEl.remove()
    window.removeEventListener('resize', this._cb)
    this.__designer__.emit(SELECTION_DEACTIVED)
  }

  _createSelection() {
    const { width, height } = this.offset
    // const renderUI = this.config.renderSelection
    // this.$recEl = document.createElement('div')
    // this.node.$el.appendChild(this.$recEl)
    // this.uiInstance = renderUI({
    //   el: this.$recEl,
    //   props: {
    //     node: this.node,
    //     btnPos: this.btnPos,
    //     isLayout: this.isLayout,
    //     offset: this.offset,
    //     delBtnHPosVal: this.delBtnHPosVal,
    //     copyBtnHPosVal: this.copyBtnHPosVal,
    //     moveBtnHPosVal: this.moveBtnHPosVal,
    //     titleBtnHPosVal: this.titleBtnHPosVal
    //   }
    // })
    // this.uiInstance.__designer__ = this.__designer__
    // return this.$recEl

    const div = (this.$recEl = $('<div>')
      .style({
        width: width + 'px',
        height: height + 'px',
        top: 0,
        left: 0,
        position: 'absolute',
        border: SELECTION_BORDER_STYLE,
        zIndex: 2,
        boxSizing: 'border-box',
        pointerEvents: 'none'
      })
      .addClass('selection').el)
    this.node.$el.appendChild(div)
    return div
  }

  _updateSelection() {
    const { width, height } = this.offset
    this.node.$el.appendChild(this.$recEl)
    $(this.$recEl).style({
      width: width + 'px',
      height: height + 'px',
      top: 0,
      left: 0
    })
  }

  _createCover() {
    const { width, height, left, top } = this.offset
    $(this.$recEl).style({ border: 'none' })
    const el = (this.$coverEl = $('<div>').style({
      position: 'absolute',
      width: width + 'px',
      height: height + 'px',
      top: top + 'px',
      left: left + 'px',
      background: 'rgba(23,142,230,0.2)',
      zIndex: 3
    }).el)
    document.body.appendChild(el)
  }

  _removeCover() {
    this.$coverEl && this.$coverEl.remove()
    this.$coverEl = null
    $(this.$recEl).style({ border: SELECTION_BORDER_STYLE })
  }

  _createBtnWrap() {
    const div = (this.$btnWrap = $('<div>').style({
      position: 'absolute',
      ...(this.btnPos.h === 'left' ? { left: 0, right: null } : { left: null, right: 0 }),
      top: this.btnPos.v === 'top' ? '-22px' : `${this.offset.height}px`,
      height: '20px',
      width: BTNS_WIDTH + 'px',
      lineHeight: '21px',
      pointerEvents: 'all'
    }).el)
    // remove hover!
    $(div).hover(() => this.__canvas__.handleNodeboxHoverRemove())
    this.$recEl.appendChild(div)
    return div
  }

  _updateBtnWrap() {
    const { height } = this.offset
    $(this.$btnWrap).style({
      ...(this.btnPos.h === 'left' ? { left: 0, right: null } : { left: null, right: 0 }),
      top: this.btnPos.v === 'top' ? '-22px' : `${height}px`
    })
  }

  _createTitle() {
    const div = (this.$recTitle = $('<div>')
      .style({
        position: 'absolute',
        ...this._getBtnHPosVal('title'),
        top: 0,
        cursor: 'pointer',
        background: '#1989fa',
        color: 'white',
        height: '18px',
        textAlign: 'center',
        padding: '0 3px',
        lineHeight: '19px',
        fontSize: '12px',
        whiteSpace: 'nowrap',
        fontWeight: 500
      })
      .text(this.node.title).el)
    this.$btnWrap.appendChild(div)
    return div
  }

  _updateTitle() {
    $(this.$recTitle)
      .text(this.node.title)
      .style({ ...this._getBtnHPosVal('title') })
  }

  _createBtn(type) {
    const div = $('<div>').style({
      position: 'absolute',
      ...this._getBtnHPosVal(type),
      top: 0,
      cursor: type === 'move' ? 'move' : 'pointer'
    }).el
    const img = $('<img>')
      .attr({
        src: `/${type}.png`,
        draggable: false
      })
      .style({
        width: '14px',
        background: '#1989fa',
        padding: '2px'
      }).el
    div.appendChild(img)
    this.$btnWrap.appendChild(div)
    $(div)
      .hover(
        () => $(div).style({ transform: 'scale(1.1)' }),
        () => $(div).removeStyle('transform')
      )
      .attr('draggable', true)
    const obj = {
      copy: '$recCopyBtn',
      delete: '$recDelBtn',
      move: '$recMoveBtn'
    }
    this[obj[type]] = div
    if (type === 'delete' || type === 'copy') {
      div.addEventListener('click', (e) => {
        e.stopPropagation()
        const eType = type === 'delete' ? SELECTION_DEL_CLICK : SELECTION_COPY_CLICK
        this.__designer__.emit(eType, {
          type: eType,
          data: this.node
        })
      })
    } else if (type === 'move') {
      this.__designer__.emit(SELECTION_MOVE_START, {
        type: SELECTION_MOVE_START,
        data: this.node
      })
      this.__dragon__.onDragStart(div, ({ renderDragImg, setData }) => {
        renderDragImg(this.node.title)
        setData('data', this.node)
        setData('isMove', true)
        this._createCover()
      })
      this.__dragon__.onDragEnd(div, () => {
        this._removeCover()
      })
    }

    return div
  }

  _updateBtn(type) {
    const map = {
      delete: this.$recDelBtn,
      copy: this.$recCopyBtn,
      move: this.$recMoveBtn
    }
    $(map[type]).style({ ...this._getBtnHPosVal(type) })
  }

  _hideBtn(type) {
    if (type === 'delete') {
      this.$recDelBtn.style.display = 'none'
    } else {
      this.$recCopyBtn && (this.$recCopyBtn.style.display = 'none')
    }
  }

  _showBtn(type) {
    if (type === 'delete') {
      this.$recDelBtn.style.display = 'block'
    } else {
      this.$recCopyBtn && (this.$recCopyBtn.style.display = 'block')
    }
  }

  _getBtnHPosVal(type) {
    if (this.btnPos.h === 'right') {
      const map = {
        delete: 0,
        copy: 21 + 'px',
        move: 21 * 2 + 'px',
        title: 21 * 3 + 'px'
      }
      return { left: null, right: map[type] }
    }
    const map = {
      delete: 21 * 2 + 33 + 'px',
      copy: 21 + 33 + 'px',
      move: 33 + 'px',
      title: 0
    }
    return { left: map[type], right: null }
  }
}
