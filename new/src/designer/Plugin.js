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

  add(name, Plugin) {
    if (typeof plPluginugin !== 'function') {
      throw new Error('[designer] 插件请传递一个构造函数')
    }
    if (!PLUGIN_SUPPORT.includes(name)) {
      throw new Error(`[designer] 插件名必须为 ${PLUGIN_SUPPORT.toString()} 之一`)
    }
    // TODO 参考 bpmnjs 怎么做的
    this.plugins.set(name, new Plugin(this.config, designer))

    // TODO 其他组件的逻辑要先从plugins里获取 如果plugins里没有 再使用默认的

    // TODO 需要注入到当前插件的依赖 比如 __toolbar__ 等
    const $inject = Plugin.$inject
  }
}
