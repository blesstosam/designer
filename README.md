<p align="center">
  <img src="./resource/logo.png" />
</p>

---

# 预览图

![Preview](https://static01.imgkr.com/temp/6194a12b297c4218aba90e3720efe059.png)

# 设计器开发

```shell
$ npm run dev
```

# 使用

通过构造 designer 对象并传入对应渲染组件的方法（遵循一定规范），就可以构建出自己的设计器。设计器的 UI 完全可以由用户自己决定，在 UI 组件对象上可以获取设计器的核心 API，通过核心 API 可以控制设计器的行为。

```js
const designer = new Designer({
  canvasWrap: '.canvas-wrap',
  renderComponents,
  renderComponentTree,
  renderToolbar,
  renderAttr,
  plugins: [LoggerPlugin, StatusBar]
})
// eg: 通过组件模块动态注册组件
designer.__components__.registerComponent()
```

# Core

1. 依赖注入
2. 视图使用 vue3 渲染，和设计器核心类可以通过 **vue 实例调用方法和核心类调用 vue 实例方法（即 UI 必须实现该方法）** 来交互；canvas 里的组件使用 vue3 来渲染。两者均可以使用其他框架来渲染，和核心 api 无关。

```js
this.__componentTree__.uiInstance.callMethod() // core call ui method
uiInstance.__componentTree__.callMethod() // ui call core method
```

# 扩展机制

1. 提供插件机制，通过传入插件，替代默认实现的插件和添加自己的插件，达到替换视图的目的，在自定义插件里传入相关的 api 和配置

```js
class MyComponents {
  construtor(designer) {}
}
const designer = new Designer({
  plugins: ['__components__', MyComponents]
})
```

2. 每个插件需要实现核心 api，视图里面可以拿到这些核心 api 调用，完成视图的绘制，支持任意框架

```js
class Components {
  init(renderUI) {
    this.uiInstance = renderUI()
    this.uiInstance.__designer__ = this.__designer__
  }
  registerComponent() {}
}
const _renderUI = () => {
  return createApp(Com)
}
this.__components__.init(_renderUI)
```

3. 属性面板本质上是表单，所以使用 json schema 去描述。  
   定义好所有的表单类型后，新开发的组件只需要写对应的 schema 即可渲染出正确的属性面板。

4. 通信机制，eventBus

5. 组件框架无关

# TODO

| todo | 状态 | 增加时间 |
| --- | --- | --- |
| 自定义组件集成 | √ | 2021/7/1 |
| 自定义组件预览页面集成 | √ | 2021/7/1 |
| 自定义组件的属性面板 | - | 2021/7/1 |
| 扩展机制，参考 bpmn.js | - | 2021/7/1 |
| viewModel 抽象类 | √ | 2021/7/1 |
| 定义事件类型，每一个操作都对应一种操作，进行全局分发，各插件可以根据需求自行监听 | √ | 2021/7/1 |
| 属性面板增加公共样式调整，支持 margin，padding，border | √ | 2021/7/6 |
| 缩放功能 | - | 2021/7/7 |
| undo&redo | √ | 2021/7/7 |
| event 抽成 eventbus | - | 2021/7/7 |
| 改成 lerna 管理，分为核心库和应用层 | - | 2021/7/7 |
| 使用 vercel 部署 | √ | 2021/7/7 |
| viewModel 数据结构增加根节点 | √ | 2021/7/11 |
| 增加 hover 效果 | √ | 2021/7/13 |
| 加入代码编辑功能 | - | 2021/7/16 |
| di 机制 | - | 2021/7/16 |
| cursor 逻辑 | - | 2021/7/16 |
| 写一个 log 插件，记录每一次操作，打印在左侧角落 | √ | 2021/7/16 |
| 原生 event 绑定 | - | 2021/7/21 |
| 组件 event 绑定，参数通过定义的 schema 传递过来 | - | 2021/7/27 |
| viewModel 去掉，使用 Node | √ | 2021/8/1 |
| 属性面板 schema 结构去掉嵌套，使用 belong 标示属于哪个类别 | - | 2021/8/1 |
| 将 hover 改为 div 盒子 | √ | 2021/8/4 |
| hover 效果加一个移动渐变效果 | √ | 2021/8/4 |
| 组件是框架无关的，vue/react/原生/svg/canvas 都可以作为组件加载，只要符合组件规范 | - | 2021/8/6 |
| setDragImage 其他方法实现,使用 mousemove 事件插入自定义元素，改变 x，y 值 | - | 2021/8/9 |
| 画布下面添加路径，eg: canvas=>container=>text，使用插件的方式 | √ | 2021/9/10 |
| 兼容绝对定位布局&文档流布局 | - | 2021/9/15 |
| 自定义组件逻辑重写 | - | 2021/9/25 |
