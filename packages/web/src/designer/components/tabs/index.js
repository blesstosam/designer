import { componentTypes } from '@davincid/core/src/Components'
import VTabs from './VTabs.vue'
import VTabsCfg from './config'

const VTabsComponent = {
  componentName: 'VTabs',
  title: '选项卡',
  icon: {
    type: 'img',
    value: '/tabs.png'
  },
  componentType: componentTypes.LAYOUT,
  $el: null,
  attrs: VTabsCfg,
  framework: 'Vue',
  component: VTabs,
}

export { VTabsComponent, VTabs }
