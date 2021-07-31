import { reactive } from 'vue'
import { componentTypes } from '../../Components'
import { parseProps, changeProps, genVueInstance } from '../render-util'
import VBlock from './VBlock.vue'
import VBlockCfg from './config'

const VBlockComponent = {
  name: 'VBlock',
  title: '区块',
  icon: {
    type: 'img',
    value: '/rect.png'
  },
  // meta: {},
  // lifecycles ?
  componentType: componentTypes.LAYOUT,
  accept: ['VButton', 'VText', 'VInput', 'VTag', 'VImage', 'VDivider'],
  $el: null,
  vm: null,
  attrs: VBlockCfg,
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
    this.vm = genVueInstance(VBlock, this.props)
    return this.vm.$el
  }
}

export { VBlockComponent, VBlock }
