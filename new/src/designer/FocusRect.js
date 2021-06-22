import { componentTypes } from './Component'
import { ActionTypes } from './Toolbar'

export class FocusRect {
  constructor(desginer) {
    this.__designer__ = desginer
    this.node = null
    this.$recEle = null
    this.$recDelBtn = null
    this.$recCopyBtn = null
    // this.$recDotEleArr = []
    this.initListener()
  }

  get isLayout() {
    return this.node.componentType === componentTypes.LAYOUT
  }

  initListener() {
    this._cb = () => {
      if (this.$recEle && this.node) this.update()
    }
    window.addEventListener('resize', this._cb)

    this.__designer__.on('dragstart', () => {
      this.$recEle.style.zIndex = -1
    })
    this.__designer__.on('dragend', () => {
      this.$recEle.style.zIndex = 100
    })
  }

  create(node) {
    this.node = node
    const offset = this._getOffset()
    this.createFocusRect(offset)
    // this.appendDot(offset);
    this.createBtn(offset, 'delete')
    this.isLayout && this.createBtn(offset, 'copy')
  }

  update(node) {
    node && (this.node = node)
    const offset = this._getOffset()
    this.updateFocusRect(offset)
    // this.updateFocusRectDot(offset);
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
  }

  remove() {
    this.$recEle.remove()
    window.removeEventListener('resize', this._cb)
  }

  createFocusRect(offset) {
    const { width, height, top, left } = offset
    const div = document.createElement('div')
    div.style.width = width + 'px'
    div.style.height = height + 'px'
    div.style.top = top + 'px'
    div.style.left = left + 'px'
    div.style.position = 'absolute'
    div.style.border = '1px solid rgb(70, 128, 255)'
    div.style.zIndex = 100
    div.classList.add('focus-rect')
    document.body.appendChild(div)
    this.$recEle = div
    return div
  }

  updateFocusRect(offset) {
    const { width, height, top, left } = offset
    this.$recEle.style.width = width + 'px'
    this.$recEle.style.height = height + 'px'
    this.$recEle.style.top = top + 'px'
    this.$recEle.style.left = left + 'px'
  }

  // createDot(offset, index) {
  //   const { width, height } = offset;
  //   const { left, top } = this._getTopLeftPos(index, width, height);
  //   const div = document.createElement('div');
  //   div.style.width = '6px';
  //   div.style.height = '6px';
  //   div.style.background = 'rgb(70, 128, 255)';
  //   div.style.position = 'absolute';
  //   div.style.left = left;
  //   div.style.top = top;
  //   div.style.zIndex = 100;
  //   div.style.cursor = 'pointer';
  //   return div;
  // }

  // appendDot(offset) {
  //   for (let i = 0; i < 8; i++) {
  //     const div = this.createDot(offset, i);
  //     this.$recDotEleArr.push(div);
  //     this.$recEle.appendChild(div);
  //   }
  // }

  // updateFocusRectDot(offset) {
  //   const { width, height } = offset;
  //   this.$recDotEleArr.forEach((item, index) => {
  //     const { left, top } = this._getTopLeftPos(index, width, height);
  //     item.style.left = left;
  //     item.style.top = top;
  //   });
  // }

  _getTopLeftPos(index, width, height) {
    return {
      left: [0, 3, 5].includes(index)
        ? '-3px'
        : [2, 6].includes(index)
        ? width / 2 - 3 + 'px'
        : width - 3 + 'px',
      top: index < 3 ? '-3px' : index < 5 ? height / 2 - 3 + 'px' : height - 3 + 'px'
    }
  }

  createBtn(offset, type) {
    const div = document.createElement('div')
    div.style.position = 'absolute'
    div.style.left = this._getBtnLeftVal(offset, type)
    div.style.top = '-27px'
    div.style.cursor = 'pointer'
    const img = document.createElement('img')
    img.src = `/${type}.png`
    img.style.width = '18px'
    img.style.background = '#1989fa'
    img.style.padding = '4px'
    div.appendChild(img)
    this.$recEle.appendChild(div)
    if (type === 'delete') {
      this.$recDelBtn = div
    } else {
      this.$recCopyBtn = div
    }
    div.addEventListener('click', () => {
      this.__designer__.emit('actions', {
        type: type === 'delete' ? ActionTypes.FOCUS_BTN_DEL : ActionTypes.FOCUS_BTN_COPY,
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
      this.$recCopyBtn.style.display = 'none'
    }
  }

  showBtn(type) {
    if (type === 'delete') {
      this.$recDelBtn.style.display = 'block'
    } else {
      this.$recCopyBtn.style.display = 'block'
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
