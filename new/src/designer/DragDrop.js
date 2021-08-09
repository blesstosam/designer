import { EVENT_TYPES } from './Event'
import { $ } from './lib/dom'

const state = {
  dragging: false, // 是否在拖拽
  dragImage: null,
  target: null, // 当前被拖拽的组件dom
  dropEnterTarget: null, // 拖入目标触发dropEnter的dom
  data: null, // 当前组件的描述对象 每次在drop之后重置
  dropPos: {
    // drop后的位置
    // 参考api https://developer.mozilla.org/zh-CN/docs/Web/API/MouseEvent
    x: 0,
    y: 0
  }
}

const EffectsAllowed = {
  none: 'none',
  copy: 'copy',
  copyLink: 'copyLink',
  copyMove: 'copyMove',
  link: 'link',
  linkMove: 'linkMove',
  move: 'move',
  all: 'all',
  uninitialized: 'uninitialized'
}
const DropEffects = {
  copy: 'copy',
  move: 'move',
  link: 'link',
  none: 'none'
}
const EventTypes = {
  drag: 'drag',
  dragstart: 'dragstart',
  dragend: 'dragend',
  drop: 'drop',
  dragover: 'dragover',
  dragenter: 'dragenter',
  dragleave: 'dragleave'
}

const DRAG_ENTER_CONTAINER_CLS = 'dragenter-actived'

export class DragDrop {
  constructor(config = {}, designer) {
    const {
      dropEffect = 'move',
      effectAllowed = 'move',
      dragEnterContainerCls = DRAG_ENTER_CONTAINER_CLS
    } = config
    if (dropEffect && !DropEffects[dropEffect]) throw new Error(`DragDrop: dropEffect invalid`)
    if (effectAllowed && !EffectsAllowed[effectAllowed])
      throw new Error('DragDrop: effectAllowed invalid')

    this.__designer__ = designer
    this.dropEffect = dropEffect
    this.effectAllowed = effectAllowed
    this.dragEnterContainerCls = dragEnterContainerCls
    // todo marker 应该放到里面

    // this.cbStore = new WeakMap()
  }

  getData(key) {
    if (!key) return state
    return state[key]
  }

  setData(key, val) {
    state[key] = val
  }

  resetData() {
    state.dragging = false
    state.dragImage && state.dragImage.remove()
    state.dragImage = null
    state.target = null
    state.dropEnterTarget = null
    state.data = null
    state.dropPos = { x: 0, y: 0 }
  }

  addDragEnterCls(e) {
    state.dropEnterTarget = e.target
    e.target.classList.add(DRAG_ENTER_CONTAINER_CLS)
  }

  removeDragEnterCls() {
    state.dropEnterTarget && state.dropEnterTarget.classList.remove(DRAG_ENTER_CONTAINER_CLS)
  }

  renderDragImage(target) {
    const el = $('<div>')
      .style({
        position: 'fixed',
        top: '-1000px',
        left: 0,
        padding: '8px 16px',
        background: '#222',
        color: '#fff'
      })
      .text(
        $(target)
          .addClass('drag-image')
          .getAttr('com-title')
      ).el
    document.body.appendChild(el)
    return el
  }

  bindDragStart(target, cb) {
    target.addEventListener(EventTypes.dragstart, e => {
      e.dataTransfer.effectAllowed = this.effectAllowed
      e.dataTransfer.dropEffect = this.dropEffect

      const dragImage = this.renderDragImage(e.target)
      e.dataTransfer.setDragImage(dragImage, 0, 0)

      this.setData('dragging', true)
      this.setData('target', e.target)
      this.setData('dragImage', dragImage)
      cb && cb(this._getParams(e))
      this.__designer__.emit(EVENT_TYPES.DRAG_START)
      this.__designer__.emit(EVENT_TYPES.COMPONENTS_DRAG, this._getParams(e))
    })
  }

  bindDragEnd(target, cb) {
    target.addEventListener(EventTypes.dragend, e => {
      cb && cb(this._getParams(e))
      this.__designer__.emit(EVENT_TYPES.DRAG_END)
      this.resetData()
    })
  }

  bindDrop(target, cb, opts = {}) {
    target.addEventListener(EventTypes.drop, e => {
      opts.stop && e.stopPropagation()
      this.removeDragEnterCls()
      state.dropPos.x = e.x
      state.dropPos.y = e.y

      cb && cb(this._getParams(e))
      this.__designer__.emit(EVENT_TYPES.DRAG_DROPED)
      this.__designer__.emit(EVENT_TYPES.COMPONENTS_DROPED, this._getParams(e))
      this.resetData()
    })
  }

  bindDrag(target, cb, opts = {}) {
    target.addEventListener(EventTypes.drag, e => {
      opts.stop && e.stopPropagation()

      cb && cb(this._getParams(e))
      this.__designer__.emit(EVENT_TYPES.DRAG_DRAG)
    })
  }

  bindDragOver(target, cb, opts = {}) {
    target.addEventListener(EventTypes.dragover, e => {
      e.preventDefault()
      opts.stop && e.stopPropagation()
      cb && cb(this._getParams(e))
      this.__designer__.emit(EVENT_TYPES.DRAG_OVER)
    })
  }

  bindDragEnter(target, cb, opts = {}) {
    target.addEventListener(EventTypes.dragenter, e => {
      opts.stop && e.stopPropagation()
      cb && cb(this._getParams(e))
      this.__designer__.emit(EVENT_TYPES.DRAG_ENTER)
    })
  }

  bindDragLeave(target, cb, opts = {}) {
    target.addEventListener(EventTypes.dragleave, e => {
      opts.stop && e.stopPropagation()
      cb && cb(this._getParams(e))
      this.__designer__.emit(EVENT_TYPES.DRAG_LEAVE)
    })
  }

  _getParams(e) {
    return {
      getData: this.getData,
      setData: this.setData,
      resetData: this.resetData,
      addDragEnterCls: this.addDragEnterCls,
      removeDragEnterCls: this.removeDragEnterCls,
      $event: e
    }
  }

  // saveCb(target, evtType, cb) {
  //   if (this.cbStore.get(target) || this.cbStore.set(target, new Map())) {
  //     const res = this.cbStore.get(target)
  //     res.set(evtType, cb)
  //   }
  // }

  // unbind(target, evtType) {
  //   const res = this.cbStore.get(target)
  //   if (res && res.get(evtType)) {
  //     target.removeEventListener(evtType, res.get(evtType))
  //   }
  // }
}
