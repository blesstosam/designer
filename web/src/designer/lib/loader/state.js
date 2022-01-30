import cloneDeep from 'lodash.clonedeep'
import { isPlainObject } from '../util'

// 全局状态store 用于插件之间，插件和平台之间的数据共享
let globalState = {}
const subs = {}
export const store = {
  initState(state) {
    if (!isPlainObject(state))
      throw new Error('FetchLoader.store.initSatate: please pass a plain object')
    globalState = cloneDeep(state)
  },

  setState(key, val) {
    if (typeof key !== 'string')
      throw new Error(`FetchLoader.store.setState: key must be a string`)
    const oldVal = globalState[key]
    globalState[key] = cloneDeep(val)
    const sub = subs[key]
    if (sub && sub.length) {
      for (const fn of sub) {
        fn(cloneDeep(val), cloneDeep(oldVal))
      }
    }
  },

  getState(key) {
    if (!key) return cloneDeep(globalState)
    return cloneDeep(globalState[key])
  },

  onStateChange(key, cb, fireImmediately) {
    if (typeof key !== 'string')
      throw new Error(`FetchLoader.store.onStateChange: key must be a string`)
    if (typeof cb !== 'function') {
      console.error('FetchLoader.store.onStateChange: callback must be a function')
      return
    }
    const sub = subs[key]
    if (sub) {
      if (!sub.find((i) => i === cb)) {
        subs[key] = [...sub, cb]
      }
    } else {
      subs[key] = [cb]
    }
    if (fireImmediately) {
      cb(cloneDeep(globalState[key]))
    }
  },

  offStateChange(key, cb) {
    if (typeof key !== 'string')
      throw new Error(`FetchLoader.store.offStateChange: key must be a string`)
    const sub = subs[key]

    if (sub) {
      if (cb === undefined) {
        // 取消所有订阅
        subs[key] = undefined
        return true
      }
      const index = sub.findIndex((i) => i === cb)
      if (index > -1) {
        sub.splice(index, 1)
        return true
      }
    }
  }
}

// 消息总线 用于插件之间，插件和平台之间的消息的传递
// event.on('customEvent', (param) => { // use param }) // 平台
// event.emit('customEvent', { user: 'sam', from: 'plugin-one' }) // 插件
const eventSubs = {}
export const event = {
  on(type, cb) {
    if (typeof cb !== 'function') {
      console.error('FetchLoader.event.on: callback must be a function')
      return
    }
    const sub = eventSubs[type]
    if (sub) {
      if (!sub.find((i) => i === cb)) {
        eventSubs[type] = [...sub, cb]
      }
    } else {
      eventSubs[type] = [cb]
    }
  },

  off(type, cb) {
    const sub = eventSubs[type]
    if (sub) {
      if (cb === undefined) {
        // 取消所有订阅
        eventSubs[type] = undefined
        return true
      }
      const index = sub.findIndex((i) => i === cb)
      if (index > -1) {
        sub.splice(index, 1)
        return true
      }
    }
  },

  emit(type, ...args) {
    const sub = eventSubs[type]
    if (sub && sub.length) {
      for (const fn of sub) {
        fn(...args)
      }
    }
  }
}
