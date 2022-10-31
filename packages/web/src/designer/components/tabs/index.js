import { reactive } from 'vue'
import { componentTypes } from '@davincid/core/src/Components'
import { parseProps, genVueInstance } from '../render-util'
import VTabs from './VTabs.vue'
import VTabsCfg from './config'

const VTabsComponent = {
  name: 'VTabs',
  title: '选项卡',
  icon: {
    type: 'img',
    value: '/tabs.png'
  },
  componentType: componentTypes.LAYOUT,
  $el: null,
  vm: null,
  attrs: VTabsCfg,
  props: null,
  render() {
    this.props = reactive(parseProps(this.attrs))
    const vm = genVueInstance(VTabs, this.props)
    return vm.$el
  },
  accept: ['VButton', 'VText', 'VInput', 'VTag']
}

export { VTabsComponent, VTabs }