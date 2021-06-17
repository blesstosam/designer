<style lang="stylus"></style>

<template>
  <div class="preview">
    <DesignerView :data="data" />
  </div>
</template>

<script>
import { onMounted, reactive, ref, h, resolveComponent } from 'vue'
import { Designer, componentList } from '../designer/index'
import { VButton } from '../designer/components/button/index'
import DesignerView from '../components/DesignerView.vue'

export default {
  name: 'Preview',
  components: { VButton, DesignerView },
  setup() {
    let data = localStorage.getItem('viewModel')
    if (data) {
      data = JSON.parse(data)
    } else {
      data = []
    }
    console.log(data)

    onMounted(() => {
      // const mount = (nodeArr, container) => {
      //   for (const node of nodeArr) {
      //     // 在序列化数据的时候 =>
      //     // 将 render 函数丢失了 所以要从 config 里找回
      //     // 将 $el 丢失了 需要重新赋值
      //     const com = componentList.find(i => i.name === node.name)
      //     node.render = com.render
      //     const wrapper = this.append(node, container)
      //     node.$el = wrapper
      //     if (node.children && node.children.length) {
      //       mount(node.children, wrapper.childNodes[0])
      //     }
      //   }
      // }
      // mount(data, this.$refs.preview)
    })

    return {
      data
    }
  },
  // render() {
       // 使用 render 函数传递slot和使用模板传递slot效果一样
  //   // https://v3.cn.vuejs.org/guide/migration/render-function-api.html#_3-x-%E8%AF%AD%E6%B3%95-4
  //   const c = resolveComponent('VButton')
  //   // for test!
  //   return h(
  //     c,
  //     {
  //       content: 'x'
  //     },
  //     // https://v3.cn.vuejs.org/guide/migration/slots-unification.html#_2-x-%E8%AF%AD%E6%B3%95
  //     {
  //       block: () => [h('div', '22')]
  //     }
  //   )
  // }
}
</script>
