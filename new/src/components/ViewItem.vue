<style></style>

<script>
import { VButton } from '../designer/components/button/index'
import { VText } from '../designer/components/text/index'
import { VBlock } from '../designer/components/block/index'
import { VInput } from '../designer/components/input/index'
import { VColumn } from '../designer/components/column/index'
import { h, resolveComponent } from 'vue'
import Custom from './Custom.vue'

export default {
  name: 'ViewItem',
  components: {
    VBlock,
    VColumn,
    VButton,
    VText,
    VInput,
    Custom
  },
  props: {
    item: {
      type: Object
    }
  },
  methods: {
    getModuleData(d) {
      return {
        js: {
          [`${d.name}_${d.version}`]: d.url
        }
      }
    }
  },
  render() {
    const { item: _item } = this

    const genRender = item => {
      if (item.isCustom) return h(Custom, { moduleData: this.getModuleData(item.customData) })

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
            if (child.isCustom) return h(Custom, { moduleData: this.getModuleData(child.customData) })
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
