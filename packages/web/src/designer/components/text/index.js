import VText from './VText.vue'
import VTextCfg from './config'
import { componentTypes } from '@davincid/core/src/Components'

const VTextComponent = {
  componentName: 'VText', // 唯一标示 绑定在标签上 在dragstart的时候通过该属性获取组件属性
  title: '文字',
  icon: {
    type: 'img',
    value: '/text.png'
  },
  componentType: componentTypes.VIEW,
  attrs: VTextCfg,
  // isBlock: true, // 是否是块级元素
  $el: null, // 记录组件渲染出来的dom包一层的node-box节点 在canvas渲染的时候挂载
  framework: 'Vue',
  component: VText
}
export { VTextComponent, VText }
