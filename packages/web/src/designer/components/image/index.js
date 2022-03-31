import { reactive } from 'vue'
import { parseProps, genVueInstance } from '../render-util'
import VImage from './VImage.vue'
import Attr from './attr'
import { ComponentTypes, MaterialTypes } from '@davincid/core/src/Components'

const VImageComponent = {
  name: 'VImage',
  title: '图片',
  icon: {
    type: 'img',
    value: '/image.png'
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
    const vm = genVueInstance(VImage, this.props)
    return vm.$el
  }
}
export { VImageComponent, VImage }
