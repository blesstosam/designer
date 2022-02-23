import { cssProperty } from '../cssProperty'

export function changeProps(newProps, oldProps) {
  for (const k in newProps) {
    if (cssProperty[k]) {
      oldProps.style[k] = newProps[k]
    } else {
      oldProps[k] = newProps[k]
    }
  }
}
