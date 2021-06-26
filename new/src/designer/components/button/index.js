import { reactive } from 'vue'
import { parseProps, changeProps, genVueInstance } from '../render-util'
import VButton from './VButton.vue'
import VButtonCfg from './config'

const VButtonComponent = {
  id: '2',
  name: 'VButton',
  title: '按钮',
  icon: {
    type: 'img',
    value: '/button.png'
  },
  accept: [],
  $el: null,
  vm: null,
  attrs: VButtonCfg,
  renderProps: null,
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
  render(newProps) {
    if (newProps) {
      changeProps(newProps, this.renderProps)
      this.transformProps(this.renderProps)
    } else {
      const p = parseProps(this.attrs)
      this.transformProps(p)
      this.renderProps = reactive(p)
      this.vm = genVueInstance(VButton, this.renderProps)
      return this.vm.$el
    }
  }
}

export { VButtonComponent, VButton }