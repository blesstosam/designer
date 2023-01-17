import { $ } from './lib/dom'
import { isPendType, InsertTypes } from './Util'
import { getSlotContainer, ROOT_DROP_EL_PADDING } from './Canvas'
import { CONTAINER_PLACOHOLDER_CLS } from './Placeholder'

export class Marker {
  constructor(designer) {
    window._marker = this
    this.__designer__ = designer

    this.slotContainer = null
  }

  get offset() {
    const { slotContainer } = this
    const domRect = slotContainer.getBoundingClientRect()
    return {
      width: domRect.width,
      height: domRect.height,
      top: domRect.top,
      left: domRect.left
    }
  }

  show(target, type) {
    const style = {
      width: target.classList.contains('canvas-root')
        ? target.offsetWidth - ROOT_DROP_EL_PADDING * 2 + 'px'
        : target.offsetWidth + 'px'
    }
    if (!isPendType(type)) {
      if (this.markerEl) {
        this.markerEl.remove()
        this.markerEl = null
      }
      const borderDirection = type === InsertTypes.BEFORE ? 'border-top' : 'border-bottom'
      if (this.previous) {
        $(this.previous).style(this.previousBorder)
      }
      this.previous = target
      this.previousBorder = { [borderDirection]: $(target).getStyle('border-bottom') }
      $(target).style({ [borderDirection]: '3px solid green' })
    } else {
      if (this.previous) {
        $(this.previous).style(this.previousBorder)
        this.previous = null
        this.previousBorder = null
      }

      const slotContainer = getSlotContainer(target)
      if (
        slotContainer.children[0] &&
        slotContainer.children[0].classList.contains(CONTAINER_PLACOHOLDER_CLS)
      ) {
        if (this.recEl) {
          this.update(slotContainer)
        } else {
          this.create(slotContainer)
        }
      } else {
        if (!this.markerEl) {
          this.markerEl = $('<div>').style({
            display: 'flex',
            background: '#1989fa',
            height: '3px',
            pointerEvents: 'auto', // 当进入被拖入元素的子元素时，也会触发dragleave事件 所以给marker元素加上 `pointerEvents:none`
            ...style
          }).el
        } else {
          $(this.markerEl).style(style)
        }
        $(target)[type](this.markerEl)
      }
    }
  }

  create(slotContainer) {
    this.slotContainer = slotContainer
    this._createCover()
  }

  update(slotContainer) {
    if (slotContainer) {
      this.slotContainer = slotContainer
      this._updateCover()
    }
  }

  remove() {
    if (this.recEl) {
      this.recEl.remove()
      this.recEl = null
    }
    if (this.markerEl) {
      this.markerEl.remove()
      this.markerEl = null
    }
    if (this.previous) {
      $(this.previous).style(this.previousBorder)
      this.previous = null
      this.previousBorder = null
    }
  }

  _createCover() {
    const { width, height, left } = this.offset
    const div = (this.recEl = $('<div>')
      .style({
        width: width + 'px',
        height: height + 'px',
        top: 0,
        left: left,
        position: 'absolute',
        backgroundColor: 'lightsteelblue',
        zIndex: 2,
        boxSizing: 'border-box',
        pointerEvents: 'none'
      })
      .addClass('marker-cover').el)
    this.slotContainer.appendChild(div)
    return div
  }

  _updateCover() {
    const { width, height, left } = this.offset
    this.slotContainer.appendChild(this.recEl)
    $(this.recEl).style({
      width: width + 'px',
      height: height + 'px',
      top: 0,
      left: left
    })
  }
}
