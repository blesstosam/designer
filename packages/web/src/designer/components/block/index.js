import { ComponentTypes, FrameWorkTypes, MaterialTypes } from '@davincid/core/src/Components'
import VBlock from './VBlock.vue' // VBlock经过编译之后就是一个对象，包含name和render函数
import VBlockCfg from './config'

const VBlockComponent = {
  componentName: 'VBlock',
  title: '区块',
  icon: {
    type: 'img',
    value: '/rect.png'
  },
  // meta: {},
  // lifecycles ?
  componentType: ComponentTypes.LAYOUT,
  $el: null,
  attrs: VBlockCfg,
  emits: [
    // 组件所暴露出来的自定义事件，用于其他组件的监听，所有组件的自定义事件用event模块来管理
    {
      name: 'valChange',
      params: {
        val: {
          type: 'string'
        }
      }
    }
  ],
  framework: FrameWorkTypes.Vue,
  materialType: MaterialTypes.Component,

  // 组件实现代码
  // 对于宜搭来说，组件已经注册到React上了，画布使用该React实例来渲染，所以只需要组件name即可
  // 但是对于我来说，我是要兼容所有框架的，core的运行时不固定，组件实现需要提供给core
  component: VBlock
}

export { VBlockComponent, VBlock }
