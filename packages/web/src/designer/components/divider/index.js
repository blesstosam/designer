import VDivider from './VDivider.vue'
import VDividerCfg from './config'
import { componentTypes } from '@davincid/core/src/Components'

const VDividerComponent = {
  componentName: 'VDivider',
  title: '分割线',
  icon: {
    type: 'img',
    value: '/divider.png'
  },
  componentType: componentTypes.VIEW,
  attrs: VDividerCfg,
  $el: null,
  framework: 'Vue',
  component: VDivider,
}
export { VDividerComponent, VDivider }
