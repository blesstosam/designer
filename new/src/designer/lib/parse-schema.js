import { _forEach } from './util'

// rules 参考 async-validator
// https://github.com/yiminghe/async-validator
const RulesTypes = {
  type: 'type',
  required: 'required',
  maxLength: 'max',
  minLength: 'min',
  maximum: 'max',
  minimum: 'min',
  pattern: 'pattern'
}
const MessageTypes = {
  type: val => `类型要为${val}`,
  required: () => '必填',
  maxLength: val => `长度不能超过${val}`,
  minLength: val => `长度不能小于${val}`,
  maximum: val => `数字不能超过${val}`,
  minimum: val => `数字不能小于${val}`,
  pattern: () => `格式不正确`
}

/**
 * 将属性面板解析成一唯数组结构 按表单类型进行渲染
 * 1. 解析表单类型 input，select，radio，checkbox
 *     字体样式选择器(特殊的checkbox=>textStyle)
 *     字体装饰
 *     字体对齐
 *     颜色单选器（特殊的radio=>colorRadio）
 *     颜色选择器（特殊，colorPicker)
 *     按钮样式选择器（特殊，btnStyle）
 * 2. 将表单的约束解析出来并绑定rules
 * 3. 解析默认值 const|default
 * 4. 解析出 model: value用于v-model绑定
 * @param {*} schema 
 * @returns 
 */
export function parse(schema) {
  const defination = {}

  function getVal(item, obj, key) {
    const val =
      item.const !== undefined ? item.const : item.default !== undefined ? item.default : null
    if (val != null) {
      if (/^{.*}$/.test(val)) {
        // js 表达式计算再返回
        Object.defineProperty(obj, key, {
          get: () => {
            // 将所有字段处理成对象形式
            const map = {}
            for (const cfg of defination.configs) {
              for (const item of cfg.children || []) {
                map[item.id] = item.value
              }
            }
            const code = 'return ' + val.slice(1, val.length - 1)
            return eval(`(function(formData){;${code}})(map)`)
          }
        })
      } else {
        obj[key] = val
      }
    } else {
      obj[key] = null
    }
  }
  function getRules(item) {
    const rules = {}
    if (item.value) {
      rules[item.id.const] = []
      _forEach(item.value, (ruleVal, rule) => {
        if (RulesTypes[rule]) {
          rules[item.id.const].push({
            [RulesTypes[rule]]: ruleVal,
            message: MessageTypes[rule](ruleVal)
          })
        }
      })
    }
    return rules
  }
  function getOpts(item) {
    if (item.value && item.value.enum && item.value.enumLabel) {
      return item.value.enum.map((i, index) => ({ label: item.value.enumLabel[index], value: i }))
    }
  }

  function _parse(_schema, _def) {
    _def = _def || {}
    if (_schema.type === 'object' && _schema.properties) {
      _schema.title && (_def.title = _schema.title)
      _schema.description && (_def.description = _schema.description)
      _forEach(_schema.properties, (item, property) => {
        if (item.type !== 'array' && item.type !== 'object') {
          getVal(item, _def, property)
          _def.rules = getRules(_schema.properties)
          _def.options = getOpts(_schema.properties)
        } else {
          if (item.type === 'array') {
            _def[property] = item.default || []
          } else if (item.type === 'object') {
            _def[property] = item.default || {}
          }
          _parse(item, _def[property])
        }
      })
    } else if (_schema.type === 'array' && _schema.items) {
      // 只处理 items 为数组的情况
      if (Array.isArray(_schema.items)) {
        _schema.items.forEach((item, index) => {
          _def.push(_parse(item))
        })
      }
    }
    return _def
  }

  _parse(schema, defination)
  return defination
}
