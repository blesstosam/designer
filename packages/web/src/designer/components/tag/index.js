import { reactive } from 'vue'
import { parseProps, changeProps, genVueInstance } from '../render-util'
import VTag from './VTag.vue'
import VTagCfg from './config'
import { componentTypes } from '@davincid/core/src/Components'

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
  render() {
    this.props = reactive(parseProps(this.attrs))
    const vm = genVueInstance(VTag, this.props)
    return vm.$el
  }
}
export { VTagComponent, VTag }
