

import { reactive } from 'vue'
import { componentTypes } from '../../Components'
import { parseProps, changeProps, genVueInstance } from '../render-util'
import VColumn from './VColumn.vue'
import VColumnCfg from './config'

const VColumnComponent = {
  name: 'VColumn',
  title: '分栏',
  icon: {
    type: 'img',
    value: '/wrap.png'
  },
  componentType: componentTypes.LAYOUT,
  accept: ['VButton', 'VText', 'VInput', 'VTag', 'VImage', 'VDivider'],
  $el: null,
  vm: null,
  attrs: VColumnCfg,
  props: null,
  render(newProps) {
    if (newProps) {
      changeProps(newProps, this.props)
    } else {
      this.props = reactive(parseProps(this.attrs))
      this.vm = genVueInstance(VColumn, this.props)
      return this.vm.$el
    }
  },
}

export { VColumnComponent, VColumn }
