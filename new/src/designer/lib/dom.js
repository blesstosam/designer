/**
 * 通过 classname 向上查找最近的一个 dom 节点
 * @param {Element} dom
 * @param {string} classname
 * @returns {Element}
 */
export function lookupByClassName(dom, classname) {
  if (!dom || !dom.classList) return
  if (dom.classList.contains(classname)) return dom
  return lookupByClassName(dom.parentNode, classname)
}

/**
 * 通过 attr 向下查找最近的一个 dom 节点
 * @param {Element} dom
 * @param {string} attrname
 * @param {string} attrval? 如果有值进行比对 如果没有值只需要找到该属性即可
 * @returns {Element}
 */
export function lookdownByAttr(dom, attrname, attrval) {
  if (!dom || dom.nodeType !== 1) return
  if (attrval) {
    if (dom.getAttribute(attrname) === attrval) return dom
  } else {
    if (dom.getAttribute(attrname) != null) return dom
  }
  if (dom.children && dom.children.length) {
    for (let i = 0; i < dom.children.length; i++) {
      const _dom = lookdownByAttr(dom.children[i], attrname, attrval)
      // important: 一定要加 if 要不然 for 循环会断掉 直接返回 undefined
      if (_dom) return _dom
    }
  }
}

/**
 * 通过 attr 向下查找所有的dom节点
 * @param {Element} _dom
 * @param {string} _attrname
 * @param {string} _attrval? 如果有值进行比对 如果没有值只需要找到该属性即可
 * @returns {Element}
 */
export function lookdownAllByAttr(_dom, _attrname, _attrval) {
  const arr = []
  function getDom(dom, attrname, attrval) {
    if (!dom || dom.nodeType !== 1) return
    if (attrval) {
      if (dom.getAttribute(attrname) === attrval) arr.push(dom)
    } else {
      if (dom.getAttribute(attrname) != null) arr.push(dom)
    }
    if (dom.children && dom.children.length) {
      for (let i = 0; i < dom.children.length; i++) {
        getDom(dom.children[i], attrname, attrval)
      }
    }
  }
  getDom(_dom, _attrname, _attrval)
  return arr
}

/**
 * 向下查找最近的一个 attrname 不为空的 dom 节点，返回其 attr
 * @param {Element} dom
 * @param {string} attrname
 */
export function lookdownForAttr(dom, attrname) {
  if (!dom || dom.nodeType !== 1) return
  if (dom.getAttribute(attrname) != null) return dom.getAttribute(attrname)
  if (dom.children && dom.children.length) {
    for (let i = 0; i < dom.children.length; i++) {
      const attrval = lookdownForAttr(dom.children[i], attrname)
      if (attrval) return attrval
    }
  }
}

export function isElement(obj) {
  return typeof HTMLElement === 'object'
    ? obj instanceof HTMLElement
    : !!(
        obj &&
        typeof obj === 'object' &&
        (obj.nodeType === 1 || obj.nodeType === 9) &&
        typeof obj.nodeName === 'string'
      )
}

export function getStyle(el, key) {
  if (el.currentStyle) {
    return el.currentStyle[key]
  } else {
    return window.getComputedStyle(el, false)[key]
  }
}

class DomUtil {
  constructor(selector) {
    if (isElement(selector)) {
      this.dom = selector
    } else if (typeof selector === 'string') {
      if (selector.startsWith('<') && selector.endsWith('>')) {
        this.dom = document.createElement(selector.replace(/\<|\>/g, ''))
      } else {
        this.dom = document.querySelector(selector)
      }
    }
  }

  get el() {
    return this.dom
  }
  get firstElement() {
    return this.dom.children[0]
  }

  style(key, val) {
    if (typeof key === 'object') {
      Object.keys(key).forEach(k => {
        this.dom.style[k] = key[k]
      })
    } else {
      this.dom.style[key] = val
    }
    return this
  }
  getStyle(key) {
    return getStyle(this.dom, key)
  }
  removeStyle(key) {
    this.dom.style[key] = ''
    return this
  }

  attr(key, val) {
    if (typeof key === 'object') {
      Object.keys(key).forEach(k => {
        this.dom.setAttribute(k, key[k])
      })
    } else {
      this.dom.setAttribute(key, val)
    }

    return this
  }
  getAttr(key) {
    return this.dom.getAttribute(key)
  }

  addClass(cls) {
    this.dom.classList.add(cls)
    return this
  }
  removeClass(cls) {
    this.dom.classList.remove(cls)
    return this
  }

  text(txt) {
    this.dom.textContent = txt
    return this
  }

  html(str) {
    this.dom.innerHTML = str
    return this
  }

  show() {
    const display = this.dom.style['display']
    if (display === 'none') {
      this.dom.style.display = this._oldDisplay || 'block'
    }
    return this
  }

  hide() {
    const display = this.dom.style['display']
    if (display !== 'none') {
      this._oldDisplay = this.dom.style.display
      this.dom.style.display = 'none'
    }
    return this
  }

  hover(handlerIn, handlerOut) {
    this.addListener('mouseenter', handlerIn).addListener('mouseleave', handlerOut)
    return this
  }

  addListener(event, handler) {
    this.dom.addEventListener(event, handler)
    return this
  }

  // 将元素插入到当前子元素的末尾
  append(newNode) {
    this.dom.appendChild(newNode)
    return this
  }
  // 将元素插入到当前子元素的开头
  prepend(newNode) {
    this.dom.insertBefore(newNode, this.dom.childNodes[0])
    return this
  }
  // 将元素插入到当前元素的开头
  after(newNode) {
    const childNodes = this.dom.parentNode.childNodes
    if (!childNodes.length) {
      this.dom.parentNode.appendChild(newNode)
    } else {
      if (this.dom === childNodes[childNodes.length - 1]) {
        this.dom.parentNode.appendChild(newNode)
      } else {
        this.dom.nextSibling.before(newNode)
      }
    }
    return this
  }
  // 将元素插入到当前元素的末尾
  before(newNode) {
    this.dom.parentNode.insertBefore(newNode, this.dom)
    return this
  }
}

/**
 * @param {*} selector
 * @returns
 */
export function $(selector) {
  return new DomUtil(selector)
}
