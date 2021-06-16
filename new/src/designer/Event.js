// 封装消息总线 发布订阅模式
export class Event {
  constructor() {
    this.subscribes = new Map();
  }

  on(type, cb) {
    const origin = this.subscribes.get(type);
    if (origin) {
      this.subscribes.set(type, [...origin, cb]);
    } else {
      this.subscribes.set(type, [cb]);
    }
  }

  off(type, cb) {
    const origin = this.subscribes.get(type);
    const index = origin.findIndex((i) => i === cb);
    if (index > -1) {
      origin.splice(index, 1);
    }
  }

  emit(type, ...args) {
    const origin = this.subscribes.get(type);
    if (origin && origin.length) {
      for (const fn of origin) {
        fn.call(this, ...args);
      }
    }
  }
}
