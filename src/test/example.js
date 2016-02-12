import assert from 'assert'
import { callback } from '../'

const get = () => {}

function * checkGithubStatus () {
  let { statusCode } = yield callback(get, 'http://github.com')

  if (statusCode >= 200 && statusCode < 300) {
    return 'up'
  } else {
    return 'down'
  }
}

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
