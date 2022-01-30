export const LoadStatus = {
  NOT_LOAD: 'NOT_LOAD',
  LOADING: 'LOADING',
  LOADED_ERR: 'LOADED_ERR',
  LOADED: 'LOADED',
  EXECTED_ERR: 'EXECTED_ERR'
}

export const MountStatus = {
  // 模块实例的状态，仅限自定义组件，每次获取模块都会返回一个新的模块对象
  // 可以参考single-spa的parcels
  // https://zh-hans.single-spa.js.org/docs/parcels-overview#%E6%A8%A1%E6%80%81%E6%A1%86
  NOT_MOUNTED: 'NOT_MOUNTED', // 插件加载成功，还未挂载
  MOUNTING: 'MOUNTING', // 插件挂载中 => 插件mount方法被调用，还没执行完
  MOUNTED: 'MOUNTED', // 插件挂载成功 => 调用mount后没报错
  MOUNTED_ERR: 'MOUNTED_ERR', // 插件挂载失败 => 调用mount后报错

  UPDATING: 'UPDATING', // 插件调用update方法，正在调用
  UPDATED: 'UPDATED', // 插件调用update方法，调用完成
  UPDATED_ERR: 'UPDATED_ERR', // 插件调用update方法，调用报错

  UN_MOUNTING: 'UN_MOUNTING', // 插件卸载中 => 调用unmount方法，还没执行完
  UN_MOUNTED: 'UN_MOUNTED', // 插件已卸载 => 调用unmount后没报错
  UN_MOUNTED_ERR: 'UN_MOUNTED_ERR' // 插件卸载失败 => 调用unmount后报错
}

export function createStore() {
  let store = Object.create(null)
  return {
    /**
     * 保存js模块(包括发起请求还没有返回的/已经返回的)
     * 在请求失败后需要删除模块 表示没有被加载过
     * @param {String} name
     * @param {Object | Function | String} modOrSrc 模块或者js的src
     * @param {boolean} isInit 是否是第一次记录模块信息
     * @return void
     */
    set(name, modOrSrc, isInit = false) {
      if (store[name]) {
        if (modOrSrc && !isInit) {
          store[name].status = LoadStatus.LOADED
          store[name].mod = modOrSrc
        }
      } else {
        store[name] = {
          name,
          modUrl: modOrSrc,
          status: LoadStatus.NOT_LOAD
        }
      }
    },

    /**
     * 保存css模块 为stylenode
     * @param cssMod HTMLStyleElement
     */
    setCssMod(name, cssMod) {
      if (cssMod && this.has(name)) {
        store[name].cssMod = cssMod
      }
    },

    setStatus(name, status) {
      if (store[name]) {
        store[name].status = status
      }
    },

    getStatus(name) {
      if (store[name]) return store[name].status
    },

    setError(name, err) {
      if (store[name]) {
        store[name].error = err
      }
    },

    get(name) {
      if (name) return store[name]
      return store
    },

    has(name) {
      return !!store[name]
    },

    delete(name) {
      if (store[name]) {
        store[name] = undefined
      }
    },

    clear() {
      store = Object.create(null)
    }
  }
}
