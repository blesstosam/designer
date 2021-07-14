import { ResizeObserver } from '@juggle/resize-observer'
import { componentTypes } from './Components'
import { EVENT_TYPES } from './Event'
import { $ } from './lib/dom'

export class Selection {
  constructor(desginer) {
    this.__designer__ = desginer
    this.node = null
    this.$recEl = null
    this.$recDelBtn = null
    this.$recCopyBtn = null
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

  get isLayout() {
    return this.node.componentType === componentTypes.LAYOUT
  }

  initListener() {
    this._cb = () => {
      if (this.$recEl && this.node) this.update()
    }
    window.addEventListener('resize', this._cb)

    this.__designer__.on(EVENT_TYPES.COMPONENTS_DRAG, () => {
      this.$recEl.style.zIndex = -1
    })
    this.__designer__.on(EVENT_TYPES.COMPONENTS_DROPED, () => {
      this.$recEl.style.zIndex = 100
    })
  }

  observe() {
    const { $el } = this.node
    this.observer.observe($el.children[0])
  }
  disconnect() {
    this.observer.disconnect()
  }

  create(node) {
    this.node = node
    const offset = this._getOffset()
    this.createSelection(offset)
    this.createBtn(offset, 'delete')
    this.isLayout && this.createBtn(offset, 'copy')
    this.observe()
    this.__designer__.emit(EVENT_TYPES.SELECTION_ACTIVED)
  }

  update(node) {
    // 如果有node说明点击了不同的元素 需要重新监听
    if (node) {
      this.node = node
      this.disconnect()
      this.observe()
    }

    const offset = this._getOffset()
    this.updateSelection(offset)
    this.updateBtn(offset, 'delete')
    if (this.isLayout) {
      if (this.$recCopyBtn) {
        this.updateBtn(offset, 'copy')
        this.showBtn(offset, 'copy')
      } else {
        this.createBtn(offset, 'copy')
      }
    } else {
      this.hideBtn('copy')
    }
    this.__designer__.emit(EVENT_TYPES.SELECTION_UPDATED)
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

  createSelection(offset) {
    const { width, height } = offset
    const div = (this.$recEl = $('<div>')
      .style({
        width: width + 'px',
        height: height + 'px',
        top: 0,
        left: 0,
        position: 'absolute',
        border: '1px solid rgb(70, 128, 255)',
        zIndex: 100,
        boxSizing: 'border-box'
        // pointerEvents: 'none'
      })
      .addClass('selection').el)
    this.node.$el.appendChild(div)
    return div
  }

  updateSelection(offset) {
    const { width, height } = offset
    this.node.$el.appendChild(this.$recEl)
    $(this.$recEl).style({
      width: width + 'px',
      height: height + 'px',
      top: 0,
      left: 0
    })
  }

  createBtn(offset, type) {
    const div = $('<div>').style({
      position: 'absolute',
      left: this._getBtnLeftVal(offset, type),
      top: '-27px',
      cursor: 'pointer'
    }).el
    const img = $('<img>')
      .attr('src', `/${type}.png`)
      .style({
        width: '18px',
        background: '#1989fa',
        padding: '4px'
      }).el
    div.appendChild(img)
    this.$recEl.appendChild(div)
    if (type === 'delete') {
      this.$recDelBtn = div
    } else {
      this.$recCopyBtn = div
    }
    div.addEventListener('click', e => {
      e.stopPropagation()
      const eType =
        type === 'delete' ? EVENT_TYPES.SELECTION_DEL_CLICK : EVENT_TYPES.SELECTION_COPY_CLICK
      this.__designer__.emit(eType, {
        type: eType,
        data: this.node
      })
    })
    return div
  }

  updateBtn(offset, type) {
    if (type === 'delete') {
      this.$recDelBtn.style.left = this._getBtnLeftVal(offset, type)
    } else {
      this.$recCopyBtn.style.left = this._getBtnLeftVal(offset, type)
    }
  }

  hideBtn(type) {
    if (type === 'delete') {
      this.$recDelBtn.style.display = 'none'
    } else {
      this.$recCopyBtn && (this.$recCopyBtn.style.display = 'none')
    }
  }

  showBtn(type) {
    if (type === 'delete') {
      this.$recDelBtn.style.display = 'block'
    } else {
      this.$recCopyBtn && (this.$recCopyBtn.style.display = 'block')
    }
  }

  _getBtnLeftVal(offset, type) {
    return type === 'delete' ? offset.width - 26 + 'px' : offset.width - 58 + 'px'
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
