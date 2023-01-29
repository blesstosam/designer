import { ComponentTypes, FrameWorkTypes, MaterialTypes } from '@davincid/core/src/Components'
import VTabs from './VTabs.vue'
import VTabsCfg from './config'
import Png from '../../../assets/imgs/tabs.png'

const VTabsComponent = {
  componentName: 'VTabs',
  title: '选项卡',
  icon: {
    type: 'img',
    value: Png,
  },
  componentType: ComponentTypes.LAYOUT,
  $el: null,
  attrs: VTabsCfg,
  framework: FrameWorkTypes.Vue,
  materialType: MaterialTypes.Component,
  component: VTabs
}

export { VTabsComponent, VTabs }
