import { createApp, reactive, h } from 'vue'
import { VBlock, VBlockCfg } from './components/block/index'
import { VColumn, VColumnCfg } from './components/column/index'
import { VTabs, VTabsCfg } from './components/tabs/index'
import { VButtonCfg, VButton } from './components/button/index'
import { VText, VTextCfg } from './components/text/index'
import { VInput, VInputCfg } from './components/input/index'
import { parse } from './vue/attr-panel/AttrPanel.vue'
import { cssProperty } from './cssProperty'
import { componentTypes } from './Component'

const { LAYOUT, BASIC } = componentTypes

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

// 使用vue生成vue实例挂载
function genVueInstance(appOpt, props) {
  // TODO 怎么和vue文件相关联 参考vue.extend api
  // #__empty__ 为承载mount的容器 只是为了生成dom（不知道有没有现成的api，只生成dom，不插入到容器）
  const div = document.createElement('div')
  div.style.width = 0
  div.style.height = 0
  div.setAttribute('id', '__empty__')
  document.body.appendChild(div)

  // important：需要将组件再包一层 这样 props才能是响应式的
  const app = createApp({
    props: Object.keys(props),
    render: () => h(appOpt, props)
  })
  const rootInstance = app.mount(`#__empty__`)
  // console.log('app', app, 'rootInstance', rootInstance)
  document.body.removeChild(document.querySelector('#__empty__'))
  return rootInstance
}

function parseProps(attrs) {
  const def = parse(attrs)
  const allCfgs = def.configs.reduce((r, c) => r.concat(c.children), [])
  const obj = {}
  allCfgs.forEach(i => {
    // 将css属性包一层style
    if (cssProperty[i.id]) {
      obj.style = obj.style || {}
      obj.style[i.id] = i.value
    } else {
      obj[i.id] = i.value
    }
  })
  console.log(allCfgs, obj)
  return obj
}

// 不管是左侧的组件列表，还是画布上组件的实际渲染，还是右侧的属性面板都是从这个配置文件里获取必要信息去渲染
// 和vue的option api类似 一个组件即一个对象 需要有哪几个key都是规定好的
export const componentList = [
  {
    id: '0', // 唯一标示 绑定在标签上 在dragstart的时候通过该属性获取组件属性
    name: 'VText',
    title: '文字',
    icon: {
      type: 'img', // icon 有 image/font-icon/等几种
      value: 'https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg'
    },
    $el: null, // 记录组件渲染出来的dom包一层的node-box节点 在canvas渲染的时候挂载
    vm: null, // 当前vue实例
    attrs: VTextCfg,
    props() {
      return parseProps(this.attrs)
    },
    renderProps: null,
    render(newProps) {
      this.renderProps = this.renderProps || reactive(this.props())
      // 已经mount过 需要重新计算props 改变props vue会自动更新
      if (this.$el && newProps) {
        for (const k in newProps) {
          if (cssProperty[k]) {
            this.renderProps.style[k] = newProps[k]
          } else {
            this.renderProps[k] = newProps[k]
          }
        }
      } else {
        this.vm = genVueInstance(VText, this.renderProps)
        return this.vm.$el
      }
    },
    accept: []
  },

  {
    id: '1',
    name: 'VBlock',
    title: '区块',
    icon: {
      type: 'img',
      value: 'https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg'
    },
    componentType: LAYOUT,
    $el: null,
    vm: null,
    attrs: VBlockCfg,
    props() {
      return parseProps(this.attrs)
    },
    renderProps: null,
    render(newProps) {
      this.renderProps = this.renderProps || reactive(this.props())
      // 已经mount过 需要重新计算props 改变props vue会自动更新
      if (this.$el && newProps) {
        for (const k in newProps) {
          if (cssProperty[k]) {
            this.renderProps.style[k] = newProps[k]
          } else {
            this.renderProps[k] = newProps[k]
          }
        }
      } else {
        this.vm = genVueInstance(VBlock, this.renderProps)
        return this.vm.$el
      }
    },
    // 能接收被拖入的组件名称
    accept: ['VButton', 'VText', 'VInput']
  },

  {
    id: '2',
    name: 'VButton',
    title: '按钮',
    icon: {
      type: 'img',
      value: 'https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg'
    },
    $el: null,
    vm: null,
    attrs: VButtonCfg,
    props() {
      const p = parseProps(this.attrs)
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
      return p
    },
    renderProps: null,
    render(newProps) {
      console.log(this.renderProps, newProps, '====> newprops')
      this.renderProps = this.renderProps || reactive(this.props())
      if (this.$el && newProps) {
        for (const k in newProps) {
          if (cssProperty[k]) {
            this.renderProps.style[k] = newProps[k]
          } else {
            this.renderProps[k] = newProps[k]
            if (k === '__bgcolor') {
              this.renderProps.type = newProps.__bgcolor
            } else if (k === '__btnstyle') {
              this.renderProps.round = newProps.__btnstyle === 'round'
              this.renderProps.plain = newProps.__btnstyle === 'plain'
            } else if (k === '__buttonsize') {
              this.renderProps.size = newProps.__buttonsize
            } else if (k === '__displayway') {
              if (newProps.__displayway === 'text') {
                this.renderProps.content = this.renderProps.oldContent
                this.renderProps.icon = ''
                // TODO 将 attrs 里的图标置为空
              } else if (newProps.__displayway === 'icon') {
                this.renderProps.oldContent = this.renderProps.content 
                this.renderProps.content = ''
              } else if (newProps.__displayway === 'icon-text') {}
            } else if (k === '__chooseicon') {
              this.renderProps.icon = newProps.__chooseicon
            }
          }
        }
      } else {
        this.vm = genVueInstance(VButton, this.renderProps)
        return this.vm.$el
      }
    },
    accept: []
  },

  {
    id: '3',
    name: 'VInput',
    title: '输入框',
    icon: {
      type: 'img',
      value: 'https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg'
    },
    $el: null,
    vm: null,
    attrs: VInputCfg,
    props() {
      return parseProps(this.attrs)
    },
    renderProps: null,
    render(newProps) {
      this.renderProps = this.renderProps || reactive(this.props())
      // 已经mount过 需要重新计算props 改变props vue会自动更新
      if (this.$el && newProps) {
        for (const k in newProps) {
          if (cssProperty[k]) {
            this.renderProps.style[k] = newProps[k]
          } else {
            this.renderProps[k] = newProps[k]
          }
        }
      } else {
        this.vm = genVueInstance(VInput, this.renderProps)
        return this.vm.$el
      }
    },
    accept: []
  },

  {
    id: '4',
    name: 'VColumn',
    title: '分栏',
    icon: {
      type: 'img',
      value: 'https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg'
    },
    componentType: LAYOUT,
    $el: null,
    vm: null,
    attrs: VColumnCfg,
    props() {
      return parseProps(this.attrs)
    },
    renderProps: null,
    render(newProps) {
      this.renderProps = this.renderProps || reactive(this.props())
      // 已经mount过 需要重新计算props 改变props vue会自动更新
      if (this.$el && newProps) {
        for (const k in newProps) {
          if (cssProperty[k]) {
            this.renderProps.style[k] = newProps[k]
          } else {
            this.renderProps[k] = newProps[k]
          }
        }
      } else {
        this.vm = genVueInstance(VColumn, this.renderProps)
        return this.vm.$el
      }
    },
    accept: ['VButton', 'VText', 'VInput']
  },

  {
    id: '5',
    name: 'VTabs',
    title: '选项卡',
    icon: {
      type: 'img',
      value: 'https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg'
    },
    componentType: LAYOUT,
    $el: null,
    vm: null,
    attrs: VTabsCfg,
    props() {
      return parseProps(this.attrs)
    },
    renderProps: null,
    render(newProps) {
      this.renderProps = this.renderProps || reactive(this.props())
      // 已经mount过 需要重新计算props 改变props vue会自动更新
      if (this.$el && newProps) {
        for (const k in newProps) {
          if (cssProperty[k]) {
            this.renderProps.style[k] = newProps[k]
          } else {
            this.renderProps[k] = newProps[k]
          }
        }
      } else {
        this.vm = genVueInstance(VTabs, this.renderProps)
        return this.vm.$el
      }
    },
    accept: ['VButton', 'VText', 'VInput']
  }
]
