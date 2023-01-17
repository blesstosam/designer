import { computePosition, offset } from '@floating-ui/dom'
import { $ } from './lib/dom'

export class Tooltip {
  constructor(trigger, tooltip) {
    this.trigger = trigger
    this.tooltip = tooltip

    this.initStyle()
    this.initListener()
    this.initTooltipListener()
  }

  initStyle() {
    $(this.tooltip).style({
      display: 'none',
      width: 'max-content',
      position: 'absolute',
      top: 0,
      left: 0,
      borderRadius: '4px'
    })
  }

  initListener() {
    ;[
      ['mouseenter', this.show.bind(this)],
      ['mouseleave', this.hide.bind(this)],
      ['focus', this.show.bind(this)],
      ['blur', this.hide.bind(this)]
    ].forEach(([event, listener]) => {
      this.trigger.addEventListener(event, listener)
    })
  }

  initTooltipListener() {
    this.tooltip.addEventListener('mouseenter', () => {
      this.inTooltip = true
    })
    this.tooltip.addEventListener('mouseleave', () => {
      this.inTooltip = false
      this.hide()
    })
    this.tooltip.addEventListener('click', () => {
      this.hideImmediately()
    })
  }

  changeTooltip(newTooltip) {
    this.tooltip = newTooltip
    this.initStyle()
    this.initTooltipListener()
  }

  update() {
    computePosition(this.trigger, this.tooltip, {
      middleware: [offset(2)]
    }).then(({ x, y }) => {
      Object.assign(this.tooltip.style, {
        left: `${x}px`,
        top: `${y}px`
      })
    })
  }

  show() {
    this.tooltip.style.display = 'block'
    this.update()
  }

  hide() {
    setTimeout(() => {
      if (!this.inTooltip) {
        this.tooltip.style.display = 'none'
      }
    }, 200)
  }
  hideImmediately() {
    this.tooltip.style.display = 'none'
  }
}
