import { createApp } from 'vue'
import { FetchLoader } from './lib/loader'
import { ElTabs, ElTabPane } from 'element-plus'
import ComponentsVue from './vue/Components.vue'
import { lookupByClassName, $ } from './lib/dom'

const COMPONENT_EL_CLS = 'component-item'

// 从功能维度划分
export const componentTypes = {
  LAYOUT: 'layout',  // 布局组件
  VIEW: 'view', // 视图组件
  FORM: 'form' // 表单组件
}

/**
 * 组件提供了注册，绑定事件等方法
 * 视图根据用户自己的选择定制通过重写 init 方法
 */
export class Components {
  constructor(config, designer) {
    this.name = '__components__'
    this.config = config || {}
    if (!this.config.componentsWrap) {
      throw new Error('[designer] 请传入组件框容器元素 componentsWrap')
    }
    this.__designer__ = designer
    this._hasRegistered = []
    this.$wrapEl = document.querySelector(this.config.componentsWrap)
    this.loader = null
  }

  get __dragDrop__() {
    return this.__designer__.__dragDrop__
  }

  get __componentTree__() {
    return this.__designer__.__componentTree__
  }

  get registeredComponents() {
    return this._hasRegistered
  }

  init(com) {
    const app = createApp(com || ComponentsVue)
    app.component(ElTabs.name, ElTabs)
    app.component(ElTabPane.name, ElTabPane)
    this.vueInstance = app.mount(this.$wrapEl)
    this.vueInstance.__components__ = this
  }

  // 给组件绑定数据和事件
  _bindEvent(target) {
    this.__dragDrop__.bindDragStart(target, ({ $event: e, setData }) => {
      console.log('drag start...')
      const $componentItem = lookupByClassName(e.target, COMPONENT_EL_CLS)
      setData('data', this.findComByName($componentItem.getAttribute('com-name')) || {})
    })

    this.__dragDrop__.bindDragEnd(target, () => { console.log('drag end...') })
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
            mod => {
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
            err => {
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
    return this._hasRegistered.find(c => c.name === name)
  }

  renderComponent() {
    // todo 是否将render相关逻辑从canvas里抽出来
  }
}
