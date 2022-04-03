import { reactive } from 'vue'
import { ComponentTypes, MaterialTypes } from '@davincid/core/src/Components'
import { parseProps, genVueInstance } from '../render-util'
import VTabs from './VTabs.vue'
import Attr from './attr'

const VTabsComponent = {
  name: 'VTabs',
  title: '选项卡',
  icon: {
    type: 'inline-svg',
    value: `<path
      d="M896 128H128c-47.146667 0-85.333333 38.186667-85.333333 85.333333v597.333334c0 47.146667 38.186667 85.333333 85.333333 85.333333h768c47.146667 0 85.333333-38.186667 85.333333-85.333333V213.333333c0-47.146667-38.186667-85.333333-85.333333-85.333333z m0 682.666667H128V213.333333h426.666667v170.666667h341.333333v426.666667z"
      p-id="4020"
    ></path>`
  },
  materialType: MaterialTypes.Component,
  componentType: ComponentTypes.LAYOUT,
  $el: null,
  vm: null,
  attrs: Attr,
  props: null,
  render() {
    this.props = reactive(parseProps(this.attrs))
    const vm = genVueInstance(VTabs, this.props)
    return vm.$el
  },
  accept: ['VButton', 'VText', 'VInput', 'VTag']
}

export { VTabsComponent, VTabs }
