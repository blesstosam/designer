<style>
/* 该样式只在画布里才有 */
.canvas-wrapper .v-column {
  border: dotted 1px #aaaaaa;
  height: 80px;
  margin: 4px 0;
}
.canvas-wrapper .v-column .content {
  border: solid 1px #999;
  height: 72px;
  margin-top: 4px
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
      <el-col v-for="i in colCount" :key="i" :span="span">
        <div class="content" :style="contentStyle" :c-slot-name="`default${i}`">
          <slot :name="`default${i}`"></slot>
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
    colCount: {
      type: Number,
      default: 2
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
    span() {
      return this.totalSpan / this.colCount
    },
    contentStyle() {
      return {
        alignItems: this.align || 'flex-start',
        justifyContent: this.rowAlign || 'flex-start'
      }
    }
  },
  data() {
    return {
      totalSpan: 24
    }
  }
}
</script>
