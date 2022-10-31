import { createApp } from 'vue'
import { createWebHistory, createRouter } from 'vue-router'
import ElementPlus from 'element-plus'
import 'element-plus/lib/theme-chalk/index.css'
import App from './App.vue'
import { registerCom } from './components/registerCom'
import { routes } from './router'

import { renderWithQiankun, qiankunWindow } from 'vite-plugin-qiankun/dist/helper'

let router = null
let app = null
let history = null

function render(props = {}) {
  const { container } = props
  history = createWebHistory(qiankunWindow.__POWERED_BY_QIANKUN__ ? '/designer' : '/')
  router = createRouter({
    history,
    routes
  })

  app = createApp(App)
  app
    .use(router)
    .use(ElementPlus)
    .mount(container ? container.querySelector('#app') : '#app')
  registerCom(app)
}

renderWithQiankun({
  bootstrap() {
    console.log('designer bootstrap')
  },
  mount(props) {
    console.log('designer mount')
    render(props)
    app.config.globalProperties.$onGlobalStateChange = props.onGlobalStateChange
    app.config.globalProperties.$setGlobalState = props.setGlobalState
  },
  unmount(props) {
    console.log('designer unmount')
    app.unmount()
    app._container.innerHTML = ''
    app = null
    router = null
    history.destroy()
  }
})

if (!qiankunWindow.__POWERED_BY_QIANKUN__) {
  render({})
}
