export class Command {
  constructor(config = {}, designer) {
    this.__designer__ = designer
    this._actions = []
    this._actionIdx = -1
    // 最大操作记录个数
    this.maxRecordTimes = config.maxRecordTimes || 10
  }

  undo() {}

  redo() {}
}
