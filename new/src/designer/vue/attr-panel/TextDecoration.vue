<style scoped>
.text-style {
  display: flex;
  font-size: 18px;
  cursor: pointer;
}
.text-style > div {
  padding: 6px;
}
.text-style > div:nth-child(1) {
  text-decoration: underline;
}
.text-style > div:nth-child(2) {
  text-decoration: line-through;
}
.text-style > div:nth-child(3) {
  text-decoration: overline;
}
</style>
<template>
  <div class="text-style">
    <div
      :style="{ color: type === 'underline' ? '#409EFF' : '#000' }"
      @click="handleChange('underline')"
    >
      U
    </div>
    <div
      :style="{ color: type === 'line-through' ? '#409EFF' : '#000' }"
      @click="handleChange('line-through')"
    >
      S
    </div>
    <div
      :style="{ color: type === 'overline' ? '#409EFF' : '#000' }"
      @click="handleChange('overline')"
    >
      O
    </div>
  </div>
</template>

<script>
export default {
  name: 'TextDecoration',
  data() {
    return {
      type: 'none'
    }
  },
  created() {
    this.type = this.modelValue || 'none'
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
