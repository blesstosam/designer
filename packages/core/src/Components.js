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
  Component: 'Component',
  ComponentLib: 'ComponentLib',
  Block: 'Block',
  Template: 'Template'
}

// 从功能维度划分
export const ComponentTypes = {
  LAYOUT: 'layout', // 布局组件
  VIEW: 'view', // 视图组件
  FORM: 'form' // 表单组件
}

// 组件使用什么框架写的
export const FrameWorkTypes = {
  Vue: 'Vue',
  Vue2: 'Vue2',
  React: 'React',
  WebComponent: 'WebComponent'
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

  get registeredComponents() {
    return this._hasRegistered
  }

  init(renderUI) {
    this.uiInstance = renderUI()
    this.uiInstance.__designer__ = this.__designer__
    // this.wrapEl = this.uiInstance.$el.parentNode
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
      .attr('component-type', com.componentType)
      .addClass(COMPONENT_EL_CLS)

    this._bindEvent(comEl)
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
                componentName: name,
                title,
                icon,
                isCustom: true,
                customData: {
                  name,
                  version,
                  url
                },
                // TODO 属性面板怎么处理需要加载自定义组件的描述文件
                attrs: {},
                render() {
                  // vm 是指微组件实例
                  const { el, vm } = mod.mount(document.createElement('div'))
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

  findComByName(name) {
    return this._hasRegistered.find((c) => c.componentName === name)
  }

  renderComponent() {
    // TODO 是否将render相关逻辑从canvas里抽出来
  }
}
