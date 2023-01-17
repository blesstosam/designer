import VTag from './VTag.vue'
import VTagCfg from './config'
import { componentTypes } from '@davincid/core/src/Components'

const VTagComponent = {
  componentName: 'VTag',
  title: '标签',
  icon: {
    type: 'img',
    value: '/tag.png'
  },
  componentType: componentTypes.VIEW,
  attrs: VTagCfg,
  $el: null,
  framework: 'Vue',
  component: VTag
}
export { VTagComponent, VTag }
