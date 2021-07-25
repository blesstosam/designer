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
  padding: 8px 0 0 0;
  display: flex;
  flex-wrap: wrap;
  border-radius: 4px;
}
.item {
  width: 47%;
  margin-bottom: 8px;
  padding-left: 4px;
  padding-right: 4px;
  display: flex;
}
.item .el-button {
  margin-left: 2px;
  padding: 0;
  width: 30px;
  flex: none;
}
.item svg {
  flex: none;
  margin-top: 6px;
  margin-right: 4px;
}
.item .margin-icon-item,
.item .border-radius-icon-item {
  margin-top: 6px;
  margin-right: 4px;
}
</style>
<style>
.border-radius .item .el-input-number__decrease {
  width: 24px;
}
.border-radius .item .el-input-number__increase {
  width: 24px;
}
.border-radius .item .el-input__inner {
  padding-left: 5px;
  padding-left: 28px;
}
</style>


<template>
  <div class="border-radius">
    <div class="top">
      <div class="label">{{ label }}</div>
      <div>
        <el-input-number
          size="small"
          controls-position="right"
          v-model="val"
          @input="handleTotalChange"
        ></el-input-number>
        <el-button size="small" @click="changeUnit">{{ unit }}</el-button>
      </div>
    </div>

    <div class="center">
      <div class="item" v-for="index in 4" :key="index">
        <BorderRadiusIcons :type="getTypes(index)" v-if="type === 'borderRadius'" />
        <MarginIcons :type="getTypes(index)" v-else />
        <el-input-number
          controls-position="right"
          size="small"
          width="60px"
          v-model="valArr[index - 1]"
          @input="handleItemChange"
        ></el-input-number>
        <el-button @click="changeUnit(index)" size="small">{{ unitArr[index - 1] }}</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import BorderRadiusIcons from './icons/BorderRadiusIcons.vue'
import MarginIcons from './icons/MarginIcons.vue'

export default {
  name: 'Margin',
  components: {
    BorderRadiusIcons,
    MarginIcons
  },
  props: {
    modelValue: String,
    label: String,
    type: {
      type: String,
      default: 'margin',
      validator: val => {
        return val === 'padding' || val === 'margin' || val === 'borderRadius'
      }
    }
  },
  emits: ['update:modelValue', 'change'],
  data() {
    return {
      val: '', // val: 1 => valArr: [1,1,1,1]
      valArr: [0, 0, 0, 0],
      unit: 'px', // px|em|%
      unitArr: ['px', 'px', 'px', 'px']
    }
  },
  created() {
    if (typeof this.modelValue === 'string' && this.modelValue) {
      this.valArr = this.modelValue.split(' ').map(i => Number(i.replace(/(em|px|%)$/, '')))
      this.val = undefined
    }
  },
  computed: {
    finalVal() {
      return this.valArr.map((i, idx) => `${i}${this.unitArr[idx]}`).join(' ')
    }
  },
  methods: {
    getTypes(index) {
      if (this.type === 'borderRadius') {
        const map = ['top-left', 'top-right', 'bottom-right', 'bottom-left']
        return map[index - 1]
      } else {
        const map = ['top', 'right', 'bottom', 'left']
        return map[index - 1]
      }
    },
    handleItemChange(val) {
      this.$emit('update:modelValue', this.finalVal)
      this.$emit('change', this.finalVal)
    },
    handleTotalChange(val) {
      this.valArr = new Array(4).fill(val)
      this.$emit('update:modelValue', this.finalVal)
      this.$emit('change', this.finalVal)
    },
    changeUnit(index) {
      const map = {
        px: 'em',
        em: '%',
        '%': 'px'
      }
      if (typeof index === 'number') {
        this.unitArr[index - 1] = map[this.unitArr[index - 1]]
      } else {
        this.unit = map[this.unit]
        this.unitArr = new Array(4).fill(this.unit)
      }
    }
  }
}
</script>
