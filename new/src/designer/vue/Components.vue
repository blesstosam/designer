<style scoped>
.component {
  display: flex;
  height: 100%;
}
.component-left {
  width: 45px;
  border-right: 1px solid #eee;
  padding-top: 6px;
  text-align: center;
  flex: none;
  box-sizing: border-box;
}
.component-left .menu-item {
  padding: 6px 0;
  box-sizing: border-box;
  cursor: pointer;
}

.active-menu-item {
  border-left: 3px solid #1989fa;
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

.component-tree-wrap {
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
      <div :class="{ 'menu-item': true, 'active-menu-item': activeMenu === 'com' }">
        <svg
          t="1624967050998"
          class="icon"
          viewBox="0 0 1024 1024"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          p-id="4119"
          xmlns:xlink="http://www.w3.org/1999/xlink"
          :fill="activeMenu === 'com' ? '#1989fa' : '#515151'"
          width="22"
          height="22"
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
          :fill="activeMenu === 'tree' ? '#1989fa' : '#515151'"
          width="22"
          height="22"
          @click="handleMenuClick('tree')"
        >
          <path
            d="M848 766.4c44.182 0 80 35.818 80 80s-35.818 80-80 80H592c-44.182 0-80-35.818-80-80s35.818-80 80-80h256z m0 48H592c-17.674 0-32 14.326-32 32s14.326 32 32 32h256c17.674 0 32-14.326 32-32s-14.326-32-32-32zM176 96c44.182 0 80 35.818 80 80 0 35.82-23.542 66.144-56 76.336V512h200c13.254 0 24 10.746 24 24s-10.746 24-24 24H200v246.4c0 8.688 6.923 15.757 15.552 15.994l0.448 0.006h232c13.254 0 24 10.746 24 24 0 13.088-10.475 23.728-23.498 23.995l-0.502 0.005H216c-34.992 0-63.426-28.083-63.992-62.942L152 806.4V252.338C119.544 242.146 96 211.82 96 176c0-44.182 35.818-80 80-80z m672 360c44.182 0 80 35.818 80 80s-35.818 80-80 80H592c-44.182 0-80-35.818-80-80s35.818-80 80-80h256z m0 48H592c-17.674 0-32 14.326-32 32s14.326 32 32 32h256c17.674 0 32-14.326 32-32s-14.326-32-32-32z m0-408c44.182 0 80 35.818 80 80s-35.818 80-80 80H400c-44.182 0-80-35.818-80-80s35.818-80 80-80h448z m-672 48c-17.674 0-32 14.326-32 32s14.326 32 32 32 32-14.326 32-32-14.326-32-32-32z m672 0H400c-17.674 0-32 14.326-32 32s14.326 32 32 32h448c17.674 0 32-14.326 32-32s-14.326-32-32-32z"
            p-id="3297"
          ></path>
        </svg>
      </div>

      <!-- <div :class="{ 'menu-item': true, 'active-menu-item': activeMenu === 'schema' }">
        <svg
          t="1626450925255"
          class="icon"
          viewBox="0 0 1024 1024"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          p-id="2798"
          :fill="activeMenu === 'schema' ? '#1989fa' : '#707070'"
          width="22"
          height="22"
          @click="handleMenuClick('schema')"
        >
          <path
            d="M903.232 138.24h-782.48a44 44 0 0 0-43.96 44.048v659.424a44 44 0 0 0 43.96 44.048h782.48a44.008 44.008 0 0 0 43.968-44.048V182.288a44.008 44.008 0 0 0-43.968-44.048z m-8.256 693.32H127.096V190.352h767.88v641.208z"
            p-id="2799"
            fill="#515151"
          ></path>
          <path
            d="M220.056 511.992l146.568-146.568c9.168-9.168 9.168-22.896 0-32.064-9.16-9.16-22.904-9.16-32.056 0L171.96 495.968c-4.576 4.576-6.872 9.16-6.872 16.024 0 6.872 2.296 11.456 6.872 16.032L334.56 690.632c9.16 9.16 22.904 9.16 32.056 0 9.168-9.168 9.168-22.904 0-32.072l-146.56-146.568zM576.128 269.24c-11.448-2.288-25.184 4.584-27.488 16.032L429.552 727.264c-2.288 11.456 4.584 25.192 16.032 27.496 11.448 2.28 25.184-4.584 27.48-16.04L592.16 296.72c4.576-11.448-2.304-25.192-16.032-27.48zM852.048 495.968L689.44 333.36c-9.16-9.16-22.896-9.16-32.056 0-9.168 9.168-9.168 22.896 0 32.064l146.56 146.568-146.56 146.568c-9.168 9.168-9.168 22.904 0 32.072 9.16 9.16 22.896 9.16 32.056 0l162.608-162.608c4.576-4.576 6.864-11.456 6.864-16.032 0-6.864-2.288-11.448-6.864-16.024z"
            p-id="2800"
            fill="#515151"
          ></path>
        </svg>
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

    <!-- <div v-show="activeMenu === 'schema'">schema 开发</div> -->
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
      asyncComRegisterSuccess: true,
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
    viewCom() {
      return this.componentList.filter(i => i.componentType === componentTypes.VIEW)
    },
    formCom() {
      return this.componentList.filter(i => i.componentType === componentTypes.FORM)
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
          this.asyncComRegisterSuccess = false
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
