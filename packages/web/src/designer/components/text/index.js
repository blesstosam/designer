import { reactive } from 'vue'
import { parseProps, genVueInstance } from '../render-util'
import VText from './VText.vue'
import Attr from './attr'
import { ComponentTypes, MaterialTypes } from '@davincid/core/src/Components'

const VTextComponent = {
  name: 'VText', // 唯一标示 绑定在标签上 在dragstart的时候通过该属性获取组件属性
  title: '文字',
  icon: {
    type: 'img', // icon 有 image/font-icon/等几种
    value: '/text.png'
  },
  materialType: MaterialTypes.Component,
  componentType: ComponentTypes.VIEW,
  attrs: Attr,
  isBlock: true, // 是否是块级元素
  $el: null, // 记录组件渲染出来的dom包一层的node-box节点 在canvas渲染的时候挂载
  vm: null, // 当前vue实例
  props: null,
  accept: [],
  render() {
    this.props = reactive(parseProps(this.attrs))
    const vm = genVueInstance(VText, this.props)
    return vm.$el
  }
}
export { VTextComponent, VText }
