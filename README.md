# Story

Story is an generator-based control flow engine that helps you write
complex functions that are highly testable. It is an alternative to
[co](https://github.com/tj/co) and
[async/await](https://jakearchibald.com/2014/es7-async-functions/).

Basically it's a super testable solution to callback hell.

## Getting started

Install

```console
npm i story
# or
npm i --save story
```

Create the story

```js
// stories/checkGithubStatus.js
import { callback } from 'story'
import { get } from 'http'

export default function* checkGithubStatus () {

  let { statusCode } = yield callback(get, 'http://github.com')

  if (statusCode >= 200 && statusCode < 300) {
    return 'up'
  } else {
    return 'down'
  }

}
```

Run the story

```js
// index.js
import { story } from 'story'
import example from './stories/example'

story(checkGithubStatus).then(
  status => console.log(status) // "up"
)
```

Test the story

```js
// test/example.js
import { call } from 'story'
import checkGithubStatus from '../stories/checkGithubStatus'
import assert from 'assert'
import { get } from 'http'

let iterator = checkGithubStatus()

// Start the function
let firstYield = iterator.next()

// Expect the first instruction to be a request to github.com
assert.deepEqual(firstYield, {
  value: callback(get, 'http://github.com'),
  done: false
})

// Mock a 404 response
let secondYield = iterator.next({ statusCode: 404 })

// Make sure the function returns "down"
assert.deepEqual(secondYield, {
  value: 'down',
  done: true
})
```

## API

The API is pretty simple. There are two types of function containers, `story`
and `poem`. A story returns a promise, while a poem returns a generator. Both
support the same yieldables with the exception of `put`, which only works inside
`poem`.

`story.wrap` and `poem.wrap` can be used to wrap a your function for later use
rather than executing it immediately.

#### Containers

##### story(GeneratorFunction)
###### returns Promise

Call a generator and return a promise which will resolve with your last `yield`
or `return` value.

##### story.wrap(GeneratorFunction)
###### returns Function

Convert a generator into a regular function that returns a promise which will
resolve with your last `yield` or `return` value. Use this if you want to use a
story more than once and/or you need to pass in arguments.

##### poem(GeneratorFunction)
###### returns Generator

Exactly like `story`, except returns a Generator instead of a Promise. You can
yield output with `yield put(value)`. Every time `next()` is called on a poem it
will return with a promise that will resolve your next yielded `put`.

Calling `next()` multiple times in a row without waiting for the yielded promise
to resolve will result in an error.

```js
poem(function* () {
  // Every second, poll github and see if it's still up
  while (true) {
    yield call(sleep, 1000)
    let status = yield call(checkGithubStatus)
    yield put(status)
  }
})
```

##### poem.wrap(GeneratorFunction)
###### returns GeneratorFunction

Just like `poem` but instead of executing the GeneratorFunction immediately,
returns another GeneratorFunction that wraps yours for later use.

#### Yieldables

Use these inside a story or poem to do cool stuff.

##### Promises

Yielding a promise will halt execution until it resolves, then return the
resolved value.

##### Arrays and Objects

You can yield an array or object of yieldables and they will be interpreted in
parallel. Nested arrays and objects are supported. Yielding an array of promises
is the same as yielding `Promise.all(arr)`.

##### callback([context], Function, ...arguments)

Run a function with a callback and wait for it to complete. Assume a node-style
(err, result) argument pair. If the first argument is an error, it will be
thrown. Otherwise the second argument will be returned. You can use this to
interface with any library that uses callbacks.

```js
import { story, callback } from 'story'
import { readdir } from 'fs'
story(function* () {
  // List every file in the src directory
  let files = yield callback(readdir, __dirname)
  console.log(files) // [index.js, package.json, ...]
})
```

##### pipe(...streams)

Combine two or more streams into a pipeline, handle errors from any of them,
and resolve when the final stream finishes.

```js
import { story, pipe } from 'story'
import { createReadStream, createWriteStream } from 'fs'
import { createGzip } from 'zlib'

story(function* () {
  // gzip index.js
  yield pipe(
    createReadStream('index.js'),
    createGzip(),
    createWriteStream('index.js.gz')
  )
})
```

##### pipe.append(...streams)

Same as pipe, but does not end the final stream. Useful for combining files. You
will need to manually close your final stream by either calling `stream.end` or
using piping something to it with `pipe` instead of `pipe.append`.

```js
import { story, pipe, callback } from 'story'
import { createReadStream, createWriteStream } from 'fs'

story(function* () {
  let bundle = createWriteStream('bundle.js')
  yield pipe.append(createReadStream('stuff.js'), bundle)
  yield pipe.append(createReadStream('index.js'), bundle)
  yield callback(bundle, bundle.end)
})
```

##### call(Function, ...arguments)

Calls the given function with the given arguments. If it returns a promise,
waits for that promise to resolve. The result is returned.

```js
import { story, call } from 'story'
story(function* () {
  let status = yield call(checkWebsiteStatus, 'http://github.com')
  console.log(status) // "up"
})
```

##### apply(context, Function, ...arguments)

Calls the given function in the given context with the given arguments. If it
returns a promise, waits for that promise to resolve. The result is returned.

Exactly the same as call, but keeps the function bound to the required context.

```js
import { story, apply } from 'story'
story(function* () {
  let myRocket = new Rocket()
  yield apply(myRocket, myRocket.launch, 'mars')
})
```

##### put(value)

Only useful inside a poem, the put function yields a result that can be iterated
over.

```js
import { poem, put } from 'story'
poem(function* clock () {
  let i = 0
  while (true) {
    i++
    yield call(sleep, 1000)
    yield put(i)
  }
})
```

##### take(Iterator)

Pull an item out of an iterator, and wait for it to resolve if it is a promise.

```js
import { story, take } from 'story'
story(function* () {
  let time
  while ((time = yield take(clock))) {
    console.log(time)
  }
})
```

## License

MIT
