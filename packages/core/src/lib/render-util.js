import { createApp, h, reactive } from 'vue'
import { CssProperty } from '../CssProperty'
import { parse } from '../lib/parse-schema'

// 生成vue实例挂载
export function genVueInstance(appOpt, props) {
  const app = createApp({
    render: () => h(appOpt, props)
  })
  const rootInstance = app.mount(document.createElement('div'))
  return rootInstance
}

export function parseProps(attrs) {
  const def = parse(attrs)
  const allCfgs = def.configs.reduce((r, c) => r.concat(c.children), [])
  const obj = {}
  allCfgs.forEach((i) => {
    // 将css属性包一层style
    if (CssProperty[i.id]) {
      obj.style = obj.style || {}
      obj.style[i.id] = i.value
    } else {
      obj[i.id] = i.value
    }
  })
  // console.log(allCfgs, obj)
  return obj
}

export function changeProps(newProps, oldProps) {
  for (const k in newProps) {
    if (CssProperty[k]) {
      oldProps.style[k] = newProps[k]
    } else {
      oldProps[k] = newProps[k]
    }
  }
}

// 如果将 renderVueComponent 放在core里，vue要作为peer deps
export function renderVueComponent(component, attrs) {
  const props = reactive(parseProps(attrs)) // 将props转为响应式对象
  const vm = genVueInstance(component, props)
  return {
    el: vm.$el,
    props
  }
}

// render vue2 component

// render react component
