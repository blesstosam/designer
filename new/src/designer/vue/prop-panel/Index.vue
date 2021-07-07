<style>
.prop-panel .dis-flex {
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;
  align-items: center;
}
.prop-panel .dis-flex > span {
  width: 100px;
  line-height: 36px;
}
.prop-panel .el-collapse-item {
  padding: 0 4px;
}
.prop-panel .el-collapse-item__content {
  padding-bottom: 12px;
}
</style>

<template>
  <div class="prop-panel">
    <el-collapse v-model="activeNames">
      <el-collapse-item
        v-for="item in formList.configs"
        :key="item.id"
        :title="item.title"
        :name="item.id"
      >
        <div v-for="_item in item.children" :key="_item.id">
          <!-- input -->
          <div v-if="_item.formType === FormTypes.Input" class="dis-flex">
            <span>{{ _item.title }}</span>
            <el-input
              style="width: 193px"
              :placeholder="_item.description || '请输入'"
              size="medium"
              v-model="_item.value"
              @input="handleChange(_item, $event)"
            />
          </div>

          <!-- input-number -->
          <div v-if="_item.formType === FormTypes.InputNumber" class="dis-flex">
            <span>{{ _item.title }}</span>
            <el-input-number
              style="width: 193px"
              :placeholder="_item.description || '请输入'"
              size="medium"
              v-model="_item.value"
              @input="handleChange(_item, $event)"
            />
          </div>

          <!-- textarea -->
          <div v-if="_item.formType === FormTypes.TextArea" class="dis-flex">
            <span>{{ _item.title }}</span>
            <el-input
              type="textarea"
              :rows="3"
              style="width: 193px"
              :placeholder="_item.description || '请输入'"
              v-model="_item.value"
              @input="handleChange(_item, $event)"
            />
          </div>

          <!-- select -->
          <div v-else-if="_item.formType === FormTypes.Select" class="dis-flex">
            <span>{{ _item.title }}</span>
            <el-select
              :disabled="checkDisabled(_item, item.children)"
              size="medium"
              :placeholder="_item.description || '请选择'"
              v-model="_item.value"
              @change="handleChange(_item, $event)"
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

          <div v-else-if="_item.formType === FormTypes.Switch" class="dis-flex">
            <span>{{ _item.title }}</span>
            <el-switch
              v-model="_item.value"
              active-color="#13ce66"
              inactive-color="#ccc"
              @change="handleChange(_item, $event)"
            />
          </div>

          <!-- 文字风格 -->
          <div v-else-if="_item.formType === FormTypes.TextStyle" class="dis-flex">
            <span>{{ _item.title }}</span>
            <text-style v-model="_item.value" @change="handleChange(_item, $event)" />
          </div>

          <!-- 文字装饰 -->
          <div v-else-if="_item.formType === FormTypes.TextDecoration" class="dis-flex">
            <span>{{ _item.title }}</span>
            <text-decoration v-model="_item.value" @change="handleChange(_item, $event)" />
          </div>

          <!-- 内容对齐 -->
          <div v-else-if="_item.formType === FormTypes.VerticalAlign" class="dis-flex">
            <span>{{ _item.title }}</span>
            <vertical-align
              v-model="_item.value"
              :options="_item.options"
              @change="handleChange(_item, $event)"
            />
          </div>

          <!-- 文字对齐 -->
          <div v-else-if="_item.formType === FormTypes.RowAlign" class="dis-flex">
            <span>{{ _item.title }}</span>
            <row-align
              v-model="_item.value"
              :options="_item.options"
              @change="handleChange(_item, $event)"
            />
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
              @change="handleChange(_item, $event)"
            />
          </div>

          <!-- 颜色选择器 -->
          <div
            :label="_item.title"
            v-else-if="_item.formType === FormTypes.ColorPicker"
            class="dis-flex"
          >
            <span>{{ _item.title }}</span>
            <color-picker v-model="_item.value" @change="handleChange(_item, $event)" />
          </div>

          <!-- 按钮样式 -->
          <div :label="_item.title" v-else-if="_item.formType === FormTypes.BtnStyle">
            <div>{{ _item.title }}</div>
            <btn-style v-model="_item.value" @change="handleChange(_item, $event)" />
          </div>

          <!-- 分栏设置 -->
          <div
            :label="_item.title"
            v-else-if="_item.formType === FormTypes.ColumnSetting"
            style="margin-bottom: 12px"
          >
            <div>{{ _item.title }}</div>
            <column-setting v-model="_item.value" @change="handleChange(_item, $event)" />
          </div>
        </div>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script>
import { reactive, watchEffect } from 'vue'
import { getCurrentViewNodeModel } from '../../config.js'
import TextStyle from './TextStyle.vue'
import BtnStyle from './BtnStyle.vue'
import ColorRadio from './ColorRadio.vue'
import TextDecoration from './TextDecoration.vue'
import RowAlign from './RowAlign.vue'
import VerticalAlign from './VerticalAlign.vue'
import ColorPicker from './ColorPicker.vue'
import ColumnSetting from './ColumnSetting.vue'
import { FormTypes } from './config'

export default {
  name: 'PropPanel',
  components: {
    TextStyle,
    TextDecoration,
    RowAlign,
    VerticalAlign,
    BtnStyle,
    ColorRadio,
    ColorPicker,
    ColumnSetting
  },
  props: ['attr', 'formList'],
  setup(props) {
    const activeNames = reactive([])

    watchEffect(() => {
      ;(props.formList.configs || []).forEach((i) => {
        activeNames.push(i.id)
      })
    })

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
      activeNames,
      FormTypes
    }
  },
  computed: {
    designer() {
      return this.attr.__designer__
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
          // value 可能为对象
          const _val = typeof conItem.value === 'object' ? conItem.value.value : conItem.value
          if (ifCon[k].const && ifCon[k].const !== _val) {
            flag = false
          } else if (ifCon[k].pattern && !ifCon[k].pattern.test(_val)) {
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
    handleChange(item, val) {
      const currentNode = getCurrentViewNodeModel()
      this.canvas.patch(currentNode.$el, item, val)
    }
  }
}
</script>
