import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import ElementPlus from 'element-plus'
import 'element-plus/lib/theme-chalk/index.css'
import { registerCom } from './components/registerCom'

const app = createApp(App)
app.use(router).use(ElementPlus).mount('#app')

registerCom(app)
