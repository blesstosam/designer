import { reactive } from 'vue'
import { parseProps, changeProps, genVueInstance } from '../render-util'
import VInput from './VInput.vue'
import Attr from './attr'
import { ComponentTypes, MaterialTypes } from '@davincid/core/src/Components'

const VInputComponent = {
  name: 'VInput',
  title: '输入框',
  icon: {
    type: 'img',
    value: '/input.png'
  },
  materialType: MaterialTypes.Component,
  componentType: ComponentTypes.FORM,
  accept: [],
  $el: null,
  vm: null,
  attrs: Attr,
  props: null,
  render() {
    this.props = reactive(parseProps(this.attrs))
    const vm = genVueInstance(VInput, this.props)
    return vm.$el
  }
}

export { VInputComponent, VInput }
