<template>
  <el-color-picker v-model="color" @change="handleChange"> </el-color-picker>
</template>

<script>
export default {
  name: 'ColorPicker',
  data() {
    return {
      color: '#000'
    }
  },
  created() {
    this.color = this.modelValue
  },
  props: ['modelValue'],
  emits: ['change', 'update:modelValue'],
  methods: {
    handleChange(val) {
      this.$emit('change', val)
      this.$emit('update:modelValue', val)
    }
  }
}
</script>

<style></style>
