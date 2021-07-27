<style scoped>
.top {
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;
}
.top > span {
  line-height: 32px;
}
</style>

<template>
  <div class="event-editor">
    <div class="top">
      <span>{{ item.title }}</span>
      <el-select size="small" :placeholder="item.description || '请选择'" v-model="eventType">
        <el-option
          v-for="opt in item.options"
          :key="opt.label"
          :label="opt.label"
          :value="opt.label"
        >
        </el-option>
      </el-select>
    </div>
    <div>
      <el-input type="textarea" :row="10" v-model="code" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'EventEditor',
  props: ['item'],
  emits: ['change'],
  data() {
    return {
      eventType: '',
      code: 'function(e) {\n\n}'
    }
  },
  methods: {
    handleChange(val) {
      console.log(val, ';val')
    }
  }
}
</script>

