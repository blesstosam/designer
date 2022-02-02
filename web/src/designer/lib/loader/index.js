import { createSandbox, SandboxTypes } from './sandbox/index'
import { createStore, LoadStatus, MountStatus } from './store'
import { event } from './state'
import { process } from './sandbox/css'
import { isPlainObject, checkUriValid, getPublicPath, setPublicPath } from './util'
import { prefetcher } from './prefetch'
const Promise = window.Promise

const getScopedCssPrefix = (id) => `data-qycloud-${id}`
const noop = () => {}
const genInnerContainer = (container, prefix) => {
  const innerContainer = document.createElement('div')
  container.setAttribute('class', `qycloud-micro-component-${prefix}`)
  container.setAttribute(getScopedCssPrefix(prefix), '')
  container.appendChild(innerContainer)

  // TODO 是否需要监听此dom被移除事件 然后调用 unmount 方法
  // unmount 理应由使用者去调用，而不是在框架内部自动调用
  // const ob = new MutationObserver((mutationList, observer) => {
  //   console.log(mutationList)
  //   for (const i of mutationList) {
  //     console.log(typeof i.removedNodes,';')
  //     Object.keys(i.removedNodes).forEach(k => {
  //       if (i.removedNodes[k] === container) {
  //         console.log('111')
  //       }
  //     })
  //   }
  // })
  // ob.observe(document.body, { childList: true })

  return innerContainer
}

function fetch(url, opts = {}) {
  if (!window.fetch) {
    throw new Error('FetchLoader: window.fetch not found, please polyfill it!')
  }

  return window.fetch(url, { mode: 'cors', ...opts }).then((res) => {
    if (res.ok) return res.text()
    throw res
  })
}

/**
 * 处理模块地址为相对地址的情况, 处理地址错误的情况
 * 将 moduledata 存到 store
 * @param {Object} moduleData
 * @param {string} baseUrl
 * @return {Object}
 */
 export function _handleModuleSrc(moduleData, baseUrl) {
  const finalModuleData = {},
    errMsg = []
  Object.keys(moduleData).forEach((moduleName) => {
    let scriptSrc = moduleData[moduleName]
    if (!/^https?/.test(scriptSrc)) {
      scriptSrc = joinLink(baseUrl || window.location.origin, scriptSrc)
    }
    if (!checkUriValid(scriptSrc)) {
      errMsg.push(`${moduleName}: url '${scriptSrc}' invalid!`)
    }

    finalModuleData[moduleName] = scriptSrc

    // auto set publicPath
    const prefix = moduleName.split('_').shift()
    // 如果外面手动设置了 publicPath 则使用外面的
    if (!getPublicPath(prefix)) {
      setPublicPath(prefix, genPublicPath(scriptSrc) + '/')
    }
  })
  if (errMsg.length) return { status: 'error', data: errMsg.join('\n') }
  return { status: 'ok', data: finalModuleData }
}

class FetchLoader {
  constructor({ baseUrl, styleIsolation, ignoreStyleRuleArray } = {}) {
    this.baseUrl = baseUrl || ''
    this.styleIsolation = !!styleIsolation
    this.ignoreStyleRuleArray = ignoreStyleRuleArray
    this.moduleStore = createStore()
    this.preFetched = Object.create(null)
  }

  // 获取整个模块对象
  getModuleMeta(name) {
    return this.moduleStore.get(name)
  }

  // 获取模块本身
  getModule(name) {
    const rawMod = this.moduleStore.get(name)
    if (rawMod && rawMod.mod) {
      return this._getRealMod({ moduleName: name, mod: rawMod.mod })
    }
  }

  getModuleStatus(name) {
    return this.moduleStore.getStatus(name)
  }

  prefetch(moduleData) {
    if (!isPlainObject(moduleData)) throw new Error('FetchLoader.prefetch: moduleData 请传入对象')
    const { status, data } = _handleModuleSrc(moduleData, this.baseUrl)
    if (status === 'ok') {
      Object.keys(data).forEach((moduleName) => {
        const url = data[moduleName]
        if (!this.preFetched[url]) {
          prefetcher(url, 'fetch').then(() => {
            this.preFetched[url] = true
          })
        }
      })
    } else {
      throw new Error(data)
    }
  }

  fetch(moduleData, cb, errorCb) {
    if (!Promise) throw new Error('FetchLoader: window.Promise not found, please polyfill it!')
    if (!isPlainObject(moduleData)) throw new Error(`FetchLoader.fetch: moduleData 请传入对象`)

    const { status, data } = _handleModuleSrc(moduleData, this.baseUrl)
    if (status === 'ok') {
      // save to store, current state is 'not_load'
      Object.keys(data).forEach((name) => {
        if (!this.moduleStore.has(name)) {
          this.moduleStore.set(name, data[name], true)
        }
      })
      this._fetchScript(data)
        .then((res) => {
          cb && cb(...res)
        })
        .catch((err) => {
          this._handleError(err, 'fetchScript', errorCb)
        })
    } else {
      this._handleError(data, 'fetch', errorCb)
    }
  }

  /**
   * @param {Object} moduleData eg: { 'A': 'http://domain/a.js', 'B': 'http://domain/b.js' }
   */
  _fetchScript(moduleData) {
    const promiseArr = []
    Object.keys(moduleData).forEach((moduleName) => {
      const scriptSrc = moduleData[moduleName]
      if (!checkUriValid(scriptSrc)) {
        promiseArr.push(Promise.reject(`FetchLoader: ${moduleName} 的请求地址 ${scriptSrc} 不正确`))
      } else {
        const { NOT_LOAD, LOADING, LOADED_ERR, EXECTED_ERR, LOADED } = LoadStatus
        // if module loaded
        if (this.moduleStore.getStatus(moduleName) === LOADED) {
          const mod = this.moduleStore.get(moduleName).mod
          promiseArr.push(Promise.resolve(this._getRealMod({ moduleName, mod })))
          return
        }

        // if module is loading
        if (this.moduleStore.getStatus(moduleName) === LOADING) {
          const p = new Promise((resolve) => {
            // important: 当发现该模块已经在加载中的时候开启订阅，加载完成后触发该事件
            event.on(`__fetch_module_${moduleName}__`, (_mod) => {
              resolve(this._getRealMod({ moduleName, mod: _mod }))
            })
          })
          promiseArr.push(p)
          return
        }

        // if module not_load or loaded error or exected_err
        if (
          [NOT_LOAD, LOADED_ERR, EXECTED_ERR].indexOf(this.moduleStore.getStatus(moduleName)) > -1
        ) {
          this.moduleStore.setStatus(moduleName, LOADING)
          promiseArr.push(
            fetch(scriptSrc)
              .then((res) => {
                const sandbox = createSandbox(moduleName)
                sandbox.runScript(res)
                let mod = null
                if (sandbox.__TYPE__ === SandboxTypes.PROXY) {
                  mod = sandbox.proxy[moduleName]
                } else {
                  // TODO 如何避免插件名冲突 使用iife即可 但是还没研究明白
                  mod = window[moduleName]
                }
                if (!mod) {
                  const err = new Error(
                    `FetchLoader: 未获取到微组件模块，请检查模块名 ${moduleName} 是否正确`
                  )
                  this.moduleStore.setStatus(moduleName, EXECTED_ERR)
                  this.moduleStore.setError(moduleName, err)
                  throw err
                }

                // 加载自定义组件
                if (!mod.mount && !mod.component) {
                  const err = new Error(
                    'FetchLoader: 微组件需要暴露 mount 方法或 component 属性，请查看微组件开发文档'
                  )
                  this.moduleStore.setStatus(moduleName, EXECTED_ERR)
                  this.moduleStore.setError(moduleName, err)
                  throw err
                }

                this.moduleStore.set(moduleName, mod)
                event.emit(`__fetch_module_${moduleName}__`, mod)

                const cssSrc = scriptSrc.replace(/\.js$/, '.css')
                return this._fetchCss({ moduleName: cssSrc })
                  .then((styleArr) => {
                    const { styleText } = styleArr[0]
                    return this._getRealMod({ moduleName, mod, cssSrc, styleText })
                  })
                  .catch((cssErr) => {
                    console.error(`FetchLoader.fetchCss: `, cssErr)
                    return this._getRealMod({ moduleName, mod })
                  })
              })
              .catch((err) => {
                if (err.status) {
                  // fetch 报错 属于 loaded_err
                  const _err = new Error(`${err.status} ${err.statusText}`)
                  this.moduleStore.setStatus(moduleName, LOADED_ERR)
                  this.moduleStore.setError(moduleName, _err)
                  throw _err
                }
                // then 里面报错 属于 exected_err
                this.moduleStore.setStatus(moduleName, EXECTED_ERR)
                this.moduleStore.setError(moduleName, err)
                throw err
              })
          )
        }
      }
    })

    return Promise.all(promiseArr)
  }

  /**
   * fetch css
   * @param {Object} moduleData eg: { 'A': 'http://domain/index.css' }
   * @returns {Promise}
   */
  _fetchCss(moduleData) {
    const promiseArr = []
    Object.keys(moduleData).forEach((k) => {
      const url = moduleData[k]
      if (!/^https?/.test(url)) {
        promiseArr.push(Promise.reject(`FetchLoader.fetchCss: url '${url}' 格式不正确`))
      } else {
        promiseArr.push(fetch(url).then((res) => ({ styleText: res })))
      }
    })
    return Promise.all(promiseArr)
  }

  _getRealMod({ moduleName, mod, cssSrc, styleText }) {
    if (mod.mount) {
      const {
        NOT_MOUNTED,
        MOUNTING,
        MOUNTED,
        MOUNTED_ERR,

        UPDATING,
        UPDATED,
        UPDATED_ERR,

        UN_MOUNTING,
        UN_MOUNTED,
        UN_MOUNTED_ERR
      } = MountStatus
      let mountStatus = NOT_MOUNTED
      return {
        getStatus: () => mountStatus,
        mount: (container, payload = {}) => {
          if (mountStatus === MOUNTED) {
            console.warn(`you can't call mount after mounted!`)
            return
          }
          if (!container) throw new Error(`mount requires a container`)

          mountStatus = MOUNTING

          // 处理css并mount 保证css在js之前被mount
          const prefix = moduleName.split('_')[0] // 由于html属性不认下划线(_)和点(.) 所以去掉版本
          if (cssSrc && styleText) {
            const currentContainerTag = (container.tagName || '').toLowerCase()
            const prefixWithTag = `${currentContainerTag}[${getScopedCssPrefix(prefix)}]`
            process({
              container,
              styleText,
              prefix: prefixWithTag,
              cssSrc,
              styleIsolation: this.styleIsolation,
              ignoreStyleRuleArray: this.ignoreStyleRuleArray,
              store: this.moduleStore
            })
          } else {
            // use css cache
            const mod = this.moduleStore.get(moduleName)
            if (mod && mod.cssMod) {
              // 不能使用stylenode插入到新的容器 之前的stylenode会被移到新的容器
              const realStyleNode = document.createElement('style')
              container.appendChild(realStyleNode)
              realStyleNode.textContent = mod.cssMod.textContent
            }
          }

          try {
            const vm = mod.mount(genInnerContainer(container, prefix), {
              ...payload,
              event
            })
            mountStatus = MOUNTED
            return { vm, el: container }
          } catch (err) {
            mountStatus = MOUNTED_ERR
            console.error(`FetchLoader.mountCallError:`, err)
            return { el: container, error: err }
          }
        },
        unmount: () => {
          if (mountStatus !== MOUNTED && mountStatus !== UPDATED) {
            console.warn(`you can't call unmount before mounted!`)
            return
          }
          try {
            mountStatus = UN_MOUNTING
            const res = (mod.unmount || noop)()
            mountStatus = UN_MOUNTED
            return { status: 'ok', res }
          } catch (err) {
            mountStatus = UN_MOUNTED_ERR
            return { status: 'error', error: err }
          }
        },
        // 增加update方法，在自定义组件改变参数的时候调用
        // 在有了自定义组件属性面板，并修改属性面板的时候可以调用该方法
        update: () => {
          if (mountStatus !== MOUNTED && mountStatus !== UPDATED) {
            console.warn(`you can't call update before mounted!`)
            return
          }
          try {
            mountStatus = UPDATING
            const res = (mod.update || noop)()
            mountStatus = UPDATED
            return { status: 'ok', res }
          } catch (err) {
            mountStatus = UPDATED_ERR
            return { status: 'error', error: err }
          }
        }
      }
    }
    return mod
  }

  _handleError(err, fnName, errorCb) {
    if (errorCb) {
      errorCb(err)
    } else {
      console.error(`FetchLoader.${fnName}: `, err)
    }
  }
}

export { FetchLoader }
