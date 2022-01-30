import { Event, EVENT_TYPES } from './Event'

// export const KEYCODE_C = 67
export const KEYCODE_S = 83
export const KEYCODE_Y = 89
export const KEYCODE_Z = 90

const { KEYBOARD_REDO, KEYBOARD_UNDO, KEYBOARD_SAVE } = EVENT_TYPES

export class KeyBoard extends Event {
  constructor() {
    super()
  }

  // type: keydown|keyup
  bind(type) {
    this.unbind(type)
    const cb = e => {
      this._run(e)
    }
    this.cb = this.cb || cb
    window.addEventListener(type, cb)
  }

  unbind(type) {
    this.cb && window.removeEventListener(type, this.cb)
  }

  onRedo(cb) {
    this.add(KEYBOARD_REDO, cb)
  }
  onUndo(cb) {
    this.add(KEYBOARD_UNDO, cb)
  }
  onSave(cb) {
    this.add(KEYBOARD_SAVE, cb)
  }

  add(type, cb) {
    if (![KEYBOARD_REDO, KEYBOARD_UNDO, KEYBOARD_SAVE].includes(type)) return
    this.on(type, cb)
  }

  // 分发事件
  _run($event) {
    let type = null
    if (isCmd($event) && getKeyCode($event) === KEYCODE_S) {
      // (CTRL|CMD) + S
      type = KEYBOARD_SAVE
    } else if (isCmd($event) && getKeyCode($event) === KEYCODE_Z) {
      // (CTRL|CMD) + Z
      type = KEYBOARD_UNDO
    } else if (isCmd($event) && getKeyCode($event) === KEYCODE_Y) {
      // (CTRL|CMD) + Y
      type = KEYBOARD_REDO
    }
    if (!type) return

    $event.preventDefault()

    this._beforeEve($event)
    const fns = this.subs.get(type) || []
    for (const fn of fns) {
      fn($event)
    }
    this._afterEve($event)
  }

  _beforeEve($event) {
    // console.log('_beforeEve...', $event)
  }

  _afterEve($event) {}
}

export function isCmd(event) {
  // ensure we don't react to AltGr
  // (mapped to CTRL + ALT)
  if (event.altKey) {
    return false
  }

  return event.ctrlKey || event.metaKey
}

export function getKeyCode(event) {
  return event.which || event.keyCode
}
