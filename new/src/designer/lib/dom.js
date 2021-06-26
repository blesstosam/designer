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
 * @param {string} attrval
 * @returns {Element}
 */
export function lookdownByAttr(dom, attrname, attrval) {
  if (!dom || dom.nodeType !== 1) return
  if (dom.getAttribute(attrname) === attrval) return dom
  if (dom.children && dom.children.length) {
    for (let i = 0; i < dom.children.length; i++) {
      const _dom = lookdownByAttr(dom.children[i], attrname, attrval)
      // important: 一定要加 if 要不然 for 循环会断掉 直接返回 undefined
      if (_dom) return _dom
    }
  }
}

/**
 * 向下查找最近的一个 attrname 不为空的 dom 节点，返回其 attr
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

  addClass(cls) {
    this.dom.classList.add(cls)
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

}

/**
 * @param {*} selector 
 * @returns 
 */
export function $(selector) {
  return new DomUtil(selector)
}

export function isElement(obj) {
  return (typeof HTMLElement === 'object')
    ? (obj instanceof HTMLElement)
    : !!(obj && typeof obj === 'object' && (obj.nodeType === 1 || obj.nodeType === 9) && typeof obj.nodeName === 'string');
}
