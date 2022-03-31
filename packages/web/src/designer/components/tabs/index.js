import { reactive } from 'vue'
import { ComponentTypes, MaterialTypes } from '@davincid/core/src/Components'
import { parseProps, genVueInstance } from '../render-util'
import VTabs from './VTabs.vue'
import Attr from './attr'

const VTabsComponent = {
  name: 'VTabs',
  title: '选项卡',
  icon: {
    type: 'img',
    value: '/tabs.png'
  },
  materialType: MaterialTypes.Component,
  componentType: ComponentTypes.LAYOUT,
  $el: null,
  vm: null,
  attrs: Attr,
  props: null,
  render() {
    this.props = reactive(parseProps(this.attrs))
    const vm = genVueInstance(VTabs, this.props)
    return vm.$el
  },
  accept: ['VButton', 'VText', 'VInput', 'VTag']
}

export { VTabsComponent, VTabs }
