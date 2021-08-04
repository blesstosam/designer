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
<<<<<<< HEAD
=======
  console.log(timeFrame)
>>>>>>> d486ab01ecf7440696f82e13b807659d4b0cee82
  let lastTime = 0
  return function(...args) {
    let now = new Date()
    if (now - lastTime >= timeFrame) {
      func(...args)
      lastTime = now
    }
  }
}
