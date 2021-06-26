import { reactive } from 'vue'
import { componentTypes } from '../../Component'
import { parseProps, changeProps, genVueInstance } from '../render-util'
import VBlock from './VBlock.vue'
import VBlockCfg from './config'

const VBlockComponent = {
  id: '1',
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
  renderProps: null,
  render(newProps) {
    if (newProps) {
      changeProps(newProps, this.renderProps)
    } else {
      this.renderProps = reactive(parseProps(this.attrs))
      this.vm = genVueInstance(VBlock, this.renderProps)
      return this.vm.$el
    }
  },
}

export { VBlockComponent, VBlock }