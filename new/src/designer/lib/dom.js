/**
 * 通过 classname 向上查找 最近的一个 dom 节点
 * @param {Element} dom
 * @returns {Element}
 */
export function lookupByClassName(dom, classname) {
  if (!dom || !dom.classList) return;
  if (dom.classList.contains(classname)) return dom;
  return lookupByClassName(dom.parentNode, classname);
}
