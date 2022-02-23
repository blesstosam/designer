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
        t="1623993625731"
        class="icon"
        viewBox="0 0 1024 1024"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        p-id="2272"
        xmlns:xlink="http://www.w3.org/1999/xlink"
        width="24"
        height="24"
        :fill="type === item.value ? '#409EFF' : '#000'"
      >
        <path
          d="M803.84 674.474667L567.125333 426.666667v597.333333h-106.837333V424.96L219.818667 671.744 153.6 603.818667l360.277333-369.664L870.4 607.573333l-66.56 66.901334zM156.501333 0h711.168v114.005333H156.501333z"
          p-id="2273"
        ></path>
      </svg>
      <svg
        v-else
        t="1623993631522"
        class="icon"
        viewBox="0 0 1024 1024"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        p-id="2414"
        xmlns:xlink="http://www.w3.org/1999/xlink"
        width="24"
        height="24"
        :fill="type === item.value ? '#409EFF' : '#000'"
      >
        <path
          d="M510.126 614.948L720.21 825.03l-61.612 61.74L556.64 784.813l0.064 239.187H469.46V778.967L361.526 886.643l-61.676-61.676 210.148-210.02h0.128zM918.58 455.265v116.297H104.5V455.265h814.08zM555.805 0v243.748l103.564-103.564 61.612 61.612-210.02 210.147h-0.128L300.685 201.796l61.74-61.612 106.199 106.198L468.559 0h87.246z"
          p-id="2415"
        ></path>
      </svg>
    </div>
  </div>
</template>

<script>
export default {
  name: 'VerticalAlign',
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
