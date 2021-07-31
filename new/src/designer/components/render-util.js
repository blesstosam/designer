import { createApp, h } from 'vue'
import { cssProperty } from '../cssProperty'
import { parse } from '../lib/parse-schema'

// 使用vue生成vue实例挂载
export function genVueInstance(appOpt, props) {
  const app = createApp({
    render: () => h(appOpt, props)
  })
  const rootInstance = app.mount(document.createElement('div'))
  // console.log('app', app, 'rootInstance', rootInstance)
  return rootInstance
}

export function parseProps(attrs) {
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

export function changeProps(newProps, oldProps) {
  for (const k in newProps) {
    if (cssProperty[k]) {
      oldProps.style[k] = newProps[k]
    } else {
      oldProps[k] = newProps[k]
    }
  }
}
