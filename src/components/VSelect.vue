<template>
  <el-select v-bind="param" :value="value" @change="(value) => $emit('input', value)">
    <el-option v-for="item in param.options" :key="item" :value="item" :label="item"></el-option>
  </el-select>
</template>

<script>
export default {
  name: 'VSelect',
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
