<style scoped>
.text-style {
  display: flex;
  align-items: center;
}
.text-style > div {
  padding: 6px;
  cursor: pointer;
}
</style>
<template>
  <div class="text-style">
    <div v-for="(item, index) in options" :key="index" @click="handleChange(item.value)">
      <svg
        v-if="index === 0"
        t="1623987529413"
        class="icon"
        viewBox="0 0 1024 1024"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        p-id="7434"
        xmlns:xlink="http://www.w3.org/1999/xlink"
        width="26"
        height="26"
        :fill="type === item.value ? '#409EFF' : '#000'"
      >
        <path
          d="M810.666667 725.333333v85.333334H213.333333v-85.333334h597.333334z m-170.666667-170.666666v85.333333H213.333333v-85.333333h426.666667z m170.666667-170.666667v85.333333H213.333333V384h597.333334z m-170.666667-170.666667v85.333334H213.333333V213.333333h426.666667z"
          p-id="7435"
        ></path>
      </svg>

      <svg
        v-else-if="index === 1"
        t="1623987960052"
        class="icon"
        viewBox="0 0 1070 1024"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        p-id="9031"
        xmlns:xlink="http://www.w3.org/1999/xlink"
        width="24"
        height="24"
        :fill="type === item.value ? '#409EFF' : '#000'"
      >
        <path
          d="M148.945455 182.923636V93.090909h837.12v89.832727H148.945455z m179.572363 231.656728v-89.832728h475.694546v89.832728H328.471273z m-177.198545 235.799272v-89.832727H986.763636v89.832727H151.319273z m180.037818 228.165819v-89.832728h473.6v89.832728H331.403636z"
          p-id="9032"
        ></path>
      </svg>

      <svg
        v-else
        t="1623987889502"
        class="icon"
        viewBox="0 0 1024 1024"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        p-id="8231"
        xmlns:xlink="http://www.w3.org/1999/xlink"
        width="26"
        height="26"
        :fill="type === item.value ? '#409EFF' : '#000'"
      >
        <path
          d="M810.666667 725.333333v85.333334H213.333333v-85.333334h597.333334z m0-170.666666v85.333333H384v-85.333333h426.666667z m0-170.666667v85.333333H213.333333V384h597.333334z m0-170.666667v85.333334H384V213.333333h426.666667z"
          p-id="8232"
        ></path>
      </svg>
    </div>
  </div>
</template>

<script>
export default {
  name: 'RowAlign',
  data() {
    return {
      type: ''
    }
  },
  created() {
    this.type = this.modelValue
  },
  props: ['modelValue', 'options'],
  emits: ['change', 'update:modelValue'],
  methods: {
    handleChange(type) {
      this.type = type
      this.$emit('change', this.type)
      this.$emit('update:modelValue', this.type)
    }
  }
}
</script>
