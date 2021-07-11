import cloneDeep from 'lodash.clonedeep'

const DEFAULT_MAX_LENGTH = 10

export class Command {
  constructor(config = {}, designer) {
    this.__designer__ = designer
    // _actions = { type: event_type, data: {}, timestamp: Date }
    this._actions = []
    // ----- for debug ------
    window.command = this
    this._actionIdx = -1
    this.maxRecordLength = config.maxRecordLength || DEFAULT_MAX_LENGTH
    // 需要操作的事件类型
    this.OptTypes = config.OptTypes
    // 每次redo和undo触发的时候调用
    this.onChange = config.onChange
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
      this.add(d, () => {
        cb && cb({ actions: this._actions, idx: this._actionIdx })
      })
    })
  }

  add(d, cb) {
    if (!this._actions.length >= this.maxRecordLength) return
    // 如果当前操作为最后一步
    if (this.isLastStep) {
      this._actions.push({
        type: d.type,
        data: cloneDeep(d.data),
        timestamp: +new Date()
      })
      this._actionIdx++
    } else {
      // 如果当前操作不是最后一步 即之前点击了上一步
      // 将 actions 里指针后面的操作都删除掉
      this._actions.splice(this._actionIdx, this._actions.length - this._actionIdx - 1)
      this._actions.push({
        type: d.type,
        data: cloneDeep(d.data),
        timestamp: +new Date()
      })
      this._actionIdx = this._actions.length - 1
    }
    cb && cb()
  }

  undo(cb) {
    if (this.canUndo) {
      const currentAction = this._actions[this._actionIdx]
      console.log(currentAction, 'in undo')
      // TODO 使用策略模式进行不同的操作
      // if (currentAction.type === C_A_A) {
      //   // todo
      // } else if (currentAction.type === C_A_D) {
      //   // todo
      // } else if (currentAction.type === A_S_A) {
      //   // todo
      // }
      this._actionIdx--
      cb && cb(this._actions)
      this.emitChange()
    }
  }

  redo(cb) {
    if (this.canRedo) {
      const currentAction = this._actions[this._actionIdx]
      // if (currentAction.type === C_A_A) {
      // } else if (currentAction.type === C_A_D) {
      // } else if (currentAction.type === A_S_A) {
      // }
      this._actionIdx++
    }
    cb && cb(this._actionIdx)
    this.emitChange()
  }

  emitChange() {
    this.onChange && this.onChange({ canRedo: this.canRedo, canUndo: this.canUndo })
  }
}
