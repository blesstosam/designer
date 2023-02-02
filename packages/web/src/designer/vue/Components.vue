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
  padding-top: 5px;
}
.component-right {
  width: 100%;
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
  margin-right: 22px;
  margin-bottom: 8px;
  font-size: 12px;
  text-align: center;
  cursor: grab;
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
  height: 100%;
}
.component .header {
  margin-bottom: 12px;
  padding: 0 6px;
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

<style>
.component .el-tabs__header {
  margin: 0;
  padding-left: 8px;
}
.component .el-collapse-item__header {
  padding-left: 8px;
}
.component .el-collapse-item__content {
  padding-bottom: 12px;
}
</style>

<template>
  <div class="component">
    <div class="component-left">
      <div class="active-bar" :style="{ top: activeBarTopVal }"></div>

      <div :class="{ 'menu-item': true }" @click="activeMenu = 'com'">
        <lego-icon :active="activeMenu === 'com'" :width="24" />
      </div>

      <div :class="{ 'menu-item': true }" @click="activeMenu = 'tree'">
        <tree-icon :active="activeMenu === 'tree'" :width="24" />
      </div>

      <div
        v-for="(item, index) in menubarPlugins"
        :key="index"
        :class="{ 'menu-item': true }"
        @click="activeMenu = item.name"
      >
        <record-icon :active="activeMenu === item.name" :width="24" />
      </div>

      <!-- <div :class="{ 'menu-item': true }" @click="activeMenu = 'schema'">
        <code-icon :active="activeMenu === 'schema'" :width="24" />
      </div> -->
    </div>

    <div class="component-right">
      <el-tabs
        style="width: 100%"
        v-show="activeMenu === 'com'"
        v-model="activeTabName"
        @tab-click="handleClick"
      >
        <el-tab-pane label="组件库" name="component">
          <div class="component-wrap">
            <el-collapse v-model="activeCollapseNames">
              <el-collapse-item
                v-for="(type, _idx) of collapseList"
                :key="_idx"
                :title="type.title"
                :name="type.name"
              >
                <div class="content">
                  <div
                    class="com-item"
                    v-for="(item, index) in comList(type.key)"
                    :key="index"
                    :com-name="item.componentName"
                    :com-title="item.title"
                  >
                    <img width="26" height="26" draggable="false" :src="item.icon.value" alt="" />
                    <div style="margin-top: 2px">{{ item.title }}</div>
                  </div>
                </div>
              </el-collapse-item>
              <el-collapse-item title="自定义组件" name="4">
                <div class="content" v-if="asyncComRegisterSuccess">
                  <div
                    class="custom-com-item"
                    v-for="(item, index) in customComList"
                    :key="index"
                    :com-name="item.componentName"
                    :com-title="item.title"
                  >
                    <img width="20" height="20" draggable="false" :src="item.icon.value" alt="" />
                    <div style="margin-top: 2px">{{ item.title }}</div>
                  </div>
                </div>
                <div v-else style="color: #f56c6c; padding-left: 6px">组件加载失败！</div>
              </el-collapse-item>
            </el-collapse>
          </div>
        </el-tab-pane>
        <el-tab-pane label="模板" name="template">模板</el-tab-pane>
      </el-tabs>

      <div v-show="activeMenu === 'tree'" class="component-tree-wrap">
        <ComponentTree :mounted="mounted" />
      </div>

      <div
        v-for="(item, index) in menubarPlugins"
        :key="index"
        v-show="activeMenu === item.name"
        :class="genClsName(item.name)"
      ></div>

      <!-- <div v-show="activeMenu === 'schema'">schema 开发</div> -->
    </div>
  </div>
</template>

<script>
import LegoIcon from './icons/LegoIcon.vue'
import TreeIcon from './icons/TreeIcon.vue'
import RecordIcon from './icons/RecordIcon.vue'
import CodeIcon from './icons/CodeIcon.vue'
import { componentList, customComList } from '../config'
import ComponentTree from './ComponentTree.vue'
import { ComponentTypes } from '@davincid/core/src/Components'
import { EVENT_TYPES } from '@davincid/core/src/Event'

export default {
  name: 'Components',
  props: ['mounted'],
  components: {
    LegoIcon,
    TreeIcon,
    RecordIcon,
    CodeIcon,
    ComponentTree
  },
  data() {
    return {
      asyncComRegisterSuccess: true,
      activeMenu: 'com', // com|tree|history|schema
      menubarPlugins: [
        // { name: 'MyLoggerPlugin' }
      ],
      activeTabName: 'component', // component|template
      componentList,
      customComList,
      activeCollapseNames: ['1', '2', '3', '4'],
      collapseList: [
        { name: '1', title: '布局组件', key: 'layoutCom' },
        { name: '2', title: '视图组件', key: 'viewCom' },
        { name: '3', title: '表单组件', key: 'formCom' }
        // { name: '4', title: '自定义组件', key: 'customComList' }
      ]
    }
  },
  computed: {
    activeBarTopVal() {
      return this.activeMenu === 'com' ? '6px' : this.activeMenu === 'tree' ? '42px' : '80px'
    },
    comList() {
      return (key) => {
        return this[key]
      }
    },
    layoutCom() {
      return this.componentList.filter((i) => i.componentType === ComponentTypes.LAYOUT)
    },
    viewCom() {
      return this.componentList.filter((i) => i.componentType === ComponentTypes.VIEW)
    },
    formCom() {
      return this.componentList.filter((i) => i.componentType === ComponentTypes.FORM)
    },
    __components__() {
      return this.__designer__.__components__
    }
  },
  watch: {
    mounted(val) {
      if (!val) return
      this.registerCom()
      this.registerCustomCom()
      this.__components__.ui = this
      this.__components__.triggerUIInit()
    }
  },
  methods: {
    addPlugin(plug) {
      this.menubarPlugins.push(plug)
      return '.' + this.genClsName(plug.name)
    },
    genClsName(name) {
      return `component-${name}-wrap`
    },
    registerCom() {
      const comItems = document.querySelectorAll('.com-item')
      for (const el of comItems) {
        const comName = el.getAttribute('com-name')
        const com = componentList.find((i) => i.componentName === comName)
        this.__components__.registerComponent(el, com)
      }
    },
    registerCustomCom() {
      const comItems = document.querySelectorAll('.custom-com-item')
      const modArr = []
      for (const el of comItems) {
        const comName = el.getAttribute('com-name')
        const com = customComList.find((i) => i.componentName === comName)
        modArr.push({ comEl: el, com })
      }
      this.__components__
        .registerAsyncComponents(modArr)
        .then((res) => {
          this.__designer__.emit(EVENT_TYPES.COMPONENTS_REGISTER_END) // 分发全局事件 组件面板初始化
        })
        .catch((err) => {
          this.asyncComRegisterSuccess = false
          this.__designer__.emit(EVENT_TYPES.COMPONENTS_REGISTER_END)
        })
    },
    handleClick() {}
  }
}
</script>
