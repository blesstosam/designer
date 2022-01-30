// 记录拖动过程中鼠标移动的位置信息
// 设置鼠标的形状，在body标签上设置，如果在某个已经设置过cursor形状的dom元素上，该操作不起作用

export const CursorTypes = {
  move: 'move',
  pointer: 'pointer',
  initial: 'initial'
}

const initialPosition = {
  pageX: 0,
  pageY: 0,
  clientX: 0,
  clientY: 0,
  offsetX: 0,
  offsetY: 0
}

export class Cursor {
  constructor(config = {}, designer) {
    this.__designer__ = designer
    this.position = initialPosition
  }

  setType(type) {
    this.type = type
    document.body.style.cursor = type
  }

  resetType() {
    this.type = 'initial'
    document.body.style.cursor = 'initial'
  }

  setPosition(pos) {
    this.position = pos
  }

  resetPosition() {
    this.position = initialPosition
  }
}
