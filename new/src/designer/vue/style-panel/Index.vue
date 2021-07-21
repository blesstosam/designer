<style>
.style-panel .dis-flex {
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;
  align-items: center;
}
.style-panel .dis-flex > span {
  width: 100px;
  line-height: 36px;
}
.style-panel .el-collapse-item {
  padding: 0 4px;
}
.style-panel .el-collapse-item__content {
  padding-bottom: 12px;
}
</style>

<template>
  <div class="style-panel">
    <el-collapse v-model="activeNames">
      <el-collapse-item
        v-for="item in filtedFormList"
        :key="item.id"
        :title="item.title"
        :name="item.id"
      >
        <div v-for="_item in item.children" :key="_item.id">
          <!-- margin -->
          <div :label="_item.title" v-if="_item.formType === FormTypes.Margin">
            <span>{{ _item.title }}</span>
            <margin v-model="_item.value" @change="handleChange(_item, $event)" />
          </div>
        </div>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script>
import Margin from './Margin.vue'
import { FormTypes } from '../config'
import { reactive } from '@vue/reactivity'
import { computed, watchEffect } from 'vue'
import { getCurrentViewNodeModel } from '../../config'

export default {
  name: 'StylePanel',
  props: ['attr', 'formList'],
  components: {
    Margin
  },
  setup(props) {
    const activeNames = reactive([])
    console.log(props.formList)
    const filtedFormList = computed(() => props.formList.configs.filter(i => i.id === '_styles'))
    watchEffect(() => {
      ;(props.formList.configs || []).forEach(i => {
        activeNames.push(i.id)
      })
    })

    return {
      activeNames,
      FormTypes,
      filtedFormList
    }
  },
  computed: {
    designer() {
      return this.attr.__designer__
    },
    canvas() {
      return this.designer.__canvas__
    }
  },
  methods: {
    handleChange(item, val) {
      console.log(1, item, val)
      const currentNode = getCurrentViewNodeModel()
      this.canvas.patch(currentNode.$el, item, val)
      // this.designer.emit(EVENT_TYPES.ATTRPANEL_SET_ATTR, {
      //   type: EVENT_TYPES.ATTRPANEL_SET_ATTR,
      //   data: { item, val, currentNode }
      // })
    }
  }
}
</script>