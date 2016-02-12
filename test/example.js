'use strict';

var _assert = require('assert');

var _assert2 = _interopRequireDefault(_assert);

var _ = require('../');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _marked = [checkGithubStatus].map(regeneratorRuntime.mark);

var get = function get() {};

function checkGithubStatus() {
  var _ref, statusCode;

  return regeneratorRuntime.wrap(function checkGithubStatus$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return (0, _.callback)(get, 'http://github.com');

        case 2:
          _ref = _context.sent;
          statusCode = _ref.statusCode;

          if (!(statusCode >= 200 && statusCode < 300)) {
            _context.next = 8;
            break;
          }

          return _context.abrupt('return', 'up');

        case 8:
          return _context.abrupt('return', 'down');

        case 9:
        case 'end':
          return _context.stop();
      }
    }
  }, _marked[0], this);
}

var iterator = checkGithubStatus();

// Start the function
var firstYield = iterator.next();

// Expect the first instruction to be a request to github.com
_assert2.default.deepEqual(firstYield, {
  value: (0, _.callback)(get, 'http://github.com'),
  done: false
});

// Mock a 404 response
var secondYield = iterator.next({ statusCode: 404 });

// Make sure the function returns "down"
_assert2.default.deepEqual(secondYield, {
  value: 'down',
  done: true
});
//# sourceMappingURL=example.js.map