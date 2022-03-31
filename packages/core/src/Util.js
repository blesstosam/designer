// 存放一些第三方库，比如lodash/dayjs/Vue/React

export const UtilTypes = {
  Function: 'function',
  Cls: 'class',
  Obj: 'object'
}

export class Util {
  constructor(config, designer) {
    this.config = config || {}
    this.__designer__ = designer
    this._utils = new Map()
  }

  // util 可能为函数，对象，或者类
  // { name: 'Vue', type: 'class', value: Vue }
  register(util) {
    if (![UtilTypes.Function, UtilTypes.Cls, UtilTypes.Obj].includes(util.type)) {
      throw new Error(`[designer] Util类型必须为${UtilTypes.Function}, ${UtilTypes.Cls}, ${UtilTypes.Obj}`)
    }

    this._utils.set(util.name, util.value)
  }

  get(name) {
    return this._utils.get(name)
  }
}
