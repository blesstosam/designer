// 参考链接1 https://segmentfault.com/a/1190000018425747?utm_source=sf-related
// 参考链接2 https://segmentfault.com/a/1190000020463234

// 一：沙箱的目的：让插件安全，稳定，高效的运行
// 1. 防止第三方的恶意代码，比如防止恶意篡改全局变量
//    -- 浏览器本身 window, self(window), globalThis(window), top(window), parent(window), document, location
//    -- 被暴露的框架，库变量 Vue, Element, Vuex, $, jQuery, BScroll, _
//    -- 普通的全局变量 globalConfig, $AY, AY, AYdialogs, AYlayer, AYmodalDialogs, Assets, ssrAssets
// 2. 防止第三方代码对全局环境的污染，比如第三方代码和平台，多个第三方代码之间的代码操作同一个数据，造成代码报错或非预期效果
//    由于代码的全局作用域被劫持，第三方对全局作用域的修改全部被限制在局部作用域内 这样问题就解决了
// 3. 每个插件都跑在不同的沙箱实例里 在 mount 阶段准备沙箱；在 unmount 阶段销毁沙箱 并清理全局状态
// 4. 稳定 - 插件不能拖慢 qycloud

// 二：使用 (new Funciton/eval)+with(可选，作用为劫持全局作用域)+Proxy 只能实现有限的沙箱
// "有限"的本质是因为第三方代码和当前应用的代码运行在同一个线程
// 1. 不能防止别人通过 ({}).__proto__ 来访问变量的原型对象，该hack方法被成为沙箱逃逸
//    可以通过freeze掉原型对象 防止对原型对象的篡改
// 2. 对于不支持 Proxy 的浏览器，使用 defineProperty 来修改 configurable & writable 为 false
// 3. 不能防止别人写的死循环代码来导致程序卡死 比如 while(true) {}

export const SandboxTypes = {
  PROXY: 'proxy',
  DEFINE_PROPERTY: 'defineProperty'
}

// TODO 这些全局变量因为无法被重新给 可以不用受with影响?? 这些变量明明可以被重写啊！
const UNSCOPABLES = {
  undefined: true,
  Array: true,
  Object: true,
  String: true,
  Boolean: true,
  Math: true,
  Number: true,
  Symbol: true,
  parseFloat: true,
  Float32Array: true
}
const FREEZE_GLOBAL_VAR_LIST = [
  'Vue',
  'Vuex',
  'ELEMENT',
  '$',
  'jQuery',
  'BScroll',
  '_',
  'globalConfig',
  '$AY',
  'AY',
  'AYdialogs',
  'AYlayer',
  'AYmodalDialogs',
  'Assets',
  'ssrAssets'
]
// 从沙箱逃逸的属性
const whiteList = [
  // System.js used a indirect call with eval, which would make it scope escape to global
  'System',
  // https://github.com/systemjs/systemjs/blob/457f5b7e8af6bd120a279540477552a07d5de086/src/instantiate.js#L357
  '__cjsWrapper',
  // webpack 使用 webpackJsonp_name_ 来记录 code spliting 出去的代码
  'webpackJsonp_name_'
]
let activeSandboxCount = 0
class ProxySandbox {
  constructor(name) {
    this.name = name
    this.__IS_DESIGN_PLUGIN_SANDBOX__ = true
    this.__TYPE__ = SandboxTypes.PROXY
    // 用于保存沙箱内代码修改过的全局变量
    this.updatedValSet = new Set()
    this.sandboxRunning = true
    this.proxy = this.createProxy()
    // freezePrototype()
  }

  active() {
    if (!this.sandboxRunning) activeSandboxCount++
    this.sandboxRunning = true
  }

  /**
   * 在最后一个沙箱关闭前
   * 删除所有白名单里的全局状态
   * 解除冻结的原型对象
   * 如果是冻结全局变量，则需要解除这些冻结
   */
  inactive() {
    // TODO: 但是如果先打开proxy1，再打开proxy2，然后proxy2.a = 1，
    // 然后关闭proxy2，再关闭proxy1，这样window.a就不能被清理掉了
    if (--activeSandboxCount === 0) {
      // 把白名单里的属性删除，如果有的话
      whiteList.forEach((k) => {
        if (this.proxy.hasOwnProperty(k)) {
          delete window[k]
        }
      })
    }
    this.sandboxRunning = false
  }

  runScript(src) {
    if (this.sandboxRunning) {
      // TODO 如果要加hook可以参考 html-import-entry 的写法
      // https://github.com/kuitos/import-html-entry/blob/master/src/index.js#L158
      const fn = new Function(
        'sandbox',
        `try {
          with(sandbox){;${src}}
        } catch(e) {
          console.error('[plugin-sandbox: ${this.name}] catch error: ')
          throw e
        }`
      )
      // 用 proxy 代替函数里的 this 防止 this 访问 window
      fn.call(this.proxy, this.proxy)
    }
  }

  createProxy() {
    const rawWindow = window
    const { fakeWindow, propertiesWithGetter } = createFakeWindow(window)
    const { updatedValSet, sandboxRunning } = this
    const descriptorTargetMap = new Map()
    const hasOwnProperty = (key) => fakeWindow.hasOwnProperty(key) || rawWindow.hasOwnProperty(key)

    const proxy = new Proxy(fakeWindow, {
      // trap for `in` operator
      // 但是使用 window.xxx 还是会走到has里来 ???
      has(target, key) {
        // console.log('in has =>  ', target, key)
        return key in UNSCOPABLES || key in target || key in rawWindow
      },
      get: (target, key) => {
        // Symbol.unscopables: https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Symbol/unscopables
        // TODO key 有时为 Symbol.unscopables ???
        // console.log('in get =>', target, key, target[Symbol.unscopables])
        if (key === Symbol.unscopables) return UNSCOPABLES

        // 避免直接使用 window.xxx/self.xxx/globalThis.xxx 来修改全局属性
        if (key === 'window' || key === 'self' || key === 'globalThis') return proxy

        // https://developer.mozilla.org/zh-CN/docs/Web/API/Window/parent
        // window.parent => 返回当前窗口的父窗口对象 如果一个窗口没有父窗口,则它的 parent 属性为自身的引用
        // window.top => 返回窗口层级最顶层窗口的引用 如果一个窗口没有父窗口,则它的 top 属性为自身的引用
        if (key === 'top' || key === 'parent') {
          // 如果当前窗口没有父窗口
          if (rawWindow === rawWindow.parent) return proxy
          // 如果有父窗口 即 window.top 和 当前 window 通过 iframe 隔离，可以放出沙箱
          return rawWindow[key]
        }

        if (key === 'hasOwnProperty') return hasOwnProperty

        // document/window/location/top 这个属性是通过getter获取 如果使用 target[key] 会报 Illegal invocation
        let val = null
        if (propertiesWithGetter.has(key)) {
          val = rawWindow[key]
        } else if (key in target) {
          // 说明是插件新加的属性
          val = target[key]
        } else {
          // 如果target上找不到则从window上找
          if (FREEZE_GLOBAL_VAR_LIST.indexOf(key) === -1) {
            val = rawWindow[key]
          }
        }
        return val
      },
      set: (target, key, val) => {
        // console.log('in set...', key, val)
        if (sandboxRunning) {
          // 1. fakeWindow有，window有    => 说明是用户自己加上的
          // 2. fakeWindow有，window没有   => 说明是用户自己加上的
          // 3. fakeWindow没有，window有   => 试图修改window上的原始属性
          // 4. fakeWindow没有，window没有  => 说明是用户自己加上的
          if (target.hasOwnProperty(key) && rawWindow.hasOwnProperty(key)) {
            // 将 set 操作移到 fakeWindow 上
            target[key] = val
          } else if (target.hasOwnProperty(key) && !rawWindow.hasOwnProperty(key)) {
            target[key] = val
          } else if (!target.hasOwnProperty(key) && rawWindow.hasOwnProperty(key)) {
            // console.warn(`who is trying change ${target[key]} to ${val}`);
            const descriptor = Object.getOwnPropertyDescriptor(rawWindow, key)
            const { writable, configurable, enumerable } = descriptor || {}
            // 防止 strict-mode 报错
            if (writable) {
              Object.defineProperty(target, key, {
                configurable,
                enumerable,
                writable,
                value: val
              })
            }
          } else {
            target[key] = val
          }

          if (whiteList.indexOf(key) > -1) {
            rawWindow[key] = val
          }

          updatedValSet.add(key)
        }

        // 防止 strict-mode 抛出错误
        return true
      },

      // delete proxy[foo] 和 delete proxy.foo
      deleteProperty(target, key) {
        if (target.hasOwnProperty(key)) {
          delete target[key]
          updatedValueSet.delete(key)
        }

        return true
      },
      getOwnPropertyDescriptor(target, p) {
        if (target.hasOwnProperty(p)) {
          const descriptor = Object.getOwnPropertyDescriptor(target, p)
          descriptorTargetMap.set(p, 'target')
          return descriptor
        }

        if (rawWindow.hasOwnProperty(p)) {
          const descriptor = Object.getOwnPropertyDescriptor(rawWindow, p)
          descriptorTargetMap.set(p, 'rawWindow')
          // A property cannot be reported as non-configurable, if it does not exists as an own property of the target object
          if (descriptor && !descriptor.configurable) {
            descriptor.configurable = true
          }
          return descriptor
        }

        return undefined
      },
      // trap for Object.getOwnPropertyNames(),Object.getOwnPropertySymbols(),Object.keys(),Reflect.ownKeys()
      ownKeys(target) {
        const keys = uniq(Reflect.ownKeys(rawWindow).concat(Reflect.ownKeys(target)))
        return keys
      },
      defineProperty(target, p, attributes) {
        const from = descriptorTargetMap.get(p)
        /*
         Descriptor must be defined to native window while it comes from native window via Object.getOwnPropertyDescriptor(window, p),
         otherwise it would cause a TypeError with illegal invocation.
         */
        switch (from) {
          case 'rawWindow':
            return Reflect.defineProperty(rawWindow, p, attributes)
          default:
            return Reflect.defineProperty(target, p, attributes)
        }
      }
    })

    // https://github.com/facebook/react/issues/16606 针对浏览器实现的api 避免TypeError
    // firefox: TypeError: xxx called on an object that does not implement interface Window.
    // chrome: TypeError: Illegal invocation
    const obj = {
      // eval: (code) => {
      //   return this.runScript(code)
      // },
      alert: alert.bind(window),
      confirm: confirm.bind(window),
      prompt: prompt.bind(window),
      open: open.bind(window),
      close: close.bind(window),
      print: print.bind(window),
      postMessage: postMessage.bind(window),
      fetch: fetch.bind(rawWindow),
      focus: focus.bind(window),
      setTimeout: setTimeout.bind(window),
      clearTimeout: clearTimeout.bind(window),
      setInterval: setInterval.bind(window),
      clearInterval: clearInterval.bind(window),
      requestAnimationFrame: requestAnimationFrame.bind(window),
      cancelAnimationFrame: cancelAnimationFrame.bind(window),
      addEventListener: addEventListener.bind(window),
      removeEventListener: removeEventListener.bind(window),
      matchMedia: matchMedia.bind(window),
      queueMicrotask: queueMicrotask.bind(window),
      getComputedStyle: getComputedStyle.bind(window),
      getSelection: getSelection.bind(window),
      resizeBy: resizeBy.bind(window),
      resizeTo: resizeTo.bind(window),
      scroll: scroll.bind(window),
      scrollBy: scrollBy.bind(window),
      scrollTo: scrollTo.bind(window)
    }
    for (const k in obj) {
      proxy[k] = obj[k]
    }
    // important: 这三个api safari 不支持，所以需要判断
    if (typeof window.createImageBitmap !== 'undefined')
      proxy['createImageBitmap'] = createImageBitmap.bind(window)
    if (typeof window.requestIdleCallback !== 'undefined')
      proxy['requestIdleCallback'] = requestIdleCallback.bind(window)
    if (typeof window.cancelIdleCallback !== 'undefined')
      proxy['cancelIdleCallback'] = cancelIdleCallback.bind(window)

    activeSandboxCount++
    return proxy
  }
}

class Sandbox {
  constructor(name, freezeList) {
    this.name = name
    this.__IS_DESIGN_PLUGIN_SANDBOX__ = true
    this.__TYPE__ = SandboxTypes.DEFINE_PROPERTY
    this.freezeList = freezeList
    // freezePrototype()
    freezeGlobalVar(freezeList)
  }

  /**
   * @param {string} src 代码
   */
  runScript(src) {
    const fn = new Function(
      `try {
        ;${src}
      } catch(e) {
        console.error('[plugin-sandbox: ${this.name}] catch error: ')
        throw e
      }`
    )
    fn.call(window)
  }
}

/**
 * 冻结部分全局变量
 * - 浏览器本身 这些变量只有 globalThis & parent 是可写的，只需要处理这两个即可  window, self(window), globalThis(window), top(window), parent(window), document, location
 * - 被暴露的框架，库变量 Vue, Element, Vuex, $, jQuery, BScroll, _
 * - 普通的全局变量 globalConfig, $AY, AY, AYdialogs, AYlayer, AYmodalDialogs, Assets, ssrAssets
 */
function freezeGlobalVar(freezeList = []) {
  if (window.__GLOBAL_VAR_FREEZED__) return window
  const rawObjectDefineProperty = Object.defineProperty
  const mergedList = FREEZE_GLOBAL_VAR_LIST.concat(freezeList)
  mergedList.forEach((k) => {
    // 只需要劫持window，self等是对window的引用
    const descriptor = Object.getOwnPropertyDescriptor(window, k)
    if (descriptor && descriptor.configurable) {
      // 不能将 configurable 修改为 false 否则无法解冻
      // descriptor.configurable = false;
      const hasGetter = Object.prototype.hasOwnProperty.call(descriptor, 'get')
      // parent 属性是 getter/setter 设置的 修改 writable 属性会报错
      // Uncaught TypeError: property descriptors must not specify a value or be writable when a getter or setter has been specified
      if (!hasGetter) {
        descriptor.writable = false
      }
      rawObjectDefineProperty(window, k, descriptor)
    }
  })
  window.__GLOBAL_VAR_FREEZED__ = true
}

/**
 * 防止对原型对象的篡改（暂时不用）
 * vue2 会改写 Array 的实例方法 所以该方法不能在 vue 执行之前调用
 * 还有其他框架如果有类似操作 也会报错
 */
function freezePrototype() {
  // 解冻参考 https://stackoverflow.com/questions/19293321/opposite-of-object-freeze-or-object-seal-in-javascript/26752410#26752410
  if (Object.isFrozen(String.prototype)) return
  const freezeList = [
    'Object',
    'Array',
    'Function',
    'String',
    'Number',
    'Symbol',
    'Map',
    'Set',
    'WeakMap',
    'WeakSet'
  ]
  freezeList.forEach((k) => {
    if (window[k].prototype) {
      Object.freeze(window[k].prototype)
    }
  })
}

function createFakeWindow(global) {
  const rawObjectDefineProperty = Object.defineProperty
  const propertiesWithGetter = new Map()
  const fakeWindow = {}

  Object.getOwnPropertyNames(global)
    .filter((p) => {
      // 筛选不可修改描述符的属性 chrome 有以下几个
      // "Infinity"
      // "NaN"
      // "undefined"
      // "window"
      // "document"
      // "location"
      // "top"
      // "chrome"
      const descriptor = Object.getOwnPropertyDescriptor(global, p)
      return descriptor && !descriptor.configurable
    })
    .forEach((p) => {
      const descriptor = Object.getOwnPropertyDescriptor(global, p)
      if (descriptor) {
        // 是否有get属性
        const hasGetter = Object.prototype.hasOwnProperty.call(descriptor, 'get')

        // 修改部分特殊属性为可修改
        /*
       make top/self/window property configurable and writable, otherwise it will cause TypeError while get trap return.
       see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy/handler/get
       > The value reported for a property must be the same as the value of the corresponding target object property if the target object property is a non-writable, non-configurable data property.
       */
        if (p === 'top' || p === 'parent' || p === 'self' || p === 'window') {
          // 属性可delete，属性可修改其描述符
          descriptor.configurable = true
          /*
         The descriptor of window.window/window.top/window.self in Safari/FF are accessor descriptors, we need to avoid adding a data descriptor while it was
         Example:
          Safari/FF: Object.getOwnPropertyDescriptor(window, 'top') -> {get: function, set: undefined, enumerable: true, configurable: false}
          Chrome: Object.getOwnPropertyDescriptor(window, 'top') -> {value: Window, writable: false, enumerable: true, configurable: false}
         */
          if (!hasGetter) {
            // 属性可修改
            descriptor.writable = true
          }
        }

        // 记录可访问属性
        if (hasGetter) propertiesWithGetter.set(p, true)

        // 将属性绑定到新对象上，并冻结
        // freeze the descriptor to avoid being modified by zone.js
        // see https://github.com/angular/zone.js/blob/a5fe09b0fac27ac5df1fa746042f96f05ccb6a00/lib/browser/define-property.ts#L71
        rawObjectDefineProperty(fakeWindow, p, Object.freeze(descriptor))
      }
    })
  // console.log(fakeWindow, propertiesWithGetter, 1)
  return {
    fakeWindow,
    propertiesWithGetter
  }
}

function uniq(array) {
  const o = Object.create(null)
  return array.filter((element) => {
    return element in o ? false : (o[element] = true)
  })
}

export function createSandbox(name, freezeList) {
  if (window.Proxy) {
    return new ProxySandbox(name)
  }
  return new Sandbox(name, freezeList)
}
