import { ComponentTypes, FrameWorkTypes, MaterialTypes } from '@davincid/core/src/Components'
import Attrs from './attr'
import { h } from 'vue'

// TODO 接入组件库
// const lib = {
//   umd: 'https://unpkg.com/browse/element-plus@2.1.7/dist/index.full.js',
//   exportNames: [{ name: 'Button' }]
// }
// registerComponent(ElementPlus.Button)

// render code
const ComponentCode = {
  data() {
    return {
      msg: 'I am a Vue3 component'
    }
  },
  render() {
    return h('h1', this.msg)
  }
}

const VVueComponent = {
  name: 'VVueComponent',
  title: 'VueDemo',
  icon: {
    type: 'img',
    value: '/rect.png'
  },
  // meta: {},
  // lifecycles ?
  materialType: MaterialTypes.Component,
  componentType: ComponentTypes.VIEW,
  framework: FrameWorkTypes.Vue3,
  accept: [],
  $el: null,
  vm: null,
  attrs: Attrs,
  props: null,
  emits: [],

  // 组件代码
  component: ComponentCode
}

export { VVueComponent }
