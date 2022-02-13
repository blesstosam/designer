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
  render() {
    this.props = reactive(parseProps(this.attrs))
    const vm = genVueInstance(VInput, this.props)
    return vm.$el
  }
}

export { VInputComponent, VInput }
