import { $ } from './lib/dom'
import { isPendType, InsertTypes } from './Util'
import { getSlotContainer, getSlotContainerUp, isRootContainer } from './Canvas'
import { CONTAINER_PLACOHOLDER_CLS } from './Placeholder'

export const MARKER_COLOR = '#1989fa'

export class Marker {
  constructor(designer) {
    window._marker = this
    this.__designer__ = designer

    this.slotContainer = null
  }

  get model() {
    return this.__designer__.__canvas__.model
  }

  // slot container offset
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
    if (!isPendType(type)) {
      if (this.markerEl) {
        this.markerEl.remove()
        this.markerEl = null
      }
      if (this.slotContainer) {
        $(this.slotContainer).style({ border: 0 })
      }

      const borderDirection = type === InsertTypes.BEFORE ? 'border-top' : 'border-bottom'
      if (this.previous) {
        $(this.previous).style(this.previousBorder)
      }
      this.previous = target
      this.previousBorder = { [borderDirection]: $(target).getStyle('border-bottom') }
      $(target).style({ [borderDirection]: `3px solid ${MARKER_COLOR}` })

      const slotContainer = getSlotContainerUp(target)
      this.slotContainer = slotContainer
      const node = this.model.findByEl(target)
      const insertPos =
        node.isFirstChild && type === InsertTypes.BEFORE
          ? 'first'
          : node.isLastChild && type === InsertTypes.AFTER
          ? 'last'
          : 'center'
      this.showFocus(slotContainer, insertPos)
    } else {
      if (this.previous) {
        $(this.previous).style(this.previousBorder)
        this.previous = null
        this.previousBorder = null
      }
      if (this.slotContainer) {
        $(this.slotContainer).style({ border: 0 })
      }

      const slotContainer = getSlotContainer(target)
      this.slotContainer = slotContainer

      const style = {
        width: slotContainer ? slotContainer.offsetWidth + 'px' : target.offsetWidth + 'px'
      }
      // 当容器为空显示cover
      if (
        slotContainer.children[0] &&
        slotContainer.children[0].classList.contains(CONTAINER_PLACOHOLDER_CLS)
      ) {
        if (this.coverEl) {
          this.updateCoverEl()
        } else {
          this.createCoverEl()
        }
      } else {
        this.showFocus(
          slotContainer,
          type === InsertTypes.PREPEND
            ? 'first'
            : // 当拖到canvas的时候且为append时，为全边框
            isRootContainer(slotContainer)
            ? 'center'
            : 'last'
        )
        if (!this.markerEl) {
          this.markerEl = $('<div>').style({
            display: 'flex',
            background: MARKER_COLOR,
            height: '3px',
            pointerEvents: 'auto', // 当进入被拖入元素的子元素时，也会触发dragleave事件 所以给marker元素加上 `pointerEvents:none`
            ...style
          }).el
        } else {
          $(this.markerEl).style(style)
        }
        $(slotContainer || target)[type](this.markerEl)
      }
    }
  }

  remove() {
    if (this.coverEl) {
      this.coverEl.remove()
      this.coverEl = null
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
    if (this.slotContainer) {
      $(this.slotContainer).style({ border: 0 })
      this.slotContainer = null
    }
  }

  // pos: first|center|last
  showFocus(slotContainer, pos) {
    if (slotContainer) {
      if (pos === 'center') {
        $(slotContainer).style({
          border: `1px dashed ${MARKER_COLOR}`
        })
      } else if (pos === 'first') {
        $(slotContainer).style({
          borderLeft: `1px dashed ${MARKER_COLOR}`,
          borderRight: `1px dashed ${MARKER_COLOR}`,
          borderBottom: `1px dashed ${MARKER_COLOR}`
        })
      } else if (pos === 'last') {
        $(slotContainer).style({
          borderLeft: `1px dashed ${MARKER_COLOR}`,
          borderRight: `1px dashed ${MARKER_COLOR}`,
          borderTop: `1px dashed ${MARKER_COLOR}`
        })
      }
    }
  }

  createCoverEl() {
    const { width, height, left, top } = this.offset
    const div = (this.coverEl = $('<div>')
      .style({
        width: width + 'px',
        height: height + 'px',
        top: 0,
        // left: left + 'px',
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

  updateCoverEl() {
    const { width, height, left } = this.offset
    this.slotContainer.appendChild(this.coverEl)
    $(this.coverEl).style({
      width: width + 'px',
      height: height + 'px',
      top: 0,
      left: left
    })
  }
}
