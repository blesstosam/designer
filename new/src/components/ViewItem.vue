<style></style>

<template>
  <span>
    <component :is="getComName(item.name)" v-bind="item.reactiveProps"></component>

    <ViewItem v-for="_item in item.children" :item="_item" :key="_item.value">
      {{ _item.value }}
    </ViewItem>
  </span>
</template>

<script>
import { VButton } from '../designer/components/button/index'
import { VText } from '../designer/components/text/index'
// import { VText } from '../designer/components/button/index'
export default {
  name: 'ViewItem',
  components: { 
    VButton,
    VText
  },
  props: {
    item: {
      type: Object
    }
  },
  methods: {
    getComName(name) {
      return name.replace('A', 'V')
    }
  }
}
</script>
