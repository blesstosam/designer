import { reactive } from 'vue'
import { parseProps, changeProps, genVueInstance } from '../render-util'
import VImage from './VImage.vue'
import VImageCfg from './config'
import { componentTypes } from '../../Components'

const VImageComponent = {
  name: 'VImage',
  title: '图片',
  icon: {
    type: 'img',
    value: '/image.png'
  },
  componentType: componentTypes.VIEW,
  attrs: VImageCfg,
  isBlock: false,
  $el: null,
  vm: null,
  props: null,
  accept: [],
  render(newProps) {
    if (newProps) {
      changeProps(newProps, this.props)
    } else {
      this.props = reactive(parseProps(this.attrs))
      this.vm = genVueInstance(VImage, this.props)
      return this.vm.$el
    }
  }
}
export { VImageComponent, VImage }