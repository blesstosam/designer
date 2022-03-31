import { reactive } from 'vue'
import { ComponentTypes, MaterialTypes } from '@davincid/core/src/Components'
import { parseProps, genVueInstance } from '../render-util'
import VColumn from './VColumn.vue'
import Attr from './attr'

const VColumnComponent = {
  name: 'VColumn',
  title: '分栏',
  icon: {
    type: 'img',
    value: '/wrap.png'
  },
  materialType: MaterialTypes.Component,
  componentType: ComponentTypes.LAYOUT,
  accept: ['VButton', 'VText', 'VInput', 'VTag', 'VImage', 'VDivider'],
  $el: null,
  vm: null,
  attrs: Attr,
  props: null,
  render() {
    this.props = reactive(parseProps(this.attrs))
    const vm = genVueInstance(VColumn, this.props)
    return vm.$el
  }
}

export { VColumnComponent, VColumn }
