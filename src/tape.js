import { story } from './'
import tape from 'tape'

function runTest (fn, t) {
  story(fn, t)
    .then(t.end.bind(t))
    .catch(t.fail.bind(t))
}

export default function test (name, fn) {
  if (typeof name === 'function') {
    fn = name
    name = String(fn.displayName || fn.name).replace(/([a-z][A-Z])/g,
      (match, chr) => (chr ? chr.toLowerCase().split('').join(' ') : chr)
    )
    name = name || undefined
  }
  return (
    (typeof name === 'function')
      ? tape(name, runTest.bind(null, name))
      : tape(name, runTest.bind(null, fn))
  )
}
