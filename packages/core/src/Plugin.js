const PLUGIN_SUPPORT = [
  '__components__',
  '__attr__',
  '__canvas__',
  '__toolbar__',
  '__componentTree__'
]

// 插件类型, 只保留左侧菜单插件
export const PLUGIN_TYPES = {
  MENU_BAR: 'menuBar', // 左侧菜单栏插件，属于ui插件
  UI: 'ui' // 普通 ui 插件
}

export class Plugin {
  constructor(config, designer) {
    this.config = config || {}
    this.__designer__ = designer
    this.plugins = new Map()
  }

  register(Plugin) {
    if (typeof Plugin !== 'function') {
      throw new Error('[designer] 插件请传递一个构造函数或类')
    }

    if (!PLUGIN_SUPPORT.includes(Plugin.$name)) {
      const arr = []
      for (const n of Plugin.$inject) {
        arr.push(this.__designer__[n])
      }

      // TODO 获取依赖，在这些依赖初始化之后才能new该插件
      this.plugins.set(Plugin.$name, {
        p: new Plugin(...arr),
        type: Plugin.$type,
        name: Plugin.$name,
        deps: Plugin.$deps,
        container: Plugin.$container
      })
    } else {
      // TODO 如果要替换默认的组件
    }
  }
}
