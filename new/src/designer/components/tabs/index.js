import { reactive } from 'vue'
import { componentTypes } from '../../Component'
import { parseProps, changeProps, genVueInstance } from '../render-util'
import VTabs from './VTabs.vue'
import VTabsCfg from './config'

const VTabsComponent = {
  id: '5',
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
  renderProps: null,
  render(newProps) {
    if (newProps) {
      changeProps(newProps, this.renderProps)
    } else {
      this.renderProps = reactive(parseProps(this.attrs))
      this.vm = genVueInstance(VTabs, this.renderProps)
      return this.vm.$el
    }
  },
  accept: ['VButton', 'VText', 'VInput']
}

export { VTabsComponent, VTabs }