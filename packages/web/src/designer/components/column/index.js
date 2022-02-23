import { reactive } from 'vue'
import { componentTypes } from '@davincid/core/src/Components'
import { parseProps, genVueInstance } from '../render-util'
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
  render() {
    this.props = reactive(parseProps(this.attrs))
    const vm = genVueInstance(VColumn, this.props)
    return vm.$el
  }
}

export { VColumnComponent, VColumn }
