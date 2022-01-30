// css 沙箱
// 1. 不会改写 @import @page @keyframes
// 2. 如果dom超出container之外，样式会丢失，所以建议避免这种情况发生

// TODO
// 1. 主应用全局样式可能会插件样式 通过class
// ```
// .main { color: red } // 主应用样式
// <div class="main"></div> // 插件的dom，并且插件并没有实现该class的样式，所以直接就使用了主应用的样式
// ```

let swapNode = null

// https://developer.mozilla.org/zh-CN/docs/Web/API/CSSRule
const RuleTypes = {
  // type: 被改写的样式类型
  // selector { prop1: val1; prop2: val2; }
  STYLE: 1,
  // @media screen and (max-width: 300px) { selector { prop1: val1; prop2: val2; } }
  MEDIA: 4,
  // @supports (display: grid) { div { display: grid; } }
  SUPPORTS: 12,
  // 会将css的ip拼接上去
  // @font-face { font-family: Helvetica; }
  FONT_FACE: 5,

  // type: 不会被改写的类型
  // @import url("style.css") screen
  IMPORT: 3,
  // @page { margin: 1cm }  分页 用于打印
  PAGE: 6,
  // @keyframes slidein {from { transform: translateX(0%);} to { transform: translateX(100%); }}
  KEYFRAMES: 7,
  // 同上
  KEYFRAME: 8
}

// 因为像一些框架将modal/select的下拉框这种dom直接插入到body 置于container之外 如果添加scope将不起作用
// 所以对于上述提到的classname，不对其添加scope
// TODO 但是对于放到modal里的button之类常规组件，也会有该问题，目前没有解决办法
const whiteMap = {
  // element-ui
  '.el-select-dropdown': 1,
  '.el-popper': 1,
  '.el-scrollbar': 1,
  '.popper__arrow': 1,
  '.time-select': 1,
  '.time-select-item': 1,
  '.el-color-dropdown': 1,
  '.el-message': 1,
  '.el-message-box': 1,
  '.el-notification': 1,
  '.el-dialog': 1,
  '.el-popover': 1,
  '.el-popconfirm': 1,

  // vant
  '.van-overflow-hidden': 1,
  '.van-overlay': 1,
  '.van-popup': 1,
  '.van-calendar': 1,
  '.van-cascader': 1,
  '.van-dialog': 1,
  '.van-toast': 1,
  '.van-notify': 1
}
const whiteRegArr = [
  // elemrnt-ui
  /^\.el-select-dropdown/,
  /^\.el-scrollbar/,
  /^\.el-cascader/,
  /^\.el-picker/,
  /^\.el-data/,
  /^\.el-color/,
  /^\.el-message/,
  /^\.el-message-box/,
  /^\.el-notification/,
  /^\.el-dropdown/,
  /^\.el-dialog/,
  /^\.el-tooltip/,
  /^\.el-popover/,
  /^\.el-popconfirm/,

  // vant
  /^\.van-popup/,
  /^\.van-calendar/,
  /^\.van-cascader/,
  /^\.van-action/,
  /^\.van-dialog/,
  /^\.van-hairline/,
  /^\.van-toast/,
  /^\.van-notify/
]

function ruleStyle(rule, prefix) {
  const rootSelectorRE = /((html)|(body)|(:root))/g
  if (rootSelectorRE.test(rule.selectorText)) {
    return rule.cssText.replace(rootSelectorRE, prefix)
  }

  if (whiteMap[rule.selectorText] || whiteRegArr.find((r) => r.test(rule.selectorText))) {
    return rule.cssText
  }

  return `${prefix} ${rule.cssText}`
}

function ruleMedia(rule, prefix, relativeCssSrc, cssSrc) {
  const css = rewriteCss(rule.cssRules, prefix, relativeCssSrc, cssSrc)
  return `@media ${rule.conditionText} {${css}}`
}

function ruleSupport(rule, prefix, relativeCssSrc, cssSrc) {
  const css = rewriteCss(rule.cssRules, prefix, relativeCssSrc, cssSrc)
  return `@supports ${rule.conditionText} {${css}}`
}

/**
 *
 * @param {*} rule
 * @param {*} relativeCssSrc css相对路径
 * @param {*} cssSrc css绝对路径
 * @returns {string}
 */
export function ruleFontFace(rule, relativeCssSrc, cssSrc) {
  return rule.cssText.replace(/url\(\"(.*?)\"\)/g, (match, p1) => {
    if (p1) {
      // base 64 or 绝对路径
      if (/base64/.test(p1) || /^https?/.test(p1)) return `url("${p1}")`
      // 相对路径第一个字符为/
      if (p1[0] === '/') {
        return `url("${relativeCssSrc}${p1}")`
      }
      // 相对路径第一个字符不为/
      return `url("${getAbsolutePath(cssSrc, p1)}")`
    }
    return `url("${p1}")`
  })
}

export function rewriteCss(cssRules, prefixWithTag, relativeCssSrc, cssSrc) {
  let cssText = ''
  Object.keys(cssRules).forEach((k) => {
    const rule = cssRules[k]
    switch (rule.type) {
      case RuleTypes.STYLE:
        cssText += ruleStyle(rule, prefixWithTag)
        break
      case RuleTypes.MEDIA:
        cssText += ruleMedia(rule, prefixWithTag, relativeCssSrc, cssSrc)
        break
      case RuleTypes.SUPPORTS:
        cssText += ruleSupport(rule, prefixWithTag, relativeCssSrc, cssSrc)
        break
      case RuleTypes.FONT_FACE:
        cssText += ruleFontFace(rule, relativeCssSrc, cssSrc)
        break
      default:
        cssText += rule.cssText
        break
    }
  })
  return cssText
}

// 创建style标签插入到body里 作为一个中间style标签 作用是生成sheet 用来遍历
export function createStyleNode() {
  const styleNode = document.createElement('style')
  document.body.appendChild(styleNode)
  styleNode.sheet.disabled = true
  return styleNode
}

export function process({
  container,
  styleText,
  prefix,
  // important：cssSrc为css请求的完整url 需要通过该url解析出ip 拼上css中的font相对路径
  // 原因是 css 使用 fetch 加载之后，默认ip变成当前域的ip，而非css的ip，所以要手动处理一下
  cssSrc,
  styleIsolation = false,
  // 可以为classname或正则
  ignoreStyleRuleArray = [],
  store
}) {
  swapNode = swapNode || createStyleNode()
  swapNode.textContent = styleText
  swapNode.sheet.disabled = true

  ignoreStyleRuleArray.forEach((c) => {
    if (c instanceof RegExp) {
      whiteRegArr.push(c)
    } else if (typeof c === 'string') {
      whiteMap[c] = 1
    }
  })
  const css = styleIsolation
    ? rewriteCss(swapNode.sheet.cssRules, prefix, genPublicPath(cssSrc), cssSrc)
    : styleText
  // 插入一个新的stylenode到container里 ，放到里面是因为stylenode可以跟dom一起被移除
  const realStyleNode = document.createElement('style')
  container.appendChild(realStyleNode)
  realStyleNode.textContent = css

  // cache css module
  storeCssMod(store, cssSrc, css)

  // 如果 index.css 是个空文件，swapNode就没有子节点
  swapNode.firstChild && swapNode.removeChild(swapNode.firstChild)
  // 每次对swapNode的操作都要重新设置disabled
  swapNode.sheet.disabled = true
}

function storeCssMod(store, cssSrc, css) {
  // 添加缓存到store 必须创建一个新的 stylenode 因为插件dom节点有可能被移除
  const stylenode = document.createElement('style')
  stylenode.textContent = css
  store.setCssMod(getModuleName(cssSrc), stylenode)
}

export function genPublicPath(src) {
  const { pathname, protocol, host } = urlParse(src)
  // font的相对路径为 `${id}_${version}/fonts/xxx.ttf` 所以截取到这之前
  const rPathnameArr = pathname.split('/')
  const rPathname = rPathnameArr.slice(0, rPathnameArr.length - 2).join('/')
  // important: 末尾不带 /
  return `${protocol}//${host}${rPathname}`
}

// 通过绝对地址+相对路径算出 绝对地址
// eg: https://domain/lib/index.css + ../fonts/a.ttf => https://domain/fonts/a.ttf
export function getAbsolutePath(aPath, rPath) {
  const rPathArr = rPath.split('../')
  const upTimes = rPathArr.length - 1
  const { pathname, protocol, host } = urlParse(aPath)
  const rPathnameArr = pathname.split('/')
  const rPathname = rPathnameArr.slice(0, rPathnameArr.length - 1 - upTimes).join('/')
  return `${protocol}//${host}${rPathname}/${rPathArr.pop()}`
}

export function getModuleName(src) {
  const r = src.split('/')
  return r[r.length - 2]
}

function urlParse(url) {
  const link = document.createElement('a')
  link.href = url
  let pathname = link.pathname
  if (/^\//.test(pathname) === false) {
    pathname = '/' + pathname
  }
  return {
    pathname,
    protocol: link.protocol,
    host: link.host,
    port: link.port,
    hostname: link.hostname,
    hash: link.hash,
    search: link.search,
    href: url
  }
}
