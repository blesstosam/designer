<style></style>

<template>
  <component :is="item.name" v-bind="item.reactiveProps">
    <ViewItem v-for="_item in item.children" :item="_item" :key="_item.value">
      {{ _item.value }}
    </ViewItem>
  </component>
</template>

<script>
import { VButton } from '../designer/components/button/index'
import { VText } from '../designer/components/text/index'
import { VBlock } from '../designer/components/block/index'
export default {
  name: 'ViewItem',
  components: {
    VButton,
    VText,
    VBlock
  },
  props: {
    item: {
      type: Object
    }
  },
  methods: {}
}
</script>
