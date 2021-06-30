

import { reactive } from 'vue'
import { componentTypes } from '../../Components'
import { parseProps, changeProps, genVueInstance } from '../render-util'
import VColumn from './VColumn.vue'
import VColumnCfg from './config'

const VColumnComponent = {
  id: '4',
  name: 'VColumn',
  title: '分栏',
  icon: {
    type: 'img',
    value: '/wrap.png'
  },
  componentType: componentTypes.LAYOUT,
  accept: ['VButton', 'VText', 'VInput'],
  $el: null,
  vm: null,
  attrs: VColumnCfg,
  renderProps: null,
  render(newProps) {
    if (newProps) {
      changeProps(newProps, this.renderProps)
    } else {
      this.renderProps = reactive(parseProps(this.attrs))
      this.vm = genVueInstance(VColumn, this.renderProps)
      return this.vm.$el
    }
  },
}

export { VColumnComponent, VColumn }
