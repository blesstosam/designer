import { reactive } from 'vue'
import { parseProps, genVueInstance } from '../render-util'
import VDivider from './VDivider.vue'
import VDividerCfg from './config'
import { componentTypes } from '@davincid/core/src/Components'

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
  render() {
    this.props = reactive(parseProps(this.attrs))
    const vm = genVueInstance(VDivider, this.props)
    return vm.$el
  }
}
export { VDividerComponent, VDivider }