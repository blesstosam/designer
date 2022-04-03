<style scoped>

</style>

<template>
  <div
    class="btn-wrap"
    :style="{
      position: 'absolute',
      ...(btnPos$.h === 'left' ? { left: 0, right: null } : { left: null, right: 0 }),
      top: btnPos$.v === 'top' ? '-22px' : `${offset$.height}px`,
      height: '20px',
      width: isLayout$ ? '99px' : '76px',
      lineHeight: '21px',
      pointerEvents: 'all'
    }"
  >
    <div
      v-if="node.isRoot"
      :style="{
        position: 'absolute',
        ...titleBtnHPosVal$,
        top: 0,
        cursor: 'pointer',
        background: '#1989fa',
        color: 'white',
        height: '18px',
        textAlign: 'center',
        padding: '0 3px',
        lineHeight: '19px',
        fontSize: '12px',
        whiteSpace: 'nowrap',
        fontWeight: 500
      }"
    >
      {{ node.title }}
    </div>
  </div>
</template>

<script>
export default {
  name: 'Selection',
  props: [
    'node',
    'btnPos',
    'isLayout',
    'offset',
    'delBtnHPosVal',
    'copyBtnHPosVal',
    'moveBtnHPosVal',
    'titleBtnHPosVal'
  ],
  created() {
    console.log(this.isLayout, this.btnPos, this.offset, this.node, 'this.isLayout')
  },
  data() {
    return {
      SELECTION_BORDER_STYLE: '1px solid rgb(70, 128, 255)',
      node$: this.node,
      isLayout$: this.isLayout,
      btnPos$: this.btnPos,
      btnHPosVal$: this.btnHPosVal,
      offset$: this.offset,
      titleBtnHPosVal$: this.titleBtnHPosVal
    }
  },
  computed: {
    designer() {
      return this.__designer__
    },
    attr() {
      return this.__designer__.__attr__
    },
    canvas() {
      return this.__designer__.__canvas__
    },
    selection() {
      return this.designer.__selection__
    }
  },
  methods: {
    setData(d) {
      d.node && (this.node$ = d.node)
      d.isLayout && (this.isLayout$ = d.isLayout)
      d.btnPos && (this.btnPos$ = d.btnPos)
      d.btnHPosVal && (this.btnHPosVal$ = d.btnHPosVal)
      d.offset && (this.offset$ = d.offset)
      d.titleBtnHPosVal && (this.titleBtnHPosVal$ = d.titleBtnHPosVal)
    }
  }
}
</script>
