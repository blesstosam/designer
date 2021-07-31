import { EVENT_TYPES } from '../Event'
import { $ } from '../lib/dom'

export class LoggerPlugin {
  constructor(attr) {
    this.__attr__ = attr
    this.$el = null
    // this.initLogger()
    // this.__designer__.on(EVENT_TYPES.CANVAS_ACTIONS_APPEND, data => {
    //   console.log('append...', data)
    //   this.appendLog('插入' + data.data.title)
    // })
  }

  get __designer__() {
    return this.__attr__.__designer__
  }

  initLogger() {
    const el = this.$el = $('<div>')
      .style({
        position: 'fixed',
        bottom: 0,
        width: '300px',
        height: '120px',
        background: '#fff',
        padding: '12px',
        'box-shadow': '0 -2px 10px rgb(0 0 0 / 10%)',
        overflowY: 'auto'
      }).el
    const icon = $('<i>').addClass('el-icon-circle-close').style({
      position: 'absolute',
      right: '4px',
      top: '4px'
    }).el
    el.appendChild(icon)
    $(icon).addListener('click', () => {
      $(el).hide()
    })  
    document.body.appendChild(el)
  }

  appendLog(txt) {
    const span = $('<div>').text(txt).style({
      fontSize: '12px',
      color: '#222'
    }).el
    this.$el.appendChild(span)
  }
}

LoggerPlugin.$inject = ['__attr__']
LoggerPlugin.$name = 'myLoggerPlugin'
