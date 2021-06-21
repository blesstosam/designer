// 画布上被选中之后的选中框
export class FocusRect {
  constructor() {
    this.$recEle = null
    this.recDotEleArr = []
    this.$recDelBtn = null
    this.$recCopyBtn = null
    this.node = null
    this.initListener()
  }

  initListener() {
    window.addEventListener('resize', () => {
      if (this.$recEle && this.node) {
        const $el = this.node.$el
        const pos = {
          width: $el.offsetWidth,
          height: $el.offsetHeight,
          top: $el.offsetTop,
          left: $el.offsetLeft
        }
        this.update(pos)
      }
    })
  }

  create(offset, node) {
    node && (this.node = node)
    this.createFocusRect(offset)
    // this.appendFocusRectDot(offset);
    this.createFocusRectBtn(offset, 'delete')
    this.createFocusRectBtn(offset, 'copy')
  }

  update(offset, node) {
    node && (this.node = node)
    this.updateFocusRect(offset)
    // this.updateFocusRectDot(offset);
    this.updateFocusRectBtn(offset, 'delete')
    this.updateFocusRectBtn(offset, 'copy')
  }

  remove() {
    this.$recEle.remove()
  }

  // 创建选中框
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

  // createFocusRectDot(offset, index) {
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

  // appendFocusRectDot(offset) {
  //   for (let i = 0; i < 8; i++) {
  //     const div = this.createFocusRectDot(offset, i);
  //     this.recDotEleArr.push(div);
  //     this.$recEle.appendChild(div);
  //   }
  // }

  // updateFocusRectDot(offset) {
  //   const { width, height } = offset;
  //   this.recDotEleArr.forEach((item, index) => {
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

  createFocusRectBtn(offset, type) {
    const div = document.createElement('div')
    div.style.position = 'absolute'
    div.style.left = this._getBtnLeftVal(offset, type)
    div.style.top = '-27px'
    div.style.cursor = 'pointer'
    div.style.zIndex = 101
    const img = document.createElement('img')
    img.src = `/${type}.png`
    img.style.width = '20px'
    img.style.background = '#409EFF'
    img.style.padding = '3px'
    div.appendChild(img)
    this.$recEle.appendChild(div)
    if (type === 'delete') {
      this.$recDelBtn = div
    } else {
      this.$recCopyBtn = div
    }
    return div
  }

  updateFocusRectBtn(offset, type) {
    if (type === 'delete') {
      this.$recDelBtn.style.left = this._getBtnLeftVal(offset, type)
    } else {
      this.$recCopyBtn.style.left = this._getBtnLeftVal(offset, type)
    }
  }

  _getBtnLeftVal(offset, type) {
    return type === 'delete' ? offset.width - 26 + 'px' : offset.width - 58 + 'px'
  }
}
