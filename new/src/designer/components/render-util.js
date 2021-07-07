import { createApp, h } from 'vue'
import { cssProperty } from '../cssProperty'
import { parse } from '../lib/parse-schema'

// 使用vue生成vue实例挂载
export function genVueInstance(appOpt, props) {
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
