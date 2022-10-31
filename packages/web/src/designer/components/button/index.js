import { reactive } from 'vue'
import { parseProps, changeProps, genVueInstance } from '../render-util'
import VButton from './VButton.vue'
import VButtonCfg from './config'
import { componentTypes } from '@davincid/core/src/Components'

const VButtonComponent = {
  name: 'VButton',
  title: '按钮',
  icon: {
    type: 'img',
    value: '/button.png'
  },
  componentType: componentTypes.VIEW,
  accept: [],
  $el: null,
  vm: null,
  attrs: VButtonCfg,
  props: null,
  transformProps(p) {
    p.type = p.__bgcolor
    p.round = p.__btnstyle === 'round'
    p.plain = p.__btnstyle === 'plain'
    p.size = p.__buttonsize
    if (p.__displayway === 'text') {
      p.content = p.content
    } else if (p.__displayway === 'icon') {
      p.content = ''
      p.icon = p.__chooseicon
    } else if (p.__displayway === 'icon-text') {
      p.icon = p.__chooseicon
    }
  },
  render() {
    const p = parseProps(this.attrs)
    this.transformProps(p)
    this.props = reactive(p)
    const vm = genVueInstance(VButton, this.props)
    return vm.$el
  }
}

export { VButtonComponent, VButton }