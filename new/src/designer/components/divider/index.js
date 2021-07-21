import { reactive } from 'vue'
import { parseProps, changeProps, genVueInstance } from '../render-util'
import VDivider from './VDivider.vue'
import VDividerCfg from './config'
import { componentTypes } from '../../Components'

const VDividerComponent = {
  name: 'VDivider',
  title: '分割线',
  icon: {
    type: 'img',
    value: '/divider.png'
  },
  componentType: componentTypes.VIEW,
  attrs: VDividerCfg,
  isBlock: true,
  $el: null,
  vm: null,
  props: null,
  accept: [],
  render(newProps) {
    if (newProps) {
      changeProps(newProps, this.props)
    } else {
      this.props = reactive(parseProps(this.attrs))
      this.vm = genVueInstance(VDivider, this.props)
      return this.vm.$el
    }
  }
}
export { VDividerComponent, VDivider }