<template>
  <svg
    class="icon"
    viewBox="0 0 1024 1024"
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    xmlns:xlink="http://www.w3.org/1999/xlink"
    :fill="fill || (active ? '#1989fa' : '#515151')"
    :width="width"
    :height="height || width"
  >
    <slot></slot>
  </svg>
</template>


<script>
export default {
  name: 'BaseIcon',
  props: {
    fill: {
      type: String
    },
    active: {
      type: Boolean
    },
    width: {
      type: Number
    },
    height: {
      type: Number
    }
  }
}
</script>

