<style scoped>
.component {
  display: flex;
  height: 100%;
}
.component-left {
  width: 60px;
  border-right: 1px solid #eee;
  text-align: center;
}
.component-left .menu-item {
  padding: 12px 0;
}

.active-menu-item {
  border-left: 3px solid #1989fa;
}

.com-item {
  display: inline-block;
  padding: 6px;
  width: 40px;
  margin-right: 12px;
  font-size: 12px;
  text-align: center;
  cursor: pointer;
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

.component-tree-wrap {
  width: 100%;
}
</style>

<template>
  <div class="component">
    <div class="component-left">
      <div :class="{ 'menu-item': true, 'active-menu-item': activeMenu === 'com' }">
        <svg
          t="1624967050998"
          class="icon"
          viewBox="0 0 1024 1024"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          p-id="4119"
          xmlns:xlink="http://www.w3.org/1999/xlink"
          :fill="activeMenu === 'com' ? '#1989fa' : '#707070'"
          width="24"
          height="24"
          @click="handleMenuClick('com')"
        >
          <path
            d="M398.393 53.481c-85.146 3.634-153.06 73.812-153.06 159.852v10.656l-160 0.011c-17.673 0-32 14.327-32 32v256c0 17.673 14.327 32 32 32h85.334c53.019 0 96 42.98 96 96s-42.981 96-96 96H85.333c-17.673 0-32 14.327-32 32v170.667c0 17.673 14.327 32 32 32h640l3.732-0.216c15.915-1.848 28.268-15.374 28.268-31.784V799.989l53.334 0.011c88.365 0 160-71.634 160-160l-0.148-6.94C966.885 547.914 896.707 480 810.667 480l-53.334-0.01V256l-0.215-3.732C755.27 236.353 741.744 224 725.333 224l-160-0.01v-10.657c0-88.365-71.634-160-160-160l-6.94 0.148z m6.94 63.852c53.02 0 96 42.981 96 96V256l0.216 3.732C503.397 275.647 516.923 288 533.333 288l160-0.01V512c0 17.673 14.327 32 32 32h85.334c53.019 0 96 42.98 96 96s-42.981 96-96 96h-85.334l-3.732 0.215c-15.914 1.849-28.268 15.374-28.268 31.785v138.645h-576V799.99l53.334 0.011c88.365 0 160-71.634 160-160l-0.148-6.94C326.885 547.914 256.707 480 170.667 480l-53.334-0.01v-192l160 0.01c17.673 0 32-14.327 32-32v-42.667c0-53.019 42.981-96 96-96z"
            p-id="4120"
          ></path>
        </svg>
      </div>

      <div :class="{ 'menu-item': true, 'active-menu-item': activeMenu === 'tree' }">
        <svg
          t="1624966999151"
          class="icon"
          viewBox="0 0 1024 1024"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          p-id="3296"
          xmlns:xlink="http://www.w3.org/1999/xlink"
          :fill="activeMenu === 'tree' ? '#1989fa' : '#707070'"
          width="24"
          height="24"
          @click="handleMenuClick('tree')"
        >
          <path
            d="M848 766.4c44.182 0 80 35.818 80 80s-35.818 80-80 80H592c-44.182 0-80-35.818-80-80s35.818-80 80-80h256z m0 48H592c-17.674 0-32 14.326-32 32s14.326 32 32 32h256c17.674 0 32-14.326 32-32s-14.326-32-32-32zM176 96c44.182 0 80 35.818 80 80 0 35.82-23.542 66.144-56 76.336V512h200c13.254 0 24 10.746 24 24s-10.746 24-24 24H200v246.4c0 8.688 6.923 15.757 15.552 15.994l0.448 0.006h232c13.254 0 24 10.746 24 24 0 13.088-10.475 23.728-23.498 23.995l-0.502 0.005H216c-34.992 0-63.426-28.083-63.992-62.942L152 806.4V252.338C119.544 242.146 96 211.82 96 176c0-44.182 35.818-80 80-80z m672 360c44.182 0 80 35.818 80 80s-35.818 80-80 80H592c-44.182 0-80-35.818-80-80s35.818-80 80-80h256z m0 48H592c-17.674 0-32 14.326-32 32s14.326 32 32 32h256c17.674 0 32-14.326 32-32s-14.326-32-32-32z m0-408c44.182 0 80 35.818 80 80s-35.818 80-80 80H400c-44.182 0-80-35.818-80-80s35.818-80 80-80h448z m-672 48c-17.674 0-32 14.326-32 32s14.326 32 32 32 32-14.326 32-32-14.326-32-32-32z m672 0H400c-17.674 0-32 14.326-32 32s14.326 32 32 32h448c17.674 0 32-14.326 32-32s-14.326-32-32-32z"
            p-id="3297"
          ></path>
        </svg>
      </div>
    </div>

    <el-tabs
      style="padding: 0 4px; width: 100%"
      v-show="activeMenu === 'com'"
      v-model="activeName"
      @tab-click="handleClick"
    >
      <el-tab-pane label="组件库" name="component">
        <div class="component-wrap">
          <div style="margin-bottom: 12px">布局组件</div>
          <div ref="layoutWrapEl" style="marginBottom: 24px">
            <div
              class="com-item"
              v-for="(item, index) in layoutCom"
              :key="index"
              :com-name="item.name"
            >
              <img width="20" height="20" draggable="false" :src="item.icon.value" alt="" />
              <div style="margin-top: 6px">{{ item.title }}</div>
            </div>
          </div>

          <div style="margin-bottom: 12px">基础组件</div>
          <div ref="basicWrapEl" style="marginBottom: 24px">
            <div
              class="com-item"
              v-for="(item, index) in basicCom"
              :key="index"
              :com-name="item.name"
            >
              <img width="20" height="20" draggable="false" :src="item.icon.value" alt="" />
              <div style="margin-top: 6px">{{ item.title }}</div>
            </div>
          </div>

          <div style="margin-bottom: 12px">自定义组件</div>
          <div ref="customWrapEl" style="marginBottom: 24px">
            <div
              class="custom-com-item"
              v-for="(item, index) in customComList"
              :key="index"
              :com-name="item.name"
            >
              <img width="20" height="20" draggable="false" :src="item.icon.value" alt="" />
              <div style="margin-top: 6px">{{ item.title }}</div>
            </div>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="模板" name="template">模板</el-tab-pane>
    </el-tabs>

    <div v-show="activeMenu === 'tree'" class="component-tree-wrap"></div>
  </div>
</template>

<script>
import { componentTypes } from '../Components'
import { componentList, customComList } from '../config'
import { EVENT_TYPES } from '../Event'

export default {
  name: 'Components',
  data() {
    return {
      activeMenu: 'com', // com|tree
      activeName: 'component', // component|template
      componentList,
      customComList
    }
  },
  computed: {
    layoutCom() {
      return this.componentList.filter(i => i.componentType === componentTypes.LAYOUT)
    },
    basicCom() {
      return this.componentList.filter(i => i.componentType !== componentTypes.LAYOUT)
    },
    __designer__() {
      return this.__components__.__designer__
    }
  },
  mounted() {
    this.registerCom()
    this.registerCustomCom()
    this.__designer__.initComponentTree('.component-tree-wrap')
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
          this.__designer__.emit(EVENT_TYPES.COMPONENTS_INITED)
        })
    },
    handleMenuClick(menu) {
      this.activeMenu = menu
    },
    handleClick() {}
  }
}
</script>
