import { reactive } from 'vue'
import { ComponentTypes, MaterialTypes } from '@davincid/core/src/Components'
import { parseProps, genVueInstance } from '../render-util'
import VBlock from './VBlock.vue'
import Attr from './attr'
import RectPng from '../../assets/imgs/rect.png'

const VBlockComponent = {
  name: 'VBlock',
  title: '区块',
  icon: {
    type: 'img',
    value: RectPng
  },
  // meta: {},
  // lifecycles ?
  materialType: MaterialTypes.Component,
  componentType: ComponentTypes.LAYOUT,
  accept: ['VButton', 'VText', 'VInput', 'VTag', 'VImage', 'VDivider'],
  $el: null,
  vm: null,
  attrs: Attr,
  props: null,
  emits: [
    // 组件所暴露出来的自定义事件，用于其他组件的监听，所有组件的自定义事件用event模块来管理
    {
      name: 'valChange',
      params: {
        val: {
          type: 'string'
        }
      }
    }
  ],
  render() {
    this.props = reactive(parseProps(this.attrs))
    // cloneDeep vm 的时候会报错 =>
    // Avoid app logic that relies on enumerating keys on a component instance. The keys will be empty in production mode to avoid performance overhead
    // this.vm = genVueInstance(VBlock, this.props)
    const vm = genVueInstance(VBlock, this.props)
    return vm.$el
  }
}

export { VBlockComponent, VBlock }
