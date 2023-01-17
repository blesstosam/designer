import VButton from './VButton.vue'
import VButtonCfg from './config'
import { componentTypes } from '@davincid/core/src/Components'

const VButtonComponent = {
  componentName: 'VButton',
  title: '按钮',
  icon: {
    type: 'img',
    value: '/button.png'
  },
  componentType: componentTypes.VIEW,
  $el: null,
  attrs: VButtonCfg,
  // transformProps(p) {
  //   p.type = p.__bgcolor
  //   p.round = p.__btnstyle === 'round'
  //   p.plain = p.__btnstyle === 'plain'
  //   p.size = p.__buttonsize
  //   if (p.__displayway === 'text') {
  //     p.content = p.content
  //   } else if (p.__displayway === 'icon') {
  //     p.content = ''
  //     p.icon = p.__chooseicon
  //   } else if (p.__displayway === 'icon-text') {
  //     p.icon = p.__chooseicon
  //   }
  // },
  framework: 'Vue',
  component: VButton,
}

export { VButtonComponent, VButton }
