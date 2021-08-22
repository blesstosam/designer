// -----------------------------------------------------------
// | insertType      | append | prepend | after    | before  |
// -----------------------------------------------------------
export const InsertTypes = {
  // value 要和 $及Node 的方法对应上
  APPEND: 'append',
  PREPEND: 'prepend',
  AFTER: 'after',
  BEFORE: 'before'
}

// 是否是 APPEND|PREPEND 类型操作
export function isPendType(type) {
  return type === InsertTypes.APPEND || type === InsertTypes.PREPEND
}