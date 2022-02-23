import { ResizeObserver } from '@juggle/resize-observer'
import { componentTypes } from './Components'
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

const getBtnsWidth = (isLayout) => (isLayout ? 100 : 75)

const SELECTION_BORDER_STYLE = '1px solid rgb(70, 128, 255)'

export class Selection {
  constructor(desginer) {
    // ----- for debug -----
    window.selection = this
    this.__designer__ = desginer
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

    this.btnVPos = 'top'
    this.btnHPos = 'right'

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
    return this.node.componentType === componentTypes.LAYOUT
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

  // btnVPos = bottom | top
  // btnHPos = left | right
  decideBtnPos(top, right) {
    this.btnVPos = top < this.DISTANCE_TO_TOP ? 'bottom' : 'top'
    this.btnHPos = right < this.DISTANCE_TO_LEFT + getBtnsWidth(this.isLayout) ? 'left' : 'right'
  }

  create(node) {
    this.node = node
    const offset = this.offset
    this.decideBtnPos(offset.top, offset.width + offset.left)
    this._createSelection()
    if (!node.isRoot) {
      this._createBtnWrap()
      this._createTitle()
      this._createBtn('delete')
      this._createBtn('move')
      this.isLayout && this._createBtn('copy')
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
    this.decideBtnPos(offset.top, offset.width + offset.left)
    this._updateSelection(offset)

    if (this.$btnWrap) {
      this._updateBtnWrap(offset)
      this._updateTitle(offset)
      this._updateBtn('delete', offset)
      this._updateBtn('move', offset)
      if (this.isLayout) {
        if (this.$recCopyBtn) {
          this._updateBtn('copy', offset)
          this._showBtn('copy')
        } else {
          this._createBtn('copy', offset)
        }
      } else {
        this._hideBtn('copy')
      }
    } else {
      this._createBtnWrap()
      this._createTitle()
      this._createBtn('delete')
      this._createBtn('move')
      this.isLayout && this._createBtn('copy')
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

  _updateSelection(offset) {
    const { width, height } = offset
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
      ...(this.btnHPos === 'left' ? { left: 0, right: null } : { left: null, right: 0 }),
      top: this.btnVPos === 'top' ? '-22px' : `${this.offset.height}px`,
      height: '20px',
      width: this.isLayout ? '99px' : '76px',
      lineHeight: '21px',
      pointerEvents: 'all'
    }).el)
    // remove hover!
    $(div).hover(() => this.__canvas__.handleNodeboxHoverRemove())
    this.$recEl.appendChild(div)
    return div
  }

  _updateBtnWrap(offset) {
    $(this.$btnWrap).style({
      ...(this.btnHPos === 'left' ? { left: 0, right: null } : { left: null, right: 0 }),
      top: this.btnVPos === 'top' ? '-22px' : `${offset.height}px`,
      width: this.isLayout ? '99px' : '76px'
    })
  }

  _createTitle() {
    const div = (this.$recTitle = $('<div>')
      .style({
        position: 'absolute',
        ...this._getBtnHPos('title'),
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
      .style({ ...this._getBtnHPos('title') })
  }

  _createBtn(type) {
    const div = $('<div>').style({
      position: 'absolute',
      ...this._getBtnHPos(type),
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
        padding: '2px',
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
    $(map[type]).style({ ...this._getBtnHPos(type) })
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

  _getBtnHPos(type) {
    if (this.btnHPos === 'right') {
      const map = {
        delete: 0,
        copy: '21px',
        move: this.isLayout ? 21 * 2 + 'px' : 21 * 1 + 'px',
        title: this.isLayout ? 21 * 3 + 'px' : 21 * 2 +'px'
      }
      return { left: null, right: map[type] }
    }
    const map = {
      delete: this.isLayout ? '77px' : '53px',
      copy: '53px',
      move: '33px',
      title: 0
    }
    return { left: map[type], right: null }
  }
}
