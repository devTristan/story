import { story, poem, put, call, callback, take } from '../'
import test from '../tape'
import util from 'util'

const count = poem.wrap(function * count (min, max) {
  for (let i = min; i <= max; i++) {
    yield put(i)
  }
})

const double = x => 2 * x
const triple = x => 3 * x

test('story.wrap syntax', function * (t) {
  let join = story.wrap(function * join (...values) {
    return values.join(' ')
  })

  let msg = yield join('Hello,', 'World!')
  t.equal(msg, 'Hello, World!')
})

test('epic(fn).promised(...args) syntax', function * (t) {
  let values = ['Hello,', 'World!']

  let msg = yield story(function * join () {
    return values.join(' ')
  })

  t.equal(msg, 'Hello, World!')
})

test('basic generator usage', function * (t) {
  let it = count(0, 3)

  let next = it.next()
  t.ok(next.value instanceof Promise)
  t.equal(next.done, false)
  next = yield next.value
  t.equal(next.value, 0)
  t.equal(next.done, false)

  next = it.next()
  t.ok(next.value instanceof Promise)
  t.equal(next.done, false)
  next = yield next.value
  t.equal(next.value, 1)
  t.equal(next.done, false)

  next = it.next()
  t.ok(next.value instanceof Promise)
  t.equal(next.done, false)
  next = yield next.value
  t.equal(next.value, 2)
  t.equal(next.done, false)

  next = it.next()
  t.ok(next.value instanceof Promise)
  t.equal(next.done, false)
  next = yield next.value
  t.equal(next.value, 3)
  t.equal(next.done, false)

  next = it.next()
  t.ok(next.value instanceof Promise)
  t.equal(next.done, false)
  next = yield next.value
  t.equal(next.value, undefined)
  t.equal(next.done, true)
})

test('fancy generator usage', function * (t) {
  const countDouble = poem.wrap(function * count (min, max) {
    for (let i = min; i <= max; i++) {
      let i2 = yield call(double, i)
      yield put(i2)
    }
  })

  let it = countDouble(4, 5)

  let next = it.next()
  t.ok(next.value instanceof Promise)
  t.equal(next.done, false)
  next = yield next.value
  t.equal(next.value, 8)
  t.equal(next.done, false)

  next = it.next()
  t.ok(next.value instanceof Promise)
  t.equal(next.done, false)
  next = yield next.value
  t.equal(next.value, 10)
  t.equal(next.done, false)

  next = it.next()
  t.ok(next.value instanceof Promise)
  t.equal(next.done, false)
  next = yield next.value
  t.equal(next.value, undefined)
  t.equal(next.done, true)
})

test('take(iterator)', function * (t) {
  let collection = []
  let it = count(1, 8)
  let item
  while ((item = yield take(it))) {
    collection.push(item)
  }
  t.deepEqual(collection, [1, 2, 3, 4, 5, 6, 7, 8])
})

test('take(iterator, output)', function * (t) {
  let collection = []
  let it = count(0, 5)
  let item = {}
  while (yield take(it, item)) {
    collection.push(item.value)
  }
  t.deepEqual(collection, [0, 1, 2, 3, 4, 5])
})

test('callback(context, fn, ...args)', function * (t) {
  // This test throws 32 different sets of arguments at the callback export
  // Woah

  let obj = {}
  let noop = () => {}
  const OPTIONAL = Symbol()

  let permutations = [
    [noop, [obj, noop]],
    [1, 'hi', Symbol(), OPTIONAL],
    [1, 'hi', Symbol(), OPTIONAL]
  ]

  let expectations
  for (let options of permutations) {
    if (expectations) {
      let newExpectations = []
      for (let expectation of expectations) {
        for (let option of options) {
          if (option === OPTIONAL) break
          if (!Array.isArray(option)) {
            option = [option]
          }
          newExpectations.push(expectation.concat(option))
        }
      }
      expectations = expectations.concat(newExpectations)
    } else {
      expectations = options.map(opt => Array.isArray(opt) ? opt : [opt])
    }
  }

  for (let spec of expectations) {
    let expected = [callback, ...(spec[0] === noop ? [null].concat(spec) : spec)]
    t.deepEqual(
      callback(...spec), expected,
      `callback(${spec.map(util.inspect).join(', ')}) === [${expected.map(util.inspect).join(', ')}]`
    )
  }
})

test('nested yields', function * (t) {
  let results = yield [
    call(double, 1.5),
    call(double, 8),
    call(triple, -0.5),
    [
      Promise.resolve(5),
      call(triple, 8),
      [
        call(double, 8),
        false
      ]
    ]
  ]
  t.deepEqual(results, [3, 16, -1.5, [5, 24, [16, false]]])

  results = yield {
    first: 1,
    second: Promise.resolve(2),
    third: call(double, 1.5),
    fourth: [
      Promise.resolve(4),
      call(double, 2.5),
      {
        fifth: 5,
        sixth: {
          seventh: call(double, 3.5)
        }
      }
    ]
  }

  t.deepEqual(results, {
    first: 1,
    second: 2,
    third: 3,
    fourth: [4, 5, {
      fifth: 5,
      sixth: {
        seventh: 7
      }
    }]
  })
})
