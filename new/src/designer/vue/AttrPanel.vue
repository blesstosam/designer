<style>
.attr-wrap .desc {
  padding: 8px 8px;
  margin-bottom: 8px;
  background-color: #e9e9e9;
  font-size: 13px;
  border-radius: 4px;
}
.attr-wrap .desc .title {
  margin-bottom: 6px;
}
.attr-wrap .desc .title img {
  width: 18px;
  vertical-align: top;
  margin-right: 4px;
}
.attr-wrap .desc .title span {
  font-weight: bold;
  font-size: 14px;
}
</style>

<template>
  <div class="attr-wrap">
    <div v-if="attrs.title">
      <div class="desc">
        <div class="title">
          <img :src="icon.value" />
          <span> {{ formList.title }} </span>
        </div>
        <div>{{ formList.description }}</div>
      </div>

      <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
        <el-tab-pane label="属性" name="prop">
          <PropPanel :attr="__attr__" :formList="formList" ref="propPanel" />
        </el-tab-pane>
        <el-tab-pane label="样式" name="style">
          <StylePanel :attr="__attr__" :formList="formList" ref="stylePanel" />
        </el-tab-pane>
        <el-tab-pane label="事件" name="event">事件</el-tab-pane>
        <el-tab-pane label="数据" name="data">数据</el-tab-pane>
      </el-tabs>
    </div>

    <div v-else>暂未选中组件！</div>
  </div>
</template>

<script>
import { getCurrentViewNodeModel } from '../config'
import { parse } from '../lib/parse-schema'
import PropPanel from './prop-panel/Index.vue'
import StylePanel from './style-panel/Index.vue'

export default {
  name: 'AttrPanel',
  components: {
    PropPanel,
    StylePanel
  },
  beforeCreate() {
    this.data = getCurrentViewNodeModel()
  },
  data() {
    return {
      activeName: 'prop',
      icon: this.data.icon || {},
      attrs: this.data.attrs || {},
      formList: parse(this.data.attrs || {})
    }
  },
  watch: {
    attrs: {
      handler() {
        const parsed = parse(this.attrs)
        for (const k in parsed) {
          this.formList[k] = parsed[k]
        }
      },
      immediate: true,
      deep: true
    }
  },
  computed: {
    designer() {
      return this.__attr__.__designer__
    },
    canvas() {
      return this.designer.__canvas__
    }
  },
  methods: {
    handleClick() {
      // console.log(this.__attr__)
    },
    setData(d) {
      this.icon = d.icon
      for (const k in d) {
        this.data[k] = d[k]
      }
      for (const k in d.attrs) {
        this.attrs[k] = d.attrs[k]
      }
    },
    resetData() {
      this.icon = {}
      this.attrs = {}
    }
  }
}
</script>
