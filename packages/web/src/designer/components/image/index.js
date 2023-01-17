import VImage from './VImage.vue'
import VImageCfg from './config'
import { componentTypes } from '@davincid/core/src/Components'

const VImageComponent = {
  componentName: 'VImage',
  title: '图片',
  icon: {
    type: 'img',
    value: '/image.png'
  },
  componentType: componentTypes.VIEW,
  attrs: VImageCfg,
  $el: null,
  framework: 'Vue',
  component: VImage,
}
export { VImageComponent, VImage }
