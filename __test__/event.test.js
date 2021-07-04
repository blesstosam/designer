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

  test('test `on` pass a array ', (done) => {
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
})
