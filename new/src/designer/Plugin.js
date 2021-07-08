// 插件扩展机制
const PLUGIN_SUPPORT = [
  '__components__',
  '__attr__',
  '__canvas__',
  '__toolbar__',
  '__componentTree__'
]

export class Plugin {
  constructor(config, designer) {
    this.config = config || {}
    this.__designer__ = designer
    this.plugins = new Map()
  }

  add(Plugin) {
    if (typeof Plugin !== 'function') {
      throw new Error('[designer] 插件请传递一个构造函数获类')
    }

    // if (!PLUGIN_SUPPORT.includes(Plugin.$type)) {
    //   throw new Error(`[designer] 插件必须为 ${PLUGIN_SUPPORT.toString()} 之一`)
    // }

    // TODO 需要注入到当前插件的依赖 比如 __toolbar__ 等
    // 通过 injector 注入依赖
    const arr = []
    for (const n of Plugin.$inject) {
      arr.push(this.__designer__[n])
    }

    // TODO 获取依赖，在这些依赖初始化之后才能new该插件
    this.plugins.set(Plugin.$name, {  p: new Plugin(...arr) })

    // TODO 其他组件的逻辑要先从plugins里获取 如果plugins里没有 再使用默认的
  }
}
