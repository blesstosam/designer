// 分为原生事件和组件的自定义事件
// 将原生代码放到对应事件回调里使用eval执行，这里实现不难；
// 难的是对其他组件的操作，这里需要拿到一个全局上下文，全局上下文通过函数参数注入进去
// function(e, globalCtx) {
  // ...
// }