<style>
.v-column {
  box-sizing: border-box;
}
.v-column .row {
  display: flex;
  position: relative;
  box-sizing: border-box;
}
.v-column .row .col {
  box-sizing: border-box;
}
.v-column .content {
  box-sizing: border-box;
}
</style>

<template>
  <div class="v-column" :style="{ background: this.bgColor }">
    <!-- 可改为grid布局 -->
    <div
      class="row"
      :style="{ 'margin-left': (gutter / 2) * -1 + 'px', 'margin-right': (gutter / 2) * -1 + 'px' }"
    >
      <!-- 布局组件为容器 需要加 c-slot-name 和 对应的 class-->
      <div
        class="col"
        v-for="(s, index) in spanArr"
        :key="index"
        :span="s"
        :style="{
          'padding-left': gutter / 2 + 'px',
          'padding-right': gutter / 2 + 'px',
          'max-width': (s / 24) * 100 + '%',
          flex: `0 0 ${(s / 24) * 100}%`
        }"
      >
        <div class="content" :style="contentStyle" :c-slot-name="`default${index}`">
          <slot :name="`default${index}`"></slot>
        </div>
      </div>
    </div>
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
