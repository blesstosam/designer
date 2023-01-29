import VButton from './VButton.vue'
import VButtonCfg from './config'
import { ComponentTypes, FrameWorkTypes, MaterialTypes } from '@davincid/core/src/Components'
import Png from '../../../assets/imgs/button.png'

const VButtonComponent = {
  componentName: 'VButton',
  title: '按钮',
  icon: {
    type: 'img',
    value: Png,
  },
  componentType: ComponentTypes.VIEW,
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
  framework: FrameWorkTypes.Vue,
  materialType: MaterialTypes.Component,
  component: VButton
}

export { VButtonComponent, VButton }
