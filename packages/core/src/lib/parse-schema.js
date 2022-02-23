import { forEach } from './util'

// 1. schema本身能表达表单的数据结构
// 2. schema使用title作为label；description作为placeholder；所有的required的值都为`['value']`
// 3. schema的items字段只支持数组类型
// 4. schema增加了表单类型字段，formType，即表示该字段用什么ui组件去展示
// 5. schema增加了表单显示隐藏字段isShow，默认为true
// 6. schema增加了disabled字段，默认为false
// 7. schema增加了enumLabel字段，用来表达select类型数据的lable
// 8. schema拓展了字段的表达形式：可以为js表达式，为'{}'语法；理论上每个字段都可以使用js表达式
// 9. TODO 解析需要增加根据数据类型字段来自动获取ui类型的逻辑，formType 优先级更高一些
//    比如 string => input; number => inputNumber; enum => select
// 10. TODO 要不要把组件config.js的数据结构改为一维数组的结构，反正这里的ui可以写死，有点类似于阉割版的表单引擎，只是没了表达ui布局的字段

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
      forEach(item.value, (ruleVal, rule) => {
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

  function _parse(schemaData, def) {
    def = def || {}
    if (schemaData.type === 'object' && schemaData.properties) {
      schemaData.title && (def.title = schemaData.title)
      schemaData.description && (def.description = schemaData.description)
      if (schemaData.required && schemaData.required.indexOf('value') > -1) {
        schemaData.properties.value.required = true
      }
      forEach(schemaData.properties, (item, property) => {
        if (item.type !== 'array' && item.type !== 'object') {
          getVal(item, def, property)
          def.rules = getRules(schemaData.properties)
          const opts = getOpts(schemaData.properties)
          opts && (def.options = opts)
        } else {
          if (item.type === 'array') {
            def[property] = item.default || []
          } else if (item.type === 'object') {
            def[property] = item.default || {}
          }
          _parse(item, def[property])
        }
      })
    } else if (schemaData.type === 'array' && schemaData.items) {
      // 只处理 items 为数组的情况
      if (Array.isArray(schemaData.items)) {
        schemaData.items.forEach((item) => {
          def.push(_parse(item))
        })
      }
    }
    return def
  }

  _parse(schema, defination)
  return defination
}
