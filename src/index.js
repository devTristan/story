import 'babel-polyfill'
import { inspect } from 'util'

// CONSTANT(S)

const putSymbol = Symbol()

// UTILITY EXPORTS

export function call (fn, ...args) {
  return [call, fn, ...args]
}

export function apply (context, fn, ...args) {
  return [apply, context, fn, ...args]
}

export function put (value) {
  return [put, value]
}

export function take (iterator, input, output) {
  return [take, iterator, input, output]
}

export function callback (context, fn, ...args) {
  let originalArgs = [context, fn, ...args]
  if (typeof context === 'function') {
    if (typeof fn !== 'undefined') {
      args.unshift(fn)
    }
    ;[fn, context] = [context, null]
  }
  if (typeof fn !== 'function') {
    throw new Error([
      'Missing function argument',
      'Expected: callback([context], function, [...args])',
      `Actual: callback(${ originalArgs.map(inspect).join(', ') })`
    ].join('\n'))
  }
  return [callback, context, fn, ...args]
}
export let cb = callback

export function pipe (...pipeline) {
  return [pipe, ...pipeline]
}
const APPEND = Symbol()
pipe.append = function pipeAppend (...pipeline) {
  console.log(5)
  return pipe(...pipeline, APPEND)
}

// INTERNAL UTILITY FUNCTIONS

function isPromise (thing) {
  return typeof thing === 'object' && thing !== null && typeof thing.then === 'function'
}

const allowedCalls = new Set([call, apply, put, take, callback, pipe])

function isCall (thing) {
  return Array.isArray(thing) && allowedCalls.has(thing[0])
}

function isPlainObject (thing) {
  return (
    thing !== null &&
    typeof thing === 'object' &&
    !Array.isArray(thing) &&
    typeof thing.constructor === 'function' &&
    thing.constructor.prototype !== null &&
    typeof thing.constructor.prototype === 'object' &&
    thing.constructor.prototype.hasOwnProperty('isPrototypeOf')
  )
}

function isPut (thing) {
  return Array.isArray(thing) && thing[0] === putSymbol
}

// YIELD INTERPRETER

const interpreters = {
  [callback]: (context, fn, ...args) => new Promise(
    (resolve, reject) => fn.call(context, ...args,
      (err, result) => err ? reject(err) : resolve(result)
    )
  ),
  [pipe]: (...pipeline) => new Promise((resolve, reject) => {
    let append = (pipeline[pipeline.length - 1] === APPEND)
    if (append) pipeline.pop()

    if (pipeline.length < 1) {
      throw new Error('pipe(...pipeline) requires at least 1 argument')
    }

    let p
    let i = 0
    for (let item of pipeline) {
      item.on('error', reject)

      console.log(i, i === pipeline.length - 1, append)

      if (i === pipeline.length - 1 && append) {
        p.on('end', resolve)
      }

      p = !p ? item : p.pipe(item, { end: !append && i !== pipeline.length - 1 })

      if (i === pipeline.length - 1 && !append) {
        p.on('end', resolve)
      }

      i++
    }
  }),
  [call]: (fn, ...args) => fn(...args),
  [apply]: (context, fn, ...args) => fn.apply(context, args),
  [put]: thing => [putSymbol, thing],
  [take]: (iterator, output, input) => {
    let nextVal = iterator.next(input).value
    if (isPromise(nextVal)) {
      return nextVal.then(
        ({ value, done }) => output ? !Object.assign(output, { value, done }).done : value
      )
    } else {
      let { value, done } = nextVal
      return output ? !Object.assign(output, { value, done }).done : value
    }
  }
}

function interpretArray (thing) {
  // Like Promise.all but recursive and interpretive
  thing = thing.map(subThing => interpret(subThing))
  return (thing.some(isPromise)) ? Promise.all(thing) : thing
}

function interpretObject (thing) {
  // Like Promise.all but for objects, recursive, and interpretive

  let keys = Object.keys(thing)

  return Promise.all(
    keys
      .map(key => thing[key])
      .map(interpret)
  ).then(results => {
    let result = {}
    for (let i in keys) {
      result[keys[i]] = results[i]
    }
    return result
  })
}

function interpret (thing) {
  if (isPromise(thing)) return thing
  if (isCall(thing)) return interpreters[thing[0]](...thing.slice(1))
  if (Array.isArray(thing)) return interpretArray(thing)
  if (isPlainObject(thing)) return interpretObject(thing)
  return thing
}

// SUPERVISOR
// Walks across the iterator, interpreting stuff, handling errors

function supervise (state, resolve, reject) {
  if (state.busy || state.done) {
    let err = new Error('this story is not ready')
    reject(err)
    state.it.throw(err)
    return
  }

  try {
    state.busy = true

    let { value, done } = state.nextInput === null ? state.it.next() : state.it.next(state.nextInput)
    state.done = done

    value = interpret(value)

    if (Array.isArray(value) && value.some(isPut)) {
      let [firstPut, backlog] = value.filter(isPut)
      state.busy = false
      state.backlog = backlog
      state.nextInput = value.map(val => isPut(val) ? null : val)
      resolve({ value: firstPut, done })
    } else if (isPut(value)) {
      state.busy = false
      resolve({ value: value[1], done })
    } else if (isPromise(value)) {
      value.then(result => {
        state.nextInput = result
        if (!done) {
          state.busy = false
          supervise(state, resolve, reject)
        }
      })
      .catch(err => {
        state.busy = false
        reject(err)
        state.it.throw(err)
      })
    } else {
      state.nextInput = value
      if (!done) {
        state.busy = false
        supervise(state, resolve, reject)
      } else {
        resolve({ value, done })
      }
    }
  } catch (err) {
    reject(err)
    state.it.throw(err)
  }
}

// THIS VOODOO THING HELPS WITH PROMISIFICATION

function walkOverAsyncIterator (iterator, resolve, reject, { value: previousValue, done: previousDone } = {}) {
  if (typeof resolve === 'undefined') {
    return new Promise(walkOverAsyncIterator.bind(null, iterator))
  }

  let { value, done } = iterator.next()
  if (done) {
    if (isPromise(value)) {
      resolve(
        value.then(({ value: finalValue }) => typeof finalValue === 'undefined' ? value : finalValue)
      )
    } else if (typeof value === 'undefined') {
      resolve(previousValue)
    } else {
      resolve(value)
    }
  } else if (isPromise(value)) {
    value.then(walkOverAsyncIterator.bind(null, iterator, resolve, reject)).catch(reject)
  } else {
    walkOverAsyncIterator(iterator, resolve, reject, { value, done })
  }
}

// THE MAIN EVENT

// POEM RETURNS A GENERATOR

export function * poem (sourceFunction, ...args) {
  let state = {
    it: sourceFunction(...args),
    done: false,
    nextInput: null,
    busy: false,
    backlog: []
  }

  while (!state.done) {
    if (state.backlog.length) {
      yield* state.backlog
      state.backlog = []
    }
    yield new Promise(supervise.bind(null, state))
  }
}

poem.wrap = function poemWrap (sourceFunction) {
  let fn = poem.bind(null, sourceFunction)

  fn.original = sourceFunction
  fn.displayName = sourceFunction.displayName || sourceFunction.name || 'poem'

  return fn
}

export function story (sourceFunction, ...args) {
  return walkOverAsyncIterator(poem(sourceFunction, ...args))
}

story.wrap = function storyWrap (sourceFunction) {
  let fn = story.bind(null, sourceFunction)

  fn.original = sourceFunction
  fn.displayName = sourceFunction.displayName || sourceFunction.name || 'story'

  return fn
}

// STORY RETURNS A PROMISE

export function main (sourceFunction) {
  story(sourceFunction).catch(err => {
    if (err instanceof Error) {
      console.error(err.stack)
    } else {
      console.error('Got non-Error error:', err)
    }
    process.exit(1)
  })
}
