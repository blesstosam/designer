import { reactive } from 'vue'
import { componentTypes } from '../../Components'
import { parseProps, changeProps, genVueInstance } from '../render-util'
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
  render(newProps) {
    if (newProps) {
      changeProps(newProps, this.props)
    } else {
      this.props = reactive(parseProps(this.attrs))
      this.vm = genVueInstance(VTabs, this.props)
      return this.vm.$el
    }
  },
  accept: ['VButton', 'VText', 'VInput']
}

export { VTabsComponent, VTabs }