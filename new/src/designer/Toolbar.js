import cloneDeep from 'lodash.clonedeep'
import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import ToolBarVue from './vue/ToolBar.vue'
import { EVENT_TYPES } from './Event'

const { CANVAS_ACTIONS_APPEND, CANVAS_ACTIONS_DELETE, ATTRPANEL_SET_ATTR } = EVENT_TYPES

const NeedRecordEvents = [CANVAS_ACTIONS_APPEND, CANVAS_ACTIONS_DELETE, ATTRPANEL_SET_ATTR]

export class Toolbar {
  constructor(config, designer) {
    this.name = '__toolbar__'
    this.config = config || {}
    this.__designer__ = designer
    if (!this.config.toolbarWrap) {
      throw new Error('[designer] 请传入工具栏的容器元素')
    }
    this.$toolbarWrapEle = document.querySelector(this.config.toolbarWrap)

    // 操作记录
    // { type: 'append', data: {}, timestamp: 111 }
    this.actions = []

    // ------ for debug -------
    window.actions = this.actions

    // 当前指向的操作
    this._index = -1

    // 最大操作记录个数
    this.maxRecordTimes = config.maxRecordTimes || 10
  }

  init() {
    const app = createApp(ToolBarVue)
    app.use(ElementPlus)
    this.vueInstance = app.mount(this.config.toolbarWrap)
    this.vueInstance.__toolbar__ = this

    this.initListener()
    this.__designer__.emit(EVENT_TYPES.TOOLBAR_INITED)
  }

  initListener() {
    this.__designer__.on(NeedRecordEvents, d => {
      if (this.actions.length < this.maxRecordTimes) {
        // 如果当前操作为最后一步
        // console.log(d, 'd')
        if (this.checkIsLastStep()) {
          this.actions.push({
            type: d.type,
            data: cloneDeep(d.data),
            timestamp: +new Date()
          })
          this._index++
          this.vueInstance.activePrev()
        } else {
          // 如果当前操作不是最后一步 即之前点击了上一步
          // 将actions里指针后面的操作都删除掉
          this.actions.push({
            type: d.type,
            data: cloneDeep(d.data),
            timestamp: +new Date()
          })
          this.actions.splice(this._index, this.actions.length - this._index)
          this._index = this.actions.length - 1
          this.vueInstance.activePrev()
        }
      }
    })
  }

  /**
   * 检查是不是最后一步
   * @returns {boolean}
   */
  checkIsLastStep() {
    return this._index === this.actions.length - 1
  }

  /**
   * 上一步
   */
  doLastStep() {
    console.log(this.actions, 'ac', this._index)
    if (this.actions.length && this._index > -1) {
      const currentAction = this.actions[this._index]
      console.log(currentAction, 'in doLastStep')
      if (currentAction.type === CANVAS_ACTIONS_APPEND) {
        // todo
      } else if (currentAction.type === CANVAS_ACTIONS_DELETE) {
        // todo
      } else if (currentAction.type === ATTRPANEL_SET_ATTR) {
        // todo
      }
      this._index--
      if (this._index === -1) {
        this.vueInstance.deactivePrev()
      } else if (this._index < this.actions.length - 1) {
        this.vueInstance.activeNext()
      }
    }
  }

  /**
   * 下一步
   */
  doNextStep() {
    if (this.actions.length && this._index < this.actions.length - 1) {
      console.log(this._index, 'in doNextStep')
      const currentAction = this.actions[this._index]
      if (currentAction.type === CANVAS_ACTIONS_APPEND) {
      } else if (currentAction.type === CANVAS_ACTIONS_DELETE) {
      } else if (currentAction.type === ATTRPANEL_SET_ATTR) {
      }
      this._index++
    }
    if (this._index === this.actions.length - 1) {
      this.vueInstance.deactiveNext()
    }
  }
}
