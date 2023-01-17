<style>
.event-editor .el-overlay {
  right: 350px;
}
.event-editor .el-drawer {
  border-right: 1px solid #dedede;
  width: 350px !important;
  padding: 24px 0;
}
.event-editor .el-drawer__body {
  position: relative;
}
#monacoEditorWrap {
  width: 100%;
  height: 100%;
}
.event-editor .actions-wrap {
  position: absolute;
  right: 30px;
  bottom: 0px;
}
</style>

<template>
  <el-drawer
    :close-on-press-escape="false"
    title="我是标题"
    v-model="isShow"
    :with-header="false"
    @close="handleClose"
  >
    <div id="monacoEditorWrap" ref="monacoEditorWrap"></div>
    <div class="actions-wrap">
      <el-button size="mini" @click="save">保存</el-button>
      <el-button size="mini" @click="close">关闭</el-button>
    </div>
  </el-drawer>
</template>

<script>
import monacoSetup from './monacoSetup'

export default {
  name: 'MonacoEditor',
  emits: ['update:modelValue', 'change', 'close', 'save'],
  props: ['modelValue', 'code'],
  created() {
    this.isShow = this.modelValue
  },
  data() {
    return {
      isShow: true
    }
  },
  watch: {
    modelValue(val) {
      this.isShow = val
      if (val) {
        this.$nextTick(() => {
          this.init()
        })
      }
    },
    isShow(val) {
      this.$emit('update:modelValue', val)
      this.$emit('change', val)
    }
  },
  methods: {
    init() {
      monacoSetup().then(({ monaco }) => {
        this.monacoInstance = monaco.editor.create(this.$refs.monacoEditorWrap, {
          value: this.code,
          language: 'javascript',
          minimap: {
            enabled: false
          },
          tabSize: 2
        })
      })
    },
    close() {
      this.$emit('close')
      this.isShow = false
      this.monacoInstance.dispose()
    },
    save() {
      this.$emit('save', this.monacoInstance.getValue())
    },
    handleClose() {
      this.close()
    }
  }
}
</script>