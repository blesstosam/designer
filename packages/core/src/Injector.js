// 循环依赖可以做成使用 get name() {} lazy access
class A {
  constructor(b) {
    this.b = b
  }
  log() {
    console.log('a')
  }
  logOfB() {
    this.b.log()
  }
}

class B {
  constructor(a) {
    this.a = a
  }
  log() {
    console.log('b')
  }
  logOfA() {
    this.a.alert()
  }
}

class C {
  constructor(a, b) {
    this.a = a
    this.b = b
  }
  log() {
    console.log('c')
  }
  logOfA() {
    this.a.log()
  }
  logOfB() {
    this.b.log()
  }
}

const AModule = {
  __depend__: [B],
  __name__: 'a',
  a: A
}
const BModule = {
  __depend__: [A],
  __name__: 'b',
  b: B
}
const CModule = {
  __depend__: [A, B],
  __name__: 'c',
  c: C
}

class Injector {
  constructor(modules) {
    this._instances = []
    this.init(modules)
  }
  init(modules) {
    for (const mod of modules) {
      const clazz = mod[mod.__name__]
      const deps = mod.__depend__
      const ins = this.findInstance(deps)
      this._instances.push({ name: mod.__name__, i: new clazz(...ins) })
    }
  }
  findInstance(deps) {
    const arr = []
    for (const dep of deps) {
      const instance =
        this._instances.find(i => i instanceof dep) || this._instances.push(new dep())
      arr.push(instance)
    }
    return arr
  }

  get(name) {
    const i = this._instances.find(i => i.name === name)
    if (i) return i.i
    return null
  }
}

const injector = new Injector([AModule])
console.log(injector, injector.get('a').log())

// const a = new A()
// const b = new B(a)
// const c = new C(a)
