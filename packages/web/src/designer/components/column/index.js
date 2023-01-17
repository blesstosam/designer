import { componentTypes } from '@davincid/core/src/Components'
import VColumn from './VColumn.vue'
import VColumnCfg from './config'

const VColumnComponent = {
  componentName: 'VColumn',
  title: '分栏',
  icon: {
    type: 'img',
    value: '/wrap.png'
  },
  componentType: componentTypes.LAYOUT,
  $el: null,
  attrs: VColumnCfg,
  framework: 'Vue',
  component: VColumn,
}

export { VColumnComponent, VColumn }
