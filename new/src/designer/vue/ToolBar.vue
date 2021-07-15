<style scoped>
.toolbar {
  padding: 8px 0px;
  display: flex;
  justify-content: space-between;
  width: 100%;
  font-size: 12px;
}
.logo img {
  padding-top: 5px;
  width: 96px;
}
.toolbar .logo {
  font-size: 20px;
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
      <img src="/logo.jpg" alt="" />
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
import { computed, reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import cloneDeep from 'lodash.clonedeep'

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
    undo() {
      this.__toolbar__.undo()
    },
    redo() {
      this.__toolbar__.redo()
    },
    transform(_arr) {
      // 将组件数据的一些字段处理一下
      const traverse = arr => {
        for (let i = 0; i < arr.length; i++) {
          const item = arr[i]
          delete item.$el
          delete item.accept
          delete item.icon
          delete item.vm
          delete item.render
          delete item.transformProps
          delete item.parent
          if (item.children && item.children.length) {
            traverse(item.children)
          }
        }
      }
      traverse(_arr)
    },
    clear() {
      this.designer.__canvas__.clear()
    },
    save() {
      const { viewModel } = this.designer.__canvas__
      // TODO need to fix! cloneDeep 对循环依赖没有处理 找找其他的库
      // this.transform(cloneDeep(viewModel.children))
      this.transform(viewModel.children)
      localStorage.setItem('viewModel', JSON.stringify(viewModel))
      ElMessage.success({
        duration: 1000,
        message: 'save succeed!'
      })
    },
    preview() {
      this.save()
      window.open(location.origin + '/#/preview')
      // const vueApp = this.designer.__vueApp__
      // vueApp.$router.push('/preview')
    }
  }
}
</script>
