import { reactive } from 'vue'
import { parseProps, changeProps, genVueInstance } from '../render-util'
import VInput from './VInput.vue'
import VInputCfg from './config'
import { componentTypes } from '../../Components'

const VInputComponent = {
  name: 'VInput',
  title: '输入框',
  icon: {
    type: 'img',
    value: '/input.png'
  },
  componentType: componentTypes.FORM,
  accept: [],
  $el: null,
  vm: null,
  attrs: VInputCfg,
  props: null,
  render(newProps) {
    if (newProps) {
      changeProps(newProps, this.props)
    } else {
      this.props = reactive(parseProps(this.attrs))
      this.vm = genVueInstance(VInput, this.props)
      return this.vm.$el
    }
  }
}

export { VInputComponent, VInput }
