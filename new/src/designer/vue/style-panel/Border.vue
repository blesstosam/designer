<style scoped>
.top {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
}
.top .el-input-number {
  margin-right: 8px;
}
.top .label {
  line-height: 32px;
}
.top .el-button {
  padding: 0;
  width: 30px;
  flex: none;
}
.center {
  background-color: #e9e9e9;
  padding: 8px;
  display: flex;
  border-radius: 4px;
}
.left {
  width: 35%;
  padding: 10px 0;
}
.row {
  height: 32px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.row:nth-child() {
  justify-content: space-around;
}
.item {
  margin: 6px 0;
  display: flex;
}
.item .el-button {
  margin-left: 2px;
  padding: 0;
  width: 36px;
  flex: none;
}
</style>
<style>
.border .item .el-input-number__decrease {
  width: 24px;
}
.border .item .el-input-number__increase {
  width: 24px;
}
.border .el-color-picker {
  margin-left: -4px;
}
</style>


<template>
  <div class="border">
    <div class="top">
      <div class="label">{{ label }}</div>
    </div>

    <div class="center">
      <div class="left">
        <div class="row">
          <BorderIcons
            type="top"
            :actived="borderDirection === 'top'"
            @click.native="borderDirection = 'top'"
          />
        </div>
        <div class="row">
          <BorderIcons
            type="left"
            :actived="borderDirection === 'left'"
            @click.native="borderDirection = 'left'"
          />
          <BorderIcons
            type="all"
            :actived="borderDirection === 'all'"
            @click.native="borderDirection = 'all'"
          />
          <BorderIcons
            type="right"
            :actived="borderDirection === 'right'"
            @click.native="borderDirection = 'right'"
          />
        </div>
        <div class="row">
          <BorderIcons
            type="bottom"
            :actived="borderDirection === 'bottom'"
            @click.native="borderDirection = 'bottom'"
          />
        </div>
      </div>

      <div class="right">
        <el-select v-model="borderType" size="small">
          <el-option
            v-for="item in borderTypes"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
        <div class="item">
          <el-input-number
            controls-position="right"
            size="small"
            width="60px"
            v-model="val"
          ></el-input-number>
          <el-button @click="changeUnit" size="small">{{ unit }}</el-button>
        </div>
        <el-color-picker v-model="color"> </el-color-picker>
      </div>
    </div>
  </div>
</template>

<script>
import BorderIcons from './icons/BorderIcons.vue'

export default {
  name: 'Border',
  components: {
    BorderIcons
  },
  props: {
    modelValue: String,
    label: String
  },
  emits: ['update:modelValue', 'change'],
  data() {
    return {
      borderTypes: [
        { label: 'none', value: 'none' },
        { label: 'solid', value: 'solid' },
        { label: 'dashed', value: 'dashed' },
        { label: 'dotted', value: 'dotted' }
      ],
      borderType: 'none',
      borderDirection: 'all',
      color: '#fff',
      val: undefined,
      unit: 'px' // px|em|%
    }
  },
  created() {
    if (typeof this.modelValue === 'string' && this.modelValue) {
      const valArr = this.modelValue.split(' ')
      this.val = Number(valArr[0].replace(/(em|px|%)$/, ''))
      this.borderType = valArr[1]
      this.color = valArr[2]
      this.createdFlag = true
    }
  },
  computed: {
    finalVal() {
      const { borderType, borderDirection, color, val, unit } = this
      return borderDirection === 'all'
        ? `border:${val}${unit} ${borderType} ${color}`
        : `border-${borderDirection}:${val}${unit} ${borderType} ${color}`
    }
  },
  watch: {
    val() {
      this.handleEmit()
    },
    borderType() {
      this.handleEmit()
    },
    borderDirection() {
      this.handleEmit()
    },
    color() {
      this.handleEmit()
    }
  },
  methods: {
    handleEmit() {
      if (this.createdFlag && this.val && this.color && this.borderType) {
        this.$emit('update:modelValue', this.finalVal)
        this.$emit('change', this.finalVal)
      }
    },
    changeUnit() {
      const map = {
        px: 'em',
        em: '%',
        '%': 'px'
      }
      this.unit = map[this.unit]
    }
  }
}
</script>
