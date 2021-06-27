<style>
/* 该样式只在画布里才有 */
.canvas-wrapper .v-column {
  border: dotted 1px #aaaaaa;
  min-height: 80px;
  margin: 4px 0;
}
.canvas-wrapper .v-column .content {
  border: solid 1px #999;
  min-height: 72px;
  margin-top: 4px;
}

.v-column {
  box-sizing: border-box;
}
.v-column .content {
  box-sizing: border-box;
  display: flex;
}
</style>

<template>
  <div class="v-column" :style="{ background: this.bgColor }">
    <el-row style="width: 100%; margin-left: 0" :gutter="gutter">
      <!-- 布局组件为容器 需要加 c-slot-name 和 对应的 class-->
      <el-col v-for="(s, index) in spanArr" :key="index" :span="s">
        <div class="content" :style="contentStyle" :c-slot-name="`default${index}`">
          <slot :name="`default${index}`"></slot>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { ElRow, ElCol } from 'element-plus'

export default {
  name: 'VColumn',
  components: {
    ElRow,
    ElCol
  },
  props: {
    colRatio: {
      type: String,
      default: ''
    },
    gutter: {
      type: Number,
      default: 8
    },
    align: String, // => aligin-items 不使用 verticalAlign 是为了不和css属性冲突
    rowAlign: String, // => justify-content
    bgColor: String // => background-color
  },
  computed: {
    spanArr() {
      return this.colRatio.split(':').map((i) => Number(i))
    },
    contentStyle() {
      return {
        alignItems: this.align || 'flex-start',
        justifyContent: this.rowAlign || 'flex-start'
      }
    }
  }
}
</script>
