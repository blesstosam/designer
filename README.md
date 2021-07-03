# 预览图

![Preview](https://raw.githubusercontent.com/blesstosam/designer/master/resource/preview.png)

# 设计器开发

```shell
$ cd new && npm install && npm run serve
```

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
