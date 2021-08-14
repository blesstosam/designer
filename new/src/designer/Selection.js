import { ResizeObserver } from '@juggle/resize-observer'
import { componentTypes } from './Components'
import { DROP_EL_PADDING } from './Canvas'
import { EVENT_TYPES } from './Event'
import { $ } from './lib/dom'

const getBtnsWidth = isLayout => (isLayout ? 100 : 75)

export class Selection {
  constructor(desginer) {
    // ----- for debug -----
    window.selection = this
    this.__designer__ = desginer
    this.DISTANCE_TO_TOP = this.__canvas__.y + DROP_EL_PADDING + 25 // 距离顶部距离,25为按钮的高度
    this.DISTANCE_TO_LEFT = this.__canvas__.x + DROP_EL_PADDING // 距离左边距离
    this.node = null

    this.$recEl = null
    this.$recDelBtn = null
    this.$recCopyBtn = null
    this.$recMoveBtn = null

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

  get isLayout() {
    return this.node.componentType === componentTypes.LAYOUT
  }

  initListener() {
    this._cb = () => {
      if (this.$recEl && this.node) this.update()
    }
    window.addEventListener('resize', this._cb)

    this.__designer__.on(EVENT_TYPES.COMPONENTS_DRAG_START, () => {
      this.$recEl.style.zIndex = -1
    })
    this.__designer__.on(EVENT_TYPES.COMPONENTS_DROPED, () => {
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
    const offset = this._getOffset()
    this.decideBtnPos(offset.top, offset.width + offset.left)
    this._createSelection(offset)
    this._createTitle(offset)
    this._createBtn('delete', offset)
    this._createBtn('move', offset)
    this.isLayout && this._createBtn('copy', offset)
    this.observe()
    this.__designer__.emit(EVENT_TYPES.SELECTION_ACTIVED, node)
  }

  update(node) {
    // 如果有node说明点击了不同的元素 需要重新监听
    if (node) {
      this.node = node
      this.disconnect()
      this.observe()
    }

    const offset = this._getOffset()
    this.decideBtnPos(offset.top, offset.width + offset.left)
    this._updateSelection(offset)
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
    this.__designer__.emit(EVENT_TYPES.SELECTION_UPDATED, node)
  }

  updateSize() {
    const { $el } = this.node
    this.$recEl.style.width = $el.offsetWidth
    this.$recEl.style.height = $el.offsetHeight
    this.__designer__.emit(EVENT_TYPES.SELECTION_RESIZE)
  }

  remove() {
    this.$recEl.remove()
    window.removeEventListener('resize', this._cb)
    this.__designer__.emit(EVENT_TYPES.SELECTION_DEACTIVED)
  }

  _createSelection(offset) {
    const { width, height } = offset
    const div = (this.$recEl = $('<div>')
      .style({
        width: width + 'px',
        height: height + 'px',
        top: 0,
        left: 0,
        position: 'absolute',
        border: '1px solid rgb(70, 128, 255)',
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

  _createTitle(offset) {
    const div = (this.$recTitleEl = $('<div>')
      .style({
        position: 'absolute',
        ...this._getBtnHPos('title'),
        top: this.btnVPos === 'top' ? '-21px' : `${offset.height}px`,
        cursor: 'pointer',
        background: '#1989fa',
        color: 'white',
        height: '20px',
        textAlign: 'center',
        padding: '0 3px',
        lineHeight: '21px',
        borderRadius: '2px',
        fontSize: '12px',
        whiteSpace: 'nowrap',
        fontWeight: 500,
        pointerEvents: 'all'
      })
      .text(this.node.title).el)
    this.$recEl.appendChild(div)
    return div
  }

  _updateTitle(offset) {
    $(this.$recTitleEl)
      .text(this.node.title)
      .style({
        ...this._getBtnHPos('title'),
        top: this.btnVPos === 'top' ? '-21px' : `${offset.height}px`
      })
  }

  _createBtn(type, offset) {
    const div = $('<div>').style({
      position: 'absolute',
      ...this._getBtnHPos(type),
      top: this.btnVPos === 'top' ? '-21px' : `${offset.height}px`,
      cursor: type === 'move' ? 'move' : 'pointer',
      pointerEvents: 'all'
    }).el
    const img = $('<img>')
      .attr('src', `/${type}.png`)
      .style({
        width: '16px',
        background: '#1989fa',
        padding: '2px',
        borderRadius: '2px'
      }).el
    div.appendChild(img)
    this.$recEl.appendChild(div)
    $(div).hover(
      () => {
        $(div).style({ transform: 'scale(1.1)' })
      },
      () => {
        $(div).removeStyle('transform')
      }
    )
    if (type === 'delete') {
      this.$recDelBtn = div
    } else if (type === 'copy') {
      this.$recCopyBtn = div
    } else if (type === 'move') {
      this.$recMoveBtn = div
    }
    if (type === 'delete' || type === 'copy') {
      div.addEventListener('click', e => {
        e.stopPropagation()
        const eType =
          type === 'delete' ? EVENT_TYPES.SELECTION_DEL_CLICK : EVENT_TYPES.SELECTION_COPY_CLICK
        this.__designer__.emit(eType, {
          type: eType,
          data: this.node
        })
      })
    } else {
      // todo 绑定拖动事件
    }

    return div
  }

  _updateBtn(type, offset) {
    const map = {
      delete: this.$recDelBtn,
      copy: this.$recCopyBtn,
      move: this.$recMoveBtn
    }
    $(map[type]).style({
      ...this._getBtnHPos(type),
      top: this.btnVPos === 'top' ? '-21px' : `${offset.height}px`
    })
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
        copy: '23px',
        move: this.isLayout ? '46px' : '23px',
        title: this.isLayout ? '69px' : '46px'
      }
      return { left: null, right: map[type] }
    }
    const map = {
      delete: this.isLayout ? '80px' : '56px',
      copy: '56px',
      move: '33px',
      title: 0
    }
    return { left: map[type], right: null }
  }

  _getOffset() {
    const { $el } = this.node
    const domRect = $el.getBoundingClientRect()
    return {
      width: domRect.width,
      height: domRect.height,
      top: domRect.top,
      left: domRect.left
    }
  }
}
