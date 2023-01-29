import VDivider from './VDivider.vue'
import VDividerCfg from './config'
import { ComponentTypes, FrameWorkTypes, MaterialTypes } from '@davincid/core/src/Components'
import Png from '../../../assets/imgs/divider.png'

const VDividerComponent = {
  componentName: 'VDivider',
  title: '分割线',
  icon: {
    type: 'img',
    value: Png
  },
  componentType: ComponentTypes.VIEW,
  attrs: VDividerCfg,
  $el: null,
  framework: FrameWorkTypes.Vue,
  materialType: MaterialTypes.Component,
  component: VDivider
}
export { VDividerComponent, VDivider }
