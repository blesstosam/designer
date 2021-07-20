import { reactive } from 'vue'
import { parseProps, changeProps, genVueInstance } from '../render-util'
import VTag from './VTag.vue'
import VTagCfg from './config'
import { componentTypes } from '../../Components'

const VTagComponent = {
  name: 'VTag',
  title: '标签',
  icon: {
    type: 'img',
    value: '/tag.png'
  },
  componentType: componentTypes.VIEW,
  attrs: VTagCfg,
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
      this.vm = genVueInstance(VTag, this.props)
      return this.vm.$el
    }
  }
}
export { VTagComponent, VTag }