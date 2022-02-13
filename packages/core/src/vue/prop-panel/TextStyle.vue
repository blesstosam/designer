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
  font-style: italic;
}
</style>
<template>
  <div class="text-style">
    <div :style="{ color: italicActive ? '#409EFF' : '#000' }" @click="handleStatusChange">
      I
    </div>
  </div>
</template>

<script>
export default {
  name: 'TextStyle',
  data() {
    return {
      italicActive: false
    }
  },
  emits: ['change', 'update:modelValue'],
  props: ['modelValue'],
  created() {
    this.italicActive = this.modelValue === 'italic'
  },
  methods: {
    handleStatusChange() {
      this.italicActive = !this.italicActive
      this.$emit('change', this.italicActive ? 'italic' : 'normal')
      this.$emit('update:modelValue', this.italicActive ? 'italic' : 'normal')
    }
  }
}
</script>
