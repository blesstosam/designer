<style></style>

<template>
  <div class="selection-wrap">
    
  </div>
</template>

<script>
export default {
  name: 'Selection',
  components: {},
  data() {
    return {}
  },
  computed: {
    designer() {
      return this.__designer__
    },
    __attr__() {
      return this.__designer__.__attr__
    },
    canvas() {
      return this.__designer__.__canvas__
    }
  },
  methods: {}
}
</script>
