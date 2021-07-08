export class ViewModel {
  constructor(_data) {
    this._data = _data
  }

  get data() {
    return this._data
  }

  get size() {
    return this._data.length
  }

  get depth() {
    // todo
  }

  getLastNode(depth = 0) {
    if (depth === 0) {
      return this._data[this.size - 1]
    }
    // todo
  }

  /**
   * 根据某个key值 递归遍历找到节点
   * @param {*} key
   * @param {*} val
   * @param {Array} arr
   * @returns {*}
   */
  findVmByKey(key, val, arr) {
    if (!arr) arr = this._data
    for (const vm of arr) {
      if (vm[key] === val) return vm
      if (vm.children && vm.children.length) {
        const _vm = this.findVmByKey(key, val, vm.children)
        if (_vm) return _vm
      }
    }
  }

  /**
   * 根据某个key值 查找并删除节点
   * @param {*} el
   * @param {*} arr
   * @returns {*} 被删除的节点
   */
  removeVmByKey(key, val, arr) {
    if (!arr) arr = this._data
    for (let i = 0; i < arr.length; i++) {
      const vm = arr[i]
      if (vm[key] === val) {
        const movedArr = arr.splice(i, 1)
        return movedArr[0]
      }
      if (vm.children && vm.children.length) {
        const moved = this.removeVmByKey(key, val, vm.children)
        if (moved) return moved
      }
    }
  }

  append(d) {
    this._data.push(d)
  }

  prepend(d) {
    this._data.unshift(d)
  }

  clear() {
    this._data = []
  }
}
