import { reactive } from 'vue'
import { parseProps, changeProps, genVueInstance } from '../render-util'
import VInput from './VInput.vue'
import VInputCfg from './config'

const VInputComponent = {
  id: '3',
  name: 'VInput',
  title: '输入框',
  icon: {
    type: 'img',
    value: '/input.png'
  },
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
