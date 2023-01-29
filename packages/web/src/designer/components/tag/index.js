import VTag from './VTag.vue'
import VTagCfg from './config'
import { ComponentTypes, FrameWorkTypes,MaterialTypes } from '@davincid/core/src/Components'
import Png from '../../../assets/imgs/tag.png'

const VTagComponent = {
  componentName: 'VTag',
  title: '标签',
  icon: {
    type: 'img',
    value: Png,
  },
  componentType: ComponentTypes.VIEW,
  attrs: VTagCfg,
  $el: null,
  framework: FrameWorkTypes.Vue,
  materialType: MaterialTypes.Component,
  component: VTag
}
export { VTagComponent, VTag }
