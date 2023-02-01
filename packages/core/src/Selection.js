import { ResizeObserver } from '@juggle/resize-observer'
import { Tooltip } from './Tooltip'
import { EVENT_TYPES } from './Event'
import { $ } from './lib/dom'

const {
  COMPONENTS_DRAG_START,
  COMPONENTS_DROPED,
  DRAG_END,
  SELECTION_UPDATED,
  SELECTION_DEL_CLICK,
  SELECTION_COPY_CLICK,
  SELECTION_MOVE_START,
  SELECTION_ACTIVED,
  SELECTION_DEACTIVED
} = EVENT_TYPES

const BTNS_WIDTH = 119

export const BORDER_COLOR = '#409EFF'
const SELECTION_BORDER_STYLE = `1px solid ${BORDER_COLOR}`

export class Selection {
  constructor(desginer) {
    window.selection = this
    this.__designer__ = desginer
    this.DISTANCE_TO_TOP = this.__canvas__.y + 25 // 距离顶部距离,25为按钮的高度
    this.DISTANCE_TO_LEFT = this.__canvas__.x // 距离左边距离
    this.node = null

    this.recEl = null
    this.btnWrap = null
    this.recTitle = null
    this.dropdown = null
    this.recDelBtn = null
    this.recCopyBtn = null
    this.recMoveBtn = null
    this.coverEl = null

    this.btnVPos = 'top'
    this.btnHPos = 'right'

    this.initListener()

    // 还有一种hack方法 使用iframe的resize https://www.npmjs.com/package/simple-element-resize-detector
    this.observer = new ResizeObserver((entries, observer) => {
      if (this.initedOb) {
        this.update() // 选中的时候dom还没生成，宽高都是0，需要在dom生成后更新选中框的尺寸
      } else {
        this.initedOb = true
      }
    })
  }

  get __canvas__() {
    return this.__designer__.__canvas__
  }

  get __dragon__() {
    return this.__designer__.__dragon__
  }

  get offset() {
    const { $el } = this.node
    const domRect = $el.getBoundingClientRect()
    return {
      width: domRect.width,
      height: domRect.height,
      top: domRect.top,
      left: domRect.left
    }
  }

  getParents(node) {
    const nodeParents = []
    const get = (_node) => {
      if (_node.parent) {
        nodeParents.push(_node.parent)
        get(_node.parent)
      }
    }
    get(node)
    return nodeParents
  }

  initListener() {
    this._cb = () => {
      if (this.recEl && this.node) this.update()
    }
    window.addEventListener('resize', this._cb)

    this.__designer__.on(COMPONENTS_DRAG_START, () => {
      this.recEl.style.zIndex = -1
    })
    this.__designer__.on([COMPONENTS_DROPED, DRAG_END], () => {
      this.recEl.style.zIndex = 2
    })
  }

  observe() {
    const { $el } = this.node
    this.observer.observe($el.children[0])
  }
  disconnect() {
    this.observer.disconnect()
  }

  // btnVPos = bottom | top
  // btnHPos = left | right
  decideBtnPos(top, right) {
    this.btnVPos = top < this.DISTANCE_TO_TOP ? 'bottom' : 'top'
    this.btnHPos = right < this.DISTANCE_TO_LEFT + BTNS_WIDTH ? 'left' : 'right'
  }

  create(node) {
    this.node = node
    const offset = this.offset
    this.decideBtnPos(offset.top, offset.width + offset.left)
    this._createSelection()
    if (!node.isRoot) {
      this._createBtnWrap()
      this._createTitle()
      this._createBtn('delete')
      this._createBtn('move')
      this._createBtn('copy')
    }
    this.observe()
    this.__designer__.emit(SELECTION_ACTIVED, node)
  }

  update(node) {
    // 如果有node说明点击了不同的元素 需要重新监听
    if (node) {
      this.node = node
      this.disconnect()
      this.observe()
    }

    const offset = this.offset
    this.decideBtnPos(offset.top, offset.width + offset.left)
    this._updateSelection(offset)

    if (this.node.isRoot) {
      this._hideBtnWrap()
    } else {
      if (this.btnWrap) {
        this._showBtnWrap()
        this._updateBtnWrap(offset)
        this._updateTitle(offset)
        this._updateBtn('delete', offset)
        this._updateBtn('move', offset)
        this._updateBtn('copy', offset)
      } else {
        this._createBtnWrap()
        this._createTitle()
        this._createBtn('delete')
        this._createBtn('move')
        this._createBtn('copy')
      }
    }

    this.__designer__.emit(SELECTION_UPDATED, node)
  }

  remove() {
    this.recEl.remove()
    window.removeEventListener('resize', this._cb)
    this.__designer__.emit(SELECTION_DEACTIVED)
  }

  _createSelection() {
    const { width, height } = this.offset
    const div = (this.recEl = $('<div>')
      .style({
        width: width + 'px',
        height: height + 'px',
        top: 0,
        left: 0,
        position: 'absolute',
        border: SELECTION_BORDER_STYLE,
        zIndex: 2,
        boxSizing: 'border-box',
        pointerEvents: 'none'
      })
      .addClass('selection').el)
    this.node.$el.appendChild(div)
    return div
  }

  _updateSelection(offset) {
    const { width, height } = offset
    this.node.$el.appendChild(this.recEl)
    $(this.recEl).style({
      width: width + 'px',
      height: height + 'px',
      top: 0,
      left: 0
    })
  }

  _createCover() {
    const { width, height, left, top } = this.offset
    $(this.recEl).style({ border: 'none' })
    const el = (this.coverEl = $('<div>').style({
      position: 'absolute',
      width: width + 'px',
      height: height + 'px',
      top: top + 'px',
      left: left + 'px',
      background: 'rgba(23,142,230,0.2)',
      zIndex: 3
    }).el)
    document.body.appendChild(el)
  }

  _removeCover() {
    this.coverEl && this.coverEl.remove()
    this.coverEl = null
    $(this.recEl).style({ border: SELECTION_BORDER_STYLE })
  }

  _createBtnWrap() {
    const div = (this.btnWrap = $('<div>').style({
      position: 'absolute',
      ...(this.btnHPos === 'left' ? { left: 0, right: null } : { left: null, right: 0 }),
      top: this.btnVPos === 'top' ? '-20px' : `${this.offset.height}px`,
      height: '20px',
      width: '99px',
      lineHeight: '21px',
      pointerEvents: 'all'
    }).el)
    // remove hover!
    $(div).hover(() => this.__canvas__.hover?.remove())
    this.recEl.appendChild(div)
    return div
  }

  _updateBtnWrap(offset) {
    $(this.btnWrap).style({
      ...(this.btnHPos === 'left' ? { left: 0, right: null } : { left: null, right: 0 }),
      top: this.btnVPos === 'top' ? '-20px' : `${offset.height}px`,
      width: '99px'
    })
  }

  _hideBtnWrap() {
    this.btnWrap && (this.btnWrap.style.display = 'none')
  }
  _showBtnWrap() {
    this.btnWrap && (this.btnWrap.style.display = 'block')
  }

  _createTitle() {
    const div = (this.recTitle = $('<div>')
      .style({
        position: 'absolute',
        ...this._getBtnHPos('title'),
        top: 0,
        cursor: 'pointer',
        background: '#1989fa',
        color: '#fff',
        height: '18px',
        width: '50px',
        textAlign: 'center',
        lineHeight: '19px',
        fontSize: '12px',
        whiteSpace: 'nowrap',
        fontWeight: 500
      })
      .text(this.node.title).el)
    // if (this.node.icon.type === 'img') {
    //   const img = $('img').attr('src', this.node.icon.value).style({
    //     width: '20px',
    //     background:'#1989fa'
    //   }).el
    //   this.btnWrap.appendChild(img)
    // }
    this.btnWrap.appendChild(div)
    return div
  }

  _createDropdown() {
    const parents = this.getParents(this.node)
    this.dropdown && this.dropdown.remove()
    const wrap = (this.dropdown = $('<div>').el)
    for (const node of parents) {
      const dropdownItem = $('<div>').text(node.title).style({
        fontSize: '12px',
        background: '#1989fa',
        color: '#fff',
        cursor: 'pointer',
        marginBottom: '2px',
        height: '18px',
        width: '50px',
        textAlign: 'center',
      }).el
      dropdownItem.addEventListener('click', () => {
        this.__canvas__.handleNodeboxSelect(node)
      })
      wrap.appendChild(dropdownItem)
    }
    document.body.appendChild(wrap)
    return wrap
  }

  _updateTitle() {
    if (this.tooltip) {
      this.tooltip.changeTooltip(this._createDropdown())
    } else {
      this.tooltip = new Tooltip(this.recTitle, this._createDropdown())
    }
    $(this.recTitle)
      .text(this.node.title)
      .style({ ...this._getBtnHPos('title') })
  }

  _createBtn(type) {
    const div = $('<div>').style({
      position: 'absolute',
      ...this._getBtnHPos(type),
      top: 0,
      cursor: type === 'move' ? 'move' : 'pointer'
    }).el
    const img = this._createSvg(type)
    div.appendChild(img)
    this.btnWrap.appendChild(div)
    $(div)
      .hover(
        () => $(div).style({ transform: 'scale(1.1)' }),
        () => $(div).removeStyle('transform')
      )
      .attr('draggable', true)
    const obj = {
      copy: 'recCopyBtn',
      delete: 'recDelBtn',
      move: 'recMoveBtn'
    }
    this[obj[type]] = div
    if (type === 'delete' || type === 'copy') {
      div.addEventListener('click', (e) => {
        e.stopPropagation()
        const eType = type === 'delete' ? SELECTION_DEL_CLICK : SELECTION_COPY_CLICK
        this.__designer__.emit(eType, {
          type: eType,
          data: this.node
        })
      })
    } else if (type === 'move') {
      this.__designer__.emit(SELECTION_MOVE_START, {
        type: SELECTION_MOVE_START,
        data: this.node
      })
      this.__dragon__.onDragStart(div, ({ renderDragImg, setData }) => {
        renderDragImg(this.node.title)
        setData('data', this.node)
        setData('isMove', true)
        this._createCover()
      })
      this.__dragon__.onDragEnd(div, () => {
        this._removeCover()
      })
    }

    return div
  }

  _createSvg(type) {
    const svg = $('<svg>')
      .attr({
        viewBox: '0 0 1024 1024',
        width: 14,
        height: 14
      })
      .style({
        background: '#1989fa',
        padding: '2px'
      }).el
    if (type === 'delete') {
      const path1 = $('<path>').attr({
        d: 'M360 184h-8c4.4 0 8-3.6 8-8v8h304v-8c0 4.4 3.6 8 8 8h-8v72h72v-80c0-35.3-28.7-64-64-64H352c-35.3 0-64 28.7-64 64v80h72v-72z',
        fill: '#fff'
      }).el
      const path2 = $('<path>').attr({
        d: 'M864 256H160c-17.7 0-32 14.3-32 32v32c0 4.4 3.6 8 8 8h60.4l24.7 523c1.6 34.1 29.8 61 63.9 61h454c34.2 0 62.3-26.8 63.9-61l24.7-523H888c4.4 0 8-3.6 8-8v-32c0-17.7-14.3-32-32-32zM731.3 840H292.7l-24.2-512h487l-24.2 512z',
        fill: '#fff'
      }).el
      svg.appendChild(path1)
      svg.appendChild(path2)
    }
    if (type === 'move') {
      const path1 = $('<path>').attr({
        d: 'M921.6 492.8l-121.6-121.6c-12.8-12.8-32-12.8-44.8 0s-12.8 32 0 44.8l66.133333 66.133333h-277.333333v-277.333333l66.133333 66.133333c6.4 6.4 14.933333 8.533333 23.466667 8.533334s17.066667-2.133333 23.466667-8.533334c12.8-12.8 12.8-32 0-44.8l-121.6-121.6c-12.8-12.8-32-12.8-44.8 0l-121.6 121.6c-12.8 12.8-12.8 32 0 44.8 12.8 12.8 32 12.8 44.8 0l66.133333-66.133333v277.333333h-277.333333l66.133333-66.133333c12.8-12.8 12.8-32 0-44.8-12.8-12.8-32-12.8-44.8 0l-121.6 121.6c-12.8 12.8-12.8 32 0 44.8l121.6 121.6c6.4 6.4 14.933333 8.533333 23.466667 8.533333s17.066667-2.133333 23.466666-8.533333c12.8-12.8 12.8-32 0-44.8l-66.133333-66.133333h277.333333v277.333333l-66.133333-66.133333c-12.8-12.8-32-12.8-44.8 0s-12.8 32 0 44.8l121.6 121.6c6.4 6.4 14.933333 8.533333 23.466667 8.533333s17.066667-2.133333 23.466666-8.533333l121.6-121.6c12.8-12.8 12.8-32 0-44.8s-32-12.8-44.8 0l-66.133333 66.133333v-277.333333h277.333333l-66.133333 66.133333c-12.8 12.8-12.8 32 0 44.8 6.4 6.4 14.933333 8.533333 23.466667 8.533333s17.066667-2.133333 23.466666-8.533333l121.6-121.6c6.4-6.4 8.533333-14.933333 8.533334-23.466667s-10.666667-14.933333-17.066667-21.333333z',
        fill: '#fff'
      }).el
      svg.appendChild(path1)
    }

    if (type === 'copy') {
      const path1 = $('<path>').attr({
        d: 'M832 64H296c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h496v688c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8V96c0-17.7-14.3-32-32-32z',
        fill: '#fff'
      }).el
      const path2 = $('<path>').attr({
        d: 'M704 192H192c-17.7 0-32 14.3-32 32v530.7c0 8.5 3.4 16.6 9.4 22.6l173.3 173.3c2.2 2.2 4.7 4 7.4 5.5v1.9h4.2c3.5 1.3 7.2 2 11 2H704c17.7 0 32-14.3 32-32V224c0-17.7-14.3-32-32-32zM350 856.2L263.9 770H350v86.2zM664 888H414V746c0-22.1-17.9-40-40-40H232V264h432v624z',
        fill: '#fff'
      }).el
      svg.appendChild(path1)
      svg.appendChild(path2)
    }
    return svg
  }

  _updateBtn(type) {
    const map = {
      delete: this.recDelBtn,
      copy: this.recCopyBtn,
      move: this.recMoveBtn
    }
    $(map[type]).style({ ...this._getBtnHPos(type) })
  }

  _getBtnHPos(type) {
    if (this.btnHPos === 'right') {
      const map = {
        delete: 0,
        copy: '19px',
        move: 19 * 2 + 'px',
        title: 19 * 3 + 'px'
      }
      return { left: null, right: map[type] }
    }
    const map = {
      delete: '77px',
      copy: '53px',
      move: '33px',
      title: 0
    }
    return { left: map[type], right: null }
  }
}
