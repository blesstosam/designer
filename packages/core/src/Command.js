import cloneDeep from 'lodash.clonedeep'
import { EVENT_TYPES } from './Event'
import { InsertTypes } from './Util'

const {
  CANVAS_ACTIONS_APPEND,
  CANVAS_ACTIONS_PREPEND,
  CANVAS_ACTIONS_AFTER,
  CANVAS_ACTIONS_BEFORE,
  CANVAS_ACTIONS_DELETE,
  ATTRPANEL_SET_ATTR
} = EVENT_TYPES

const canvasInsert = (data, canvas) => {
  // debugger
  const currentData = data
  const map = {
    [CANVAS_ACTIONS_APPEND]: InsertTypes.APPEND,
    [CANVAS_ACTIONS_PREPEND]: InsertTypes.PREPEND,
    [CANVAS_ACTIONS_AFTER]: InsertTypes.AFTER,
    [CANVAS_ACTIONS_BEFORE]: InsertTypes.BEFORE
  }
  return {
    execute() {
      const fnName = map[data.type]
      canvas[fnName](currentData.component, currentData.container)
    },
    undo() {
      canvas.remove(currentData.data)
    }
  }
}

const canvasRemove = () => {}

const setAttr = () => {}

const getCommand = (eventType) => {
  if (
    [
      CANVAS_ACTIONS_APPEND,
      CANVAS_ACTIONS_PREPEND,
      CANVAS_ACTIONS_AFTER,
      CANVAS_ACTIONS_BEFORE
    ].includes(eventType)
  ) {
    return canvasInsert
  }
  if (CANVAS_ACTIONS_DELETE === eventType) {
    return canvasRemove
  }
  if (ATTRPANEL_SET_ATTR === eventType) {
    return setAttr
  }
}

const DEFAULT_MAX_LENGTH = 20

export class Command {
  constructor(config = {}, designer) {
    this.__designer__ = designer
    window.command = this
    this.actions = []
    this.actionIdx = -1
    this.maxRecordLength = config.maxRecordLength || DEFAULT_MAX_LENGTH
    this.cb = null
    this.CommandTypes = config.CommandTypes
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
    return this.actions.length
  }

  get canUndo() {
    return this.actions.length && this.actionIdx > -1
  }

  get canRedo() {
    return this.actions.length && this.actionIdx < this.actions.length - 1
  }

  get isLastStep() {
    return this.actionIdx === this.actions.length - 1
  }

  listen(cb) {
    this.cb = cb
    this.__designer__.on(this.CommandTypes || [], (d) => {
      if (!this.lockType) {
        this.exec1(d)
      }
    })
  }
  exec1(data) {
    const { actionIdx, actions } = this
    if (actionIdx < actions.length - 1) {
      this.actions = actions.slice(0, actionIdx + 1)
    }
    if (getCommand(data.type)) {
      const concreteCommand = getCommand(data.type)(data, this.__canvas__)
      this.actions.push(concreteCommand)
      this.actionIdx++
    }
    this.cb && this.cb({ actions: this.actions, idx: this.actionIdx })
  }

  exec(d) {
    if (!this.actions.length >= this.maxRecordLength) return
    const _data = {
      type: d.type,
      data: cloneDeep(d.data),
      timestamp: +new Date()
    }
    if (this.isLastStep) {
      // 如果当前操作为最后一步
      this.actions.push(_data)
      this.actionIdx++
    } else if (this.actionIdx === -1) {
      // 如果撤销了所有操作，将actions重置之后再插入
      this.actions = [_data]
    } else {
      // 如果当前操作不是最后一步 即之前点击了上一步
      // 将 actions 里指针后面的操作都删除掉
      this.actions.splice(this.actionIdx, this.actions.length - this.actionIdx - 1)
      this.actions.push(_data)
      this.actionIdx = this.actions.length - 1
    }
    this.cb && this.cb({ actions: this.actions, idx: this.actionIdx })
  }

  undo(cb) {
    if (this.canUndo) {
      this.lockType = 'undo'
      this.actions[this.actionIdx].undo()
      this.actionIdx--
      cb && cb({ idx: this.actionIdx, canUndo: this.canUndo, canRedo: this.canRedo })
      this.lockType = null
    }
  }

  redo(cb) {
    if (this.canRedo) {
      this.lockType = 'redo'
      this.actionIdx++
      this.actions[this.actionIdx].execute()
      cb && cb({ idx: this.actionIdx, canUndo: this.canUndo, canRedo: this.canRedo })
      this.lockType = null
    }
  }
}
