<template>
  <div class="designer-view">
    <ViewItem :item="item" v-for="(item, index) in data" :key="index"></ViewItem>
  </div>
</template>

<script>
import ViewItem from './ViewItem.vue'

export default {
  name: 'DesignerView',
  components: { ViewItem },
  props: {
    data: {
      type: Array
    }
  }
}
</script>
