import cloneDeep from 'lodash.clonedeep'
import { EVENT_TYPES } from './Event'

const {
  CANVAS_ACTIONS_APPEND: C_A_A,
  CANVAS_ACTIONS_DELETE: C_A_D,
  ATTRPANEL_SET_ATTR: A_S_A
} = EVENT_TYPES

const DEFAULT_MAX_LENGTH = 10

export class Command {
  constructor(config = {}, designer) {
    this.__designer__ = designer
    // ----- for debug ------
    window.command = this
    // _actions = { type: event_type, data: {}, timestamp: Date }
    this._actions = []
    this._actionIdx = -1
    this.maxRecordLength = config.maxRecordLength || DEFAULT_MAX_LENGTH
    // 需要操作的事件类型
    this.OptTypes = config.OptTypes
    // 每次redo和undo触发的时候调用
    this.onChange = config.onChange
    // 当执行redo和undo的时候开启锁 因为该操作会执行action，执行action的时候又会发送事件 但是此时不应该监听
    this.lockType = null
  }

  get __canvas__() {
    return this.__designer__.__canvas__
  }

  get model() {
    return this.__canvas__.model
  }

  get size() {
    return this._actions.length
  }

  get canUndo() {
    return this._actions.length && this._actionIdx > -1
  }

  get canRedo() {
    return this._actions.length && this._actionIdx < this._actions.length - 1
  }

  get isLastStep() {
    return this._actionIdx === this._actions.length - 1
  }

  listen(cb) {
    this.__designer__.on(this.OptTypes || [], d => {
      if (!this.lockType) {
        this.add(d, () => {
          cb && cb({ actions: this._actions, idx: this._actionIdx })
        })
      } else if (d.type === C_A_A) {
        // 在执行redo或undo中
        // 如果是添加节点，需要把node的$el重新赋值，因为之前被remove掉了
        if (this.lockType === 'redo') {
          this._actions[this._actionIdx].data.$el = d.data.$el
        }
      }
    })
  }

  add(d, cb) {
    if (!this._actions.length >= this.maxRecordLength) return
    const _data = {
      type: d.type,
      data: cloneDeep(d.data),
      timestamp: +new Date()
    }
    if (this.isLastStep) {
      // 如果当前操作为最后一步
      this._actions.push(_data)
      this._actionIdx++
    } else if (this._actionIdx === -1) {
      // 如果撤销了所有操作，将actions重置之后再插入
      this._actions = [_data]
    } else {
      // 如果当前操作不是最后一步 即之前点击了上一步
      // 将 actions 里指针后面的操作都删除掉
      this._actions.splice(this._actionIdx, this._actions.length - this._actionIdx - 1)
      this._actions.push(_data)
      this._actionIdx = this._actions.length - 1
    }
    cb && cb()
  }

  undo(cb) {
    if (this.canUndo) {
      this.lockType = 'undo'
      const currentAction = this._actions[this._actionIdx]
      console.log(currentAction, 'in undo')
      const type = this._getOpposite(currentAction.type)
      this.getActions(type)(currentAction.data)
      this._actionIdx--
      cb && cb(this._actions)
      this._emitChange()
      this.lockType = null
    }
  }

  redo(cb) {
    if (this.canRedo) {
      this.lockType = 'redo'
      this._actionIdx++
      const currentAction = this._actions[this._actionIdx]
      console.log(currentAction, 'in redo')
      this.getActions(currentAction.type)(currentAction.data)
      cb && cb(this._actionIdx)
      this._emitChange()
      this.lockType = null
    }
  }

  getActions(type) {
    const actions = {
      [C_A_A]: data => {
        // 因为deepclone 导致parent是一个新的对象 这里重新从model里找到parent
        const realParent = this.model.findVmByKey('$el', data.parent.$el)
        this.__canvas__.append(data, data.parent.$el, realParent)
      },
      [C_A_D]: data => {
        this.__canvas__.remove(data)
      },
      // TODO
      [A_S_A]: data => {}
    }
    return actions[type]
  }

  _getOpposite(type) {
    const actions = {
      [C_A_A]: C_A_D,
      [C_A_D]: C_A_A,
      [A_S_A]: A_S_A
    }
    return actions[type]
  }

  _emitChange() {
    this.onChange && this.onChange({ canRedo: this.canRedo, canUndo: this.canUndo })
  }
}
