import { ComponentTypes, FrameWorkTypes, MaterialTypes } from '@davincid/core/src/Components'
import VColumn from './VColumn.vue'
import VColumnCfg from './config'
import Png from '../../../assets/imgs/column.png'

const VColumnComponent = {
  componentName: 'VColumn',
  title: '分栏',
  icon: {
    type: 'img',
    value: Png,
  },
  componentType: ComponentTypes.LAYOUT,
  $el: null,
  attrs: VColumnCfg,
  framework: FrameWorkTypes.Vue,
  materialType: MaterialTypes.Component,
  component: VColumn
}

export { VColumnComponent, VColumn }
