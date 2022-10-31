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
        <i class="el-icon-back"></i>
        <span>上一步</span>
      </span>
      <span class="tool-item" :class="{ disabled: !nextStatus }" @click="redo">
        <i class="el-icon-right"></i>
        <span>下一步</span>
      </span>
      <span class="tool-item" @click="save">
        <i class="el-icon-camera-solid"></i>
        <span>导出</span>
      </span>
      <span class="tool-item" @click="clear">
        <i class="el-icon-delete"></i>
        <span>清空</span>
      </span>
      <span class="tool-item" @click="preview">
        <i class="el-icon-monitor"></i>
        <span>预览</span>
      </span>
      <span class="tool-item" @click="save">
        <i class="el-icon-upload"></i>
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
    }
  },
  methods: {
    undo() {
      this.toolbar.undo()
    },
    redo() {
      this.toolbar.redo()
    },
    clear() {
      this.designer.__canvas__.clear()
    },
    save() {
      const { model } = this.designer.__canvas__
      localStorage.setItem('viewModel', JSON.stringify({ ...model, children: model.export() }))
      ElMessage.success({
        duration: 1000,
        message: '保存成功！'
      })
    },
    preview() {
      this.save()
      window.open(location.origin + '/#/preview')
    }
  }
}
</script>
