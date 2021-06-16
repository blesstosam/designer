<style>
.attr-panel .desc {
  padding: 12px 10px;
  background-color: #e9e9e9;
}
.attr-panel .dis-flex {
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;
}
.attr-panel .dis-flex > span {
  width: 100px;
  line-height: 36px;
}
.attr-panel .el-collapse-item {
  padding: 0 4px;
}
.attr-panel .el-collapse-item__content {
  padding-bottom: 12px;
}
</style>

<template>
  <div class="attr-panel">
    <div v-if="attrs.title">
      <div class="desc">
        <div>{{ formList.title }}</div>
        <div>{{ formList.description }}</div>
      </div>

      <el-collapse v-model="activeNames">
        <el-collapse-item
          v-for="item in formList.configs"
          :key="item.id"
          :title="item.title"
          :name="item.id"
        >
          <div v-for="_item in item.children" :key="_item.id">
            <!-- input -->
            <div v-if="_item.formType === 'input'" class="dis-flex">
              <span>{{ _item.title }}</span>
              <el-input
                style="width: 193px"
                :placeholder="_item.description || '请输入'"
                size="medium"
                v-model="_item.value"
                @input="handleInputChange(_item, $event)"
              ></el-input>
            </div>

            <!-- select -->
            <div v-else-if="_item.formType === 'select'" class="dis-flex">
              <span>{{ _item.title }}</span>
              <el-select
                :disabled="checkDisabled(_item, item.children)"
                size="medium"
                :placeholder="_item.description || '请选择'"
                v-model="_item.value"
                @change="handleSelectChange(_item, $event)"
              >
                <el-option
                  v-for="opt in _item.options"
                  :key="opt.value"
                  :label="opt.label"
                  :value="opt.value"
                >
                </el-option>
              </el-select>
            </div>

            <!-- 文字风格 -->
            <div v-else-if="_item.formType === FormTypes.TextStyle" class="dis-flex">
              <span>{{ _item.title }}</span>
              <text-style v-model="_item.value" @change="handleStyleChange(_item, $event)" />
            </div>

            <!-- 文字装饰 -->
            <div v-else-if="_item.formType === FormTypes.TextDecoration" class="dis-flex">
              <span>{{ _item.title }}</span>
              <text-decoration
                v-model="_item.value"
                @change="handleDecorationChange(_item, $event)"
              />
            </div>

            <!-- 文字对齐 -->
            <div v-else-if="_item.formType === FormTypes.TextAlign" class="dis-flex">
              <span>{{ _item.title }}</span>
              <text-align v-model="_item.value" @change="handleAlignChange(_item, $event)" />
            </div>

            <!-- 颜色单选 -->
            <div
              :label="_item.title"
              v-else-if="_item.formType === FormTypes.ColorRadio"
              class="dis-flex"
            >
              <span>{{ _item.title }}</span>
              <color-radio
                :colorList="_item.options"
                v-model="_item.value"
                @change="haneleColorChange(_item, $event)"
              ></color-radio>
            </div>

            <!-- 颜色选择器 -->
            <div
              :label="_item.title"
              v-else-if="_item.formType === FormTypes.ColorPicker"
              class="dis-flex"
            >
              <span>{{ _item.title }}</span>
              <color-picker v-model="_item.value" @change="handleColorChange(_item, $event)" />
            </div>

            <!-- 按钮样式 -->
            <div :label="_item.title" v-else-if="_item.formType === FormTypes.BtnStyle">
              <div>{{ _item.title }}</div>
              <btn-style
                v-model="_item.value"
                @change="handleBtnStyleChange(_item, $event)"
              ></btn-style>
            </div>
          </div>
        </el-collapse-item>
      </el-collapse>
    </div>
    <div v-else>暂未选中组件！</div>
  </div>
</template>

<script>
import { computed, reactive, watchEffect } from 'vue'
import { _forEach } from '../../lib/util.js'
import { getCurrentViewNodeModel } from '../../config.js'
import TextStyle from './TextStyle.vue'
import BtnStyle from './BtnStyle.vue'
import ColorRadio from './ColorRadio.vue'
import TextDecoration from './TextDecoration.vue'
import TextAlign from './TextAlign.vue'
import ColorPicker from './ColorPicker.vue'

export const FormTypes = {
  BtnStyle: 'btn-style',
  TextStyle: 'text-style',
  TextDecoration: 'text-decoration',
  TextAlign: 'text-align',
  ColorRadio: 'color-radio',
  ColorPicker: 'color-picker'
}

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
  function _getVal(type) {
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
          _def[property] = item.const || item.default || _getVal(item.type)
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
            _def[property] = []
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
          _obj[property] = item.const || item.default || _getVal(item.type)
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
          if (item.type === 'array') {
            _obj[property] = []
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

// TODO
// 属性解析成props，style等对象传递给组件
// 比如<Text>组件大多为style的设置，将其转化为style对象直接传递给<Text>组件

export default {
  name: 'AttrPanel',
  components: {
    TextStyle,
    TextDecoration,
    TextAlign,
    BtnStyle,
    ColorRadio,
    ColorPicker
  },
  setup() {
    const data = getCurrentViewNodeModel()
    const attrs = reactive(data.attrs || {})
    const formList = reactive(parse(data.attrs || {}))
    const activeNames = reactive([])

    watchEffect(() => {
      const parsed = parse(attrs)
      for (const k in parsed) {
        formList[k] = parsed[k]
      }
      ;(formList.configs || []).forEach(i => {
        activeNames.push(i.id)
      })
    })

    const setData = d => {
      console.log(d, '--------setData--------')
      for (const k in d) {
        data[k] = d[k]
      }
      for (const k in d.attrs) {
        attrs[k] = d.attrs[k]
      }
    }

    // TODO 解析json schema 渲染成属性面板
    // 将属性面板解析成一唯数组结构 按表单类型进行渲染
    // 1. 解析表单类型 input，select，radio，checkbox
    //    字体样式选择器(特殊的checkbox=>textStyle)
    //    字体装饰
    //    字体对齐
    //    颜色单选器（特殊的radio=>colorRadio）
    //    颜色选择器（特殊，colorPicker)
    //    按钮样式选择器（特殊，btnStyle）
    // 2. 将表单的约束解析出来并绑定rules
    // 3. 解析默认值 const|default
    // 4. 解析出 model: value用于v-model绑定

    return {
      attrs,
      formList,
      activeNames,
      setData,
      FormTypes
    }
  },
  computed: {
    designer() {
      return this.__attr__.__designer__
    },
    canvas() {
      return this.designer.__canvas__
    }
  },
  methods: {
    // 表单联动效果
    checkDisabled(item, array) {
      if (!item) return false
      if (!item.if || !item.then || !item.else) return false

      let flag = true
      const ifCon = item.if.properties
      Object.keys(ifCon).forEach(k => {
        const conItem = array.find(i => i.id === k)
        if (conItem) {
          if (ifCon[k].const && ifCon[k].const !== conItem.value) {
            flag = false
          } else if (ifCon[k].pattern && !ifCon[k].pattern.test(conItem.value)) {
            flag = false
          }
        }
      })
      if (flag) {
        return !item.then.properties.show
      } else {
        return !item.else.properties.show
      }
    },
    handleInputChange(item, val) {
      const currentNode = getCurrentViewNodeModel()
      this.canvas.patch(currentNode.$el, item, val)
    },
    handleSelectChange(item, val) {
      const currentNode = getCurrentViewNodeModel()
      this.canvas.patch(currentNode.$el, item, val)
    },
    handleColorChange(item, val) {
      const currentNode = getCurrentViewNodeModel()
      this.canvas.patch(currentNode.$el, item, val)
    },
    handleStyleChange(item, val) {
      const currentNode = getCurrentViewNodeModel()
      this.canvas.patch(currentNode.$el, item, val)
    },
    handleDecorationChange(item, val) {
      const currentNode = getCurrentViewNodeModel()
      this.canvas.patch(currentNode.$el, item, val)
    },
    handleAlignChange(item, val) {
      const currentNode = getCurrentViewNodeModel()
      this.canvas.patch(currentNode.$el, item, val)
    },
    haneleColorChange(item, val) {
      const currentNode = getCurrentViewNodeModel()
      this.canvas.patch(currentNode.$el, item, val)
    },
    handleBtnStyleChange(item, val) {
      const currentNode = getCurrentViewNodeModel()
      this.canvas.patch(currentNode.$el, item, val)
    }
  }
}
</script>
