import VInput from './VInput.vue'
import VInputCfg from './config'
import { componentTypes } from '@davincid/core/src/Components'

const VInputComponent = {
  componentName: 'VInput',
  title: '输入框',
  icon: {
    type: 'img',
    value: '/input.png'
  },
  componentType: componentTypes.FORM,
  $el: null,
  attrs: VInputCfg,
  framework: 'Vue',
  component: VInput,
}

export { VInputComponent, VInput }
