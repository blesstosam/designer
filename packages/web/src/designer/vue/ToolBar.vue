<style scoped>
.toolbar {
  padding: 8px 0px;
  display: flex;
  justify-content: space-between;
  width: 100%;
  font-size: 12px;
}
.logo img {
  height: 40px;
}
.toolbar i {
  font-size: 20px;
}
.toolbar .toolbar-content {
  display: flex;
}
.toolbar .tool-item {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 50px;
  cursor: pointer;
}
.toolbar .disabled {
  color: #bbb;
  user-select: none;
  cursor: not-allowed;
}
</style>

<template>
  <div class="toolbar">
    <div class="logo">
      <img :src="Logo" alt="logo" />
    </div>
    <div class="toolbar-content">
      <span class="tool-item" :class="{ disabled: !prevStatus }" @click="undo">
        <!-- <el-icon><Back /></el-icon> -->
        <span>上一步</span>
      </span>
      <span class="tool-item" :class="{ disabled: !nextStatus }" @click="redo">
        <!-- <el-icon><Right /></el-icon> -->
        <span>下一步</span>
      </span>
      <span class="tool-item" @click="save">
        <!-- <el-icon><CameraFilled /></el-icon> -->
        <span>导出</span>
      </span>
      <span class="tool-item" @click="clear">
        <!-- <el-icon><Delete /></el-icon> -->
        <span>清空</span>
      </span>
      <span class="tool-item" @click="preview">
        <!-- <el-icon><Monitor /></el-icon> -->
        <span>预览</span>
      </span>
      <span class="tool-item" @click="save">
        <!-- <el-icon><UploadFilled /></el-icon> -->
        <span>保存</span>
      </span>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import Logo from '../../assets/logo.png'

export default {
  name: 'ToolBar',
  setup(_, ctx) {
    const prevStatus = ref(0)
    const nextStatus = ref(0)

    const activePrev = () => {
      prevStatus.value = 1
    }
    const deactivePrev = () => {
      prevStatus.value = 0
    }
    const activeNext = () => {
      nextStatus.value = 1
    }
    const deactiveNext = () => {
      nextStatus.value = 0
    }

    return {
      Logo,
      prevStatus,
      nextStatus,
      activePrev,
      deactivePrev,
      activeNext,
      deactiveNext
    }
  },
  computed: {
    designer() {
      return this.__designer__
    },
    toolbar() {
      return this.__designer__.__toolbar__
    },
    commander() {
      return this.toolbar.commander
    }
  },
  methods: {
    handleAction({ canRedo, canUndo }) {
      if (canRedo) {
        this.activeNext()
      } else {
        this.deactiveNext()
      }
      if (canUndo) {
        this.activePrev()
      } else {
        this.deactivePrev()
      }
    },
    undo() {
      this.toolbar.undo(this.handleAction)
    },
    redo() {
      this.toolbar.redo(this.handleAction)
    },
    clear() {
      this.designer.__canvas__.clear()
    },
    save() {
      const { model } = this.designer.__canvas__
      const transformed = this.toolbar.transform()
      localStorage.setItem('viewModel', JSON.stringify({ ...model, children: transformed }))
      ElMessage.success({
        duration: 1000,
        message: 'save succeed!'
      })
    },
    preview() {
      this.save()
      window.open(location.origin + '/preview')
    }
  }
}
</script>
