import { _forEach } from "./util"

const ValidRules = {
  type: 'type',
  maxLength: 'max',
  minLength: 'min',
  maximum: 'max',
  minimum: 'min',
  pattern: 'pattern'
}

/**
 * 解析 schema 为vue可以渲染的组件
 */
export function parse(schema) {
  const defination = {}
  function _getVal(item) {
    const { type } = item
    if (item.const !== undefined) return item.const
    if (item.default !== undefined) return item.default
    if (type === 'string') return ''
    if (type === 'number') return 0
    if (type === 'boolean') return true
  }
  function _getRules(item) {
    const rules = {}
    // debugger
    if (item.value) {
      rules[item.id.const] = []
      _forEach(item.value, (ruleVal, rule) => {
        // debugger
        if (ValidRules[rule]) {
          rules[item.id.const].push({ [ValidRules[rule]]: ruleVal, message: 'invalid' })
        }
      })
    }
    return rules
  }
  function _getOpts(item) {
    if (item.value && item.value.enum) {
      const arr = []
      item.value.enum.forEach(i => {
        if (i.label) {
          arr.push(i)
        } else {
          arr.push({ label: i, value: i })
        }
      })
      return arr
    }
  }
  function _getObjVal(item) {
    const itemVal = item.default || item.value
    if (itemVal) {
      return typeof itemVal === 'object' ? itemVal.value : itemVal
    }
    return {}
  }

  // TODO 和 parsearray 代码重复 需要优化一下
  function _parse(_schema, _def) {
    if (_schema.type === 'object' && _schema.properties) {
      _def.title = _schema.title
      _def.description = _schema.description
      _forEach(_schema.properties, (item, property) => {
        // 简单类型
        if (item.type !== 'array' && item.type !== 'object') {
          _def[property] = _getVal(item)
          _def.rules = _getRules(_schema.properties)
          _def.options = _getOpts(_schema.properties)
          // 处理条件
          if (_schema.if && _schema.then && _schema.else) {
            _def.if = _schema.if
            _def.then = _schema.then
            _def.else = _schema.else
          }
        } else {
          // 复杂类型
          if (item.type === 'array') {
            _def[property] = item.default || []
          } else {
            _def[property] = _getObjVal(item)
          }
          _parse(item, _def[property])
        }
      })
    } else if (_schema.type === 'array' && _schema.items) {
      // debugger
      if (Array.isArray(_schema.items)) {
        _schema.items.forEach((item, index) => {
          _def.push(_parseArray(item))
        })
      } else {
        _def = _schema.items.enum
      }
    }
  }
  function _parseArray(_schema) {
    // TODO 怎么解析数组 另外网上找找解析 json schema 的算法
    const _obj = { title: _schema.title, description: _schema.description }
    if (_schema.type === 'object' && _schema.properties) {
      _forEach(_schema.properties, (item, property) => {
        if (item.type !== 'array' && item.type !== 'object') {
          _obj[property] = _getVal(item)
          _obj.rules = _getRules(_schema.properties)
          _obj.options = _getOpts(_schema.properties)
          // 处理条件
          // debugger
          if (_schema.if && _schema.then && _schema.else) {
            _obj.if = _schema.if
            _obj.then = _schema.then
            _obj.else = _schema.else
          }
        } else {
          // debugger
          if (item.type === 'array') {
            _obj[property] = item.default || []
          } else {
            _obj[property] = _getObjVal(item)
          }
          _parse(item, _obj[property])
        }
      })
    } else if (_schema.type === 'array' && _schema.items) {
      // TODO
    }
    return _obj
  }

  _parse(schema, defination)
  return defination
}