import VInput from './VInput.vue'
import VInputCfg from './config'
import { ComponentTypes, FrameWorkTypes, MaterialTypes } from '@davincid/core/src/Components'

const VInputComponent = {
  componentName: 'VInput',
  title: '输入框',
  icon: {
    type: 'img',
    value: '/input.png'
  },
  componentType: ComponentTypes.FORM,
  $el: null,
  attrs: VInputCfg,
  framework: FrameWorkTypes.Vue,
  materialType: MaterialTypes.Component,
  component: VInput
}

export { VInputComponent, VInput }
