import { EVENT_TYPES } from './Event'

const state = {
  dragging: false, // 是否在拖拽
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
    state.target = null
    state.dropEnterTarget = null
    state.data = null
  }

  addDragEnterCls(e) {
    state.dropEnterTarget = e.target
    e.target.classList.add(DRAG_ENTER_CONTAINER_CLS)
  }

  removeDragEnterCls() {
    state.dropEnterTarget && state.dropEnterTarget.classList.remove(DRAG_ENTER_CONTAINER_CLS)
  }

  bindDragStart(target, cb) {
    target.addEventListener(EventTypes.dragstart, e => {
      e.dataTransfer.effectAllowed = this.effectAllowed
      this.setData('dragging', true)
      this.setData('target', e.target)
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
      cb && cb(this._getParams(e))
      this.__designer__.emit(EVENT_TYPES.DRAG_DROPED)
      this.__designer__.emit(EVENT_TYPES.COMPONENTS_DROPED, this._getParams(e))
      this.resetData()
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