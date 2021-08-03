import { expect, describe, beforeAll, afterAll } from '@jest/globals'
import { Event } from '../new/src/designer/Event'

describe('test event', () => {
  const event = new Event('test')

  test('test `on` and `emit`', done => {
    event.on('click', p => {
      expect(p).toBe('1')
      done()
    })

    event.emit('click', '1')
  })

  test('test `once`', done => {
    let count = 0,
      count1 = 0
    event.once('click', p => {
      count++
      expect(p).toBe('1')
      done()
    })
    event.once('click', p => {
      count1++
      expect(p).toBe('1')
      done()
    })
    event.emit('click', '1')
    event.emit('click', '1')
    expect(count).toBe(1)
    expect(count1).toBe(1)
  })

  test('test `on` twice', done => {
    let count = 0
    event.on('click', p => {
      count++
      expect(p).toBe('1')
      done()
    })

    event.emit('click', '1')
    event.emit('click', '1')

    expect(count).toBe(2)
  })

  test('test `on` with a array ', done => {
    let count = 0
    event.on(['click', 'click2'], p => {
      count++
      expect(p).toBe('1')
      done()
    })

    event.emit('click', '1')
    event.emit('click2', '1')

    expect(count).toBe(2)
  })

  test('test `emit` twice', done => {
    let count = 0
    event.on('click', p => {
      count++
      expect(p).toBe('1')
      done()
    })

    event.emit('click', '1')
    event.emit('click', '1')

    expect(count).toBe(2)
  })

  test('test `on` twice', () => {
    let count = 0
    event.on('click', () => {
      count++
    })

    event.on('click', () => {
      count++
    })

    event.emit('click', '1')

    expect(count).toBe(2)
  })

  test('test `off`', () => {
    let count = 0
    const cb = () => {
      count++
    }
    event.on('click', cb)
    event.off('click', cb)

    event.emit('click', '1')

    expect(count).toBe(0)
  })

  test('test `off` with a array', () => {
    let count = 0
    const cb = () => {
      count++
    }
    event.on(['click', 'click1'], cb)
    event.off(['click', 'click1'], cb)

    event.emit('click', '1')
    event.emit('click1', '1')

    expect(count).toBe(0)
  })

  test('test `off` all subs', () => {
    let count = 0
    const cb = () => {
      count++
    }
    const cb2 = () => {
      count++
    }
    event.on('click', cb)
    event.on('click', cb2)
    event.off('click')
    event.emit('click', '1')

    expect(count).toBe(0)
  })

  test('test `priority`', done => {
    let one = 0,
      two = 0
    const cb = () => {
      one++
      expect(two).toBe(1)
      done()
    }
    const cb2 = () => {
      two++
      expect(one).toBe(0)
      done()
    }
    event.on('click', cb)
    event.on('click', 1500, cb2)
    event.emit('click')
    expect(one).toBe(1)
    expect(two).toBe(1)
  })

  test('test `once with priority`', done => {
    const event2 = new Event('test2')
    let one = 0,
      two = 0
    const cb = () => {
      one++
      expect(two).toBe(1)
      done()
    }
    const cb2 = () => {
      two++
      expect(one).toBe(0)
      done()
    }
    event2.once('click', cb)
    event2.once('click', 1500, cb2)
    event2.emit('click')
    event2.emit('click')
    expect(one).toBe(1)
    expect(two).toBe(1)
  })
})
