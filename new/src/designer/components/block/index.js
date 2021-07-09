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
  accept: ['VButton', 'VText', 'VInput'],
  $el: null,
  vm: null,
  attrs: VBlockCfg,
  props: null,
  render(newProps) {
    if (newProps) {
      changeProps(newProps, this.props)
    } else {
      // TODO 要加判断吗?
      this.props = this.props || reactive(parseProps(this.attrs))
      this.vm = genVueInstance(VBlock, this.props)
      return this.vm.$el
    }
  },
}

export { VBlockComponent, VBlock }