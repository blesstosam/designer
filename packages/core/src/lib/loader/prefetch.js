/**
 * https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/link
 * 缺点：当用户禁用浏览器缓存时该方法失效
 * @param {*} url
 * @param {*} linkAs script|fetch
 * @returns
 */
 export function prefetcher(url, linkAs) {
  return new Promise((resolve, reject) => {
    const link = document.createElement('link')
    link.rel = 'prefetch'
    link.href = url
    link.as = linkAs
    link.crossorigin = 'anonymous'

    link.onload = resolve
    link.onerror = reject

    document.head.appendChild(link)
  })
}

// 使用 requestIdleCallback 配合 fetch 进行预加载
export function idlePrefetch() {
  // todo 怎么检测浏览器是否关闭缓存
}

/**
 * polyfill/shim for the `requestIdleCallback` and `cancelIdleCallback`.
 * https://github.com/pladaria/requestidlecallback-polyfill/blob/master/index.js
 */
export const requestIdleCallback =
  window.requestIdleCallback ||
  function (cb) {
    const start = Date.now()
    return setTimeout(() => {
      cb({
        didTimeout: false,
        timeRemaining() {
          return Math.max(0, 50 - (Date.now() - start))
        }
      })
    }, 1)
  }

export const cancelIdleCallback =
  window.cancelIdleCallback ||
  function (id) {
    clearTimeout(id)
  }
