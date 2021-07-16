# 预览图

![Preview](https://static01.imgkr.com/temp/6194a12b297c4218aba90e3720efe059.png)

# 设计器开发

```shell
$ cd new && npm install && npm run serve
```

# Core
1. 依赖注入
2. 视图使用vue3渲染，和设计器核心类可以通过**props传递回调函数**，**vue实例调用方法** 来交互

# 扩展机制

1. 提供插件机制，通过传入插件，替代默认实现的插件，达到替换视图的目的，在自定义插件里传入相关的 api 和配置, 参考 bpmn

```js
class MyComponents {
  construtor(designer) {}
}
const designer = new Designer({
  plugins: ['__components__', MyComponents]
})
```

2. 每个插件需要实现核心 api，视图里面可以拿到这些核心 api 调用，完成视图的绘制，目前只支持 vue component

```js
class Components {
  init(com) {
    const app = createApp(com || defaultCom)
    this.vueInstance = app.mount(this.config.componentsWrap)
    this.vueInstance.__components__ = this
  }
  registerComponent() {}
}

this.__components__.init(MyComponentsView)
```

# TODO

| todo | 状态 | 增加时间 |
| --- | --- | --- |
| 自定义组件集成 |  √ | 2021/7/1 |
| 自定义组件预览页面集成 | √ | 2021/7/1 |
| 自定义组件的属性面板 | - | 2021/7/1 |
| 扩展机制，参考bpmn.js | - | 2021/7/1 |
| viewModel 抽象类 | √ | 2021/7/1 |
| 定义事件类型，每一个操作都对应一种操作，进行全局分发，各插件可以根据需求自行监听| √ | 2021/7/1 |
| 属性面板增加公共样式调整，支持margin，padding，border | - | 2021/7/6 |
| 缩放功能 |  - | 2021/7/7 |
| undo&redo |  - | 2021/7/7 |
| event抽成eventbus |  - | 2021/7/7 |
| 改成lerna管理，分为核心库和应用层 |  - | 2021/7/7 |
| 使用vercel部署 |  √  | 2021/7/7 |
| viewModel 数据结构增加根节点 | √ | 2021/7/11 |
| 增加 hover效果 | √ | 2021/7/13 |
| 加入代码编辑功能 | - | 2021/7/16 |
| ci机制 | - | 2021/7/16 |
| 写一个log插件，记录每一次操作，打印在左侧角落 | - | 2021/7/16 |