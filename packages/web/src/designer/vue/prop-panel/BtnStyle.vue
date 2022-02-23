<style scoped>
.btn-style > img {
  margin-left: 10px;
  margin-bottom: 20px;
  width: 66px;
  cursor: pointer;
  padding: 2px;
  box-sizing: border-box;
}
</style>
<template>
  <div class="btn-style">
    <img
      v-for="(item, index) in arr"
      :key="index"
      :src="item.src"
      :alt="item.label"
      :style="{ border: item.value === defaultVal ? '1px solid #409EFF' : 'none' }"
      @click="handleChange(item.value)"
    />
  </div>
</template>

<script>
import { reactive, ref } from 'vue'
import buttonPlainPng from '@/assets/button_plain.png'
import buttonPrimaryPng from '@/assets/button_primary.png'
import buttonRoundPng from '@/assets/button_round.png'

export default {
  name: 'BtnStyle',
  setup() {
    const arr = reactive([
      { label: '基础', src: buttonPrimaryPng, value: '' },
      { label: '圆角', src: buttonRoundPng, value: 'round' },
      { label: '朴素', src: buttonPlainPng, value: 'plain' }
    ])
    const defaultVal = ref('')
    return {
      arr,
      defaultVal
    }
  },
  created() {
    this.defaultVal = this.modelValue
  },
  emits: ['update:modelValue', 'change'],
  props: ['modelValue'],
  methods: {
    handleChange(val) {
      this.defaultVal = val
      this.$emit('change', val)
      this.$emit('update:modelValue', val)
    }
  }
}
</script>
