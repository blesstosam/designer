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

    <div class="component-right">
      <el-tabs
        style="width: 100%"
        v-show="activeMenu === 'com'"
        v-model="activeTabName"
        @tab-click="handleClick"
      >
        <el-tab-pane label="组件库" name="component">
          <div class="component-wrap">
            <el-collapse v-model="activecollapseNames">
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
                    :com-name="item.name"
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
                    :com-name="item.name"
                    :com-title="item.title"
                  >
                    <img width="20" height="20" draggable="false" :src="item.icon.value" alt="" />
                    <div style="margin-top: 2px">{{ item.title }}</div>
                  </div>
                </div>
                <div v-else style="color: #f56c6c; padding-left: 6px;">组件加载失败！</div>
              </el-collapse-item>
            </el-collapse>
          </div>
        </el-tab-pane>
        <el-tab-pane label="模板" name="template">模板</el-tab-pane>
      </el-tabs>

      <div v-show="activeMenu === 'tree'" class="component-tree-wrap"></div>

      <div v-show="activeMenu === 'history'" class="component-history-wrap"></div>

      <!-- <div v-show="activeMenu === 'schema'">schema 开发</div> -->
    </div>
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
import { PLUGIN_TYPES } from '../Plugin'

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
      activeMenu: 'com', // com|tree|history|schema
      activeTabName: 'component', // component|template
      componentList,
      customComList,
      activecollapseNames: ['1', '2', '3', '4'],
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
      return key => {
        return this[key]
      }
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

    // 在这里注册菜单栏插件
    // todo 改成通用的代码 插件需要提供一个图标（svg文件路径）和一个init方法（参数为dom容器或选择器），这里遍历去初始化
    for (let plug of this.__plug__.plugins.values()) {
      const { p: plugInstance, type, name } = plug
      if (type === PLUGIN_TYPES.MENU_BAR) {
        if (name === 'myLoggerPlugin') {
          plugInstance.init('.component-history-wrap')
        }
      }
    }
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
          this.__designer__.emit(EVENT_TYPES.COMPONENTS_INITED) // 分发全局事件 组件面板初始化
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
