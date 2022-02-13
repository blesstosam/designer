export function isPlainObject(obj) {
  return Object.prototype.toString.call(obj) === '[object Object]'
}

export function checkUriValid(uri) {
  // 包括 http://localhost
  const URI_REG =
    /^(https?:\/\/)([0-9a-z.]+)(:[0-9]+)?([/0-9a-z.]+)?(\?[0-9a-z&=]+)?(#[0-9-a-z]+)?/i
  return URI_REG.test(uri)
}

export function joinLink(prefix, suffix) {
  const index = prefix.length - 1
  if (prefix[index] === '/') {
    if (suffix[0] === '/') return prefix + suffix.slice(1)
    return prefix + suffix
  }
  if (suffix[0] === '/') return prefix + suffix
  return prefix + '/' + suffix
}

function genPublicPathVarName(plugId) {
  return '__DAVINCI_PUBLIC_PATH_' + plugId + '__'
}

export function setPublicPath(plugId, publicPath) {
  window[genPublicPathVarName(plugId)] = publicPath
}

export function getPublicPath(plugId) {
  return window[genPublicPathVarName(plugId)]
}
