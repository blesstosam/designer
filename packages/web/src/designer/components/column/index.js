import { ComponentTypes, FrameWorkTypes, MaterialTypes } from '@davincid/core/src/Components'
import VColumn from './VColumn.vue'
import VColumnCfg from './config'

const VColumnComponent = {
  componentName: 'VColumn',
  title: '分栏',
  icon: {
    type: 'img',
    value: '/wrap.png'
  },
  componentType: ComponentTypes.LAYOUT,
  $el: null,
  attrs: VColumnCfg,
  framework: FrameWorkTypes.Vue,
  materialType: MaterialTypes.Component,
  component: VColumn
}

export { VColumnComponent, VColumn }
