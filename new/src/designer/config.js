import { createApp, reactive, h } from 'vue'
import { VButtonCfg, VButton } from './components/button/index.js'
import { VText, VTextCfg } from './components/text/index.js'
import { VInput } from './components/input/index.js'
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
  console.log(div)
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
    const val = typeof i.value === 'object' ? i.value.value : i.value
    // 将css属性包一层style
    if (cssProperty[i.id]) {
      obj.style = obj.style || {}
      obj.style[i.id] = val
    } else {
      obj[i.id] = val
      if (i.options) {
        const item = i.options.find(opt => opt.value === val)
        // TODO 这里的代码非常不优雅 怎么处理？
        item && (obj[i.id + '-label'] = item.label)
      }
    }
  })
  console.log(allCfgs, obj)
  return obj
}

// 不管是左侧的组件列表，还是画布上组件的实际渲染，还是右侧的属性面板都是从这个配置文件里获取必要信息去渲染
// 和vue类似 一个组件即一个对象 需要有哪几个key都是规定好的
export const componentList = [
  {
    id: '0', // 唯一标示 绑定在标签上 在dragstart的时候通过该属性获取组件属性
    name: 'AText',
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
    reactiveProps: null,
    render(newProps) {
      // newProps 为对象
      this.reactiveProps = this.reactiveProps || reactive(this.props())
      // 已经mount过 需要重新计算props 改变props vue会自动更新
      if (this.$el && newProps) {
        for (const k in newProps) {
          if (cssProperty[k]) {
            this.reactiveProps.style[k] = newProps[k]
          } else {
            this.reactiveProps[k] = newProps[k]
          }
        }
      } else {
        this.vm = genVueInstance(VText, this.reactiveProps)
        return this.vm.$el
      }
    },
    accept: []
  },

  {
    id: '1',
    name: 'ABlock',
    title: '区块',
    icon: {
      type: 'img',
      value: 'https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg'
    },
    componentType: LAYOUT,
    $el: null,
    vm: null,
    attrs: {
      title: 'ABlock'
    },
    render() {
      const div = document.createElement('div')
      div.textContent = this.content
      div.style.padding = '2px'
      div.style.width = '200px'
      div.style.height = '50px'
      div.style.display = 'inline-block'
      div.style.border = '1px dotted #aaaaaa'
      return div
    },
    // 能接收被拖入的组件名称
    accept: ['AButton', 'AInput']
  },

  {
    id: '2',
    name: 'AButton',
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
      p.type = p['__bgcolor-label']
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
    reactiveProps: null,
    render(newProps) {
      console.log(newProps, this.reactiveProps, 'newProps-------')
      this.reactiveProps = this.reactiveProps || reactive(this.props())
      if (this.$el && newProps) {
        for (const k in newProps) {
          if (cssProperty[k]) {
            this.reactiveProps.style[k] = newProps[k]
          } else {
            this.reactiveProps[k] = newProps[k]
            if (k === '__bgcolor') {
              // TODO 这里type依赖其 '__btnstyle-label' 字段 不好处理
              // p.type =
            } else if (k === '__btnstyle') {
              this.reactiveProps.round = this.reactiveProps.__btnstyle === 'round'
              this.reactiveProps.plain = this.reactiveProps.__btnstyle === 'plain'
            } else if (k === '__buttonsize') {
              this.reactiveProps.size = this.reactiveProps.__buttonsize
            } else if (k === '__displayway') {
              if (newProps.__displayway === 'text') {
                this.reactiveProps.content = '222'
              } else if (newProps.__displayway === 'icon') {
                this.reactiveProps.content = ''
              } else if (newProps.__displayway === 'icon-text') {
              }
            } else if (k === '__chooseicon') {
              this.reactiveProps.icon = newProps.__chooseicon
            }
          }
        }
      } else {
        this.vm = genVueInstance(VButton, this.reactiveProps)
        return this.vm.$el
      }
    },
    accept: []
  },

  {
    id: '3',
    name: 'AInput',
    title: '输入框',
    icon: {
      type: 'img',
      value: 'https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg'
    },
    $el: null,
    vm: null,
    attrs: {
      title: 'AInput'
    },
    render() {
      this.vm = genVueInstance(VInput)
      return this.vm.$el
    },
    accept: []
  }
]
