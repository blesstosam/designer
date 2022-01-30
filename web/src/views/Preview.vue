<style lang="stylus"></style>

<template>
  <div class="preview">
    <DesignerView :data="data" />
  </div>
</template>

<script>
import { VButton } from '../designer/components/button/index'
import DesignerView from '../components/DesignerView.vue'

export default {
  name: 'Preview',
  components: { VButton, DesignerView },
  setup() {
    let data = localStorage.getItem('viewModel')
    if (data) {
      data = JSON.parse(data).children
    } else {
      data = []
    }
    console.log(data)

    return {
      data
    }
  }
}
</script>
