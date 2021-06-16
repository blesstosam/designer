<style scoped>
.text-style {
  display: flex;
  font-size: 18px;
  cursor: pointer;
}
.text-style > div {
  padding: 6px;
}
</style>
<template>
  <div class="text-style">
    <div
      :style="{ color: type === 'left' ? '#409EFF' : '#000' }"
      @click="handleChange('left')"
    >
      left
    </div>
    <div
      :style="{ color: type === 'center' ? '#409EFF' : '#000' }"
      @click="handleChange('center')"
    >
      center
    </div>
    <div
      :style="{ color: type === 'right' ? '#409EFF' : '#000' }"
      @click="handleChange('right')"
    >
      right
    </div>
  </div>
</template>

<script>
export default {
  name: 'TextAlign',
  data() {
    return {
      type: 'left'
    }
  },
  created() {
    this.type = this.modelValue || 'left'
  },
  props: ['modelValue'],
  emits: ['change', 'update:modelValue'],
  methods: {
    handleChange(type) {
      this.type = type
      this.$emit('change', this.type)
      this.$emit('update:modelValue', this.type)
    }
  }
}
</script>
