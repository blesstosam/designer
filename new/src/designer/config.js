import { VBlockComponent } from './components/block/index'
import { VColumnComponent } from './components/column/index'
import { VTabsComponent } from './components/tabs/index'
import { VButtonComponent } from './components/button/index'
import { VTextComponent } from './components/text/index'
import { VInputComponent } from './components/input/index'

// 记录拖拽的一些数据：当前被拖拽的组件，drop后的位置，是否在拖拽等
export const state = {
  dragging: false, // 是否在拖拽
  draggingDom: null, // 当前被拖拽的组件dom
  data: null, // 当前组件的描述对象 每次在drop之后重置
  dropPos: {
    // drop后的位置
    // 参考api https://developer.mozilla.org/zh-CN/docs/Web/API/MouseEvent
    x: 0,
    y: 0
  }
}
export function resetState() {
  state.dragging = false
  state.target = null
  state.data = null
}

// 当前被选中的dom节点所在数据
let currentViewNodeModel = {}
export function getCurrentViewNodeModel() {
  return currentViewNodeModel
}
export function setCurrentViewNodeModel(m) {
  currentViewNodeModel = m
}

// 不管是左侧的组件列表，还是画布上组件的实际渲染，还是右侧的属性面板都是从这个配置文件里获取必要信息去渲染
// 和vue的option api类似 一个组件即一个对象 需要有哪几个key都是规定好的
export const componentList = [
  VBlockComponent,
  VColumnComponent,
  VTabsComponent,

  VTextComponent,
  VButtonComponent,
  VInputComponent
]

export const customComList = [
  {
    name: '123',
    title: '插件1',
    version: '0.0.1',
    icon: {
      type: 'img',
      value: '/custom.png'
    },
    url: 'http://127.0.0.1:5001/123_0.0.1/index.js',
    preview: []
  },
  {
    name: '345',
    title: '插件2',
    version: '0.0.1',
    icon: {
      type: 'img',
      value: '/custom.png'
    },
    url: 'http://127.0.0.1:5001/345_0.0.1/index.js',
    preview: []
  }
]
