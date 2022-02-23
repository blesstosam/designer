<style>
.style-panel .dis-flex {
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;
  align-items: center;
}
.style-panel .dis-flex > span {
  width: 100px;
  line-height: 36px;
}
.style-panel .el-collapse-item {
  padding: 0 4px;
}
.style-panel .el-collapse-item__content {
  padding-bottom: 12px;
}
</style>

<template>
  <div class="style-panel">
    <el-collapse v-model="activeNames">
      <el-collapse-item
        v-for="item in filtedFormList"
        :key="item.id"
        :title="item.title"
        :name="item.id"
      >
        <div v-for="_item in item.children" :key="_item.id" style="margin-bottom: 12px;">
          <!-- margin|padding|borderRadius -->
          <div :label="_item.title" v-if="_item.formType === FormTypes.Margin">
            <margin
              :type="_item.id"
              :label="_item.title"
              v-model="_item.value"
              @change="handleChange(_item, $event)"
            />
          </div>

          <!-- border -->
          <div :label="_item.title" v-else-if="_item.formType === FormTypes.Border">
            <border
              :label="_item.title"
              v-model="_item.value"
              @change="handleBorderChange(_item, $event)"
            />
          </div>

          <!-- select -->
          <div v-else-if="_item.formType === FormTypes.Select" class="dis-flex">
            <span>{{ _item.title }}</span>
            <el-select
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

          <!-- 左右对齐 -->
          <div v-else-if="_item.formType === FormTypes.RowAlign" class="dis-flex">
            <span>{{ _item.title }}</span>
            <row-align
              v-model="_item.value"
              :options="_item.options"
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
        </div>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script>
import { computed, watchEffect, reactive } from 'vue'
import Margin from './Margin.vue'
import Border from './Border.vue'
import RowAlign from '../prop-panel/RowAlign.vue'
import ColorPicker from '../prop-panel/ColorPicker.vue'
import TextDecoration from '../prop-panel/TextDecoration.vue'
import TextStyle from '../prop-panel/TextStyle.vue'
import { FormTypes } from '@davincid/core/src/AttrFormTypes'
import { getCurrentViewNodeModel } from '@davincid/core/src/Util'
import { EVENT_TYPES } from '@davincid/core/src/Event'

export default {
  name: 'StylePanel',
  props: ['attr', 'formList'],
  components: {
    Margin,
    Border,
    RowAlign,
    ColorPicker,
    TextDecoration,
    TextStyle
  },
  setup(props) {
    const activeNames = reactive([])
    const filtedFormList = computed(() => props.formList.configs.filter(i => i.id === '_styles'))
    watchEffect(() => {
      ;(props.formList.configs || []).forEach(i => {
        activeNames.push(i.id)
      })
    })

    return {
      activeNames,
      FormTypes,
      filtedFormList
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
    handleBorderChange(item, val) {
      // TODO 如果schema里的字段要表达多个属性怎么办？ 比如border=>要对应border-top|bottom|left|right
      // 在更新的时候还需要更新key和properties.id
      const valArr = val.split(':')
      this.handleChange(item, valArr[1])
    },
    handleChange(item, val) {
      const currentNode = getCurrentViewNodeModel()
      this.canvas.patch(currentNode.$el, item, val)
      this.designer.emit(EVENT_TYPES.ATTRPANEL_SET_ATTR, {
        type: EVENT_TYPES.ATTRPANEL_SET_ATTR,
        data: { item, val, currentNode }
      })
    }
  }
}
</script>