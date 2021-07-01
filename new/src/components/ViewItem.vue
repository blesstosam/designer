<style></style>

<script>
import { VButton } from '../designer/components/button/index'
import { VText } from '../designer/components/text/index'
import { VBlock } from '../designer/components/block/index'
import { VInput } from '../designer/components/input/index'
import { VColumn } from '../designer/components/column/index'
import { h, resolveComponent } from 'vue'

export default {
  name: 'ViewItem',
  components: {
    VBlock,
    VColumn,
    VButton,
    VText,
    VInput
  },
  props: {
    item: {
      type: Object
    }
  },
  render() {
    const { item: _item } = this
    const genRender = item => {
      const slots = {},
        children = item.children || []
      // 将 slot 根据 name 分类
      const cats = children.reduce((r, child) => {
        if (!r[child.slotName]) {
          r[child.slotName] = [child]
        } else {
          r[child.slotName].push(child)
        }
        return r
      }, {})
      Object.keys(cats).forEach(key => {
        const arr = cats[key]
        slots[key] = () =>
          arr.map(child => {
            const c = resolveComponent(child.name)
            return h(c, child.props, { default: () => genRender(child) })
          })
      })
      return h(resolveComponent(item.name), item.props, slots)
    }

    return genRender(_item)
  }
}
</script>
