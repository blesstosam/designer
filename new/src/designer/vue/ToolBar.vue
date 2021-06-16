<style scoped>
.toolbar {
  padding: 8px 0px;
  display: flex;
  justify-content: space-between;
  width: 100%;
  font-size: 12px;
}
.toolbar .logo {
  font-size: 20px;
}
.toolbar .el-icon-back {
  font-size: 20px;
}
.toolbar .el-icon-right {
  font-size: 20px;
}
.toolbar .el-icon-upload {
  font-size: 20px;
}
.toolbar .el-icon-monitor {
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
    <div class="logo">设计器</div>
    <div class="toolbar-content">
      <span class="tool-item" :class="{ disabled: !prevStatus }">
        <i class="el-icon-back"></i>
        <span>上一步</span>
      </span>
      <span class="tool-item" :class="{ disabled: !nextStatus }">
        <i class="el-icon-right"></i>
        <span>下一步</span>
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
import { computed, reactive, ref } from 'vue'
// import { _forEach } from '../lib/util.js'
// import { getCurrentViewNodeModel } from '../config.js'

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
      return this.__toolbar__.__designer__
    }
  },
  methods: {
    save() {
      const { viewModel } = this.designer.__canvas__
      localStorage.setItem('viewModel', JSON.stringify(viewModel))
    },
    preview() {
      const vueApp = this.designer.__vueApp__
      vueApp.$router.push('/preview')
    }
  }
}
</script>
