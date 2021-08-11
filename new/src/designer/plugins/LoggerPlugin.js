import { createApp, reactive, h } from 'vue'
import LoggerPluginVue from './LoggerPlugin.vue'
import { EVENT_TYPES } from '../Event'
import { $ } from '../lib/dom'

export class LoggerPlugin {
  constructor(attr) {
    this.__attr__ = attr
    // this.$el = null
    // this.init()
  }

  get __designer__() {
    return this.__attr__.__designer__
  }

  init(wrap) {
    const props = reactive({
      logs: [],
      ref: 'loggerWrap'
    })
    const app = createApp({
      props: ['logs', 'ref'],
      render: () => h(LoggerPluginVue, props)
    })

    this.vueInstance = app.mount(document.querySelector(wrap))
    this.vueInstance.__componentTree__ = this

    this.__designer__.on(EVENT_TYPES.CANVAS_ACTIONS_APPEND, data => {
      console.log('append...', data)
      const type = data.type === EVENT_TYPES.CANVAS_ACTIONS_APPEND ? '插入' : ''
      props.logs.push({
        title: `${type}${data.data.title}`,
        timestamp: new Date().toISOString().split('.').shift().replace('T', ' ')
      })
      // this.appendLog('插入' + data.data.title)
    })

    // const el = this.$el = $('<div>')
    //   .style({
    //     position: 'fixed',
    //     bottom: 0,
    //     width: '300px',
    //     height: '120px',
    //     background: '#fff',
    //     padding: '12px',
    //     'box-shadow': '0 -2px 10px rgb(0 0 0 / 10%)',
    //     overflowY: 'auto'
    //   }).el
    // const icon = $('<i>').addClass('el-icon-circle-close').style({
    //   position: 'absolute',
    //   right: '4px',
    //   top: '4px'
    // }).el
    // el.appendChild(icon)
    // $(icon).addListener('click', () => {
    //   $(el).hide()
    // })  
    // document.body.appendChild(el)
  }

  // appendLog(txt) {
  //   const span = $('<div>').text(txt).style({
  //     fontSize: '12px',
  //     color: '#222'
  //   }).el
  //   this.$el.appendChild(span)
  // }
}

LoggerPlugin.$inject = ['__attr__']
LoggerPlugin.$name = 'myLoggerPlugin'
