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
 * 通过 tag attr 向下查找最近的一个 dom 节点
 * @param {Element} dom
 * @param {string} attrname
 * @param {string} attrval
 * @returns {Element}
 */
export function lookdownByAttr(dom, attrname, attrval) {
  if (!dom || dom.nodeType !== 1) return
  if (dom.getAttribute(attrname) === attrval) return dom
  if (dom.childNodes && dom.childNodes.length) {
    for (let i = 0; i < dom.childNodes.length; i++) {
      const _dom = lookdownByAttr(dom.childNodes[i], attrname, attrval)
      // important: 一定要加 if 要不然 for 循环会断掉 直接返回 undefined
      if (_dom) return _dom
    }
  }
}
