<style scoped>
.color-radio {
  display: flex;
}
.color-radio > div {
  width: 20px;
  height: 20px;
  margin: 5px;
  box-shadow: 0px 0px 2px 1px #bbc0c2;
  cursor: pointer;
}
</style>

<template>
  <div class="color-radio">
    <div
      v-for="color in colorList"
      :key="color.value"
      :style="{
        backgroundColor: color.label,
        border: defalutColor === color.value ? '1px solid #fff' : 'none'
      }"
      @click="handleChange(color.value)"
    ></div>
  </div>
</template>

<script>
export default {
  name: 'ColorRadio',
  props: {
    colorList: Array,
    modelValue: String
  },
  emits: ['update:modelValue', 'change'],
  data() {
    return {
      defalutColor: ''
    }
  },
  created() {
    this.defalutColor = this.modelValue
  },
  methods: {
    handleChange(color) {
      this.defalutColor = color
      this.$emit('update:modelValue', color)
      this.$emit('change', color)
    }
  }
}
</script>
