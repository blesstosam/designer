import VImage from './VImage.vue'
import VImageCfg from './config'
import { ComponentTypes, FrameWorkTypes, MaterialTypes } from '@davincid/core/src/Components'
import Png from '../../../assets/imgs/image.png'

const VImageComponent = {
  componentName: 'VImage',
  title: '图片',
  icon: {
    type: 'img',
    value: Png
  },
  componentType: ComponentTypes.VIEW,
  attrs: VImageCfg,
  $el: null,
  framework: FrameWorkTypes.Vue,
  materialType: MaterialTypes.Component,
  component: VImage
}
export { VImageComponent, VImage }
