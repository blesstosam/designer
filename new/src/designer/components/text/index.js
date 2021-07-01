import { reactive } from 'vue'
import { parseProps, changeProps, genVueInstance } from '../render-util'
import VText from './VText.vue'
import VTextCfg from './config'

const VTextComponent = {
  id: '0', // 唯一标示 绑定在标签上 在dragstart的时候通过该属性获取组件属性
  name: 'VText',
  title: '文字',
  icon: {
    type: 'img', // icon 有 image/font-icon/等几种
    value: '/text.png'
  },
  attrs: VTextCfg,
  isBlock: true, // 是否是块级元素
  $el: null, // 记录组件渲染出来的dom包一层的node-box节点 在canvas渲染的时候挂载
  vm: null, // 当前vue实例
  props: null,
  accept: [],
  render(newProps) {
    if (newProps) {
      changeProps(newProps, this.props)
    } else {
      this.props = reactive(parseProps(this.attrs))
      this.vm = genVueInstance(VText, this.props)
      return this.vm.$el
    }
  }
}
export { VTextComponent, VText }