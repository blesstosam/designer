<script>
import { VButton } from '../designer/components/button/index'
import { VText } from '../designer/components/text/index'
import { VBlock } from '../designer/components/block/index'
import { VInput } from '../designer/components/input/index'
import { VColumn } from '../designer/components/column/index'
import { VTag } from '../designer/components/tag/index'
import { VImage } from '../designer/components/image/index'
import { VDivider } from '../designer/components/divider/index'
import { VTabs } from '../designer/components/tabs/index'
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
    VTag,
    VImage,
    VDivider,
    VTabs,
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
          [`${d.componentName}_${d.version}`]: d.url
        }
      }
    }
  },
  render() {
    const genRenderFn = (item) => {
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
      Object.keys(cats).forEach((key) => {
        const arr = cats[key]
        slots[key] = () =>
          arr.map((child) => {
            if (child.isCustom)
              return h(Custom, { moduleData: this.getModuleData(child.customData) })

            handleEvents(child.props)

            return genRenderFn(child)
          })
      })

      handleEvents(item.props)
      return h(
        resolveComponent(item.componentName),
        { ...item.props, style: { marginBottom: item.componentType === 'layout' ? '12px' : 0 } },
        slots
      )
    }

    const handleEvents = (props) => {
      const { events } = props
      for (let evtName in events) {
        const code = events[evtName]
        props[`${evtName}`] = (e) => {
          eval(`(${code})(e)`)
        }
      }
    }

    return genRenderFn(this.item)
  }
}
</script>
