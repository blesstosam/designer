<style scoped>
.top {
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;
}
.top > span {
  line-height: 32px;
}
.table-item {
  cursor: pointer
}
.table-item:hover {
  color: #409EFF
}
</style>

<template>
  <div class="event-editor">
    <div class="top">
      <span>{{ item.title }}</span>
      <el-select
        size="small"
        :placeholder="item.description || '请选择'"
        v-model="eventType"
        @change="handleChange"
      >
        <el-option
          v-for="opt in options"
          :key="opt.label"
          :label="opt.label"
          :value="opt.label"
        >
        </el-option>
      </el-select>
    </div>

    <div v-if="tableData.length">
      <el-table :data="tableData" border style="width: 100%">
        <el-table-column label="事件">
          <template #default="scope">
            <span @click="showEditor(scope.row, scope.$index)" class="table-item">
              {{ scope.row.name }}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="100">
          <template #default="scope">
            <i class="el-icon-delete table-item" @click="del(scope.$index)"></i>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <monaco-editor
      :code="currentCode"
      v-model="isShowEditor"
      @close="doEmit"
      @save="handleSave"
    />
  </div>
</template>

<script>
import MonacoEditor from '../MonacoEditor.vue'

export default {
  name: 'EventEditor',
  components: { MonacoEditor },
  props: ['item'],
  emits: ['update:modelValue', 'change'],
  data() {
    return {
      options: [
        { label: 'click', value: 'click' },
        { label: 'hover', value: 'hover' },
      ],
      tableData: [],
      currentIndex: -1,
      currentCode: '',
      isShowEditor: false,
      eventType: ''
    }
  },
  methods: {
    handleChange(val) {
      if (val) {
        this.tableData.push({
          name: val,
          code: 'function(e) {\n\n}'
        })
        this.doEmit()
        this.eventType = ''
      }
    },
    showEditor(data, index) {
      this.currentIndex = index
      this.currentCode = data.code
      this.isShowEditor = true
    },
    del(index) {
      this.tableData.splice(index, 1)
    },
    handleSave(code) {
      this.tableData[this.currentIndex].code = code
    },
    doEmit() {
      const str = JSON.stringify(this.tableData)
      this.$emit('update:modelValue', str)
      this.$emit('change', str)
    }
  }
}
</script>
