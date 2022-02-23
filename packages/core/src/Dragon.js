import { EVENT_TYPES } from './Event'
import { $ } from './lib/dom'

const state = {
  dragging: false, // 是否在拖拽
  isMove: false, // 是否是移动操作
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

export class Dragon {
  constructor(config = {}, designer) {
    const {
      dropEffect = 'move',
      effectAllowed = 'copyMove',
      dragEnterContainerCls = DRAG_ENTER_CONTAINER_CLS
    } = config
    if (dropEffect && !DropEffects[dropEffect]) throw new Error(`Dragon: dropEffect invalid`)
    if (effectAllowed && !EffectsAllowed[effectAllowed])
      throw new Error('Dragon: effectAllowed invalid')

    this.__designer__ = designer
    this.dropEffect = dropEffect
    this.effectAllowed = effectAllowed
    this.dragEnterContainerCls = dragEnterContainerCls
    // todo marker 应该放到里面

    // this.cbStore = new WeakMap()
  }

  get __cursor__() {
    return this.__designer__.__cursor__
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
    state.isMove = false
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

  renderDragImg(txt) {
    const el = $('<div>')
      .style({
        position: 'fixed',
        top: '-1000px',
        left: 0,
        padding: '8px 16px',
        background: '#222',
        color: '#fff'
      })
      .text(txt).el
    // the drag image need to append to dom
    document.body.appendChild(el)
    this.setData('dragImage', el)
    return el
  }

  onDragStart(target, cb) {
    target.addEventListener(EventTypes.dragstart, e => {
      e.dataTransfer.effectAllowed = this.effectAllowed

      this.setData('dragging', true)
      this.setData('target', e.target)
      cb && cb(this._genParams(e))

      if (state.dragImage == null) {
        const txt = $(target)
          .addClass('drag-image')
          .getAttr('com-title')
        this.renderDragImg(txt)  
      }
      e.dataTransfer.setDragImage(state.dragImage, 0, 0)

      this.__designer__.emit(EVENT_TYPES.DRAG_START)
      this.__cursor__.setType('move')
    })
  }

  onDragEnd(target, cb) {
    target.addEventListener(EventTypes.dragend, e => {
      this.__cursor__.resetType()
      this.__cursor__.resetPosition()
      cb && cb(this._genParams(e))
      this.__designer__.emit(EVENT_TYPES.DRAG_END)
      this.resetData()
    })
  }

  onDrop(target, cb, opts = {}) {
    target.addEventListener(EventTypes.drop, e => {
      opts.stop && e.stopPropagation()
      this.removeDragEnterCls()
      state.dropPos.x = e.x
      state.dropPos.y = e.y

      cb && cb(this._genParams(e))
      this.__designer__.emit(EVENT_TYPES.DRAG_DROPED)
      this.resetData()
    })
  }

  onDrag(target, cb, opts = {}) {
    target.addEventListener(EventTypes.drag, e => {
      opts.stop && e.stopPropagation()

      cb && cb(this._genParams(e))
      this.__designer__.emit(EVENT_TYPES.DRAG_DRAG)
    })
  }

  onDragOver(target, cb, opts = {}) {
    target.addEventListener(EventTypes.dragover, e => {
      e.preventDefault()
      e.dataTransfer.dropEffect = this.dropEffect

      opts.stop && e.stopPropagation()
      cb && cb(this._genParams(e))
      this.__designer__.emit(EVENT_TYPES.DRAG_OVER)
    })
  }

  onDragEnter(target, cb, opts = {}) {
    target.addEventListener(EventTypes.dragenter, e => {
      opts.stop && e.stopPropagation()
      cb && cb(this._genParams(e))
      this.__designer__.emit(EVENT_TYPES.DRAG_ENTER)
    })
  }

  onDragLeave(target, cb, opts = {}) {
    target.addEventListener(EventTypes.dragleave, e => {
      opts.stop && e.stopPropagation()
      cb && cb(this._genParams(e))
      this.__designer__.emit(EVENT_TYPES.DRAG_LEAVE)
    })
  }

  _genParams(e) {
    return {
      getData: this.getData,
      setData: this.setData,
      resetData: this.resetData,
      addDragEnterCls: this.addDragEnterCls,
      removeDragEnterCls: this.removeDragEnterCls,
      renderDragImg: this.renderDragImg.bind(this),
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
