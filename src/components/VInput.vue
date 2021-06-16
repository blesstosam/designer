<template>
  <el-input v-bind="param" :value="value" @input="(value) => $emit('input', value)"> </el-input>
</template>

<script>
export default {
  name: 'VInput',
  props: {
    param: {
      type: Object,
      required: true,
    },
    value: {
      type: String,
    },
  },
};
</script>
