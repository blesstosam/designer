// 画布上被选中之后的选中框
export class FocusRect {
  constructor() {
    this.recEle = null;
    this.recDotEleArr = [];
    this.recDelBtn = null;
  }

  create(offset) {
    this.createFocusRect(offset);
    this.appendFocusRectDot(offset);
    this.createFocusRectDelBtn(offset);
  }

  update(offset) {
    this.updateFocusRect(offset);
    this.updateFocusRectDot(offset);
    this.updateFocusRectDelBtn(offset);
  }

  // 创建选中框
  createFocusRect(offset) {
    const { width, height, top, left } = offset;
    const div = document.createElement('div');
    div.style.width = width + 'px';
    div.style.height = height + 'px';
    div.style.top = top + 'px';
    div.style.left = left + 'px';
    div.style.position = 'absolute';
    div.style.border = '1px solid rgb(70, 128, 255)';
    div.style.zIndex = 100;
    document.body.appendChild(div);
    this.recEle = div;
    return div;
  }

  updateFocusRect(offset) {
    const { width, height, top, left } = offset;
    this.recEle.style.width = width + 'px';
    this.recEle.style.height = height + 'px';
    this.recEle.style.top = top + 'px';
    this.recEle.style.left = left + 'px';
  }

  createFocusRectDot(offset, index) {
    const { width, height } = offset;
    const { left, top } = this._getTopLeftPos(index, width, height);
    const div = document.createElement('div');
    div.style.width = '6px';
    div.style.height = '6px';
    div.style.background = 'rgb(70, 128, 255)';
    div.style.position = 'absolute';
    div.style.left = left;
    div.style.top = top;
    div.style.zIndex = 100;
    div.style.cursor = 'pointer';
    return div;
  }

  appendFocusRectDot(offset) {
    for (let i = 0; i < 8; i++) {
      const div = this.createFocusRectDot(offset, i);
      this.recDotEleArr.push(div);
      this.recEle.appendChild(div);
    }
  }

  updateFocusRectDot(offset) {
    const { width, height } = offset;
    this.recDotEleArr.forEach((item, index) => {
      const { left, top } = this._getTopLeftPos(index, width, height);
      item.style.left = left;
      item.style.top = top;
    });
  }

  _getTopLeftPos(index, width, height) {
    return {
      left: [0, 3, 5].includes(index)
        ? '-3px'
        : [2, 6].includes(index)
        ? width / 2 - 3 + 'px'
        : width - 3 + 'px',
      top: index < 3 ? '-3px' : index < 5 ? height / 2 - 3 + 'px' : height - 3 + 'px',
    };
  }

  createFocusRectDelBtn(offset) {
    const div = document.createElement('div');
    div.style.width = '12px';
    div.style.height = '12px';
    div.style.background = 'red';
    div.style.position = 'absolute';
    div.style.left = offset.width - 18 + 'px';
    div.style.top = '-6px';
    div.style.textAlign = 'center';
    div.style.color = 'white';
    div.style.lineHeight = '9px';
    div.style.fontWeight = 'bold';
    div.textContent = '-';
    div.style.cursor = 'pointer';
    div.style.zIndex = 101;
    this.recEle.appendChild(div);
    this.recDelBtn = div;
    return div;
  }

  updateFocusRectDelBtn(offset) {
    this.recDelBtn.style.left = offset.width - 18 + 'px';
  }
}
