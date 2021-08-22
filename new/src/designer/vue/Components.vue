<style scoped>
.component {
  display: flex;
  height: 100%;
}
.component-left {
  width: 45px;
  border-right: 1px solid #eee;
  text-align: center;
  flex: none;
  box-sizing: border-box;
  position: relative;
}
.component-left .active-bar {
  width: 3px;
  height: 37px;
  background: #1989fa;
  position: absolute;
  left: 0;
}
.component-left .menu-item {
  padding: 6px 0;
  box-sizing: border-box;
  cursor: pointer;
}

.com-item {
  display: inline-block;
  padding: 6px;
  width: 40px;
  margin-right: 12px;
  margin-bottom: 8px;
  font-size: 12px;
  text-align: center;
  cursor: pointer;
  transition: 200ms;
}

.com-item:hover {
  transform: scale(1.1);
}

.custom-com-item {
  display: inline-block;
  padding: 6px;
  width: 40px;
  margin-right: 12px;
  font-size: 12px;
  text-align: center;
  cursor: pointer;
}

.component-tree-wrap,
.component-history-wrap {
  width: 100%;
}
.component .header {
  margin-bottom: 12px;
  padding: 0 6px;
}
.component .content {
  padding-bottom: 12px;
  margin-bottom: 12px;
  border-bottom: 1px solid #eee;
}
</style>
<style>
.component .el-tabs__item.is-active {
  color: #1989fa;
}
.component .el-tabs__active-bar {
  background-color: #1989fa;
}
</style>

<template>
  <div class="component">
    <div class="component-left">
      <div class="active-bar" :style="{ top: activeBarTopVal }"></div>

      <div :class="{ 'menu-item': true }" @click="activeMenu = 'com'">
        <lego-icon :active="activeMenu === 'com'" :width="20" />
      </div>

      <div :class="{ 'menu-item': true }" @click="activeMenu = 'tree'">
        <tree-icon :active="activeMenu === 'tree'" :width="20" />
      </div>

      <div :class="{ 'menu-item': true }" @click="activeMenu = 'history'">
        <record-icon :active="activeMenu === 'history'" :width="20" />
      </div>

      <!-- <div :class="{ 'menu-item': true }" @click="activeMenu = 'schema'">
        <code-icon :active="activeMenu === 'schema'" :width="20" />
      </div> -->
    </div>

    <el-tabs
      style="width: 100%"
      v-show="activeMenu === 'com'"
      v-model="activeName"
      @tab-click="handleClick"
    >
      <el-tab-pane label="组件库" name="component">
        <div class="component-wrap">
          <div class="header">布局组件</div>
          <div ref="layoutWrapEl" class="content">
            <div
              class="com-item"
              v-for="(item, index) in layoutCom"
              :key="index"
              :com-name="item.name"
              :com-title="item.title"
            >
              <img width="20" height="20" draggable="false" :src="item.icon.value" alt="" />
              <div style="margin-top: 2px">{{ item.title }}</div>
            </div>
          </div>

          <div class="header">视图组件</div>
          <div ref="basicWrapEl" class="content">
            <div
              class="com-item"
              v-for="(item, index) in viewCom"
              :key="index"
              :com-name="item.name"
              :com-title="item.title"
            >
              <img width="20" height="20" draggable="false" :src="item.icon.value" alt="" />
              <div style="margin-top: 2px">{{ item.title }}</div>
            </div>
          </div>

          <div class="header">表单组件</div>
          <div ref="formWrapEl" class="content">
            <div
              class="com-item"
              v-for="(item, index) in formCom"
              :key="index"
              :com-name="item.name"
              :com-title="item.title"
            >
              <img width="20" height="20" draggable="false" :src="item.icon.value" alt="" />
              <div style="margin-top: 2px">{{ item.title }}</div>
            </div>
          </div>

          <div class="header">自定义组件</div>
          <div ref="customWrapEl" class="content" v-if="asyncComRegisterSuccess">
            <div
              class="custom-com-item"
              v-for="(item, index) in customComList"
              :key="index"
              :com-name="item.name"
              :com-title="item.title"
            >
              <img width="20" height="20" draggable="false" :src="item.icon.value" alt="" />
              <div style="margin-top: 2px">{{ item.title }}</div>
            </div>
          </div>
          <div v-else style="color: #f56c6c; padding-left: 6px;">组件加载失败！</div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="模板" name="template">模板</el-tab-pane>
    </el-tabs>

    <div v-show="activeMenu === 'tree'" class="component-tree-wrap"></div>

    <div v-show="activeMenu === 'history'" class="component-history-wrap"></div>

    <!-- <div v-show="activeMenu === 'schema'">schema 开发</div> -->
  </div>
</template>

<script>
import { componentTypes } from '../Components'
import LegoIcon from './icons/LegoIcon.vue'
import TreeIcon from './icons/TreeIcon.vue'
import RecordIcon from './icons/RecordIcon.vue'
import CodeIcon from './icons/CodeIcon.vue'
import { componentList, customComList } from '../config'
import { EVENT_TYPES } from '../Event'

export default {
  name: 'Components',
  components: {
    LegoIcon,
    TreeIcon,
    RecordIcon,
    CodeIcon
  },
  data() {
    return {
      asyncComRegisterSuccess: true,
      activeMenu: 'com', // com|tree
      activeName: 'component', // component|template|history|schema
      componentList,
      customComList
    }
  },
  computed: {
    activeBarTopVal() {
      return this.activeMenu === 'com' ? 0 : this.activeMenu === 'tree' ? '37px' : '74px'
    },
    layoutCom() {
      return this.componentList.filter(i => i.componentType === componentTypes.LAYOUT)
    },
    viewCom() {
      return this.componentList.filter(i => i.componentType === componentTypes.VIEW)
    },
    formCom() {
      return this.componentList.filter(i => i.componentType === componentTypes.FORM)
    },
    __designer__() {
      return this.__components__.__designer__
    },
    __plug__() {
      return this.__designer__.__plug__
    }
  },
  mounted() {
    this.registerCom()
    this.registerCustomCom()
    this.__designer__.initComponentTree('.component-tree-wrap')
    const loggerPlug = this.__plug__.plugins.get('myLoggerPlugin').p
    loggerPlug.init('.component-history-wrap')
  },
  methods: {
    registerCom() {
      const comItems = document.querySelectorAll('.com-item')
      for (const el of comItems) {
        const comName = el.getAttribute('com-name')
        const com = componentList.find(i => i.name === comName)
        this.__components__.registerComponent(el, com)
      }
    },
    registerCustomCom() {
      const comItems = document.querySelectorAll('.custom-com-item')
      const modArr = []
      for (const el of comItems) {
        const comName = el.getAttribute('com-name')
        const com = customComList.find(i => i.name === comName)
        modArr.push({ comEl: el, com })
      }
      this.__components__
        .registerAsyncComponents(modArr)
        .then(res => {
          // 分发全局事件 组件面板初始化
          this.__designer__.emit(EVENT_TYPES.COMPONENTS_INITED)
        })
        .catch(err => {
          this.asyncComRegisterSuccess = false
          this.__designer__.emit(EVENT_TYPES.COMPONENTS_INITED)
        })
    },
    handleClick() {}
  }
}
</script>
