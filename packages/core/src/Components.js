import { FetchLoader } from './lib/loader'
import { lookupByClassName, $ } from './lib/dom'
import { EVENT_TYPES } from './Event'

// 1. 组件 VBlock; 渲染层 genVueInstance
// 2. 组件 RBlock; 渲染层 genReactInstance
// 3. 纯js JBlock; 渲染层 实现一下响应式
// 将 patch render改为直接修改 node.props

const COMPONENT_EL_CLS = 'component-item'

// 物料的几种形态
// 组件：最小单元
// 组件库：比如element-plus这种组件库，里面是一组组件库
// 区块：一系列组件的组合
// 模板：一系列区块的组合
export const MaterialTypes = {
  Component: 'component',
  ComponentLib: 'component-lib',
  Block: 'block',
  Template: 'template'
}

// 组件从功能维度划分
export const ComponentTypes = {
  LAYOUT: 'layout', // 布局组件
  VIEW: 'view', // 视图组件
  FORM: 'form' // 表单组件
}

// 组件使用什么框架写的
export const FrameWorkTypes = {
  Vue: 'vue',
  Vue3: 'vue3',
  React: 'react'
}

/**
 * 组件提供了注册，绑定事件等方法
 * 视图根据用户自己的选择定制通过重写 init 方法
 */
export class Components {
  constructor(config, designer) {
    this.name = '__components__'
    this.config = config || {}
    this.__designer__ = designer
    this._hasRegistered = []
    this.loader = null
  }

  get __dragon__() {
    return this.__designer__.__dragon__
  }

  get __componentTree__() {
    return this.__designer__.__componentTree__
  }

  get __util__() {
    return this.__designer__.__util__
  }

  get registeredComponents() {
    return this._hasRegistered
  }

  init(renderUI) {
    this.uiInstance = renderUI()
    this.uiInstance.__designer__ = this.__designer__
    this.$wrapEl = this.uiInstance.$el.parentNode
    this.__designer__.emit(EVENT_TYPES.COMPONENTS_INITED)
  }

  triggerUIInit() {
    this.__designer__.emit(EVENT_TYPES.COMPONENTS_UI_INITED)
  }

  // 给组件绑定数据和事件
  _bindEvent(target) {
    this.__dragon__.onDragStart(target, ({ $event: e, setData }) => {
      console.log('drag start...')
      const $componentItem = lookupByClassName(e.target, COMPONENT_EL_CLS)
      setData('data', this.findComByName($componentItem.getAttribute('com-name')) || {})
      this.__designer__.emit(EVENT_TYPES.COMPONENTS_DRAG_START)
    })

    this.__dragon__.onDragEnd(target, () => {
      console.log('drag end...')
    })
  }

  /**
   * 同步注册左侧组件
   * 主要是给组件dom绑定一些属性和事件
   * @param {*} comEl
   * @param {*} com
   * @returns
   */
  registerComponent(comEl, com) {
    $(comEl)
      .attr('draggable', true)
      .attr('is-block', !!com.isBlock)
      .attr('component-type', com.componentType)
      .addClass(COMPONENT_EL_CLS)

    this._bindEvent(comEl)
    if (com.materialType === MaterialTypes.Component) {
      if (com.framework === FrameWorkTypes.Vue3) {
        const realCom = this.vue3Util(com)
        this._hasRegistered.push(realCom)
        return realCom
      }
    } else {
      // handle block/template
    }
    this._hasRegistered.push(com)
    return com
  }

  /**
   * 异步注册组件
   * @param {Array} modArr
   *   comEl 组件所在dom
   *   com   组件
   */
  registerAsyncComponents(modArr) {
    const pArr = []
    for (const mod of modArr) {
      const {
        comEl,
        com: { name, version, url, title, icon }
      } = mod
      this.loader = this.loader || new FetchLoader({ styleIsolation: true })
      pArr.push(
        new Promise((reslove, reject) => {
          this.loader.fetch(
            {
              [`${name}_${version}`]: url
            },
            (mod) => {
              const realCom = {
                name,
                title,
                icon,
                accept: [],
                isCustom: true,
                customData: {
                  name,
                  version,
                  url
                },
                // TODO 属性面板怎么处理
                attrs: {},
                render() {
                  // vm 是指微组件实例
                  const { el, vm } = mod.mount(document.createElement('div'))
                  // this.vm = vm
                  return el
                }
              }
              this.registerComponent(comEl, realCom)
              reslove({
                comEl,
                com: realCom
              })
            },
            (err) => {
              console.error('fetch custom plugin errror: ', err)
              reject(err)
            }
          )
        })
      )
    }

    return Promise.resolve(Promise.all(pArr))
  }

  // 将一个纯 Vue 组件对象转化为一个设计器组件
  vue2Util(com) {
    const Vue2 = this.__util__.get('Vue2')
    if (!Vue2) {
      throw new Error('Util.Vue2 is not found')
    }
    return {
      ...com,
      render() {
        const vm = new Vue2(com.component).$mount(document.createElement('div'))
        return vm.$el
      }
    }
  }

  vue3Util(com) {
    const createApp = this.__util__.get('createApp')
    if (!createApp) {
      throw new Error('Util.createApp is not found')
    }
    return {
      ...com,
      render() {
        const vm = createApp(com.component).mount(document.createElement('div'))
        return vm.$el
      }
    }
  }

  reactUtil() {}

  findComByName(name) {
    return this._hasRegistered.find((c) => c.name === name)
  }

  renderComponent() {
    // TODO 是否将render相关逻辑从canvas里抽出来
  }
}
