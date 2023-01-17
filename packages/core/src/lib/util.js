export function typeOf(obj) {
  const toString = Object.prototype.toString
  const map = {
    '[object Boolean]': 'boolean',
    '[object Number]': 'number',
    '[object String]': 'string',
    '[object Function]': 'function',
    '[object Array]': 'array',
    '[object Date]': 'date',
    '[object RegExp]': 'regExp',
    '[object Undefined]': 'undefined',
    '[object Null]': 'null',
    '[object Object]': 'object'
  }
  return map[toString.call(obj)]
}

export function forEach(obj, cb) {
  Object.keys(obj).forEach(k => cb(obj[k], k))
}

export function randomString(len) {
  len = len || 8
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  const maxPos = chars.length
  let str = ''
  for (let i = 0; i < len; i++) {
    str += chars.charAt(Math.floor(Math.random() * maxPos))
  }
  return str
}

export function makeLogger(prefix) {
  return function(...arg) {
    console.log(`${prefix}`, ...arg)
  }
}

export function isPlainObject(obj) {
  return Object.prototype.toString.call(obj) === '[object Object]'
}

/**
 * 防抖函数
 */
export function debounce(func, delay) {
  let timer
  return function(...args) {
    if (timer) {
      window.clearTimeout(timer)
    }

    timer = window.setTimeout(() => {
      func.apply(this, args)
    }, delay)
  }
}

/**
 * 截流函数
 */
export function throttle(func, timeFrame) {
  let lastTime = 0
  return function(...args) {
    let now = new Date()
    if (now - lastTime >= timeFrame) {
      func(...args)
      lastTime = now
    }
  }
}

// fromIndex && toIndex 要>=0
export function arrayMoveMutable(array, fromIndex, toIndex) {
  if (fromIndex >= 0 && fromIndex < array.length) {
    const [item] = array.splice(fromIndex, 1)
    array.splice(toIndex, 0, item)
  }
}





/**
 * 在画布里移动元素的几种情况
 * 1.  wrap to wrap
 * 2.1 inner to inner（same container）
 * 2.2 inner to inner（other container）
 * 3.  inner to wrap
 */

// 1
// +-------------+        +-------------+
// | +---------+ |        | +---------+ |
// | |    A    | |        | |    B    | |
// | +---------+ |        | +---------+ |
// | +---------+ |   =>   | +---------+ |
// | |    B    | |        | |    A    | |
// | +---------+ |        | +---------+ |
// |             |        |             |
// +-------------+        +-------------+

// 2.1
// +-------------------+      +-------------------+ 
// | +---------------+ |      | +---------------+ | 
// | |  +---------+  | |      | |  +---------+  | | 
// | |  |    B    |  | |      | |  |    C    |  | |
// | |  +---------+  | |      | |  +---------+  | |
// | |A +---------+  | |  =>  | |A +---------+  | | 
// | |  |    C    |  | |      | |  |    B    |  | |
// | |  +---------+  | |      | |  +---------+  | |
// | +---------------+ |      | +---------------+ |
// |                   |      |                   |
// +-------------------+      +-------------------+

// 2.2
// +-------------------+      +-------------------+ 
// | +---------------+ |      | +---------------+ | 
// | |  +---------+  | |      | |               | | 
// | |A |    B    |  | |      | |       A       | |
// | |  +---------+  | |      | |               | | 
// | +---------------+ |      | +---------------+ |
// | +---------------+ |      | +---------------+ | 
// | |       C       | |  =>  | |  +---------+  | |
// | +---------------+ |      | |C |    B    |  | | 
// |                   |      | |  +---------+  | |  
// |                   |      | +---------------+ |  
// |                   |      |                   |
// +-------------------+      +-------------------+

// 3
// +-------------------+      +-------------------+
// | +---------------+ |      | +---------------+ | 
// | |  +---------+  | |      | |               | | 
// | |A |    B    |  | |      | |       A       | |
// | |  +---------+  | |      | |               | | 
// | +---------------+ |  =>  | +---------------+ |
// |                   |      | +---------------+ | 
// |                   |      | |       B       | |
// |                   |      | +---------------+ | 
// |                   |      |                   |
// +-------------------+      +-------------------+