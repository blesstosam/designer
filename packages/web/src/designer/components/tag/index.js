import { reactive } from 'vue'
import { parseProps, changeProps, genVueInstance } from '../render-util'
import VTag from './VTag.vue'
import Attr from './attr'
import { ComponentTypes, MaterialTypes } from '@davincid/core/src/Components'

const VTagComponent = {
  name: 'VTag',
  title: '标签',
  icon: {
    type: 'img',
    value: '/tag.png'
  },
  materialType: MaterialTypes.Component,
  componentType: ComponentTypes.VIEW,
  attrs: Attr,
  isBlock: false,
  $el: null,
  vm: null,
  props: null,
  accept: [],
  render() {
    this.props = reactive(parseProps(this.attrs))
    const vm = genVueInstance(VTag, this.props)
    return vm.$el
  }
}
export { VTagComponent, VTag }
