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
      throw new Error('[designer] 插件请传递一个构造函数或类')
    }

    // 如果不是几个替换默认的组件
    if (!PLUGIN_SUPPORT.includes(Plugin.$name)) {
      // TODO 通过 injector 注入依赖
      const arr = []
      for (const n of Plugin.$inject) {
        arr.push(this.__designer__[n])
      }

      // TODO 获取依赖，在这些依赖初始化之后才能new该插件
      this.plugins.set(Plugin.$name, { p: new Plugin(...arr) })
    } else {
      // TODO 如果要替换默认的组件

    }
  }
}
